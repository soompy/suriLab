'use client'

import { useState } from 'react'

interface Post {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  author: string
}

interface RSSFeedProps {
  posts: Post[]
  siteTitle: string
  siteDescription: string
  siteUrl: string
}

export default function RSSFeed({ posts, siteTitle, siteDescription, siteUrl }: RSSFeedProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const escapeXML = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  const generateRSSFeed = (): string => {
    const now = new Date().toUTCString()
    
    const rssItems = posts.map(post => {
      const postUrl = `${siteUrl}/posts/${post.id}`
      const pubDate = new Date(post.createdAt).toUTCString()
      
      // Create a clean excerpt from content (first 200 chars)
      const excerpt = post.content.length > 200 
        ? post.content.substring(0, 200) + '...'
        : post.content

      return `
    <item>
      <title>${escapeXML(post.title)}</title>
      <link>${escapeXML(postUrl)}</link>
      <description><![CDATA[${excerpt}]]></description>
      <author>${escapeXML(post.author)}</author>
      <category>${post.tags.map(tag => escapeXML(tag)).join(', ')}</category>
      <guid isPermaLink="true">${escapeXML(postUrl)}</guid>
      <pubDate>${pubDate}</pubDate>
    </item>`
    }).join('')

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXML(siteTitle)}</title>
    <link>${escapeXML(siteUrl)}</link>
    <description>${escapeXML(siteDescription)}</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${escapeXML(siteUrl)}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>SuriBlog RSS Generator</generator>
    <webMaster>admin@${new URL(siteUrl).hostname}</webMaster>
    <managingEditor>admin@${new URL(siteUrl).hostname}</managingEditor>
    <ttl>60</ttl>${rssItems}
  </channel>
</rss>`
  }

  const downloadRSSFeed = async () => {
    setIsGenerating(true)
    
    try {
      const rssContent = generateRSSFeed()
      const blob = new Blob([rssContent], { type: 'application/rss+xml' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = 'feed.xml'
      link.style.display = 'none'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to generate RSS feed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyRSSUrl = async () => {
    const rssUrl = `${siteUrl}/feed.xml`
    
    try {
      await navigator.clipboard.writeText(rssUrl)
      // You could add a toast notification here
      console.log('RSS URL copied to clipboard')
    } catch (error) {
      console.error('Failed to copy RSS URL:', error)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-shrink-0">
          <svg
            data-testid="rss-icon"
            className="w-8 h-8 text-orange-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3.429 4.286v2.857c7.971 0 14.429 6.458 14.429 14.429h2.857C20.714 13.5 13.5 6.286 5.429 4.286h-2zM3.429 10v2.857c3.943 0 7.143 3.2 7.143 7.143H13.43c0-5.571-4.572-10-10.001-10zM6.286 17.143c0 1.571-1.286 2.857-2.857 2.857S.571 18.714.571 17.143s1.286-2.857 2.857-2.857 2.858 1.286 2.858 2.857z"/>
          </svg>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            RSS Feed
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Subscribe to get the latest posts
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={downloadRSSFeed}
          disabled={isGenerating}
          aria-label="Subscribe to RSS feed"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg transition-colors duration-200 font-medium"
        >
          {isGenerating ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Generating RSS...
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Subscribe to RSS
            </>
          )}
        </button>

        <button
          onClick={copyRSSUrl}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200 font-medium"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copy RSS URL
        </button>
      </div>

      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <span className="font-semibold">RSS URL:</span>
          <br />
          <code className="break-all">{siteUrl}/feed.xml</code>
        </p>
      </div>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>
          Use this RSS feed in your favorite feed reader to stay updated with new posts.
          Popular readers include Feedly, Inoreader, and NetNewsWire.
        </p>
      </div>
    </div>
  )
}