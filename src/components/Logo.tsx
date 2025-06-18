'use client'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className={`flex items-center ${sizeClasses[size]} ${className}`}>
      <span className="text-blue-600 dark:text-blue-400 font-mono font-bold mr-2">
        &gt;_
      </span>
      <span className="text-gray-900 dark:text-white font-bold">
        Suri
      </span>
      <span className="text-gray-600 dark:text-gray-400 font-normal">
        Blog
      </span>
    </div>
  )
}