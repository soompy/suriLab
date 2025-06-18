'use client'

import { useState, useEffect, useMemo } from 'react'

interface Heading {
  id: string
  text: string
  level: number
  element: HTMLElement
}

interface TableOfContentsProps {
  content: string
  className?: string
  maxLevel?: number
  showLevelNumbers?: boolean
  sticky?: boolean
  collapsible?: boolean
}

export default function TableOfContents({
  content,
  className = '',
  maxLevel = 3,
  showLevelNumbers = false,
  sticky = true,
  collapsible = true
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeHeading, setActiveHeading] = useState<string>('')
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Extract headings from content
  const extractedHeadings = useMemo(() => {
    const headingRegex = /^#{1,6}\s+(.+)$/gm
    const matches = content.match(headingRegex) || []
    
    return matches
      .map((match, index) => {
        const level = match.match(/^#+/)?.[0].length || 1
        const text = match.replace(/^#+\s+/, '').trim()
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
          || `heading-${index}`
        
        return { id, text, level, element: null as any }
      })
      .filter(heading => heading.level <= maxLevel)
  }, [content, maxLevel])

  // Find heading elements in DOM and set up scroll spy
  useEffect(() => {
    const timer = setTimeout(() => {
      const headingElements = extractedHeadings.map(heading => {
        // Try multiple selectors to find the heading
        let element = document.getElementById(heading.id)
        
        if (!element) {
          // Try to find by text content
          const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
          element = Array.from(allHeadings).find(el => 
            el.textContent?.trim().toLowerCase() === heading.text.toLowerCase()
          ) as HTMLElement
        }
        
        if (!element) {
          // Create a virtual element for headings that don't exist yet
          element = document.createElement('div')
          element.id = heading.id
        }
        
        return { ...heading, element }
      })
      
      setHeadings(headingElements.filter(h => h.element))
    }, 500) // Delay to ensure DOM is ready
    
    return () => clearTimeout(timer)
  }, [content, maxLevel]) // Use primitive dependencies instead of extractedHeadings

  // Scroll spy functionality
  useEffect(() => {
    if (headings.length === 0) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100 // Offset for better UX

      // Find the current active heading
      let currentHeading = ''
      
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i]
        if (heading.element && heading.element.offsetTop <= scrollPosition) {
          currentHeading = heading.id
          break
        }
      }
      
      setActiveHeading(currentHeading)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings]) // Remove activeHeading from dependencies to prevent infinite loop

  // Smooth scroll to heading
  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId)
    if (element) {
      const offsetTop = element.offsetTop - 80 // Account for sticky header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }

  // Generate level numbers
  const generateLevelNumbers = (headings: Heading[]) => {
    const counters: Record<number, number> = {}
    
    return headings.map(heading => {
      // Reset deeper level counters
      for (let level = heading.level + 1; level <= 6; level++) {
        counters[level] = 0
      }
      
      // Increment current level counter
      counters[heading.level] = (counters[heading.level] || 0) + 1
      
      // Generate number string
      const numberParts = []
      for (let level = 1; level <= heading.level; level++) {
        if (counters[level]) {
          numberParts.push(counters[level])
        }
      }
      
      return {
        ...heading,
        number: numberParts.join('.')
      }
    })
  }

  const numberedHeadings = showLevelNumbers ? generateLevelNumbers(headings) : headings

  if (headings.length === 0) {
    return null
  }

  return (
    <div className={`table-of-contents ${sticky ? 'sticky top-20' : ''} ${className}`}>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
            Table of Contents
          </h3>
          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              aria-label={isCollapsed ? 'Expand' : 'Collapse'}
            >
              <svg 
                className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* TOC List */}
        {!isCollapsed && (
          <nav className="p-4">
            <ul className="space-y-1">
              {numberedHeadings.map((heading) => (
                <li key={heading.id}>
                  <button
                    onClick={() => scrollToHeading(heading.id)}
                    className={`w-full text-left transition-colors duration-200 rounded px-2 py-1.5 text-sm ${
                      activeHeading === heading.id
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    style={{ 
                      paddingLeft: `${(heading.level - 1) * 12 + 8}px` 
                    }}
                  >
                    <span className="flex items-start gap-2">
                      {showLevelNumbers && (
                        <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-mono">
                          {(heading as any).number}
                        </span>
                      )}
                      <span className="flex-1 leading-relaxed">
                        {heading.text}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100 dark:bg-gray-800">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{
              width: headings.length > 0 
                ? `${((headings.findIndex(h => h.id === activeHeading) + 1) / headings.length) * 100}%`
                : '0%'
            }}
          />
        </div>
      </div>

      {/* Mini TOC for mobile */}
      <div className="lg:hidden mt-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Reading Progress
            </span>
            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{
                  width: headings.length > 0 
                    ? `${((headings.findIndex(h => h.id === activeHeading) + 1) / headings.length) * 100}%`
                    : '0%'
                }}
              />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {headings.findIndex(h => h.id === activeHeading) + 1}/{headings.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}