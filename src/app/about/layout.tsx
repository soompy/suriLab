import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'About | SuriBlog',
  description: 'AI 제품을 만들고 기록하는 Suri의 배경, 경험, 기술 스택, 제품 제작 관점을 소개합니다.',
  path: '/about',
})

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
