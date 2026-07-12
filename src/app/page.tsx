import HomePageClient from '@/components/HomePageClient'
import type { PostEntity } from '@/entities/Post'
import { getPosts } from '@/infrastructure/api/posts'

export const revalidate = 300

export default async function HomePage() {
  let initialPosts: PostEntity[] = []
  let initialError: string | null = null

  try {
    const result = await getPosts(
      { isPublished: true },
      { field: 'publishedAt', order: 'desc' },
      { page: 1, limit: 6 }
    )

    initialPosts = result.posts.map((post) => ({
      ...post,
      content: ''
    }))
  } catch (error) {
    console.error('Failed to load homepage posts:', error)
    initialError = '글 목록을 불러오지 못했습니다.'
  }

  return <HomePageClient initialPosts={initialPosts} initialError={initialError} />
}
