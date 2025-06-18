'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggleWrapper from './ThemeToggleWrapper'

export default function Header() {
  const pathname = usePathname()

  const menuItems = [
    { href: '/', label: 'Posts' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/contact', label: 'Contact' },
    { href: '/archives', label: 'Archives' },
    { href: '/write', label: 'Write' }
  ]

  return (
      <header className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
          <div className="flex items-center justify-between max-w-[1400px] mx-auto">
              <div className="flex items-center h-[60px] px-4 md:px-6">
                  {/* Logo */}
                  <Link href="/" className="flex items-center mr-8">
                      <div className="text-xl font-bold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                          SuriBlog
                      </div>
                  </Link>

                  {/* Navigation - PC에서 왼쪽 정렬 */}
                  <nav className="hidden md:flex items-center flex-1">
                      <div className="flex items-center space-x-1">
                          {menuItems.map((item) => (
                              <Link
                                  key={item.href}
                                  href={item.href}
                                  className={`relative px-4 py-2 text-[15px] font-medium transition-all duration-200 hover:scale-105 rounded-lg ${
                                      pathname === item.href
                                          ? "text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800"
                                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                                  }`}
                              >
                                  {item.label}
                                  {pathname === item.href && (
                                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-900 dark:bg-white rounded-full" />
                                  )}
                              </Link>
                          ))}
                      </div>
                  </nav>

                  {/* Theme Toggle - PC에서 오른쪽 정렬 */}
                  <div className="hidden md:flex items-center ml-auto">
                      <ThemeToggleWrapper />
                  </div>

                  {/* Mobile Menu Button */}
                  <div className="md:hidden flex items-center gap-3 ml-auto">
                      <ThemeToggleWrapper />
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                          <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                          >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 6h16M4 12h16M4 18h16"
                              />
                          </svg>
                      </button>
                  </div>
              </div>

              {/* Mobile Navigation */}
              <div className="md:hidden dark:border-gray-800 bg-white dark:bg-gray-950">
                  <nav className="flex px-4 py-2">
                      {menuItems.map((item) => (
                          <Link
                              key={item.href}
                              href={item.href}
                              className={`block px-3 py-3 text-[15px] font-medium rounded-lg transition-colors ${
                                  pathname === item.href
                                      ? "text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800"
                                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                              }`}
                          >
                              {item.label}
                          </Link>
                      ))}
                  </nav>
              </div>
          </div>
      </header>
  );
}