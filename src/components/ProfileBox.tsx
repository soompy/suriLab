'use client'

import { AvatarImage } from './image'

interface ProfileBoxProps {
  author: {
    name: string
    bio: string
    avatar?: string
    location?: string
    website?: string
    email?: string
  }
  stats: {
    posts: number
    followers: number
    following: number
  }
  className?: string
}

export default function ProfileBox({ author, stats, className = '' }: ProfileBoxProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        {/* Avatar */}
        <div className="relative w-20 h-20 mx-auto mb-4">
          <AvatarImage
            src={author.avatar}
            alt={author.name}
            size={80}
            fallbackText={author.name.charAt(0).toUpperCase()}
            priority={true}
            quality={90}
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {author.name}
        </h3>

        {/* Bio */}
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
          {author.bio}
        </p>

        {/* Location */}
        {author.location && (
          <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {author.location}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.posts}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Posts
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.followers.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Followers
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.following}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Following
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="space-y-2">
        {author.website && (
          <a
            href={author.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.499-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.499.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
            </svg>
            Website
          </a>
        )}
        
        {author.email && (
          <a
            href={`mailto:${author.email}`}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Contact
          </a>
        )}
      </div>

      {/* Follow Button */}
      <button className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
        Follow
      </button>
    </div>
  )
}