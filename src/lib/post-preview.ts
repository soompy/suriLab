import type { PostEntity, PostListResponse } from '@/entities/Post'

function isInlineImageSource(src?: string | null) {
  return Boolean(src?.startsWith('data:') || src?.startsWith('blob:'))
}

export function toPostPreview(post: PostEntity): PostEntity {
  return {
    ...post,
    content: '',
    thumbnail: isInlineImageSource(post.thumbnail) ? null : post.thumbnail,
  }
}

export function toPostPreviews(posts: PostEntity[]) {
  return posts.map(toPostPreview)
}

export function toPostListPreviewResponse(response: PostListResponse): PostListResponse {
  return {
    ...response,
    posts: toPostPreviews(response.posts),
  }
}
