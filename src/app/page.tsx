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
import { PostEntity } from '@/entities/Post'

const MOMENT_TUNE_START_DATE = new Date('2026-06-29T00:00:00+09:00')
const MOMENT_TUNE_TOTAL_WEEKS = 14
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000

const fieldNotes = [
  'MomentTune 창업 여정',
  '일상 업무 속 AI 에이전트',
  '제품 설계와 의사결정'
]

const missionMilestones = [
  '문제 정의 정리',
  'MVP 흐름 설계',
  '프로토타입 실험 진행',
  '첫 사용자 피드백 루프'
]

const timelineItems = [
  { week: 1, label: '문제 정의' },
  { week: 2, label: 'MVP 범위' },
  { week: 3, label: '프로토타입 루프' },
  { week: 4, label: '현재 집중' },
  { week: 5, label: '다음 단계' },
  { week: 6, label: '다음 단계' },
  { week: 7, label: '다음 단계' },
  { week: 8, label: '다음 단계' }
]

const categoryCards = [
  { title: 'MomentTune', description: '공식 제품 제작 기록.', color: '#2563EB' },
  { title: 'AI 자동화', description: '실제 시간을 아끼는 시스템.', color: '#22C55E' },
  { title: 'AI 에이전트', description: '실무형 에이전트 워크플로우.', color: '#111827' },
  { title: '스타트업', description: '1인 창업 실험.', color: '#2563EB' },
  { title: '커리어', description: '전환과 성장 기록.', color: '#22C55E' },
  { title: '저널', description: '개인적인 회고와 생각.', color: '#6B7280' }
]

export default function HomePage() {
  const router = useRouter()
  const latestSectionRef = useRef<HTMLDivElement>(null)
  const previousPostCountRef = useRef(0)
  const [posts, setPosts] = useState<PostEntity[]>([])
  const [loading, setLoading] = useState(true)
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

  const featuredPosts = useMemo(() => {
    const momentTune = publishedPosts.find((post) => post.category === 'MomentTune' && post.featured)
      || publishedPosts.find((post) => post.category === 'MomentTune')
      || publishedPosts[0]

    const rest = publishedPosts.filter((post) => post.id !== momentTune?.id)

    return [momentTune, ...rest].filter(Boolean).slice(0, 3) as PostEntity[]
  }, [publishedPosts])

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
      <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAF8', color: '#111827' }}>
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
                  <FeaturedSection posts={featuredPosts} onPostClick={handlePostClick} />
                </Box>
                <TimelineSection activeWeek={momentTuneWeek} />
                <CategoriesSection />
              </>
            )}

            <NewsletterSection />
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
            lineHeight: { xs: 0.98, md: 1.02 },
            fontWeight: 900,
            letterSpacing: 0,
            color: '#111827',
            mb: { xs: 2, md: 3 }
          }}
        >
          AI와 함께 제품을 만들고, 창업을 실험하는 기록
        </Typography>
        <Typography
          sx={{
            maxWidth: 690,
            color: '#6B7280',
            fontSize: { xs: '0.875rem', md: '1.35rem' },
            lineHeight: { xs: 1.55, md: 1.55 },
            fontWeight: 500,
            mb: { xs: 2, md: 3 }
          }}
        >
          MomentTune 제작 과정, AI 자동화, 에이전트 워크플로우, 1인 창업 실험,
          그리고 실제 제품을 만드는 과정에서 배우는 것들을 공개적으로 기록합니다.
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
              bgcolor: '#FFFFFF',
              borderColor: '#E5E7EB',
              color: '#111827',
              fontWeight: 800,
              textTransform: 'none',
              '&:hover': { borderColor: '#D1D5DB', bgcolor: '#F9FAFB' }
            }}
          >
            MomentTune 살펴보기
          </Button>
        </Stack>
      </Box>

      <Paper
        sx={{
          display: { xs: 'none', md: 'block' },
          p: 4,
          border: '1px solid #E5E7EB',
          borderRadius: 5,
          boxShadow: 'none',
          bgcolor: '#FFFFFF'
        }}
      >
        <Chip
          label="지금 쓰는 중"
          size="small"
          sx={{
            mb: 3,
            bgcolor: '#DCFCE7',
            color: '#22C55E',
            borderRadius: 999,
            fontWeight: 800
          }}
        />
        <Typography variant="h2" sx={{ fontSize: '2.35rem', lineHeight: 1.05, fontWeight: 900, mb: 3 }}>
          제품을 만들며 남기는 현장 노트
        </Typography>
        <Typography sx={{ color: '#6B7280', lineHeight: 1.65, mb: 3 }}>
          이 글들은 제품을 만드는 흔적입니다. 결정, 실패, 출시 노트, 자동화 레시피,
          그리고 겉으로 잘 보이지 않는 배움까지 차분하게 남깁니다.
        </Typography>
        <Box sx={{ borderTop: '1px solid #E5E7EB', pt: 2 }}>
          <Stack spacing={1.5}>
            {fieldNotes.map((note) => (
              <Typography key={note} sx={{ fontSize: '0.925rem', fontWeight: 800, color: '#111827' }}>
                {note}
              </Typography>
            ))}
          </Stack>
        </Box>
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
          border: '1px solid #E5E7EB',
          borderRadius: { xs: 3, md: 4 },
          boxShadow: 'none',
          bgcolor: '#FFFFFF'
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
                fontSize: { xs: '1.85rem', md: '2.2rem' },
                lineHeight: 1.05,
                fontWeight: 900,
                letterSpacing: 0,
                mb: 2
              }}
            >
              감정의 순간을 위한 음악 저널링 제품
            </Typography>
            <Typography sx={{ color: '#6B7280', lineHeight: 1.65, fontSize: { xs: '0.875rem', md: '1rem' } }}>
              흐릿한 감정을 더 선명한 음악 감상 루틴으로 바꾸는 것이 목표입니다.
              동시에 모든 제품 의사결정을 공개 기록으로 남깁니다.
            </Typography>
          </Box>

          <Paper
            sx={{
              p: { xs: 2, md: 2.5 },
              border: '1px solid #E5E7EB',
              borderRadius: 3,
              boxShadow: 'none',
              bgcolor: '#FAFAF8'
            }}
          >
            <Typography sx={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 800, mb: 1 }}>
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
                bgcolor: '#E5E7EB',
                mb: 1.5,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 999,
                  bgcolor: '#2563EB'
                }
              }}
            />
            <Typography sx={{ color: '#6B7280', fontSize: '0.75rem', lineHeight: 1.5 }}>
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
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>
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
  onPostClick
}: {
  posts: PostEntity[]
  onPostClick: (post: PostEntity) => void
}) {
  if (posts.length === 0) {
    return (
      <SectionShell
        eyebrow="추천 글"
        title="최신 글"
        desktopTitle="에디토리얼 글과 제작 노트"
        description="큰 카드로 글 자체가 먼저 보이도록 구성했습니다. 카테고리, 읽는 시간, 발행일은 조용히 보조합니다."
      >
        <EmptyState />
      </SectionShell>
    )
  }

  return (
    <SectionShell
      eyebrow="추천 글"
      title="최신 글"
      desktopTitle="에디토리얼 글과 제작 노트"
      description="큰 카드로 글 자체가 먼저 보이도록 구성했습니다. 카테고리, 읽는 시간, 발행일은 조용히 보조합니다."
      id="articles"
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.65fr' },
          gap: { xs: 2, md: 2.5 },
          alignItems: 'start'
        }}
      >
        <ArticleCard post={posts[0]} variant="large" onClick={onPostClick} index={0} />
        <Stack spacing={{ xs: 2, md: 2.5 }}>
          {posts.slice(1, 3).map((post, index) => (
            <ArticleCard key={post.id} post={post} variant="compact" onClick={onPostClick} index={index + 1} />
          ))}
        </Stack>
      </Box>
    </SectionShell>
  )
}

function TimelineSection({ activeWeek }: { activeWeek: number }) {
  return (
    <SectionShell
      id="timeline"
      eyebrow="여정 타임라인"
      title="주차별 스타트업 진행 기록"
      description="복잡한 프로젝트 대시보드가 아니라, 진행 흐름이 보이는 시각적 제작 로그입니다."
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(8, minmax(0, 1fr))' },
          gap: { xs: 1.25, md: 1.5 }
        }}
      >
        {timelineItems.map((item) => {
          const completed = item.week < activeWeek
          const active = item.week === activeWeek

          return (
            <Paper
              key={item.week}
              sx={{
                p: { xs: 1.75, md: 2 },
                minHeight: { xs: 82, md: 84 },
                border: '1px solid',
                borderColor: active ? '#2563EB' : '#E5E7EB',
                borderRadius: { xs: 2.5, md: 3 },
                boxShadow: 'none',
                bgcolor: '#FFFFFF',
                outline: active ? '1px solid #2563EB' : 'none',
                opacity: item.week > activeWeek ? 0.58 : 1
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: completed ? '#22C55E' : active ? '#2563EB' : '#E5E7EB',
                  mb: 1.5
                }}
              />
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 900, color: '#111827', mb: 0.5 }}>
                {item.week}주차
              </Typography>
              <Typography sx={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 600 }}>
                {item.label}
              </Typography>
            </Paper>
          )
        })}
      </Box>
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
              border: '1px solid #E5E7EB',
              borderRadius: { xs: 2.5, md: 3 },
              boxShadow: 'none',
              bgcolor: '#FFFFFF',
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
            <Typography sx={{ color: '#6B7280', fontSize: '0.8rem', fontWeight: 600 }}>
              {category.description}
            </Typography>
          </Paper>
        ))}
      </Box>
    </SectionShell>
  )
}

function NewsletterSection() {
  return (
    <Paper
      sx={{
        mt: { xs: 5, md: 9 },
        mb: { xs: 2, md: 4 },
        p: { xs: 2.5, md: 5 },
        border: '1px solid #E5E7EB',
        borderRadius: { xs: 3, md: 4 },
        boxShadow: 'none',
        bgcolor: '#FFFFFF'
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'center' }}
        spacing={2.5}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: '1.45rem', md: '2rem' },
              lineHeight: 1.15,
              fontWeight: 900,
              mb: 1
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
              제품을 만들며 얻은 조용한 현장 노트를 받아보세요
            </Box>
            <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>
              조용한 제작 노트
            </Box>
          </Typography>
          <Typography sx={{ color: '#6B7280', fontSize: { xs: '0.8125rem', md: '1rem' }, lineHeight: 1.6 }}>
            MomentTune, AI 워크플로우, 제품 제작에서 배운 점을 월 1회 가볍게 정리합니다.
            과장된 성장 공식보다 실제 기록에 집중합니다.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          disabled
          sx={{
            alignSelf: { xs: 'stretch', md: 'center' },
            px: 3,
            py: 1,
            borderRadius: 999,
            borderColor: '#E5E7EB',
            color: '#111827',
            bgcolor: '#FFFFFF',
            fontWeight: 800,
            textTransform: 'none',
            '&.Mui-disabled': {
              color: '#111827',
              borderColor: '#E5E7EB',
              bgcolor: '#FFFFFF'
            }
          }}
        >
          구독하기
        </Button>
      </Stack>
    </Paper>
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
  description: string
  children: ReactNode
}) {
  return (
    <Box id={id} sx={{ py: { xs: 3.5, md: 5.5 } }}>
      <Box sx={{ borderTop: { xs: 'none', md: '1px solid #E5E7EB' }, pt: { xs: 0, md: 3 } }}>
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
            color: '#111827',
            mb: 1.25
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
        <Typography
          sx={{
            maxWidth: 760,
            color: '#6B7280',
            fontSize: { xs: '0.8125rem', md: '1rem' },
            lineHeight: 1.6,
            fontWeight: 500,
            mb: { xs: 2.25, md: 3.5 }
          }}
        >
          {description}
        </Typography>
        {children}
      </Box>
    </Box>
  )
}

function ArticleCard({
  post,
  variant,
  index,
  onClick
}: {
  post: PostEntity
  variant: 'large' | 'compact'
  index: number
  onClick: (post: PostEntity) => void
}) {
  return (
    <Card
      onClick={() => onClick(post)}
      sx={{
        display: { xs: index > 1 ? 'none' : 'block', md: 'block' },
        cursor: 'pointer',
        height: '100%',
        border: '1px solid #E5E7EB',
        borderRadius: { xs: 3, md: 4 },
        boxShadow: 'none',
        bgcolor: '#FFFFFF',
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
            color: '#111827',
            mb: 1.25
          }}
        >
          {post.title}
        </Typography>
        <Typography
          sx={{
            color: '#6B7280',
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
        border: '1px solid #E5E7EB',
        borderRadius: 3,
        boxShadow: 'none',
        bgcolor: '#FFFFFF'
      }}
    >
      <Typography sx={{ fontWeight: 800, mb: 1 }}>아직 표시할 글이 없습니다.</Typography>
      <Typography sx={{ color: '#6B7280' }}>첫 번째 글이 발행되면 이곳에 표시됩니다.</Typography>
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
