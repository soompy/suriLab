'use client'

import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  Pagination,
  Stack,
} from '@mui/material'
import {
  Work as WorkIcon,
  GitHub as GitHubIcon,
  Launch as LaunchIcon,
  Code as CodeIcon,
  DateRange as DateIcon
} from '@mui/icons-material'
import MuiThemeProvider from '@/components/MuiThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Project {
  id: number
  title: string
  description: string
  image?: string
  technologies: string[]
  github?: string
  demo?: string
  date: string
  category: string
  featured?: boolean
}

export default function Projects() {
  const [currentPage, setCurrentPage] = useState(1)
  const projectsPerPage = 5

  // 더미 데이터 - 실제로는 API나 CMS에서 가져올 데이터
  const allProjects: Project[] = [
    {
      id: 1,
      title: 'SuriBlog - 개인 기술 블로그',
      description: 'Next.js와 TypeScript로 구축한 현대적인 블로그 플랫폼입니다. 마크다운 지원, 다크모드, 반응형 디자인, 그리고 최적화된 SEO를 특징으로 합니다.',
      image: '/images/projects/suriblog.jpg',
      technologies: ['Next.js', 'TypeScript', 'Material-UI', 'Markdown'],
      github: 'https://github.com/soompy/suriblog',
      demo: 'https://suriblog.vercel.app',
      date: '2024-01',
      category: '웹 개발',
      featured: true
    },
    {
      id: 2,
      title: 'E-Commerce 플랫폼',
      description: '풀스택 전자상거래 웹사이트로 사용자 인증, 상품 관리, 장바구니, 결제 시스템을 포함합니다. 관리자 대시보드와 실시간 주문 추적 기능을 제공합니다.',
      image: '/images/projects/ecommerce.jpg',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      github: 'https://github.com/soompy/ecommerce',
      demo: 'https://ecommerce-demo.com',
      date: '2023-12',
      category: '웹 개발'
    },
    {
      id: 3,
      title: 'Weather Dashboard',
      description: '위치 기반 날씨 정보를 제공하는 반응형 웹 애플리케이션입니다. 실시간 날씨 데이터, 5일 예보, 인터랙티브 차트를 포함합니다.',
      image: '/images/projects/weather.jpg',
      technologies: ['Vue.js', 'Chart.js', 'OpenWeather API', 'SCSS'],
      github: 'https://github.com/soompy/weather-dashboard',
      demo: 'https://weather-demo.com',
      date: '2023-11',
      category: '웹 개발'
    },
    {
      id: 4,
      title: '포트폴리오 웹사이트',
      description: '개인 포트폴리오를 위한 미니멀하고 우아한 웹사이트입니다. 부드러운 애니메이션과 모던한 디자인으로 제작되었습니다.',
      image: '/images/projects/portfolio.jpg',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
      github: 'https://github.com/soompy/portfolio',
      demo: 'https://portfolio-demo.com',
      date: '2023-10',
      category: '웹 디자인'
    },
    {
      id: 5,
      title: 'Task Management App',
      description: '팀 협업을 위한 작업 관리 애플리케이션입니다. 실시간 업데이트, 파일 공유, 진행률 추적 기능을 제공합니다.',
      image: '/images/projects/taskmanager.jpg',
      technologies: ['React', 'Firebase', 'Material-UI', 'Socket.io'],
      github: 'https://github.com/soompy/task-manager',
      demo: 'https://taskmanager-demo.com',
      date: '2023-09',
      category: '웹 개발'
    },
    {
      id: 6,
      title: '모바일 게임 UI/UX',
      description: '모바일 퍼즐 게임의 UI/UX 디자인 프로젝트입니다. 사용자 친화적인 인터페이스와 매력적인 비주얼 디자인이 특징입니다.',
      image: '/images/projects/gameui.jpg',
      technologies: ['Figma', 'Adobe XD', 'Photoshop', 'Unity'],
      demo: 'https://gameui-demo.com',
      date: '2023-08',
      category: 'UI/UX 디자인'
    },
    {
      id: 7,
      title: '데이터 시각화 대시보드',
      description: '비즈니스 인텔리전스를 위한 데이터 시각화 대시보드입니다. 실시간 차트, 필터링, 드릴다운 기능을 제공합니다.',
      image: '/images/projects/dashboard.jpg',
      technologies: ['D3.js', 'React', 'Python', 'PostgreSQL'],
      github: 'https://github.com/soompy/data-dashboard',
      demo: 'https://dashboard-demo.com',
      date: '2023-07',
      category: '데이터 분석'
    }
  ]

  // 페이지네이션 계산
  const totalPages = Math.ceil(allProjects.length / projectsPerPage)
  const startIndex = (currentPage - 1) * projectsPerPage
  const currentProjects = allProjects.slice(startIndex, startIndex + projectsPerPage)

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <MuiThemeProvider>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header />
        
        <Container maxWidth={false} sx={{ maxWidth: { xs: '100%', md: '1300px' }, mx: 'auto', px: 4, py: 6 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Projects
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              제가 작업한 다양한 프로젝트들을 소개합니다. 웹 개발부터 UI/UX 디자인까지 다양한 경험을 쌓아가고 있습니다.
            </Typography>
          </Box>

          {/* 프로젝트 통계 */}
          <Paper sx={{ p: 4, mb: 6, textAlign: 'center', boxShadow: 'none' }}>
            <Typography variant="h6" gutterBottom>
              프로젝트 현황
            </Typography>
            <Box
              sx={{
                mt: 2,
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)'
                },
                gap: 4,
                justifyItems: 'center'
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {allProjects.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  총 프로젝트
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {allProjects.filter(p => p.category === '웹 개발').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  웹 개발
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {allProjects.filter(p => p.category === 'UI/UX 디자인').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  UI/UX 디자인
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {allProjects.filter(p => p.featured).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  추천 프로젝트
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* 프로젝트 목록 */}
          <Box sx={{ mb: 6 }}>
            <Stack spacing={4}>
              {currentProjects.map((project) => (
                <Paper key={project.id} sx={{ p: 4, boxShadow: 'none', position: 'relative' }}>
                  {project.featured && (
                    <Chip
                      label="Featured"
                      color="primary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 1
                      }}
                    />
                  )}
                  
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        md: '1fr 2fr'
                      },
                      gap: 4
                    }}
                  >
                    {/* 프로젝트 이미지 */}
                    <Box>
                      <Box
                        sx={{
                          width: '100%',
                          height: 250,
                          bgcolor: 'grey.200',
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        {project.image ? (
                          <Box
                            component="img"
                            src={project.image}
                            alt={project.title}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              // 이미지 로드 실패 시 대체 내용 표시
                              (e.target as HTMLElement).style.display = 'none'
                            }}
                          />
                        ) : null}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: 'text.secondary'
                          }}
                        >
                          <WorkIcon sx={{ fontSize: 48 }} />
                        </Box>
                      </Box>
                    </Box>

                    {/* 프로젝트 정보 */}
                    <Box>
                      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="h4" component="h2" gutterBottom>
                            {project.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Chip label={project.category} size="small" variant="outlined" />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <DateIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {project.date}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                          {project.description}
                        </Typography>

                        {/* 기술 스택 */}
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CodeIcon sx={{ fontSize: 16 }} />
                            사용 기술
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {project.technologies.map((tech) => (
                              <Chip
                                key={tech}
                                label={tech}
                                size="small"
                                sx={{ fontSize: '0.75rem' }}
                              />
                            ))}
                          </Box>
                        </Box>

                        {/* 액션 버튼 */}
                        <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                          {project.github && (
                            <Button
                              variant="outlined"
                              startIcon={<GitHubIcon />}
                              onClick={() => handleLinkClick(project.github!)}
                              sx={{ textTransform: 'none' }}
                            >
                              GitHub
                            </Button>
                          )}
                          {project.demo && (
                            <Button
                              variant="contained"
                              startIcon={<LaunchIcon />}
                              onClick={() => handleLinkClick(project.demo!)}
                              sx={{ textTransform: 'none' }}
                            >
                              Live Demo
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Box>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}

        </Container>
        
        <Footer />
      </Box>
    </MuiThemeProvider>
  )
}