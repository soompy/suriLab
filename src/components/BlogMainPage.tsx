'use client'

import { useState } from 'react'
import PostCard from './PostCard'
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-16 mb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              개발 블로그
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              최신 웹 개발 기술과 경험을 공유합니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors">
                최신 포스트 보기
              </button>
              <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-full hover:bg-white hover:text-blue-600 transition-colors">
                구독하기
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Search Filter */}
        <div className="mb-8">
          <SearchFilter
            posts={enhancedPosts}
            onFilter={setFilteredPosts}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Categories */}
          <aside className="lg:col-span-3 space-y-6">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategoryFilter}
            />
            
            {/* Mobile: Hide on small screens */}
            <div className="hidden lg:block">
              <ProfileBox
                author={authorProfile}
                stats={authorStats}
              />
            </div>
          </aside>

          {/* Main Content - Posts */}
          <main className="lg:col-span-6">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  다른 키워드로 검색해보세요.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onClick={() => onPostClick(post)}
                  />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {filteredPosts.length > 0 && (
              <div className="text-center mt-12">
                <button className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium py-3 px-8 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  더 많은 포스트 보기
                </button>
              </div>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            {/* Mobile: Show profile on large screens only */}
            <div className="lg:hidden">
              <ProfileBox
                author={authorProfile}
                stats={authorStats}
              />
            </div>

            <PopularPosts
              posts={popularPosts}
              onPostClick={(postId) => {
                const post = enhancedPosts.find(p => p.id === postId)
                if (post) onPostClick(post)
              }}
            />

            <SocialLinks links={socialLinks} />

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">뉴스레터 구독</h3>
              <p className="text-purple-100 text-sm mb-4">
                새로운 포스트와 개발 팁을 이메일로 받아보세요.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="이메일 주소"
                  className="w-full px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="w-full bg-white text-purple-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                  구독하기
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}