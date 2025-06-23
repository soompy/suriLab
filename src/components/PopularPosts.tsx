'use client'

import { ThumbnailImage } from './image'

interface PopularPost {
  id: string
  title: string
  views: number
  thumbnail?: string
  createdAt: string
}

interface PopularPostsProps {
  posts: PopularPost[]
  onPostClick?: (postId: string) => void
  className?: string
}

export default function PopularPosts({ posts, onPostClick, className = '' }: PopularPostsProps) {
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return '오늘'
    if (diffInDays === 1) return '어제'
    if (diffInDays < 7) return `${diffInDays}일 전`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`
    return `${Math.floor(diffInDays / 30)}개월 전`
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          인기 포스트
        </h3>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post, index) => (
          <div
            key={post.id}
            onClick={() => onPostClick?.(post.id)}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
          >
            {/* Rank */}
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              index === 0 ? 'bg-yellow-500 text-white' :
              index === 1 ? 'bg-gray-400 text-white' :
              index === 2 ? 'bg-orange-600 text-white' :
              'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}>
              {index + 1}
            </div>

            {/* Thumbnail */}
            <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
              <ThumbnailImage
                src={post.thumbnail}
                alt={post.title}
                width={48}
                height={48}
                fallbackText={post.title.charAt(0).toUpperCase()}
                quality={75}
                borderRadius="8px"
                hoverEffect={false}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                {post.title}
              </h4>
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  {formatViews(post.views)}
                </span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All */}
      <button className="w-full mt-4 text-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
        인기 포스트 더보기 →
      </button>
    </div>
  )
}