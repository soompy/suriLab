'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ThemeContextType {
  isDarkMode: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export function CustomThemeProvider({ children }: ThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window !== 'undefined') {
      // 로컬 스토리지에서 테마 설정 로드
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark')
      } else {
        // 시스템 설정 확인
        setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
      }
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    }
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}