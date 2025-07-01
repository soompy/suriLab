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
  Badge,
  CircularProgress
} from '@mui/material'
import {
  Archive as ArchiveIcon,
  DateRange as DateIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Visibility as ViewIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material'
import MuiThemeProvider from '@/components/MuiThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  BlogPost,
  ArchiveData,
  groupPostsByYearAndMonth,
  getFilteredArchiveData,
  getYearStats,
  getMonthStats,
  formatDate,
  formatViews
} from '@/utils/archiveHelpers'
import { CATEGORY_COLORS } from '@/shared/constants/categories'
import SkillTag from '@/components/SkillTag'

export default function Archives() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedYears, setExpandedYears] = useState<string[]>(['2024'])
  const [expandedMonths, setExpandedMonths] = useState<{ [key: string]: string[] }>({})
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [archiveData, setArchiveData] = useState<ArchiveData>({})
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
            const transformedPosts: BlogPost[] = posts.map((post: {
              id: string;
              title: string;
              excerpt?: string;
              tags?: (string | { name: string })[];
              category: string;
              publishedAt: string;
              readTime?: number;
              views?: number;
              featured?: boolean;
              slug: string;
            }) => ({
              id: post.id,
              title: post.title,
              excerpt: post.excerpt || '',
              tags: Array.isArray(post.tags) ? post.tags.map((tag: string | { name: string }) => typeof tag === 'string' ? tag : tag.name) : [],
              category: post.category,
              publishedAt: post.publishedAt,
              readTime: post.readTime || 5,
              views: Number(post.views) || 0,
              featured: post.featured || false,
              slug: post.slug
            }))
            
            setAllPosts(transformedPosts)
            // 아카이브 데이터 생성
            const groupedData = groupPostsByYearAndMonth(transformedPosts)
            setArchiveData(groupedData)
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

  // 카테고리 목록
  const categories = Array.from(new Set(allPosts.map(post => post.category)))

  // 필터링된 아카이브 데이터 계산
  const filteredArchiveData = getFilteredArchiveData(archiveData, searchQuery, selectedCategory)
  const sortedYears = Object.keys(filteredArchiveData).sort((a, b) => parseInt(b) - parseInt(a))


  const handleYearToggle = (year: string) => {
    setExpandedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    )
  }

  const handleMonthToggle = (year: string, month: number) => {
    const monthKey = `${year}-${month}`
    setExpandedMonths(prev => ({
      ...prev,
      [year]: prev[year]?.includes(monthKey)
        ? prev[year].filter(m => m !== monthKey)
        : [...(prev[year] || []), monthKey]
    }))
  }

  const handlePostClick = (post: BlogPost) => {
    const slug = post.slug || post.title.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/(^-|-$)/g, '')
    window.location.href = `/posts/${slug}`
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
          
          <Container maxWidth={false} sx={{ maxWidth: { xs: '100%', md: '1200px' }, mx: 'auto', px: { xs: 2, sm: 3, md: 2 }, py: { xs: 3, sm: 4, md: 6 } }}>
            {/* 헤더 스켈레톤 */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Box sx={{
                width: 200,
                height: 48,
                backgroundColor: 'grey.300',
                borderRadius: 1,
                mx: 'auto',
                mb: 2,
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
              <Box sx={{
                width: 400,
                height: 24,
                backgroundColor: 'grey.200',
                borderRadius: 1,
                mx: 'auto'
              }} />
            </Box>

            {/* 통계 섹션 스켈레톤 */}
            <Paper sx={{ p: 4, mb: 6, textAlign: 'center', boxShadow: 'none' }}>
              <Box sx={{
                width: 120,
                height: 24,
                backgroundColor: 'grey.300',
                borderRadius: 1,
                mx: 'auto',
                mb: 2
              }} />
              <Box sx={{ 
                mt: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 4,
                justifyItems: 'center'
              }}>
                {[1, 2, 3, 4].map((index) => (
                  <Box key={index} sx={{ textAlign: 'center' }}>
                    <Box sx={{
                      width: 60,
                      height: 40,
                      backgroundColor: 'grey.300',
                      borderRadius: 1,
                      mb: 1,
                      animation: `pulse 1.5s ease-in-out infinite`,
                      animationDelay: `${index * 0.1}s`
                    }} />
                    <Box sx={{
                      width: 80,
                      height: 16,
                      backgroundColor: 'grey.200',
                      borderRadius: 1
                    }} />
                  </Box>
                ))}
              </Box>
            </Paper>

            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
              gap: 4
            }}>
              {/* 메인 콘텐츠 스켈레톤 */}
              <Box>
                {/* 검색 및 필터 스켈레톤 */}
                <Paper sx={{ p: 3, mb: 4, boxShadow: 'none' }}>
                  <Box sx={{
                    width: '100%',
                    height: 56,
                    backgroundColor: 'grey.200',
                    borderRadius: 1,
                    mb: 2
                  }} />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {[1, 2, 3].map((index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 80 + (index * 20),
                          height: 32,
                          backgroundColor: 'grey.200',
                          borderRadius: 2
                        }}
                      />
                    ))}
                  </Box>
                </Paper>

                {/* 년도별 섹션 스켈레톤 */}
                {[1, 2, 3].map((yearIndex) => (
                  <Paper key={yearIndex} sx={{ mb: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                    {/* 년도 헤더 스켈레톤 */}
                    <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: 'grey.300',
                        borderRadius: '50%'
                      }} />
                      <Box sx={{
                        width: 100,
                        height: 32,
                        backgroundColor: 'grey.300',
                        borderRadius: 1
                      }} />
                      <Box sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: 'grey.200',
                        borderRadius: '50%'
                      }} />
                      <Box sx={{
                        width: 80,
                        height: 24,
                        backgroundColor: 'grey.200',
                        borderRadius: 1
                      }} />
                    </Box>
                  </Paper>
                ))}
              </Box>

              {/* 사이드바 스켈레톤 */}
              <Box>
                <Box sx={{ position: 'sticky', top: 24 }}>
                  {/* 인기 포스트 스켈레톤 */}
                  <Paper sx={{ p: 3, mb: 3, boxShadow: 'none' }}>
                    <Box sx={{
                      width: 120,
                      height: 24,
                      backgroundColor: 'grey.300',
                      borderRadius: 1,
                      mb: 2
                    }} />
                    {[1, 2, 3, 4, 5].map((index) => (
                      <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Box sx={{
                          width: 24,
                          height: 24,
                          backgroundColor: 'grey.300',
                          borderRadius: 1
                        }} />
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{
                            width: '90%',
                            height: 16,
                            backgroundColor: 'grey.200',
                            borderRadius: 1,
                            mb: 1
                          }} />
                          <Box sx={{
                            width: 60,
                            height: 12,
                            backgroundColor: 'grey.200',
                            borderRadius: 1
                          }} />
                        </Box>
                      </Box>
                    ))}
                  </Paper>

                  {/* 카테고리별 포스트 스켈레톤 */}
                  <Paper sx={{ p: 3, boxShadow: 'none' }}>
                    <Box sx={{
                      width: 150,
                      height: 24,
                      backgroundColor: 'grey.300',
                      borderRadius: 1,
                      mb: 2
                    }} />
                    {[1, 2, 3].map((index) => (
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 1,
                        p: 1
                      }}>
                        <Box sx={{
                          width: 100,
                          height: 16,
                          backgroundColor: 'grey.200',
                          borderRadius: 1
                        }} />
                        <Box sx={{
                          width: 24,
                          height: 20,
                          backgroundColor: 'grey.200',
                          borderRadius: 1
                        }} />
                      </Box>
                    ))}
                  </Paper>
                </Box>
              </Box>
            </Box>

            {/* 로딩 메시지 */}
            <Box sx={{ 
              position: 'fixed',
              bottom: 24,
              right: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              backgroundColor: 'white',
              p: 2,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                아카이브를 불러오는 중...
              </Typography>
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
        
        <Container maxWidth={false} sx={{ maxWidth: { xs: '100%', md: '1300px' }, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 4, md: 6 } }}>
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
                    (실제값: {totalViews} - 샘플 데이터 포함)
                  </Typography>
                )}
              </Box>
            </Box>
          </Paper>

          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
            gap: { xs: 2, md: 4 },
            width: '100%',
            minWidth: 0,
            overflow: 'hidden'
          }}>
            {/* 메인 콘텐츠 */}
            <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
              {/* 검색 및 필터 */}
              <Paper sx={{ p: 3, mb: 4, boxShadow: 'none' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    placeholder="포스트 제목, 내용, 태그를 검색하세요..."
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
                  {(searchQuery.trim() !== '' || selectedCategory !== null) && (
                    <Button
                      variant="outlined"
                      startIcon={<SearchIcon />}
                      onClick={() => {
                        setSearchQuery('')
                        setSelectedCategory(null)
                      }}
                      sx={{ 
                        minWidth: 120,
                        height: '56px',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}
                    >
                      검색 초기화
                    </Button>
                  )}
                </Stack>
                
                {/* 카테고리 필터 */}
                <Box sx={{ 
                  mt: 2, 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  alignItems: 'center',
                  width: '100%',
                  overflow: 'hidden'
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
                        maxWidth: { xs: '100px', sm: '120px' },
                        '& .MuiChip-label': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Paper>

              {/* 연도별/월별 포스트 목록 */}
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
                ) : sortedYears.length === 0 ? (
                  <Paper sx={{ p: 6, textAlign: 'center', boxShadow: 'none' }}>
                    <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {searchQuery.trim() !== '' 
                        ? `"${searchQuery}"에 대한 검색 결과가 없습니다`
                        : selectedCategory 
                          ? `"${selectedCategory}" 카테고리에 포스트가 없습니다`
                          : allPosts.length === 0
                            ? '아직 작성된 포스트가 없습니다'
                            : '조건에 맞는 포스트가 없습니다'
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchQuery.trim() !== '' 
                        ? '다른 검색어를 시도해보세요'
                        : selectedCategory
                          ? '다른 카테고리를 선택해보세요'
                          : allPosts.length === 0
                            ? '첫 번째 포스트를 작성해보세요 ✨'
                            : '다른 조건을 시도해보세요'
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
                        검색 초기화
                      </Button>
                    )}
                  </Paper>
                ) : (
                  sortedYears.map((year) => {
                    const yearData = filteredArchiveData[year]
                    const yearStats = getYearStats(yearData)
                    
                    return (
                      <Paper key={year} sx={{ mb: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                        {/* 연도 헤더 */}
                        <ListItemButton onClick={() => handleYearToggle(year)} sx={{ p: 3 }}>
                          <DateIcon sx={{ mr: 2, color: 'primary.main' }} />
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap', minWidth: 0 }}>
                                <Typography variant="h5" fontWeight="bold" sx={{ minWidth: 0, whiteSpace: 'nowrap' }}>
                                  {year}년
                                </Typography>
                                <Badge badgeContent={yearData.count} color="primary" />
                                <Chip 
                                  label={`${formatViews(yearData.totalViews)} views`} 
                                  size="small" 
                                  variant="outlined"
                                  icon={<ViewIcon />}
                                />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  {yearData.count}개의 포스트 • {yearStats.categoriesCount}개 카테고리 • {yearStats.tagsCount}개 태그
                                </Typography>
                              </Box>
                            }
                          />
                          {expandedYears.includes(year) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </ListItemButton>
                        
                        <Collapse in={expandedYears.includes(year)}>
                          <Box sx={{ px: 3, pb: 3 }}>
                            {/* 연도 통계 */}
                            <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.paper', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                              <Box sx={{ 
                                display: 'grid',
                                gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                                gap: 2
                              }}>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="h6" color="primary" fontWeight="bold">
                                    {yearData.count}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    포스트
                                  </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="h6" color="primary" fontWeight="bold">
                                    {formatViews(yearData.totalViews)}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    총 조회수
                                  </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="h6" color="primary" fontWeight="bold">
                                    {yearStats.categoriesCount}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    카테고리
                                  </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="h6" color="primary" fontWeight="bold">
                                    {formatViews(yearStats.averageViews)}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    평균 조회수
                                  </Typography>
                                </Box>
                              </Box>
                            </Paper>

                            {/* 월별 섹션 */}
                            <Stack spacing={2}>
                              {yearData.months.map((monthData) => {
                                const monthKey = `${year}-${monthData.month}`
                                const isMonthExpanded = expandedMonths[year]?.includes(monthKey)
                                const monthStats = getMonthStats(monthData)
                                
                                return (
                                  <Paper key={monthKey} sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                                    {/* 월 헤더 */}
                                    <ListItemButton 
                                      onClick={() => handleMonthToggle(year, monthData.month)}
                                      sx={{ p: 2, bgcolor: 'grey.25' }}
                                    >
                                      <CalendarIcon sx={{ mr: 2, color: 'secondary.main', fontSize: 20 }} />
                                      <ListItemText
                                        primary={
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Typography variant="h6" fontWeight="medium">
                                              {monthData.monthName}
                                            </Typography>
                                            <Badge badgeContent={monthData.count} color="secondary" />
                                            <Chip 
                                              label={`${formatViews(monthStats.totalViews)} views`} 
                                              size="small" 
                                              variant="outlined"
                                              sx={{ fontSize: '0.7rem' }}
                                            />
                                          </Box>
                                        }
                                        secondary={`${monthData.count}개의 포스트`}
                                      />
                                      {isMonthExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </ListItemButton>
                                    
                                    <Collapse in={isMonthExpanded}>
                                      <Box sx={{ p: 2 }}>
                                        <Stack spacing={2}>
                                          {monthData.posts.map((post) => (
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
                                                  transform: 'translateY(-2px)',
                                                  borderColor: 'primary.main',
                                                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                  backgroundColor: 'action.hover'
                                                }
                                              }}
                                              onClick={() => handlePostClick(post)}
                                            >
                                              <CardContent sx={{ p: 2 }}>
                                                <Box sx={{ mb: 1 }}>
                                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <Chip 
                                                      label={post.category} 
                                                      size="small" 
                                                      sx={{ 
                                                        fontSize: '0.7rem',
                                                        background: CATEGORY_COLORS[post.category as keyof typeof CATEGORY_COLORS] || 'linear-gradient(135deg, #f0f0f0, #e0e0e0)',
                                                        color: '#000000',
                                                        fontWeight: 'bold',
                                                        border: '1px solid rgba(0, 0, 0, 0.1)'
                                                      }}
                                                    />
                                                    {post.featured && (
                                                      <Chip label="Featured" size="small" color="secondary" />
                                                    )}
                                                    <Typography variant="caption" color="text.secondary">
                                                      {formatDate(post.publishedAt)}
                                                    </Typography>
                                                  </Box>
                                                  <Typography variant="body1" component="h4" sx={{ mb: 1, fontWeight: 'medium' }}>
                                                    {post.title}
                                                  </Typography>
                                                  <Typography 
                                                    variant="body2" 
                                                    color="text.secondary" 
                                                    sx={{ 
                                                      mb: 1.5, 
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
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                                                      {post.tags.slice(0, 4).map((tag) => (
                                                        <SkillTag 
                                                          key={tag} 
                                                          label={tag}
                                                          variant="small"
                                                        />
                                                      ))}
                                                      {post.tags.length > 4 && (
                                                        <Chip 
                                                          label={`+${post.tags.length - 4}`} 
                                                          size="small" 
                                                          variant="outlined"
                                                          sx={{ fontSize: '0.65rem', height: '18px', color: '#666' }}
                                                        />
                                                      )}
                                                    </Box>
                                                  )}
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                      <ScheduleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                      <Typography variant="caption" color="text.secondary">
                                                        {post.readTime}분
                                                      </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                      <ViewIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                      <Typography variant="caption" color="text.secondary">
                                                        {formatViews(post.views)}
                                                      </Typography>
                                                    </Box>
                                                  </Box>
                                                  <Typography variant="caption" color="text.secondary">
                                                    {new Date(post.publishedAt).toLocaleDateString('ko-KR', { 
                                                      month: 'short', 
                                                      day: 'numeric' 
                                                    })}
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
                            </Stack>
                          </Box>
                        </Collapse>
                      </Paper>
                    )
                  })
                )}
              </Box>
            </Box>

            {/* 사이드바 */}
            <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
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