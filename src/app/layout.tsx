import type { Metadata } from 'next'
import { CustomThemeProvider } from '@/components/ThemeContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'Suri Blog',
  description: 'A modern blog built with Clean Architecture',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <CustomThemeProvider>
          {children}
        </CustomThemeProvider>
      </body>
    </html>
  )
}