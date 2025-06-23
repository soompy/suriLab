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
  slug?: string
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
        const response = await fetch('/api/posts?isPublished=true&limit=100')
        if (response.ok) {
          const data = await response.json()
          const posts = data.posts || []
          if (posts.length > 0) {
            // API 응답 데이터를 BlogPost 인터페이스에 맞게 변환
            const transformedPosts: BlogPost[] = posts.map((post: any) => ({
              id: post.id,
              title: post.title,
              excerpt: post.excerpt || '',
              tags: Array.isArray(post.tags) ? post.tags.map((tag: any) => typeof tag === 'string' ? tag : tag.name) : [],
              category: post.category,
              publishedAt: post.publishedAt,
              readTime: post.readTime || 5,
              views: Number(post.views) || 0,
              featured: post.featured || false,
              slug: post.slug
            }))
            
            setAllPosts(transformedPosts)
          }
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

  // 필터링된 포스트 계산
  const getFilteredPosts = () => {
    return Object.entries(postsByYear)
      .map(([year, posts]) => {
        const yearPosts = posts.filter(post => {
          // 카테고리 필터
          if (selectedCategory && post.category !== selectedCategory) {
            return false
          }
          
          // 검색어 필터
          if (searchQuery.trim() === '') {
            return true
          }
          
          const query = searchQuery.toLowerCase().trim()
          const title = (post.title || '').toLowerCase()
          const excerpt = (post.excerpt || '').toLowerCase()
          const category = (post.category || '').toLowerCase()
          const tags = post.tags || []
          
          return title.includes(query) ||
                 excerpt.includes(query) ||
                 category.includes(query) ||
                 tags.some(tag => (tag || '').toLowerCase().includes(query))
        })
        return { year, posts: yearPosts }
      })
      .filter(({ posts }) => posts.length > 0)
      .sort((a, b) => parseInt(b.year) - parseInt(a.year))
  }

  const filteredPosts = getFilteredPosts()


  const handleYearToggle = (year: string) => {
    setExpandedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    )
  }

  const handlePostClick = (post: BlogPost) => {
    const slug = post.slug || post.title.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/(^-|-$)/g, '')
    window.location.href = `/posts/${slug}`
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

  const totalViews = allPosts.reduce((sum, post) => sum + (post.views || 0), 0)
  const totalTags = new Set(allPosts.flatMap(post => post.tags || [])).size
  
  // 조회수 계산 디버깅
  useEffect(() => {
    if (allPosts.length > 0) {
      console.log('📊 Archives 통계:')
      console.log('총 포스트:', allPosts.length)
      console.log('각 포스트 조회수:', allPosts.map(p => ({ title: p.title, views: p.views })))
      console.log('총 조회수:', totalViews)
    }
  }, [allPosts, totalViews])

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
                  {totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}k` : (totalViews || 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  총 조회수
                </Typography>
                {process.env.NODE_ENV === 'development' && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    (실제값: {totalViews})
                  </Typography>
                )}
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
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '56px'
                      }
                    }}
                  />
                  <Button
                    variant={selectedCategory === null ? "contained" : "outlined"}
                    startIcon={<FilterIcon />}
                    onClick={() => setSelectedCategory(null)}
                    sx={{ 
                      minWidth: 120,
                      height: '56px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                  >
                    모든 카테고리
                  </Button>
                </Stack>
                
                {/* 카테고리 필터 */}
                <Box sx={{ 
                  mt: 2, 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  alignItems: 'center'
                }}>
                  {categories.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                      color={selectedCategory === category ? 'primary' : 'default'}
                      variant={selectedCategory === category ? 'filled' : 'outlined'}
                      sx={{ 
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        '& .MuiChip-label': {
                          overflow: 'visible',
                          textOverflow: 'unset'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Paper>

              {/* 연도별 포스트 목록 */}
              <Box>
                {allPosts.length === 0 ? (
                  <Paper sx={{ p: 6, textAlign: 'center', boxShadow: 'none' }}>
                    <ArchiveIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      아직 작성된 포스트가 없습니다
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      첫 번째 포스트를 작성해보세요!
                    </Typography>
                  </Paper>
                ) : filteredPosts.length === 0 ? (
                  <Paper sx={{ p: 6, textAlign: 'center', boxShadow: 'none' }}>
                    <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {searchQuery.trim() !== '' 
                        ? `"${searchQuery}"에 대한 검색 결과가 없습니다`
                        : selectedCategory 
                          ? `"${selectedCategory}" 카테고리에 포스트가 없습니다`
                          : '조건에 맞는 포스트가 없습니다'
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchQuery.trim() !== '' 
                        ? '다른 검색어를 시도해보세요'
                        : '다른 카테고리를 선택해보세요'
                      }
                    </Typography>
                    {(searchQuery.trim() !== '' || selectedCategory) && (
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setSearchQuery('')
                          setSelectedCategory(null)
                        }}
                        sx={{ mt: 2 }}
                      >
                        모든 포스트 보기
                      </Button>
                    )}
                  </Paper>
                ) : (
                  filteredPosts.map(({ year, posts: yearPosts }) => (
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
                                    transition: 'all 0.3s ease',
                                    boxShadow: 'none',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    backgroundColor: 'background.paper',
                                    '&:hover': {
                                      transform: 'translateY(-4px)',
                                      borderColor: 'primary.main',
                                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                                      backgroundColor: 'grey.50'
                                    }
                                  }}
                                  onClick={() => handlePostClick(post)}
                                >
                                  <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ mb: 2 }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Chip 
                                          label={post.category} 
                                          size="small" 
                                          color="primary" 
                                          variant="outlined"
                                          sx={{ fontSize: '0.75rem' }}
                                        />
                                        {post.featured && (
                                          <Chip label="Featured" size="small" color="secondary" />
                                        )}
                                      </Box>
                                      <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
                                        {post.title}
                                      </Typography>
                                      <Typography 
                                        variant="body2" 
                                        color="text.secondary" 
                                        sx={{ 
                                          mb: 2, 
                                          lineHeight: 1.6,
                                          display: '-webkit-box',
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: 'vertical',
                                          overflow: 'hidden'
                                        }}
                                      >
                                        {post.excerpt}
                                      </Typography>
                                      {post.tags.length > 0 && (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                                          {post.tags.slice(0, 3).map((tag) => (
                                            <Chip 
                                              key={tag} 
                                              label={tag} 
                                              size="small" 
                                              sx={{ 
                                                fontSize: '0.7rem', 
                                                height: '20px',
                                                backgroundColor: getTagColor(tag),
                                                border: 'none',
                                                color: '#555',
                                                '&:hover': {
                                                  backgroundColor: getTagColor(tag)
                                                }
                                              }}
                                            />
                                          ))}
                                          {post.tags.length > 3 && (
                                            <Chip 
                                              label={`+${post.tags.length - 3}`} 
                                              size="small" 
                                              variant="outlined"
                                              sx={{ fontSize: '0.7rem', height: '20px' }}
                                            />
                                          )}
                                        </Box>
                                      )}
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
                    ))
                )}
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
                            '&:hover': { bgcolor: 'action.hover' },
                            bgcolor: selectedCategory === category ? 'primary.50' : 'transparent',
                            border: selectedCategory === category ? '1px solid' : 'none',
                            borderColor: selectedCategory === category ? 'primary.main' : 'transparent'
                          }}
                          onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                        >
                          <Typography 
                            variant="body2"
                            sx={{ 
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              flex: 1,
                              mr: 1,
                              fontWeight: selectedCategory === category ? 600 : 400,
                              color: selectedCategory === category ? 'primary.main' : 'text.primary'
                            }}
                          >
                            {category}
                          </Typography>
                          <Chip 
                            label={count} 
                            size="small" 
                            variant={selectedCategory === category ? "filled" : "outlined"}
                            color={selectedCategory === category ? "primary" : "default"}
                            sx={{ flexShrink: 0 }}
                          />
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