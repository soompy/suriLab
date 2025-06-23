import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()
    const { name, email, subject, message } = body

    // 입력값 검증
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 환경변수 확인
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'PLEASE_SET_YOUR_NAVER_APP_PASSWORD_HERE') {
      console.error('Email configuration missing or not set:', {
        EMAIL_USER: !!process.env.EMAIL_USER,
        EMAIL_PASS: process.env.EMAIL_PASS === 'PLEASE_SET_YOUR_NAVER_APP_PASSWORD_HERE' ? 'NOT_SET' : !!process.env.EMAIL_PASS
      })
      
      return NextResponse.json(
        { error: '이메일 서비스 설정이 완료되지 않았습니다. 네이버 앱 비밀번호를 설정해주세요.' },
        { status: 500 }
      )
    }

    // 이메일 설정 (환경변수로 관리)
    const transporter = nodemailer.createTransport({
      service: 'naver', // 네이버 메일 사용
      auth: {
        user: process.env.EMAIL_USER, // yzsumin@naver.com
        pass: process.env.EMAIL_PASS, // 앱 비밀번호
      },
      // 추가 보안 설정
      secure: true,
      requireTLS: true,
    })

    // 연결 테스트
    try {
      await transporter.verify()
      console.log('✅ Email server connection verified')
    } catch (verifyError) {
      console.error('❌ Email server connection failed:', verifyError)
      return NextResponse.json(
        { error: '이메일 서버 연결에 실패했습니다. 네이버 앱 비밀번호를 확인해주세요.' },
        { status: 500 }
      )
    }

    // 이메일 옵션
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'yzsumin@naver.com',
      subject: `[SuriBlog 문의] ${subject || '제목 없음'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">📩 새로운 문의가 도착했습니다!</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">문의 정보</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px; background: #f1f3f4; font-weight: bold; width: 120px;">이름:</td>
                  <td style="padding: 12px;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; background: #f1f3f4; font-weight: bold;">이메일:</td>
                  <td style="padding: 12px;">
                    <a href="mailto:${email}" style="color: #1976d2;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px; background: #f1f3f4; font-weight: bold;">제목:</td>
                  <td style="padding: 12px;">${subject || '제목 없음'}</td>
                </tr>
              </table>
              
              <h3 style="color: #333; margin-top: 25px; margin-bottom: 15px;">메시지 내용:</h3>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #1976d2;">
                ${message.replace(/\n/g, '<br>')}
              </div>
              
              <div style="margin-top: 25px; padding: 15px; background: #e3f2fd; border-radius: 6px;">
                <p style="margin: 0; color: #1565c0; font-size: 14px;">
                  💡 <strong>빠른 답변 팁:</strong> 이 이메일에 직접 답장하면 문의자에게 답변이 전송됩니다.
                </p>
              </div>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0; font-size: 14px;">
              📧 SuriBlog Contact System | 
              <a href="https://suriblog.vercel.app" style="color: #81c784;">suriblog.vercel.app</a>
            </p>
          </div>
        </div>
      `,
      // 답장용 설정
      replyTo: email,
    }

    // 이메일 전송
    const info = await transporter.sendMail(mailOptions)
    console.log('📧 Email sent successfully:', info.messageId)

    return NextResponse.json(
      { 
        success: true, 
        message: '✅ 메시지가 성공적으로 전송되었습니다! 24시간 이내에 답변드리겠습니다.',
        messageId: info.messageId
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Email sending error:', error)
    
    // 더 자세한 에러 정보 제공
    let errorMessage = '메시지 전송 중 오류가 발생했습니다.'
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        errorMessage = '이메일 인증에 실패했습니다. 네이버 앱 비밀번호를 확인해주세요.'
      } else if (error.message.includes('Authentication failed')) {
        errorMessage = '이메일 계정 설정을 확인해주세요.'
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    )
  }
}