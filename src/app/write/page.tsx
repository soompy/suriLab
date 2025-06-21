'use client'

import { useState, useEffect } from 'react'
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
  Autocomplete
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
  ExitToApp as LogoutIcon
} from '@mui/icons-material'
import MuiThemeProvider from '@/components/MuiThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Write() {
  // 인증 상태 관리
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '# 글 제목\n\n여기에 내용을 작성하세요...\n\n## 소제목\n\n본문 내용을 입력하세요.\n\n```javascript\nfunction example() {\n  console.log("코드 예제");\n}\n```',
    category: '',
    status: 'draft'
  })
  const [tags, setTags] = useState<string[]>([])
  const [isPreview, setIsPreview] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

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
  }

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
      alert('포스트가 저장되었습니다!')
    } catch (error) {
      console.error('Error saving post:', error)
      alert('포스트 저장에 실패했습니다.')
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
        content: '# 글 제목\n\n여기에 내용을 작성하세요...\n\n## 소제목\n\n본문 내용을 입력하세요.\n\n```javascript\nfunction example() {\n  console.log("코드 예제");\n}\n```',
        category: '',
        status: 'draft'
      })
      setTags([])
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
      setFormData(prev => ({
        ...prev,
        content: prev.content + imageMarkdown
      }))

      alert('이미지가 업로드되었습니다!')
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
        
        <Container maxWidth={false} sx={{ maxWidth: { xs: '100%', md: '1300px' }, mx: 'auto', px: 4, py: 6 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ flex: 1 }} />
              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Typography variant="h2" component="h1" gutterBottom>
                  새 글 작성
                </Typography>
              </Box>
              <Box sx={{ flex: 1, textAlign: 'right' }}>
                <Button
                  variant="outlined"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  size="small"
                >
                  로그아웃
                </Button>
              </Box>
            </Box>
            <Typography variant="h6" color="text.secondary">
              안녕하세요, {currentUser?.name || '관리자'}님! 새로운 아이디어와 경험을 공유해보세요
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Main Editor Section */}
            <Grid item xs={12} lg={8.4} sx={{ flex: 2 }}>
              <Paper sx={{ p: 4, boxShadow: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <EditIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
                  <Typography variant="h5" component="h2">
                    글 작성
                  </Typography>
                  <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                    <Button
                      variant={isPreview ? 'contained' : 'outlined'}
                      size="small"
                      startIcon={<PreviewIcon />}
                      onClick={() => setIsPreview(!isPreview)}
                    >
                      {isPreview ? '에디터' : '미리보기'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      size="small"
                      component="label"
                      startIcon={<ImageIcon />}
                      disabled={isUploading}
                      sx={{ ml: 1 }}
                    >
                      {isUploading ? '업로드 중...' : '이미지'}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                    </Button>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label="제목"
                    value={formData.title}
                    onChange={handleInputChange('title')}
                    placeholder="포스트 제목을 입력하세요"
                    variant="outlined"
                    required
                  />

                  <TextField
                    fullWidth
                    label="요약"
                    value={formData.summary}
                    onChange={handleInputChange('summary')}
                    placeholder="포스트의 간단한 요약을 입력하세요"
                    variant="outlined"
                    multiline
                    rows={2}
                    required
                  />

                  <TextField
                    fullWidth
                    label="내용"
                    value={formData.content}
                    onChange={handleInputChange('content')}
                    placeholder="마크다운 형식으로 내용을 작성하세요"
                    variant="outlined"
                    multiline
                    rows={20}
                    required
                    sx={{
                      '& .MuiInputBase-root': {
                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                        fontSize: '14px',
                        lineHeight: 1.5
                      }
                    }}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} lg={3.6} sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Publish Settings */}
                <Paper sx={{ p: 3, boxShadow: 'none' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PublishIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                    <Typography variant="h6">
                      발행 설정
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl fullWidth required>
                      <InputLabel>카테고리 *</InputLabel>
                      <Select
                        value={formData.category}
                        onChange={handleInputChange('category')}
                        label="카테고리 *"
                        required
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
                      >
                        <MenuItem value="draft">초안</MenuItem>
                        <MenuItem value="published">발행됨</MenuItem>
                        <MenuItem value="private">비공개</MenuItem>
                      </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                      >
                        저장
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<PublishIcon />}
                        onClick={handlePublish}
                      >
                        발행
                      </Button>
                    </Box>
                  </Box>
                </Paper>

                {/* Tags */}
                <Paper sx={{ p: 3, boxShadow: 'none' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <TagIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                    <Typography variant="h6">
                      태그
                    </Typography>
                  </Box>

                  <Autocomplete
                    multiple
                    options={tagSuggestions}
                    value={tags}
                    onChange={(_, newValue) => setTags(newValue)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                          key={option}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="태그 추가..."
                        variant="outlined"
                      />
                    )}
                  />
                </Paper>

                {/* Statistics */}
                <Paper sx={{ p: 3, boxShadow: 'none' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <AnalyticsIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                    <Typography variant="h6">
                      통계
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        단어 수
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {wordCount.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        문자 수
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {charCount.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        예상 읽기 시간
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {readingTime}분
                      </Typography>
                    </Box>
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