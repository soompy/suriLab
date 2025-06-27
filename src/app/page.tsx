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
import SkillTag from '@/components/SkillTag'

type BlogCategory = typeof BLOG_CATEGORIES[number]

export default function HomePage() {
  const router = useRouter()
  const [posts, setPosts] = useState<PostEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isSticky, setIsSticky] = useState(false)
  const [newPostAdded, setNewPostAdded] = useState(false)
  const [previousPostCount, setPreviousPostCount] = useState(0)
  const [isNearFooter, setIsNearFooter] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMorePosts, setHasMorePosts] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)

  const fetchPosts = async (showNotification = false, page = 1, reset = false) => {
    try {
      if (showNotification) setLoading(false)
      else if (page === 1) setLoading(true)
      else setLoadingMore(true)
      
      const response = await fetch(`/api/posts?sortField=publishedAt&sortOrder=desc&limit=12&page=${page}`)
      if (response.ok) {
        const data = await response.json()
        const newPosts = data.posts || []
        
        // 새 포스트가 추가되었는지 확인
        if (showNotification && previousPostCount > 0 && newPosts.length > previousPostCount) {
          setNewPostAdded(true)
        }
        
        if (reset || page === 1) {
          setPosts(newPosts)
        } else {
          setPosts(prevPosts => [...prevPosts, ...newPosts])
        }
        
        // 더 불러올 포스트가 있는지 확인
        setHasMorePosts(newPosts.length === 12)
        setPreviousPostCount(page === 1 ? newPosts.length : posts.length + newPosts.length)
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      if (!showNotification) {
        setLoading(false)
      }
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchPosts()

    // 페이지가 포커스를 받을 때 포스트 목록 새로고침
    const handleFocus = () => {
      setCurrentPage(1)
      fetchPosts(true, 1, true)
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  // 카테고리 변경 시 포스트 목록 리셋
  useEffect(() => {
    setCurrentPage(1)
    setHasMorePosts(true)
    fetchPosts(false, 1, true)
  }, [selectedCategory])


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

  // Footer와의 겹침을 방지하고 무한스크롤을 위한 스크롤 이벤트 리스너
  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return

      const footerRect = footerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Footer가 화면에 들어오기 시작하면 (sticky 탭의 높이만큼 여유를 둠)
      const footerThreshold = 400 // sticky 탭 컨테이너의 대략적인 높이
      const isFooterNear = footerRect.top < windowHeight - footerThreshold
      
      setIsNearFooter(isFooterNear)

      // 무한스크롤: 페이지 하단에 가까워지면 다음 페이지 로드
      const scrollThreshold = 800 // 하단에서 800px 전에 로드
      const shouldLoadMore = 
        footerRect.top < windowHeight + scrollThreshold &&
        hasMorePosts &&
        !loadingMore &&
        !loading

      if (shouldLoadMore) {
        const nextPage = currentPage + 1
        setCurrentPage(nextPage)
        fetchPosts(false, nextPage, false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // 초기 실행

    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentPage, hasMorePosts, loadingMore, loading])

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
            
            <Box sx={{ 
              display: { xs: 'block', md: 'flex' }, 
              gap: { xs: 0, md: 4 },
              flexDirection: { xs: 'column', md: 'row' }
            }}>
              {/* Left Sidebar - Category Tabs */}
              <Box sx={{ 
                width: { xs: '100%', md: 280 }, 
                flexShrink: 0,
                mb: { xs: 4, md: 0 }
              }}>
                <Box sx={{ 
                  position: { 
                    xs: 'static', // 모바일에서는 static
                    md: isNearFooter ? 'absolute' : (isSticky ? 'fixed' : 'sticky')
                  }, 
                  top: { 
                    xs: 'auto',
                    md: isSticky && !isNearFooter ? 80 : 32
                  },
                  zIndex: { xs: 1, md: 10 },
                  width: { xs: '100%', md: 280 },
                  maxHeight: { 
                    xs: 'none',
                    md: isSticky && !isNearFooter ? 'calc(100vh - 100px)' : 'none'
                  },
                  overflowY: { 
                    xs: 'visible',
                    md: isSticky && !isNearFooter ? 'auto' : 'visible'
                  },
                  backgroundColor: { xs: 'transparent', md: 'background.default' },
                  borderRadius: { xs: 0, md: isSticky ? 2 : 0 },
                  boxShadow: { 
                    xs: 'none', 
                    md: isSticky && !isNearFooter ? '0 4px 20px rgba(0,0,0,0.1)' : 'none'
                  },
                  p: { xs: 0, md: isSticky && !isNearFooter ? 2 : 0 },
                  transition: 'all 0.3s ease-in-out'
                }}>
                  {/* Mobile Tabs */}
                  <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    <Tabs
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      orientation="horizontal"
                      variant="scrollable"
                      scrollButtons="auto"
                      textColor="primary"
                      sx={{
                        borderBottom: '1px solid',
                        borderBottomColor: 'divider',
                        mb: 2,
                        '& .MuiTabs-indicator': {
                          display: 'none'
                        },
                        '& .MuiTab-root': {
                          borderRadius: '12px',
                          margin: '0 4px',
                          textTransform: 'none',
                          fontWeight: 500,
                          fontSize: '0.875rem',
                          minWidth: 'auto',
                          transition: 'all 0.2s ease',
                          alignItems: 'center',
                          textAlign: 'center',
                          minHeight: 40,
                          '&.Mui-selected': {
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
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
                  </Box>

                  {/* Desktop Tabs */}
                  <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Tabs
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      orientation="vertical"
                      variant="standard"
                      textColor="primary"
                      sx={{
                        '& .MuiTabs-indicator': {
                          display: 'none'
                        },
                        '& .MuiTab-root': {
                          borderRadius: '12px',
                          margin: '4px 0',
                          textTransform: 'none',
                          fontWeight: 500,
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          alignItems: 'flex-start',
                          textAlign: 'left',
                          minHeight: 48,
                          '&.Mui-selected': {
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
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
                  </Box>

                  {/* Category Description - Desktop only */}
                  {selectedCategory !== 'all' && (
                    <Box sx={{ 
                      mt: { xs: 0, md: 4 }, 
                      p: 3, 
                      backgroundColor: 'grey.50', 
                      borderRadius: 2,
                      display: { xs: 'none', md: 'block' }
                    }}>
                      <Chip
                        icon={<CategoryIcon />}
                        label={selectedCategory}
                        sx={{
                          background: getCategoryInfo(selectedCategory as BlogCategory).color,
                          color: '#000000',
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
                  <>
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
                              border: '1px solid',
                              borderColor: 'divider',
                              boxShadow: 'none',
                              backgroundColor: 'background.paper',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                backgroundColor: 'action.hover'
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
                                    color: '#000000',
                                    fontWeight: 'bold',
                                    border: '1px solid rgba(0, 0, 0, 0.1)'
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
                                      color: 'primary.contrastText',
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
                                color="text.secondary"
                                sx={{ 
                                  mb: 2,
                                  fontSize: '0.9rem',
                                  lineHeight: 1.6
                                }}
                              >
                                {post.excerpt}
                              </Typography>

                              {/* Tags */}
                              {post.tags && post.tags.length > 0 && (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                                  {post.tags.slice(0, 3).map((tag) => (
                                    <SkillTag 
                                      key={tag} 
                                      label={tag}
                                      variant="small"
                                    />
                                  ))}
                                  {post.tags.length > 3 && (
                                    <Chip 
                                      label={`+${post.tags.length - 3}`} 
                                      size="small" 
                                      variant="outlined"
                                      sx={{ fontSize: '0.65rem', height: '18px', color: 'text.secondary' }}
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

                    {/* 더 불러오기 로딩 표시 */}
                    {loadingMore && (
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        py: 4 
                      }}>
                        <Loading variant="posts" message="추가 포스트를 불러오는 중..." />
                      </Box>
                    )}

                    {/* 포스트가 없는 경우 */}
                    {!loading && !loadingMore && filteredPosts.length === 0 && (
                      <Box sx={{ 
                        textAlign: 'center', 
                        py: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                      }}>
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {selectedCategory === 'all' ? '아직 작성된 포스트가 없습니다' : `${selectedCategory} 카테고리에 포스트가 없습니다`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          {selectedCategory === 'Study Journal' 
                            ? '새로운 학습 여정을 기록해보세요 📝' 
                            : selectedCategory === 'Tech Insights'
                            ? '기술 인사이트를 공유해보세요 💡'
                            : selectedCategory === 'Code Solutions'
                            ? '코드 솔루션을 공유해보세요 🔧'
                            : '첫 번째 포스트를 작성해보세요 ✨'
                          }
                        </Typography>
                      </Box>
                    )}

                    {/* 더 이상 불러올 포스트가 없을 때 */}
                    {!hasMorePosts && filteredPosts.length > 0 && (
                      <Box sx={{ 
                        textAlign: 'center', 
                        py: 4,
                        borderTop: '1px solid',
                        borderTopColor: 'divider',
                        mt: 4
                      }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          모든 포스트를 확인했습니다 ✨
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </Container>
        </main>
        
        <Footer ref={footerRef} />

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