'use client'

import { 
  Box, 
  Container, 
  Typography, 
  IconButton, 
  Divider,
  Grid,
  Link
} from '@mui/material'
import { 
  GitHub, 
  LinkedIn, 
  Email,
  Code,
  FavoriteRounded
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import Logo from './Logo'

export default function Footer() {
  const theme = useTheme()
  
  const currentYear = new Date().getFullYear()
  
  const socialLinks = [
    {
      icon: <GitHub />,
      href: "https://github.com/soompy",
      label: "GitHub",
      color: "#333"
    },
    {
      icon: <LinkedIn />,
      href: "https://buly.kr/1c8Bcxw",
      label: "LinkedIn", 
      color: "#0077B5"
    },
    {
      icon: <Email />,
      href: "mailto:contact@suriblog.dev",
      label: "Email",
      color: "#EA4335"
    }
  ]

  const footerLinks = [
    {
      title: "블로그",
      links: [
        { name: "최근 포스트", href: "/" },
        { name: "아카이브", href: "/archives" },
        { name: "프로젝트", href: "/projects" }
      ]
    },
    {
      title: "소개",
      links: [
        { name: "About", href: "/about" },
        { name: "연락하기", href: "/contact" },
        { name: "글쓰기", href: "/write" }
      ]
    }
  ]

  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
        borderTop: '1px solid rgba(0, 29, 58, 0.08)',
        mt: 8,
        py: 6
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Logo & Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Logo />
            </Box>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ lineHeight: 1.6 }}
            >
              웹 퍼블리셔에서 프론트엔드 개발자로 성장하는 여정을 기록하는 공간입니다. 
              기술과 경험을 나누며 함께 배워가요.
            </Typography>
          </Grid>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <Grid item xs={6} md={2} key={index}>
              <Typography 
                variant="h6" 
                component="h3" 
                sx={{ 
                  fontSize: '1rem',
                  fontWeight: 600, 
                  mb: 2,
                  color: 'text.primary'
                }}
              >
                {section.title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {section.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    href={link.href}
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline'
                      },
                      transition: 'color 0.2s ease'
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}

          {/* Tech Stack & Contact */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              component="h3" 
              sx={{ 
                fontSize: '1rem',
                fontWeight: 600, 
                mb: 2,
                color: 'text.primary'
              }}
            >
              기술 스택
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 3 }}>
              {['React', 'Next.js', 'TypeScript', 'Vue', 'Nuxt'].map((tech) => (
                <Box
                  key={tech}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    color: 'text.secondary'
                  }}
                >
                  {tech}
                </Box>
              ))}
            </Box>

            {/* Social Links */}
            <Typography 
              variant="subtitle2" 
              sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}
            >
              연결하기
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: social.color,
                      backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                  aria-label={social.label}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Bottom Section */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              © {currentYear} SuriBlog. Made with
            </Typography>
            <FavoriteRounded sx={{ fontSize: 16, color: '#e91e63' }} />
            <Typography variant="body2" color="text.secondary">
              by 이수민
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Code sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Built with Next.js & Material-UI
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Dev Info */}
        <Box sx={{ 
          mt: 2, 
          pt: 2, 
          borderTop: '1px solid',
          borderTopColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200'
        }}>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              display: 'block',
              textAlign: 'center',
              fontSize: '0.75rem'
            }}
          >
            웹 퍼블리셔 → 프론트엔드 개발자 성장 여정 | 6년차 UI 개발 경험 | Vue ↔ React 크로스 러닝
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}