import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Write | SuriBlog',
  robots: {
    index: false,
    follow: false,
  },
}

export default function WriteLayout({ children }: { children: React.ReactNode }) {
  return children
}
