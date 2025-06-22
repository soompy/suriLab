'use client'

import { useState, useEffect } from 'react'
import { Box, Typography, Container } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { BLOG_CATEGORIES } from '@/shared/constants/categories'

interface CategoryStats {
  [key: string]: number
}

export default function HeroSection() {
  const theme = useTheme()
  const [categoryStats, setCategoryStats] = useState<CategoryStats>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategoryStats = async () => {
      try {
        const response = await fetch('/api/posts')
        if (response.ok) {
          const data = await response.json()
          const posts = data.posts || []
          
          // 카테고리별 게시글 수 계산
          const stats: CategoryStats = {}
          BLOG_CATEGORIES.forEach(category => {
            stats[category] = posts.filter((post: any) => 
              post.category === category && post.isPublished
            ).length
          })
          
          setCategoryStats(stats)
        }
      } catch (error) {
        console.error('Failed to fetch category stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryStats()
  }, [])

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #0a0f1c 0%, #1a1f2e 50%, #2a2f3e 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        minHeight: '40vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: theme.palette.mode === 'dark'
            ? `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
               radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`
            : `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
               radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)`,
          zIndex: 1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))'
            : 'linear-gradient(45deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))',
          borderRadius: '50%',
          filter: 'blur(100px)',
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: { xs: '100%', md: '1300px' }, mx: 'auto', px: 4, position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            textAlign: 'center',
            py: { xs: 4, md: 6 },
          }}
        >
          {/* 장식적 요소 */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 4,
              position: 'relative',
            }}
          >
            <Box
              sx={{
                width: '60px',
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
                borderRadius: '2px',
                position: 'relative',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1, transform: 'scaleX(1)' },
                  '50%': { opacity: 0.7, transform: 'scaleX(1.1)' },
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: '70px',
                  top: 0,
                  width: '20px',
                  height: '4px',
                  background: theme.palette.primary.main,
                  borderRadius: '2px',
                  opacity: 0.6,
                  animation: 'slideIn 2.5s ease-in-out infinite',
                  '@keyframes slideIn': {
                    '0%, 100%': { transform: 'translateX(0px)', opacity: 0.6 },
                    '50%': { transform: 'translateX(5px)', opacity: 1 },
                  },
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: '100px',
                  top: 0,
                  width: '10px',
                  height: '4px',
                  background: theme.palette.primary.main,
                  borderRadius: '2px',
                  opacity: 0.3,
                  animation: 'fadeInOut 3s ease-in-out infinite',
                  '@keyframes fadeInOut': {
                    '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                    '50%': { opacity: 0.8, transform: 'scale(1.2)' },
                  },
                },
              }}
            />
          </Box>

          {/* 메인 타이틀 */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
              fontWeight: 700,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)'
                : 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              position: 'relative',
            }}
          >
            생각을 나누는 공간
          </Typography>

          {/* 서브 타이틀 */}
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              fontWeight: 400,
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
              mb: 5,
              lineHeight: 1.6,
              opacity: 0.9,
            }}
          >
            최신 기술 트렌드와 깊이 있는 인사이트를 통해
            <br />
            함께 성장하는 개발자 커뮤니티를 만들어갑니다
          </Typography>

          {/* 카테고리별 실시간 통계 */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: { xs: 4, md: 8 },
              flexWrap: 'wrap',
              mt: 6,
            }}
          >
            {BLOG_CATEGORIES.map((category, index) => (
              <Box
                key={index}
                sx={{
                  textAlign: 'center',
                  opacity: 0.8,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    mb: 0.5,
                    animation: loading ? 'pulse 1.5s ease-in-out infinite' : 'none',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 0.7 },
                      '50%': { opacity: 1 },
                    },
                  }}
                >
                  {loading ? '...' : categoryStats[category] || 0}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.primary',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    opacity: 0.9
                  }}
                >
                  {category}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>

      {/* 플로팅 요소들 */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          left: '5%',
          width: '8px',
          height: '8px',
          background: theme.palette.primary.main,
          borderRadius: '50%',
          opacity: 0.4,
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) scale(1)' },
            '50%': { transform: 'translateY(-20px) scale(1.2)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '8%',
          width: '12px',
          height: '12px',
          background: 'transparent',
          border: `2px solid ${theme.palette.primary.main}`,
          borderRadius: '50%',
          opacity: 0.3,
          animation: 'rotateFloat 8s linear infinite',
          '@keyframes rotateFloat': {
            '0%': { transform: 'rotate(0deg) translateY(0px)' },
            '25%': { transform: 'rotate(90deg) translateY(-10px)' },
            '50%': { transform: 'rotate(180deg) translateY(0px)' },
            '75%': { transform: 'rotate(270deg) translateY(10px)' },
            '100%': { transform: 'rotate(360deg) translateY(0px)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          left: '15%',
          width: '6px',
          height: '6px',
          background: theme.palette.mode === 'dark' ? '#8b5cf6' : '#7c3aed',
          borderRadius: '50%',
          opacity: 0.5,
          animation: 'bounceFloat 4s ease-in-out infinite',
          '@keyframes bounceFloat': {
            '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
            '25%': { transform: 'translateY(-15px) translateX(5px)' },
            '50%': { transform: 'translateY(0px) translateX(10px)' },
            '75%': { transform: 'translateY(15px) translateX(5px)' },
          },
        }}
      />
      
      {/* 추가 움직이는 장식 요소들 */}
      <Box
        sx={{
          position: 'absolute',
          top: '30%',
          right: '20%',
          width: '4px',
          height: '20px',
          background: `linear-gradient(to bottom, ${theme.palette.primary.main}, transparent)`,
          borderRadius: '2px',
          opacity: 0.3,
          animation: 'stretch 3s ease-in-out infinite',
          '@keyframes stretch': {
            '0%, 100%': { transform: 'scaleY(1) rotate(0deg)' },
            '50%': { transform: 'scaleY(1.5) rotate(5deg)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '30%',
          left: '25%',
          width: '10px',
          height: '10px',
          background: 'transparent',
          border: `1px solid ${theme.palette.mode === 'dark' ? '#8b5cf6' : '#7c3aed'}`,
          transform: 'rotate(45deg)',
          opacity: 0.4,
          animation: 'spin 10s linear infinite',
          '@keyframes spin': {
            from: { transform: 'rotate(45deg)' },
            to: { transform: 'rotate(405deg)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          left: '8%',
          width: '14px',
          height: '2px',
          background: theme.palette.primary.main,
          borderRadius: '1px',
          opacity: 0.2,
          animation: 'slide 5s ease-in-out infinite',
          '@keyframes slide': {
            '0%, 100%': { transform: 'translateX(0px) scaleX(1)' },
            '50%': { transform: 'translateX(20px) scaleX(1.3)' },
          },
        }}
      />
    </Box>
  )
}