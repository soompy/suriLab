'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Paper,
  Snackbar,
  Stack,
  Typography
} from '@mui/material'
import {
  ArrowForward as ArrowForwardIcon,
  AutoAwesome as AutoAwesomeIcon,
  Category as CategoryIcon,
  MailOutline as MailOutlineIcon,
  RocketLaunch as RocketLaunchIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as ViewIcon
} from '@mui/icons-material'
import MuiThemeProvider from '@/components/MuiThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'
import SkillTag from '@/components/SkillTag'
import { AvatarImage, ThumbnailImage } from '@/components/image'
import { BLOG_CONFIG } from '@/config/blog'
import { PostEntity } from '@/entities/Post'
import { BLOG_CATEGORIES, CATEGORY_COLORS, CATEGORY_DESCRIPTIONS } from '@/shared/constants/categories'

type BlogCategory = typeof BLOG_CATEGORIES[number]

const editorialCategories = [
  'MomentTune',
  'Startup',
  'AI Automation',
  'Product & UX',
  'Build Log',
  'Blog Growth'
] as const

const MOMENT_TUNE_START_DATE = new Date('2026-06-29T00:00:00+09:00')
const MOMENT_TUNE_TOTAL_WEEKS = 14
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000

export default function HomePage() {
  const router = useRouter()
  const latestSectionRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)
  const previousPostCountRef = useRef(0)
  const [posts, setPosts] = useState<PostEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [newPostAdded, setNewPostAdded] = useState(false)

  const fetchPosts = useCallback(async (showNotification = false) => {
    try {
      if (!showNotification) setLoading(true)

      const response = await fetch('/api/posts?sortField=publishedAt&sortOrder=desc&limit=18&page=1')
      if (!response.ok) return

      const data = await response.json()
      const nextPosts = data.posts || []

      if (showNotification && previousPostCountRef.current > 0 && nextPosts.length > previousPostCountRef.current) {
        setNewPostAdded(true)
      }

      setPosts(nextPosts)
      previousPostCountRef.current = nextPosts.length
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()

    const handleFocus = () => fetchPosts(true)
    window.addEventListener('focus', handleFocus)

    return () => window.removeEventListener('focus', handleFocus)
  }, [fetchPosts])

  const publishedPosts = useMemo(
    () => posts.filter((post) => post.isPublished && !post.draft),
    [posts]
  )

  const categoryCounts = useMemo(() => {
    return publishedPosts.reduce<Record<string, number>>((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1
      return acc
    }, {})
  }, [publishedPosts])

  const latestPosts = useMemo(() => {
    const source = selectedCategory === 'all'
      ? publishedPosts
      : publishedPosts.filter((post) => post.category === selectedCategory)

    return source.slice(0, 6)
  }, [publishedPosts, selectedCategory])

  const momentTunePost = useMemo(() => {
    return publishedPosts.find((post) => post.category === 'MomentTune' && post.featured)
      || publishedPosts.find((post) => post.category === 'MomentTune')
      || publishedPosts[0]
  }, [publishedPosts])

  const recommendedPosts = useMemo(() => {
    const featured = publishedPosts.filter((post) => post.featured && post.id !== momentTunePost?.id)
    const popular = [...publishedPosts]
      .filter((post) => post.id !== momentTunePost?.id)
      .sort((a, b) => (b.views || 0) - (a.views || 0))

    return [...featured, ...popular]
      .filter((post, index, list) => list.findIndex((item) => item.id === post.id) === index)
      .slice(0, 3)
  }, [momentTunePost?.id, publishedPosts])

  const momentTuneWeek = useMemo(() => {
    const elapsedWeeks = Math.ceil(
      Math.max(Date.now() - MOMENT_TUNE_START_DATE.getTime(), 0) / MS_PER_WEEK
    )

    return Math.min(Math.max(elapsedWeeks + 1, 1), MOMENT_TUNE_TOTAL_WEEKS)
  }, [])

  const handlePostClick = (post: PostEntity) => {
    router.push(`/posts/${post.slug}`)
  }

  const scrollToLatest = () => {
    latestSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    window.setTimeout(scrollToLatest, 80)
  }

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    return CATEGORY_COLORS[category as BlogCategory] || 'linear-gradient(135deg, #F3F4F6, #E5E7EB)'
  }

  const renderArticleCard = (post: PostEntity, variant: 'large' | 'compact' = 'compact') => (
    <Card
      key={post.id}
      onClick={() => handlePostClick(post)}
      sx={{
        height: '100%',
        cursor: 'pointer',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        boxShadow: 'none',
        overflow: 'hidden',
        bgcolor: 'background.paper',
        transition: 'transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: 'primary.main',
          bgcolor: 'action.hover'
        }
      }}
    >
      <ThumbnailImage
        src={post.thumbnail || undefined}
        alt={post.title}
        width={variant === 'large' ? 760 : 420}
        height={variant === 'large' ? 300 : 180}
        aspectRatio={variant === 'large' ? 16 / 7 : 16 / 10}
        fallbackText={post.category}
        borderRadius={0}
        hoverEffect={false}
        style={{ width: '100%' }}
      />
      <CardContent sx={{ p: { xs: 2.25, md: variant === 'large' ? 3 : 2.5 } }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip
            label={post.category}
            size="small"
            sx={{
              background: getCategoryColor(post.category),
              color: '#111827',
              fontWeight: 700
            }}
          />
          {post.series && <Chip label={post.series} size="small" variant="outlined" />}
        </Stack>

        <Typography
          variant={variant === 'large' ? 'h4' : 'h6'}
          component="h3"
          sx={{
            mb: 1.25,
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: 0
          }}
        >
          {post.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            lineHeight: 1.7,
            display: '-webkit-box',
            WebkitLineClamp: variant === 'large' ? 3 : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {post.description || post.excerpt}
        </Typography>

        {post.tags.length > 0 && (
          <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
            {post.tags.slice(0, 3).map((tag) => (
              <SkillTag key={tag} label={tag} variant="small" />
            ))}
          </Stack>
        )}

        <Stack direction="row" spacing={2} alignItems="center" color="text.secondary">
          <Stack direction="row" spacing={0.5} alignItems="center">
            <ScheduleIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">{post.readTime || 1}분</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <ViewIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">{(post.views || 0).toLocaleString()}</Typography>
          </Stack>
          <Typography variant="caption">{formatDate(post.publishedAt)}</Typography>
        </Stack>
      </CardContent>
    </Card>
  )

  return (
    <MuiThemeProvider>
      <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAF8' }}>
        <Header />

        <main>
          <Box
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: '#FAFAF8'
            }}
          >
            <Container maxWidth="lg" sx={{ pt: { xs: 7, md: 10 }, pb: { xs: 6, md: 9 } }}>
              <Stack spacing={{ xs: 5, md: 7 }}>
                <Box sx={{ maxWidth: 920 }}>
                  <Chip
                    icon={<AutoAwesomeIcon />}
                    label="Building AI Products in Public"
                    variant="outlined"
                    sx={{ mb: 3, bgcolor: '#FFFFFF' }}
                  />
                  <Typography
                    variant="h1"
                    sx={{
                      maxWidth: 920,
                      fontSize: { xs: '2.7rem', sm: '3.8rem', md: '5.25rem' },
                      lineHeight: 1.4,
                      fontWeight: 850,
                      letterSpacing: 0,
                      color: '#111827',
                      mb: 3
                    }}
                  >
                    실험하고 만들고
                    <br />
                    기록합니다.
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{
                      maxWidth: 720,
                      lineHeight: 1.75,
                      fontWeight: 400,
                      mb: 4
                    }}
                  >
                    MomentTune 제작 과정, 1인 창업, AI 자동화, 제품 기획과 블로그 성장 실험을
                    차분하게 축적하는 AI 창업 매거진입니다.
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      onClick={scrollToLatest}
                      sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' }, borderRadius: 999 }}
                    >
                      글 읽기
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => handleCategorySelect('MomentTune')}
                      sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' }, borderRadius: 999, bgcolor: '#FFFFFF' }}
                    >
                      MomentTune 기록 보기
                    </Button>
                  </Stack>
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1.4fr 0.9fr' },
                    gap: 2.5,
                    alignItems: 'stretch'
                  }}
                >
                  <Paper
                    sx={{
                      p: { xs: 2.5, md: 3 },
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      boxShadow: 'none',
                      bgcolor: '#FFFFFF'
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <RocketLaunchIcon color="primary" />
                      <Typography variant="overline" color="primary" sx={{ fontWeight: 800 }}>
                        Current Mission
                      </Typography>
                    </Stack>
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 800, mb: 1 }}>
                      MomentTune
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.7, mb: 3 }}>
                      감정과 순간에 맞는 음악 경험을 제품으로 만드는 과정. 아이디어, MVP,
                      사용자 흐름, 출시 준비를 독립 서비스처럼 추적합니다.
                    </Typography>
                    <Box sx={{ height: 8, borderRadius: 999, bgcolor: '#E5E7EB', overflow: 'hidden', mb: 1.5 }}>
                      <Box sx={{ width: '28%', height: '100%', bgcolor: '#22C55E' }} />
                    </Box>
                    <Stack direction="row" justifyContent="space-between" color="text.secondary">
                      <Typography variant="caption">Week {momentTuneWeek} / {MOMENT_TUNE_TOTAL_WEEKS}</Typography>
                      <Typography variant="caption">MVP discovery</Typography>
                    </Stack>
                  </Paper>

                  <Paper
                    sx={{
                      p: { xs: 2.5, md: 3 },
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      boxShadow: 'none',
                      bgcolor: '#FFFFFF'
                    }}
                  >
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
                      Magazine Focus
                    </Typography>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                      {['제품 제작의 실제 기록', 'AI 도구를 활용한 실행 과정', '작은 실험에서 배우는 창업 감각'].map((item) => (
                        <Stack key={item} direction="row" spacing={1.5} alignItems="center">
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#1D4ED8' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Paper>
                </Box>
              </Stack>
            </Container>
          </Box>

          <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
            {loading ? (
              <Loading variant="posts" message="매거진을 불러오는 중..." />
            ) : (
              <Stack spacing={{ xs: 6, md: 9 }}>
                {momentTunePost && (
                  <Box>
                    <SectionHeader
                      eyebrow="Featured"
                      title="MomentTune 최신 제작 기록"
                      description="블로그 전체가 특정 제품의 홍보 페이지가 되지 않도록, 제작 기록은 독립된 섹션으로 차분하게 분리했습니다."
                    />
                    {renderArticleCard(momentTunePost, 'large')}
                  </Box>
                )}

                <Box>
                  <SectionHeader
                    eyebrow="Explore"
                    title="카테고리 바로가기"
                    description="관심 있는 주제로 이동해 최신 기록을 빠르게 살펴보세요."
                  />
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                      gap: 1.5
                    }}
                  >
                    {editorialCategories.map((category) => (
                      <Button
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        sx={{
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          textAlign: 'left',
                          p: 2,
                          minHeight: 112,
                          border: '1px solid',
                          borderColor: selectedCategory === category ? 'primary.main' : 'divider',
                          borderRadius: 2,
                          color: 'text.primary',
                          bgcolor: '#FFFFFF',
                          textTransform: 'none',
                          transition: 'transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            borderColor: 'primary.main',
                            bgcolor: 'action.hover'
                          }
                        }}
                      >
                        <Box>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <CategoryIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                              {category}
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
                            {CATEGORY_DESCRIPTIONS[category]}
                          </Typography>
                        </Box>
                        <Chip label={categoryCounts[category] || 0} size="small" />
                      </Button>
                    ))}
                  </Box>
                </Box>

                <Box ref={latestSectionRef}>
                  <SectionHeader
                    eyebrow="Latest Essays"
                    title={selectedCategory === 'all' ? '최신 글' : `${selectedCategory} 최신 글`}
                    description="제품 제작, 창업 실험, AI 활용 경험을 시간순으로 읽을 수 있습니다."
                    action={
                      selectedCategory !== 'all' ? (
                        <Button size="small" onClick={() => setSelectedCategory('all')}>
                          전체 보기
                        </Button>
                      ) : undefined
                    }
                  />
                  {latestPosts.length > 0 ? (
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' },
                        gap: 2.5,
                        minWidth: 0
                      }}
                    >
                      {latestPosts.map((post) => renderArticleCard(post))}
                    </Box>
                  ) : (
                    <EmptyState selectedCategory={selectedCategory} />
                  )}
                </Box>

                {recommendedPosts.length > 0 && (
                  <Box>
                    <SectionHeader
                      eyebrow="Recommended"
                      title="인기 또는 추천 글"
                      description="조회수와 추천 표시를 기준으로 다시 읽을 만한 글을 모았습니다."
                    />
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                        gap: 2.5
                      }}
                    >
                      {recommendedPosts.map((post) => renderArticleCard(post))}
                    </Box>
                  </Box>
                )}

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 2.5
                  }}
                >
                  <Paper
                    sx={{
                      p: { xs: 2.5, md: 3 },
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      boxShadow: 'none'
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                      <TrendingUpIcon color="primary" />
                      <Typography variant="overline" color="primary" sx={{ fontWeight: 800 }}>
                        In Progress
                      </Typography>
                    </Stack>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 800, mb: 1 }}>
                      현재 진행 중인 프로젝트
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.75, mb: 2 }}>
                      MomentTune의 MVP 검증, 콘텐츠 아키텍처 정리, AI 코딩 워크플로우 개선을 병렬로 진행하고 있습니다.
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Stack spacing={1.25}>
                      {['MVP 사용자 흐름 정리', 'AI 자동화 실험 기록화', '검색 유입형 콘텐츠 설계'].map((item) => (
                        <Typography key={item} variant="body2" sx={{ fontWeight: 600 }}>
                          {item}
                        </Typography>
                      ))}
                    </Stack>
                  </Paper>

                  <Paper
                    sx={{
                      p: { xs: 2.5, md: 3 },
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      boxShadow: 'none',
                      bgcolor: '#111827',
                      color: '#FFFFFF'
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                      <MailOutlineIcon sx={{ color: '#22C55E' }} />
                      <Typography variant="overline" sx={{ color: '#A7F3D0', fontWeight: 800 }}>
                        Newsletter
                      </Typography>
                    </Stack>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 800, mb: 1 }}>
                      조용히 쌓이는 제작 노트
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, mb: 3 }}>
                      출시 전까지의 생각, 실패, 자동화 실험을 정리해 보내는 구독 영역입니다.
                    </Typography>
                    <Button
                      variant="contained"
                      disabled
                      sx={{
                        bgcolor: '#FFFFFF',
                        color: '#111827',
                        borderRadius: 999,
                        '&.Mui-disabled': {
                          bgcolor: 'rgba(255,255,255,0.82)',
                          color: '#111827'
                        }
                      }}
                    >
                      준비 중
                    </Button>
                  </Paper>
                </Box>

                <Paper
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    boxShadow: 'none',
                    bgcolor: '#FFFFFF'
                  }}
                >
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                    <AvatarImage
                      src={BLOG_CONFIG.owner.avatar}
                      alt={BLOG_CONFIG.owner.name}
                      size={72}
                      fallbackText={BLOG_CONFIG.owner.name.charAt(0)}
                      priority
                      quality={90}
                    />
                    <Box>
                      <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
                        About the Author
                      </Typography>
                      <Typography variant="h5" component="h2" sx={{ fontWeight: 800, mb: 1 }}>
                        {BLOG_CONFIG.owner.name}
                      </Typography>
                      <Typography color="text.secondary" sx={{ maxWidth: 760, lineHeight: 1.75 }}>
                        AI 도구와 함께 실제 제품을 만들며, 창업 실험과 실행 과정을 공개 기록으로 축적합니다.
                        이 블로그는 개인 일기보다 제품과 배움이 중심인 창업 매거진을 지향합니다.
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Stack>
            )}
          </Container>
        </main>

        <Footer ref={footerRef} />

        <Snackbar
          open={newPostAdded}
          autoHideDuration={6000}
          onClose={() => setNewPostAdded(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setNewPostAdded(false)} severity="success" sx={{ width: '100%' }}>
            새로운 글이 추가되었습니다.
          </Alert>
        </Snackbar>
      </Box>
    </MuiThemeProvider>
  )
}

interface SectionHeaderProps {
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
}

function SectionHeader({ eyebrow, title, description, action }: SectionHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
      spacing={2}
      sx={{ mb: 2.5 }}
    >
      <Box sx={{ maxWidth: 720 }}>
        <Typography variant="overline" color="primary" sx={{ fontWeight: 800 }}>
          {eyebrow}
        </Typography>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 850, letterSpacing: 0, mb: 1 }}>
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
          {description}
        </Typography>
      </Box>
      {action}
    </Stack>
  )
}

function EmptyState({ selectedCategory }: { selectedCategory: string }) {
  return (
    <Paper
      sx={{
        p: 4,
        textAlign: 'center',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        boxShadow: 'none'
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
        아직 표시할 글이 없습니다.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {selectedCategory === 'all'
          ? '첫 번째 글이 발행되면 이곳에 표시됩니다.'
          : `${selectedCategory} 카테고리의 발행 글이 아직 없습니다.`}
      </Typography>
    </Paper>
  )
}
