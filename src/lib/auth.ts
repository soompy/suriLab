const AUTH_KEY = 'blog_auth'
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000 // 24시간

export class AuthService {
  // 로그인 상태 확인
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    
    const authData = localStorage.getItem(AUTH_KEY)
    if (!authData) return false

    try {
      const { timestamp } = JSON.parse(authData)
      const now = Date.now()
      const isValid = now - timestamp < SESSION_TIMEOUT

      if (!isValid) {
        this.logout()
        return false
      }

      return true
    } catch {
      this.logout()
      return false
    }
  }

  // 로그인
  static async login(password: string): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        const authData = {
          timestamp: Date.now(),
          user: data.user,
          token: data.token // 안전한 토큰만 저장, 비밀번호는 저장하지 않음
        }
        localStorage.setItem(AUTH_KEY, JSON.stringify(authData))
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  // 로그아웃
  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_KEY)
    }
  }

  // 모든 세션 초기화 (비밀번호 변경 시 사용)
  static clearAllSessions(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear()
    }
  }

  // 사용자 정보 가져오기
  static getUser() {
    if (!this.isAuthenticated()) return null
    
    const authData = localStorage.getItem(AUTH_KEY)
    if (!authData) return null

    try {
      const { user } = JSON.parse(authData)
      return user
    } catch {
      return null
    }
  }

  // 인증 헤더를 포함한 API 요청 옵션 생성
  static getAuthHeaders(): HeadersInit {
    if (typeof window === 'undefined') return {}
    
    const authData = localStorage.getItem(AUTH_KEY)
    if (!authData) {
      console.log('[AUTH] No auth data in localStorage')
      return {}
    }
    
    try {
      const { token } = JSON.parse(authData)
      if (!token) {
        console.log('[AUTH] No token in auth data')
        return {}
      }
      
      console.log(`[AUTH] Token available, length: ${token.length}`)
      
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    } catch (error) {
      console.error('[AUTH] Error parsing auth data:', error)
      return {}
    }
  }

  // 디버깅용: 현재 인증 상태 확인
  static debugAuthState() {
    if (typeof window === 'undefined') return { error: 'Not in browser' }
    
    const authData = localStorage.getItem(AUTH_KEY)
    if (!authData) return { authenticated: false, reason: 'No auth data' }
    
    try {
      const parsed = JSON.parse(authData)
      const now = Date.now()
      const isExpired = now - parsed.timestamp > SESSION_TIMEOUT
      
      return {
        authenticated: this.isAuthenticated(),
        hasToken: !!parsed.token,
        tokenLength: parsed.token?.length || 0,
        timestamp: parsed.timestamp,
        age: now - parsed.timestamp,
        isExpired,
        user: parsed.user
      }
    } catch (error) {
      return { authenticated: false, reason: 'Parse error', error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // 인증이 필요한 fetch 요청을 위한 헬퍼
  static async authenticatedFetch(url: string, options: RequestInit = {}) {
    console.log(`[AUTH] Making authenticated request to: ${url}`)
    
    if (!this.isAuthenticated()) {
      console.error('[AUTH] User not authenticated')
      throw new Error('Authentication required')
    }

    const authHeaders = this.getAuthHeaders()
    const authToken = typeof authHeaders === 'object' && authHeaders && 'Authorization' in authHeaders ? authHeaders['Authorization'] as string : null
    console.log(`[AUTH] Authorization header: ${authToken ? `${authToken.substring(0, 15)}...` : 'None'}`)
    
    const headers = {
      ...authHeaders,
      ...options.headers
    }

    console.log(`[AUTH] Request method: ${options.method || 'GET'}`)
    console.log(`[AUTH] Final headers:`, Object.keys(headers))
    
    return fetch(url, {
      ...options,
      headers
    })
  }
}