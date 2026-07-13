import '@testing-library/jest-dom'
import React from 'react'
import { TextDecoder, TextEncoder } from 'util'

Object.assign(global, { TextDecoder, TextEncoder })

// MUI and responsive components read matchMedia during render.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Components using element measurement should not fail in jsdom.
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Header and sticky navigation behavior can register intersection observers.
global.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

// RSSFeed downloads generated XML through object URLs.
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
global.URL.revokeObjectURL = jest.fn()

// Table of contents and keyboard flows can call scroll APIs.
window.scrollTo = jest.fn()
Element.prototype.scrollIntoView = jest.fn()

const navigationMocks = {
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn(),
  pathname: '/',
  searchParams: new URLSearchParams(),
}

global.__NEXT_NAVIGATION_MOCKS__ = navigationMocks

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: navigationMocks.push,
    replace: navigationMocks.replace,
    refresh: navigationMocks.refresh,
    back: navigationMocks.back,
    forward: navigationMocks.forward,
    prefetch: navigationMocks.prefetch,
  }),
  usePathname: () => navigationMocks.pathname,
  useSearchParams: () => navigationMocks.searchParams,
  redirect: jest.fn((url) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, ...props }) => {
    return React.createElement('img', { alt: alt || '', ...props })
  },
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }) => {
    return React.createElement(
      'a',
      { href: typeof href === 'string' ? href : href?.pathname || '#', ...props },
      children
    )
  },
}))

beforeEach(() => {
  navigationMocks.push.mockClear()
  navigationMocks.replace.mockClear()
  navigationMocks.refresh.mockClear()
  navigationMocks.back.mockClear()
  navigationMocks.forward.mockClear()
  navigationMocks.prefetch.mockClear()
  navigationMocks.pathname = '/'
  navigationMocks.searchParams = new URLSearchParams()
})
