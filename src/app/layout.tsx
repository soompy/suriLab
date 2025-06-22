import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Noto_Sans_KR } from 'next/font/google'
import { CustomThemeProvider } from '@/components/ThemeContext'
import './globals.css'

// Inter 폰트 설정 (본문용)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// JetBrains Mono 폰트 설정 (코드용)
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

// Noto Sans KR 폰트 설정 (한글용)
const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans-kr',
})

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
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${notoSansKR.variable}`}>
        <CustomThemeProvider>
          {children}
        </CustomThemeProvider>
      </body>
    </html>
  )
}