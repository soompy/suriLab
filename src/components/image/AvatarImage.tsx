'use client'

import { forwardRef } from 'react'
import { Typography, Box, useTheme } from '@mui/material'
import OptimizedImage from '../OptimizedImage'

interface AvatarImageProps {
  src?: string
  alt: string
  size?: number
  fallbackText?: string
  className?: string
  priority?: boolean
  quality?: number
  onClick?: () => void
  style?: React.CSSProperties
}

const AvatarImage = forwardRef<HTMLDivElement, AvatarImageProps>(({
  src,
  alt,
  size = 48,
  fallbackText,
  className = '',
  priority = false,
  quality = 90,
  onClick,
  style = {},
  ...props
}, ref) => {
  const theme = useTheme()

  const getFallbackText = () => {
    if (fallbackText) return fallbackText
    return alt.charAt(0).toUpperCase()
  }

  const fallbackElement = (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease',
        '&:hover': onClick ? {
          transform: 'scale(1.05)',
        } : {},
      }}
      onClick={onClick}
    >
      <Typography
        variant="body1"
        sx={{
          color: 'white',
          fontWeight: 600,
          fontSize: size * 0.4,
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}
      >
        {getFallbackText()}
      </Typography>
    </Box>
  )

  if (!src) {
    return <Box ref={ref} {...props}>{fallbackElement}</Box>
  }

  return (
    <Box
      ref={ref}
      onClick={onClick}
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease',
        flexShrink: 0,
        '&:hover': onClick ? {
          transform: 'scale(1.05)',
        } : {},
        ...style,
      }}
      className={className}
      {...props}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        width={size}
        height={size}
        priority={priority}
        quality={quality}
        objectFit="cover"
        borderRadius="0"
        fallback={fallbackElement}
        style={{
          width: '100%',
          height: '100%',
        }}
        containerProps={{
          style: {
            width: '100%',
            height: '100%',
          }
        }}
        showSkeleton={true}
      />
    </Box>
  )
})

AvatarImage.displayName = 'AvatarImage'

export default AvatarImage