'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Divider,
  Stack,
  Avatar,
  IconButton,
  Skeleton,
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
import { PostEntity } from '@/entities/Post'
import { BLOG_CONFIG } from '@/config/blog'

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [post, setPost] = useState<PostEntity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete post')
      }
      
      router.push('/')
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('글 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <MuiThemeProvider>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Header />
          <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack spacing={3}>
              <Skeleton variant="text" width="60%" height={60} />
              <Skeleton variant="text" width="100%" height={24} />
              <Skeleton variant="rectangular" width="100%" height={400} />
            </Stack>
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
        
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <IconButton 
              onClick={handleBack}
              sx={{ mb: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Box>

          <Paper sx={{ p: { xs: 3, md: 6 }, boxShadow: 'none' }}>
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
                    color="primary" 
                    variant="filled"
                  />
                  {post.tags.map((tag) => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      variant="outlined" 
                      size="small"
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
                <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
                  <IconButton onClick={handleShare} title="공유하기">
                    <ShareIcon />
                  </IconButton>
                  <IconButton title="북마크">
                    <BookmarkIcon />
                  </IconButton>
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
                </Stack>

                <Divider />
              </Box>

              {/* Content */}
              <Box>
                <Box sx={{ 
                  lineHeight: 1.8,
                  '& p': { mb: 2 },
                  '& h1, & h2, & h3, & h4, & h5, & h6': { 
                    mt: 4, 
                    mb: 2,
                    fontWeight: 'bold'
                  },
                  '& h1': { fontSize: '2rem' },
                  '& h2': { fontSize: '1.5rem' },
                  '& h3': { fontSize: '1.25rem' },
                  '& pre': {
                    bgcolor: 'grey.100',
                    p: 2,
                    borderRadius: 1,
                    overflow: 'auto',
                    '& code': {
                      bgcolor: 'transparent',
                      px: 0,
                      py: 0
                    }
                  },
                  '& code': {
                    bgcolor: 'grey.100',
                    px: 0.5,
                    py: 0.25,
                    borderRadius: 0.5,
                    fontSize: '0.875rem'
                  },
                  '& blockquote': {
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    pl: 2,
                    ml: 0,
                    fontStyle: 'italic',
                    color: 'text.secondary'
                  },
                  '& img': {
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: 1,
                    my: 2
                  }
                }}>
                  {post.content.split('\n').map((line, index) => {
                    // 제목 처리
                    if (line.startsWith('# ')) {
                      return <Typography key={index} variant="h4" component="h1" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>{line.substring(2)}</Typography>
                    }
                    if (line.startsWith('## ')) {
                      return <Typography key={index} variant="h5" component="h2" sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}>{line.substring(3)}</Typography>
                    }
                    if (line.startsWith('### ')) {
                      return <Typography key={index} variant="h6" component="h3" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>{line.substring(4)}</Typography>
                    }
                    
                    // 코드 블록 처리
                    if (line.startsWith('```')) {
                      return null // 코드 블록은 별도 처리 필요
                    }
                    
                    // 이미지 처리
                    const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/)
                    if (imageMatch) {
                      return (
                        <Box key={index} sx={{ my: 3, textAlign: 'center' }}>
                          <img
                            src={imageMatch[2]}
                            alt={imageMatch[1]}
                            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                          />
                        </Box>
                      )
                    }
                    
                    // 일반 텍스트
                    if (line.trim()) {
                      return <Typography key={index} variant="body1" paragraph>{line}</Typography>
                    }
                    
                    return <br key={index} />
                  })}
                </Box>
              </Box>

              <Divider />

              {/* Author Information */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  작성자 정보
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar 
                    src={BLOG_CONFIG.owner.avatar}
                    alt={BLOG_CONFIG.owner.name}
                    sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}
                  >
                    {BLOG_CONFIG.owner.name.charAt(0)}
                  </Avatar>
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
            </Stack>
          </Paper>
        </Container>
        
        <Footer />
      </Box>
    </MuiThemeProvider>
  )
}