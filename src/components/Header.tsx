'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'
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
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <Logo size="md" />
          </Link>
          
          <nav className="flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <ThemeToggleWrapper />
          </nav>
        </div>
      </div>
    </header>
  )
}