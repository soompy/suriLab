import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RSSFeed from '../RSSFeed'

describe('RSSFeed', () => {
  const mockPosts = [
    {
      id: '1',
      title: 'First Post',
      content: 'This is the first post content.',
      tags: ['react', 'javascript'],
      createdAt: '2024-01-01T00:00:00Z',
      author: 'John Doe',
    },
    {
      id: '2',
      title: 'Second Post',
      content: 'This is the second post content.',
      tags: ['python', 'tutorial'],
      createdAt: '2024-01-02T00:00:00Z',
      author: 'Jane Smith',
    },
  ]

  const defaultProps = {
    posts: mockPosts,
    siteTitle: 'SuriBlog',
    siteDescription: 'A modern development blog',
    siteUrl: 'https://example.com',
  }

  let clickSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  afterEach(() => {
    clickSpy.mockRestore()
  })

  async function downloadAndReadRss(props = defaultProps) {
    let capturedBlob: Blob | null = null
    jest.mocked(URL.createObjectURL).mockImplementation((blob) => {
      capturedBlob = blob
      return 'blob:mock-url'
    })

    const user = userEvent.setup()
    render(<RSSFeed {...props} />)

    await user.click(screen.getByRole('button', { name: /subscribe to rss feed/i }))

    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob))
    expect(clickSpy).toHaveBeenCalled()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    expect(capturedBlob).toBeTruthy()

    if (!capturedBlob) return ''

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result || ''))
      reader.onerror = () => reject(reader.error)
      reader.readAsText(capturedBlob)
    })
  }

  it('renders RSS subscription controls', () => {
    render(<RSSFeed {...defaultProps} />)

    expect(screen.getByRole('heading', { name: /rss feed/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /subscribe to rss feed/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /copy rss url/i })).toBeInTheDocument()
    expect(screen.getByTestId('rss-icon')).toBeInTheDocument()
  })

  it('generates valid RSS XML structure', async () => {
    const rssContent = await downloadAndReadRss()

    expect(rssContent).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(rssContent).toContain('<rss version="2.0"')
    expect(rssContent).toContain('<title>SuriBlog</title>')
    expect(rssContent).toContain('<description>A modern development blog</description>')
    expect(rssContent).toContain('<link>https://example.com</link>')
    expect(rssContent).toContain('<item>')
    expect(rssContent).toContain('<title>First Post</title>')
    expect(rssContent).toContain('<title>Second Post</title>')
  })

  it('includes post metadata in RSS items', async () => {
    const rssContent = await downloadAndReadRss()

    expect(rssContent).toContain('<author>John Doe</author>')
    expect(rssContent).toContain('<author>Jane Smith</author>')
    expect(rssContent).toContain('<pubDate>')
    expect(rssContent).toContain('<guid isPermaLink="true">https://example.com/posts/1</guid>')
    expect(rssContent).toContain('<link>https://example.com/posts/2</link>')
  })

  it('handles empty posts array', async () => {
    const rssContent = await downloadAndReadRss({ ...defaultProps, posts: [] })

    expect(rssContent).toContain('<rss version="2.0"')
    expect(rssContent).toContain('<channel>')
    expect(rssContent).not.toContain('<item>')
  })

  it('escapes XML-sensitive text in RSS fields', async () => {
    const rssContent = await downloadAndReadRss({
      ...defaultProps,
      posts: [
        {
          id: '1',
          title: 'Post with <HTML> & Special Characters',
          content: 'Content with <script>alert("xss")</script> and & characters',
          tags: ['security'],
          createdAt: '2024-01-01T00:00:00Z',
          author: 'Test Author',
        },
      ],
    })

    expect(rssContent).toContain('&lt;HTML&gt; &amp; Special Characters')
    expect(rssContent).toContain('<![CDATA[Content with <script>alert("xss")</script> and & characters]]>')
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<RSSFeed {...defaultProps} />)

    await user.tab()

    expect(screen.getByRole('button', { name: /subscribe to rss feed/i })).toHaveFocus()
  })

  it('has proper button attributes', () => {
    render(<RSSFeed {...defaultProps} />)

    const rssButton = screen.getByRole('button', { name: /subscribe to rss feed/i })
    expect(rssButton).toHaveAttribute('type', 'button')
    expect(rssButton).toHaveAttribute('aria-label', 'Subscribe to RSS feed')
  })
})
