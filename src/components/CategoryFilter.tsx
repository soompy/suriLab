'use client'

import { useState } from 'react'

interface Category {
  id: string
  name: string
  count: number
  color?: string
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string
  onCategorySelect: (categoryId: string) => void
  className?: string
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategorySelect,
  className = ''
}: CategoryFilterProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 16a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2h8z" />
          </svg>
          카테고리
        </h3>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg
            className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Category List */}
      <div className={`space-y-2 ${isCollapsed ? 'hidden md:block' : ''}`}>
        {/* All Categories */}
        <button
          onClick={() => onCategorySelect('all')}
          className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
            selectedCategory === 'all'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-l-4 border-blue-500'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            전체
          </span>
          <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
            {categories.reduce((sum, cat) => sum + cat.count, 0)}
          </span>
        </button>

        {/* Individual Categories */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
              selectedCategory === category.id
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-l-4 border-blue-500'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <div 
                className={`w-3 h-3 rounded-full ${category.color || 'bg-gray-400'}`}
              />
              {category.name}
            </span>
            <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
              {category.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}