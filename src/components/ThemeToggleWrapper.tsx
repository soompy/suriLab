'use client'

import { useTheme } from './ThemeContext'
import ThemeToggleButton from './ThemeToggleButton'

export default function ThemeToggleWrapper() {
  const { isDarkMode, toggleTheme } = useTheme()
  
  return (
    <ThemeToggleButton
      isDarkMode={isDarkMode}
      onThemeChange={toggleTheme}
    />
  )
}