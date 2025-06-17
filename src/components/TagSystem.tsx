'use client'

import { useState, useRef, useEffect } from 'react'

interface TagSystemProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  suggestions?: string[]
  maxTags?: number
  validateTag?: (tag: string) => boolean
  placeholder?: string
}

export default function TagSystem({
  tags,
  onTagsChange,
  suggestions = [],
  maxTags = 10,
  validateTag,
  placeholder = "Add tags..."
}: TagSystemProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const filterSuggestions = (value: string) => {
    if (!value.trim() || !suggestions.length) {
      setFilteredSuggestions([])
      setShowSuggestions(false)
      return
    }

    const filtered = suggestions.filter(
      suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase()) &&
        !tags.includes(suggestion)
    )

    setFilteredSuggestions(filtered)
    setShowSuggestions(filtered.length > 0)
  }

  const addTag = (tagToAdd: string) => {
    const trimmedTag = tagToAdd.trim()
    setError('')

    if (!trimmedTag) return

    if (tags.includes(trimmedTag)) {
      setError('Tag already exists')
      return
    }

    if (tags.length >= maxTags) {
      setError(`Maximum ${maxTags} tags allowed`)
      return
    }

    if (validateTag && !validateTag(trimmedTag)) {
      setError('Invalid tag format')
      return
    }

    onTagsChange([...tags, trimmedTag])
    setInputValue('')
    setShowSuggestions(false)
  }

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setError('')

    if (value.includes(',')) {
      const newTag = value.split(',')[0]
      addTag(newTag)
      return
    }

    filterSuggestions(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion)
    setInputValue('')
    setShowSuggestions(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-2 p-3 border rounded-lg min-h-[48px] focus-within:ring-2 focus-within:ring-blue-500">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-blue-600 hover:text-blue-800"
              aria-label={`Remove tag ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => filterSuggestions(inputValue)}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] outline-none bg-transparent"
          disabled={tags.length >= maxTags}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {tags.length >= maxTags && (
        <p className="mt-1 text-sm text-gray-500">
          Maximum {maxTags} tags reached
        </p>
      )}

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}