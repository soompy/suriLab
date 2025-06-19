'use client'

import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null)

  const menuItems = [
    { href: '/', label: 'Posts' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/contact', label: 'Contact' },
    { href: '/archives', label: 'Archives' },
    { href: '/write', label: 'Write' }
  ]

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null)
  }

  return (
    <AppBar position="sticky" elevation={0}>
      <Box sx={{ maxWidth: '1300px', width: '100%', mx: 'auto', px: { xs: 2, md: 3 } }}>
        <Toolbar sx={{ height: '56px', minHeight: '56px !important', px: '0 !important' }}>
          {/* Logo */}
          <Link href="/" passHref style={{ textDecoration: 'none' }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 600,
                fontSize: '1.125rem',
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.dark',
                },
                transition: 'color 0.2s ease',
              }}
            >
              SuriBlog
            </Typography>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: '14px' }}>
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href} passHref style={{ textDecoration: 'none' }}>
                  <Button
                    sx={{
                      color: pathname === item.href ? 'primary.main' : 'text.secondary',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      minWidth: 'auto',
                      px: 1.5,
                      py: 1,
                      position: 'relative',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: 'primary.main',
                      },
                      '&::after': pathname === item.href ? {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '24px',
                        height: '2px',
                        backgroundColor: 'primary.main',
                      } : {},
                    }}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Box sx={{ ml: 'auto' }}>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMobileMenuOpen}
                sx={{ color: 'text.secondary' }}
              >
                {mobileMenuAnchor ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            </Box>
          )}

          {/* Mobile Menu */}
          <Menu
            anchorEl={mobileMenuAnchor}
            open={Boolean(mobileMenuAnchor)}
            onClose={handleMobileMenuClose}
            sx={{
              mt: 1,
              '& .MuiPaper-root': {
                minWidth: '200px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
              },
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href} passHref style={{ textDecoration: 'none' }}>
                <MenuItem
                  onClick={handleMobileMenuClose}
                  sx={{
                    color: pathname === item.href ? 'primary.main' : 'text.secondary',
                    fontWeight: pathname === item.href ? 600 : 500,
                    fontSize: '0.875rem',
                    py: 1.5,
                    px: 2,
                    minHeight: '44px',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  {item.label}
                </MenuItem>
              </Link>
            ))}
          </Menu>
        </Toolbar>
      </Box>
    </AppBar>
  )
}