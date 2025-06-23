'use client'

import { useState, useEffect } from 'react'
import {
  IconButton,
  Typography,
  Box,
  Tooltip,
  Fade
} from '@mui/material'
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material'

interface LikeButtonProps {
  postId: string
}

interface LikeData {
  count: number
  userLiked: boolean
}

export default function LikeButton({ postId }: LikeButtonProps) {
  const [likeData, setLikeData] = useState<LikeData>({ count: 0, userLiked: false })
  const [loading, setLoading] = useState(true)
  const [animating, setAnimating] = useState(false)

  const fetchLikes = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/likes`)
      if (response.ok) {
        const data = await response.json()
        setLikeData(data)
      }
    } catch (error) {
      console.error('Failed to fetch likes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLikes()
  }, [postId])

  const handleLikeToggle = async () => {
    if (loading || animating) return

    setAnimating(true)
    
    try {
      const response = await fetch(`/api/posts/${postId}/likes`, {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        setLikeData({
          count: data.count,
          userLiked: data.userLiked
        })
        
        setTimeout(() => {
          setAnimating(false)
        }, 300)
      }
    } catch (error) {
      console.error('Failed to toggle like:', error)
      setAnimating(false)
    }
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        userSelect: 'none'
      }}
    >
      <Tooltip title={likeData.userLiked ? '좋아요 취소' : '좋아요'}>
        <IconButton
          onClick={handleLikeToggle}
          disabled={loading || animating}
          sx={{
            color: likeData.userLiked ? 'error.main' : 'text.secondary',
            transform: animating ? 'scale(1.2)' : 'scale(1)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
              backgroundColor: likeData.userLiked ? 'error.lighter' : 'action.hover',
            }
          }}
        >
          <Fade in={!animating} timeout={150}>
            <Box>
              {likeData.userLiked ? (
                <FavoriteIcon 
                  sx={{ 
                    fontSize: 24,
                    filter: animating ? 'brightness(1.3)' : 'none'
                  }} 
                />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 24 }} />
              )}
            </Box>
          </Fade>
        </IconButton>
      </Tooltip>
      
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ 
          minWidth: '24px',
          fontWeight: likeData.userLiked ? 'bold' : 'normal',
          color: likeData.userLiked ? 'error.main' : 'text.secondary',
          transition: 'all 0.2s ease-in-out'
        }}
      >
        {loading ? '...' : likeData.count.toLocaleString()}
      </Typography>
    </Box>
  )
}