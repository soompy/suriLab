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
  Alert,
  Chip,
  useTheme
} from '@mui/material'
import Loading from './Loading'
import {
  Send as SendIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  ChatBubbleOutline as CommentIcon,
  Reply as ReplyIcon
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
  const theme = useTheme()
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
    <Box sx={{ mt: 6 }}>
      {/* 댓글 섹션 헤더 */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 4,
        pb: 2,
        borderBottom: `2px solid ${theme.palette.divider}`
      }}>
        <CommentIcon sx={{ 
          fontSize: 24, 
          color: 'primary.main'
        }} />
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          댓글
        </Typography>
        <Chip 
          label={comments.length} 
          size="small"
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            fontWeight: 600,
            minWidth: 32,
            height: 24
          }}
        />
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          {error}
        </Alert>
      )}

      {/* 댓글 작성 폼 */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 4,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.mode === 'dark' 
            ? 'rgba(255,255,255,0.02)' 
            : 'rgba(0,0,0,0.01)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            borderColor: 'primary.main'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <ReplyIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            댓글 작성하기
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmitComment}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="이름"
                value={newComment.authorName}
                onChange={(e) => setNewComment({ ...newComment, authorName: e.target.value })}
                required
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main'
                      }
                    }
                  }
                }}
              />
              <TextField
                label="이메일 (선택사항)"
                type="email"
                value={newComment.authorEmail}
                onChange={(e) => setNewComment({ ...newComment, authorEmail: e.target.value })}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main'
                      }
                    }
                  }
                }}
              />
            </Stack>
            <TextField
              label="댓글을 입력하세요..."
              multiline
              rows={4}
              value={newComment.content}
              onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
              required
              placeholder="정중하고 건설적인 댓글을 작성해주세요."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    }
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: 2
                    }
                  }
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                startIcon={<SendIcon />}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                {submitting ? '작성 중...' : '댓글 작성'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>

      {/* 댓글 목록 */}
      <Stack spacing={3}>
        {comments.map((comment, index) => (
          <Paper 
            key={comment.id} 
            elevation={0}
            sx={{ 
              p: 4,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.mode === 'dark' 
                ? 'rgba(255,255,255,0.01)' 
                : 'rgba(0,0,0,0.005)',
              position: 'relative',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                borderColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255,255,255,0.1)' 
                  : 'rgba(0,0,0,0.1)',
                transform: 'translateY(-1px)'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: 4,
                height: '100%',
                background: `linear-gradient(180deg, 
                  ${theme.palette.primary.main} 0%, 
                  ${theme.palette.secondary.main} 100%)`,
                borderRadius: '2px 0 0 2px',
                opacity: 0.8
              }
            }}
          >
            <Stack direction="row" spacing={3}>
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main',
                  width: 48,
                  height: 48,
                  background: `linear-gradient(135deg, 
                    ${theme.palette.primary.main} 0%, 
                    ${theme.palette.secondary.main} 100%)`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                <PersonIcon sx={{ fontSize: 24 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 0.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {comment.authorName}
                      </Typography>
                      <Chip 
                        label={`#${index + 1}`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          bgcolor: theme.palette.mode === 'dark' 
                            ? 'rgba(255,255,255,0.1)' 
                            : 'rgba(0,0,0,0.06)',
                          color: 'text.secondary'
                        }}
                      />
                    </Stack>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                      {formatDate(comment.createdAt)}
                      {comment.updatedAt !== comment.createdAt && (
                        <Chip 
                          label="수정됨" 
                          size="small" 
                          sx={{ 
                            ml: 1, 
                            height: 16, 
                            fontSize: '0.6rem',
                            bgcolor: 'warning.main',
                            color: 'white'
                          }} 
                        />
                      )}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5}>
                    <IconButton
                      size="small"
                      onClick={() => setEditingComment(comment)}
                      sx={{
                        bgcolor: theme.palette.mode === 'dark' 
                          ? 'rgba(255,255,255,0.05)' 
                          : 'rgba(0,0,0,0.04)',
                        '&:hover': {
                          bgcolor: 'primary.main',
                          color: 'white',
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <EditIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setDeleteDialog({ open: true, commentId: comment.id })}
                      sx={{
                        bgcolor: theme.palette.mode === 'dark' 
                          ? 'rgba(255,255,255,0.05)' 
                          : 'rgba(0,0,0,0.04)',
                        '&:hover': {
                          bgcolor: 'error.main',
                          color: 'white',
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Stack>
                </Stack>
                <Box 
                  sx={{ 
                    pl: 2,
                    borderLeft: `2px solid ${theme.palette.divider}`,
                    borderRadius: 1
                  }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.7,
                      color: 'text.primary',
                      fontSize: '0.95rem'
                    }}
                  >
                    {comment.content}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>

      {comments.length === 0 && (
        <Paper 
          elevation={0}
          sx={{ 
            textAlign: 'center', 
            py: 6,
            px: 4,
            borderRadius: 3,
            border: `2px dashed ${theme.palette.divider}`,
            bgcolor: theme.palette.mode === 'dark' 
              ? 'rgba(255,255,255,0.01)' 
              : 'rgba(0,0,0,0.005)'
          }}
        >
          <CommentIcon 
            sx={{ 
              fontSize: 48, 
              color: 'text.secondary', 
              mb: 2,
              opacity: 0.5
            }} 
          />
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
            아직 댓글이 없습니다
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            첫 댓글을 작성해서 대화를 시작해보세요! 💬
          </Typography>
        </Paper>
      )}

      {/* 댓글 수정 다이얼로그 */}
      <Dialog
        open={!!editingComment}
        onClose={() => setEditingComment(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <EditIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            댓글 수정
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <TextField
              label="이름"
              value={editingComment?.authorName || ''}
              onChange={(e) => setEditingComment(prev => 
                prev ? { ...prev, authorName: e.target.value } : null
              )}
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setEditingComment(null)}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              px: 3
            }}
          >
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
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3
            }}
          >
            수정 완료
          </Button>
        </DialogActions>
      </Dialog>

      {/* 댓글 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, commentId: null })}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <DeleteIcon sx={{ color: 'error.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            댓글 삭제
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography sx={{ fontSize: '1rem', lineHeight: 1.6 }}>
            정말로 이 댓글을 삭제하시겠습니까?
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            삭제된 댓글은 복구할 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setDeleteDialog({ open: false, commentId: null })}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              px: 3
            }}
          >
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
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3
            }}
          >
            삭제하기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}