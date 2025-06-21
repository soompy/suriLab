'use client'

import { useState, useEffect, useRef } from 'react'
import { BLOG_CATEGORIES } from '@/shared/constants/categories'
import { AuthService } from '@/lib/auth'
import { BLOG_CONFIG } from '@/config/blog'
import LoginDialog from '@/components/LoginDialog'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
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
  Preview as PreviewIcon,
  Tag as TagIcon,
  Analytics as AnalyticsIcon,
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Image as ImageIcon,
  Lock as LockIcon,
  ExitToApp as LogoutIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  Code as CodeIcon,
  FormatQuote as QuoteIcon,
  Link as LinkIcon,
  List as ListIcon,
  InsertPhoto as PhotoIcon,
  Visibility as EyeIcon,
  EditNote as EditNoteIcon
} from '@mui/icons-material'
import MuiThemeProvider from '@/components/MuiThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Write() {
  const theme = useTheme()
  const contentRef = useRef<HTMLTextAreaElement>(null)
  
  // 인증 상태 관리
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

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

  // 인증 상태 확인
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = AuthService.isAuthenticated()
      setIsAuthenticated(authenticated)
      
      if (authenticated) {
        setCurrentUser(AuthService.getUser())
      } else {
        setShowLoginDialog(true)
      }
    }

    checkAuth()
  }, [])

  const handleInputChange = (field: string) => (e: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    if (saveStatus === 'saved') setSaveStatus('idle')
  }

  // 마크다운 에디터 도구 함수들
  const insertMarkdown = (syntax: string, placeholder: string = '') => {
    if (!contentRef.current) return
    
    const textarea = contentRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const textToInsert = selectedText || placeholder
    
    let newText = ''
    if (syntax.includes('[]')) {
      newText = syntax.replace('[]', textToInsert)
    } else {
      newText = `${syntax}${textToInsert}${syntax}`
    }
    
    const newValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end)
    
    setFormData(prev => ({
      ...prev,
      content: newValue
    }))
    
    // 포커스 복원
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + newText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const insertHeading = (level: number) => {
    const prefix = '#'.repeat(level) + ' '
    insertMarkdown(prefix, '제목')
  }

  const insertBold = () => insertMarkdown('**', '굵은 텍스트')
  const insertItalic = () => insertMarkdown('*', '기울임 텍스트')
  const insertCode = () => insertMarkdown('`', '코드')
  const insertCodeBlock = () => insertMarkdown('```\n', '코드 블록\n```')
  const insertQuote = () => insertMarkdown('> ', '인용문')
  const insertLink = () => insertMarkdown('[](url)', '링크 텍스트')
  const insertList = () => insertMarkdown('- ', '목록 항목')
  const insertImage = () => insertMarkdown('![](url)', '이미지 설명')

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

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        throw new Error('Failed to save post')
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

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        throw new Error('Failed to publish post')
      }

      const publishedPost = await response.json()
      console.log('Post published:', publishedPost)
      alert('포스트가 발행되었습니다!')
      
      // Reset form
      setFormData({
        title: '',
        summary: '',
        content: '',
        category: '',
        status: 'draft'
      })
      setTags([])
      setSaveStatus('idle')
    } catch (error) {
      console.error('Error publishing post:', error)
      alert('포스트 발행에 실패했습니다.')
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
        
        <Container maxWidth={false} sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
          {/* Header Section */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4,
            p: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}10)`,
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`
          }}>
            <Box>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
                ✍️ 새 글 작성
              </Typography>
              <Typography variant="body1" color="text.secondary">
                안녕하세요, {currentUser?.name || '관리자'}님! 새로운 이야기를 시작해보세요
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

          <Grid container spacing={4}>
            {/* Main Editor Section */}
            <Grid item xs={12} lg={8}>
              <Paper sx={{ 
                height: '100%',
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                overflow: 'hidden'
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
                      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} size="small">
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
                      gap: 1,
                      p: 2,
                      background: theme.palette.background.default,
                      borderRadius: 2
                    }}>
                      <Tooltip title="제목 (H1)">
                        <IconButton size="small" onClick={() => insertHeading(1)}>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>H1</Typography>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="소제목 (H2)">
                        <IconButton size="small" onClick={() => insertHeading(2)}>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>H2</Typography>
                        </IconButton>
                      </Tooltip>
                      <Divider orientation="vertical" flexItem />
                      <Tooltip title="굵게 (**텍스트**)">
                        <IconButton size="small" onClick={insertBold}>
                          <BoldIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="기울임 (*텍스트*)">
                        <IconButton size="small" onClick={insertItalic}>
                          <ItalicIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="인라인 코드 (`코드`)">
                        <IconButton size="small" onClick={insertCode}>
                          <CodeIcon />
                        </IconButton>
                      </Tooltip>
                      <Divider orientation="vertical" flexItem />
                      <Tooltip title="인용문 (> 텍스트)">
                        <IconButton size="small" onClick={insertQuote}>
                          <QuoteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="링크 ([텍스트](URL))">
                        <IconButton size="small" onClick={insertLink}>
                          <LinkIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="목록 (- 항목)">
                        <IconButton size="small" onClick={insertList}>
                          <ListIcon />
                        </IconButton>
                      </Tooltip>
                      <Divider orientation="vertical" flexItem />
                      <Tooltip title="이미지 업로드">
                        <IconButton
                          size="small"
                          component="label"
                          disabled={isUploading}
                        >
                          <PhotoIcon />
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleFileSelect}
                          />
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
                      '& .MuiOutlineaInput-root': {
                        borderRadius: 2,
                        fontSize: '1.2rem',
                        fontWeight: 500
                      }
                    }}
                  />

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
                        borderRadius: 2
                      }
                    }}
                  />

                  {activeTab === 0 && (
                    <TextField
                      fullWidth
                      label={isFocused === 'content' ? '' : '내용'}
                      value={formData.content}
                      onChange={handleInputChange('content')}
                      onFocus={handleFocus('content')}
                      onBlur={handleBlur}
                      placeholder={isFocused === 'content' || formData.content ? '마크다운 형식으로 내용을 작성하세요...\n\n예시:\n# 제목\n## 소제목\n\n본문 내용을 여기에 작성하세요.\n\n**굵은 글씨** *기울임* `코드`\n\n> 인용문\n\n- 목록 항목\n\n```javascript\nfunction example() {\n  console.log("코드 블록");\n}\n```' : ''}
                      variant="outlined"
                      multiline
                      rows={20}
                      required
                      inputRef={contentRef}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          fontFamily: '"JetBrains Mono", "Fira Code", Monaco, Menlo, "Ubuntu Mono", monospace',
                          fontSize: '14px',
                          lineHeight: 1.6,
                          '& textarea': {
                            resize: 'vertical'
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
                        borderRadius: 2,
                        background: theme.palette.background.paper,
                        '& h1, & h2, & h3, & h4, & h5, & h6': {
                          fontWeight: 600,
                          mb: 2,
                          mt: 3
                        },
                        '& p': { mb: 2, lineHeight: 1.7 },
                        '& code': {
                          background: theme.palette.background.default,
                          padding: '2px 6px',
                          borderRadius: 1,
                          fontFamily: 'monospace'
                        },
                        '& pre': {
                          background: theme.palette.background.default,
                          p: 2,
                          borderRadius: 2,
                          overflow: 'auto'
                        },
                        '& blockquote': {
                          borderLeft: `4px solid ${theme.palette.primary.main}`,
                          pl: 2,
                          ml: 0,
                          fontStyle: 'italic',
                          color: theme.palette.text.secondary
                        }
                      }}
                    >
                      {formData.content ? (
                        <Box dangerouslySetInnerHTML={{ 
                          __html: formData.content
                            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                            .replace(/\*(.*)\*/gim, '<em>$1</em>')
                            .replace(/`([^`]*)`/gim, '<code>$1</code>')
                            .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
                            .replace(/\n/gim, '<br>')
                        }} />
                      ) : (
                        <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          내용을 입력하면 여기에 미리보기가 표시됩니다...
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Action Buttons */}
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  background: `linear-gradient(135deg, ${theme.palette.success.main}08, ${theme.palette.primary.main}05)`
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
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none',
                        fontSize: '1rem'
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
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none',
                        fontSize: '1rem',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                      }}
                    >
                      발행하기
                    </Button>
                  </Stack>
                </Paper>

                {/* Category & Status */}
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`
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
                        sx={{ borderRadius: 2 }}
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
                        sx={{ borderRadius: 2 }}
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
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`
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
                            sx={{ borderRadius: 2 }}
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
                            borderRadius: 2
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
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  background: `linear-gradient(135deg, ${theme.palette.info.main}08, ${theme.palette.primary.main}05)`
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                    <AnalyticsIcon sx={{ mr: 1, color: 'primary.main' }} />
                    작성 통계
                  </Typography>

                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 2, 
                      background: theme.palette.background.paper,
                      borderRadius: 2,
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
                      background: theme.palette.background.paper,
                      borderRadius: 2,
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
                  
                  <Box sx={{ mt: 2, p: 2, background: theme.palette.background.paper, borderRadius: 2 }}>
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

                {/* Writing Tips */}
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  background: `linear-gradient(135deg, ${theme.palette.warning.main}08, ${theme.palette.primary.main}03)`
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    💡 작성 팁
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      제목은 구체적이고 흥미롭게 작성하세요
                    </Typography>
                    <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      요약은 독자가 글을 읽고 싶게 만드는 내용으로
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
            </Grid>
          </Grid>
        </Container>
        
        <Footer />
      </Box>
    </MuiThemeProvider>
  )
}