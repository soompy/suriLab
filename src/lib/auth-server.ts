import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// JWT를 사용한 토큰 검증으로 변경 (인메모리 저장소 문제 해결)
const JWT_SECRET = process.env.JWT_SECRET || process.env.BLOG_ADMIN_PASSWORD || 'default-secret-key'

interface TokenPayload {
  admin: boolean
  iat?: number
  exp?: number
}

export function generateToken(): string {
  try {
    const payload: TokenPayload = {
      admin: true
    }
    
    const token = jwt.sign(payload, JWT_SECRET, { 
      expiresIn: '24h',
      issuer: 'suri-blog'
    })
    
    console.log(`[AUTH] JWT token generated successfully`)
    return token
  } catch (error) {
    console.error('[AUTH] Error generating JWT token:', error)
    throw new Error('Failed to generate token')
  }
}

export function verifyAdminToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  
  console.log(`[AUTH] Verifying request to: ${request.nextUrl.pathname}`)
  console.log(`[AUTH] Authorization header: ${authHeader ? `Bearer ${authHeader.substring(7, 15)}...` : 'None'}`)
  console.log(`[AUTH] All headers:`, Object.fromEntries(request.headers.entries()))
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[AUTH] Missing or invalid authorization header format')
    console.log('[AUTH] Expected format: Bearer <token>')
    return false
  }
  
  const token = authHeader.replace('Bearer ', '')
  console.log(`[AUTH] Extracted token length: ${token.length}`)
  
  if (!token || token.length < 10) {
    console.log('[AUTH] Token is too short or empty')
    return false
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    console.log(`[AUTH] JWT payload decoded:`, { admin: decoded.admin, iat: decoded.iat, exp: decoded.exp })
    
    if (decoded.admin === true) {
      console.log(`[AUTH] JWT token validated successfully`)
      return true
    } else {
      console.log(`[AUTH] JWT token invalid: admin flag not set`)
      return false
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log(`[AUTH] JWT token expired at:`, (error as any).expiredAt)
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.log(`[AUTH] JWT token invalid:`, error.message)
    } else {
      console.log(`[AUTH] JWT verification error:`, error)
    }
    return false
  }
}

// 개발/디버깅용 함수
export function getTokenStats() {
  return {
    jwtSecret: JWT_SECRET ? 'Set' : 'Not set',
    authMethod: 'JWT-based authentication',
    tokenExpiry: '24 hours'
  }
}

// 레거시 함수 (호환성 유지)
export function addToken(token: string) {
  console.log(`[AUTH] Legacy addToken called - using JWT instead`)
  return token
}

export function createAuthResponse(message: string = '관리자 권한이 필요합니다.') {
  return new Response(
    JSON.stringify({ error: message }),
    { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

// 기존 함수와의 호환성을 위해 유지
export const verifyAdminPassword = verifyAdminToken