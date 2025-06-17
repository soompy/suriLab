import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchFilter from '../SearchFilter'

describe('SearchFilter', () => {
  const mockPosts = [
    {
      id: '1',
      title: 'React Hooks Guide',
      content: 'Learn about React hooks and state management',
      tags: ['react', 'javascript', 'hooks'],
      createdAt: '2024-01-01',
      author: 'John Doe'
    },
    {
      id: '2',
      title: 'Python for Beginners',
      content: 'Introduction to Python programming language',
      tags: ['python', 'beginner', 'programming'],
      createdAt: '2024-01-02',
      author: 'Jane Smith'
    },
    {
      id: '3',
      title: 'Advanced JavaScript',
      content: 'Deep dive into JavaScript concepts and patterns',
      tags: ['javascript', 'advanced', 'patterns'],
      createdAt: '2024-01-03',
      author: 'Bob Wilson'
    }
  ]

  const mockOnFilter = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders search input and filter options', () => {
    render(<SearchFilter posts={mockPosts} onFilter={mockOnFilter} />)

    expect(screen.getByPlaceholderText(/search posts/i)).toBeInTheDocument()
    expect(screen.getByText(/all tags/i)).toBeInTheDocument()
    expect(screen.getByText(/sort by/i)).toBeInTheDocument()
  })

  it('filters posts by search term', async () => {
    const user = userEvent.setup()
    
    render(<SearchFilter posts={mockPosts} onFilter={mockOnFilter} />)

    const searchInput = screen.getByPlaceholderText(/search posts/i)
    await user.type(searchInput, 'React')

    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith([mockPosts[0]])
    })
  })

  it('filters posts by tag', async () => {
    const user = userEvent.setup()
    
    render(<SearchFilter posts={mockPosts} onFilter={mockOnFilter} />)

    const tagSelect = screen.getByDisplayValue(/all tags/i)
    await user.selectOptions(tagSelect, 'python')

    expect(mockOnFilter).toHaveBeenCalledWith([mockPosts[1]])
  })

  it('filters posts by both search term and tag', async () => {
    const user = userEvent.setup()
    
    render(<SearchFilter posts={mockPosts} onFilter={mockOnFilter} />)

    const searchInput = screen.getByPlaceholderText(/search posts/i)
    const tagSelect = screen.getByDisplayValue(/all tags/i)

    await user.type(searchInput, 'JavaScript')
    await user.selectOptions(tagSelect, 'javascript')

    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith([mockPosts[0], mockPosts[2]])
    })
  })

  it('sorts posts by date (newest first)', async () => {
    const user = userEvent.setup()
    
    render(<SearchFilter posts={mockPosts} onFilter={mockOnFilter} />)

    const sortSelect = screen.getByDisplayValue(/newest first/i)
    await user.selectOptions(sortSelect, 'newest')

    expect(mockOnFilter).toHaveBeenCalledWith([
      mockPosts[2], // 2024-01-03
      mockPosts[1], // 2024-01-02
      mockPosts[0]  // 2024-01-01
    ])
  })

  it('sorts posts by date (oldest first)', async () => {
    const user = userEvent.setup()
    
    render(<SearchFilter posts={mockPosts} onFilter={mockOnFilter} />)

    const sortSelect = screen.getByDisplayValue(/newest first/i)
    await user.selectOptions(sortSelect, 'oldest')

    expect(mockOnFilter).toHaveBeenCalledWith([
      mockPosts[0], // 2024-01-01
      mockPosts[1], // 2024-01-02
      mockPosts[2]  // 2024-01-03
    ])
  })

  it('sorts posts alphabetically', async () => {
    const user = userEvent.setup()
    
    render(<SearchFilter posts={mockPosts} onFilter={mockOnFilter} />)

    const sortSelect = screen.getByDisplayValue(/newest first/i)
    await user.selectOptions(sortSelect, 'alphabetical')

    expect(mockOnFilter).toHaveBeenCalledWith([
      mockPosts[2], // Advanced JavaScript
      mockPosts[1], // Python for Beginners
      mockPosts[0]  // React Hooks Guide
    ])
  })

  it('shows "no results" message when no posts match', async () => {
    const user = userEvent.setup()
    
    render(<SearchFilter posts={mockPosts} onFilter={mockOnFilter} />)

    const searchInput = screen.getByPlaceholderText(/search posts/i)
    await user.type(searchInput, 'nonexistent')

    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith([])
    })
  })

  it('clears search when clear button is clicked', async () => {
    const user = userEvent.setup()
    
    render(<SearchFilter posts={mockPosts} onFilter={mockOnFilter} />)

    const searchInput = screen.getByPlaceholderText(/search posts/i)
    await user.type(searchInput, 'React')

    const clearButton = screen.getByRole('button', { name: /clear search/i })
    await user.click(clearButton)

    expect(searchInput).toHaveValue('')
    expect(mockOnFilter).toHaveBeenCalledWith(mockPosts)
  })

  it('debounces search input', async () => {
    jest.useFakeTimers()
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    
    render(<SearchFilter posts={mockPosts} onFilter={mockOnFilter} />)

    const searchInput = screen.getByPlaceholderText(/search posts/i)
    
    await user.type(searchInput, 'R')
    await user.type(searchInput, 'e')
    await user.type(searchInput, 'a')
    await user.type(searchInput, 'c')
    await user.type(searchInput, 't')

    expect(mockOnFilter).not.toHaveBeenCalled()

    jest.advanceTimersByTime(300)

    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith([mockPosts[0]])
    })

    jest.useRealTimers()
  })

  it('shows available tags in dropdown', () => {
    render(<SearchFilter posts={mockPosts} onFilter={mockOnFilter} />)
    
    expect(screen.getByText('All Tags')).toBeInTheDocument()
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('javascript')).toBeInTheDocument()
    expect(screen.getByText('python')).toBeInTheDocument()
    expect(screen.getByText('hooks')).toBeInTheDocument()
    expect(screen.getByText('beginner')).toBeInTheDocument()
  })

  it('handles empty posts array', () => {
    render(<SearchFilter posts={[]} onFilter={mockOnFilter} />)

    expect(screen.getByPlaceholderText(/search posts/i)).toBeInTheDocument()
    expect(mockOnFilter).toHaveBeenCalledWith([])
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    
    render(<SearchFilter posts={mockPosts} onFilter={mockOnFilter} />)

    await user.tab() // Search input
    expect(screen.getByPlaceholderText(/search posts/i)).toHaveFocus()

    await user.tab() // Tag select
    expect(screen.getByDisplayValue(/all tags/i)).toHaveFocus()

    await user.tab() // Sort select
    expect(screen.getByDisplayValue(/newest first/i)).toHaveFocus()
  })
})