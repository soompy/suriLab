import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MarkdownEditor from '../MarkdownEditor'

describe('MarkdownEditor', () => {
  const mockOnSave = jest.fn()
  const mockOnContentChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders markdown editor with textarea and preview', () => {
    render(
      <MarkdownEditor
        content=""
        onSave={mockOnSave}
        onContentChange={mockOnContentChange}
      />
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByText('Preview')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('allows user to input markdown content', async () => {
    const user = userEvent.setup()
    
    render(
      <MarkdownEditor
        content=""
        onSave={mockOnSave}
        onContentChange={mockOnContentChange}
      />
    )

    const textarea = screen.getByRole('textbox')
    await user.type(textarea, '# Hello World')

    expect(mockOnContentChange).toHaveBeenCalledWith('# Hello World')
  })

  it('renders markdown preview correctly', () => {
    render(
      <MarkdownEditor
        content="# Hello World\n\nThis is **bold** text."
        onSave={mockOnSave}
        onContentChange={mockOnContentChange}
      />
    )

    const previewButton = screen.getByText('Preview')
    fireEvent.click(previewButton)

    expect(screen.getByTestId('markdown-preview')).toBeInTheDocument()
  })

  it('calls onSave when save button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <MarkdownEditor
        content="# Test Content"
        onSave={mockOnSave}
        onContentChange={mockOnContentChange}
      />
    )

    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)

    expect(mockOnSave).toHaveBeenCalledWith('# Test Content')
  })

  it('supports keyboard shortcuts for save (Ctrl+S)', async () => {
    const user = userEvent.setup()
    
    render(
      <MarkdownEditor
        content="# Test Content"
        onSave={mockOnSave}
        onContentChange={mockOnContentChange}
      />
    )

    const textarea = screen.getByRole('textbox')
    await user.click(textarea)
    await user.keyboard('{Control>}s{/Control}')

    expect(mockOnSave).toHaveBeenCalledWith('# Test Content')
  })

  it('toggles between edit and preview modes', async () => {
    const user = userEvent.setup()
    
    render(
      <MarkdownEditor
        content="# Hello World"
        onSave={mockOnSave}
        onContentChange={mockOnContentChange}
      />
    )

    const previewButton = screen.getByText('Preview')
    await user.click(previewButton)

    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('auto-saves content after delay', async () => {
    jest.useFakeTimers()
    
    render(
      <MarkdownEditor
        content=""
        onSave={mockOnSave}
        onContentChange={mockOnContentChange}
        autoSave={true}
        autoSaveDelay={1000}
      />
    )

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'New content' } })

    jest.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith('New content')
    })

    jest.useRealTimers()
  })
})