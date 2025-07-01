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
  GitHub as GitHubIcon,
  Launch as LaunchIcon,
  Code as CodeIcon,
  DateRange as DateIcon
} from '@mui/icons-material'
import MuiThemeProvider from '@/components/MuiThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ProjectImage } from '@/components/image'
import SkillTag from '@/components/SkillTag'

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

  // GitHub 실제 저장소 데이터 (최신 커밋 순으로 정렬)
  const allProjects: Project[] = [
    {
      id: 1,
      title: 'PF2024_magazine',
      description: '더매거진 홈페이지 반응형 리뉴얼 포트폴리오입니다. 최신 웹 트렌드를 반영한 모던한 디자인과 완벽한 반응형 레이아웃을 구현했습니다.',
      image: `https://image.thum.io/get/width/1200/crop/800/https://pf-2024-magazine.vercel.app`,
      technologies: ['JavaScript', 'HTML5', 'CSS3', 'Responsive Design'],
      github: 'https://github.com/soompy/PF2024_magazine',
      demo: 'https://pf-2024-magazine.vercel.app',
      date: '2024-09-04',
      category: '웹 개발',
      featured: true
    },
    {
      id: 2,
      title: 'PF2024_hanmi',
      description: '2024년 한미 관련 프로젝트로 깔끔하고 전문적인 웹사이트를 구축했습니다. 사용자 경험을 최우선으로 고려한 인터페이스 설계가 특징입니다.',
      image: `https://image.thum.io/get/width/1200/crop/800/https://pf-2024-hanmi.vercel.app`,
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
      github: 'https://github.com/soompy/PF2024_hanmi',
      demo: 'https://pf-2024-hanmi.vercel.app',
      date: '2024-07-28',
      category: '웹 개발'
    },
    {
      id: 3,
      title: 'PF2023_interactiveVanilla',
      description: '2023년 하반기 Vite와 Vanilla.js로 제작한 인터랙티브 웹 포트폴리오입니다. 프레임워크 없이 순수 자바스크립트로 구현한 동적 인터랙션이 돋보입니다.',
      image: `https://image.thum.io/get/width/1200/crop/800/https://pf-2023-interactive-vanilla.vercel.app`,
      technologies: ['Vite', 'Vanilla JavaScript', 'SCSS', 'Interactive Design'],
      github: 'https://github.com/soompy/PF2023_interactiveVanilla',
      demo: 'https://pf-2023-interactive-vanilla.vercel.app',
      date: '2024-06-07',
      category: '웹 개발',
      featured: true
    },
    {
      id: 4,
      title: 'toy_3_nuxt_nyomnyom',
      description: 'Nuxt.js와 Vue.js를 활용한 토이 프로젝트입니다. Tailwind CSS를 사용하여 모던하고 반응형인 사용자 인터페이스를 구현했습니다.',
      // image: `https://image.thum.io/get/width/1200/crop/800/https://toy-3-nuxt-nyomnyom.vercel.app`,
      technologies: ['Nuxt.js', 'Vue.js', 'Tailwind CSS', 'SSR'],
      github: 'https://github.com/soompy/toy_3_nuxt_nyomnyom',
      demo: 'https://toy-3-nuxt-nyomnyom.vercel.app',
      date: '2023-11-17',
      category: '웹 개발'
    }
  ]

  // 페이지네이션 계산
  const totalPages = Math.ceil(allProjects.length / projectsPerPage)
  const startIndex = (currentPage - 1) * projectsPerPage
  const currentProjects = allProjects.slice(startIndex, startIndex + projectsPerPage)

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const getTagColor = (tag: string) => {
    const colors: { [key: string]: string } = {
      // Frontend & Core Technologies (Light Blue/Cyan family)
      'html': '#ffebee',
      'html5': '#ffebee',
      'css': '#e3f2fd', 
      'css3': '#e3f2fd',
      'javascript': '#fff9c4',
      'vanilla javascript': '#fff9c4',
      'typescript': '#e8f5ff',
      'react': '#e0f7fa',
      'nextjs': '#f3e5f5',
      'next.js': '#f3e5f5',
      'vue': '#e8f5e8',
      'vue.js': '#e8f5e8',
      'nuxt': '#f1f8e9',
      'nuxt.js': '#f1f8e9',
      'frontend': '#e1f5fe',
      'vite': '#f1f8e9',
      
      // Backend & Database (Green/Purple family)
      'backend': '#f1f8e9',
      'database': '#fff8e1',
      'node': '#e8f5e8',
      'python': '#fff3e0',
      'ssr': '#f1f8e9',
      
      // Development & Tools (Purple/Pink family)
      'development': '#f3e5f5',
      'tools': '#e8eaf6',
      'git': '#ffebee',
      'devops': '#e8eaf6',
      
      // Design & UI (Orange/Pink family)
      'responsive design': '#ffebee',
      'interactive design': '#fce4ec',
      'tailwind css': '#e8f5ff',
      'scss': '#e3f2fd',
      
      // AI & Modern Tech (Light Green/Yellow)
      'ai': '#f9fbe7'
    }
    
    const normalizedTag = tag.toLowerCase().trim()
    return colors[normalizedTag] || '#f5f5f5'
  }

  return (
      <MuiThemeProvider>
          <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
              <Header />

              <Container
                  maxWidth={false}
                  sx={{
                      maxWidth: { xs: "100%", md: "1300px" },
                      mx: "auto",
                      px: { xs: 2, sm: 3, md: 4 },
                      py: { xs: 4, md: 6 },
                      overflow: 'hidden'
                  }}
              >
                  <Box sx={{ textAlign: "center", mb: 6 }}>
                      <Typography variant="h2" component="h1" gutterBottom>
                          Projects
                      </Typography>
                      <Typography
                          variant="h6"
                          color="text.secondary"
                          sx={{ maxWidth: 600, mx: "auto" }}
                      >
                          제가 작업한 다양한 개인 프로젝트를 소개합니다. <br />
  웹 퍼블리싱부터 프론트엔드 개발까지, 사용자 경험을 고려한 구현을 했습니다.
                      </Typography>
                  </Box>

                  {/* 프로젝트 통계 */}
                  <Paper
                      sx={{
                          p: 4,
                          mb: 6,
                          textAlign: "center",
                          boxShadow: "none",
                      }}
                  >
                      <Typography variant="h6" gutterBottom>
                          프로젝트 현황
                      </Typography>
                      <Box
                          sx={{
                              mt: 2,
                              display: "grid",
                              gridTemplateColumns: {
                                  xs: "repeat(2, 1fr)",
                                  md: "repeat(3, 1fr)",
                              },
                              gap: 4,
                              justifyItems: "center",
                          }}
                      >
                          <Box sx={{ textAlign: "center" }}>
                              <Typography
                                  variant="h3"
                                  color="primary"
                                  fontWeight="bold"
                              >
                                  {allProjects.length}
                              </Typography>
                              <Typography
                                  variant="body2"
                                  color="text.secondary"
                              >
                                  총 프로젝트
                              </Typography>
                          </Box>
                          <Box sx={{ textAlign: "center" }}>
                              <Typography
                                  variant="h3"
                                  color="primary"
                                  fontWeight="bold"
                              >
                                  {
                                      allProjects.filter(
                                          (p) => p.category === "웹 개발"
                                      ).length
                                  }
                              </Typography>
                              <Typography
                                  variant="body2"
                                  color="text.secondary"
                              >
                                  웹 개발
                              </Typography>
                          </Box>
                          <Box sx={{ textAlign: "center" }}>
                              <Typography
                                  variant="h3"
                                  color="primary"
                                  fontWeight="bold"
                              >
                                  {allProjects.filter((p) => p.featured).length}
                              </Typography>
                              <Typography
                                  variant="body2"
                                  color="text.secondary"
                              >
                                  추천 프로젝트
                              </Typography>
                          </Box>
                      </Box>
                  </Paper>

                  {/* 프로젝트 목록 */}
                  <Box sx={{ mb: 6 }}>
                      <Stack spacing={4}>
                          {currentProjects.map((project) => (
                              <Paper
                                  key={project.id}
                                  sx={{
                                      p: 4,
                                      boxShadow: "none",
                                      position: "relative",
                                  }}
                              >
                                  {project.featured && (
                                      <Chip
                                          label="Featured"
                                          color="primary"
                                          size="small"
                                          sx={{
                                              position: "absolute",
                                              top: 16,
                                              right: 16,
                                              zIndex: 1,
                                          }}
                                      />
                                  )}

                                  <Box
                                      sx={{
                                          display: "grid",
                                          gridTemplateColumns: {
                                              xs: "1fr",
                                              md: "1fr 2fr",
                                          },
                                          gap: { xs: 2, md: 4 },
                                          width: '100%',
                                          minWidth: 0,
                                          overflow: 'hidden'
                                      }}
                                  >
                                      {/* 프로젝트 이미지 */}
                                      <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
                                          <ProjectImage
                                              src={project.image}
                                              alt={`${project.title} 프로젝트 스크린샷`}
                                              projectName={project.title}
                                              width={400}
                                              height={250}
                                              priority={project.featured}
                                              quality={85}
                                              onClick={() => project.demo && handleLinkClick(project.demo)}
                                              borderRadius="12px"
                                              showOverlay={true}
                                              style={{
                                                  border: "1px solid rgba(0,0,0,0.1)",
                                              }}
                                          />
                                      </Box>

                                      {/* 프로젝트 정보 */}
                                      <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
                                          <Box
                                              sx={{
                                                  height: "100%",
                                                  display: "flex",
                                                  flexDirection: "column",
                                              }}
                                          >
                                              <Box sx={{ mb: 2 }}>
                                                  <Typography
                                                      variant="h4"
                                                      component="h2"
                                                      gutterBottom
                                                  >
                                                      {project.title}
                                                  </Typography>
                                                  <Box
                                                      sx={{
                                                          display: "flex",
                                                          alignItems: "center",
                                                          gap: { xs: 1, sm: 2 },
                                                          mb: 2,
                                                          flexWrap: 'wrap',
                                                          minWidth: 0
                                                      }}
                                                  >
                                                      <Chip
                                                          label={
                                                              project.category
                                                          }
                                                          size="small"
                                                          variant="outlined"
                                                      />
                                                      <Box
                                                          sx={{
                                                              display: "flex",
                                                              alignItems:
                                                                  "center",
                                                              gap: 0.5,
                                                          }}
                                                      >
                                                          <DateIcon
                                                              sx={{
                                                                  fontSize: 16,
                                                                  color: "text.secondary",
                                                              }}
                                                          />
                                                          <Typography
                                                              variant="body2"
                                                              color="text.secondary"
                                                              sx={{ fontSize: '0.875rem' }}
                                                          >
                                                              {project.date}
                                                          </Typography>
                                                      </Box>
                                                  </Box>
                                              </Box>

                                              <Typography
                                                  variant="body1"
                                                  color="text.secondary"
                                                  sx={{ mb: 3, flexGrow: 1 }}
                                              >
                                                  {project.description}
                                              </Typography>

                                              {/* 기술 스택 */}
                                              <Box sx={{ mb: 3 }}>
                                                  <Typography
                                                      variant="subtitle2"
                                                      sx={{
                                                          mb: 1,
                                                          display: "flex",
                                                          alignItems: "center",
                                                          gap: 1,
                                                      }}
                                                  >
                                                      <CodeIcon
                                                          sx={{ fontSize: 16 }}
                                                      />
                                                      사용 기술
                                                  </Typography>
                                                  <Box
                                                      sx={{
                                                          display: "flex",
                                                          flexWrap: "wrap",
                                                          gap: 1,
                                                          width: '100%',
                                                          overflow: 'hidden'
                                                      }}
                                                  >
                                                      {project.technologies.map(
                                                          (tech) => (
                                                              <SkillTag
                                                                  key={tech}
                                                                  label={tech}
                                                                  getColor={getTagColor}
                                                              />
                                                          )
                                                      )}
                                                  </Box>
                                              </Box>

                                              {/* 액션 버튼 */}
                                              <Box
                                                  sx={{
                                                      display: "flex",
                                                      gap: { xs: 1, sm: 2 },
                                                      mt: "auto",
                                                      flexWrap: 'wrap'
                                                  }}
                                              >
                                                  {project.github && (
                                                      <Button
                                                          variant="outlined"
                                                          startIcon={
                                                              <GitHubIcon />
                                                          }
                                                          onClick={() =>
                                                              handleLinkClick(
                                                                  project.github!
                                                              )
                                                          }
                                                          sx={{
                                                              textTransform:
                                                                  "none",
                                                          }}
                                                      >
                                                          GitHub
                                                      </Button>
                                                  )}
                                                  {project.demo && (
                                                      <Button
                                                          variant="contained"
                                                          startIcon={
                                                              <LaunchIcon />
                                                          }
                                                          onClick={() =>
                                                              handleLinkClick(
                                                                  project.demo!
                                                              )
                                                          }
                                                          sx={{
                                                              textTransform:
                                                                  "none",
                                                          }}
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
                      <Box
                          sx={{
                              display: "flex",
                              justifyContent: "center",
                              mt: 6,
                          }}
                      >
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
  );
}