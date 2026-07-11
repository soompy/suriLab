import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Build Log | SuriBlog',
  description: 'Claude Code, Codex 등 AI 코딩 도구와 MVP 제작 과정을 기록하는 SuriBlog의 Build Log입니다.',
  path: '/build-log',
})

export default function BuildLogLayout({ children }: { children: React.ReactNode }) {
  return children
}
