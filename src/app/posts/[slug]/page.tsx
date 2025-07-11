'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Divider,
  Stack,
  IconButton,
  Alert
} from '@mui/material'
import {
  Schedule as ScheduleIcon,
  Visibility as ViewIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import MuiThemeProvider from '@/components/MuiThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'
import { PostEntity } from '@/entities/Post'
import { BLOG_CONFIG } from '@/config/blog'
import { AvatarImage } from '@/components/image'
import OptimizedMarkdown from '@/components/OptimizedMarkdown'
import CommentSection from '@/components/CommentSection'
import LikeButton from '@/components/LikeButton'
import { AuthService } from '@/lib/auth'
import { CATEGORY_COLORS } from '@/shared/constants/categories'
import SkillTag from '@/components/SkillTag'

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [post, setPost] = useState<PostEntity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const viewCountedRef = useRef(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/posts/slug/${slug}`)
        
        if (!response.ok) {
          throw new Error('Post not found')
        }
        
        const postData = await response.json()
        setPost(postData)
        
        // 조회수 증가 (한 번만 실행) - useRef + sessionStorage로 중복 방지
        const viewKey = `post_viewed_${postData.id}`
        const alreadyViewed = sessionStorage.getItem(viewKey)
        
        if (!viewCountedRef.current && !alreadyViewed) {
          viewCountedRef.current = true
          sessionStorage.setItem(viewKey, 'true')
          incrementViews(postData.id)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPost()
    }
  }, [slug])

  // 관리자 인증 확인
  useEffect(() => {
    setIsAdmin(AuthService.isAuthenticated())
  }, [])

  const incrementViews = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/views`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.views !== undefined) {
          setPost(prev => prev ? { ...prev, views: result.views } : null)
        }
      }
    } catch (error) {
      console.error('Failed to increment views:', error)
    }
  }

  const handleBack = () => {
    router.back()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleEdit = () => {
    if (post?.id) {
      router.push(`/write?edit=${post.id}`)
    }
  }

  const handleDelete = async () => {
    if (!post?.id) return
    
    const confirmed = window.confirm('정말로 이 글을 삭제하시겠습니까?')
    if (!confirmed) return
    
    try {
      setIsDeleting(true)
      const response = await AuthService.authenticatedFetch(`/api/posts/${post.id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete post')
      }
      
      router.push('/')
    } catch (error) {
      console.error('Error deleting post:', error)
      alert(error instanceof Error ? error.message : '글 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  const getTagColor = (tag: string) => {
    const colors: { [key: string]: string } = {
      // Frontend & Core Technologies (Light Blue/Cyan family)
      'html': '#ffebee',
      'css': '#e3f2fd', 
      'javascript': '#fff9c4',
      'typescript': '#e8f5ff',
      'react': '#e0f7fa',
      'nextjs': '#f3e5f5',
      'vue': '#e8f5e8',
      'nuxt': '#f1f8e9',
      'frontend': '#e1f5fe',
      
      // Backend & Database (Green/Purple family)
      'backend': '#f1f8e9',
      'database': '#fff8e1',
      'node': '#e8f5e8',
      'python': '#fff3e0',
      
      // Development & Tools (Purple/Pink family)
      'development': '#f3e5f5',
      'tools': '#e8eaf6',
      'git': '#ffebee',
      'devops': '#e8eaf6',
      
      // Content Categories (Warm tones)
      'tutorial': '#e8f5e8',
      'review': '#fff3e0',
      'tech insights': '#e3f2fd',
      'personal': '#fce4ec',
      'career': '#fce4ec',
      'productivity': '#f3e5f5',
      
      // AI & Modern Tech (Light Green/Yellow)
      'ai': '#f9fbe7',
      
      // Design & UI (Orange/Pink family)
      'bootstrap': '#f3e5f5',
      'material-ui': '#e3f2fd',
      'responsive design': '#ffebee',
      'figma': '#fce4ec',
      'zeplin': '#fff3e0'
    }
    
    const normalizedTag = tag.toLowerCase().trim()
    return colors[normalizedTag] || '#f5f5f5'
  }

  if (loading) {
    return (
      <MuiThemeProvider>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Header />
          <Container maxWidth="md" sx={{ py: 4 }}>
            <Loading variant="default" message="포스트를 불러오는 중..." />
          </Container>
          <Footer />
        </Box>
      </MuiThemeProvider>
    )
  }

  if (error || !post) {
    return (
      <MuiThemeProvider>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Header />
          <Container maxWidth="md" sx={{ py: 4 }}>
            <Alert severity="error">
              {error || 'Post not found'}
            </Alert>
          </Container>
          <Footer />
        </Box>
      </MuiThemeProvider>
    )
  }

  return (
    <MuiThemeProvider>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header />
        
        <Container maxWidth={false} sx={{ maxWidth: { xs: '100%', md: '1200px' }, mx: 'auto', px: { xs: 2, sm: 3, md: 2 }, py: { xs: 3, sm: 4, md: 4 } }}>
          <Box sx={{ mb: 4 }}>
            <IconButton 
              onClick={handleBack}
              sx={{ mb: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Box>

          <Paper sx={{ p: { xs: 2, md: 4 }, boxShadow: 'none', maxWidth: '800px', mx: 'auto' }}>
            <Stack spacing={4}>
              {/* Header */}
              <Box>
                <Typography variant="h3" component="h1" gutterBottom>
                  {post.title}
                </Typography>
                
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                  {post.excerpt}
                </Typography>

                {/* Meta Information */}
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2} 
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  sx={{ mb: 3 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(post.publishedAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {post.readTime}분 읽기
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ViewIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {post.views?.toLocaleString()} 조회
                    </Typography>
                  </Box>
                </Stack>

                {/* Tags */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  <Chip 
                    label={post.category} 
                    sx={{
                      background: CATEGORY_COLORS[post.category as keyof typeof CATEGORY_COLORS] || 'linear-gradient(135deg, #f0f0f0, #e0e0e0)',
                      color: '#000000',
                      fontWeight: 'bold',
                      border: '1px solid rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  {post.tags.map((tag) => (
                    <SkillTag 
                      key={tag} 
                      label={tag}
                      getColor={getTagColor}
                    />
                  ))}
                  {post.featured && (
                    <Chip 
                      label="Featured" 
                      color="secondary" 
                      size="small"
                    />
                  )}
                </Box>

                {/* Action Buttons */}
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 4 }}>
                  <LikeButton postId={post.id} />
                  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                  <IconButton onClick={handleShare} title="공유하기">
                    <ShareIcon />
                  </IconButton>
                  <IconButton title="북마크">
                    <BookmarkIcon />
                  </IconButton>
                  {isAdmin && (
                    <>
                      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                      <IconButton 
                        onClick={handleEdit} 
                        title="수정하기"
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={handleDelete} 
                        title="삭제하기"
                        color="error"
                        disabled={isDeleting}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </Stack>

                <Divider />
              </Box>

              {/* Content */}
              <Box>
                <OptimizedMarkdown 
                  content={post.content}
                />
              </Box>

              <Divider />

              {/* Author Information */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  작성자 정보
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <AvatarImage 
                    src={BLOG_CONFIG.owner.avatar}
                    alt={BLOG_CONFIG.owner.name}
                    size={56}
                    fallbackText={BLOG_CONFIG.owner.name.charAt(0)}
                    priority={true}
                    quality={90}
                  />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {BLOG_CONFIG.owner.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {BLOG_CONFIG.owner.bio}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {BLOG_CONFIG.owner.email}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Comment Section */}
              <CommentSection postId={post.id} />
            </Stack>
          </Paper>
        </Container>
        
        <Footer />
      </Box>
    </MuiThemeProvider>
  )
}