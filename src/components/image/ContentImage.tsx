'use client'

import { forwardRef, useState, memo } from 'react'
import { Box, IconButton, Modal, Fade, useTheme } from '@mui/material'
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import OptimizedImage from '../OptimizedImage'

interface ContentImageProps {
  src: string
  alt: string
  caption?: string
  maxWidth?: number | string
  priority?: boolean
  quality?: number
  className?: string
  style?: React.CSSProperties
  enableZoom?: boolean
  borderRadius?: string | number
}

const ContentImage = memo(forwardRef<HTMLDivElement, ContentImageProps>(({
  src,
  alt,
  caption,
  maxWidth = '100%',
  priority = false,
  quality = 85,
  className = '',
  style = {},
  enableZoom = true,
  borderRadius = '8px',
  ...props
}, ref) => {
  const theme = useTheme()
  const [isZoomed, setIsZoomed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleZoomOpen = () => {
    if (enableZoom) {
      setIsZoomed(true)
    }
  }

  const handleZoomClose = () => {
    setIsZoomed(false)
  }

  const containerStyle = {
    maxWidth,
    margin: '1.5rem auto',
    textAlign: 'center' as const,
    ...style,
  }

  const imageContainerStyle = {
    position: 'relative' as const,
    display: 'inline-block',
    cursor: enableZoom ? 'zoom-in' : 'default',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    ...(enableZoom && isHovered && {
      transform: 'translateY(-2px)',
      boxShadow: theme.palette.mode === 'dark' 
        ? '0 8px 24px rgba(0,0,0,0.3)'
        : '0 8px 24px rgba(0,0,0,0.12)',
    }),
  }

  return (
    <>
      <Box ref={ref} sx={containerStyle} {...props}>
        <Box
          sx={imageContainerStyle}
          onClick={handleZoomOpen}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <OptimizedImage
            src={src}
            alt={alt}
            fill={false}
            width={800}
            height={600}
            priority={priority}
            quality={quality}
            objectFit="contain"
            borderRadius={borderRadius}
            className={className}
            showSkeleton={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
            style={{
              width: '100%',
              height: 'auto',
            }}
          />
          
          {enableZoom && isHovered && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: '50%',
                padding: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.2s ease',
              }}
            >
              <MagnifyingGlassIcon 
                width={16} 
                height={16} 
                style={{ color: 'white' }} 
              />
            </Box>
          )}
        </Box>
        
        {caption && (
          <Box
            component="figcaption"
            sx={{
              mt: 1,
              fontSize: '0.875rem',
              color: 'text.secondary',
              fontStyle: 'italic',
              lineHeight: 1.4,
            }}
          >
            {caption}
          </Box>
        )}
      </Box>

      {/* 확대 모달 */}
      <Modal
        open={isZoomed}
        onClose={handleZoomClose}
        closeAfterTransition
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Fade in={isZoomed}>
          <Box
            sx={{
              position: 'relative',
              maxWidth: '95vw',
              maxHeight: '95vh',
              outline: 'none',
            }}
          >
            <OptimizedImage
              src={src}
              alt={alt}
              fill={false}
              width={1200}
              height={900}
              quality={95}
              objectFit="contain"
              borderRadius={borderRadius}
              showSkeleton={true}
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '95vw',
                maxHeight: '95vh',
              }}
            />
            
            <IconButton
              onClick={handleZoomClose}
              sx={{
                position: 'absolute',
                top: -40,
                right: -40,
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.8)',
                },
              }}
            >
              <XMarkIcon width={24} height={24} />
            </IconButton>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}))

ContentImage.displayName = 'ContentImage'

export { ContentImage }