import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CustomThemeProvider, useTheme } from '../ThemeContext'

const TestComponent = () => {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <div>
      <div data-testid="theme-indicator">
        {isDarkMode ? 'dark' : 'light'}
      </div>
      <button onClick={toggleTheme} type="button">
        Toggle
      </button>
    </div>
  )
}

describe('CustomThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.mocked(window.matchMedia).mockReturnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })
  })

  it('provides light theme by default when no preference exists', async () => {
    render(
      <CustomThemeProvider>
        <TestComponent />
      </CustomThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('theme-indicator')).toHaveTextContent('light')
    })
  })

  it('toggles theme through context', async () => {
    const user = userEvent.setup()

    render(
      <CustomThemeProvider>
        <TestComponent />
      </CustomThemeProvider>
    )

    await user.click(screen.getByRole('button', { name: /toggle/i }))

    expect(screen.getByTestId('theme-indicator')).toHaveTextContent('dark')

    await user.click(screen.getByRole('button', { name: /toggle/i }))

    expect(screen.getByTestId('theme-indicator')).toHaveTextContent('light')
  })

  it('persists theme preference in localStorage', async () => {
    const user = userEvent.setup()

    render(
      <CustomThemeProvider>
        <TestComponent />
      </CustomThemeProvider>
    )

    await user.click(screen.getByRole('button', { name: /toggle/i }))

    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('loads saved theme from localStorage', async () => {
    localStorage.setItem('theme', 'dark')

    render(
      <CustomThemeProvider>
        <TestComponent />
      </CustomThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('theme-indicator')).toHaveTextContent('dark')
    })
  })

  it('uses system preference when no saved theme exists', async () => {
    jest.mocked(window.matchMedia).mockReturnValue({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })

    render(
      <CustomThemeProvider>
        <TestComponent />
      </CustomThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('theme-indicator')).toHaveTextContent('dark')
    })
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
  })

  it('throws when useTheme is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<TestComponent />)).toThrow('useTheme must be used within a ThemeProvider')

    consoleError.mockRestore()
  })
})
