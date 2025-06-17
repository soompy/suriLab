'use client'

import { useState, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownEditorProps {
  content: string
  onSave: (content: string) => void
  onContentChange: (content: string) => void
  autoSave?: boolean
  autoSaveDelay?: number
}

export default function MarkdownEditor({
  content,
  onSave,
  onContentChange,
  autoSave = false,
  autoSaveDelay = 2000
}: MarkdownEditorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [localContent, setLocalContent] = useState(content)

  const handleContentChange = useCallback((value: string) => {
    setLocalContent(value)
    onContentChange(value)
  }, [onContentChange])

  const handleSave = useCallback(() => {
    onSave(localContent)
  }, [localContent, onSave])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
  }, [handleSave])

  useEffect(() => {
    setLocalContent(content)
  }, [content])

  useEffect(() => {
    if (!autoSave) return

    const timeoutId = setTimeout(() => {
      if (localContent !== content) {
        onSave(localContent)
      }
    }, autoSaveDelay)

    return () => clearTimeout(timeoutId)
  }, [localContent, content, autoSave, autoSaveDelay, onSave])

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex gap-2">
          <button
            onClick={() => setIsPreviewMode(false)}
            className={`px-4 py-2 rounded ${
              !isPreviewMode
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setIsPreviewMode(true)}
            className={`px-4 py-2 rounded ${
              isPreviewMode
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Preview
          </button>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Save
        </button>
      </div>

      <div className="flex-1 p-4">
        {isPreviewMode ? (
          <div className="prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold mb-4">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold mb-3">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold mb-2">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 leading-relaxed">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic">{children}</em>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-4">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-4">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="mb-1">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-100 p-4 rounded overflow-x-auto mb-4">
                    {children}
                  </pre>
                ),
              }}
            >
              {localContent}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={localContent}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-full resize-none border rounded p-4 font-mono"
            placeholder="Write your markdown content here..."
          />
        )}
      </div>
    </div>
  )
}