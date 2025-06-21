import { BLOG_CONFIG } from '@/config/blog'

const AUTH_KEY = 'blog_auth'

export class AuthService {
  // 로그인 상태 확인
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    
    const authData = localStorage.getItem(AUTH_KEY)
    if (!authData) return false

    try {
      const { timestamp } = JSON.parse(authData)
      const now = Date.now()
      const isValid = now - timestamp < BLOG_CONFIG.auth.sessionTimeout

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
  static login(password: string): boolean {
    if (password === BLOG_CONFIG.auth.adminPassword) {
      const authData = {
        timestamp: Date.now(),
        user: BLOG_CONFIG.owner
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(authData))
      return true
    }
    return false
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
}