'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Chip, 
  Tabs, 
  Tab,
  Stack,
  Snackbar,
  Alert
} from '@mui/material'
import {
  Schedule as ScheduleIcon,
  Visibility as ViewIcon,
  Category as CategoryIcon
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { PostEntity } from '@/entities/Post'
import MuiThemeProvider from '@/components/MuiThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import Loading from '@/components/Loading'
import { BLOG_CATEGORIES, CATEGORY_DESCRIPTIONS, CATEGORY_COLORS } from '@/shared/constants/categories'
import { getTagColor } from '@/utils/archiveHelpers'

type BlogCategory = typeof BLOG_CATEGORIES[number]

export default function HomePage() {
  const router = useRouter()
  const [posts, setPosts] = useState<PostEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isSticky, setIsSticky] = useState(false)
  const [newPostAdded, setNewPostAdded] = useState(false)
  const [previousPostCount, setPreviousPostCount] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)

  const fetchPosts = async (showNotification = false) => {
    try {
      if (showNotification) setLoading(false) // 알림용 새로고침일 때는 로딩 표시하지 않음
      else setLoading(true)
      
      const response = await fetch('/api/posts?sortField=publishedAt&sortOrder=desc&limit=50')
      if (response.ok) {
        const data = await response.json()
        const newPosts = data.posts || []
        
        // 새 포스트가 추가되었는지 확인
        if (showNotification && previousPostCount > 0 && newPosts.length > previousPostCount) {
          setNewPostAdded(true)
        }
        
        setPosts(newPosts)
        setPreviousPostCount(newPosts.length)
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      if (!showNotification) setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()

    // 페이지가 포커스를 받을 때 포스트 목록 새로고침
    const handleFocus = () => {
      fetchPosts(true)
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting)
      },
      {
        rootMargin: '-80px 0px 0px 0px',
        threshold: 0
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleCategoryChange = (_: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue)
  }

  const handlePostClick = (post: PostEntity) => {
    router.push(`/posts/${post.slug}`)
  }

  const filteredPosts = selectedCategory === 'all' 
    ? posts.filter(post => post.isPublished)
    : posts.filter(post => post.isPublished && post.category === selectedCategory)

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getRelativeTime = (dateString: string | Date) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 1) return '방금 전'
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`
    if (diffInHours < 24) return `${diffInHours}시간 전`
    if (diffInDays < 7) return `${diffInDays}일 전`
    
    return formatDate(dateString)
  }

  const isNewPost = (dateString: string | Date) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    return diffInHours < 24 // 24시간 이내를 새 포스트로 간주
  }

  const getCategoryInfo = (category: BlogCategory) => ({
    description: CATEGORY_DESCRIPTIONS[category],
    color: CATEGORY_COLORS[category]
  })

  return (
    <MuiThemeProvider>
      <div style={{ minHeight: '100vh' }}>
        <Header />
        
        <main>
          <HeroSection />
          
          <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box ref={sectionRef} sx={{ height: '1px', mb: 6 }} />
            <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 6 }}>
              최신 포스트
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 4 }}>
              {/* Left Sidebar - Category Tabs */}
              <Box sx={{ width: 280, flexShrink: 0 }}>
                <Box sx={{ 
                  position: isSticky ? 'fixed' : 'sticky', 
                  top: isSticky ? 80 : 32,
                  zIndex: 10,
                  width: 280,
                  maxHeight: isSticky ? 'calc(100vh - 100px)' : 'none',
                  overflowY: isSticky ? 'auto' : 'visible'
                }}>
                  <Tabs
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    orientation="vertical"
                    textColor="primary"
                    sx={{
                      borderRight: 'none',
                      '& .MuiTabs-indicator': {
                        display: 'none'
                      },
                      '& .MuiTab-root': {
                        borderRadius: '12px',
                        margin: '4px 0',
                        textTransform: 'none',
                        fontWeight: 500,
                        transition: 'all 0.2s ease',
                        alignItems: 'flex-start',
                        textAlign: 'left',
                        minHeight: 48,
                        '&.Mui-selected': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                          fontWeight: 600
                        },
                        '&:hover': {
                          backgroundColor: 'primary.50'
                        }
                      }
                    }}
                  >
                    <Tab label="All Posts" value="all" />
                    {BLOG_CATEGORIES.map((category) => (
                      <Tab key={category} label={category} value={category} />
                    ))}
                  </Tabs>

                  {/* Category Description */}
                  {selectedCategory !== 'all' && (
                    <Box sx={{ mt: 4, p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                      <Chip
                        icon={<CategoryIcon />}
                        label={selectedCategory}
                        sx={{
                          background: getCategoryInfo(selectedCategory as BlogCategory).color,
                          color: 'black',
                          fontWeight: 'bold',
                          mb: 2
                        }}
                      />
                      <Typography 
                        variant="body1" 
                        color="text.primary"
                        sx={{ 
                          fontSize: '0.95rem',
                          lineHeight: 1.6,
                          fontWeight: 500
                        }}
                      >
                        {getCategoryInfo(selectedCategory as BlogCategory).description}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Right Content - Posts Grid */}
              <Box sx={{ flex: 1 }}>
                {loading ? (
                  <Loading variant="posts" message="최신 포스트를 불러오는 중..." />
                ) : (
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                    gap: 3 
                  }}>
                    {filteredPosts.map((post) => (
                      <Box key={post.id}>
                        <Card 
                          sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            border: 'none',
                            boxShadow: 'none',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              backgroundColor: 'grey.50'
                            }
                          }}
                          onClick={() => handlePostClick(post)}
                        >
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ mb: 2 }}>
                              <Chip
                                label={post.category}
                                size="small"
                                sx={{
                                  background: getCategoryInfo(post.category as BlogCategory).color,
                                  color: 'black',
                                  fontWeight: 'bold',
                                  mb: 1
                                }}
                              />
                              {post.featured && (
                                <Chip
                                  label="Featured"
                                  size="small"
                                  color="secondary"
                                  sx={{ ml: 1 }}
                                />
                              )}
                              {isNewPost(post.publishedAt) && (
                                <Chip
                                  label="NEW"
                                  size="small"
                                  sx={{ 
                                    ml: 1,
                                    backgroundColor: '#ff4444',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    animation: 'pulse 2s infinite',
                                    '@keyframes pulse': {
                                      '0%': { opacity: 1 },
                                      '50%': { opacity: 0.7 },
                                      '100%': { opacity: 1 },
                                    }
                                  }}
                                />
                              )}
                            </Box>
                            
                            <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
                              {post.title}
                            </Typography>
                            
                            <Typography 
                              variant="body1" 
                              color="text.primary"
                              sx={{ 
                                mb: 2,
                                fontSize: '0.9rem',
                                lineHeight: 1.6,
                                opacity: 0.8
                              }}
                            >
                              {post.excerpt}
                            </Typography>

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                                {post.tags.slice(0, 3).map((tag) => (
                                  <Chip 
                                    key={tag} 
                                    label={tag} 
                                    size="small" 
                                    sx={{ 
                                      fontSize: '0.65rem', 
                                      height: '18px',
                                      backgroundColor: getTagColor(tag),
                                      border: `1px solid ${getTagColor(tag)}`,
                                      color: '#555',
                                      '&:hover': {
                                        backgroundColor: getTagColor(tag),
                                        borderColor: getTagColor(tag)
                                      }
                                    }}
                                  />
                                ))}
                                {post.tags.length > 3 && (
                                  <Chip 
                                    label={`+${post.tags.length - 3}`} 
                                    size="small" 
                                    variant="outlined"
                                    sx={{ fontSize: '0.65rem', height: '18px', color: '#666' }}
                                  />
                                )}
                              </Box>
                            )}
                            
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                  {post.readTime}분 읽기
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <ViewIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                  {post.views?.toLocaleString()}
                                </Typography>
                              </Box>
                            </Stack>
                            
                            <Typography variant="caption" color="text.secondary">
                              {getRelativeTime(post.publishedAt)}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Container>
        </main>
        
        <Footer />

        {/* 새 포스트 알림 */}
        <Snackbar
          open={newPostAdded}
          autoHideDuration={6000}
          onClose={() => setNewPostAdded(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setNewPostAdded(false)} 
            severity="success" 
            sx={{ width: '100%' }}
          >
            🎉 새로운 포스트가 추가되었습니다!
          </Alert>
        </Snackbar>
      </div>
    </MuiThemeProvider>
  )
}