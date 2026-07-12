'use client'

import { Box, Container, Link as MuiLink, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { forwardRef } from 'react'

const footerLinks = [
  { href: '/about', label: '소개' },
  { href: 'https://github.com/soompy', label: 'GitHub' },
  { href: 'https://buly.kr/1c8Bcxw', label: 'LinkedIn' },
  { href: 'https://instagram.com', label: 'Instagram' },
  { href: 'mailto:yzsumin@naver.com', label: '연락' },
  { href: '/rss.xml', label: 'RSS' }
]

const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <Box
      component="footer"
      ref={ref}
      sx={{
        bgcolor: '#FAFAF8',
        py: { xs: 3, md: 5 }
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={{ xs: 1.5, md: 3 }}
        >
          <Typography sx={{ fontSize: { xs: '1rem', md: '1.5rem' }, fontWeight: 850, color: '#111827' }}>
            SuriBlog
          </Typography>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 0.5, md: 3 }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            {footerLinks.map((item) => {
              const external = item.href.startsWith('http') || item.href.startsWith('mailto:')

              return (
                <MuiLink
                  key={item.href}
                  component={external ? 'a' : Link}
                  href={item.href}
                  target={external && item.href.startsWith('http') ? '_blank' : undefined}
                  rel={external && item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  underline="none"
                  sx={{
                    color: '#6B7280',
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                    fontWeight: 700,
                    '&:hover': { color: '#1D4ED8' }
                  }}
                >
                  {item.label}
                </MuiLink>
              )
            })}
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
})

Footer.displayName = 'Footer'

export default Footer
