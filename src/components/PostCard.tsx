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
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-6xl font-bold opacity-20">
              {post.title.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        
        {/* Reading time overlay */}
        {post.readTime && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
            {post.readTime}분 읽기
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full font-medium"
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
              +{post.tags.length - 3}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {post.title}
        </h2>

        {/* Summary */}
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
          {summary}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              {formatDate(post.createdAt)}
            </span>
          </div>
          
          {post.views && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {post.views.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}