'use client'

import { useState } from 'react'
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
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts)
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Sample data for sidebar components
  const categories = [
    { id: 'frontend', name: 'Frontend', count: 12, color: 'bg-blue-500' },
    { id: 'backend', name: 'Backend', count: 8, color: 'bg-green-500' },
    { id: 'mobile', name: 'Mobile', count: 5, color: 'bg-purple-500' },
    { id: 'devops', name: 'DevOps', count: 6, color: 'bg-orange-500' },
    { id: 'tutorial', name: 'Tutorial', count: 15, color: 'bg-red-500' }
  ]

  const authorProfile = {
    name: 'SoomPy',
    bio: '풀스택 개발자이자 기술 블로거입니다. 새로운 기술을 배우고 공유하는 것을 좋아합니다.',
    avatar: '',
    location: 'Seoul, Korea',
    website: 'https://suriblog.example.com',
    email: 'contact@suriblog.com'
  }

  const authorStats = {
    posts: 42,
    followers: 1250,
    following: 180
  }

  const popularPosts = [
    {
      id: '1',
      title: 'React 19의 새로운 기능들과 변화된 점',
      views: 15420,
      createdAt: '2024-01-10T10:00:00Z'
    },
    {
      id: '2', 
      title: 'Next.js App Router 완전 정복 가이드',
      views: 12890,
      createdAt: '2024-01-08T14:30:00Z'
    },
    {
      id: '3',
      title: 'TypeScript 5.0 업데이트 요약',
      views: 9765,
      createdAt: '2024-01-05T09:15:00Z'
    },
    {
      id: '4',
      title: 'Tailwind CSS 실무 활용법',
      views: 8340,
      createdAt: '2024-01-03T16:20:00Z'
    },
    {
      id: '5',
      title: 'Docker로 개발 환경 구축하기',
      views: 7590,
      createdAt: '2024-01-01T11:45:00Z'
    }
  ]

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/soompy',
      icon: 'github',
      color: '#333',
      followers: 450
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/soompy',
      icon: 'twitter', 
      color: '#1DA1F2',
      followers: 1200
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/soompy',
      icon: 'linkedin',
      color: '#0077B5',
      followers: 800
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@soompy',
      icon: 'youtube',
      color: '#FF0000',
      followers: 2500
    }
  ]

  const enhancedPosts = posts.map(post => ({
    ...post,
    summary: post.content.substring(0, 150) + '...',
    readTime: Math.ceil(post.content.split(' ').length / 200),
    views: Math.floor(Math.random() * 10000) + 1000,
    category: post.tags[0] || 'general'
  }))

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId)
    if (categoryId === 'all') {
      setFilteredPosts(enhancedPosts)
    } else {
      const filtered = enhancedPosts.filter(post => 
        post.category === categoryId || post.tags.includes(categoryId)
      )
      setFilteredPosts(filtered)
    }
  }

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