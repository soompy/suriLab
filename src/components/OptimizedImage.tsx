'use client'

import { useState, forwardRef } from 'react'
import Image from 'next/image'
import { Box, Skeleton, useTheme } from '@mui/material'
import { PhotoIcon } from '@heroicons/react/24/outline'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  style?: React.CSSProperties
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  objectPosition?: string
  onLoad?: () => void
  onError?: () => void
  onClick?: () => void
  fallback?: React.ReactNode
  sizes?: string
  aspectRatio?: number
  showSkeleton?: boolean
  borderRadius?: string | number
  overlay?: React.ReactNode
  containerProps?: any
}

const OptimizedImage = forwardRef<HTMLDivElement, OptimizedImageProps>(({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  style = {},
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  objectFit = 'cover',
  objectPosition = 'center',
  onLoad,
  onError,
  onClick,
  fallback,
  sizes,
  aspectRatio,
  showSkeleton = true,
  borderRadius = 0,
  overlay,
  containerProps = {},
  ...props
}, ref) => {
  const theme = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  const containerStyle = {
    position: 'relative' as const,
    display: 'inline-block',
    borderRadius,
    overflow: 'hidden',
    ...style,
    ...(aspectRatio && !fill && { aspectRatio: aspectRatio.toString() }),
    ...(fill && { width: '100%', height: '100%' }),
    ...(!fill && width && height && { 
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
    }),
    ...containerProps.style,
  }

  const imageProps = {
    alt,
    priority,
    quality,
    placeholder,
    blurDataURL,
    style: {
      objectFit,
      objectPosition,
      transition: 'opacity 0.3s ease',
      opacity: isLoading ? 0 : 1,
      width: '100%',
      height: '100%',
    },
    onLoad: handleLoad,
    onError: handleError,
    sizes: sizes || (fill ? '100vw' : undefined),
    className,
    ...props,
  }

  const DefaultFallback = () => (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200',
        color: theme.palette.mode === 'dark' ? 'grey.500' : 'grey.400',
        borderRadius: borderRadius,
      }}
    >
      <PhotoIcon width={Math.min(width || 48, height || 48, 48)} height={Math.min(width || 48, height || 48, 48)} />
    </Box>
  )

  return (
    <Box ref={ref} sx={containerStyle} onClick={onClick} {...containerProps}>
      {hasError ? (
        fallback || <DefaultFallback />
      ) : (
        <>
          {isLoading && showSkeleton && (
            <Skeleton
              variant="rectangular"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: borderRadius,
                zIndex: 1,
              }}
            />
          )}
          
          {fill ? (
            <Image
              src={src}
              fill
              {...imageProps}
            />
          ) : (
            <Image
              src={src}
              width={width}
              height={height}
              {...imageProps}
            />
          )}
          
          {overlay && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 2,
              }}
            >
              {overlay}
            </Box>
          )}
        </>
      )}
    </Box>
  )
})

OptimizedImage.displayName = 'OptimizedImage'

export default OptimizedImage