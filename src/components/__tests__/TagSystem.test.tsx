import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TagSystem from '../TagSystem'

describe('TagSystem', () => {
  const mockOnTagsChange = jest.fn()
  const existingTags = ['react', 'javascript', 'typescript']

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders tag input and existing tags', () => {
    render(
      <TagSystem
        tags={[]}
        onTagsChange={mockOnTagsChange}
      />
    )

    expect(screen.getByPlaceholderText(/add tags/i)).toBeInTheDocument()
  })

  it('renders existing tags', () => {
    render(
      <TagSystem
        tags={existingTags}
        onTagsChange={mockOnTagsChange}
      />
    )

    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('javascript')).toBeInTheDocument()
    expect(screen.getByText('typescript')).toBeInTheDocument()
  })

  it('adds new tag when Enter is pressed', async () => {
    const user = userEvent.setup()
    
    render(
      <TagSystem
        tags={[]}
        onTagsChange={mockOnTagsChange}
      />
    )

    const input = screen.getByRole('textbox')
    await user.type(input, 'new-tag')
    await user.keyboard('{Enter}')

    expect(mockOnTagsChange).toHaveBeenCalledWith(['new-tag'])
  })

  it('adds new tag when comma is pressed', async () => {
    const user = userEvent.setup()
    
    render(
      <TagSystem
        tags={['existing']}
        onTagsChange={mockOnTagsChange}
      />
    )

    const input = screen.getByRole('textbox')
    await user.type(input, 'new-tag,')

    expect(mockOnTagsChange).toHaveBeenCalledWith(['existing', 'new-tag'])
  })

  it('removes tag when delete button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <TagSystem
        tags={existingTags}
        onTagsChange={mockOnTagsChange}
      />
    )

    const deleteButton = screen.getAllByLabelText(/remove tag/i)[0]
    await user.click(deleteButton)

    expect(mockOnTagsChange).toHaveBeenCalledWith(['javascript', 'typescript'])
  })

  it('prevents duplicate tags', async () => {
    const user = userEvent.setup()
    
    render(
      <TagSystem
        tags={['react']}
        onTagsChange={mockOnTagsChange}
      />
    )

    const input = screen.getByRole('textbox')
    await user.type(input, 'react')
    await user.keyboard('{Enter}')

    expect(mockOnTagsChange).not.toHaveBeenCalled()
  })

  it('trims whitespace from tags', async () => {
    const user = userEvent.setup()
    
    render(
      <TagSystem
        tags={[]}
        onTagsChange={mockOnTagsChange}
      />
    )

    const input = screen.getByRole('textbox')
    await user.type(input, '  spaced-tag  ')
    await user.keyboard('{Enter}')

    expect(mockOnTagsChange).toHaveBeenCalledWith(['spaced-tag'])
  })

  it('ignores empty tags', async () => {
    const user = userEvent.setup()
    
    render(
      <TagSystem
        tags={[]}
        onTagsChange={mockOnTagsChange}
      />
    )

    const input = screen.getByRole('textbox')
    await user.type(input, '   ')
    await user.keyboard('{Enter}')

    expect(mockOnTagsChange).not.toHaveBeenCalled()
  })

  it('shows tag suggestions when typing', async () => {
    const user = userEvent.setup()
    const suggestions = ['react-native', 'react-router', 'redux']
    
    render(
      <TagSystem
        tags={[]}
        onTagsChange={mockOnTagsChange}
        suggestions={suggestions}
      />
    )

    const input = screen.getByRole('textbox')
    await user.click(input)
    await user.type(input, 'react')

    await waitFor(() => {
      expect(screen.getByText('react-native')).toBeInTheDocument()
      expect(screen.getByText('react-router')).toBeInTheDocument()
    })
  })

  it('selects suggestion when clicked', async () => {
    const user = userEvent.setup()
    const suggestions = ['react-native', 'react-router']
    
    render(
      <TagSystem
        tags={[]}
        onTagsChange={mockOnTagsChange}
        suggestions={suggestions}
      />
    )

    const input = screen.getByRole('textbox')
    await user.click(input)
    await user.type(input, 'react')

    await waitFor(() => {
      expect(screen.getByText('react-native')).toBeInTheDocument()
    })

    await user.click(screen.getByText('react-native'))

    await waitFor(() => {
      expect(mockOnTagsChange).toHaveBeenCalledWith(['react-native'])
    })
  })

  it('limits maximum number of tags', async () => {
    const user = userEvent.setup()
    const maxTags = 3
    
    render(
      <TagSystem
        tags={['tag1', 'tag2', 'tag3']}
        onTagsChange={mockOnTagsChange}
        maxTags={maxTags}
      />
    )

    expect(screen.getByText(/maximum.*tags/i)).toBeInTheDocument()
    
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('validates tag format', async () => {
    const user = userEvent.setup()
    
    render(
      <TagSystem
        tags={[]}
        onTagsChange={mockOnTagsChange}
        validateTag={(tag) => /^[a-z-]+$/.test(tag)}
      />
    )

    const input = screen.getByRole('textbox')
    
    await user.type(input, 'Invalid_Tag')
    await user.keyboard('{Enter}')

    expect(mockOnTagsChange).not.toHaveBeenCalled()
    expect(screen.getByText(/invalid tag format/i)).toBeInTheDocument()
  })
})