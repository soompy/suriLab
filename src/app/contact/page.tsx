'use client'

import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  IconButton,
  Divider,
  Snackbar,
  Alert,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import emailjs from '@emailjs/browser'
import {
  Email as EmailIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Launch as LaunchIcon,
  ContentCopy as CopyIcon,
  Code as CodeIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material'
import MuiThemeProvider from '@/components/MuiThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Contact() {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success')
  const [dialogMessage, setDialogMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const email = 'sooper1137@gmail.com'

  const handleEmailCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setSnackbarMessage('이메일이 클립보드에 복사되었습니다!')
      setSnackbarOpen(true)
    } catch {
      setSnackbarMessage('복사에 실패했습니다.')
      setSnackbarOpen(true)
    }
  }

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 기본 유효성 검사
    if (!formData.name || !formData.email || !formData.message) {
      setSnackbarMessage('모든 필수 항목을 입력해주세요.')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
      return
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setSnackbarMessage('올바른 이메일 형식을 입력해주세요.')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
      return
    }

    setIsSubmitting(true)

    try {
      // EmailJS 환경변수 확인
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

      console.log('EmailJS 설정 확인:', {
        serviceId: serviceId || 'MISSING',
        templateId: templateId || 'MISSING',
        publicKey: publicKey ? publicKey.substring(0, 5) + '...' : 'MISSING'
      })

      if (!serviceId || !templateId || !publicKey) {
        throw new Error(`EmailJS 설정이 완료되지 않았습니다. 누락된 값: ${!serviceId ? 'SERVICE_ID ' : ''}${!templateId ? 'TEMPLATE_ID ' : ''}${!publicKey ? 'PUBLIC_KEY' : ''}`)
      }

      if (templateId === 'your_template_id') {
        throw new Error('Template ID를 실제 값으로 변경해주세요.')
      }

      // EmailJS로 이메일 전송
      console.log('EmailJS 전송 시작...')
      console.log('전송 데이터:', {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject || '제목 없음',
        message: formData.message.substring(0, 50) + '...'
      })

      const result = await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject || '제목 없음',
          message: formData.message,
          to_email: 'sooper1137@gmail.com'
        },
        publicKey
      )

      console.log('EmailJS 응답:', result)

      // 성공 메시지 - Dialog로 표시
      setDialogType('success')
      setDialogMessage('메시지가 성공적으로 전송되었습니다! 24시간 이내에 답변드리겠습니다.')
      setDialogOpen(true)

      // 폼 초기화
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })

    } catch (error) {
      console.error('이메일 전송 오류 상세:', error)
      
      let errorMessage = '메시지 전송에 실패했습니다.'
      
      if (error instanceof Error) {
        console.log('Error message:', error.message)
        
        // EmailJS 특정 오류 메시지 처리
        if (error.message.includes('404')) {
          errorMessage = 'EmailJS 서비스나 템플릿을 찾을 수 없습니다. 설정을 확인해주세요.'
        } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
          errorMessage = 'EmailJS 권한이 없습니다. Public Key를 확인해주세요.'
        } else if (error.message.includes('400')) {
          errorMessage = 'EmailJS 요청 형식이 잘못되었습니다.'
        } else if (error.message.includes('Network')) {
          errorMessage = '네트워크 오류입니다. 인터넷 연결을 확인해주세요.'
        } else if (error.message.includes('Template ID')) {
          errorMessage = error.message
        } else {
          errorMessage = `전송 실패: ${error.message}`
        }
      }
      
      // 오류 메시지 - Dialog로 표시
      setDialogType('error')
      setDialogMessage(errorMessage)
      setDialogOpen(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/soompy',
      icon: <GitHubIcon />,
      description: '오픈소스 프로젝트와 개발 활동'
    },
    {
      name: 'LinkedIn',
      url: 'https://buly.kr/1c8Bcxw',
      icon: <LinkedInIcon />,
      description: '링크드인 팔로우 해주세요'
    }
  ]

  return (
    <MuiThemeProvider>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header />
        
        <Container maxWidth={false} sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, md: 4 }, maxWidth: { xs: '100%', md: '1300px' }, mx: 'auto', overflow: 'hidden' }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Contact
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              새로운 기회, 흥미로운 프로젝트, 또는 기술에 대한 대화를 언제나 환영합니다.
            </Typography>
          </Box>

          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { 
                xs: '1fr', 
                md: '1.2fr 0.8fr' 
              },
              gap: { xs: 2, md: 4 },
              width: '100%',
              minWidth: 0,
              overflow: 'hidden'
            }}
          >
            {/* Contact Form Section */}
            <Box>
              <Paper sx={{ p: 4, height: '100%', boxShadow: 'none', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <SendIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
                  <Typography variant="h5" component="h2" color="primary.main">
                    메시지 보내기
                  </Typography>
                </Box>
                
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
                  <TextField
                    fullWidth
                    label="이름"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    disabled={isSubmitting}
                    placeholder="이름을 입력해주세요"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="이메일"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    disabled={isSubmitting}
                    placeholder="이메일 주소를 입력해주세요"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="제목"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    variant="outlined"
                    disabled={isSubmitting}
                    placeholder="메시지 제목을 입력해주세요 (선택사항)"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="메시지"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    multiline
                    rows={6}
                    variant="outlined"
                    placeholder="궁금한 점이나 협업 제안, 피드백 등 무엇이든 자유롭게 작성해주세요."
                    disabled={isSubmitting}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
                    sx={{ alignSelf: 'flex-start', minWidth: 150 }}
                  >
                    {isSubmitting ? '전송 중...' : '메시지 전송'}
                  </Button>
                </Box>
              </Paper>
            </Box>

            {/* Contact Info & Social Links Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%', width: '100%' }}>
              {/* Email and Social Links in Column Layout */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Email Section */}
                <Paper sx={{ p: 3, boxShadow: 'none', width: '100%', border: '2px solid', borderColor: 'primary.main', bgcolor: 'primary.50' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                    <Typography variant="h6" color="primary.main">
                      직접 연락
                    </Typography>
                  </Box>
                  
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: 'none',
                      '&:hover': {
                        transform: 'translateY(-1px)'
                      }
                    }}
                    onClick={handleEmailCopy}
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
                      <Box>
                        <Typography variant="body1" color="primary" fontWeight="medium">
                          {email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          클릭하여 복사
                        </Typography>
                      </Box>
                      <IconButton size="small">
                        <CopyIcon />
                      </IconButton>
                    </CardContent>
                  </Card>
                </Paper>

                {/* Social Links Section */}
                <Paper sx={{ p: 3, boxShadow: 'none', width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CodeIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                    <Typography variant="h6">
                      소셜 미디어
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {socialLinks.map((social) => (
                      <Card key={social.name} sx={{ cursor: 'pointer', boxShadow: 'none' }}>
                        <CardContent 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            py: 2,
                            transition: 'all 0.2s',
                            '&:hover': {
                              bgcolor: 'action.hover'
                            }
                          }}
                          onClick={() => handleLinkClick(social.url)}
                        >
                          <Box sx={{ mr: 2, color: 'primary.main' }}>
                            {social.icon}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle2" fontWeight="medium">
                              {social.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {social.description}
                            </Typography>
                          </Box>
                          <LaunchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Box>

          {/* Additional Info */}
          <Box sx={{ mt: 4, width: '100%' }}>
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper', boxShadow: 'none', width: '100%' }}>
              <Typography variant="h6" gutterBottom>
                새로운 프로젝트나 협업 기회에 대해 언제든 연락주세요. 
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                창의적이고 혁신적인 아이디어를 현실로 만드는 것을 좋아합니다.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                📍 대한민국, 서울/성남 | 🌍 원격 근무 가능 | 🕐 응답 시간: 24시간 이내
              </Typography>
            </Paper>
          </Box>
        </Container>
        
        <Footer />
      </Box>

      {/* 전송 상태 Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          pb: 2
        }}>
          {dialogType === 'success' ? (
            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 32 }} />
          ) : (
            <ErrorIcon sx={{ color: 'error.main', fontSize: 32 }} />
          )}
          <Typography variant="h6" component="div">
            {dialogType === 'success' ? '전송 완료!' : '전송 실패'}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pb: 2 }}>
          <Typography variant="body1" color="text.secondary">
            {dialogMessage}
          </Typography>
          
          {dialogType === 'success' && (
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: 'success.50', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'success.200'
            }}>
              <Typography variant="body2" color="success.dark">
                📧 메시지가 sooper1137@gmail.com으로 전송되었습니다.
              </Typography>
            </Box>
          )}
          
          {dialogType === 'error' && (
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: 'error.50', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'error.200'
            }}>
              <Typography variant="body2" color="error.dark">
                💡 문제가 지속되면 sooper1137@gmail.com으로 직접 연락해주세요.
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setDialogOpen(false)} 
            variant="contained"
            color={dialogType === 'success' ? 'success' : 'primary'}
            sx={{ minWidth: 100 }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MuiThemeProvider>
  )
}