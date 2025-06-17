'use client'

import { useState } from 'react'
import MarkdownEditor from '@/components/MarkdownEditor'
import TagSystem from '@/components/TagSystem'

export default function Home() {
  const [content, setContent] = useState('# Welcome to SuriBlog\n\nStart writing your blog post here...')
  const [tags, setTags] = useState<string[]>([])

  const handleSave = (content: string) => {
    console.log('Saving content:', content)
    console.log('Tags:', tags)
  }

  const suggestions = [
    'react', 'javascript', 'typescript', 'nextjs', 'tailwindcss',
    'nodejs', 'python', 'web-development', 'programming', 'tutorial'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          SuriBlog Editor
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg h-[600px]">
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
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
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
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Post Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Draft</option>
                    <option>Published</option>
                    <option>Private</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
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
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Statistics
              </h2>
              <div className="space-y-2 text-sm text-gray-600">
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
      </div>
    </div>
  )
}