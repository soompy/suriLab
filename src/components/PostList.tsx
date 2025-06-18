'use client'

import { useState, useMemo } from 'react'
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
  category?: string
}

interface PostListProps {
  posts: Post[]
  onPostClick: (post: Post) => void
  itemsPerPage?: number
  showPagination?: boolean
  enableInfiniteScroll?: boolean
  layout?: 'grid' | 'list'
  className?: string
}

export default function PostList({ 
  posts, 
  onPostClick, 
  itemsPerPage = 6,
  showPagination = true,
  enableInfiniteScroll = false,
  layout = 'grid',
  className = ''
}: PostListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [displayedItems, setDisplayedItems] = useState(itemsPerPage)

  // Calculate pagination
  const totalPages = Math.ceil(posts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  // Get posts for current view
  const currentPosts = useMemo(() => {
    if (enableInfiniteScroll) {
      return posts.slice(0, displayedItems)
    }
    return posts.slice(startIndex, endIndex)
  }, [posts, currentPage, displayedItems, startIndex, endIndex, enableInfiniteScroll])

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  // Infinite scroll handler
  const handleLoadMore = () => {
    setDisplayedItems(prev => Math.min(prev + itemsPerPage, posts.length))
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  if (posts.length === 0) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">📝</div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          No posts found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          There are no posts to display at the moment.
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Posts Grid/List */}
      <div className={
        layout === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-6'
      }>
        {currentPosts.map((post) => (
          <div key={post.id} className={layout === 'list' ? 'max-w-4xl mx-auto' : ''}>
            <PostCard
              post={post}
              onClick={() => onPostClick(post)}
            />
          </div>
        ))}
      </div>

      {/* Load More Button (Infinite Scroll) */}
      {enableInfiniteScroll && displayedItems < posts.length && (
        <div className="text-center mt-12">
          <button
            onClick={handleLoadMore}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Load More Posts
          </button>
        </div>
      )}

      {/* Traditional Pagination */}
      {showPagination && !enableInfiniteScroll && totalPages > 1 && (
        <div className="flex items-center justify-center mt-12 space-x-2">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800'
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex space-x-1">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' ? handlePageChange(page) : undefined}
                disabled={page === 'ellipsis'}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : page === 'ellipsis'
                    ? 'text-gray-400 cursor-default dark:text-gray-600'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800'
                }`}
              >
                {page === 'ellipsis' ? '...' : page}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800'
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Pagination Info */}
      {(showPagination || enableInfiniteScroll) && (
        <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          {enableInfiniteScroll ? (
            <>Showing {Math.min(displayedItems, posts.length)} of {posts.length} posts</>
          ) : (
            <>
              Showing {startIndex + 1}-{Math.min(endIndex, posts.length)} of {posts.length} posts
              {totalPages > 1 && (
                <> (Page {currentPage} of {totalPages})</>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}