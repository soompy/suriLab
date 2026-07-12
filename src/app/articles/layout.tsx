import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Articles | SuriBlog',
  description: 'SuriBlog의 MomentTune 제작기, AI 자동화, 1인 창업, 제품 기획과 블로그 성장 실험 전체 글 목록입니다.',
  path: '/articles',
})

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return children
}
