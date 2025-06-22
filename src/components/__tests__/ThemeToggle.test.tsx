import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggleButton from '../ThemeToggleButton'

describe('ThemeToggle', () => {
  const mockOnThemeChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('renders toggle button with sun icon for light mode', () => {
    render(<ThemeToggleButton isDarkMode={false} onThemeChange={mockOnThemeChange} />)

    const button = screen.getByRole('button', { name: /toggle dark mode/i })
    expect(button).toBeInTheDocument()
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
  })

  it('renders toggle button with moon icon for dark mode', () => {
    render(<ThemeToggleButton isDarkMode={true} onThemeChange={mockOnThemeChange} />)

    const button = screen.getByRole('button', { name: /toggle light mode/i })
    expect(button).toBeInTheDocument()
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
  })

  it('calls onThemeChange when clicked', async () => {
    const user = userEvent.setup()
    
    render(<ThemeToggleButton isDarkMode={false} onThemeChange={mockOnThemeChange} />)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(mockOnThemeChange).toHaveBeenCalledWith(true)
  })

  it('toggles from dark to light mode', async () => {
    const user = userEvent.setup()
    
    render(<ThemeToggleButton isDarkMode={true} onThemeChange={mockOnThemeChange} />)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(mockOnThemeChange).toHaveBeenCalledWith(false)
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    
    render(<ThemeToggleButton isDarkMode={false} onThemeChange={mockOnThemeChange} />)

    const button = screen.getByRole('button')
    await user.tab()
    expect(button).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(mockOnThemeChange).toHaveBeenCalledWith(true)
  })

  it('supports space key activation', async () => {
    const user = userEvent.setup()
    
    render(<ThemeToggleButton isDarkMode={false} onThemeChange={mockOnThemeChange} />)

    const button = screen.getByRole('button')
    button.focus()

    await user.keyboard(' ')
    expect(mockOnThemeChange).toHaveBeenCalledWith(true)
  })

  it('has proper ARIA attributes', () => {
    render(<ThemeToggleButton isDarkMode={false} onThemeChange={mockOnThemeChange} />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Toggle dark mode')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('updates ARIA label based on current mode', () => {
    const { rerender } = render(
      <ThemeToggleButton isDarkMode={false} onThemeChange={mockOnThemeChange} />
    )

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Toggle dark mode')

    rerender(<ThemeToggleButton isDarkMode={true} onThemeChange={mockOnThemeChange} />)

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Toggle light mode')
  })

  it('applies correct styling for light mode', () => {
    render(<ThemeToggleButton isDarkMode={false} onThemeChange={mockOnThemeChange} />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gray-200')
    expect(button).not.toHaveClass('bg-gray-700')
  })

  it('applies correct styling for dark mode', () => {
    render(<ThemeToggleButton isDarkMode={true} onThemeChange={mockOnThemeChange} />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gray-700')
    expect(button).not.toHaveClass('bg-gray-200')
  })

  it('has smooth transition animation', () => {
    render(<ThemeToggleButton isDarkMode={false} onThemeChange={mockOnThemeChange} />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('transition-colors')
  })
})