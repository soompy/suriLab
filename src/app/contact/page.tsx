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
  Button
} from '@mui/material'
import {
  Email as EmailIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Launch as LaunchIcon,
  ContentCopy as CopyIcon,
  Code as CodeIcon,
  Send as SendIcon
} from '@mui/icons-material'
import MuiThemeProvider from '@/components/MuiThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Contact() {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const email = 'yzsumin@naver.com'

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
    setIsSubmitting(true)

    try {
      // 실제 이메일 서비스 연동 예정
      // 현재는 데모 버전
      const subject = encodeURIComponent(formData.subject || '블로그 문의')
      const body = encodeURIComponent(
        `이름: ${formData.name}\n이메일: ${formData.email}\n\n메시지:\n${formData.message}`
      )
      const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`
      
      window.location.href = mailtoLink
      
      setSnackbarMessage('메일 클라이언트가 열렸습니다!')
      setSnackbarOpen(true)
      
      // 폼 초기화
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch {
      setSnackbarMessage('메일 전송에 실패했습니다.')
      setSnackbarOpen(true)
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
        
        <Container maxWidth={false} sx={{ py: 6, px: 4, maxWidth: { xs: '100%', md: '1300px' }, mx: 'auto' }}>
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
              gap: 4,
              width: '100%'
            }}
          >
            {/* Contact Form Section */}
            <Box>
              <Paper sx={{ p: 4, height: '100%', boxShadow: 'none', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <SendIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
                  <Typography variant="h5" component="h2">
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
                  />
                  <TextField
                    fullWidth
                    label="제목"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    variant="outlined"
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
                  />
                  
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    startIcon={<SendIcon />}
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
                <Paper sx={{ p: 3, boxShadow: 'none', width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                    <Typography variant="h6">
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MuiThemeProvider>
  )
}