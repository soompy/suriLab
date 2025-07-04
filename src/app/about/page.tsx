'use client'

import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Chip, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Link
} from '@mui/material'
import { 
  Code, 
  Work, 
  Timeline, 
  GitHub, 
  LinkedIn,
  LocationOn
} from '@mui/icons-material'
import Header from '@/components/Header'
import MuiThemeProvider from '@/components/MuiThemeProvider'
import Footer from '@/components/Footer'
import { AvatarImage } from '@/components/image'
import SkillTag from '@/components/SkillTag'

export default function AboutPage() {

  const skillColors = {
    // Frontend - 파스텔 톤으로 변경
    'HTML': '#ffebee',
    'CSS/SCSS': '#e3f2fd', 
    'JavaScript': '#fff9c4',
    'TypeScript': '#e8f5ff',
    // Frameworks - 파스텔 톤으로 변경
    'Vue': '#e8f5e8',
    'Nuxt': '#f1f8e9',
    'React': '#e0f7fa',
    'Next.js': '#f3e5f5',
    // Tools - 파스텔 톤으로 변경
    'Git': '#ffebee',
    'Jira': '#e8eaf6',
    'Figma': '#fce4ec',
    'Zeplin': '#fff3e0',
    // Design - 파스텔 톤으로 변경
    'Bootstrap': '#f3e5f5',
    'Material-UI': '#e3f2fd',
    'Responsive Design': '#ffebee'
  }

  const getSkillColor = (skill: string) => {
    return skillColors[skill as keyof typeof skillColors] || '#f5f5f5'
  }

  const skills = [
    { category: 'Frontend', items: ['HTML', 'CSS/SCSS', 'JavaScript', 'TypeScript'] },
    { category: 'Frameworks', items: ['Vue', 'Nuxt', 'React', 'Next.js'] },
    { category: 'Tools', items: ['Git', 'Jira', 'Figma', 'Zeplin'] },
    { category: 'Design', items: ['Bootstrap', 'Material-UI', 'Responsive Design'] }
  ]

  const experiences = [
      {
          title: "Web Publisher",
          company: "빗썸",
          period: "2025.03 - 2025.06",
          description:
              "React 기반 가상화폐 거리소의 초기 렌더링 속도 성능 최적화 작업과 법인 회원가입 프로젝트",
      },
      {
          title: "Freelancer",
          company: "이투스에듀",
          period: "2024.10 - 2025.01",
          description: "Nuxt 기반 교육 플랫폼 웹 프로젝트를 내 인터렉션 구현",
      },
      {
          title: "Web Publisher",
          company: "KakaoVX",
          period: "2021.11 - 2023.09",
          description: "대규모 스포츠·헬스케어 웹 서비스의 UI 개발 및 운영 담당",
      },
      {
          title: "Web Publisher",
          company: "SmartScore",
          period: "2020.07 - 2021.10",
          description: "골프 관련 웹 애플리케이션의 UI/UX 설계 및 퍼블리싱 전반 수행",
      },
      {
          title: "Web Publisher",
          company: "엔라이튼",
          period: "2018.10 - 2019.10",
          description: "태양광 금융 스타트업 웹 서비스 구축 및 유지보수",
      },
  ];

  const projects = [
    {
      name: 'artBox',
      tech: 'React',
      description: '인터렉티브 효과를 활용한 아트 전시 플랫폼 (진행중)'
    },
    {
      name: 'Nyom Nyom Ground',
      tech: 'Nuxt',
      description: 'Mobile responsive website with modern UI/UX'
    },
    {
      name: 'Chunsik Fan Page',
      tech: 'Vite',
      description: 'Interactive fan page with responsive design'
    },
    {
      name: 'SuriBlog',
      tech: 'Next.js',
      description: '개인 기술 블로그 (현재 프로젝트)'
    }
  ]

  return (
    <MuiThemeProvider>
      <div style={{ minHeight: '100vh' }}>
        <Header />
        <Box sx={{ py: { xs: 4, md: 8 }, minHeight: '100vh' }}>
          <Container maxWidth={false} sx={{ maxWidth: { xs: '100%', md: '1200px' }, mx: 'auto', px: { xs: 2, sm: 3, md: 2 }, overflow: 'hidden' }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <AvatarImage
              src="/images/profile.jpg"
              alt="Suri 프로필 사진"
              size={120}
              fallbackText="S"
              priority={true}
              quality={95}
            />
          </Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: 'text.primary',
            }}
          >
            Suri
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 500,
              mb: 2,
              color: 'primary.main',
            }}
          >
            UI Publisher
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.7,
              fontSize: '1.1rem'
            }}
          >
            &quot;예술과 기술을 좋아합니다!&quot;
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 4
        }}>
          {/* Left Column */}
          <Box>
            {/* About Section */}
            <Paper sx={{ 
              p: 4, 
              mb: 4,
              border: '1px solid rgba(0, 29, 58, 0.18)',
              borderRadius: '10px',
              boxShadow: 'none'
            }}>
              <Typography variant="h5" component="h3" sx={{ mb: 3, fontWeight: 600 }}>
                소개
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                안녕하세요, 6년 차 웹 퍼블리셔 Suri입니다.
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                저는 시맨틱하고 유지보수가 용이한 마크업과 CSS 레이아웃 구성에 강점을 가지고 있으며, UX를 고려한 유연한 구조 설계로 추후 기획 변경에도 효과적으로 대응할 수 있는 컴포넌트화된 웹 환경을 지향합니다.
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                반응형과 적응형 웹, 크로스 브라우징, 웹 접근성 구현 경험이 있으며, Git 기반 협업 프로세스(브랜치 관리 등)를 통해 다수의 프로젝트를 성공적으로 완수했습니다. 6주간의 자바스크립트 스터디와 2D Canvas 및 3D Three.js 인터랙티브 웹 개발 교육을 수료하며 프론트엔드 개발 역량도 꾸준히 강화하고 있습니다.
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                Vue와 Nuxt 환경에서 퍼블리싱을 진행했고, SCSS 전처리기와 컴포넌트화 작업으로 코드 재사용성과 유지 보수성을 높였습니다. 현재는 React와 TypeScript 학습도 병행하며 웹 퍼블리셔에서 프론트엔드 개발자로의 역량 확장을 준비 중입니다.
              </Typography>
            </Paper>

            {/* Experience Section */}
            <Paper sx={{ 
              p: 4, 
              mb: 4,
              border: '1px solid rgba(0, 29, 58, 0.18)',
              borderRadius: '10px',
              boxShadow: 'none'
            }}>
              <Typography variant="h5" component="h3" sx={{ mb: 3, fontWeight: 600 }}>
                <Work sx={{ mr: 1, verticalAlign: 'middle' }} />
                Work Experience
              </Typography>
              <List sx={{ p: 0 }}>
                {experiences.map((exp, index) => (
                  <Box key={index}>
                    <ListItem sx={{ px: 0, py: 2 }}>
                      <ListItemIcon>
                        <Timeline color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box>
                            <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
                              {exp.title}
                            </Typography>
                            <Typography variant="subtitle1" color="primary" sx={{ ml: 1 }}>
                              @ {exp.company}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              {exp.period}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {exp.description}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < experiences.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </Paper>

            {/* Projects Section */}
            <Paper sx={{ 
              p: 4,
              border: '1px solid rgba(0, 29, 58, 0.18)',
              borderRadius: '10px',
              boxShadow: 'none'
            }}>
              <Typography variant="h5" component="h3" sx={{ mb: 3, fontWeight: 600 }}>
                <Code sx={{ mr: 1, verticalAlign: 'middle' }} />
                Featured Projects
              </Typography>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 3
              }}>
                {projects.map((project, index) => (
                  <Card variant="outlined" sx={{ height: '100%' }} key={index}>
                    <CardContent>
                      <Typography variant="h6" component="h4" sx={{ mb: 1, fontWeight: 600 }}>
                        {project.name}
                      </Typography>
                      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={project.tech} 
                          size="small" 
                          color="primary" 
                        />
                        {project.name === 'artBox' && (
                          <Chip
                            label="진행중"
                            size="small"
                            sx={{
                              backgroundColor: '#ffebee',
                              color: '#c62828',
                              fontWeight: 'bold',
                              '& .MuiChip-label': {
                                fontSize: '0.75rem'
                              }
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {project.description.replace(' (진행중)', '')}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>
          </Box>

          {/* Right Column */}
          <Box>
            {/* Skills Section */}
            <Paper sx={{ 
              p: 3, 
              mb: 4,
              border: '1px solid rgba(0, 29, 58, 0.18)',
              borderRadius: '10px',
              boxShadow: 'none'
            }}>
              <Typography variant="h6" component="h3" sx={{ mb: 3, fontWeight: 600 }}>
                Technical Skills
              </Typography>
              {skills.map((skillGroup, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                    {skillGroup.category}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {skillGroup.items.map((skill, skillIndex) => (
                      <SkillTag
                        key={skillIndex}
                        label={skill}
                        getColor={getSkillColor}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </Paper>

            {/* Contact Section */}
            <Paper sx={{ 
              p: 3,
              border: '1px solid rgba(0, 29, 58, 0.18)',
              borderRadius: '10px',
              boxShadow: 'none'
            }}>
              <Typography variant="h6" component="h3" sx={{ mb: 3, fontWeight: 600 }}>
                Contact
              </Typography>
              <List sx={{ p: 0 }}>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <GitHub fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="GitHub"
                    secondary={
                      <Link 
                        href="https://github.com/soompy" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{ 
                          fontSize: '0.875rem',
                          textDecoration: 'none',
                          color: 'text.secondary',
                          '&:hover': {
                            color: 'primary.main',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        github.com/soompy
                      </Link>
                    }
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LinkedIn fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="LinkedIn"
                    secondary={
                      <Link 
                        href="https://buly.kr/1c8Bcxw" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{ 
                          fontSize: '0.875rem',
                          textDecoration: 'none',
                          color: 'text.secondary',
                          '&:hover': {
                            color: 'primary.main',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        buly.kr/1c8Bcxw
                      </Link>
                    }
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LocationOn fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Location"
                    secondary="Seoul, Korea"
                    sx={{ '& .MuiListItemText-secondary': { fontSize: '0.875rem' } }}
                  />
                </ListItem>
              </List>
            </Paper>
          </Box>
          </Box>
          </Container>
        </Box>
        
        <Footer />
      </div>
    </MuiThemeProvider>
  )
}