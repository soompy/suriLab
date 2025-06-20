'use client'

import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Collapse,
  List,
  ListItem,
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
  Article as ArticleIcon,
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
  summary: string
  tags: string[]
  category: string
  createdAt: string
  readTime: number
  views: number
  featured?: boolean
}

export default function Archives() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedYears, setExpandedYears] = useState<string[]>(['2024'])

  // 더미 데이터 - 실제로는 API에서 가져올 데이터
  const allPosts: BlogPost[] = [
    {
      id: '1',
      title: 'React Hooks로 시작하는 모던 React 개발',
      summary: 'React Hooks를 활용한 모던 컴포넌트 개발 방법과 실무 활용 팁',
      tags: ['React', 'JavaScript', 'Frontend'],
      category: 'Tech Insights',
      createdAt: '2024-01-15T10:00:00Z',
      readTime: 8,
      views: 1247,
      featured: true
    },
    {
      id: '2',
      title: 'TypeScript와 Next.js로 타입 안전한 웹 개발',
      summary: 'Next.js에서 TypeScript를 활용한 타입 안전한 개발 환경 구축',
      tags: ['TypeScript', 'Next.js', 'WebDev'],
      category: 'Tech Insights',
      createdAt: '2024-01-12T14:30:00Z',
      readTime: 12,
      views: 2103
    },
    {
      id: '3',
      title: 'CSS Grid와 Flexbox: 모던 레이아웃 완벽 가이드',
      summary: 'CSS Grid와 Flexbox를 활용한 현대적인 웹 레이아웃 구현 방법',
      tags: ['CSS', 'Layout', 'Design'],
      category: 'Code Solutions',
      createdAt: '2024-01-08T09:15:00Z',
      readTime: 10,
      views: 1856
    },
    {
      id: '4',
      title: 'Node.js와 Express로 RESTful API 설계하기',
      summary: 'Node.js 기반 RESTful API 설계와 구현을 위한 실무 가이드',
      tags: ['Node.js', 'API', 'Backend'],
      category: 'Code Solutions',
      createdAt: '2024-01-05T16:45:00Z',
      readTime: 15,
      views: 3204
    },
    {
      id: '5',
      title: '웹 성능 최적화: 실무에서 바로 적용할 수 있는 기법들',
      summary: '웹 성능 최적화를 위한 실용적인 기법과 도구 활용법',
      tags: ['Performance', 'Optimization', 'Web'],
      category: 'Developer Tips',
      createdAt: '2024-01-02T11:20:00Z',
      readTime: 11,
      views: 1923
    },
    {
      id: '6',
      title: 'Git 워크플로우: 팀 개발을 위한 브랜치 전략',
      summary: '팀 개발 효율성을 높이는 Git 브랜치 전략과 워크플로우',
      tags: ['Git', 'Workflow', 'Team'],
      category: 'Developer Tips',
      createdAt: '2023-12-28T13:30:00Z',
      readTime: 9,
      views: 1445
    },
    {
      id: '7',
      title: 'Docker로 개발 환경 표준화하기',
      summary: 'Docker를 활용한 개발 환경 컨테이너화와 표준화 가이드',
      tags: ['Docker', 'DevOps', 'Container'],
      category: 'Developer Tips',
      createdAt: '2023-12-25T10:00:00Z',
      readTime: 13,
      views: 2567
    },
    {
      id: '8',
      title: 'AWS로 시작하는 클라우드 네이티브 개발',
      summary: 'AWS 클라우드 서비스를 활용한 서버리스 애플리케이션 개발',
      tags: ['AWS', 'Cloud', 'Serverless'],
      category: 'Tech Insights',
      createdAt: '2023-12-20T15:45:00Z',
      readTime: 16,
      views: 2890
    }
  ]

  // 연도별로 포스트 그룹화
  const postsByYear = allPosts.reduce((acc, post) => {
    const year = new Date(post.createdAt).getFullYear().toString()
    if (!acc[year]) acc[year] = []
    acc[year].push(post)
    return acc
  }, {} as Record<string, BlogPost[]>)

  // 카테고리 목록
  const categories = Array.from(new Set(allPosts.map(post => post.category)))

  // 필터링된 포스트
  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = !selectedCategory || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
            <Grid container spacing={4} sx={{ mt: 2, justifyContent: 'center' }}>
              <Grid item xs={6} md={3} sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {allPosts.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  총 포스트
                </Typography>
              </Grid>
              <Grid item xs={6} md={3} sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {categories.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  카테고리
                </Typography>
              </Grid>
              <Grid item xs={6} md={3} sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {totalTags}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  태그
                </Typography>
              </Grid>
              <Grid item xs={6} md={3} sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {(totalViews / 1000).toFixed(1)}k
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  총 조회수
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Grid container spacing={4}>
            {/* 메인 콘텐츠 */}
            <Grid item xs={12} lg={8}>
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
                      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
                                          {post.summary}
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
                                        {new Date(post.createdAt).toLocaleDateString('ko-KR')}
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
            </Grid>

            {/* 사이드바 */}
            <Grid item xs={12} lg={4}>
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
            </Grid>
          </Grid>
        </Container>
        
        <Footer />
      </Box>
    </MuiThemeProvider>
  )
}