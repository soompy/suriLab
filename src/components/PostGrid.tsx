'use client'

import { Box, Typography, Container, Button } from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import PostCard from './PostCard'

interface Post {
  id: string
  title: string
  content: string
  excerpt?: string
  thumbnail?: string
  tags: string[]
  category: string
  publishedAt: string
  authorId: string
  readTime?: number
  views?: number
}

interface PostGridProps {
  posts: Post[]
  onPostClick?: (post: Post) => void
}

export default function PostGrid({ posts, onPostClick }: PostGridProps) {
  return (
    <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth={false} sx={{ maxWidth: { xs: '100%', md: '1300px' }, mx: 'auto', px: 4 }}>
        {/* Section Header */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: '27px',
              fontWeight: 700,
              mb: 1.5,
              color: 'text.primary',
            }}
          >
            최근 포스트
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}
          >
            새로운 인사이트와 경험을 담은 최신 글들을 만나보세요.
          </Typography>
        </Box>

        {/* Content Categories */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* Tech Insights Section */}
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h3"
                component="h3"
                sx={{
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                  fontWeight: 600,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    backgroundColor: '#3b82f6',
                    borderRadius: '50%',
                  }}
                />
                Tech Insights
              </Typography>
              <Typography variant="body2" color="text.secondary">
                최신 기술 동향과 깊이 있는 기술 분석
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: 3 
            }}>
              {posts
                .filter(post => post.category === 'Tech Insights')
                .slice(0, 3)
                .map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onClick={() => onPostClick?.(post)}
                  />
                ))}
            </Box>
          </Box>

          {/* Code Solutions Section */}
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h3"
                component="h3"
                sx={{
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                  fontWeight: 600,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                  }}
                />
                Code Solutions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                실무에서 사용할 수 있는 코드 솔루션과 패턴
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: 3 
            }}>
              {posts
                .filter(post => post.category === 'Code Solutions')
                .slice(0, 3)
                .map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onClick={() => onPostClick?.(post)}
                  />
                ))}
            </Box>
          </Box>

          {/* Developer Tips Section */}
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h3"
                component="h3"
                sx={{
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                  fontWeight: 600,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    backgroundColor: '#8b5cf6',
                    borderRadius: '50%',
                  }}
                />
                Developer Tips
              </Typography>
              <Typography variant="body2" color="text.secondary">
                개발 생산성과 협업을 위한 실용적인 팁
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: 3 
            }}>
              {posts
                .filter(post => post.category === 'Developer Tips')
                .slice(0, 3)
                .map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onClick={() => onPostClick?.(post)}
                  />
                ))}
            </Box>
          </Box>
        </Box>

        {/* Load More Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="text"
            endIcon={<ExpandMore />}
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
              textTransform: 'none',
              '&:hover': {
                color: 'text.primary',
                backgroundColor: 'transparent',
              },
            }}
          >
            더 많은 글 보기
          </Button>
        </Box>
      </Container>
    </Box>
  )
}