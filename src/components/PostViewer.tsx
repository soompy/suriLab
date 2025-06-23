'use client'

import { useMemo } from 'react'
import OptimizedMarkdown from './OptimizedMarkdown'

interface Post {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  author: string
}

interface PostViewerProps {
  post: Post
  isDarkMode?: boolean
}

export default function PostViewer({ post, isDarkMode = false }: PostViewerProps) {
  const readingTime = useMemo(() => {
    const wordsPerMinute = 200
    const words = post.content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }, [post.content])

  return (
    <article className={`max-w-4xl mx-auto ${isDarkMode ? 'dark' : ''}`}>
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span>By {post.author}</span>
          <span>•</span>
          <time dateTime={post.createdAt}>{post.createdAt}</time>
          <span>•</span>
          <span>{readingTime} min read</span>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2" data-testid="post-tags">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <OptimizedMarkdown 
        content={post.content}
        className="prose prose-lg dark:prose-invert max-w-none"
      />

      <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Published on {post.createdAt}
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              Share
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              Save
            </button>
          </div>
        </div>
      </footer>
    </article>
  )
}