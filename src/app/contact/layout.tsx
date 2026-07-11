import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Contact | SuriBlog',
  description: 'AI 제품 제작, 자동화, UX/UI, 협업과 프로젝트 문의를 위한 SuriBlog 연락 페이지입니다.',
  path: '/contact',
})

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
