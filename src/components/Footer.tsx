'use client'

import { forwardRef } from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  IconButton, 
  Divider
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

const Footer = forwardRef<HTMLElement>((_, ref) => {
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


  return (
    <Box 
      component="footer"
      ref={ref}
      sx={{ 
        backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
        borderTop: '1px solid rgba(0, 29, 58, 0.08)',
        mt: 8,
        py: 6
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4, 
          mb: 4 
        }}>
          {/* Logo & Description */}
          <Box>
            <Box sx={{ mb: 3 }}>
              <Logo />
            </Box>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ lineHeight: 1.6 }}
            >
              무언가를 만들지 않으면 손이 근질거리는 사람. <br />
              자주 삽질, 그리고 매일 기록.
            </Typography>
          </Box>

          {/* Social Links */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
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
        </Box>

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
              by Suri
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
})

Footer.displayName = 'Footer'

export default Footer