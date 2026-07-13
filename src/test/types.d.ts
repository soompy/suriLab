declare global {
  var __NEXT_NAVIGATION_MOCKS__: {
    push: (...args: unknown[]) => unknown
    replace: (...args: unknown[]) => unknown
    refresh: (...args: unknown[]) => unknown
    back: (...args: unknown[]) => unknown
    forward: (...args: unknown[]) => unknown
    prefetch: (...args: unknown[]) => unknown
    pathname: string
    searchParams: URLSearchParams
  } | undefined
}

export {}
