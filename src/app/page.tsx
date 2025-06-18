'use client'

import { useState } from 'react'
import MarkdownEditor from '@/components/MarkdownEditor'
import TagSystem from '@/components/TagSystem'
import PostViewer from '@/components/PostViewer'
import ThemeToggleWrapper from '@/components/ThemeToggleWrapper'
import { ThemeProvider } from '@/components/ThemeProvider'
import BlogMainPage from '@/components/BlogMainPage'
import Logo from '@/components/Logo'

export default function Home() {
  const [content, setContent] = useState('# Welcome to SuriBlog\n\nStart writing your blog post here...\n\n```javascript\nfunction hello() {\n  console.log("Hello, World!")\n}\n```\n\nThis is a **bold** statement with `inline code`.')
  const [tags, setTags] = useState<string[]>(['react', 'javascript'])
  const [currentView, setCurrentView] = useState<'editor' | 'preview' | 'posts'>('editor')

  const samplePosts = [
    {
      id: '1',
      title: 'Getting Started with React Hooks',
      content: `# React Hooks Introduction

React Hooks revolutionized how we write components. Here's a simple example:

\`\`\`javascript
import { useState, useEffect } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    document.title = \`Count: \${count}\`
  }, [count])
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}
\`\`\`

This example shows **useState** and **useEffect** in action.`,
      tags: ['react', 'javascript', 'hooks'],
      createdAt: '2024-01-15T10:00:00Z',
      author: 'John Doe'
    },
    {
      id: '2',
      title: 'Python for Data Science',
      content: `# Data Science with Python

Python is excellent for data analysis. Here's a basic example:

\`\`\`python
import pandas as pd
import numpy as np

# Create sample data
data = {
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35],
    'score': [95, 87, 92]
}

df = pd.DataFrame(data)
print(df.head())
\`\`\`

This creates a simple DataFrame for analysis.`,
      tags: ['python', 'data-science', 'pandas'],
      createdAt: '2024-01-10T15:30:00Z',
      author: 'Jane Smith'
    }
  ]

  const handleSave = (content: string) => {
    console.log('Saving content:', content)
    console.log('Tags:', tags)
  }

  const suggestions = [
    'react', 'javascript', 'typescript', 'nextjs', 'tailwindcss',
    'nodejs', 'python', 'web-development', 'programming', 'tutorial'
  ]

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
        {/* Clean Header */}
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <Logo size="md" />
              
              <nav className="flex items-center gap-8">
                <button
                  onClick={() => setCurrentView('posts')}
                  className={`text-sm font-medium transition-colors ${
                    currentView === 'posts'
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  Posts
                </button>
                <button
                  onClick={() => setCurrentView('editor')}
                  className={`text-sm font-medium transition-colors ${
                    currentView === 'editor'
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  Write
                </button>
                <button
                  onClick={() => setCurrentView('preview')}
                  className={`text-sm font-medium transition-colors ${
                    currentView === 'preview'
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  Preview
                </button>
                <ThemeToggleWrapper />
              </nav>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-12">

          {/* Editor View */}
          {currentView === 'editor' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                {/* Clean Editor */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden">
                  <div className="h-[600px]">
                    <MarkdownEditor
                      content={content}
                      onSave={handleSave}
                      onContentChange={setContent}
                      autoSave={true}
                      autoSaveDelay={2000}
                    />
                  </div>
                </div>
              </div>
              
              {/* Clean Sidebar */}
              <div className="space-y-6">
                {/* Tags */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
                  <TagSystem
                    tags={tags}
                    onTagsChange={setTags}
                    suggestions={suggestions}
                    maxTags={8}
                    placeholder="Add tags..."
                  />
                </div>
                
                {/* Publish */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Publish</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Draft</option>
                        <option>Published</option>
                        <option>Private</option>
                      </select>
                    </div>
                    
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                      Publish Post
                    </button>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Statistics</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Words</span>
                      <span className="font-mono text-gray-900 dark:text-white">{content.split(' ').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Characters</span>
                      <span className="font-mono text-gray-900 dark:text-white">{content.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Reading time</span>
                      <span className="font-mono text-gray-900 dark:text-white">{Math.ceil(content.split(' ').length / 200)}min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview View */}
          {currentView === 'preview' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
                <div className="p-8">
                  <PostViewer
                    post={{
                      id: 'preview',
                      title: 'Post Preview',
                      content: content,
                      tags: tags,
                      createdAt: new Date().toISOString(),
                      author: 'You'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Posts View */}
          {currentView === 'posts' && (
            <BlogMainPage
              posts={samplePosts}
              onPostClick={(post) => {
                setContent(post.content)
                setTags(post.tags)
                setCurrentView('preview')
              }}
            />
          )}
        </main>
      </div>
    </ThemeProvider>
  )
}