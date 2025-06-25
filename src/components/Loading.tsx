'use client'

import { Box, Typography, CircularProgress } from '@mui/material'
import { keyframes } from '@mui/system'

// 애니메이션 정의
const pulse = keyframes`
  0% {
    opacity: 0.4;
    transform: scale(0.95);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 0.4;
    transform: scale(0.95);
  }
`

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
`

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

interface LoadingProps {
  variant?: 'default' | 'minimal' | 'posts' | 'fullscreen'
  message?: string
  size?: 'small' | 'medium' | 'large'
}

export default function Loading({ 
  variant = 'default', 
  message = '로딩 중...',
  size = 'medium'
}: LoadingProps) {
  const getSize = () => {
    switch (size) {
      case 'small': return 24
      case 'large': return 60
      default: return 40
    }
  }

  // 최소한의 로딩 UI
  if (variant === 'minimal') {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        py: 2
      }}>
        <CircularProgress size={getSize()} />
      </Box>
    )
  }

  // 전체 화면 로딩
  if (variant === 'fullscreen') {
    return (
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        animation: `${fadeInUp} 0.3s ease-out`
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          p: 4,
          borderRadius: 2,
          backgroundColor: 'white',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          animation: `${pulse} 2s ease-in-out infinite`
        }}>
          <CircularProgress size={48} thickness={4} />
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              animation: `${bounce} 1.5s ease-in-out infinite`,
              fontWeight: 500
            }}
          >
            {message}
          </Typography>
        </Box>
      </Box>
    )
  }

  // 포스트 로딩 (스켈레톤 스타일)
  if (variant === 'posts') {
    return (
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 3,
        animation: `${fadeInUp} 0.5s ease-out`
      }}>
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <Box
            key={index}
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              backgroundColor: 'grey.50',
              animation: `${pulse} 1.5s ease-in-out infinite`,
              animationDelay: `${index * 0.1}s`
            }}
          >
            {/* 카테고리 스켈레톤 */}
            <Box sx={{
              width: 80,
              height: 20,
              backgroundColor: 'grey.300',
              borderRadius: 1,
              mb: 2,
              animation: `${pulse} 1.2s ease-in-out infinite`
            }} />
            
            {/* 제목 스켈레톤 */}
            <Box sx={{
              width: '85%',
              height: 24,
              backgroundColor: 'grey.300',
              borderRadius: 1,
              mb: 1
            }} />
            <Box sx={{
              width: '60%',
              height: 24,
              backgroundColor: 'grey.300',
              borderRadius: 1,
              mb: 2
            }} />
            
            {/* 내용 스켈레톤 */}
            <Box sx={{
              width: '100%',
              height: 16,
              backgroundColor: 'grey.200',
              borderRadius: 1,
              mb: 1
            }} />
            <Box sx={{
              width: '90%',
              height: 16,
              backgroundColor: 'grey.200',
              borderRadius: 1,
              mb: 2
            }} />
            
            {/* 태그 스켈레톤 */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {[1, 2, 3].map((tagIndex) => (
                <Box
                  key={tagIndex}
                  sx={{
                    width: 50 + (tagIndex * 10),
                    height: 18,
                    backgroundColor: 'grey.200',
                    borderRadius: 1
                  }}
                />
              ))}
            </Box>
            
            {/* 메타 정보 스켈레톤 */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{
                width: 60,
                height: 16,
                backgroundColor: 'grey.200',
                borderRadius: 1
              }} />
              <Box sx={{
                width: 40,
                height: 16,
                backgroundColor: 'grey.200',
                borderRadius: 1
              }} />
            </Box>
          </Box>
        ))}
      </Box>
    )
  }

  // 기본 로딩 UI
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      py: 8,
      animation: `${fadeInUp} 0.4s ease-out`
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        animation: `${pulse} 2s ease-in-out infinite`
      }}>
        <CircularProgress 
          size={getSize()} 
          thickness={4}
          sx={{
            color: 'primary.main'
          }}
        />
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            animation: `${bounce} 1.8s ease-in-out infinite`,
            fontWeight: 500
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  )
}