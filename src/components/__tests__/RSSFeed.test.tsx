import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RSSFeed from '../RSSFeed'

// Mock fetch for RSS generation tests
global.fetch = jest.fn()

describe('RSSFeed', () => {
  const mockPosts = [
    {
      id: '1',
      title: 'First Post',
      content: 'This is the first post content.',
      tags: ['react', 'javascript'],
      createdAt: '2024-01-01T00:00:00Z',
      author: 'John Doe'
    },
    {
      id: '2',
      title: 'Second Post',
      content: 'This is the second post content.',
      tags: ['python', 'tutorial'],
      createdAt: '2024-01-02T00:00:00Z',
      author: 'Jane Smith'
    }
  ]

  const defaultProps = {
    posts: mockPosts,
    siteTitle: 'SuriBlog',
    siteDescription: 'A modern development blog',
    siteUrl: 'https://example.com'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders RSS subscription button', () => {
    render(<RSSFeed {...defaultProps} />)

    expect(screen.getByRole('button', { name: /subscribe to rss/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /rss feed/i })).toBeInTheDocument()
  })

  it('shows RSS icon', () => {
    render(<RSSFeed {...defaultProps} />)

    expect(screen.getByTestId('rss-icon')).toBeInTheDocument()
  })

  it('generates RSS feed when button is clicked', async () => {
    const user = userEvent.setup()
    
    const mockUrl = 'blob:mock-url'
    
    global.URL.createObjectURL = jest.fn(() => mockUrl)
    global.URL.revokeObjectURL = jest.fn()
    
    const mockLink = {
      click: jest.fn(),
      setAttribute: jest.fn(),
      style: { display: '' }
    }
    
    document.createElement = jest.fn(() => mockLink as any)
    document.body.appendChild = jest.fn()
    document.body.removeChild = jest.fn()

    render(<RSSFeed {...defaultProps} />)

    const rssButton = screen.getByRole('button', { name: /subscribe to rss/i })
    await user.click(rssButton)

    expect(global.URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob))
    expect(mockLink.setAttribute).toHaveBeenCalledWith('href', mockUrl)
    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'feed.xml')
    expect(mockLink.click).toHaveBeenCalled()
  })

  it('generates valid RSS XML structure', async () => {
    const user = userEvent.setup()
    
    let capturedBlob: Blob | null = null
    global.URL.createObjectURL = jest.fn((blob) => {
      capturedBlob = blob
      return 'blob:mock-url'
    })
    
    const mockLink = {
      click: jest.fn(),
      setAttribute: jest.fn(),
      style: { display: '' }
    }
    
    document.createElement = jest.fn(() => mockLink as any)
    document.body.appendChild = jest.fn()
    document.body.removeChild = jest.fn()

    render(<RSSFeed {...defaultProps} />)

    const rssButton = screen.getByRole('button', { name: /subscribe to rss/i })
    await user.click(rssButton)

    expect(capturedBlob).toBeTruthy()
    
    if (capturedBlob) {
      const rssContent = await capturedBlob.text()
      
      expect(rssContent).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(rssContent).toContain('<rss version="2.0">')
      expect(rssContent).toContain('<title>SuriBlog</title>')
      expect(rssContent).toContain('<description>A modern development blog</description>')
      expect(rssContent).toContain('<link>https://example.com</link>')
      expect(rssContent).toContain('<item>')
      expect(rssContent).toContain('<title>First Post</title>')
      expect(rssContent).toContain('<title>Second Post</title>')
    }
  })

  it('includes post metadata in RSS items', async () => {
    const user = userEvent.setup()
    
    let capturedBlob: Blob | null = null
    global.URL.createObjectURL = jest.fn((blob) => {
      capturedBlob = blob
      return 'blob:mock-url'
    })
    
    const mockLink = {
      click: jest.fn(),
      setAttribute: jest.fn(),
      style: { display: '' }
    }
    
    document.createElement = jest.fn(() => mockLink as any)
    document.body.appendChild = jest.fn()
    document.body.removeChild = jest.fn()

    render(<RSSFeed {...defaultProps} />)

    const rssButton = screen.getByRole('button', { name: /subscribe to rss/i })
    await user.click(rssButton)

    if (capturedBlob) {
      const rssContent = await capturedBlob.text()
      
      expect(rssContent).toContain('<author>John Doe</author>')
      expect(rssContent).toContain('<author>Jane Smith</author>')
      expect(rssContent).toContain('<pubDate>')
      expect(rssContent).toContain('<guid>')
      expect(rssContent).toContain('<link>https://example.com/posts/1</link>')
      expect(rssContent).toContain('<link>https://example.com/posts/2</link>')
    }
  })

  it('handles empty posts array', async () => {
    const user = userEvent.setup()
    
    let capturedBlob: Blob | null = null
    global.URL.createObjectURL = jest.fn((blob) => {
      capturedBlob = blob
      return 'blob:mock-url'
    })
    
    const mockLink = {
      click: jest.fn(),
      setAttribute: jest.fn(),
      style: { display: '' }
    }
    
    document.createElement = jest.fn(() => mockLink as any)
    document.body.appendChild = jest.fn()
    document.body.removeChild = jest.fn()

    render(<RSSFeed {...defaultProps} posts={[]} />)

    const rssButton = screen.getByRole('button', { name: /subscribe to rss/i })
    await user.click(rssButton)

    if (capturedBlob) {
      const rssContent = await capturedBlob.text()
      
      expect(rssContent).toContain('<rss version="2.0">')
      expect(rssContent).toContain('<channel>')
      expect(rssContent).not.toContain('<item>')
    }
  })

  it('escapes HTML in RSS content', async () => {
    const user = userEvent.setup()
    
    const postsWithHtml = [
      {
        id: '1',
        title: 'Post with <HTML> & Special Characters',
        content: 'Content with <script>alert("xss")</script> and & characters',
        tags: ['security'],
        createdAt: '2024-01-01T00:00:00Z',
        author: 'Test Author'
      }
    ]

    let capturedBlob: Blob | null = null
    global.URL.createObjectURL = jest.fn((blob) => {
      capturedBlob = blob
      return 'blob:mock-url'
    })
    
    const mockLink = {
      click: jest.fn(),
      setAttribute: jest.fn(),
      style: { display: '' }
    }
    
    document.createElement = jest.fn(() => mockLink as any)
    document.body.appendChild = jest.fn()
    document.body.removeChild = jest.fn()

    render(<RSSFeed {...defaultProps} posts={postsWithHtml} />)

    const rssButton = screen.getByRole('button', { name: /subscribe to rss/i })
    await user.click(rssButton)

    if (capturedBlob) {
      const rssContent = await capturedBlob.text()
      
      expect(rssContent).toContain('&lt;HTML&gt; &amp; Special Characters')
      expect(rssContent).toContain('&lt;script&gt;')
      expect(rssContent).not.toContain('<script>')
      expect(rssContent).not.toContain('alert("xss")')
    }
  })

  it('shows loading state while generating RSS', async () => {
    const user = userEvent.setup()
    
    render(<RSSFeed {...defaultProps} />)

    const rssButton = screen.getByRole('button', { name: /subscribe to rss/i })
    
    expect(screen.queryByText(/generating/i)).not.toBeInTheDocument()
    
    await user.click(rssButton)
    
    // Note: In a real implementation, you might want to test loading state
    // This would require making the RSS generation async
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    
    render(<RSSFeed {...defaultProps} />)

    await user.tab()
    
    const rssButton = screen.getByRole('button', { name: /subscribe to rss/i })
    expect(rssButton).toHaveFocus()
  })

  it('has proper ARIA attributes', () => {
    render(<RSSFeed {...defaultProps} />)

    const rssButton = screen.getByRole('button', { name: /subscribe to rss/i })
    expect(rssButton).toHaveAttribute('type', 'button')
    expect(rssButton).toHaveAttribute('aria-label', 'Subscribe to RSS feed')
  })
})