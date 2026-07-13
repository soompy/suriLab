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
    author: 'Test Author',
  }

  it('renders post title and markdown content', () => {
    render(<PostViewer post={mockPost} />)

    expect(screen.getByRole('heading', { name: 'Test Post' })).toBeInTheDocument()
    expect(screen.getByTestId('markdown-preview')).toHaveTextContent('# Hello World')
    expect(screen.getByTestId('markdown-preview')).toHaveTextContent('This is a test post')
  })

  it('renders post metadata', () => {
    render(<PostViewer post={mockPost} />)

    expect(screen.getByText(/By\s+Test Author/)).toBeInTheDocument()
    expect(screen.getByText('2024-01-01')).toBeInTheDocument()
  })

  it('renders tags', () => {
    render(<PostViewer post={mockPost} />)

    expect(screen.getByText('javascript')).toBeInTheDocument()
    expect(screen.getByText('python')).toBeInTheDocument()
  })

  it('passes fenced JavaScript code to the markdown renderer', () => {
    render(<PostViewer post={mockPost} />)

    expect(screen.getByTestId('markdown-preview')).toHaveTextContent('```javascript')
    expect(screen.getByTestId('markdown-preview')).toHaveTextContent('function hello')
  })

  it('passes fenced Python code to the markdown renderer', () => {
    render(<PostViewer post={mockPost} />)

    expect(screen.getByTestId('markdown-preview')).toHaveTextContent('```python')
    expect(screen.getByTestId('markdown-preview')).toHaveTextContent('def hello')
  })

  it('passes fenced CSS code to the markdown renderer', () => {
    render(<PostViewer post={mockPost} />)

    expect(screen.getByTestId('markdown-preview')).toHaveTextContent('```css')
    expect(screen.getByTestId('markdown-preview')).toHaveTextContent('.button')
  })

  it('renders inline code content through the markdown renderer', () => {
    render(
      <PostViewer
        post={{
          ...mockPost,
          content: 'Use `console.log()` for debugging.',
        }}
      />
    )

    expect(screen.getByTestId('markdown-preview')).toHaveTextContent('Use `console.log()` for debugging.')
  })

  it('marks article as dark mode when requested', () => {
    const { container } = render(<PostViewer post={mockPost} isDarkMode />)

    expect(container.querySelector('article')).toHaveClass('dark')
  })

  it('shows reading time estimate', () => {
    render(<PostViewer post={mockPost} />)

    expect(screen.getByText(/\d+ min read/)).toBeInTheDocument()
  })

  it('handles empty content gracefully', () => {
    render(<PostViewer post={{ ...mockPost, content: '' }} />)

    expect(screen.getByRole('heading', { name: 'Test Post' })).toBeInTheDocument()
    expect(screen.getByTestId('markdown-preview')).toHaveTextContent('')
  })

  it('handles posts without tags', () => {
    render(<PostViewer post={{ ...mockPost, tags: [] }} />)

    expect(screen.getByRole('heading', { name: 'Test Post' })).toBeInTheDocument()
    expect(screen.queryByTestId('post-tags')).not.toBeInTheDocument()
  })
})
