'use client'

import PostCard from './PostCard'

interface Post {
  id: string
  title: string
  content: string
  summary?: string
  thumbnail?: string
  tags: string[]
  createdAt: string
  author: string
  readTime?: number
  views?: number
}

interface PostGridProps {
  posts: Post[]
  onPostClick?: (post: Post) => void
}

export default function PostGrid({ posts, onPostClick }: PostGridProps) {
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-[1300px] mx-auto px-4 md:px-6">
        {/* Minimal Section Header */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            최근 포스트
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            새로운 인사이트와 경험을 담은 최신 글들을 만나보세요.
          </p>
        </div>

        {/* Clean Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => onPostClick?.(post)}
            />
          ))}
        </div>

        {/* Minimal Load More */}
        <div className="mt-8 text-center">
          <button className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-150">
            <span>더 많은 글 보기</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}