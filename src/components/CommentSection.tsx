'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material'
import Loading from './Loading'
import {
  Send as SendIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon
} from '@mui/icons-material'

interface Comment {
  id: string
  content: string
  authorName: string
  authorEmail?: string
  createdAt: string
  updatedAt: string
}

interface CommentSectionProps {
  postId: string
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newComment, setNewComment] = useState({
    content: '',
    authorName: '',
    authorEmail: ''
  })
  const [editingComment, setEditingComment] = useState<Comment | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; commentId: string | null }>({
    open: false,
    commentId: null
  })
  const [error, setError] = useState<string | null>(null)

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.content.trim() || !newComment.authorName.trim()) {
      setError('내용과 이름을 입력해주세요.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newComment)
      })

      if (response.ok) {
        setNewComment({ content: '', authorName: '', authorEmail: '' })
        fetchComments()
      } else {
        setError('댓글 작성에 실패했습니다.')
      }
    } catch {
      setError('댓글 작성 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditComment = async (commentId: string, updatedData: { content: string; authorName: string; authorEmail?: string }) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      })

      if (response.ok) {
        setEditingComment(null)
        fetchComments()
      }
    } catch (error) {
      console.error('Failed to update comment:', error)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setDeleteDialog({ open: false, commentId: null })
        fetchComments()
      }
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Loading variant="minimal" message="댓글을 불러오는 중..." />
      </Box>
    )
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        댓글 ({comments.length})
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* 댓글 작성 폼 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmitComment}>
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="이름"
                value={newComment.authorName}
                onChange={(e) => setNewComment({ ...newComment, authorName: e.target.value })}
                required
                size="small"
              />
              <TextField
                label="이메일 (선택사항)"
                type="email"
                value={newComment.authorEmail}
                onChange={(e) => setNewComment({ ...newComment, authorEmail: e.target.value })}
                size="small"
              />
            </Stack>
            <TextField
              label="댓글을 입력하세요"
              multiline
              rows={3}
              value={newComment.content}
              onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
              required
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                startIcon={<SendIcon />}
              >
                {submitting ? '작성 중...' : '댓글 작성'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>

      {/* 댓글 목록 */}
      <Stack spacing={2}>
        {comments.map((comment) => (
          <Paper key={comment.id} sx={{ p: 3 }}>
            <Stack direction="row" spacing={2}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <PersonIcon />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {comment.authorName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(comment.createdAt)}
                      {comment.updatedAt !== comment.createdAt && ' (수정됨)'}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={() => setEditingComment(comment)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteDialog({ open: true, commentId: comment.id })}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
                <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                  {comment.content}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>

      {comments.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
          </Typography>
        </Box>
      )}

      {/* 댓글 수정 다이얼로그 */}
      <Dialog
        open={!!editingComment}
        onClose={() => setEditingComment(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>댓글 수정</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="이름"
              value={editingComment?.authorName || ''}
              onChange={(e) => setEditingComment(prev => 
                prev ? { ...prev, authorName: e.target.value } : null
              )}
              fullWidth
              size="small"
            />
            <TextField
              label="댓글 내용"
              multiline
              rows={4}
              value={editingComment?.content || ''}
              onChange={(e) => setEditingComment(prev => 
                prev ? { ...prev, content: e.target.value } : null
              )}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingComment(null)}>
            취소
          </Button>
          <Button
            onClick={() => {
              if (editingComment) {
                handleEditComment(editingComment.id, {
                  content: editingComment.content,
                  authorName: editingComment.authorName,
                  authorEmail: editingComment.authorEmail
                })
              }
            }}
            variant="contained"
          >
            수정
          </Button>
        </DialogActions>
      </Dialog>

      {/* 댓글 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, commentId: null })}
      >
        <DialogTitle>댓글 삭제</DialogTitle>
        <DialogContent>
          <Typography>정말로 이 댓글을 삭제하시겠습니까?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, commentId: null })}>
            취소
          </Button>
          <Button
            onClick={() => {
              if (deleteDialog.commentId) {
                handleDeleteComment(deleteDialog.commentId)
              }
            }}
            color="error"
            variant="contained"
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}