import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Archives | SuriBlog',
  description: 'SuriBlog의 공개 글을 연도, 월, 카테고리별로 탐색할 수 있는 아카이브입니다.',
  path: '/archives',
})

export default function ArchivesLayout({ children }: { children: React.ReactNode }) {
  return children
}
