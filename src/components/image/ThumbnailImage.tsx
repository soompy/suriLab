'use client'

import { forwardRef } from 'react'
import { Typography, Box, useTheme } from '@mui/material'
import OptimizedImage from '../OptimizedImage'

interface ThumbnailImageProps {
  src?: string
  alt: string
  width?: number
  height?: number
  aspectRatio?: number
  fallbackText?: string
  fallbackIcon?: React.ReactNode
  className?: string
  priority?: boolean
  quality?: number
  onClick?: () => void
  style?: React.CSSProperties
  borderRadius?: string | number
  hoverEffect?: boolean
  overlay?: React.ReactNode
}

const ThumbnailImage = forwardRef<HTMLDivElement, ThumbnailImageProps>(({
  src,
  alt,
  width = 300,
  height = 200,
  aspectRatio,
  fallbackText,
  fallbackIcon,
  className = '',
  priority = false,
  quality = 85,
  onClick,
  style = {},
  borderRadius = '8px',
  hoverEffect = true,
  overlay,
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
        width: '100%',
        height: '100%',
        backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius,
        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      }}
    >
      {fallbackIcon || (
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.mode === 'dark' ? 'grey.500' : 'grey.400',
            fontWeight: 500,
            mb: 1,
          }}
        >
          {getFallbackText()}
        </Typography>
      )}
      <Typography
        variant="caption"
        sx={{
          color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.500',
          textAlign: 'center',
          px: 2,
        }}
      >
        이미지 없음
      </Typography>
    </Box>
  )

  const containerStyle = {
    cursor: onClick ? 'pointer' : 'default',
    transition: hoverEffect ? 'transform 0.2s ease, box-shadow 0.2s ease' : undefined,
    ...style,
    ...(onClick && hoverEffect && {
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 8px 24px rgba(0,0,0,0.3)'
          : '0 8px 24px rgba(0,0,0,0.12)',
      },
    }),
  }

  if (!src) {
    return (
      <Box
        ref={ref}
        onClick={onClick}
        sx={{
          width,
          height,
          ...containerStyle,
        }}
        {...props}
      >
        {fallbackElement}
      </Box>
    )
  }

  return (
    <OptimizedImage
      ref={ref}
      src={src}
      alt={alt}
      width={width}
      height={height}
      aspectRatio={aspectRatio}
      priority={priority}
      quality={quality}
      objectFit="cover"
      borderRadius={borderRadius}
      fallback={fallbackElement}
      style={containerStyle}
      className={className}
      onClick={onClick}
      overlay={overlay}
      showSkeleton={true}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      {...props}
    />
  )
})

ThumbnailImage.displayName = 'ThumbnailImage'

export default ThumbnailImage