export interface PostEntity {
  id: string
  title: string
  content: string
  excerpt: string
  description?: string
  series?: string | null
  thumbnail?: string | null
  slug: string
  publishedAt: Date
  updatedAt: Date
  tags: string[]
  category: string
  authorId: string
  readTime?: number
  views?: number
  featured?: boolean
  isPublished: boolean
  draft?: boolean
  source?: 'database' | 'content'
  status?: 'idea' | 'draft' | 'review' | 'published'
  relatedPosts?: string[]
}

export interface CreatePostInput {
  title: string
  content: string
  excerpt: string
  description?: string
  series?: string | null
  thumbnail?: string | null
  slug: string
  tags: string[]
  category: string
  authorId: string
  featured?: boolean
  isPublished?: boolean
  draft?: boolean
}

export interface UpdatePostInput {
  id: string
  title?: string
  content?: string
  excerpt?: string
  description?: string
  series?: string | null
  thumbnail?: string | null
  slug?: string
  tags?: string[]
  category?: string
  featured?: boolean
  isPublished?: boolean
  draft?: boolean
}

export interface PostFilters {
  category?: string
  tags?: string[]
  series?: string
  authorId?: string
  searchQuery?: string
  featured?: boolean
  isPublished?: boolean
}

export interface PostSort {
  field: 'publishedAt' | 'updatedAt' | 'views' | 'title'
  order: 'asc' | 'desc'
}

export interface PaginationOptions {
  page: number
  limit: number
}

export interface PostListResponse {
  posts: PostEntity[]
  total: number
  page: number
  totalPages: number
}
