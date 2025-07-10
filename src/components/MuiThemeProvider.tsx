'use client'

import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { ReactNode, useMemo } from 'react'
import { useTheme } from './ThemeContext'
import { designTokens } from '@/config/designTokens'

interface MuiThemeProviderProps {
  children: ReactNode
}

export default function MuiThemeProvider({ children }: MuiThemeProviderProps) {
  const { isDarkMode } = useTheme()

  const theme = useMemo(() => createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: isDarkMode ? designTokens.colors.dark.text.primary : designTokens.colors.brand.primary,
        dark: isDarkMode ? designTokens.colors.secondary[200] : designTokens.colors.dark.background.primary,
        contrastText: isDarkMode ? designTokens.colors.brand.primary : designTokens.colors.dark.text.primary,
      },
      secondary: {
        main: designTokens.colors.brand.secondary,
        light: designTokens.colors.secondary[400],
        dark: designTokens.colors.secondary[600],
      },
      background: {
        default: isDarkMode ? designTokens.colors.dark.background.primary : designTokens.colors.light.background.primary,
        paper: isDarkMode ? designTokens.colors.dark.background.secondary : designTokens.colors.light.background.primary,
      },
      text: {
        primary: isDarkMode ? designTokens.colors.dark.text.primary : designTokens.colors.light.text.primary,
        secondary: isDarkMode ? designTokens.colors.dark.text.secondary : designTokens.colors.light.text.secondary,
      },
      success: {
        main: designTokens.colors.success[500],
        light: designTokens.colors.success[300],
        dark: designTokens.colors.success[700],
      },
      warning: {
        main: designTokens.colors.warning[500],
        light: designTokens.colors.warning[300],
        dark: designTokens.colors.warning[700],
      },
      error: {
        main: designTokens.colors.error[500],
        light: designTokens.colors.error[300],
        dark: designTokens.colors.error[700],
      },
    },
    typography: {
      fontFamily: designTokens.typography.fontFamily.primary,
      h1: {
        fontSize: designTokens.typography.fontSize['5xl'],
        fontWeight: designTokens.typography.fontWeight.semibold,
        lineHeight: designTokens.typography.lineHeight.tight,
      },
      h2: {
        fontSize: designTokens.typography.fontSize['4xl'],
        fontWeight: designTokens.typography.fontWeight.semibold,
        lineHeight: designTokens.typography.lineHeight.snug,
      },
      h3: {
        fontSize: designTokens.typography.fontSize['3xl'],
        fontWeight: designTokens.typography.fontWeight.semibold,
        lineHeight: designTokens.typography.lineHeight.snug,
      },
      h4: {
        fontSize: designTokens.typography.fontSize['2xl'],
        fontWeight: designTokens.typography.fontWeight.semibold,
        lineHeight: designTokens.typography.lineHeight.snug,
      },
      h5: {
        fontSize: designTokens.typography.fontSize.xl,
        fontWeight: designTokens.typography.fontWeight.semibold,
        lineHeight: designTokens.typography.lineHeight.snug,
      },
      h6: {
        fontSize: designTokens.typography.fontSize.lg,
        fontWeight: designTokens.typography.fontWeight.semibold,
        lineHeight: designTokens.typography.lineHeight.snug,
      },
      body1: {
        fontSize: designTokens.typography.fontSize.base,
        lineHeight: designTokens.typography.lineHeight.relaxed,
      },
      body2: {
        fontSize: designTokens.typography.fontSize.sm,
        lineHeight: designTokens.typography.lineHeight.normal,
      },
      caption: {
        fontSize: designTokens.typography.fontSize.xs,
        lineHeight: designTokens.typography.lineHeight.normal,
      },
    },
    spacing: [
      designTokens.spacing[0],
      designTokens.spacing[1],
      designTokens.spacing[2],
      designTokens.spacing[3],
      designTokens.spacing[4],
      designTokens.spacing[5],
      designTokens.spacing[6],
      designTokens.spacing[7],
      designTokens.spacing[8],
      designTokens.spacing[9],
      designTokens.spacing[10],
      designTokens.spacing[11],
      designTokens.spacing[12],
    ],
    shape: {
      borderRadius: parseInt(designTokens.borderRadius.md.replace('rem', '')) * 16,
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? designTokens.colors.dark.background.secondary : designTokens.colors.light.background.primary,
            color: isDarkMode ? designTokens.colors.dark.text.primary : designTokens.colors.light.text.primary,
            boxShadow: designTokens.shadow.none,
            borderBottom: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: designTokens.borderRadius.md,
            fontWeight: designTokens.typography.fontWeight.medium,
            fontSize: designTokens.typography.fontSize.sm,
          },
          contained: {
            boxShadow: designTokens.shadow.sm,
            '&:hover': {
              boxShadow: designTokens.shadow.md,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: isDarkMode ? designTokens.colors.dark.text.secondary : designTokens.colors.light.text.secondary,
            '&:hover': {
              color: isDarkMode ? designTokens.colors.dark.text.primary : designTokens.colors.light.text.primary,
              backgroundColor: isDarkMode ? designTokens.colors.dark.background.tertiary : designTokens.colors.light.background.secondary,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? designTokens.colors.dark.background.secondary : designTokens.colors.light.background.primary,
            borderRadius: designTokens.borderRadius.lg,
            boxShadow: isDarkMode ? designTokens.shadow.none : designTokens.shadow.sm,
            border: `${designTokens.borderWidth.DEFAULT} solid ${isDarkMode ? designTokens.colors.dark.border.primary : designTokens.colors.light.border.primary}`,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: designTokens.borderRadius.full,
            fontSize: designTokens.typography.fontSize.xs,
            fontWeight: designTokens.typography.fontWeight.medium,
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: 'inherit',
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