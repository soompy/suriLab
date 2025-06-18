'use client'

import { useState } from 'react'
import { ThemeProvider } from '@/components/ThemeProvider'
import Header from '@/components/Header'
import MarkdownEditor from '@/components/MarkdownEditor'
import TagSystem from '@/components/TagSystem'

export default function Write() {
  const [content, setContent] = useState('# Welcome to SuriBlog\n\nStart writing your blog post here...\n\n```javascript\nfunction hello() {\n  console.log("Hello, World!")\n}\n```\n\nThis is a **bold** statement with `inline code`.')
  const [tags, setTags] = useState<string[]>(['react', 'javascript'])

  const handleSave = (content: string) => {
    console.log('Saving content:', content)
    console.log('Tags:', tags)
    // Here you would typically save to your backend
    alert('Post saved! (This is a demo)')
  }

  const suggestions = [
    'react', 'javascript', 'typescript', 'nextjs', 'tailwindcss',
    'nodejs', 'python', 'web-development', 'programming', 'tutorial'
  ]

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
        <Header />
        
        <main className="max-w-6xl mx-auto px-6 py-12">
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
                  
                  <button 
                    onClick={() => handleSave(content)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
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
        </main>
      </div>
    </ThemeProvider>
  )
}