'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
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
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import {
  Edit as EditIcon,
  Publish as PublishIcon,
  Save as SaveIcon,
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
  FormatColorText as HighlightIcon,
  Drafts as DraftIcon,
  FolderOpen as FolderOpenIcon,
  AccessTime as TimeIcon,
  Delete as DeleteIcon
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
  const [drafts, setDrafts] = useState<any[]>([])
  const [showDrafts, setShowDrafts] = useState(false)
  const [isDraftLoading, setIsDraftLoading] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showRecoverDialog, setShowRecoverDialog] = useState(false)
  const [originalPostStatus, setOriginalPostStatus] = useState<'draft' | 'published' | null>(null)
  const [isSticky, setIsSticky] = useState(true)
  const stickyTriggerRef = useRef<HTMLDivElement | null>(null)

  // Intersection Observer for sticky control
  useEffect(() => {
    if (!stickyTriggerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 트리거 요소가 보이지 않으면 sticky 표시
        setIsSticky(!entry.isIntersecting)
      },
      {
        threshold: 0,
        rootMargin: '0px 0px -100px 0px' // 하단에서 100px 여백
      }
    )

    observer.observe(stickyTriggerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  // 수정할 포스트 로딩
  useEffect(() => {
    const loadPost = async () => {
      if (!editId) {
        setIsEditing(false)
        setOriginalPostStatus(null) // 새 글의 경우 상태 초기화
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
        const status = post.isPublished ? 'published' : 'draft'
        setFormData({
          title: post.title,
          summary: post.excerpt,
          content: post.content,
          category: post.category,
          status: status
        })
        setTags(post.tags || [])
        setOriginalPostStatus(status) // 원래 발행 상태 기록
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
      }
      // 인증되지 않은 사용자는 로그인 화면을 보여주되, 리다이렉트하지 않음
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

  // Draft 목록 가져오기
  const loadDrafts = useCallback(async () => {
    if (!isAuthenticated) return
    
    setIsDraftLoading(true)
    try {
      const response = await fetch('/api/posts?isPublished=false&limit=10&sortField=updatedAt&sortOrder=desc', {
        headers: AuthService.getAuthHeaders()
      })
      
      if (response.ok) {
        const data = await response.json()
        setDrafts(data.posts || [])
      }
    } catch (error) {
      console.error('Error loading drafts:', error)
    } finally {
      setIsDraftLoading(false)
    }
  }, [isAuthenticated])

  // 인증 상태 변경시 draft 목록 로드
  useEffect(() => {
    if (isAuthenticated) {
      loadDrafts()
    }
  }, [isAuthenticated, loadDrafts])

  // Draft 선택 시 편집 모드로 전환
  const handleDraftSelect = useCallback((draft: any) => {
    const status = draft.isPublished ? 'published' : 'draft'
    setFormData({
      title: draft.title,
      summary: draft.excerpt || '',
      content: draft.content,
      category: draft.category,
      status: status
    })
    setTags(draft.tags || [])
    setShowDrafts(false)
    setOriginalPostStatus(status) // 선택된 draft의 원래 상태 기록
    
    // URL에 edit 파라미터 추가
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('edit', draft.id)
    window.history.pushState({}, '', newUrl.toString())
  }, [])

  // Draft 삭제
  const handleDraftDelete = useCallback(async (draftId: string) => {
    if (!confirm('이 임시저장 글을 삭제하시겠습니까?')) return
    
    try {
      console.log(`[DRAFT] Attempting to delete draft: ${draftId}`)
      const response = await AuthService.authenticatedFetch(`/api/posts/${draftId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        console.log(`[DRAFT] Draft deleted successfully: ${draftId}`)
        loadDrafts() // 목록 새로고침
        alert('임시저장 글이 삭제되었습니다.')
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error(`[DRAFT] Delete failed:`, { status: response.status, error: errorData })
        
        if (response.status === 401) {
          AuthService.logout()
          setIsAuthenticated(false)
          setCurrentUser(null)
          setShowLoginDialog(true)
          alert('세션이 만료되었습니다. 다시 로그인해주세요.')
          return
        }
        
        const errorMessage = errorData.details || errorData.error || '알 수 없는 오류'
        alert(`삭제에 실패했습니다: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Error deleting draft:', error)
      alert(`삭제 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    }
  }, [loadDrafts])

  // 자동 저장 함수
  const autoSave = useCallback(async () => {
    if (!isAuthenticated || !formData.title.trim() && !formData.content.trim()) {
      return
    }

    setAutoSaveStatus('saving')
    
    try {
      // 자동 저장 시 원래 발행 상태 보존 (새 글의 경우 draft로)
      const shouldBePublished = originalPostStatus === 'published'
      
      // 요약이 비어있는 경우 컨텐츠의 첫 부분을 사용
      const excerpt = formData.summary.trim() || 
        (formData.content ? formData.content.substring(0, 200).replace(/\n/g, ' ').trim() + 
        (formData.content.length > 200 ? '...' : '') : '자동 생성된 요약')
      
      const postData = {
        title: formData.title || '제목 없음',
        content: formData.content,
        excerpt: excerpt,
        category: formData.category,
        tags: tags,
        isPublished: shouldBePublished,
        isFeatured: false
      }

      let response
      if (editId) {
        // 기존 포스트 업데이트
        response = await fetch(`/api/posts/${editId}`, {
          method: 'PUT',
          headers: {
            ...AuthService.getAuthHeaders(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        })
      } else {
        // 새 포스트 생성
        response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            ...AuthService.getAuthHeaders(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        })
        
        // 새로 생성된 경우 edit ID 설정
        if (response.ok) {
          const newPost = await response.json()
          const newUrl = new URL(window.location.href)
          newUrl.searchParams.set('edit', newPost.id)
          window.history.replaceState({}, '', newUrl.toString())
          // 새로 생성된 포스트의 발행 상태 기록
          setOriginalPostStatus(shouldBePublished ? 'published' : 'draft')
        }
      }

      if (response.ok) {
        setAutoSaveStatus('saved')
        setLastSavedAt(new Date())
        loadDrafts() // draft 목록 새로고침
      } else {
        setAutoSaveStatus('error')
      }
    } catch (error) {
      console.error('Auto-save error:', error)
      setAutoSaveStatus('error')
    }
  }, [isAuthenticated, formData, tags, editId, loadDrafts, originalPostStatus])

  // 폼 데이터 변경 시 자동 저장 예약
  useEffect(() => {
    if (!isAuthenticated) return

    // 기존 타이머 제거
    if (autoSaveRef.current) {
      clearTimeout(autoSaveRef.current)
    }

    // 내용이 있는 경우에만 자동 저장 예약 (30초 후)
    if (formData.title.trim() || formData.content.trim()) {
      autoSaveRef.current = setTimeout(() => {
        autoSave()
      }, 30000) // 30초
    }

    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current)
      }
    }
  }, [formData, tags, isAuthenticated, autoSave])

  // Cleanup
  useEffect(() => {
    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current)
      }
    }
  }, [])

  // localStorage 키
  const STORAGE_KEY = 'blog_draft_backup'

  // localStorage에 폼 데이터 저장
  const saveToLocalStorage = useCallback(() => {
    if (typeof window === 'undefined') return
    
    const backupData = {
      formData,
      tags,
      timestamp: Date.now(),
      editId,
      originalPostStatus
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(backupData))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }, [formData, tags, editId, originalPostStatus])

  // localStorage에서 폼 데이터 복원
  const loadFromLocalStorage = useCallback(() => {
    if (typeof window === 'undefined') return null
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const backupData = JSON.parse(stored)
        // 24시간 이내의 데이터만 유효
        const isValid = Date.now() - backupData.timestamp < 24 * 60 * 60 * 1000
        if (isValid) {
          return backupData
        } else {
          // 오래된 데이터 삭제
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
      localStorage.removeItem(STORAGE_KEY)
    }
    return null
  }, [])

  // localStorage 데이터 삭제
  const clearLocalStorage = useCallback(() => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // 페이지 로드 시 localStorage에서 데이터 복원 확인
  useEffect(() => {
    const backupData = loadFromLocalStorage()
    if (backupData && !editId) {
      // 현재 작성 중인 내용과 다른 경우에만 복원 대화상자 표시
      const hasCurrentContent = formData.title.trim() || formData.content.trim()
      const hasBackupContent = backupData.formData.title.trim() || backupData.formData.content.trim()
      
      if (hasBackupContent && !hasCurrentContent) {
        setShowRecoverDialog(true)
      }
    }
  }, [])

  // 폼 데이터 변경 시 localStorage에 저장 및 변경 사항 추적
  useEffect(() => {
    saveToLocalStorage()
    setHasUnsavedChanges(true)
  }, [formData, tags, saveToLocalStorage])

  // 자동 저장 성공 시 변경 사항 초기화
  useEffect(() => {
    if (autoSaveStatus === 'saved') {
      setHasUnsavedChanges(false)
    }
  }, [autoSaveStatus])

  // 페이지 떠나기 전 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = '저장되지 않은 변경사항이 있습니다. 정말 페이지를 떠나시겠습니까?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  // localStorage 데이터 복원
  const recoverFromLocalStorage = useCallback(() => {
    const backupData = loadFromLocalStorage()
    if (backupData) {
      setFormData(backupData.formData)
      setTags(backupData.tags)
      setOriginalPostStatus(backupData.originalPostStatus || null)
      setShowRecoverDialog(false)
      
      // 복원된 데이터의 editId가 있는 경우 URL 업데이트
      if (backupData.editId) {
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.set('edit', backupData.editId)
        window.history.replaceState({}, '', newUrl.toString())
      }
    }
  }, [loadFromLocalStorage])

  // 복원 대화상자 무시
  const dismissRecoverDialog = useCallback(() => {
    setShowRecoverDialog(false)
    clearLocalStorage()
  }, [clearLocalStorage])

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
  const insertCodePen = () => {
    // 사용자에게 CodePen URL을 입력받습니다
    const codePenUrl = prompt('CodePen URL을 입력해주세요 (예: https://codepen.io/username/pen/abc123):')
    
    if (!codePenUrl) return
    
    // CodePen URL에서 username과 pen-id 추출
    const match = codePenUrl.match(/codepen\.io\/([^\/]+)\/pen\/([^\/\?]+)/)
    
    if (!match) {
      alert('올바른 CodePen URL을 입력해주세요.')
      return
    }
    
    const [, username, penId] = match
    const embedUrl = `https://codepen.io/${username}/embed/${penId}?height=400&theme-id=dark&default-tab=html,result`
    
    const codePenEmbed = `<iframe height="400" style="width: 100%;" scrolling="no" title="CodePen - ${penId}" src="${embedUrl}" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="${codePenUrl}">${penId}</a> by ${username} on <a href="https://codepen.io">CodePen</a>.
</iframe>`
    
    insertMarkdown(codePenEmbed, '', '', true)
  }

  // 포커스 관리
  const handleFocus = (field: string) => () => setIsFocused(field)
  const handleBlur = () => setIsFocused('')

  // 개선된 slug 생성 함수
  const generateSlug = useCallback((title: string): string => {
    if (!title.trim()) {
      return `post-${Date.now()}`
    }
    
    let slug = title
      .toLowerCase()
      .normalize('NFD') // Unicode 정규화
      .replace(/[\u0300-\u036f]/g, '') // 발음 구별 기호 제거
      .replace(/[^\w\s가-힣-]/g, '') // 한글, 영숫자, 공백, 하이픈만 유지
      .replace(/\s+/g, '-') // 공백을 하이픈으로
      .replace(/-+/g, '-') // 연속 하이픈을 단일 하이픈으로
      .replace(/^-|-$/g, '') // 앞뒤 하이픈 제거
      .trim()
    
    // 결과가 비어있거나 너무 짧은 경우 fallback
    if (!slug || slug.length < 3) {
      slug = `post-${Date.now()}`
    }
    
    // 너무 긴 경우 잘라내기 (최대 100자)
    if (slug.length > 100) {
      slug = slug.substring(0, 100).replace(/-$/, '')
    }
    
    return slug
  }, [])

  const handleSave = async () => {
    console.log('[WRITE] handleSave started')
    console.log('[WRITE] Auth state:', AuthService.debugAuthState())
    
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
      // 수동 저장 시 formData.status에 따라 발행 상태 결정
      const isPublished = formData.status === 'published'
      
      // 요약이 비어있는 경우 컨텐츠의 첫 부분을 사용
      const excerpt = formData.summary.trim() || 
        formData.content.substring(0, 200).replace(/\n/g, ' ').trim() + 
        (formData.content.length > 200 ? '...' : '')
      
      const postData = {
        title: formData.title,
        content: formData.content,
        excerpt: excerpt,
        slug: generateSlug(formData.title),
        tags,
        category: formData.category,
        authorId: BLOG_CONFIG.owner.id,
        featured: false,
        isPublished: isPublished
      }

      const url = isEditing ? `/api/posts/${editId}` : '/api/posts'
      const method = isEditing ? 'PUT' : 'POST'

      console.log(`[WRITE] Sending ${method} request to ${url}`)
      console.log('[WRITE] Post data:', {
        title: postData.title,
        category: postData.category,
        isPublished: postData.isPublished,
        tagsCount: postData.tags?.length || 0
      })
      
      const response = await AuthService.authenticatedFetch(url, {
        method,
        body: JSON.stringify(postData),
      })

      console.log(`[WRITE] Response status: ${response.status}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('[WRITE] Request failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        })
        
        // 인증 오류인 경우 사용자를 로그아웃시키고 재로그인 유도
        if (response.status === 401) {
          console.log('[WRITE] Authentication failed, logging out user')
          console.log('[WRITE] Auth debug state before logout:', AuthService.debugAuthState())
          console.log('[WRITE] Current form data:', { 
            title: formData.title, 
            status: formData.status,
            isEditing: isEditing 
          })
          
          AuthService.logout()
          setIsAuthenticated(false)
          setCurrentUser(null)
          setShowLoginDialog(true)
          alert('인증이 만료되었습니다. 다시 로그인해주세요.')
          return
        }
        
        const errorMessage = errorData.details || errorData.error || response.statusText
        throw new Error(`Failed to ${isEditing ? 'update' : 'save'} post: ${errorMessage}`)
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
    console.log('[WRITE] handlePublish called')
    console.log('[WRITE] formData:', formData)
    console.log('[WRITE] tags:', tags)
    
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
      // 요약이 비어있는 경우 컨텐츠의 첫 부분을 사용
      const excerpt = formData.summary.trim() || 
        formData.content.substring(0, 200).replace(/\n/g, ' ').trim() + 
        (formData.content.length > 200 ? '...' : '')
      
      const postData = {
        title: formData.title,
        content: formData.content,
        excerpt: excerpt,
        slug: generateSlug(formData.title),
        tags,
        category: formData.category,
        authorId: BLOG_CONFIG.owner.id,
        featured: false,
        isPublished: true
      }

      const url = isEditing ? `/api/posts/${editId}` : '/api/posts'
      const method = isEditing ? 'PUT' : 'POST'

      console.log(`[WRITE] Publishing: Sending ${method} request to ${url}`)
      console.log('[WRITE] Publish data:', {
        title: postData.title,
        category: postData.category,
        isPublished: postData.isPublished,
        tagsCount: postData.tags?.length || 0
      })
      
      const response = await AuthService.authenticatedFetch(url, {
        method,
        body: JSON.stringify(postData),
      })

      console.log(`[WRITE] Publish response status: ${response.status}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('[WRITE] Publish failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        })
        
        // 인증 오류인 경우 사용자를 로그아웃시키고 재로그인 유도
        if (response.status === 401) {
          console.log('[WRITE] Authentication failed during publish, logging out user')
          console.log('[WRITE] Auth debug state:', AuthService.debugAuthState())
          AuthService.logout()
          setIsAuthenticated(false)
          setCurrentUser(null)
          setShowLoginDialog(true)
          alert('세션이 만료되었습니다. 다시 로그인해주세요.')
          return
        }
        
        const errorMessage = errorData.details || errorData.error || response.statusText
        throw new Error(`Failed to ${isEditing ? 'update' : 'publish'} post: ${errorMessage}`)
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
      console.error('[WRITE] Error publishing post:', error)
      alert(`포스트 발행 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
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
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'background.paper',
            borderRadius: 2,
            boxShadow: 'none',
            border: `1px solid ${theme.palette.divider}`
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
              <Fade in={saveStatus !== 'idle' || autoSaveStatus !== 'idle'}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* 수동 저장 상태 */}
                  {saveStatus === 'saving' && (
                    <Alert severity="info" sx={{ py: 0.5 }}>저장 중...</Alert>
                  )}
                  {saveStatus === 'saved' && (
                    <Alert severity="success" sx={{ py: 0.5 }}>저장 완료!</Alert>
                  )}
                  {saveStatus === 'error' && (
                    <Alert severity="error" sx={{ py: 0.5 }}>저장 실패</Alert>
                  )}
                  
                  {/* 자동 저장 상태 */}
                  {autoSaveStatus === 'saving' && (
                    <Alert severity="info" sx={{ py: 0.5, fontSize: '0.75rem' }}>
                      <RefreshIcon sx={{ fontSize: 16, mr: 0.5, animation: 'spin 1s linear infinite' }} />
                      자동 저장 중...
                    </Alert>
                  )}
                  {autoSaveStatus === 'saved' && lastSavedAt && (
                    <Alert severity="success" sx={{ py: 0.5, fontSize: '0.75rem' }}>
                      자동 저장됨 ({lastSavedAt.toLocaleTimeString('ko-KR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })})
                    </Alert>
                  )}
                  {autoSaveStatus === 'error' && (
                    <Alert severity="warning" sx={{ py: 0.5, fontSize: '0.75rem' }}>
                      자동 저장 실패
                    </Alert>
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

          {/* Draft Management Section */}
          {isAuthenticated && (
            <Box sx={{ mb: 4 }}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'background.paper',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <DraftIcon sx={{ mr: 1, color: 'primary.main' }} />
                    임시저장 글 ({drafts.length})
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={showDrafts ? <FolderOpenIcon /> : <DraftIcon />}
                    onClick={() => setShowDrafts(!showDrafts)}
                    sx={{ borderRadius: 1 }}
                  >
                    {showDrafts ? '목록 숨기기' : '목록 보기'}
                  </Button>
                </Box>

                {showDrafts && (
                  <Box sx={{ mt: 2 }}>
                    {isDraftLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          로딩 중...
                        </Typography>
                      </Box>
                    ) : drafts.length === 0 ? (
                      <Box sx={{ 
                        p: 3, 
                        textAlign: 'center', 
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'grey.50',
                        borderRadius: 1,
                        border: `1px dashed ${theme.palette.divider}`
                      }}>
                        <DraftIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          저장된 임시글이 없습니다.
                        </Typography>
                      </Box>
                    ) : (
                      <Stack spacing={2}>
                        {drafts.map((draft) => (
                          <Box
                            key={draft.id}
                            sx={{
                              p: 2,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 1,
                              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'background.paper',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.1)' : 'primary.50'
                              }
                            }}
                            onClick={() => handleDraftSelect(draft)}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="h6" sx={{ 
                                  fontWeight: 600, 
                                  mb: 0.5,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}>
                                  {draft.title || '제목 없음'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ 
                                  mb: 1,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}>
                                  {draft.excerpt || draft.content?.substring(0, 100) + '...' || '내용 없음'}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                  <Chip 
                                    label={draft.category || '카테고리 없음'} 
                                    size="small" 
                                    color="primary" 
                                    variant="outlined" 
                                  />
                                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                    <TimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                    <Typography variant="caption">
                                      {new Date(draft.updatedAt).toLocaleDateString('ko-KR', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDraftDelete(draft.id)
                                }}
                                sx={{ 
                                  ml: 1,
                                  color: 'error.main',
                                  '&:hover': { bgcolor: 'error.50' }
                                }}
                              >
                                <DeleteIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Box>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Box>
                )}
              </Paper>
            </Box>
          )}

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, 
            gap: 4,
            minHeight: { xs: 'auto', lg: 'calc(100vh - 200px)' },
            position: 'relative',
            alignItems: { xs: 'stretch', lg: 'start' }
          }}>
            {/* Main Editor Section */}
            <Box sx={{ height: { xs: 'auto', lg: 'calc(100vh - 200px)' } }}>
              <Paper sx={{ 
                height: { xs: 'auto', lg: '100%' },
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Editor Header */}
                <Box sx={{ 
                  p: 3, 
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.05)' : 'background.paper',
                  flexShrink: 0
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
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.05)' : 'grey.50',
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
                      <Divider orientation="vertical" flexItem />
                      
                      {/* 코드펜 */}
                      <Tooltip title="CodePen 임베드">
                        <IconButton size="small" onClick={insertCodePen} sx={{ p: 0.75 }}>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '10px' }}>CP</Typography>
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
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'background.paper',
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
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'background.paper',
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
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': {
                              bgcolor: theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.1)' : 'primary.50',
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
                </Box>

                {/* Content Area */}
                <Box sx={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  overflow: 'hidden',
                  p: 3
                }}>
                  {activeTab === 0 && (
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
                        required
                        inputRef={contentRef}
                        sx={{
                          flex: 1,
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '400px', lg: '100%' },
                            borderRadius: 1.5,
                            fontFamily: '"JetBrains Mono", "Fira Code", Monaco, Menlo, "Ubuntu Mono", monospace',
                            fontSize: '14px',
                            lineHeight: 1.6,
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'background.paper',
                            color: 'text.primary',
                            '& textarea': {
                              resize: 'none',
                              color: 'inherit',
                              height: '100% !important',
                              overflow: 'auto !important',
                              overflowY: 'auto',
                              overflowX: 'hidden',
                              scrollbarWidth: 'thin',
                              '&::-webkit-scrollbar': {
                                width: '8px'
                              },
                              '&::-webkit-scrollbar-track': {
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                borderRadius: '4px'
                              },
                              '&::-webkit-scrollbar-thumb': {
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                                borderRadius: '4px',
                                '&:hover': {
                                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
                                }
                              }
                            },
                            '&:hover': {
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main'
                              }
                            }
                          }
                        }}
                      />
                    </Box>
                  )}

                  {activeTab === 1 && (
                    <Box
                      sx={{
                        flex: 1,
                        height: { xs: '400px', lg: '100%' },
                        overflow: 'auto',
                        p: 3,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1.5,
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'background.paper',
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
                          remarkPlugins={[remarkGfm, remarkBreaks]}
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            // 커스텀 컴포넌트로 체크박스 지원
                            input: ({ type, checked, ...props }: any) => {
                              if (type === 'checkbox') {
                                return <input type="checkbox" checked={checked} readOnly style={{ marginRight: '8px' }} {...props} />
                              }
                              return <input type={type} {...props} />
                            },
                            // 문단 스타일 개선 (줄바꿈 처리)
                            p: ({ children, ...props }: any) => {
                              return (
                                <p style={{ 
                                  marginBottom: '1.5em', 
                                  lineHeight: '1.4',
                                  whiteSpace: 'pre-wrap'
                                }} {...props}>
                                  {children}
                                </p>
                              )
                            },
                            // 줄바꿈 처리
                            br: () => (
                              <br style={{ 
                                display: 'block',
                                marginBottom: '1em'
                              }} />
                            ),
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
            <Box sx={{ 
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              height: { xs: 'auto', lg: 'calc(100vh - 200px)' },
              minHeight: { xs: 'auto', lg: 'calc(100vh - 200px)' }
            }}>
              {/* Scrollable Content */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 3,
                flex: 1,
                overflow: { xs: 'visible', lg: 'auto' },
                paddingBottom: { xs: 0, lg: '200px' }, // 하단 고정 영역을 위한 여백
                height: { xs: 'auto', lg: '100%' }
              }}>



                {/* Statistics */}
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'background.paper',
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
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'grey.50',
                      borderRadius: 1.5,
                      border: `1px solid ${theme.palette.divider}`
                    }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                        {wordCount.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        단어
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 2, 
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'grey.50',
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
                  
                  <Box sx={{ mt: 2, p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'grey.50', borderRadius: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        문자 수
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
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
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'background.paper',
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
                        : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'grey.50'),
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
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.1)' : 'primary.50'
                        }
                      }}
                    >
                      {isGeneratingSummary ? '생성 중...' : '수동으로 요약 생성'}
                    </Button>

                    <Box sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(3, 169, 244, 0.05)' : 'info.50', borderRadius: 1.5, border: `1px solid ${theme.palette.info.main}` }}>
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
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'background.paper',
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
                
                {/* Intersection Observer Trigger */}
                <Box ref={stickyTriggerRef} sx={{ height: '1px', width: '100%' }} />
              </Box>
              
            </Box>
          </Box>
        </Container>
        
        {/* Sticky Publishing Controls - 전체 화면 하단 고정 */}
        <Box sx={{
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 1000,
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderTop: `1px solid ${theme.palette.divider}`,
          boxShadow: isSticky ? '0 -8px 32px rgba(0,0,0,0.12)' : '0 -4px 16px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}40, transparent)`,
            opacity: isSticky ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }
        }}>
          <Container maxWidth="lg">
            <Box sx={{ py: 2.5 }}>
              <Stack spacing={2.5}>
                {/* 첫 번째 줄: 카테고리, 상태, 발행 버튼 */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flex: 1 }}>
                    <FormControl sx={{ minWidth: 140 }} size="small">
                      <InputLabel>카테고리</InputLabel>
                      <Select
                        value={formData.category}
                        onChange={handleInputChange('category')}
                        label="카테고리"
                        sx={{ 
                          borderRadius: 2,
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main
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
                    
                    <FormControl sx={{ minWidth: 120 }} size="small">
                      <InputLabel>상태</InputLabel>
                      <Select
                        value={formData.status}
                        onChange={handleInputChange('status')}
                        label="상태"
                        sx={{ 
                          borderRadius: 2,
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main
                          }
                        }}
                      >
                        <MenuItem value="draft">📝 초안</MenuItem>
                        <MenuItem value="published">🌍 발행됨</MenuItem>
                        <MenuItem value="private">🔒 비공개</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                  
                  <Stack direction="row" spacing={1.5}>
                    <Button
                      variant="outlined"
                      size="medium"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      disabled={saveStatus === 'saving'}
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        minWidth: 'auto',
                        px: 2.5,
                        fontWeight: 500,
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.05)'
                        }
                      }}
                    >
                      {saveStatus === 'saving' ? '저장중' : '임시저장'}
                    </Button>
                    <Button
                      variant="contained"
                      size="medium"
                      startIcon={<PublishIcon />}
                      onClick={handlePublish}
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
                        '&:hover': {
                          boxShadow: '0 4px 16px rgba(33, 150, 243, 0.4)',
                          transform: 'translateY(-1px)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isEditing ? '수정완료' : '발행하기'}
                    </Button>
                  </Stack>
                </Stack>
                
                {/* 두 번째 줄: 태그 */}
                <Box>
                  <Autocomplete
                    multiple
                    options={tagSuggestions}
                    value={tags}
                    onChange={(_, newValue) => setTags(newValue)}
                    freeSolo
                    size="small"
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        const { key, ...tagProps } = getTagProps({ index })
                        return (
                          <Chip
                            variant="outlined"
                            label={option}
                            {...tagProps}
                            key={key}
                            size="small"
                            sx={{ 
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              height: '26px',
                              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                              borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                              '&:hover': {
                                borderColor: theme.palette.primary.main,
                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.05)',
                                transform: 'translateY(-1px)'
                              },
                              '& .MuiChip-deleteIcon': {
                                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                                '&:hover': {
                                  color: theme.palette.primary.main
                                }
                              },
                              transition: 'all 0.2s ease'
                            }}
                          />
                        )
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="태그 입력하세요 (Enter로 구분)"
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                            minHeight: '42px',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                            },
                            '&:hover': {
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.primary.main
                              }
                            },
                            '&.Mui-focused': {
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.primary.main
                              }
                            }
                          }
                        }}
                      />
                    )}
                    sx={{
                      '& .MuiAutocomplete-tag': {
                        margin: '3px'
                      }
                    }}
                  />
                </Box>
              </Stack>
            </Box>
          </Container>
        </Box>
        
        {/* 복원 대화상자 */}
        <Dialog 
          open={showRecoverDialog} 
          onClose={dismissRecoverDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            임시저장된 내용 발견
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              이전에 작성하던 내용이 임시저장되어 있습니다. 복원하시겠습니까?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              복원하지 않으면 임시저장된 내용은 삭제됩니다.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={dismissRecoverDialog} color="inherit">
              삭제하기
            </Button>
            <Button onClick={recoverFromLocalStorage} variant="contained" autoFocus>
              복원하기
            </Button>
          </DialogActions>
        </Dialog>
        
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