'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { BLOG_CATEGORIES } from '@/shared/constants/categories'
import { AuthService } from '@/lib/auth'
import { BLOG_CONFIG } from '@/config/blog'
import LoginDialog from '@/components/LoginDialog'
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stack,
  IconButton,
  Autocomplete,
  Tab,
  Tabs,
  Alert,
  Tooltip,
  Fade,
  useTheme
} from '@mui/material'
import {
  Edit as EditIcon,
  Publish as PublishIcon,
  Save as SaveIcon,
  Tag as TagIcon,
  Analytics as AnalyticsIcon,
  Lock as LockIcon,
  ExitToApp as LogoutIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  Code as CodeIcon,
  FormatQuote as QuoteIcon,
  Link as LinkIcon,
  List as ListIcon,
  FormatListNumbered as OrderedListIcon,
  InsertPhoto as PhotoIcon,
  Visibility as EyeIcon,
  EditNote as EditNoteIcon,
  AutoAwesome as AIIcon,
  Refresh as RefreshIcon,
  FormatUnderlined as UnderlineIcon,
  FormatStrikethrough as StrikethroughIcon,
  TableChart as TableIcon,
  HorizontalRule as HRIcon,
  Functions as InlineMathIcon,
  Calculate as BlockMathIcon,
  CheckBox as CheckboxIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  FormatColorText as HighlightIcon
} from '@mui/icons-material'
import MuiThemeProvider from '@/components/MuiThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

function WriteContent() {
  const theme = useTheme()
  const router = useRouter()
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  
  // 인증 상태 관리
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [currentUser, setCurrentUser] = useState<{name?: string} | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: '',
    status: 'draft'
  })
  const [tags, setTags] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState(0) // 0: 편집, 1: 미리보기
  const [isUploading, setIsUploading] = useState(false)
  const [isFocused, setIsFocused] = useState<string>('') // 현재 포커스된 필드
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [summaryStatus, setSummaryStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle')
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // 수정할 포스트 로딩
  useEffect(() => {
    const loadPost = async () => {
      if (!editId) {
        setIsEditing(false)
        return
      }

      // Loading post data
      try {
        const response = await fetch(`/api/posts/${editId}`)
        if (!response.ok) {
          throw new Error('Post not found')
        }
        
        const post = await response.json()
        setIsEditing(true)
        setFormData({
          title: post.title,
          summary: post.excerpt,
          content: post.content,
          category: post.category,
          status: post.isPublished ? 'published' : 'draft'
        })
        setTags(post.tags || [])
      } catch (error) {
        console.error('Error loading post:', error)
        alert('포스트를 불러오는데 실패했습니다.')
      } finally {
        // Post loading completed
      }
    }

    loadPost()
  }, [editId])

  // 인증 상태 확인
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = AuthService.isAuthenticated()
      setIsAuthenticated(authenticated)
      
      if (authenticated) {
        setCurrentUser(AuthService.getUser())
      } else {
        // 인증되지 않은 사용자는 메인 페이지로 리다이렉트
        router.push('/')
        return
      }
    }

    checkAuth()
  }, [router])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  // AI 요약 생성 함수
  const generateAISummary = useCallback(async (content: string, title?: string) => {
    if (!content || content.trim().length < 50) {
      return
    }

    setIsGeneratingSummary(true)
    setSummaryStatus('generating')

    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title })
      })

      if (!response.ok) {
        throw new Error('요약 생성 실패')
      }

      const result = await response.json()
      
      setFormData(prev => ({
        ...prev,
        summary: result.summary
      }))
      
      setSummaryStatus('success')
      setTimeout(() => setSummaryStatus('idle'), 2000)
      
    } catch (error) {
      console.error('AI 요약 생성 오류:', error)
      setSummaryStatus('error')
      setTimeout(() => setSummaryStatus('idle'), 3000)
    } finally {
      setIsGeneratingSummary(false)
    }
  }, [])

  // 디바운스된 AI 요약 생성
  const debouncedGenerateSummary = useCallback((content: string, title?: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    debounceRef.current = setTimeout(() => {
      generateAISummary(content, title)
    }, 2000) // 2초 후 실행
  }, [generateAISummary])

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | {target: {value: string}}) => {
    const value = e.target.value
    
    // 내용 변경시 히스토리에 추가
    if (field === 'content' && value !== formData.content) {
      addToHistory(formData.content)
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (saveStatus === 'saved') setSaveStatus('idle')

    // 내용이 변경되면 자동으로 요약 생성
    if (field === 'content' && value.trim().length >= 50) {
      debouncedGenerateSummary(value, formData.title)
    }
  }

  // 키보드 단축키 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey

    if (cmdOrCtrl && !e.shiftKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault()
          insertBold()
          break
        case 'i':
          e.preventDefault()
          insertItalic()
          break
        case 'u':
          e.preventDefault()
          insertUnderline()
          break
        case 'k':
          e.preventDefault()
          insertLink()
          break
        case 'z':
          e.preventDefault()
          undo()
          break
        case 'y':
          e.preventDefault()
          redo()
          break
        case '`':
          e.preventDefault()
          insertCode()
          break
      }
    }
    
    if (cmdOrCtrl && e.shiftKey) {
      switch (e.key.toLowerCase()) {
        case 'z':
          e.preventDefault()
          redo()
          break
        case 'k':
          e.preventDefault()
          insertCodeBlock()
          break
        case 'x':
          e.preventDefault()
          insertStrikethrough()
          break
      }
    }
  }

  // 수동 요약 생성
  const handleManualSummaryGeneration = () => {
    if (formData.content.trim().length < 50) {
      alert('요약을 생성하려면 내용을 최소 50자 이상 입력해주세요.')
      return
    }
    generateAISummary(formData.content, formData.title)
  }

  // 히스토리 관리
  const addToHistory = (content: string) => {
    if (content === history[historyIndex]) return
    
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(content)
    if (newHistory.length > 50) newHistory.shift() // 최대 50개 히스토리 유지
    
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setFormData(prev => ({
        ...prev,
        content: history[historyIndex - 1]
      }))
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setFormData(prev => ({
        ...prev,
        content: history[historyIndex + 1]
      }))
    }
  }

  // 마크다운 에디터 도구 함수들
  const insertMarkdown = (before: string, after: string = '', placeholder: string = '', newLine: boolean = false) => {
    if (!contentRef.current) return
    
    const textarea = contentRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const textToInsert = selectedText || placeholder
    
    let beforeText = before
    const afterText = after
    
    if (newLine && start > 0 && textarea.value[start - 1] !== '\n') {
      beforeText = '\n' + beforeText
    }
    
    const newText = beforeText + textToInsert + afterText
    const newValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end)
    
    // 히스토리에 추가
    addToHistory(formData.content)
    
    setFormData(prev => ({
      ...prev,
      content: newValue
    }))
    
    // 포커스 복원
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + beforeText.length + (selectedText ? selectedText.length : placeholder.length)
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const insertHeading = (level: number) => {
    const prefix = '#'.repeat(level) + ' '
    insertMarkdown(prefix, '', '제목', true)
  }

  const insertBold = () => insertMarkdown('**', '**', '굵은 텍스트')
  const insertItalic = () => insertMarkdown('*', '*', '기울임 텍스트')
  const insertUnderline = () => insertMarkdown('<u>', '</u>', '밑줄 텍스트')
  const insertStrikethrough = () => insertMarkdown('~~', '~~', '취소선 텍스트')
  const insertCode = () => insertMarkdown('`', '`', '인라인 코드')
  const insertCodeBlock = () => insertMarkdown('```\n', '\n```', '코드 블록', true)
  const insertQuote = () => insertMarkdown('> ', '', '인용문', true)
  const insertLink = () => insertMarkdown('[', '](url)', '링크 텍스트')
  const insertImage = () => insertMarkdown('![', '](image-url)', '이미지 설명')
  const insertList = () => insertMarkdown('- ', '', '목록 항목', true)
  const insertOrderedList = () => insertMarkdown('1. ', '', '번호 목록 항목', true)
  const insertCheckbox = () => insertMarkdown('- [ ] ', '', '체크박스 항목', true)
  const insertTable = () => {
    const table = `| 헤더1 | 헤더2 | 헤더3 |
|-------|-------|-------|
| 내용1 | 내용2 | 내용3 |
| 내용4 | 내용5 | 내용6 |`
    insertMarkdown(table, '', '', true)
  }
  const insertHR = () => insertMarkdown('\n---\n', '', '', false)
  const insertHighlight = () => insertMarkdown('<mark>', '</mark>', '하이라이트 텍스트')
  const insertInlineMath = () => insertMarkdown('$', '$', '수식')
  const insertBlockMath = () => insertMarkdown('$$\n', '\n$$', '수식 블록', true)

  // 포커스 관리
  const handleFocus = (field: string) => () => setIsFocused(field)
  const handleBlur = () => setIsFocused('')

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.')
      return
    }
    if (!formData.category) {
      alert('카테고리를 선택해주세요.')
      return
    }
    if (!formData.summary.trim()) {
      alert('요약을 입력해주세요.')
      return
    }
    if (tags.length === 0) {
      alert('최소 1개의 태그를 입력해주세요.')
      return
    }

    setSaveStatus('saving')
    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.summary,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        tags,
        category: formData.category,
        authorId: BLOG_CONFIG.owner.id,
        featured: false,
        isPublished: false
      }

      const url = isEditing ? `/api/posts/${editId}` : '/api/posts'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await AuthService.authenticatedFetch(url, {
        method,
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'save'} post`)
      }

      const savedPost = await response.json()
      console.log('Post saved:', savedPost)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('Error saving post:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  const handlePublish = async () => {
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.')
      return
    }
    if (!formData.category) {
      alert('카테고리를 선택해주세요.')
      return
    }
    if (!formData.summary.trim()) {
      alert('요약을 입력해주세요.')
      return
    }
    if (tags.length === 0) {
      alert('최소 1개의 태그를 입력해주세요.')
      return
    }

    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.summary,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        tags,
        category: formData.category,
        authorId: BLOG_CONFIG.owner.id,
        featured: false,
        isPublished: true
      }

      const url = isEditing ? `/api/posts/${editId}` : '/api/posts'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await AuthService.authenticatedFetch(url, {
        method,
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'publish'} post`)
      }

      const publishedPost = await response.json()
      console.log('Post published:', publishedPost)
      alert(`포스트가 ${isEditing ? '수정' : '발행'}되었습니다!`)
      
      if (!isEditing) {
        // Reset form only for new posts
        setFormData({
          title: '',
          summary: '',
          content: '',
          category: '',
          status: 'draft'
        })
        setTags([])
        
        // 새 포스트 발행 후 메인페이지로 리다이렉트
        setTimeout(() => {
          router.push('/')
        }, 1000)
      } else {
        // 기존 포스트 수정 후 해당 포스트 페이지로 리다이렉트
        setTimeout(() => {
          router.push(`/posts/${publishedPost.slug || editId}`)
        }, 1000)
      }
      setSaveStatus('idle')
    } catch (error) {
      console.error('Error publishing post:', error)
      alert(`포스트 ${isEditing ? '수정' : '발행'}에 실패했습니다.`)
    }
  }

  const handleImageUpload = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      
      // 마크다운 이미지 문법으로 텍스트에 삽입
      const imageMarkdown = `![${file.name}](${result.url})\n\n`
      if (contentRef.current) {
        const textarea = contentRef.current
        const start = textarea.selectionStart
        const newValue = textarea.value.substring(0, start) + imageMarkdown + textarea.value.substring(start)
        
        setFormData(prev => ({
          ...prev,
          content: newValue
        }))
        
        // 포커스 복원
        setTimeout(() => {
          textarea.focus()
          textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length)
        }, 0)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('이미지 업로드에 실패했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  // 로그인 성공 핸들러
  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    setCurrentUser(AuthService.getUser())
    setShowLoginDialog(false)
  }

  // 로그아웃 핸들러
  const handleLogout = () => {
    AuthService.logout()
    setIsAuthenticated(false)
    setCurrentUser(null)
    setShowLoginDialog(true)
  }

  const tagSuggestions = [
    'React', 'JavaScript', 'TypeScript', 'Next.js', 'Vue.js', 
    'Node.js', 'Python', 'CSS', 'HTML', 'Web Development',
    'Frontend', 'Backend', 'Tutorial', 'Guide', 'Tips'
  ]

  const categories = BLOG_CATEGORIES

  const wordCount = formData.content.split(' ').length
  const charCount = formData.content.length
  const readingTime = Math.ceil(wordCount / 200)

  // 인증되지 않은 경우 로그인 다이얼로그만 표시
  if (!isAuthenticated) {
    return (
      <MuiThemeProvider>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Header />
          <Container maxWidth="md" sx={{ py: 8 }}>
            <Box sx={{ textAlign: 'center' }}>
              <LockIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                로그인이 필요합니다
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                블로그 글 작성은 관리자만 가능합니다.
              </Typography>
              <Button
                variant="contained"
                onClick={() => setShowLoginDialog(true)}
                startIcon={<LockIcon />}
              >
                관리자 로그인
              </Button>
            </Box>
          </Container>
          <Footer />
          
          <LoginDialog
            open={showLoginDialog}
            onClose={() => setShowLoginDialog(false)}
            onSuccess={handleLoginSuccess}
          />
        </Box>
      </MuiThemeProvider>
    )
  }

  return (
    <MuiThemeProvider>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header />
        
        <Container maxWidth={false} sx={{ 
          maxWidth: '1400px', 
          mx: 'auto', 
          px: { xs: 2, md: 4 }, 
          py: 4,
          '& @keyframes spin': {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' }
          }
        }}>
          {/* Header Section */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4,
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 'none'
          }}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1, fontSize: '1.5rem' }}>
                {isEditing ? '✏️ 글 수정' : '✍️ 새 글 작성'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                안녕하세요, {currentUser?.name || '관리자'}님! {isEditing ? '글을 수정해보세요' : '새로운 이야기를 시작해보세요'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {/* 저장 상태 표시 */}
              <Fade in={saveStatus !== 'idle'}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {saveStatus === 'saving' && (
                    <Alert severity="info" sx={{ py: 0.5 }}>저장 중...</Alert>
                  )}
                  {saveStatus === 'saved' && (
                    <Alert severity="success" sx={{ py: 0.5 }}>저장 완료!</Alert>
                  )}
                  {saveStatus === 'error' && (
                    <Alert severity="error" sx={{ py: 0.5 }}>저장 실패</Alert>
                  )}
                </Box>
              </Fade>
              <Button
                variant="outlined"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                size="small"
                sx={{ borderRadius: 2 }}
              >
                로그아웃
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
            {/* Main Editor Section */}
            <Box>
              <Paper sx={{ 
                height: '100%',
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
              }}>
                {/* Editor Header */}
                <Box sx={{ 
                  p: 3, 
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  background: theme.palette.background.paper
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                      <EditNoteIcon sx={{ mr: 1, color: 'primary.main' }} />
                      에디터
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
                        <Tab label="편집" icon={<EditIcon />} iconPosition="start" />
                        <Tab label="미리보기" icon={<EyeIcon />} iconPosition="start" />
                      </Tabs>
                    </Box>
                  </Box>

                  {/* Markdown Toolbar */}
                  {activeTab === 0 && (
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 0.5,
                      p: 2,
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'grey.50',
                      borderRadius: 1.5,
                      border: `1px solid ${theme.palette.divider}`
                    }}>
                      {/* 실행 취소/다시 실행 */}
                      <Tooltip title="실행 취소 (Ctrl+Z)">
                        <IconButton size="small" onClick={undo} disabled={historyIndex <= 0} sx={{ p: 0.75 }}>
                          <UndoIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="다시 실행 (Ctrl+Y)">
                        <IconButton size="small" onClick={redo} disabled={historyIndex >= history.length - 1} sx={{ p: 0.75 }}>
                          <RedoIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Divider orientation="vertical" flexItem />
                      
                      {/* 제목 */}
                      <Tooltip title="제목 1 (H1)">
                        <IconButton size="small" onClick={() => insertHeading(1)} sx={{ p: 0.75 }}>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '12px' }}>H1</Typography>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="제목 2 (H2)">
                        <IconButton size="small" onClick={() => insertHeading(2)} sx={{ p: 0.75 }}>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '11px' }}>H2</Typography>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="제목 3 (H3)">
                        <IconButton size="small" onClick={() => insertHeading(3)} sx={{ p: 0.75 }}>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '10px' }}>H3</Typography>
                        </IconButton>
                      </Tooltip>
                      <Divider orientation="vertical" flexItem />
                      
                      {/* 텍스트 스타일 */}
                      <Tooltip title="굵게 (Ctrl+B)">
                        <IconButton size="small" onClick={insertBold} sx={{ p: 0.75 }}>
                          <BoldIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="기울임 (Ctrl+I)">
                        <IconButton size="small" onClick={insertItalic} sx={{ p: 0.75 }}>
                          <ItalicIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="밑줄 (Ctrl+U)">
                        <IconButton size="small" onClick={insertUnderline} sx={{ p: 0.75 }}>
                          <UnderlineIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="취소선 (Ctrl+Shift+X)">
                        <IconButton size="small" onClick={insertStrikethrough} sx={{ p: 0.75 }}>
                          <StrikethroughIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="하이라이트">
                        <IconButton size="small" onClick={insertHighlight} sx={{ p: 0.75 }}>
                          <HighlightIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Divider orientation="vertical" flexItem />
                      
                      {/* 코드 */}
                      <Tooltip title="인라인 코드 (Ctrl+`)">
                        <IconButton size="small" onClick={insertCode} sx={{ p: 0.75 }}>
                          <CodeIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="코드 블록 (Ctrl+Shift+K)">
                        <IconButton size="small" onClick={insertCodeBlock} sx={{ p: 0.75 }}>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '10px' }}>{'{}'}</Typography>
                        </IconButton>
                      </Tooltip>
                      <Divider orientation="vertical" flexItem />
                      
                      {/* 링크 & 미디어 */}
                      <Tooltip title="링크 (Ctrl+K)">
                        <IconButton size="small" onClick={insertLink} sx={{ p: 0.75 }}>
                          <LinkIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="이미지">
                        <IconButton size="small" onClick={insertImage} sx={{ p: 0.75 }}>
                          <PhotoIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="이미지 업로드">
                        <IconButton
                          size="small"
                          component="label"
                          disabled={isUploading}
                          sx={{ p: 0.75 }}
                        >
                          <Typography sx={{ fontWeight: 'bold', fontSize: '10px' }}>📷</Typography>
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleFileSelect}
                          />
                        </IconButton>
                      </Tooltip>
                      <Divider orientation="vertical" flexItem />
                      
                      {/* 목록 */}
                      <Tooltip title="순서없는 목록">
                        <IconButton size="small" onClick={insertList} sx={{ p: 0.75 }}>
                          <ListIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="순서있는 목록">
                        <IconButton size="small" onClick={insertOrderedList} sx={{ p: 0.75 }}>
                          <OrderedListIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="체크박스 목록">
                        <IconButton size="small" onClick={insertCheckbox} sx={{ p: 0.75 }}>
                          <CheckboxIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Divider orientation="vertical" flexItem />
                      
                      {/* 기타 */}
                      <Tooltip title="인용문">
                        <IconButton size="small" onClick={insertQuote} sx={{ p: 0.75 }}>
                          <QuoteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="표">
                        <IconButton size="small" onClick={insertTable} sx={{ p: 0.75 }}>
                          <TableIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="구분선">
                        <IconButton size="small" onClick={insertHR} sx={{ p: 0.75 }}>
                          <HRIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Divider orientation="vertical" flexItem />
                      
                      {/* 수식 */}
                      <Tooltip title="인라인 수식">
                        <IconButton size="small" onClick={insertInlineMath} sx={{ p: 0.75 }}>
                          <InlineMathIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="수식 블록">
                        <IconButton size="small" onClick={insertBlockMath} sx={{ p: 0.75 }}>
                          <BlockMathIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>

                {/* Form Fields */}
                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label={isFocused === 'title' ? '' : '제목'}
                    value={formData.title}
                    onChange={handleInputChange('title')}
                    onFocus={handleFocus('title')}
                    onBlur={handleBlur}
                    placeholder={isFocused === 'title' || formData.title ? '포스트 제목을 입력하세요' : ''}
                    variant="outlined"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '1.2rem',
                        fontWeight: 500,
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        '& input': {
                          color: 'inherit'
                        },
                        '&:hover': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main'
                          }
                        }
                      }
                    }}
                  />

                  <Box sx={{ position: 'relative' }}>
                    <TextField
                      fullWidth
                      label={isFocused === 'summary' ? '' : '요약'}
                      value={formData.summary}
                      onChange={handleInputChange('summary')}
                      onFocus={handleFocus('summary')}
                      onBlur={handleBlur}
                      placeholder={isFocused === 'summary' || formData.summary ? '포스트의 간단한 요약을 입력하세요 (150자 이내 권장)' : ''}
                      variant="outlined"
                      multiline
                      rows={3}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          bgcolor: 'background.paper',
                          color: 'text.primary',
                          '& textarea': {
                            color: 'inherit'
                          },
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main'
                            }
                          }
                        }
                      }}
                    />
                    
                    {/* AI 요약 상태 표시 및 버튼 */}
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      display: 'flex', 
                      gap: 1, 
                      alignItems: 'center' 
                    }}>
                      {summaryStatus === 'generating' && (
                        <Chip 
                          icon={<AIIcon />} 
                          label="AI 생성 중..." 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      )}
                      {summaryStatus === 'success' && (
                        <Chip 
                          icon={<AIIcon />} 
                          label="AI 생성 완료" 
                          size="small" 
                          color="success" 
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      )}
                      {summaryStatus === 'error' && (
                        <Chip 
                          icon={<AIIcon />} 
                          label="생성 실패" 
                          size="small" 
                          color="error" 
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      )}
                      
                      <Tooltip title="AI로 요약 생성">
                        <IconButton
                          size="small"
                          onClick={handleManualSummaryGeneration}
                          disabled={isGeneratingSummary || formData.content.trim().length < 50}
                          sx={{ 
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': {
                              bgcolor: 'primary.50',
                              borderColor: 'primary.main'
                            }
                          }}
                        >
                          {isGeneratingSummary ? <RefreshIcon sx={{ animation: 'spin 1s linear infinite' }} /> : <AIIcon />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    {/* AI 요약 안내 메시지 */}
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AIIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                      <Typography variant="caption" color="text.secondary">
                        {formData.content.trim().length < 50 
                          ? '내용을 50자 이상 입력하면 AI가 자동으로 요약을 생성합니다'
                          : isGeneratingSummary 
                            ? 'AI가 내용을 분석하여 요약을 생성 중입니다...'
                            : '내용이 변경되면 2초 후 자동으로 요약이 업데이트됩니다'
                        }
                      </Typography>
                    </Box>
                  </Box>

                  {activeTab === 0 && (
                    <TextField
                      fullWidth
                      label={isFocused === 'content' ? '' : '내용'}
                      value={formData.content}
                      onChange={handleInputChange('content')}
                      onFocus={handleFocus('content')}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      placeholder={isFocused === 'content' || formData.content ? '마크다운 형식으로 내용을 작성하세요...\n\n예시:\n# 제목\n## 소제목\n\n본문 내용을 여기에 작성하세요.\n\n**굵은 글씨** *기울임* `코드`\n\n> 인용문\n\n- 목록 항목\n\n```javascript\nfunction example() {\n  console.log("코드 블록");\n}\n```' : ''}
                      variant="outlined"
                      multiline
                      rows={20}
                      required
                      inputRef={contentRef}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontFamily: '"JetBrains Mono", "Fira Code", Monaco, Menlo, "Ubuntu Mono", monospace',
                          fontSize: '14px',
                          lineHeight: 1.6,
                          bgcolor: 'background.paper',
                          color: 'text.primary',
                          '& textarea': {
                            resize: 'vertical',
                            color: 'inherit'
                          },
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main'
                            }
                          }
                        }
                      }}
                    />
                  )}

                  {activeTab === 1 && (
                    <Box
                      sx={{
                        minHeight: '500px',
                        p: 3,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1.5,
                        bgcolor: 'background.paper',
                        '& h1, & h2, & h3, & h4, & h5, & h6': {
                          fontWeight: 600,
                          mb: 2,
                          mt: 3,
                          color: theme.palette.text.primary
                        },
                        '& p': { 
                          mb: 2, 
                          lineHeight: 1.7,
                          color: theme.palette.text.primary
                        },
                        '& code': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontFamily: '"JetBrains Mono", "Fira Code", Monaco, Menlo, "Ubuntu Mono", monospace',
                          fontSize: '0.9em',
                          color: theme.palette.text.primary
                        },
                        '& pre': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                          padding: '16px',
                          borderRadius: '8px',
                          overflow: 'auto',
                          fontFamily: '"JetBrains Mono", "Fira Code", Monaco, Menlo, "Ubuntu Mono", monospace',
                          fontSize: '0.9em',
                          border: `1px solid ${theme.palette.divider}`,
                          '& code': {
                            backgroundColor: 'transparent',
                            padding: 0,
                            borderRadius: 0
                          }
                        },
                        '& blockquote': {
                          borderLeft: `4px solid ${theme.palette.primary.main}`,
                          paddingLeft: '16px',
                          margin: '16px 0',
                          fontStyle: 'italic',
                          color: theme.palette.text.secondary,
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                          padding: '12px 16px',
                          borderRadius: '4px'
                        },
                        '& ul, & ol': {
                          paddingLeft: '24px',
                          marginBottom: '16px'
                        },
                        '& li': {
                          marginBottom: '8px',
                          lineHeight: 1.6
                        },
                        '& table': {
                          width: '100%',
                          borderCollapse: 'collapse',
                          marginBottom: '16px',
                          border: `1px solid ${theme.palette.divider}`
                        },
                        '& th, & td': {
                          padding: '12px',
                          textAlign: 'left',
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          borderRight: `1px solid ${theme.palette.divider}`
                        },
                        '& th': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                          fontWeight: 600
                        },
                        '& img': {
                          maxWidth: '100%',
                          height: 'auto',
                          borderRadius: '8px',
                          marginBottom: '16px'
                        },
                        '& a': {
                          color: theme.palette.primary.main,
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        },
                        '& hr': {
                          border: 'none',
                          borderTop: `2px solid ${theme.palette.divider}`,
                          margin: '24px 0'
                        },
                        '& mark': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 193, 7, 0.3)' : theme.palette.warning.light,
                          padding: '2px 4px',
                          borderRadius: '2px'
                        },
                        '& input[type="checkbox"]': {
                          marginRight: '8px'
                        }
                      }}
                    >
                      {formData.content ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            // 커스텀 컴포넌트로 체크박스 지원
                            input: ({ type, checked, ...props }: any) => {
                              if (type === 'checkbox') {
                                return <input type="checkbox" checked={checked} readOnly style={{ marginRight: '8px' }} {...props} />
                              }
                              return <input type={type} {...props} />
                            },
                            // 코드 블록 개선
                            code: ({ className, children, ...props }: any) => {
                              return (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              )
                            },
                            pre: ({ className, children, ...props }: any) => {
                              return (
                                <pre className={className} {...props}>
                                  {children}
                                </pre>
                              )
                            }
                          }}
                        >
                          {formData.content}
                        </ReactMarkdown>
                      ) : (
                        <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          내용을 입력하면 여기에 미리보기가 표시됩니다...
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              </Paper>
            </Box>

            {/* Sidebar */}
            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Action Buttons */}
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: 'background.paper',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                    <PublishIcon sx={{ mr: 1, color: 'primary.main' }} />
                    발행 관리
                  </Typography>

                  <Stack spacing={2}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      disabled={saveStatus === 'saving'}
                      sx={{ 
                        borderRadius: 1.5,
                        py: 1.5,
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'primary.50'
                        }
                      }}
                    >
                      {saveStatus === 'saving' ? '저장 중...' : '임시 저장'}
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<PublishIcon />}
                      onClick={handlePublish}
                      sx={{ 
                        borderRadius: 1.5,
                        py: 1.5,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }
                      }}
                    >
                      {isEditing ? '수정 완료' : '발행하기'}
                    </Button>
                  </Stack>
                </Paper>

                {/* Category & Status */}
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: 'background.paper',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    📂 분류 설정
                  </Typography>

                  <Stack spacing={3}>
                    <FormControl fullWidth required>
                      <InputLabel>카테고리 *</InputLabel>
                      <Select
                        value={formData.category}
                        onChange={handleInputChange('category')}
                        label="카테고리 *"
                        required
                        sx={{ 
                          borderRadius: 1.5,
                          color: 'text.primary',
                          '& .MuiOutlinedInput-root': {
                            '&:hover': {
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main'
                              }
                            }
                          }
                        }}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>상태</InputLabel>
                      <Select
                        value={formData.status}
                        onChange={handleInputChange('status')}
                        label="상태"
                        sx={{ 
                          borderRadius: 1.5,
                          color: 'text.primary',
                          '& .MuiOutlinedInput-root': {
                            '&:hover': {
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main'
                              }
                            }
                          }
                        }}
                      >
                        <MenuItem value="draft">📝 초안</MenuItem>
                        <MenuItem value="published">🌍 발행됨</MenuItem>
                        <MenuItem value="private">🔒 비공개</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Paper>

                {/* Tags */}
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: 'background.paper',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                    <TagIcon sx={{ mr: 1, color: 'primary.main' }} />
                    태그
                  </Typography>

                  <Autocomplete
                    multiple
                    options={tagSuggestions}
                    value={tags}
                    onChange={(_, newValue) => setTags(newValue)}
                    freeSolo
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        const { key, ...tagProps } = getTagProps({ index })
                        return (
                          <Chip
                            variant="outlined"
                            label={option}
                            {...tagProps}
                            key={key}
                            sx={{ 
                              borderRadius: 1.5,
                              '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: 'primary.50'
                              }
                            }}
                          />
                        )
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={tags.length === 0 ? "태그를 추가하세요 (Enter로 구분)" : ""}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            color: 'text.primary',
                            '& input': {
                              color: 'inherit'
                            },
                            '&:hover': {
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main'
                              }
                            }
                          }
                        }}
                      />
                    )}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    💡 태그는 검색과 분류에 도움이 됩니다
                  </Typography>
                </Paper>

                {/* Statistics */}
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: 'background.paper',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                    <AnalyticsIcon sx={{ mr: 1, color: 'primary.main' }} />
                    작성 통계
                  </Typography>

                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 2, 
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'grey.50',
                      borderRadius: 1.5,
                      border: `1px solid ${theme.palette.divider}`
                    }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {wordCount.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        단어
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 2, 
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'grey.50',
                      borderRadius: 1.5,
                      border: `1px solid ${theme.palette.divider}`
                    }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                        {readingTime}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        분 읽기
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 2, p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'grey.50', borderRadius: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        문자 수
                      </Typography>
                      <Typography variant="body2" fontWeight="600">
                        {charCount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                {/* AI Assistant Panel */}
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: 'background.paper',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                    <AIIcon sx={{ mr: 1, color: 'primary.main' }} />
                    AI 어시스턴트
                  </Typography>

                  <Stack spacing={2}>
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: summaryStatus === 'generating' 
                        ? (theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.1)' : 'primary.50')
                        : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'grey.50'),
                      borderRadius: 1.5,
                      border: `1px solid ${summaryStatus === 'generating' ? theme.palette.primary.main : theme.palette.divider}`
                    }}>
                      <Typography variant="body2" fontWeight="600" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                        {summaryStatus === 'generating' && <RefreshIcon sx={{ fontSize: 16, mr: 1, animation: 'spin 1s linear infinite' }} />}
                        자동 요약 상태
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {summaryStatus === 'idle' && '대기 중'}
                        {summaryStatus === 'generating' && 'AI가 요약을 생성하고 있습니다...'}
                        {summaryStatus === 'success' && '✅ 요약이 성공적으로 생성되었습니다'}
                        {summaryStatus === 'error' && '❌ 요약 생성에 실패했습니다'}
                      </Typography>
                    </Box>

                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<AIIcon />}
                      onClick={handleManualSummaryGeneration}
                      disabled={isGeneratingSummary || formData.content.trim().length < 50}
                      sx={{ 
                        borderRadius: 1.5,
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'primary.50'
                        }
                      }}
                    >
                      {isGeneratingSummary ? '생성 중...' : '수동으로 요약 생성'}
                    </Button>

                    <Box sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(3, 169, 244, 0.1)' : 'info.50', borderRadius: 1.5, border: `1px solid ${theme.palette.info.main}` }}>
                      <Typography variant="body2" color="info.main" sx={{ fontWeight: 600, mb: 1 }}>
                        💡 AI 요약 팁
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        • 내용을 50자 이상 작성하면 자동 생성됩니다
                        <br />
                        • 2초 지연 후 자동으로 업데이트됩니다
                        <br />
                        • 수동 생성 버튼으로 즉시 생성 가능합니다
                        <br />
                        • 생성된 요약은 언제든 수정할 수 있습니다
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

                {/* Writing Tips */}
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: 'background.paper',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    💡 작성 팁
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      제목은 구체적이고 흥미롭게 작성하세요
                    </Typography>
                    <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      AI 요약을 활용해 매력적인 서론을 만드세요
                    </Typography>
                    <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      마크다운 툴바를 활용해 서식을 추가하세요
                    </Typography>
                    <Typography component="li" variant="body2" color="text.secondary">
                      미리보기로 최종 결과를 확인하세요
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Box>
        </Container>
        
        <Footer />
      </Box>
    </MuiThemeProvider>
  )
}

export default function Write() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        로딩 중...
      </div>
    }>
      <WriteContent />
    </Suspense>
  )
}