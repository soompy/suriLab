'use client'

import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { ReactNode, useMemo } from 'react'
import { useTheme } from './ThemeContext'

interface MuiThemeProviderProps {
  children: ReactNode
}

export default function MuiThemeProvider({ children }: MuiThemeProviderProps) {
  const { isDarkMode } = useTheme()

  const theme = useMemo(() => createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: isDarkMode ? '#ffffff' : '#191f28', // 다크모드에서는 흰색, 라이트모드에서는 rgb(25, 31, 40)
        dark: isDarkMode ? '#e5e7eb' : '#0f1419',
        contrastText: isDarkMode ? '#191f28' : '#ffffff',
      },
      secondary: {
        main: '#6b7280',
      },
      background: {
        default: isDarkMode ? '#0f1419' : '#ffffff',
        paper: isDarkMode ? '#1a1f2e' : '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#ffffff' : '#191f28',
        secondary: isDarkMode ? '#9ca3af' : '#6b7280',
      },
    },
    typography: {
      fontFamily: [
        'var(--font-inter)',
        'var(--font-noto-sans-kr)',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.75rem',
        lineHeight: 1.5,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? '#1a1f2e' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#191f28',
            boxShadow: 'none',
            borderBottom: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '6px',
            fontWeight: 500,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            '&:hover': {
              color: isDarkMode ? '#ffffff' : '#191f28',
            },
          },
        },
      },
    },
  }), [isDarkMode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}