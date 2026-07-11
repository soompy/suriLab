'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography
} from '@mui/material'
import {
  AutoAwesome as AutoAwesomeIcon,
  Schedule as ScheduleIcon,
  Visibility as ViewIcon
} from '@mui/icons-material'
import MuiThemeProvider from '@/components/MuiThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'
import SkillTag from '@/components/SkillTag'
import { ThumbnailImage } from '@/components/image'
import { PostEntity } from '@/entities/Post'
import { CATEGORY_COLORS } from '@/shared/constants/categories'

interface EditorialCollectionPageProps {
  eyebrow: string
  title: string
  description: string
  category?: string
  heroLabel: string
  emptyTitle: string
  emptyDescription: string
  focusItems: string[]
}

export default function EditorialCollectionPage({
  eyebrow,
  title,
  description,
  category,
  heroLabel,
  emptyTitle,
  emptyDescription,
  focusItems
}: EditorialCollectionPageProps) {
  const router = useRouter()
  const [posts, setPosts] = useState<PostEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/posts?isPublished=true&sortField=publishedAt&sortOrder=desc&limit=100')
        if (!response.ok) throw new Error('Failed to load posts')

        const data = await response.json()
        setPosts(data.posts || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const visiblePosts = useMemo(() => {
    return posts
      .filter((post) => post.isPublished && !post.draft)
      .filter((post) => !category || post.category === category)
  }, [category, posts])

  const featuredPost = visiblePosts.find((post) => post.featured) || visiblePosts[0]
  const secondaryPosts = visiblePosts.filter((post) => post.id !== featuredPost?.id)
  const totalViews = visiblePosts.reduce((sum, post) => sum + (post.views || 0), 0)
  const seriesCount = new Set(visiblePosts.map((post) => post.series).filter(Boolean)).size

  const handlePostClick = (post: PostEntity) => {
    router.push(`/posts/${post.slug}`)
  }

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryColor = (postCategory: string) => {
    return CATEGORY_COLORS[postCategory as keyof typeof CATEGORY_COLORS] || 'linear-gradient(135deg, #F3F4F6, #E5E7EB)'
  }

  const renderPostCard = (post: PostEntity, large = false) => (
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
        bgcolor: '#FFFFFF',
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
        width={large ? 860 : 420}
        height={large ? 320 : 180}
        aspectRatio={large ? 16 / 7 : 16 / 10}
        fallbackText={post.category}
        borderRadius={0}
        hoverEffect={false}
        style={{ width: '100%' }}
      />
      <CardContent sx={{ p: { xs: 2.25, md: large ? 3 : 2.5 } }}>
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
          variant={large ? 'h4' : 'h6'}
          component="h2"
          sx={{
            mb: 1.25,
            fontWeight: 850,
            lineHeight: 1.18,
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
            lineHeight: 1.75,
            display: '-webkit-box',
            WebkitLineClamp: large ? 3 : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {post.description || post.excerpt}
        </Typography>

        {post.tags.length > 0 && (
          <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
            {post.tags.slice(0, 4).map((tag) => (
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
          <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#FAFAF8' }}>
            <Container maxWidth="lg" sx={{ pt: { xs: 7, md: 10 }, pb: { xs: 5, md: 8 } }}>
              <Chip
                icon={<AutoAwesomeIcon />}
                label={heroLabel}
                variant="outlined"
                sx={{ mb: 3, bgcolor: '#FFFFFF' }}
              />
              <Typography
                variant="h1"
                sx={{
                  maxWidth: 920,
                  fontSize: { xs: '2.6rem', sm: '3.6rem', md: '4.9rem' },
                  lineHeight: 1,
                  fontWeight: 850,
                  letterSpacing: 0,
                  color: '#111827',
                  mb: 3
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 760, lineHeight: 1.75, fontWeight: 400 }}
              >
                {description}
              </Typography>
            </Container>
          </Box>

          <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
            {loading ? (
              <Loading variant="posts" message="콘텐츠를 불러오는 중..." />
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : visiblePosts.length === 0 ? (
              <Paper
                sx={{
                  p: { xs: 3, md: 5 },
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  boxShadow: 'none',
                  textAlign: 'center'
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                  {emptyTitle}
                </Typography>
                <Typography color="text.secondary">{emptyDescription}</Typography>
              </Paper>
            ) : (
              <Stack spacing={{ xs: 5, md: 7 }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1.5fr 0.8fr' },
                    gap: 2.5
                  }}
                >
                  <Box>{featuredPost && renderPostCard(featuredPost, true)}</Box>
                  <Stack spacing={2}>
                    <MetricCard label="Published" value={visiblePosts.length.toString()} />
                    <MetricCard label="Series" value={seriesCount.toString()} />
                    <MetricCard label="Views" value={totalViews.toLocaleString()} />
                  </Stack>
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
                  <Typography variant="overline" color="primary" sx={{ fontWeight: 800 }}>
                    {eyebrow}
                  </Typography>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={1.5}
                    divider={<ResponsiveFocusDivider />}
                    sx={{ mt: 1.5 }}
                  >
                    {focusItems.map((item) => (
                      <Typography key={item} variant="body2" color="text.secondary" sx={{ flex: 1, lineHeight: 1.65 }}>
                        {item}
                      </Typography>
                    ))}
                  </Stack>
                </Paper>

                <Box>
                  <SectionTitle title="Latest Essays" description="최근 발행된 글을 시간순으로 모았습니다." />
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' },
                      gap: 2.5,
                      minWidth: 0
                    }}
                  >
                    {secondaryPosts.map((post) => renderPostCard(post))}
                  </Box>
                </Box>
              </Stack>
            )}
          </Container>
        </main>

        <Footer />
      </Box>
    </MuiThemeProvider>
  )
}

function ResponsiveFocusDivider() {
  return (
    <>
      <Divider sx={{ display: { xs: 'block', md: 'none' } }} />
      <Divider flexItem orientation="vertical" sx={{ display: { xs: 'none', md: 'block' } }} />
    </>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Paper
      sx={{
        p: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        boxShadow: 'none',
        bgcolor: '#FFFFFF'
      }}
    >
      <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
        {label}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 850, color: '#111827' }}>
        {value}
      </Typography>
    </Paper>
  )
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography variant="h4" component="h2" sx={{ fontWeight: 850, letterSpacing: 0, mb: 1 }}>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
        {description}
      </Typography>
    </Box>
  )
}
