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
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Select,
  Stack,
  Alert,
  Pagination,
  Tooltip
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Publish as PublishIcon,
  Unpublished as UnpublishedIcon,
  Refresh as RefreshIcon
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [sourceFilter, setSourceFilter] = useState<'all' | 'database' | 'content'>('all')

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
        search: searchQuery
      })
      if (statusFilter === 'published') {
        params.set('isPublished', 'true')
      } else if (statusFilter === 'draft') {
        params.set('isPublished', 'false')
      } else {
        params.set('isPublished', '')
      }

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
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [page, searchQuery, statusFilter])

  const visiblePosts = posts.filter((post) => {
    if (sourceFilter === 'all') return true
    return sourceFilter === 'content'
      ? post.source === 'content' || post.id.startsWith('content:')
      : post.source !== 'content' && !post.id.startsWith('content:')
  })

  const isContentPost = (post: PostEntity) => post.source === 'content' || post.id.startsWith('content:')

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
    if (isContentPost(post)) {
      alert('파일 기반 콘텐츠는 어드민에서 직접 삭제할 수 없습니다. 저장소에서 파일을 삭제한 뒤 배포해야 합니다.')
      return
    }

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
    if (isContentPost(post)) {
      alert('파일 기반 콘텐츠는 어드민에서 공개 상태를 변경할 수 없습니다.')
      return
    }

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
    if (isContentPost(post)) {
      alert('파일 기반 콘텐츠는 어드민 편집기에서 수정할 수 없습니다. DB 글은 수정 가능합니다.')
      return
    }

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
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              sx={{ p: 2 }}
              alignItems={{ xs: 'stretch', md: 'center' }}
            >
              <TextField
                fullWidth
                placeholder="제목, 내용으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
              />
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>상태</InputLabel>
                <Select
                  value={statusFilter}
                  label="상태"
                  onChange={(event) => {
                    setStatusFilter(event.target.value as typeof statusFilter)
                    setPage(1)
                  }}
                >
                  <MenuItem value="all">전체</MenuItem>
                  <MenuItem value="published">공개</MenuItem>
                  <MenuItem value="draft">비공개</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>소스</InputLabel>
                <Select
                  value={sourceFilter}
                  label="소스"
                  onChange={(event) => setSourceFilter(event.target.value as typeof sourceFilter)}
                >
                  <MenuItem value="all">전체</MenuItem>
                  <MenuItem value="database">DB 글</MenuItem>
                  <MenuItem value="content">파일 글</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchPosts}
                sx={{ whiteSpace: 'nowrap' }}
              >
                새로고침
              </Button>
            </Stack>
          </Paper>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>썸네일</TableCell>
                  <TableCell>제목</TableCell>
                  <TableCell>상태</TableCell>
                  <TableCell>소스</TableCell>
                  <TableCell>카테고리</TableCell>
                  <TableCell>조회수</TableCell>
                  <TableCell>작성일</TableCell>
                  <TableCell>수정일</TableCell>
                  <TableCell>작업</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visiblePosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Box
                        sx={{
                          width: 72,
                          height: 44,
                          borderRadius: 1,
                          overflow: 'hidden',
                          border: '1px solid',
                          borderColor: 'divider',
                          bgcolor: 'action.hover',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {post.thumbnail ? (
                          <Box
                            component="img"
                            src={post.thumbnail}
                            alt={`${post.title} 썸네일`}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block'
                            }}
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            없음
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
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
                    <TableCell>
                      <Chip
                        label={isContentPost(post) ? '파일' : 'DB'}
                        color={isContentPost(post) ? 'warning' : 'primary'}
                        size="small"
                        variant={isContentPost(post) ? 'outlined' : 'filled'}
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
                        <Tooltip title={isContentPost(post) ? '파일 기반 글은 저장소에서 수정해야 합니다.' : '편집'}>
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(post)}
                              disabled={isContentPost(post)}
                              title="편집"
                            >
                              <EditIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title={isContentPost(post) ? '파일 기반 글은 저장소에서 공개 상태를 관리합니다.' : post.isPublished ? '비공개로 변경' : '공개로 변경'}>
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => handleTogglePublish(post)}
                              disabled={isContentPost(post)}
                              title={post.isPublished ? '비공개로 변경' : '공개로 변경'}
                            >
                              {post.isPublished ? <UnpublishedIcon /> : <PublishIcon />}
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title={isContentPost(post) ? '파일 기반 글은 저장소에서 삭제해야 합니다.' : '삭제'}>
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setDeleteDialog({ open: true, post })}
                              disabled={isContentPost(post)}
                              title="삭제"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {visiblePosts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                        조건에 맞는 포스트가 없습니다.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
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
