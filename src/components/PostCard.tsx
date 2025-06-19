'use client'

import Image from 'next/image'

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

interface PostCardProps {
  post: Post
  onClick?: () => void
}

export default function PostCard({ post, onClick }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const summary = post.summary || post.content.slice(0, 120) + '...'

  return (
    <article 
      className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200 overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      {/* Minimal Image Header */}
      <div className="relative h-40 bg-gray-50 dark:bg-gray-800 overflow-hidden">
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-400 dark:text-gray-500 text-2xl font-medium">
              {post.title.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        
        {/* Minimal Category Badge */}
        {post.tags[0] && (
          <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded font-medium">
            {post.tags[0]}
          </div>
        )}
      </div>

      {/* Clean Content */}
      <div className="p-4">
        {/* Title */}
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-150 leading-snug">
          {post.title}
        </h2>

        {/* Summary */}
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-3 line-clamp-2">
          {summary}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <div className="flex items-center gap-2">
            <span>{post.author}</span>
            <span>•</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          
          <div className="flex items-center gap-3">
            {post.readTime && (
              <span>{post.readTime}분</span>
            )}
            {post.views && (
              <span>{post.views.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}