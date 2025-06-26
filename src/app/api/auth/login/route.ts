import { NextRequest, NextResponse } from 'next/server'
import { BLOG_CONFIG } from '@/config/blog'
import { generateToken } from '@/lib/auth-server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { success: false, error: '비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 서버에서 비밀번호 검증
    const isValid = password === process.env.BLOG_ADMIN_PASSWORD

    if (isValid) {
      // JWT 토큰 생성
      const token = generateToken()
      console.log('[LOGIN] JWT token generated for admin login')

      return NextResponse.json({
        success: true,
        user: BLOG_CONFIG.owner,
        token: token
      })
    } else {
      return NextResponse.json(
        { success: false, error: '비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: '로그인 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

