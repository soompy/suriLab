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
  TextField,
  InputAdornment,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { 
  Menu as MenuIcon, 
  Close as CloseIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Search as SearchIcon
} from '@mui/icons-material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme as useCustomTheme } from './ThemeContext'
import Logo from './Logo'

export default function Header() {
  const pathname = usePathname()
  const theme = useTheme()
  const { isDarkMode, toggleTheme } = useCustomTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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

  const handleSearchOpen = () => {
    setSearchOpen(true)
  }

  const handleSearchClose = () => {
    setSearchOpen(false)
    setSearchQuery('')
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Search query:', searchQuery)
      // TODO: 실제 검색 로직 구현
      handleSearchClose()
    }
  }

  return (
    <AppBar position="sticky" elevation={0}>
      <Box sx={{ maxWidth: '1300px', width: '100%', mx: 'auto', px: { xs: 2, md: 3 } }}>
        <Toolbar sx={{ height: '76px', minHeight: '76px !important', px: '0 !important' }}>
          {/* Logo */}
          <Link href="/" passHref style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  '& span': {
                    color: 'primary.dark',
                  },
                },
                transition: 'color 0.2s ease',
              }}
            >
              <Logo size="md" />
            </Box>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: '10px' }}>
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href} passHref style={{ textDecoration: 'none' }}>
                  <Button
                    sx={{
                      color: pathname === item.href ? 'primary.main' : 'text.secondary',
                      fontWeight: 500,
                      fontSize: '0.9rem',
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
              
              {/* Search Button */}
              <IconButton
                onClick={handleSearchOpen}
                size="small"
                sx={{
                  ml: 1,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                <SearchIcon />
              </IconButton>

              {/* Theme Toggle Button */}
              <IconButton
                onClick={toggleTheme}
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Search Button for Mobile */}
              <IconButton
                onClick={handleSearchOpen}
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                <SearchIcon />
              </IconButton>

              {/* Theme Toggle Button for Mobile */}
              <IconButton
                onClick={toggleTheme}
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              
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

          {/* Search Dialog */}
          <Dialog
            open={searchOpen}
            onClose={handleSearchClose}
            maxWidth="sm"
            fullWidth
            sx={{
              '& .MuiDialog-paper': {
                borderRadius: 2,
                mt: { xs: 2, md: 8 },
                mx: { xs: 2, md: 'auto' },
              },
            }}
          >
            <DialogTitle sx={{ pb: 1 }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                검색
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 1 }}>
              <form onSubmit={handleSearchSubmit}>
                <TextField
                  autoFocus
                  fullWidth
                  placeholder="검색어를 입력하세요..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </form>
            </DialogContent>
          </Dialog>
        </Toolbar>
      </Box>
    </AppBar>
  )
}