'use client'

import {
  AppBar,
  Box,
  Button,
  Container,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import type { MouseEvent } from 'react'

const menuItems = [
  { href: '/articles', label: '글' },
  { href: '/momenttune', label: 'MomentTune' },
  { href: '/#timeline', label: '타임라인' },
  { href: '/about', label: '소개' }
]

export default function Header() {
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null)

  const handleMobileMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null)
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#FAFAF8',
        color: '#111827',
        borderBottom: '1px solid #E5E7EB'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 48, md: 76 },
            height: { xs: 48, md: 76 }
          }}
        >
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            <Typography
              component="span"
              sx={{
                fontSize: { xs: '0.875rem', md: '1.25rem' },
                fontWeight: 850,
                letterSpacing: 0,
                color: '#111827'
              }}
            >
              SuriBlog
            </Typography>
          </Link>

          {isMobile ? (
            <Box sx={{ ml: 'auto' }}>
              <Button
                aria-controls={mobileMenuAnchor ? 'site-mobile-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={mobileMenuAnchor ? 'true' : undefined}
                onClick={handleMobileMenuOpen}
                sx={{
                  minWidth: 0,
                  px: 0,
                  color: '#111827',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'none'
                }}
              >
                메뉴
              </Button>
              <Menu
                id="site-mobile-menu"
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleMobileMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                  '& .MuiPaper-root': {
                    mt: 1,
                    minWidth: 180,
                    border: '1px solid #E5E7EB',
                    borderRadius: 3,
                    boxShadow: '0 12px 30px rgba(17, 24, 39, 0.08)'
                  }
                }}
              >
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.href}
                    component={Link}
                    href={item.href}
                    onClick={handleMobileMenuClose}
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: pathname === item.href ? '#1D4ED8' : '#6B7280'
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mx: 'auto' }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    sx={{
                      minWidth: 0,
                      p: 0,
                      color: pathname === item.href ? '#1D4ED8' : '#6B7280',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'transparent',
                        color: '#1D4ED8'
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
              <Button
                component={Link}
                href="/articles"
                variant="outlined"
                sx={{
                  px: 3,
                  py: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 999,
                  color: '#111827',
                  bgcolor: '#FFFFFF',
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#D1D5DB',
                    bgcolor: '#F9FAFB'
                  }
                }}
              >
                글 읽기
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
