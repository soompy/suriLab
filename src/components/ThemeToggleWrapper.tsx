'use client'

import { useTheme } from './ThemeProvider'
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