'use client'

import { useState, useEffect, useMemo } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

interface Post {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  author: string
}

interface SearchFilterProps {
  posts: Post[]
  onFilter: (filteredPosts: Post[]) => void
}

type SortOption = 'newest' | 'oldest' | 'alphabetical'

export default function SearchFilter({ posts, onFilter }: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const availableTags = useMemo(() => {
    const allTags = posts.flatMap(post => post.tags)
    return Array.from(new Set(allTags)).sort()
  }, [posts])

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts

    // Filter by search term
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase()
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.author.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Filter by tag
    if (selectedTag !== 'all') {
      filtered = filtered.filter(post => post.tags.includes(selectedTag))
    }

    // Sort posts
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'alphabetical':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return sorted
  }, [posts, debouncedSearchTerm, selectedTag, sortBy])

  useEffect(() => {
    onFilter(filteredAndSortedPosts)
  }, [filteredAndSortedPosts, onFilter])

  const clearSearch = () => {
    setSearchTerm('')
    setSelectedTag('all')
    setSortBy('newest')
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {searchTerm && (
            <button
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg
                className="h-5 w-5 text-gray-400 hover:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Tag Filter */}
        <div>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Tags</option>
            {availableTags.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="newest">Sort by: Newest First</option>
            <option value="oldest">Sort by: Oldest First</option>
            <option value="alphabetical">Sort by: Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>
          {filteredAndSortedPosts.length} of {posts.length} posts
          {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
          {selectedTag !== 'all' && ` in "${selectedTag}"`}
        </span>
        
        {(searchTerm || selectedTag !== 'all') && (
          <button
            onClick={clearSearch}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Active Filters */}
      {(debouncedSearchTerm || selectedTag !== 'all') && (
        <div className="mt-3 flex flex-wrap gap-2">
          {debouncedSearchTerm && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              Search: {debouncedSearchTerm}
              <button
                onClick={() => setSearchTerm('')}
                className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {selectedTag !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              Tag: {selectedTag}
              <button
                onClick={() => setSelectedTag('all')}
                className="ml-2 text-green-600 dark:text-green-400 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}