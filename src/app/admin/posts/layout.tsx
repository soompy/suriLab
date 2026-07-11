import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Posts | SuriBlog',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminPostsLayout({ children }: { children: React.ReactNode }) {
  return children
}
