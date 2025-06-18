'use client'

import { useState, useMemo, useEffect } from 'react'
import PostList from './PostList'
import CategoryFilter from './CategoryFilter'
import ProfileBox from './ProfileBox'
import PopularPosts from './PopularPosts'
import SocialLinks from './SocialLinks'
import SearchFilter from './SearchFilter'

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

interface BlogMainPageProps {
  posts: Post[]
  onPostClick: (post: Post) => void
}

export default function BlogMainPage({ posts, onPostClick }: BlogMainPageProps) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])


  const enhancedPosts = useMemo(() => posts.map((post, index) => ({
    ...post,
    summary: post.content.substring(0, 150) + '...',
    readTime: Math.ceil(post.content.split(' ').length / 200),
    views: Math.floor((post.title.length + post.content.length + index) * 73) % 9000 + 1000, // Deterministic views based on content
    category: post.tags[0] || 'general'
  })), [posts])

  // Initialize filtered posts when enhancedPosts changes
  useEffect(() => {
    setFilteredPosts(enhancedPosts)
  }, [enhancedPosts])


  return (
    <div className="">
      {/* Clean Hero Section */}
      <section className="py-16 mb-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Latest Posts
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Thoughts on software development, technology, and building things.
          </p>
        </div>
      </section>

      {/* Search Filter */}
      <div className="mb-8">
        <SearchFilter
          posts={enhancedPosts}
          onFilter={setFilteredPosts}
        />
      </div>

      {/* Posts List with Pagination */}
      <PostList
        posts={filteredPosts}
        onPostClick={onPostClick}
        itemsPerPage={6}
        showPagination={true}
        layout="grid"
      />
    </div>
  )
}