import { useState } from 'react'
import { PostEntity, CreatePostInput, UpdatePostInput } from '../entities/Post'

export function useCreatePost() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPost = async (input: CreatePostInput): Promise<PostEntity | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create post')
      }

      const post = await response.json()
      return post
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    createPost,
    loading,
    error
  }
}

export function useUpdatePost() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updatePost = async (input: UpdatePostInput): Promise<PostEntity | null> => {
    try {
      setLoading(true)
      setError(null)

      const { id, ...updateData } = input
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update post')
      }

      const post = await response.json()
      return post
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    updatePost,
    loading,
    error
  }
}

export function useDeletePost() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deletePost = async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete post')
      }

      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    deletePost,
    loading,
    error
  }
}

export function useTogglePostPublish() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const togglePublish = async (id: string, currentState: boolean): Promise<PostEntity | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublished: !currentState
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to toggle post publish state')
      }

      const post = await response.json()
      return post
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    togglePublish,
    loading,
    error
  }
}