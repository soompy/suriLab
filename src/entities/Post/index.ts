export interface PostEntity {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  publishedAt: Date
  updatedAt: Date
  tags: string[]
  category: string
  authorId: string
  readTime?: number
  views?: number
  featured?: boolean
}

export interface CreatePostInput {
  title: string
  content: string
  excerpt: string
  slug: string
  tags: string[]
  category: string
  authorId: string
  featured?: boolean
}

export interface UpdatePostInput {
  id: string
  title?: string
  content?: string
  excerpt?: string
  slug?: string
  tags?: string[]
  category?: string
  featured?: boolean
}

export interface PostFilters {
  category?: string
  tags?: string[]
  authorId?: string
  searchQuery?: string
  featured?: boolean
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