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

  const summary = post.summary || post.content.slice(0, 150) + '...'

  return (
    <article 
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      {/* Clean Header */}
      <div className="relative h-40 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-blue-600 dark:text-blue-400 text-3xl font-bold">
              {post.title.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        
        {/* Reading time badge */}
        {post.readTime && (
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full font-medium">
            {post.readTime} min read
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs rounded-full">
              +{post.tags.length - 3}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {post.title}
        </h2>

        {/* Summary */}
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
          {summary}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <span>{post.author}</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          
          {post.views && (
            <span>{post.views.toLocaleString()} views</span>
          )}
        </div>
      </div>
    </article>
  )
}