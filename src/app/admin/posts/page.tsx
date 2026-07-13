'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Alert,
  Pagination
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Publish as PublishIcon,
  Unpublished as UnpublishedIcon
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import MuiThemeProvider from '@/components/MuiThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoginDialog from '@/components/LoginDialog'
import { PostEntity } from '@/entities/Post'
import { AuthService } from '@/lib/auth'

export default function AdminPostsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<PostEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{open: boolean, post: PostEntity | null}>({
    open: false,
    post: null
  })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchPosts = useCallback(async () => {
    if (!AuthService.isAuthenticated()) {
      setIsAuthenticated(false)
      setShowLoginDialog(true)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        isPublished: '', // 모든 포스트 (공개/비공개)
        search: searchQuery
      })

      const response = await fetch(`/api/posts?${params.toString()}`, {
        headers: AuthService.getAuthHeaders()
      })
      if (!response.ok) {
        if (response.status === 401) {
          AuthService.logout()
          setIsAuthenticated(false)
          setShowLoginDialog(true)
        }
        throw new Error('Failed to fetch posts')
      }

      const data = await response.json()
      setPosts(data.posts)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [page, searchQuery])

  useEffect(() => {
    const authenticated = AuthService.isAuthenticated()
    setIsAuthenticated(authenticated)

    if (authenticated) {
      fetchPosts()
    } else {
      setLoading(false)
      setShowLoginDialog(true)
    }
  }, [fetchPosts])

  const handleDelete = async (post: PostEntity) => {
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: AuthService.getAuthHeaders()
      })

      if (!response.ok) {
        if (response.status === 401) {
          AuthService.logout()
          setIsAuthenticated(false)
          setShowLoginDialog(true)
          return
        }
        throw new Error('Failed to delete post')
      }

      await fetchPosts()
      setDeleteDialog({ open: false, post: null })
      alert('포스트가 삭제되었습니다.')
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('포스트 삭제에 실패했습니다.')
    }
  }

  const handleTogglePublish = async (post: PostEntity) => {
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          ...AuthService.getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isPublished: !post.isPublished
        })
      })

      if (!response.ok) {
        if (response.status === 401) {
          AuthService.logout()
          setIsAuthenticated(false)
          setShowLoginDialog(true)
          return
        }
        throw new Error('Failed to update post')
      }

      await fetchPosts()
      alert(`포스트가 ${!post.isPublished ? '공개' : '비공개'}되었습니다.`)
    } catch (error) {
      console.error('Error updating post:', error)
      alert('포스트 상태 변경에 실패했습니다.')
    }
  }

  const handleView = (post: PostEntity) => {
    window.open(`/posts/${post.slug}`, '_blank')
  }

  const handleEdit = (post: PostEntity) => {
    router.push(`/admin/posts/${post.id}/edit`)
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    setShowLoginDialog(false)
    fetchPosts()
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <MuiThemeProvider>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
          <Header />
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography>로딩 중...</Typography>
          </Container>
          <Footer />
        </Box>
      </MuiThemeProvider>
    )
  }

  if (!isAuthenticated) {
    return (
      <MuiThemeProvider>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
          <Header />
          <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
                관리자 로그인이 필요합니다
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                포스트 목록, 초안, 발행 상태는 관리자만 볼 수 있습니다.
              </Typography>
              <Button variant="contained" onClick={() => setShowLoginDialog(true)}>
                로그인
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
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1">
              포스트 관리
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/admin/posts/new')}
            >
              새 포스트 작성
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Paper sx={{ mb: 3 }}>
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                placeholder="제목, 내용으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
              />
            </Box>
          </Paper>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>제목</TableCell>
                  <TableCell>상태</TableCell>
                  <TableCell>카테고리</TableCell>
                  <TableCell>조회수</TableCell>
                  <TableCell>작성일</TableCell>
                  <TableCell>수정일</TableCell>
                  <TableCell>작업</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" noWrap>
                          {post.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {post.excerpt}
                        </Typography>
                        {post.featured && (
                          <Chip label="추천" size="small" color="secondary" sx={{ ml: 1 }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={post.isPublished ? '공개' : '비공개'}
                        color={post.isPublished ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>{post.views?.toLocaleString() || 0}</TableCell>
                    <TableCell>{formatDate(post.publishedAt)}</TableCell>
                    <TableCell>{formatDate(post.updatedAt)}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={() => handleView(post)}
                          title="보기"
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(post)}
                          title="편집"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleTogglePublish(post)}
                          title={post.isPublished ? '비공개로 변경' : '공개로 변경'}
                        >
                          {post.isPublished ? <UnpublishedIcon /> : <PublishIcon />}
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteDialog({ open: true, post })}
                          title="삭제"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
                color="primary"
              />
            </Box>
          )}

          {/* 삭제 확인 다이얼로그 */}
          <Dialog
            open={deleteDialog.open}
            onClose={() => setDeleteDialog({ open: false, post: null })}
          >
            <DialogTitle>포스트 삭제</DialogTitle>
            <DialogContent>
              <Typography>
                &quot;{deleteDialog.post?.title}&quot; 포스트를 정말 삭제하시겠습니까?
                이 작업은 되돌릴 수 없습니다.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialog({ open: false, post: null })}>
                취소
              </Button>
              <Button
                color="error"
                onClick={() => deleteDialog.post && handleDelete(deleteDialog.post)}
              >
                삭제
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
        
        <Footer />
      </Box>
    </MuiThemeProvider>
  )
}
