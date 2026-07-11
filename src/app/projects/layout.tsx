import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Projects | SuriBlog',
  description: 'MomentTune를 포함해 Suri가 만들고 실험한 웹 서비스, 제품, MVP 프로젝트 기록을 모았습니다.',
  path: '/projects',
})

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children
}
