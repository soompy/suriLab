import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MuiThemeProvider from '@/components/MuiThemeProvider'
import { CustomThemeProvider } from '@/components/ThemeContext'

type RenderWithProvidersOptions = RenderOptions & {
  route?: string
  searchParams?: URLSearchParams
}

function setTestRoute(route = '/', searchParams = new URLSearchParams()) {
  const navigationMocks = globalThis.__NEXT_NAVIGATION_MOCKS__

  if (navigationMocks) {
    navigationMocks.pathname = route
    navigationMocks.searchParams = searchParams
  }
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: RenderWithProvidersOptions = {}
) {
  const { route, searchParams, ...renderOptions } = options
  setTestRoute(route, searchParams)

  const user = userEvent.setup()

  return {
    user,
    ...render(ui, {
      wrapper: ({ children }) => (
        <CustomThemeProvider>
          <MuiThemeProvider>{children}</MuiThemeProvider>
        </CustomThemeProvider>
      ),
      ...renderOptions,
    }),
  }
}

export * from '@testing-library/react'
export { userEvent }
