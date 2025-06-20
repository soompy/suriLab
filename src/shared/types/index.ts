export interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  publishedAt: Date
  updatedAt: Date
  tags: string[]
  category: string
  author: User
  readTime?: number
  views?: number
  featured?: boolean
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Comment {
  id: string
  content: string
  author: User
  postId: string
  createdAt: Date
}