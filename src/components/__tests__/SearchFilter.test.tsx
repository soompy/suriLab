import { act, render, screen, waitFor } from '@testing-library/react'
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
      author: 'John Doe',
    },
    {
      id: '2',
      title: 'Python for Beginners',
      content: 'Introduction to Python programming language',
      tags: ['python', 'beginner', 'programming'],
      createdAt: '2024-01-02',
      author: 'Jane Smith',
    },
    {
      id: '3',
      title: 'Advanced JavaScript',
      content: 'Deep dive into JavaScript concepts and patterns',
      tags: ['javascript', 'advanced', 'patterns'],
      createdAt: '2024-01-03',
      author: 'Bob Wilson',
    },
  ]
  const newestPosts = [mockPosts[2], mockPosts[1], mockPosts[0]]

  const mockOnFilter = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  function renderSearchFilter() {
    render(<SearchFilter posts={mockPosts} onFilter={mockOnFilter} />)
    mockOnFilter.mockClear()
  }

  it('renders search input and filter options', () => {
    renderSearchFilter()

    expect(screen.getByRole('textbox', { name: /search posts/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /filter by tag/i })).toHaveDisplayValue('All Tags')
    expect(screen.getByRole('combobox', { name: /sort posts/i })).toHaveDisplayValue('Sort by: Newest First')
  })

  it('filters posts by search term after debounce', async () => {
    const user = userEvent.setup()
    renderSearchFilter()

    await user.type(screen.getByRole('textbox', { name: /search posts/i }), 'React')

    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith([mockPosts[0]])
    })
  })

  it('filters posts by tag', async () => {
    const user = userEvent.setup()
    renderSearchFilter()

    await user.selectOptions(screen.getByRole('combobox', { name: /filter by tag/i }), 'python')

    expect(mockOnFilter).toHaveBeenCalledWith([mockPosts[1]])
  })

  it('filters posts by both search term and tag using current sort order', async () => {
    const user = userEvent.setup()
    renderSearchFilter()

    await user.type(screen.getByRole('textbox', { name: /search posts/i }), 'JavaScript')
    await user.selectOptions(screen.getByRole('combobox', { name: /filter by tag/i }), 'javascript')

    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith([mockPosts[2], mockPosts[0]])
    })
  })

  it('sorts posts by date newest first by default', () => {
    render(<SearchFilter posts={mockPosts} onFilter={mockOnFilter} />)

    expect(mockOnFilter).toHaveBeenCalledWith(newestPosts)
  })

  it('sorts posts by date oldest first', async () => {
    const user = userEvent.setup()
    renderSearchFilter()

    await user.selectOptions(screen.getByRole('combobox', { name: /sort posts/i }), 'oldest')

    expect(mockOnFilter).toHaveBeenCalledWith([mockPosts[0], mockPosts[1], mockPosts[2]])
  })

  it('sorts posts alphabetically', async () => {
    const user = userEvent.setup()
    renderSearchFilter()

    await user.selectOptions(screen.getByRole('combobox', { name: /sort posts/i }), 'alphabetical')

    expect(mockOnFilter).toHaveBeenCalledWith([mockPosts[2], mockPosts[1], mockPosts[0]])
  })

  it('returns empty results when no posts match', async () => {
    const user = userEvent.setup()
    renderSearchFilter()

    await user.type(screen.getByRole('textbox', { name: /search posts/i }), 'nonexistent')

    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith([])
    })
  })

  it('clears active filters and restores default sort order', async () => {
    const user = userEvent.setup()
    renderSearchFilter()

    const searchInput = screen.getByRole('textbox', { name: /search posts/i })
    await user.type(searchInput, 'React')

    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith([mockPosts[0]])
    })

    mockOnFilter.mockClear()
    await user.click(screen.getByRole('button', { name: /clear search/i }))

    expect(searchInput).toHaveValue('')
    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith(newestPosts)
    })
  })

  it('debounces search input', async () => {
    jest.useFakeTimers()
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    renderSearchFilter()

    await user.type(screen.getByRole('textbox', { name: /search posts/i }), 'React')

    expect(mockOnFilter).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(300)
    })

    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith([mockPosts[0]])
    })

    jest.useRealTimers()
  })

  it('shows available tags in dropdown', () => {
    renderSearchFilter()

    expect(screen.getByRole('option', { name: 'All Tags' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'react' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'javascript' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'python' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'hooks' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'beginner' })).toBeInTheDocument()
  })

  it('handles empty posts array', () => {
    render(<SearchFilter posts={[]} onFilter={mockOnFilter} />)

    expect(screen.getByRole('textbox', { name: /search posts/i })).toBeInTheDocument()
    expect(mockOnFilter).toHaveBeenCalledWith([])
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    renderSearchFilter()

    await user.tab()
    expect(screen.getByRole('textbox', { name: /search posts/i })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('combobox', { name: /filter by tag/i })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('combobox', { name: /sort posts/i })).toHaveFocus()
  })
})
