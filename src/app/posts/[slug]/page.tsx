'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
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
  Alert,
  Breadcrumbs
} from '@mui/material'
import {
  Schedule as ScheduleIcon,
  Visibility as ViewIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
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
import TableOfContents from '@/components/TableOfContents'
import { AuthService } from '@/lib/auth'
import { CATEGORY_COLORS } from '@/shared/constants/categories'
import { createTaxonomySlug } from '@/lib/taxonomy'

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [post, setPost] = useState<PostEntity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<PostEntity[]>([])
  const [adjacentPosts, setAdjacentPosts] = useState<{
    previous: PostEntity | null
    next: PostEntity | null
  }>({ previous: null, next: null })
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

        try {
          const relatedResponse = await fetch(`/api/posts/${postData.id}/related`)
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json()
            setRelatedPosts(relatedData.posts || [])
          }
        } catch (relatedError) {
          console.error('Failed to load related posts:', relatedError)
        }

        try {
          const navigationResponse = await fetch(`/api/posts/${postData.id}/navigation`)
          if (navigationResponse.ok) {
            const navigationData = await navigationResponse.json()
            setAdjacentPosts({
              previous: navigationData.previous || null,
              next: navigationData.next || null,
            })
          }
        } catch (navigationError) {
          console.error('Failed to load adjacent posts:', navigationError)
        }
        
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
          text: post?.description || post?.excerpt,
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

  const getCategoryHref = (category: string) => `/categories/${createTaxonomySlug(category)}`
  const getTagHref = (tag: string) => `/tags/${createTaxonomySlug(tag)}`

  if (loading) {
    return (
      <MuiThemeProvider>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
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
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
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
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
        <Header />
        
        <Container maxWidth={false} sx={{ maxWidth: { xs: '100%', md: '1200px' }, mx: 'auto', px: { xs: 2, sm: 3, md: 2 }, py: { xs: 3, sm: 4, md: 4 } }}>
          <Box sx={{ mb: 4 }}>
            <IconButton 
              onClick={handleBack}
              sx={{ mb: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'text.secondary' }}>
              <Typography
                component={Link}
                href="/"
                color="inherit"
                sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
              >
                Home
              </Typography>
              <Typography
                component={Link}
                href="/articles"
                color="inherit"
                sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
              >
                Articles
              </Typography>
              <Typography
                component={Link}
                href={getCategoryHref(post.category)}
                color="inherit"
                sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
              >
                {post.category}
              </Typography>
              <Typography color="text.primary" sx={{ fontWeight: 700 }}>
                {post.title}
              </Typography>
            </Breadcrumbs>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 800px) 280px' },
              justifyContent: 'center',
              alignItems: 'start',
              gap: { xs: 3, lg: 4 }
            }}
          >
            <Paper sx={{ p: { xs: 2, md: 4 }, boxShadow: 'none', width: '100%', minWidth: 0 }}>
              <Stack spacing={4}>
                {/* Header */}
                <Box>
                  <Typography variant="h3" component="h1" gutterBottom>
                    {post.title}
                  </Typography>
                
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                  {post.description || post.excerpt}
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
                      {new Date(post.updatedAt).getTime() !== new Date(post.publishedAt).getTime() && (
                        <> · 수정 {new Date(post.updatedAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</>
                      )}
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
                    component={Link}
                    href={getCategoryHref(post.category)}
                    clickable
                    sx={{
                      background: CATEGORY_COLORS[post.category as keyof typeof CATEGORY_COLORS] || 'linear-gradient(135deg, #f0f0f0, #e0e0e0)',
                      color: '#000000',
                      fontWeight: 'bold',
                      border: '1px solid rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  {post.series && (
                    <Chip
                      label={post.series}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  )}
                  {post.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      component={Link}
                      href={getTagHref(tag)}
                      clickable
                      size="small"
                      sx={{
                        bgcolor: getTagColor(tag),
                        color: 'text.primary',
                        border: '1px solid',
                        borderColor: 'divider',
                        fontWeight: 700,
                        textDecoration: 'none',
                        '&:hover': {
                          borderColor: 'primary.main',
                        },
                      }}
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

                <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
                  <TableOfContents
                    content={post.content}
                    sticky={false}
                    collapsible
                    id="post-table-of-contents-mobile"
                  />
                </Box>

                {/* Content */}
                <Box>
                  <OptimizedMarkdown
                    content={post.content}
                  />
                </Box>

              <Divider />

              <Box>
                <Typography variant="h6" gutterBottom>
                  이어서 읽기
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                    gap: 1.5,
                  }}
                >
                  <AdjacentPostCard
                    label="이전글"
                    post={adjacentPosts.previous}
                    direction="previous"
                    onClick={(targetPost) => router.push(`/posts/${targetPost.slug}`)}
                  />
                  <AdjacentPostCard
                    label="다음글"
                    post={adjacentPosts.next}
                    direction="next"
                    onClick={(targetPost) => router.push(`/posts/${targetPost.slug}`)}
                  />
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" gutterBottom>
                  내부 링크 추천
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                  이 글과 같은 주제의 글을 더 탐색할 수 있는 자동 추천 링크입니다.
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  <Chip
                    label={`${post.category} 글 더 보기`}
                    component={Link}
                    href={getCategoryHref(post.category)}
                    clickable
                    color="primary"
                    variant="outlined"
                  />
                  {post.tags.slice(0, 5).map((tag) => (
                    <Chip
                      key={tag}
                      label={`#${tag}`}
                      component={Link}
                      href={getTagHref(tag)}
                      clickable
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>

              <Divider />

              {relatedPosts.length > 0 && (
                <>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      관련 글
                    </Typography>
                    <Stack spacing={1.5}>
                      {relatedPosts.map((relatedPost) => (
                        <Box
                          key={relatedPost.id}
                          onClick={() => router.push(`/posts/${relatedPost.slug}`)}
                          sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            cursor: 'pointer',
                            transition: 'border-color 0.2s ease, background-color 0.2s ease',
                            '&:hover': {
                              borderColor: 'primary.main',
                              bgcolor: 'action.hover'
                            }
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            {relatedPost.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {relatedPost.description || relatedPost.excerpt}
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                            <Chip label={relatedPost.category} size="small" />
                            {relatedPost.series && (
                              <Chip label={relatedPost.series} size="small" variant="outlined" />
                            )}
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  <Divider />
                </>
              )}

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

            <Box
              sx={{
                display: { xs: 'none', lg: 'block' },
                alignSelf: 'stretch'
              }}
            >
              <TableOfContents
                content={post.content}
                sticky
                collapsible={false}
                id="post-table-of-contents-desktop"
              />
            </Box>
          </Box>
        </Container>
        
        <Footer />
      </Box>
    </MuiThemeProvider>
  )
}

function AdjacentPostCard({
  label,
  post,
  direction,
  onClick,
}: {
  label: string
  post: PostEntity | null
  direction: 'previous' | 'next'
  onClick: (post: PostEntity) => void
}) {
  return (
    <Box
      component={post ? 'button' : 'div'}
      type={post ? 'button' : undefined}
      onClick={post ? () => onClick(post) : undefined}
      sx={{
        p: 2,
        width: '100%',
        textAlign: 'left',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
        cursor: post ? 'pointer' : 'default',
        color: 'text.primary',
        font: 'inherit',
        transition: 'border-color 0.2s ease, background-color 0.2s ease',
        '&:hover': post
          ? {
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
            }
          : undefined,
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
          {direction === 'previous' && <ArrowBackIcon sx={{ fontSize: 16 }} />}
          <Typography variant="caption" sx={{ fontWeight: 800 }}>
            {label}
          </Typography>
          {direction === 'next' && <ArrowForwardIcon sx={{ fontSize: 16 }} />}
        </Stack>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.35 }}>
          {post ? post.title : `${label}이 없습니다.`}
        </Typography>
        {post && (
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {post.description || post.excerpt}
          </Typography>
        )}
      </Stack>
    </Box>
  )
}
