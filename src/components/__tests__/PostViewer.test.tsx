import { render, screen } from '@testing-library/react'
import PostViewer from '../PostViewer'

describe('PostViewer', () => {
  const mockPost = {
    id: '1',
    title: 'Test Post',
    content: `# Hello World

This is a test post with **bold** text.

\`\`\`javascript
function hello() {
  console.log('Hello World')
}
\`\`\`

\`\`\`python
def hello():
    print("Hello World")
\`\`\`

\`\`\`css
.button {
  background: blue;
  color: white;
}
\`\`\``,
    tags: ['javascript', 'python'],
    createdAt: '2024-01-01',
    author: 'Test Author'
  }

  it('renders post title and content', () => {
    render(<PostViewer post={mockPost} />)

    expect(screen.getByText('Test Post')).toBeInTheDocument()
    expect(screen.getByText('Hello World')).toBeInTheDocument()
    expect(screen.getByText(/This is a test post/)).toBeInTheDocument()
  })

  it('renders post metadata', () => {
    render(<PostViewer post={mockPost} />)

    expect(screen.getByText('Test Author')).toBeInTheDocument()
    expect(screen.getByText('2024-01-01')).toBeInTheDocument()
  })

  it('renders tags', () => {
    render(<PostViewer post={mockPost} />)

    expect(screen.getByText('javascript')).toBeInTheDocument()
    expect(screen.getByText('python')).toBeInTheDocument()
  })

  it('highlights JavaScript code blocks', () => {
    render(<PostViewer post={mockPost} />)

    const codeBlock = screen.getByText(/function hello/)
    expect(codeBlock.closest('pre')).toHaveAttribute('data-language', 'javascript')
  })

  it('highlights Python code blocks', () => {
    render(<PostViewer post={mockPost} />)

    const codeBlock = screen.getByText(/def hello/)
    expect(codeBlock.closest('pre')).toHaveAttribute('data-language', 'python')
  })

  it('highlights CSS code blocks', () => {
    render(<PostViewer post={mockPost} />)

    const codeBlock = screen.getByText(/.button/)
    expect(codeBlock.closest('pre')).toHaveAttribute('data-language', 'css')
  })

  it('applies syntax highlighting classes', () => {
    render(<PostViewer post={mockPost} />)

    const codeElements = screen.getAllByRole('code')
    expect(codeElements.length).toBeGreaterThan(0)
    
    const preElements = document.querySelectorAll('pre[data-language]')
    expect(preElements.length).toBe(3)
  })

  it('handles inline code', () => {
    const postWithInlineCode = {
      ...mockPost,
      content: 'Use `console.log()` for debugging.'
    }
    
    render(<PostViewer post={postWithInlineCode} />)

    expect(screen.getByTestId('markdown-preview')).toContainHTML('Use `console.log()` for debugging.')
  })

  it('supports dark mode code highlighting', () => {
    render(<PostViewer post={mockPost} isDarkMode={true} />)

    const preElements = document.querySelectorAll('pre[data-language]')
    preElements.forEach(pre => {
      expect(pre).toHaveClass('dark')
    })
  })

  it('shows reading time estimate', () => {
    render(<PostViewer post={mockPost} />)

    expect(screen.getByText(/\d+ min read/)).toBeInTheDocument()
  })

  it('handles empty content gracefully', () => {
    const emptyPost = {
      ...mockPost,
      content: ''
    }
    
    render(<PostViewer post={emptyPost} />)

    expect(screen.getByText('Test Post')).toBeInTheDocument()
    expect(screen.queryByRole('code')).not.toBeInTheDocument()
  })

  it('handles posts without tags', () => {
    const postWithoutTags = {
      ...mockPost,
      tags: []
    }
    
    render(<PostViewer post={postWithoutTags} />)

    expect(screen.getByText('Test Post')).toBeInTheDocument()
    expect(screen.queryByTestId('post-tags')).not.toBeInTheDocument()
  })
})