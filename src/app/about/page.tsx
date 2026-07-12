'use client'

import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography
} from '@mui/material'
import {
  ArrowForward as ArrowForwardIcon,
  AutoAwesome as AutoAwesomeIcon,
  GitHub,
  LinkedIn,
  MailOutline as MailOutlineIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MuiThemeProvider from '@/components/MuiThemeProvider'
import SkillTag from '@/components/SkillTag'
import { AvatarImage } from '@/components/image'
import { BLOG_CONFIG } from '@/config/blog'

const principles = [
  'AI 에이전트와 함께 제품을 만드는 프로젝트 빌더',
  'Claude Code, Codex 등을 활용한 작업 과정 기록',
  'MomentTune 개발 일지',
  'AI 자동화 워크플로우'
]

const focusAreas = [
  'MomentTune 제작과 출시 준비',
  'Claude Code, Codex 기반 AI 코딩 워크플로우',
  '1인 프로젝트 빌더로써 MVP 검증'
]

const skills = ['HTML', 'CSS/SCSS', 'TypeScript', 'React', 'Next.js', 'Material UI', 'Figma', 'AI Coding', 'Product Planning']

const experiences = [
  {
    company: '빗썸',
    period: '2025.03 - 2025.06',
    role: 'Web Publisher',
    description: 'React 기반 서비스 초기 렌더링 성능 개선과 법인 회원가입 프로젝트 UI 작업을 담당했습니다.'
  },
  {
    company: '이투스에듀',
    period: '2024.10 - 2025.01',
    role: 'Freelancer',
    description: 'Nuxt 기반 교육 플랫폼의 인터랙션과 화면 구현을 진행했습니다.'
  },
  {
    company: '카카오VX',
    period: '2021 - 2023',
    role: 'Web Publisher',
    description: '골프와 스포츠 도메인 서비스의 웹 UI 구현과 운영을 경험했습니다.'
  },
  {
    company: 'SmartScore',
    period: '2020 - 2021',
    role: 'Web Publisher',
    description: '골프 앱 서비스의 웹 UI 구현과 운영을 경험했습니다.'
  },
  {
    company: '엔라이튼',
    period: '2018 - 2019',
    role: 'Web Publisher',
    description: '태양광 금융 도메인의 웹 UI 구현과 운영을 경험했습니다.'
  }
]

export default function AboutPage() {
  return (
    <MuiThemeProvider>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
        <Header />

        <main>
          <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
            <Container maxWidth="lg" sx={{ pt: { xs: 7, md: 10 }, pb: { xs: 5, md: 8 } }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 4, md: 6 }} alignItems={{ xs: 'flex-start', md: 'center' }}>
                <AvatarImage
                  src={BLOG_CONFIG.owner.avatar}
                  alt={BLOG_CONFIG.owner.name}
                  size={128}
                  fallbackText={BLOG_CONFIG.owner.name.charAt(0)}
                  priority
                  quality={95}
                />
                <Box>
                  <Chip
                    icon={<AutoAwesomeIcon />}
                    label="Building AI Products in Public"
                    variant="outlined"
                    sx={{ mb: 3, bgcolor: 'background.paper' }}
                  />
                  <Typography
                    variant="h1"
                    sx={{
                      maxWidth: { xs: 860, md: 'none' },
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '2.35rem' },
                      lineHeight: 1.25,
                      fontWeight: 850,
                      letterSpacing: 0,
                      color: 'text.primary',
                      mb: 3,
                      whiteSpace: { xs: 'normal', md: 'nowrap' }
                    }}
                  >
                    제품을 만들며 배우고, 배운 것을 기록합니다.
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 760, lineHeight: 1.75, fontWeight: 400 }}>
                    Project Builder with a Dev & Sales Background
                  </Typography>
                </Box>
              </Stack>
            </Container>
          </Box>

          <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
            <Stack spacing={{ xs: 5, md: 7 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr' },
                  gap: 2.5
                }}
              >
                <Paper
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    boxShadow: 'none',
                    bgcolor: 'background.paper'
                  }}
                >
                  <Typography variant="overline" color="primary" sx={{ fontWeight: 800 }}>
                    Why this blog exists
                  </Typography>
                  <Typography variant="h4" component="h2" sx={{ fontWeight: 850, letterSpacing: 0, my: 1.5 }}>
                    제품 제작 기록 블로그
                  </Typography>
                  <Stack spacing={1.25}>
                    {principles.map((principle) => (
                      <Stack key={principle} direction="row" spacing={1.25} alignItems="center">
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#1D4ED8' }} />
                        <Typography variant="body2" sx={{ fontWeight: 650 }}>
                          {principle}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Paper>

                <Paper
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    boxShadow: 'none',
                    bgcolor: '#111827',
                    color: '#FFFFFF'
                  }}
                >
                  <Typography variant="overline" sx={{ color: '#A7F3D0', fontWeight: 800 }}>
                    Current Focus
                  </Typography>
                  <Stack spacing={1.4} sx={{ mt: 2 }}>
                    {focusAreas.map((area) => (
                      <Typography key={area} variant="body2" sx={{ color: 'rgba(255,255,255,0.78)', lineHeight: 1.65 }}>
                        {area}
                      </Typography>
                    ))}
                  </Stack>
                  <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.14)' }} />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Button
                      component={Link}
                      href="/momenttune"
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ borderRadius: 999, bgcolor: '#FFFFFF', color: '#111827', '&:hover': { bgcolor: '#F3F4F6' } }}
                    >
                      MomentTune
                    </Button>
                    <Button
                      component={Link}
                      href="/articles"
                      variant="outlined"
                      sx={{ borderRadius: 999, color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.42)' }}
                    >
                      Articles
                    </Button>
                  </Stack>
                </Paper>
              </Box>

              <Paper
                sx={{
                  p: { xs: 2.5, md: 3 },
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  boxShadow: 'none',
                  bgcolor: 'background.paper'
                }}
              >
                <Typography variant="overline" color="primary" sx={{ fontWeight: 800 }}>
                  Toolkit
                </Typography>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 850, letterSpacing: 0, my: 1.5 }}>
                  UI 구현 경험 위에 AI 제품 제작을 얹고 있습니다.
                </Typography>
                <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', gap: 0.75 }}>
                  {skills.map((skill) => (
                    <SkillTag key={skill} label={skill} variant="small" />
                  ))}
                </Stack>
              </Paper>

              <Box>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 850, letterSpacing: 0, mb: 2.5 }}>
                  Experience
                </Typography>
                <Stack spacing={1.5}>
                  {experiences.map((experience) => (
                    <Paper
                      key={`${experience.company}-${experience.period}`}
                      sx={{
                        p: { xs: 2.25, md: 2.75 },
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        boxShadow: 'none',
                        bgcolor: 'background.paper'
                      }}
                    >
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                        <TimelineIcon color="primary" />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                            {experience.role} · {experience.company}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {experience.period}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>
                            {experience.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Box>

              <Paper
                sx={{
                  p: { xs: 2.5, md: 3 },
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  boxShadow: 'none',
                  bgcolor: 'background.paper'
                }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                  <Box>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 850, mb: 1 }}>
                      Contact
                    </Typography>
                    <Typography color="text.secondary">
                      제품 제작, AI 자동화, 콘텐츠 협업 이야기를 나눌 수 있습니다.
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button href="https://github.com/soompy" target="_blank" rel="noopener noreferrer" startIcon={<GitHub />} variant="outlined" sx={{ borderRadius: 999 }}>
                      GitHub
                    </Button>
                    <Button href="https://buly.kr/1c8Bcxw" target="_blank" rel="noopener noreferrer" startIcon={<LinkedIn />} variant="outlined" sx={{ borderRadius: 999 }}>
                      LinkedIn
                    </Button>
                    <Button href={`mailto:${BLOG_CONFIG.owner.email}`} startIcon={<MailOutlineIcon />} variant="contained" sx={{ borderRadius: 999 }}>
                      Email
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
          </Container>
        </main>

        <Footer />
      </Box>
    </MuiThemeProvider>
  )
}
