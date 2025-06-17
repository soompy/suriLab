'use client'

import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface Post {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  author: string
}

interface PostViewerProps {
  post: Post
  isDarkMode?: boolean
}

export default function PostViewer({ post, isDarkMode = false }: PostViewerProps) {
  const readingTime = useMemo(() => {
    const wordsPerMinute = 200
    const words = post.content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }, [post.content])

  const syntaxTheme = isDarkMode ? oneDark : oneLight

  return (
    <article className={`max-w-4xl mx-auto ${isDarkMode ? 'dark' : ''}`}>
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span>By {post.author}</span>
          <span>•</span>
          <time dateTime={post.createdAt}>{post.createdAt}</time>
          <span>•</span>
          <span>{readingTime} min read</span>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2" data-testid="post-tags">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                {children}
              </p>
            ),
            strong: ({ children }) => (
              <strong className="font-bold text-gray-900 dark:text-white">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="italic text-gray-700 dark:text-gray-300">
                {children}
              </em>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-4 text-gray-700 dark:text-gray-300">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="mb-1">{children}</li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 dark:bg-blue-900/20 italic text-gray-700 dark:text-gray-300">
                {children}
              </blockquote>
            ),
            code: ({ inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '')
              const language = match ? match[1] : ''

              if (inline) {
                return (
                  <code
                    className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200"
                    {...props}
                  >
                    {children}
                  </code>
                )
              }

              return (
                <div className="relative mb-4">
                  {language && (
                    <div className="absolute top-0 right-0 px-3 py-1 bg-gray-600 text-white text-xs rounded-bl-md font-mono">
                      {language}
                    </div>
                  )}
                  <SyntaxHighlighter
                    style={syntaxTheme}
                    language={language}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                    }}
                    codeTagProps={{
                      role: 'code'
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              )
            },
            pre: ({ children, ...props }) => {
              const codeElement = children as React.ReactElement
              const language = codeElement?.props?.className?.match(/language-(\w+)/)?.[1]
              
              return (
                <pre 
                  data-language={language}
                  className={isDarkMode ? 'dark' : ''}
                  {...props}
                >
                  {children}
                </pre>
              )
            },
            table: ({ children }) => (
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-left">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {children}
              </td>
            ),
            a: ({ children, href }) => (
              <a
                href={href}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg shadow-md mb-4"
              />
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Published on {post.createdAt}
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              Share
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              Save
            </button>
          </div>
        </div>
      </footer>
    </article>
  )
}