'use client'

import { Card, CardContent, Typography, Chip, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { ThumbnailImage } from './image'

interface Post {
  id: string
  title: string
  content: string
  excerpt?: string
  thumbnail?: string
  tags: string[]
  category?: string
  publishedAt?: string
  authorId?: string
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
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
        },
      }}
    >
      {/* Image Header */}
      <Box sx={{ position: 'relative', height: 160 }}>
        <ThumbnailImage
          src={post.thumbnail}
          alt={post.title}
          width={400}
          height={160}
          fallbackText={post.title.charAt(0).toUpperCase()}
          quality={75}
          borderRadius="0"
          hoverEffect={false}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
        
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
              zIndex: 2,
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
              color: theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main',
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
              {post.category || '일반'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              •
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {post.publishedAt ? formatDate(post.publishedAt) : '날짜 미상'}
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