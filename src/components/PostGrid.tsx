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
      <Container maxWidth={false} sx={{ maxWidth: { xs: '100%', md: '1200px' }, mx: 'auto', px: { xs: 2, sm: 3, md: 2 } }}>
        {/* Section Header */}
        <Box sx={{ mb: { xs: 3, sm: 4, md: 6 } }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '1.5rem', md: '27px' },
              fontWeight: 700,
              mb: { xs: 0.75, sm: 1, md: 1.5 },
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, sm: 4, md: 6 } }}>
          {/* Tech Insights Section */}
          <Box>
            <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
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
              gap: { xs: 1.5, sm: 2, md: 3 } 
            }}>
              {posts.filter(post => post.category === 'Tech Insights').length === 0 ? (
                <Box sx={{ 
                  gridColumn: { xs: '1', sm: '1 / -1', md: '1 / -1' },
                  textAlign: 'center', 
                  py: 4,
                  color: 'text.secondary'
                }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    기술 인사이트 포스트가 없습니다 💡
                  </Typography>
                </Box>
              ) : (
                posts
                  .filter(post => post.category === 'Tech Insights')
                  .slice(0, 3)
                  .map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onClick={() => onPostClick?.(post)}
                    />
                  ))
              )}
            </Box>
          </Box>

          {/* Code Solutions Section */}
          <Box>
            <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
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
              gap: { xs: 1.5, sm: 2, md: 3 } 
            }}>
              {posts.filter(post => post.category === 'Code Solutions').length === 0 ? (
                <Box sx={{ 
                  gridColumn: { xs: '1', sm: '1 / -1', md: '1 / -1' },
                  textAlign: 'center', 
                  py: 4,
                  color: 'text.secondary'
                }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    코드 솔루션 포스트가 없습니다 🔧
                  </Typography>
                </Box>
              ) : (
                posts
                  .filter(post => post.category === 'Code Solutions')
                  .slice(0, 3)
                  .map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onClick={() => onPostClick?.(post)}
                    />
                  ))
              )}
            </Box>
          </Box>

          {/* Study Journal Section */}
          <Box>
            <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
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
                Study Journal
              </Typography>
              <Typography variant="body2" color="text.secondary">
                학습 과정과 기록을 공유하는 일지
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: { xs: 1.5, sm: 2, md: 3 } 
            }}>
              {posts.filter(post => post.category === 'Study Journal').length === 0 ? (
                <Box sx={{ 
                  gridColumn: { xs: '1', sm: '1 / -1', md: '1 / -1' },
                  textAlign: 'center', 
                  py: 4,
                  color: 'text.secondary'
                }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    학습 여정 포스트가 없습니다 📝
                  </Typography>
                </Box>
              ) : (
                posts
                  .filter(post => post.category === 'Study Journal')
                  .slice(0, 3)
                  .map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onClick={() => onPostClick?.(post)}
                    />
                  ))
              )}
            </Box>
          </Box>
        </Box>

        {/* Load More Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 2.5, sm: 3, md: 4 } }}>
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