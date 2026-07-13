'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Divider, IconButton, Stack } from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Bookmark as BookmarkIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Share as ShareIcon,
} from '@mui/icons-material'
import LikeButton from '@/components/LikeButton'
import { AuthService } from '@/lib/auth'

interface PostActionsProps {
  postId: string
  title: string
  description?: string
  isContentPost: boolean
}

export default function PostActions({
  postId,
  title,
  description,
  isContentPost,
}: PostActionsProps) {
  const router = useRouter()
  const viewCountedRef = useRef(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setIsAdmin(AuthService.isAuthenticated())
  }, [])

  useEffect(() => {
    if (isContentPost || viewCountedRef.current) return

    const viewKey = `post_viewed_${postId}`
    const alreadyViewed = sessionStorage.getItem(viewKey)

    if (alreadyViewed) return

    viewCountedRef.current = true
    sessionStorage.setItem(viewKey, 'true')

    fetch(`/api/posts/${postId}/views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((error) => {
      console.error('Failed to increment views:', error)
    })
  }, [isContentPost, postId])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
      return
    }

    await navigator.clipboard.writeText(window.location.href)
  }

  const handleDelete = async () => {
    const confirmed = window.confirm('정말로 이 글을 삭제하시겠습니까?')
    if (!confirmed) return

    try {
      setIsDeleting(true)
      const response = await AuthService.authenticatedFetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete post')
      }

      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error deleting post:', error)
      alert(error instanceof Error ? error.message : '글 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 4 }}>
      <IconButton onClick={() => router.back()} title="뒤로 가기" aria-label="뒤로 가기">
        <ArrowBackIcon />
      </IconButton>
      {!isContentPost && (
        <>
          <LikeButton postId={postId} />
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        </>
      )}
      <IconButton onClick={handleShare} title="공유하기" aria-label="공유하기">
        <ShareIcon />
      </IconButton>
      <IconButton title="북마크" aria-label="북마크">
        <BookmarkIcon />
      </IconButton>
      {isAdmin && !isContentPost && (
        <>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <IconButton
            onClick={() => router.push(`/write?edit=${postId}`)}
            title="수정하기"
            aria-label="수정하기"
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={handleDelete}
            title="삭제하기"
            aria-label="삭제하기"
            color="error"
            disabled={isDeleting}
          >
            <DeleteIcon />
          </IconButton>
        </>
      )}
    </Stack>
  )
}
