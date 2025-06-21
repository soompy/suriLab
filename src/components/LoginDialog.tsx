'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert
} from '@mui/material'
import { Lock as LockIcon } from '@mui/icons-material'
import { AuthService } from '@/lib/auth'

interface LoginDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function LoginDialog({ open, onClose, onSuccess }: LoginDialogProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const success = await AuthService.login(password)
      
      if (success) {
        onSuccess()
        onClose()
        setPassword('')
      } else {
        setError('비밀번호가 올바르지 않습니다.')
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setPassword('')
    setError('')
    onClose()
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <LockIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="h5" component="div">
          관리자 로그인
        </Typography>
        <Typography variant="body2" color="text.secondary">
          블로그 관리를 위해 로그인해주세요
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              fullWidth
              type="password"
              label="관리자 비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoFocus
              required
              disabled={loading}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !password.trim()}
            sx={{ minWidth: 100 }}
          >
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}