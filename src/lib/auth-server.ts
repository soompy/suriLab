import { NextRequest } from 'next/server'

// 간단한 토큰 저장소 (실제 운영환경에서는 Redis 등 사용)
const validTokens = new Set<string>()

export function addToken(token: string) {
  validTokens.add(token)
  // 24시간 후 토큰 만료
  setTimeout(() => {
    validTokens.delete(token)
  }, 24 * 60 * 60 * 1000)
}

export function verifyAdminToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  
  const token = authHeader.replace('Bearer ', '')
  return validTokens.has(token)
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