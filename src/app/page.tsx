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
  Stack
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
import { BLOG_CATEGORIES, CATEGORY_DESCRIPTIONS, CATEGORY_COLORS } from '@/shared/constants/categories'

type BlogCategory = typeof BLOG_CATEGORIES[number]

export default function HomePage() {
  const router = useRouter()
  const [posts, setPosts] = useState<PostEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isSticky, setIsSticky] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts')
        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts || [])
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
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
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography>Loading posts...</Typography>
                  </Box>
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
                              {formatDate(post.publishedAt)}
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
      </div>
    </MuiThemeProvider>
  )
}