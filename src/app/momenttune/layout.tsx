import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'MomentTune | SuriBlog',
  description: 'MomentTune 제작 과정, MVP 실험, 제품 의사결정과 출시 준비를 기록하는 공식 제작 로그입니다.',
  path: '/momenttune',
})

export default function MomentTuneLayout({ children }: { children: React.ReactNode }) {
  return children
}
