import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Box,
  Breadcrumbs,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material'
import MuiThemeProvider from '@/components/MuiThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PostActions from '@/components/PostActions'
import PostMarkdown from '@/components/PostMarkdown'
import CommentSection from '@/components/CommentSection'
import TableOfContents from '@/components/TableOfContents'
import { AvatarImage } from '@/components/image'
import { BLOG_CONFIG } from '@/config/blog'
import { CATEGORY_COLORS } from '@/shared/constants/categories'
import { createTaxonomySlug } from '@/lib/taxonomy'
import {
  getAdjacentPosts,
  getPublishedPostBySlug,
  getRelatedPosts,
} from '@/lib/post-detail'
import type { PostEntity } from '@/entities/Post'

type PostDetailPageProps = {
  params: Promise<{ slug: string }>
}

function getTagColor(tag: string) {
  const colors: Record<string, string> = {
    html: '#ffebee',
    css: '#e3f2fd',
    javascript: '#fff9c4',
    typescript: '#e8f5ff',
    react: '#e0f7fa',
    nextjs: '#f3e5f5',
    vue: '#e8f5e8',
    nuxt: '#f1f8e9',
    frontend: '#e1f5fe',
    backend: '#f1f8e9',
    database: '#fff8e1',
    node: '#e8f5e8',
    python: '#fff3e0',
    development: '#f3e5f5',
    tools: '#e8eaf6',
    git: '#ffebee',
    devops: '#e8eaf6',
    tutorial: '#e8f5e8',
    review: '#fff3e0',
    'tech insights': '#e3f2fd',
    personal: '#fce4ec',
    career: '#fce4ec',
    productivity: '#f3e5f5',
    ai: '#f9fbe7',
    bootstrap: '#f3e5f5',
    'material-ui': '#e3f2fd',
    'responsive design': '#ffebee',
    figma: '#fce4ec',
    zeplin: '#fff3e0',
  }

  return colors[tag.toLowerCase().trim()] || '#f5f5f5'
}

function getCategoryHref(category: string) {
  return `/categories/${createTaxonomySlug(category)}`
}

function getTagHref(tag: string) {
  return `/tags/${createTaxonomySlug(tag)}`
}

function formatDate(date: Date) {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function PostSummaryCard({
  post,
  label,
  direction,
}: {
  post: PostEntity | null
  label: string
  direction: 'previous' | 'next'
}) {
  const content = (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
        {direction === 'previous' && <ArrowBackIcon sx={{ fontSize: 16 }} />}
        <Typography variant="caption" sx={{ fontWeight: 800 }}>
          {label}
        </Typography>
        {direction === 'next' && <ArrowForwardIcon sx={{ fontSize: 16 }} />}
      </Stack>
      <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.35 }}>
        {post ? post.title : `${label}이 없습니다.`}
      </Typography>
      {post && (
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {post.description || post.excerpt}
        </Typography>
      )}
    </Stack>
  )

  return (
    <Box
      component={post ? Link : 'div'}
      href={post ? `/posts/${post.slug}` : undefined}
      sx={{
        p: 2,
        width: '100%',
        textAlign: 'left',
        textDecoration: 'none',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
        color: 'text.primary',
        transition: 'border-color 0.2s ease, background-color 0.2s ease',
        '&:hover': post
          ? {
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
            }
          : undefined,
      }}
    >
      {content}
    </Box>
  )
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const [relatedPosts, adjacentPosts] = await Promise.all([
    getRelatedPosts(post),
    getAdjacentPosts(post),
  ])
  const isContentPost = post.source === 'content' || post.id.startsWith('content:')
  const description = post.description || post.excerpt
  const updatedAtChanged = post.updatedAt.getTime() !== post.publishedAt.getTime()

  return (
    <MuiThemeProvider>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
        <Header />

        <Container
          maxWidth={false}
          sx={{
            maxWidth: { xs: '100%', md: '1200px' },
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 2 },
            py: { xs: 3, sm: 4, md: 4 },
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'text.secondary' }}>
              <Typography component={Link} href="/" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Home
              </Typography>
              <Typography component={Link} href="/articles" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Articles
              </Typography>
              <Typography
                component={Link}
                href={getCategoryHref(post.category)}
                color="inherit"
                sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
              >
                {post.category}
              </Typography>
              <Typography color="text.primary" sx={{ fontWeight: 700 }}>
                {post.title}
              </Typography>
            </Breadcrumbs>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 800px) 280px' },
              justifyContent: 'center',
              alignItems: 'start',
              gap: { xs: 3, lg: 4 },
            }}
          >
            <Paper sx={{ p: { xs: 2, md: 4 }, boxShadow: 'none', width: '100%', minWidth: 0 }}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant="h3" component="h1" gutterBottom>
                    {post.title}
                  </Typography>

                  {description && (
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                      {description}
                    </Typography>
                  )}

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    sx={{ mb: 3 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(post.publishedAt)}
                        {updatedAtChanged && <> · 수정 {formatDate(post.updatedAt)}</>}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {post.readTime || 1}분 읽기
                      </Typography>
                    </Box>

                    {!isContentPost && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ViewIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {(post.views || 0).toLocaleString()} 조회
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    <Chip
                      label={post.category}
                      component={Link}
                      href={getCategoryHref(post.category)}
                      clickable
                      sx={{
                        background: CATEGORY_COLORS[post.category as keyof typeof CATEGORY_COLORS] || 'linear-gradient(135deg, #f0f0f0, #e0e0e0)',
                        color: '#000000',
                        fontWeight: 'bold',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    {post.series && (
                      <Chip label={post.series} size="small" variant="outlined" color="primary" />
                    )}
                    {post.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        component={Link}
                        href={getTagHref(tag)}
                        clickable
                        size="small"
                        sx={{
                          bgcolor: getTagColor(tag),
                          color: 'text.primary',
                          border: '1px solid',
                          borderColor: 'divider',
                          fontWeight: 700,
                          textDecoration: 'none',
                          '&:hover': {
                            borderColor: 'primary.main',
                          },
                        }}
                      />
                    ))}
                    {post.featured && <Chip label="Featured" color="secondary" size="small" />}
                  </Box>

                  <PostActions
                    postId={post.id}
                    title={post.title}
                    description={description}
                    isContentPost={isContentPost}
                  />

                  <Divider />
                </Box>

                <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
                  <TableOfContents
                    content={post.content}
                    sticky={false}
                    collapsible
                    id="post-table-of-contents-mobile"
                  />
                </Box>

                <Box component="article">
                  <PostMarkdown content={post.content} />
                </Box>

                <Divider />

                <Box>
                  <Typography variant="h6" gutterBottom>
                    이어서 읽기
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                      gap: 1.5,
                    }}
                  >
                    <PostSummaryCard label="이전글" post={adjacentPosts.previous} direction="previous" />
                    <PostSummaryCard label="다음글" post={adjacentPosts.next} direction="next" />
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="h6" gutterBottom>
                    내부 링크 추천
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                    이 글과 같은 주제의 글을 더 탐색할 수 있는 자동 추천 링크입니다.
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                      label={`${post.category} 글 더 보기`}
                      component={Link}
                      href={getCategoryHref(post.category)}
                      clickable
                      color="primary"
                      variant="outlined"
                    />
                    {post.tags.slice(0, 5).map((tag) => (
                      <Chip
                        key={tag}
                        label={`#${tag}`}
                        component={Link}
                        href={getTagHref(tag)}
                        clickable
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>

                {relatedPosts.length > 0 && (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        관련 글
                      </Typography>
                      <Stack spacing={1.5}>
                        {relatedPosts.map((relatedPost) => (
                          <Box
                            key={relatedPost.id}
                            component={Link}
                            href={`/posts/${relatedPost.slug}`}
                            sx={{
                              p: 2,
                              display: 'block',
                              textDecoration: 'none',
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 1,
                              color: 'text.primary',
                              transition: 'border-color 0.2s ease, background-color 0.2s ease',
                              '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: 'action.hover',
                              },
                            }}
                          >
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                              {relatedPost.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {relatedPost.description || relatedPost.excerpt}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                              <Chip label={relatedPost.category} size="small" />
                              {relatedPost.series && <Chip label={relatedPost.series} size="small" variant="outlined" />}
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </>
                )}

                <Divider />

                <Box>
                  <Typography variant="h6" gutterBottom>
                    작성자 정보
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <AvatarImage
                      src={BLOG_CONFIG.owner.avatar}
                      alt={BLOG_CONFIG.owner.name}
                      size={56}
                      fallbackText={BLOG_CONFIG.owner.name.charAt(0)}
                      priority
                      quality={90}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {BLOG_CONFIG.owner.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {BLOG_CONFIG.owner.bio}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {BLOG_CONFIG.owner.email}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {!isContentPost && <CommentSection postId={post.id} />}
              </Stack>
            </Paper>

            <Box sx={{ display: { xs: 'none', lg: 'block' }, alignSelf: 'stretch' }}>
              <TableOfContents
                content={post.content}
                sticky
                collapsible={false}
                id="post-table-of-contents-desktop"
              />
            </Box>
          </Box>
        </Container>

        <Footer />
      </Box>
    </MuiThemeProvider>
  )
}
