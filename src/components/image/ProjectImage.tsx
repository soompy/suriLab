'use client'

import { forwardRef, useState } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { CodeBracketIcon } from '@heroicons/react/24/outline'
import OptimizedImage from '../OptimizedImage'

interface ProjectImageProps {
  src?: string
  alt: string
  projectName?: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  onClick?: () => void
  style?: React.CSSProperties
  borderRadius?: string | number
  showOverlay?: boolean
  overlayContent?: React.ReactNode
}

const ProjectImage = forwardRef<HTMLDivElement, ProjectImageProps>(({
  src,
  alt,
  projectName,
  width = 300,
  height = 200,
  className = '',
  priority = false,
  quality = 85,
  onClick,
  style = {},
  borderRadius = '12px',
  showOverlay = true,
  overlayContent,
  ...props
}, ref) => {
  const theme = useTheme()
  const [isHovered, setIsHovered] = useState(false)

  const fallbackElement = (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius,
        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 배경 패턴 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `radial-gradient(circle at 25% 25%, ${theme.palette.primary.main}, transparent 50%), 
                           radial-gradient(circle at 75% 75%, ${theme.palette.secondary.main}, transparent 50%)`,
        }}
      />
      
      <CodeBracketIcon 
        width={48} 
        height={48} 
        style={{ 
          color: theme.palette.mode === 'dark' ? '#64748b' : '#94a3b8',
          marginBottom: '0.5rem',
          zIndex: 1,
        }} 
      />
      
      <Typography
        variant="h6"
        sx={{
          color: theme.palette.mode === 'dark' ? 'grey.300' : 'grey.700',
          textAlign: 'center',
          fontWeight: 600,
          zIndex: 1,
          mb: 1,
        }}
      >
        {projectName || '프로젝트'}
      </Typography>
      
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.mode === 'dark' ? 'grey.400' : 'grey.600',
          textAlign: 'center',
          zIndex: 1,
          fontWeight: 500,
          px: 2,
        }}
      >
        No Image Available
      </Typography>
    </Box>
  )

  const overlay = showOverlay ? (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
        display: 'flex',
        alignItems: 'flex-end',
        padding: 2,
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
        borderRadius: borderRadius,
      }}
    >
      {overlayContent || (
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: 'white',
              fontWeight: 600,
              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            }}
          >
            {projectName || alt}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            클릭하여 자세히 보기
          </Typography>
        </Box>
      )}
    </Box>
  ) : overlayContent

  const containerStyle = {
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    ...style,
    ...(onClick && {
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 12px 32px rgba(0,0,0,0.4)'
          : '0 12px 32px rgba(0,0,0,0.15)',
      },
    }),
  }

  return (
    <Box
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <OptimizedImage
        src={src || ''}
        alt={alt}
        width={width}
        height={height}
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
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
      />
    </Box>
  )
})

ProjectImage.displayName = 'ProjectImage'

export default ProjectImage