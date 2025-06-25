import { NextRequest, NextResponse } from 'next/server'
import { BLOG_CONFIG } from '@/config/blog'
import { addToken } from '@/lib/auth-server'
import crypto from 'crypto'

// 간단한 토큰 생성 함수 (실제 운영환경에서는 JWT 사용 권장)
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

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
      // 안전한 토큰 생성
      const token = generateToken()
      addToken(token) // 서버 측 토큰 저장소에 추가

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

