'use client'

import { useState, useEffect } from 'react'
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
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  CircularProgress,
  Paper,
} from '@mui/material'
import { 
  Menu as MenuIcon, 
  Close as CloseIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Search as SearchIcon,
  Edit as EditIcon
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
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const menuItems = [
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/archives', label: 'Archives' },
    { href: '/contact', label: 'Contact' }
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
    setSearchResults([])
    setHasSearched(false)
    setIsSearching(false)
  }

  // 실시간 검색 함수
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setHasSearched(false)
      return
    }

    setIsSearching(true)
    setHasSearched(true)

    try {
      const response = await fetch(`/api/posts?isPublished=true&limit=50`)
      if (response.ok) {
        const data = await response.json()
        const posts = data.posts || []
        
        // 검색 필터링
        const filteredPosts = posts.filter((post: any) => {
          const searchTerm = query.toLowerCase().trim()
          const title = (post.title || '').toLowerCase()
          const excerpt = (post.excerpt || '').toLowerCase()
          const category = (post.category || '').toLowerCase()
          const tags = post.tags || []
          
          return title.includes(searchTerm) ||
                 excerpt.includes(searchTerm) ||
                 category.includes(searchTerm) ||
                 tags.some((tag: any) => (typeof tag === 'string' ? tag : tag.name || '').toLowerCase().includes(searchTerm))
        })

        setSearchResults(filteredPosts.slice(0, 10)) // 최대 10개 결과
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // 디바운스된 검색
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery)
      } else {
        setSearchResults([])
        setHasSearched(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      performSearch(searchQuery)
    }
  }

  const handlePostClick = (post: any) => {
    const slug = post.slug || post.title.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/(^-|-$)/g, '')
    window.location.href = `/posts/${slug}`
    handleSearchClose()
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
              
              {/* Write Button - Special Styling */}
              <Link href="/write" passHref style={{ textDecoration: 'none' }}>
                <Button
                  variant={pathname === '/write' ? 'contained' : 'outlined'}
                  startIcon={<EditIcon />}
                  sx={{
                    ml: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    px: 2,
                    py: 1,
                    borderRadius: '8px',
                    minWidth: 'auto',
                    ...(pathname === '/write' 
                      ? {
                          backgroundColor: 'primary.main',
                          color: 'primary.contrastText',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          }
                        }
                      : {
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            borderColor: 'primary.main',
                          }
                        }
                    )
                  }}
                >
                  Write
                </Button>
              </Link>
              
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
            
            {/* Write Button for Mobile - Special Item */}
            <Box sx={{ px: 2, py: 1 }}>
              <Link href="/write" passHref style={{ textDecoration: 'none' }}>
                <Button
                  variant={pathname === '/write' ? 'contained' : 'outlined'}
                  startIcon={<EditIcon />}
                  fullWidth
                  onClick={handleMobileMenuClose}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    py: 1.5,
                    borderRadius: '8px',
                    ...(pathname === '/write' 
                      ? {
                          backgroundColor: 'primary.main',
                          color: 'primary.contrastText',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          }
                        }
                      : {
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            borderColor: 'primary.main',
                          }
                        }
                    )
                  }}
                >
                  Write New Post
                </Button>
              </Link>
            </Box>
          </Menu>

          {/* Search Dialog */}
          <Dialog
            open={searchOpen}
            onClose={handleSearchClose}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                <SearchIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h5" component="div">
                  블로그 검색
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  원하는 글을 빠르게 찾아보세요
                </Typography>
            </DialogTitle>
            <DialogContent>
              <form onSubmit={handleSearchSubmit}>
                <TextField
                  autoFocus
                  fullWidth
                  placeholder="제목, 내용, 카테고리, 태그로 검색하세요..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#9e9e9e' }} />
                      </InputAdornment>
                    ),
                    endAdornment: isSearching && (
                      <InputAdornment position="end">
                        <CircularProgress size={20} sx={{ color: '#9e9e9e' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      py: 1,
                      background: 'rgba(189, 189, 189, 0.02)',
                      border: '2px solid transparent',
                      '& fieldset': {
                        border: '2px solid rgba(189, 189, 189, 0.1)',
                        transition: 'all 0.3s ease',
                      },
                      '&:hover': {
                        background: 'rgba(189, 189, 189, 0.04)',
                        '& fieldset': {
                          borderColor: 'rgba(189, 189, 189, 0.3)',
                        },
                      },
                      '&.Mui-focused': {
                        background: 'rgba(189, 189, 189, 0.06)',
                        boxShadow: '0 0 0 4px rgba(189, 189, 189, 0.1)',
                        '& fieldset': {
                          borderColor: '#9e9e9e',
                        },
                      },
                    },
                    '& .MuiInputBase-input': {
                      '&::placeholder': {
                        color: 'rgba(189, 189, 189, 0.6)',
                        opacity: 1,
                      },
                    },
                  }}
                />
              </form>

              {/* 검색 결과 */}
              {hasSearched && (
                <Box sx={{ mt: 2 }}>
                  {searchResults.length > 0 ? (
                    <>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 3,
                        p: 2,
                        background: 'linear-gradient(135deg, rgba(189, 189, 189, 0.1) 0%, rgba(224, 224, 224, 0.1) 100%)',
                        borderRadius: 2,
                        border: '1px solid rgba(189, 189, 189, 0.2)',
                      }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#9e9e9e' }}>
                          총 {searchResults.length}개의 검색 결과를 찾았습니다
                        </Typography>
                      </Box>
                      <List sx={{ p: 0 }}>
                        {searchResults.map((post, index) => (
                          <Box key={post.id}>
                            <ListItem
                              onClick={() => handlePostClick(post)}
                              sx={{
                                cursor: 'pointer',
                                borderRadius: 3,
                                mb: 2,
                                p: 3,
                                background: 'background.paper',
                                border: '1px solid rgba(189, 189, 189, 0.1)',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '4px',
                                  height: '100%',
                                  background: 'linear-gradient(135deg, #e8eaf6 0%, #f3e5f5 100%)',
                                  opacity: 0,
                                  transition: 'opacity 0.3s ease',
                                },
                                '&:hover': {
                                  background: 'action.hover',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 8px 25px rgba(189, 189, 189, 0.15)',
                                  borderColor: 'rgba(189, 189, 189, 0.3)',
                                  '&::before': {
                                    opacity: 1,
                                  },
                                },
                              }}
                            >
                              <ListItemText
                                primary={
                                  <Box sx={{ mb: 1 }}>
                                    <Typography 
                                      variant="h6" 
                                      sx={{ 
                                        fontWeight: 600, 
                                        mb: 0.5,
                                        color: 'text.primary',
                                      }}
                                    >
                                      {post.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                      <Chip
                                        label={post.category}
                                        size="small"
                                        sx={{ 
                                          fontSize: '0.75rem',
                                          fontWeight: 600,
                                          background: 'linear-gradient(135deg, #e8eaf6 0%, #f3e5f5 100%)',
                                          color: '#424242',
                                          border: 'none',
                                          '&:hover': {
                                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                          },
                                        }}
                                      />
                                      {post.publishedAt && (
                                        <Typography variant="caption" color="text.secondary">
                                          {new Date(post.publishedAt).toLocaleDateString('ko-KR')}
                                        </Typography>
                                      )}
                                    </Box>
                                  </Box>
                                }
                                secondary={
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        lineHeight: 1.5,
                                        mb: 1,
                                      }}
                                    >
                                      {post.excerpt || '내용 미리보기가 없습니다.'}
                                    </Typography>
                                    {post.tags && post.tags.length > 0 && (
                                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {post.tags.slice(0, 3).map((tag: any, tagIndex: number) => (
                                          <Chip
                                            key={tagIndex}
                                            label={typeof tag === 'string' ? tag : tag.name}
                                            size="small"
                                            sx={{ 
                                              fontSize: '0.7rem', 
                                              height: '22px',
                                              background: 'rgba(189, 189, 189, 0.1)',
                                              color: '#9e9e9e',
                                              border: '1px solid rgba(189, 189, 189, 0.3)',
                                              fontWeight: 500,
                                              '&:hover': {
                                                background: 'rgba(189, 189, 189, 0.2)',
                                              },
                                            }}
                                          />
                                        ))}
                                        {post.tags.length > 3 && (
                                          <Chip
                                            label={`+${post.tags.length - 3}`}
                                            size="small"
                                            sx={{ 
                                              fontSize: '0.7rem', 
                                              height: '22px',
                                              background: 'rgba(224, 224, 224, 0.1)',
                                              color: '#bdbdbd',
                                              border: '1px solid rgba(224, 224, 224, 0.3)',
                                              fontWeight: 500,
                                            }}
                                          />
                                        )}
                                      </Box>
                                    )}
                                  </Box>
                                }
                              />
                            </ListItem>
                            {index < searchResults.length - 1 && <Divider />}
                          </Box>
                        ))}
                      </List>
                    </>
                  ) : (
                    <Paper sx={{ 
                      p: 6, 
                      textAlign: 'center', 
                      background: 'linear-gradient(135deg, rgba(189, 189, 189, 0.05) 0%, rgba(224, 224, 224, 0.05) 100%)',
                      border: '2px dashed rgba(189, 189, 189, 0.2)',
                      borderRadius: 4,
                    }}>
                      <Box sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(189, 189, 189, 0.1) 0%, rgba(224, 224, 224, 0.1) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                      }}>
                        <SearchIcon sx={{ fontSize: 40, color: '#9e9e9e' }} />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#9e9e9e', mb: 2 }}>
                        검색 결과가 없습니다
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        다른 검색어를 시도해보세요
                      </Typography>
                    </Paper>
                  )}
                </Box>
              )}

              {!hasSearched && searchQuery.trim() === '' && (
                <Paper sx={{ 
                  p: 6, 
                  textAlign: 'center', 
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: 4,
                  boxShadow: 'none',
                }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}>
                    <SearchIcon sx={{ fontSize: 48, color: '#9e9e9e' }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#9e9e9e', mb: 2 }}>
                    블로그에서 원하는 글을 찾아보세요
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                    제목, 내용, 카테고리, 태그로 검색할 수 있습니다
                  </Typography>
                </Paper>
              )}
            </DialogContent>
          </Dialog>
        </Toolbar>
      </Box>
    </AppBar>
  )
}