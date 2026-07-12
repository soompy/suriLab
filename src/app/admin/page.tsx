'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography
} from '@mui/material'
import {
  Add as AddIcon,
  Article as ArticleIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Lock as LockIcon
} from '@mui/icons-material'
import MuiThemeProvider from '@/components/MuiThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoginDialog from '@/components/LoginDialog'
import { AuthService } from '@/lib/auth'
import type { PostEntity } from '@/entities/Post'

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [posts, setPosts] = useState<PostEntity[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const stats = useMemo(() => {
    const published = posts.filter((post) => post.isPublished).length
    const drafts = posts.filter((post) => !post.isPublished || post.draft).length

    return {
      total: posts.length,
      published,
      drafts
    }
  }, [posts])

  const loadPosts = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/posts?limit=200&sortField=updatedAt&sortOrder=desc', {
        headers: AuthService.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('글 목록을 불러오지 못했습니다.')
      }

      const data = await response.json()
      setPosts(data.posts || [])
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : '관리자 데이터를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const authenticated = AuthService.isAuthenticated()
    setIsAuthenticated(authenticated)

    if (authenticated) {
      loadPosts()
    }
  }, [])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    setShowLoginDialog(false)
    loadPosts()
  }

  const handleLogout = () => {
    AuthService.logout()
    setIsAuthenticated(false)
    setPosts([])
  }

  if (!isAuthenticated) {
    return (
      <MuiThemeProvider>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
          <Header />
          <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
            <Paper sx={{ p: { xs: 3, md: 5 }, textAlign: 'center', borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
              <LockIcon sx={{ fontSize: 56, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
                SuriBlog Admin
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                글 작성, 초안 관리, 발행 상태 변경은 관리자 로그인 후 사용할 수 있습니다.
              </Typography>
              <Button variant="contained" startIcon={<LockIcon />} onClick={() => setShowLoginDialog(true)}>
                관리자 로그인
              </Button>
            </Paper>
          </Container>
          <Footer />
          <LoginDialog
            open={showLoginDialog}
            onClose={() => setShowLoginDialog(false)}
            onSuccess={handleLoginSuccess}
          />
        </Box>
      </MuiThemeProvider>
    )
  }

  return (
    <MuiThemeProvider>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
        <Header />
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Stack spacing={4}>
            <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
                <Box>
                  <Chip icon={<DashboardIcon />} label="Admin" size="small" color="primary" sx={{ mb: 2 }} />
                  <Typography variant="h3" component="h1" sx={{ fontWeight: 850, mb: 1 }}>
                    콘텐츠 운영 대시보드
                  </Typography>
                  <Typography color="text.secondary">
                    글 작성, 초안 관리, 발행 상태를 한 곳에서 관리합니다.
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1.5}>
                  <Button component={Link} href="/admin/posts/new" variant="contained" startIcon={<AddIcon />}>
                    새 글 작성
                  </Button>
                  <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}>
                    로그아웃
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            {error && <Alert severity="error">{error}</Alert>}

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              {[
                { label: '전체 글', value: stats.total },
                { label: '발행 글', value: stats.published },
                { label: '초안/비공개', value: stats.drafts }
              ].map((item) => (
                <Paper key={item.label} sx={{ p: 3, borderRadius: 2, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                  <Typography color="text.secondary" sx={{ mb: 1, fontWeight: 700 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 850 }}>
                    {loading ? '-' : item.value}
                  </Typography>
                </Paper>
              ))}
            </Box>

            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <ArticleIcon color="primary" />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      포스트 관리
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      기존 글 수정, 삭제, 발행 상태 변경을 관리합니다.
                    </Typography>
                  </Box>
                </Stack>
                <Button component={Link} href="/admin/posts" variant="outlined">
                  관리 화면 열기
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Container>
        <Footer />
      </Box>
    </MuiThemeProvider>
  )
}
