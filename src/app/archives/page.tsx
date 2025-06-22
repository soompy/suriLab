'use client'

import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  TextField,
  InputAdornment,
  Collapse,
  ListItemButton,
  ListItemText,
  Badge
} from '@mui/material'
import {
  Archive as ArchiveIcon,
  DateRange as DateIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Visibility as ViewIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material'
import MuiThemeProvider from '@/components/MuiThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  tags: string[]
  category: string
  publishedAt: string
  readTime: number
  views: number
  featured?: boolean
}

export default function Archives() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedYears, setExpandedYears] = useState<string[]>(['2024'])
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  // API에서 포스트 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts?isPublished=true')
        const data = await response.json()
        
        if (data.success && data.posts) {
          // API 응답 데이터를 BlogPost 인터페이스에 맞게 변환
          const transformedPosts: BlogPost[] = data.posts.map((post: BlogPost) => ({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            tags: post.tags,
            category: post.category,
            publishedAt: post.publishedAt,
            readTime: post.readTime,
            views: post.views || 0,
            featured: post.featured || false
          }))
          setAllPosts(transformedPosts)
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // 연도별로 포스트 그룹화
  const postsByYear = allPosts.reduce((acc, post) => {
    const year = new Date(post.publishedAt).getFullYear().toString()
    if (!acc[year]) acc[year] = []
    acc[year].push(post)
    return acc
  }, {} as Record<string, BlogPost[]>)

  // 카테고리 목록
  const categories = Array.from(new Set(allPosts.map(post => post.category)))


  const handleYearToggle = (year: string) => {
    setExpandedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    )
  }

  const handlePostClick = (post: BlogPost) => {
    const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    window.location.href = `/posts/${slug}`
  }

  const totalViews = allPosts.reduce((sum, post) => sum + post.views, 0)
  const totalTags = new Set(allPosts.flatMap(post => post.tags)).size

  if (loading) {
    return (
      <MuiThemeProvider>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Header />
          <Container maxWidth={false} sx={{ maxWidth: { xs: '100%', md: '1300px' }, mx: 'auto', px: 4, py: 6 }}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6">Loading...</Typography>
            </Box>
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
        
        <Container maxWidth={false} sx={{ maxWidth: { xs: '100%', md: '1300px' }, mx: 'auto', px: 4, py: 6 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Archives
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              지금까지 작성한 모든 블로그 글들을 한눈에 둘러보세요. 
              카테고리별, 연도별로 정리되어 있습니다.
            </Typography>
          </Box>

          {/* 통계 섹션 */}
          <Paper sx={{ p: 4, mb: 6, textAlign: 'center', boxShadow: 'none' }}>
            <Typography variant="h6" gutterBottom>
              블로그 현황
            </Typography>
            <Box sx={{ 
              mt: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 4,
              justifyItems: 'center'
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {allPosts.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  총 포스트
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {categories.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  카테고리
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {totalTags}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  태그
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {(totalViews / 1000).toFixed(1)}k
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  총 조회수
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
            gap: 4
          }}>
            {/* 메인 콘텐츠 */}
            <Box>
              {/* 검색 및 필터 */}
              <Paper sx={{ p: 3, mb: 4, boxShadow: 'none' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                  <TextField
                    fullWidth
                    placeholder="제목, 내용, 태그로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<FilterIcon />}
                    onClick={() => setSelectedCategory(null)}
                    sx={{ minWidth: 120 }}
                  >
                    모든 카테고리
                  </Button>
                </Stack>
                
                {/* 카테고리 필터 */}
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {categories.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                      color={selectedCategory === category ? 'primary' : 'default'}
                      variant={selectedCategory === category ? 'filled' : 'outlined'}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Paper>

              {/* 연도별 포스트 목록 */}
              <Box>
                {Object.entries(postsByYear)
                  .sort(([a], [b]) => parseInt(b) - parseInt(a))
                  .map(([year, posts]) => {
                    const yearPosts = posts.filter(post => 
                      selectedCategory ? post.category === selectedCategory : true
                    ).filter(post =>
                      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                    )

                    if (yearPosts.length === 0) return null

                    return (
                      <Paper key={year} sx={{ mb: 3, boxShadow: 'none' }}>
                        <ListItemButton onClick={() => handleYearToggle(year)} sx={{ p: 3 }}>
                          <DateIcon sx={{ mr: 2, color: 'primary.main' }} />
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="h5" fontWeight="bold">
                                  {year}
                                </Typography>
                                <Badge badgeContent={yearPosts.length} color="primary" />
                              </Box>
                            }
                            secondary={`${yearPosts.length}개의 포스트`}
                          />
                          {expandedYears.includes(year) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </ListItemButton>
                        
                        <Collapse in={expandedYears.includes(year)}>
                          <Box sx={{ px: 3, pb: 3 }}>
                            <Stack spacing={2}>
                              {yearPosts.map((post) => (
                                <Card
                                  key={post.id}
                                  sx={{
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: 'none',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    '&:hover': {
                                      transform: 'translateY(-2px)',
                                      borderColor: 'primary.main',
                                    }
                                  }}
                                  onClick={() => handlePostClick(post)}
                                >
                                  <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                      <Box sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                          <Typography variant="h6" component="h3">
                                            {post.title}
                                          </Typography>
                                          {post.featured && (
                                            <Chip label="Featured" size="small" color="primary" />
                                          )}
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                          {post.excerpt}
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                                          {post.tags.map((tag) => (
                                            <Chip key={tag} label={tag} size="small" variant="outlined" />
                                          ))}
                                        </Box>
                                      </Box>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                          <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                          <Typography variant="body2" color="text.secondary">
                                            {post.readTime}분
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                          <ViewIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                          <Typography variant="body2" color="text.secondary">
                                            {post.views.toLocaleString()}
                                          </Typography>
                                        </Box>
                                      </Box>
                                      <Typography variant="body2" color="text.secondary">
                                        {new Date(post.publishedAt).toLocaleDateString('ko-KR')}
                                      </Typography>
                                    </Box>
                                  </CardContent>
                                </Card>
                              ))}
                            </Stack>
                          </Box>
                        </Collapse>
                      </Paper>
                    )
                  })}
              </Box>
            </Box>

            {/* 사이드바 */}
            <Box>
              <Box sx={{ position: 'sticky', top: 24 }}>
                {/* 인기 포스트 */}
                <Paper sx={{ p: 3, mb: 3, boxShadow: 'none' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                    <Typography variant="h6">
                      인기 포스트
                    </Typography>
                  </Box>
                  <Stack spacing={2}>
                    {allPosts
                      .sort((a, b) => b.views - a.views)
                      .slice(0, 5)
                      .map((post, index) => (
                        <Box
                          key={post.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2,
                            cursor: 'pointer',
                            p: 1,
                            borderRadius: 1,
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                          onClick={() => handlePostClick(post)}
                        >
                          <Typography
                            variant="h6"
                            color="primary"
                            sx={{ minWidth: 24, textAlign: 'center' }}
                          >
                            {index + 1}
                          </Typography>
                          <Box>
                            <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>
                              {post.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {post.views.toLocaleString()} views
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                  </Stack>
                </Paper>

                {/* 카테고리별 포스트 수 */}
                <Paper sx={{ p: 3, boxShadow: 'none' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ArchiveIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                    <Typography variant="h6">
                      카테고리별 포스트
                    </Typography>
                  </Box>
                  <Stack spacing={1}>
                    {categories.map((category) => {
                      const count = allPosts.filter(post => post.category === category).length
                      return (
                        <Box
                          key={category}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            p: 1,
                            borderRadius: 1,
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                          onClick={() => setSelectedCategory(category)}
                        >
                          <Typography variant="body2">
                            {category}
                          </Typography>
                          <Chip label={count} size="small" variant="outlined" />
                        </Box>
                      )
                    })}
                  </Stack>
                </Paper>
              </Box>
            </Box>
          </Box>
        </Container>
        
        <Footer />
      </Box>
    </MuiThemeProvider>
  )
}