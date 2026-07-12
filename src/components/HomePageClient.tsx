'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  LinearProgress,
  Paper,
  Snackbar,
  Stack,
  Typography
} from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import MuiThemeProvider from '@/components/MuiThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'
import { AvatarImage } from '@/components/image'
import { PostEntity } from '@/entities/Post'

const MOMENT_TUNE_START_DATE = new Date('2026-06-29T00:00:00+09:00')
const MOMENT_TUNE_TOTAL_WEEKS = 14
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000

const missionMilestones = [
  '문제 정의 정리',
  'MVP 흐름 설계',
  '프로토타입 실험 진행'
]

const categoryCards = [
  { title: 'MomentTune', description: '공식 제품 제작 기록.', color: '#2563EB' },
  { title: 'AI 자동화', description: '실제 시간을 아끼는 시스템.', color: '#22C55E' },
  { title: 'AI 에이전트', description: '실무형 에이전트 워크플로우.', color: '#111827' },
  { title: '스타트업', description: '1인 창업 실험.', color: '#2563EB' },
  { title: '커리어', description: '전환과 성장 기록.', color: '#22C55E' },
  { title: '저널', description: '개인적인 회고와 생각.', color: '#6B7280' }
]

interface HomePageClientProps {
  initialPosts: PostEntity[]
  initialError: string | null
}

export default function HomePageClient({ initialPosts, initialError }: HomePageClientProps) {
  const router = useRouter()
  const latestSectionRef = useRef<HTMLDivElement>(null)
  const previousPostCountRef = useRef(initialPosts.length)
  const [posts, setPosts] = useState<PostEntity[]>(initialPosts)
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(initialError)
  const [newPostAdded, setNewPostAdded] = useState(false)

  const fetchPosts = useCallback(async (showNotification = false) => {
    try {
      if (!showNotification) setLoading(true)
      setFetchError(null)

      const response = await fetch('/api/posts?isPublished=true&sortField=publishedAt&sortOrder=desc&limit=6&page=1')
      if (!response.ok) {
        setFetchError('글 목록을 불러오지 못했습니다.')
        setPosts([])
        return
      }

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
    const handleFocus = () => fetchPosts(true)
    window.addEventListener('focus', handleFocus)

    return () => window.removeEventListener('focus', handleFocus)
  }, [fetchPosts])

  const publishedPosts = useMemo(() => posts, [posts])

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

  const progressValue = Math.round((momentTuneWeek / MOMENT_TUNE_TOTAL_WEEKS) * 100)

  return (
    <MuiThemeProvider>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          color: 'text.primary'
        }}
      >
        <Header />

        <Box component="main">
          <Container maxWidth="lg">
            <HeroSection onReadArticles={scrollToLatest} />

            <MissionSection momentTuneWeek={momentTuneWeek} progressValue={progressValue} />

            {loading ? (
              <Box sx={{ py: { xs: 5, md: 10 } }}>
                <Loading variant="posts" message="매거진을 불러오는 중..." />
              </Box>
            ) : (
              <>
                <Box ref={latestSectionRef}>
                  <FeaturedSection posts={publishedPosts} fetchError={fetchError} onPostClick={handlePostClick} />
                </Box>
                <CategoriesSection />
              </>
            )}

          </Container>
        </Box>

        <Footer />

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

function HeroSection({ onReadArticles }: { onReadArticles: () => void }) {
  return (
    <Box
      sx={{
        pt: { xs: 3.5, md: 10 },
        pb: { xs: 5, md: 9 },
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.45fr) minmax(320px, 0.72fr)' },
        gap: { xs: 4, md: 8 },
        alignItems: 'center'
      }}
    >
      <Box>
        <Chip
          label="개인 브랜드 저널"
          size="small"
          sx={{
            mb: { xs: 2.25, md: 3 },
            bgcolor: '#EFF6FF',
            color: '#2563EB',
            borderRadius: 999,
            fontSize: { xs: '0.625rem', md: '0.75rem' },
            fontWeight: 800
          }}
        />
        <Typography
          variant="h1"
          sx={{
            maxWidth: 740,
            fontSize: { xs: '2.35rem', sm: '3.6rem', md: '5.25rem' },
            lineHeight: 1.4,
            fontWeight: 400,
            letterSpacing: 0,
            color: 'text.primary',
            mb: { xs: 2, md: 3 }
          }}
        >
          <Box component="span" sx={{ fontWeight: 900 }}>
            실험하고 만들고
          </Box>
          <br />
          기록합니다.
        </Typography>
        <Typography
          sx={{
            maxWidth: 690,
            color: 'text.secondary',
            fontSize: { xs: '0.875rem', md: '1.35rem' },
            lineHeight: { xs: 1.55, md: 1.55 },
            fontWeight: 500,
            mb: { xs: 2, md: 3 }
          }}
        >
          AI와 함께 아이디어를 제품으로 만들어가는 과정을 기록하는 기술 블로그입니다.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ maxWidth: { xs: '100%', sm: 'none' } }}>
          <Button
            variant="contained"
            onClick={onReadArticles}
            sx={{
              px: 3,
              py: 1.2,
              borderRadius: 999,
              bgcolor: '#111827',
              color: '#FFFFFF',
              fontWeight: 800,
              textTransform: 'none',
              '&:hover': { bgcolor: '#1F2937' }
            }}
          >
            글 읽기
          </Button>
          <Button
            component={Link}
            href="/momenttune"
            variant="outlined"
            sx={{
              px: 3,
              py: 1.2,
              borderRadius: 999,
              bgcolor: 'background.paper',
              borderColor: 'divider',
              color: 'text.primary',
              fontWeight: 800,
              textTransform: 'none',
              '&:hover': { borderColor: 'text.secondary', bgcolor: 'action.hover' }
            }}
          >
            MomentTune 살펴보기
          </Button>
        </Stack>
      </Box>

      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 5,
          boxShadow: 'none',
          bgcolor: 'background.paper'
        }}
      >
        <Chip
          label="소개"
          size="small"
          sx={{
            mb: 3,
            bgcolor: '#EFF6FF',
            color: '#2563EB',
            borderRadius: 999,
            fontWeight: 800
          }}
        />
        <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center' }}>
          <AvatarImage
            alt="SM"
            size={112}
            fallbackText="SM"
            priority
            quality={95}
          />
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.05rem', md: '1.35rem' },
              lineHeight: 1.2,
              fontWeight: 400,
              color: 'text.primary',
              whiteSpace: 'normal'
            }}
          >
            AI와 함께 설계하고, 개발하고, 검증하는 프로젝트 빌더입니다.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  )
}

function MissionSection({ momentTuneWeek, progressValue }: { momentTuneWeek: number; progressValue: number }) {
  return (
    <SectionShell
      eyebrow="현재 미션"
      title="지금 가장 집중하는 빌드는 MomentTune입니다"
      description="제품 여정의 현재 상태를 보여주는 스냅샷입니다. 진행률, 마일스톤, 이번 주의 집중 지점을 정리합니다."
    >
      <Paper
        sx={{
          p: { xs: 2, md: 4 },
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: { xs: 3, md: 4 },
          boxShadow: 'none',
          bgcolor: 'background.paper'
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.85fr 1fr' },
            gap: { xs: 2.5, md: 4 },
            alignItems: 'center'
          }}
        >
          <Box>
            <Chip
              label="MomentTune"
              size="small"
              sx={{
                mb: 2,
                bgcolor: '#DCFCE7',
                color: '#22C55E',
                borderRadius: 999,
                fontSize: '0.75rem',
                fontWeight: 800
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.35rem', md: '1.65rem' },
                lineHeight: 1.35,
                fontWeight: 900,
                letterSpacing: 0,
                mb: 2
              }}
            >
              웨어러블 데이터를 분석해 개인 맞춤형 음악과 휴식 경험을 제안하는 AI 웰니스 서비스
            </Typography>
          </Box>

          <Paper
            sx={{
              p: { xs: 2, md: 2.5 },
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              boxShadow: 'none',
              bgcolor: 'background.default'
            }}
          >
            <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 800, mb: 1 }}>
              진행률
            </Typography>
            <Typography sx={{ fontSize: { xs: '2rem', md: '2.25rem' }, lineHeight: 1, fontWeight: 900, mb: 2 }}>
              {momentTuneWeek}주차 / 14주
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progressValue}
              sx={{
                height: 8,
                borderRadius: 999,
                bgcolor: 'divider',
                mb: 1.5,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 999,
                  bgcolor: '#2563EB'
                }
              }}
            />
            <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', lineHeight: 1.5 }}>
              현재 집중: 반복 가능한 첫 사용자 루틴 검증
            </Typography>
          </Paper>

          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 900, mb: 1.5 }}>
              마일스톤
            </Typography>
            <Stack spacing={1}>
              {missionMilestones.map((milestone) => (
                <Stack key={milestone} direction="row" spacing={1} alignItems="center">
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#22C55E', flex: '0 0 auto' }} />
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'text.primary' }}>
                    {milestone}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Box>
      </Paper>
    </SectionShell>
  )
}

function FeaturedSection({
  posts,
  fetchError,
  onPostClick
}: {
  posts: PostEntity[]
  fetchError?: string | null
  onPostClick: (post: PostEntity) => void
}) {
  if (fetchError) {
    return (
      <SectionShell
        eyebrow="추천 글"
        title="최신 글"
        desktopTitle="에디토리얼 글과 제작 노트"
      >
        <Paper
          sx={{
            p: 4,
            border: '1px solid #FCA5A5',
            borderRadius: 3,
            boxShadow: 'none',
            bgcolor: '#FEF2F2'
          }}
        >
          <Typography sx={{ fontWeight: 800, mb: 1, color: '#991B1B' }}>{fetchError}</Typography>
          <Typography sx={{ color: '#7F1D1D' }}>잠시 후 다시 시도해 주세요.</Typography>
        </Paper>
      </SectionShell>
    )
  }

  if (posts.length === 0) {
    return (
      <SectionShell
        eyebrow="추천 글"
        title="최신 글"
        desktopTitle="에디토리얼 글과 제작 노트"
      >
        <EmptyState />
      </SectionShell>
    )
  }

  const [latestPost, ...previousPosts] = posts

  return (
    <SectionShell
      eyebrow="추천 글"
      title="최신 글"
      desktopTitle="에디토리얼 글과 제작 노트"
      id="articles"
    >
      <Stack spacing={{ xs: 3, md: 4 }}>
        <ArticleCard post={latestPost} variant="large" onClick={onPostClick} />

        {previousPosts.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'minmax(0, 1fr)',
                sm: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(3, minmax(0, 1fr))'
              },
              gap: { xs: 2, md: 2.5 },
              minWidth: 0
            }}
          >
            {previousPosts.map((post) => (
              <ArticleCard key={post.id} post={post} variant="compact" onClick={onPostClick} />
            ))}
          </Box>
        )}
      </Stack>
    </SectionShell>
  )
}

function CategoriesSection() {
  return (
    <SectionShell
      eyebrow="카테고리"
      title="주제 탐색"
      desktopTitle="주제별로 읽기"
      description="아카이브를 헤매지 않고 훑어볼 수 있도록 여섯 개의 명확한 입구로 정리했습니다."
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          gap: { xs: 1.5, md: 2.5 }
        }}
      >
        {categoryCards.map((category) => (
          <Paper
            key={category.title}
            component={Link}
            href="/articles"
            sx={{
              display: 'block',
              p: { xs: 2, md: 2.5 },
              minHeight: { xs: 98, md: 110 },
              color: 'inherit',
              textDecoration: 'none',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: { xs: 2.5, md: 3 },
              boxShadow: 'none',
              bgcolor: 'background.paper',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: '#D1D5DB'
              }
            }}
          >
            <Box sx={{ width: 36, height: 4, borderRadius: 999, bgcolor: category.color, mb: 1.5 }} />
            <Typography sx={{ fontSize: '1rem', fontWeight: 900, mb: 0.75 }}>
              {category.title}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', fontWeight: 600 }}>
              {category.description}
            </Typography>
          </Paper>
        ))}
      </Box>
    </SectionShell>
  )
}

function SectionShell({
  id,
  eyebrow,
  title,
  desktopTitle,
  description,
  children
}: {
  id?: string
  eyebrow: string
  title: string
  desktopTitle?: string
  description?: string
  children: ReactNode
}) {
  return (
    <Box id={id} sx={{ py: { xs: 3.5, md: 5.5 } }}>
      <Box sx={{ borderTop: { xs: 'none', md: '1px solid' }, borderColor: 'divider', pt: { xs: 0, md: 3 } }}>
        <Typography
          sx={{
            color: '#2563EB',
            fontSize: { xs: '0.625rem', md: '0.75rem' },
            fontWeight: 900,
            textTransform: 'uppercase',
            mb: 1
          }}
        >
          {eyebrow}
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.8rem', md: '2.35rem' },
            lineHeight: 1.08,
            fontWeight: 900,
            letterSpacing: 0,
            color: 'text.primary',
            mb: description ? 1.25 : { xs: 2.25, md: 3.5 }
          }}
        >
          <Box component="span" sx={{ display: { xs: 'inline', md: desktopTitle ? 'none' : 'inline' } }}>
            {title}
          </Box>
          {desktopTitle && (
            <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
              {desktopTitle}
            </Box>
          )}
        </Typography>
        {description && (
          <Typography
            sx={{
              maxWidth: 760,
              color: 'text.secondary',
              fontSize: { xs: '0.8125rem', md: '1rem' },
              lineHeight: 1.6,
              fontWeight: 500,
              mb: { xs: 2.25, md: 3.5 }
            }}
          >
            {description}
          </Typography>
        )}
        {children}
      </Box>
    </Box>
  )
}

function ArticleCard({
  post,
  variant,
  onClick
}: {
  post: PostEntity
  variant: 'large' | 'compact'
  onClick: (post: PostEntity) => void
}) {
  return (
    <Card
      onClick={() => onClick(post)}
      sx={{
        cursor: 'pointer',
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: { xs: 3, md: 4 },
        boxShadow: 'none',
        bgcolor: 'background.paper',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: '#D1D5DB'
        }
      }}
    >
      <Box sx={{ p: { xs: 1.25, md: variant === 'large' ? 2 : 1.75 }, pb: 0 }}>
        <ArticleVisual post={post} variant={variant} />
      </Box>
      <CardContent sx={{ p: { xs: 2, md: variant === 'large' ? 2.5 : 2.25 } }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.25, flexWrap: 'wrap', rowGap: 0.5 }}>
          <Typography sx={{ color: '#2563EB', fontSize: '0.75rem', fontWeight: 900 }}>
            {post.category}
          </Typography>
          <Typography sx={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 700 }}>
            {post.readTime || 6}분 읽기 · {formatMonth(post.publishedAt)}
          </Typography>
        </Stack>
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: variant === 'large' ? '1.05rem' : '1rem', md: variant === 'large' ? '1.75rem' : '1.35rem' },
            lineHeight: 1.14,
            fontWeight: 900,
            letterSpacing: 0,
            color: 'text.primary',
            mb: 1.25
          }}
        >
          {post.title}
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.8125rem', md: '0.95rem' },
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: variant === 'large' ? 3 : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {post.description || post.excerpt || 'AI 제품을 만들고, 차분한 인터페이스를 설계하며, 공개적으로 배우는 과정을 담은 실전 기록입니다.'}
        </Typography>
      </CardContent>
    </Card>
  )
}

function ArticleVisual({ post, variant }: { post: PostEntity; variant: 'large' | 'compact' }) {
  const hasThumbnail = Boolean(post.thumbnail)

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: variant === 'large' ? 170 : 140, md: variant === 'large' ? 292 : 176 },
        borderRadius: { xs: 2, md: 3 },
        bgcolor: indexColor(post.category),
        overflow: 'hidden',
        backgroundImage: hasThumbnail ? `url(${post.thumbnail})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {!hasThumbnail && (
        <Box
          sx={{
            position: 'absolute',
            right: { xs: 26, md: 38 },
            bottom: { xs: 22, md: 36 },
            width: { xs: 56, md: variant === 'large' ? 82 : 70 },
            height: { xs: 56, md: variant === 'large' ? 82 : 70 },
            borderRadius: '50%',
            bgcolor: variant === 'large' ? '#FFFFFF' : '#ECFDF5'
          }}
        />
      )}
    </Box>
  )
}

function EmptyState() {
  return (
    <Paper
      sx={{
        p: 4,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        boxShadow: 'none',
        bgcolor: 'background.paper'
      }}
    >
      <Typography sx={{ fontWeight: 800, mb: 1 }}>아직 표시할 글이 없습니다.</Typography>
      <Typography sx={{ color: 'text.secondary' }}>첫 번째 글이 발행되면 이곳에 표시됩니다.</Typography>
    </Paper>
  )
}

function formatMonth(dateString: string | Date) {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })
}

function indexColor(category: string) {
  if (category === 'MomentTune') return '#F4F0E7'
  if (category === 'AI Agents' || category === 'AI Automation') return '#EFF6FF'
  return '#F1F5F9'
}
