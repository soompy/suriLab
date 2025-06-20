import { useState, useEffect } from 'react'
import { PostEntity, PostFilters, PostSort, PaginationOptions, PostListResponse } from '../entities/Post'

export interface UsePostsOptions {
  filters?: PostFilters
  sort?: PostSort
  pagination?: PaginationOptions
  enabled?: boolean
}

export function usePosts(options: UsePostsOptions = {}) {
  const [data, setData] = useState<PostListResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { filters, sort, pagination, enabled = true } = options

  const fetchPosts = async () => {
    if (!enabled) return

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      
      if (filters?.category) params.append('category', filters.category)
      if (filters?.tags) params.append('tags', filters.tags.join(','))
      if (filters?.authorId) params.append('authorId', filters.authorId)
      if (filters?.searchQuery) params.append('search', filters.searchQuery)
      if (filters?.featured !== undefined) params.append('featured', filters.featured.toString())
      
      if (sort?.field) params.append('sortField', sort.field)
      if (sort?.order) params.append('sortOrder', sort.order)
      
      if (pagination?.page) params.append('page', pagination.page.toString())
      if (pagination?.limit) params.append('limit', pagination.limit.toString())

      const response = await fetch(`/api/posts?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [
    filters?.category,
    filters?.tags?.join(','),
    filters?.authorId,
    filters?.searchQuery,
    filters?.featured,
    sort?.field,
    sort?.order,
    pagination?.page,
    pagination?.limit,
    enabled
  ])

  return {
    data,
    loading,
    error,
    refetch: fetchPosts
  }
}

export function usePost(id: string) {
  const [post, setPost] = useState<PostEntity | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPost = async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/posts/${id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch post')
      }

      const result = await response.json()
      setPost(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPost()
  }, [id])

  return {
    post,
    loading,
    error,
    refetch: fetchPost
  }
}

export function usePostBySlug(slug: string) {
  const [post, setPost] = useState<PostEntity | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPost = async () => {
    if (!slug) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/posts/slug/${slug}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch post')
      }

      const result = await response.json()
      setPost(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPost()
  }, [slug])

  return {
    post,
    loading,
    error,
    refetch: fetchPost
  }
}

export function useBlogStats() {
  const [stats, setStats] = useState<{
    totalPosts: number
    totalViews: number
    totalCategories: number
    totalTags: number
    categories: string[]
    tags: string[]
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/blog/stats')
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog stats')
      }

      const result = await response.json()
      setStats(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}