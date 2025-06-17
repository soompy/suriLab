'use client'

import { useState } from 'react'
import MarkdownEditor from '@/components/MarkdownEditor'
import TagSystem from '@/components/TagSystem'
import PostViewer from '@/components/PostViewer'
import ThemeToggleWrapper from '@/components/ThemeToggleWrapper'
import { ThemeProvider } from '@/components/ThemeProvider'
import BlogMainPage from '@/components/BlogMainPage'

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              SuriBlog
            </h1>
            
            <div className="flex items-center gap-4">
              <nav className="flex gap-2">
                <button
                  onClick={() => setCurrentView('editor')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === 'editor'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  Editor
                </button>
                <button
                  onClick={() => setCurrentView('preview')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === 'preview'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setCurrentView('posts')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === 'posts'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  Posts
                </button>
              </nav>
              
              <ThemeToggleWrapper />
            </div>
          </header>

          {/* Content based on current view */}
          {currentView === 'editor' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-[600px]">
                  <MarkdownEditor
                    content={content}
                    onSave={handleSave}
                    onContentChange={setContent}
                    autoSave={true}
                    autoSaveDelay={2000}
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Tags
                  </h2>
                  <TagSystem
                    tags={tags}
                    onTagsChange={setTags}
                    suggestions={suggestions}
                    maxTags={8}
                    placeholder="Add tags..."
                  />
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Post Settings
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option>Draft</option>
                        <option>Published</option>
                        <option>Private</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option>Tech</option>
                        <option>Tutorial</option>
                        <option>Review</option>
                        <option>News</option>
                      </select>
                    </div>
                    
                    <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                      Publish Post
                    </button>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Statistics
                  </h2>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Words:</span>
                      <span>{content.split(' ').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Characters:</span>
                      <span>{content.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tags:</span>
                      <span>{tags.length}/8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'preview' && (
            <div className="max-w-4xl mx-auto">
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
          )}

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
        </div>
      </div>
    </ThemeProvider>
  )
}