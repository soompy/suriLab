'use client'

import { Card, CardMedia, CardContent, Typography, Chip, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

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

interface PostCardProps {
  post: Post
  onClick?: () => void
}

export default function PostCard({ post, onClick }: PostCardProps) {
  const theme = useTheme()
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const summary = post.excerpt || post.content.slice(0, 120) + '...'

  return (
    <Card 
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        transition: 'border 0.2s ease, background-color 0.2s ease, transform 0.2s ease',
        border: '1px solid rgba(0, 29, 58, 0.18)',
        borderRadius: '14px',
        overflow: 'hidden',
        mb: 3,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      {/* Image Header */}
      <Box sx={{ position: 'relative', height: 160 }}>
        {post.thumbnail ? (
          <CardMedia
            component="img"
            height="160"
            image={post.thumbnail}
            alt={post.title}
            sx={{
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: theme.palette.mode === 'dark' ? 'grey.500' : 'grey.400',
                fontWeight: 500,
              }}
            >
              {post.title.charAt(0).toUpperCase()}
            </Typography>
          </Box>
        )}
        
        {/* Category Badge */}
        {post.tags[0] && (
          <Chip
            label={post.tags[0]}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              color: theme.palette.mode === 'dark' ? 'white' : 'grey.700',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          />
        )}
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 2 }}>
        {/* Title */}
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            mb: 1,
            lineHeight: 1.4,
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            transition: 'color 0.15s ease',
            '&:hover': {
              color: theme.palette.mode === 'dark' ? 'grey.300' : 'grey.600',
            },
          }}
        >
          {post.title}
        </Typography>

        {/* Summary */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            lineHeight: 1.5,
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
        >
          {summary}
        </Typography>

        {/* Meta info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {post.category}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              •
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(post.publishedAt)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {post.readTime && (
              <Typography variant="caption" color="text.secondary">
                {post.readTime}분
              </Typography>
            )}
            {post.views && (
              <Typography variant="caption" color="text.secondary">
                {post.views.toLocaleString()}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}