'use client'

import { useState, useEffect } from 'react'
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Chip, 
  Tabs, 
  Tab,
  Paper,
  Stack,
  Divider
} from '@mui/material'
import {
  TrendingUp as TrendingIcon,
  Schedule as ScheduleIcon,
  Visibility as ViewIcon,
  Category as CategoryIcon
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import MuiThemeProvider from '@/components/MuiThemeProvider'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'
import { PostEntity } from '@/entities/Post'
import { BLOG_CATEGORIES, CATEGORY_DESCRIPTIONS, CATEGORY_COLORS, BlogCategory } from '@/shared/constants/categories'

export default function Home() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'all'>('all')
  const [posts, setPosts] = useState<PostEntity[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async (category?: BlogCategory) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        isPublished: 'true',
        limit: '9',
        sortField: 'publishedAt',
        sortOrder: 'desc'
      })
      
      if (category) {
        params.append('category', category)
      }

      const response = await fetch(`/api/posts?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(selectedCategory === 'all' ? undefined : selectedCategory)
  }, [selectedCategory])

  const handleCategoryChange = (_: React.SyntheticEvent, newValue: BlogCategory | 'all') => {
    setSelectedCategory(newValue)
  }

  const handlePostClick = (post: PostEntity) => {
    router.push(`/posts/${post.slug}`)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
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
            {/* Category Tabs */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
                Latest Posts
              </Typography>
              
              <Paper sx={{ mb: 4 }}>
                <Tabs
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  variant="fullWidth"
                  textColor="primary"
                  indicatorColor="primary"
                >
                  <Tab label="All Posts" value="all" />
                  {BLOG_CATEGORIES.map((category) => (
                    <Tab key={category} label={category} value={category} />
                  ))}
                </Tabs>
              </Paper>

              {/* Category Description */}
              {selectedCategory !== 'all' && (
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                  <Chip
                    icon={<CategoryIcon />}
                    label={selectedCategory}
                    sx={{
                      backgroundColor: getCategoryInfo(selectedCategory).color,
                      color: 'white',
                      fontWeight: 'bold',
                      mb: 2
                    }}
                  />
                  <Typography variant="body1" color="text.secondary">
                    {getCategoryInfo(selectedCategory).description}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Posts Grid */}
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography>Loading posts...</Typography>
              </Box>
            ) : (
              <Grid container spacing={4}>
                {posts.map((post) => (
                  <Grid item xs={12} md={6} lg={4} key={post.id}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4
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
                              backgroundColor: getCategoryInfo(post.category as BlogCategory).color,
                              color: 'white',
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
                        
                        <Typography variant="h6" component="h3" gutterBottom>
                          {post.title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {post.excerpt}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                          {post.tags.slice(0, 3).map((tag) => (
                            <Chip key={tag} label={tag} size="small" variant="outlined" />
                          ))}
                          {post.tags.length > 3 && (
                            <Chip label={`+${post.tags.length - 3}`} size="small" variant="outlined" />
                          )}
                        </Box>
                      </CardContent>
                      
                      <Divider />
                      
                      <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {post.readTime}분
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
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {posts.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  {selectedCategory === 'all' 
                    ? '아직 게시된 포스트가 없습니다.' 
                    : `${selectedCategory} 카테고리에 게시된 포스트가 없습니다.`
                  }
                </Typography>
              </Box>
            )}

            {/* View All Posts Button */}
            {posts.length > 0 && (
              <Box sx={{ textAlign: 'center', mt: 6 }}>
                <Button 
                  variant="outlined" 
                  size="large"
                  onClick={() => router.push('/archives')}
                >
                  View All Posts
                </Button>
              </Box>
            )}
          </Container>
        </main>
        
        <Footer />
      </div>
    </MuiThemeProvider>
  )
}