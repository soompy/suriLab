import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from '../ThemeProvider'

const TestComponent = () => {
  const { isDarkMode, toggleTheme } = useTheme()
  
  return (
    <div>
      <div data-testid="theme-indicator">
        {isDarkMode ? 'dark' : 'light'}
      </div>
      <button onClick={toggleTheme} data-testid="toggle-button">
        Toggle
      </button>
    </div>
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('provides default light theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme-indicator')).toHaveTextContent('light')
    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('toggles theme when toggle function is called', async () => {
    const user = userEvent.setup()
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    const toggleButton = screen.getByTestId('toggle-button')
    
    await user.click(toggleButton)
    expect(screen.getByTestId('theme-indicator')).toHaveTextContent('dark')
    expect(document.documentElement).toHaveClass('dark')

    await user.click(toggleButton)
    expect(screen.getByTestId('theme-indicator')).toHaveTextContent('light')
    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('persists theme preference in localStorage', async () => {
    const user = userEvent.setup()
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    const toggleButton = screen.getByTestId('toggle-button')
    await user.click(toggleButton)

    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('loads theme from localStorage on initialization', () => {
    localStorage.setItem('theme', 'dark')
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme-indicator')).toHaveTextContent('dark')
    expect(document.documentElement).toHaveClass('dark')
  })

  it('respects system preference when no localStorage value', () => {
    const mockMatchMedia = jest.fn(() => ({
      matches: true,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }))
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    })

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
  })

  it('updates theme when system preference changes', () => {
    let mediaQueryListener: ((e: any) => void) | null = null
    
    const mockMatchMedia = jest.fn(() => ({
      matches: false,
      addListener: jest.fn((fn) => { mediaQueryListener = fn }),
      removeListener: jest.fn(),
    }))
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    })

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme-indicator')).toHaveTextContent('light')

    if (mediaQueryListener) {
      mediaQueryListener({ matches: true })
    }

    expect(screen.getByTestId('theme-indicator')).toHaveTextContent('dark')
  })

  it('throws error when useTheme is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useTheme must be used within a ThemeProvider')

    consoleError.mockRestore()
  })

  it('cleans up media query listener on unmount', () => {
    const removeListener = jest.fn()
    const mockMatchMedia = jest.fn(() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener,
    }))
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    })

    const { unmount } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    unmount()

    expect(removeListener).toHaveBeenCalled()
  })
})