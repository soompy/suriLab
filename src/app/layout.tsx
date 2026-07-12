import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Nanum_Gothic, Noto_Sans_KR } from 'next/font/google'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { CustomThemeProvider } from '@/components/ThemeContext'
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  absoluteUrl,
  createPageMetadata,
  getOrganizationJsonLd,
  getPersonJsonLd,
  getSiteUrl,
  getWebsiteJsonLd,
} from '@/lib/seo'
import './globals.css'
import 'highlight.js/styles/github.css'

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

// Nanum Gothic 폰트 설정 (홈/본문용)
const nanumGothic = Nanum_Gothic({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  display: 'swap',
  variable: '--font-nanum-gothic',
})

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: SITE_NAME,
  generator: 'Next.js',
  authors: [{ name: 'Suri', url: getSiteUrl() }],
  creator: 'Suri',
  publisher: SITE_NAME,
  category: 'technology',
  keywords: [
    'MomentTune',
    'AI Products',
    'AI Automation',
    'AI Agents',
    'Vibe Coding',
    'Solo Startup',
    'Product Design',
  ],
  ...createPageMetadata({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    path: '/',
  }),
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: absoluteUrl('/images/profile.jpg'),
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <GoogleAnalytics />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${notoSansKR.variable} ${nanumGothic.variable}`}>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getWebsiteJsonLd()) }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getPersonJsonLd()) }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationJsonLd()) }}
        />
        <CustomThemeProvider>
          {children}
        </CustomThemeProvider>
      </body>
    </html>
  )
}
