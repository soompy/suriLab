'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ThemeProvider } from '@/components/ThemeProvider'
import Header from '@/components/Header'

export default function Archives() {
  const router = useRouter()
  const [selectedPost, setSelectedPost] = useState<any>(null)

  const samplePosts = [
    {
      id: '1',
      title: 'Getting Started with React Hooks',
      content: '# React Hooks Introduction\n\nReact Hooks revolutionized how we write components...',
      tags: ['react', 'javascript', 'hooks'],
      createdAt: '2024-01-15T10:00:00Z',
      author: 'John Doe'
    },
    {
      id: '2',
      title: 'Python for Data Science',
      content: '# Data Science with Python\n\nPython is excellent for data analysis...',
      tags: ['python', 'data-science', 'pandas'],
      createdAt: '2024-01-10T15:30:00Z',
      author: 'Jane Smith'
    }
  ]

  const handlePostClick = (post: any) => {
    setSelectedPost(post)
    // In a real application, you would navigate to the post detail page
    console.log('Navigate to post:', post.title)
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
        <Header />
        
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Archives</h1>
            <div className="space-y-8">
              {/* Year 2024 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2024</h2>
                <div className="space-y-4">
                  {samplePosts.map((post) => (
                    <div 
                      key={post.id} 
                      className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      onClick={() => handlePostClick(post)}
                    >
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {post.title}
                        </h3>
                        <div className="flex gap-2 mt-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs text-gray-500 dark:text-gray-400">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Statistics */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{samplePosts.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Posts</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">12</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">24</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Tags</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">1.2k</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}