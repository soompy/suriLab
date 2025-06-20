import { PostEntity, CreatePostInput, UpdatePostInput, PostFilters, PostSort, PaginationOptions, PostListResponse } from '../../entities/Post'

export interface PostRepository {
  findAll(
    filters?: PostFilters,
    sort?: PostSort,
    pagination?: PaginationOptions
  ): Promise<PostListResponse>
  
  findById(id: string): Promise<PostEntity | null>
  
  findBySlug(slug: string): Promise<PostEntity | null>
  
  create(input: CreatePostInput): Promise<PostEntity>
  
  update(input: UpdatePostInput): Promise<PostEntity>
  
  delete(id: string): Promise<void>
  
  incrementViews(id: string): Promise<void>
  
  getCategories(): Promise<string[]>
  
  getTags(): Promise<string[]>
  
  getStats(): Promise<{
    totalPosts: number
    totalViews: number
    totalCategories: number
    totalTags: number
  }>
}

export class InMemoryPostRepository implements PostRepository {
  private posts: PostEntity[] = [
    {
      id: '1',
      title: 'React Hooks로 시작하는 모던 React 개발',
      content: '# React Hooks로 시작하는 모던 React 개발\n\nReact Hooks는 함수형 컴포넌트에서 상태 관리와 생명주기 기능을 사용할 수 있게 해주는 강력한 기능입니다.',
      excerpt: 'React Hooks를 활용한 모던 컴포넌트 개발 방법과 실무 활용 팁',
      slug: 'react-hooks-modern-development',
      publishedAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2024-01-15T10:00:00Z'),
      tags: ['React', 'JavaScript', 'Frontend'],
      category: 'Tech Insights',
      authorId: 'user-1',
      readTime: 8,
      views: 1247,
      featured: true
    },
    {
      id: '2',
      title: 'TypeScript와 Next.js로 타입 안전한 웹 개발',
      content: '# TypeScript와 Next.js로 타입 안전한 웹 개발\n\nNext.js에서 TypeScript를 활용하여 타입 안전한 웹 애플리케이션을 개발하는 방법을 알아봅시다.',
      excerpt: 'Next.js에서 TypeScript를 활용한 타입 안전한 개발 환경 구축',
      slug: 'typescript-nextjs-safe-development',
      publishedAt: new Date('2024-01-12T14:30:00Z'),
      updatedAt: new Date('2024-01-12T14:30:00Z'),
      tags: ['TypeScript', 'Next.js', 'WebDev'],
      category: 'Tech Insights',
      authorId: 'user-1',
      readTime: 12,
      views: 2103
    },
    {
      id: '3',
      title: 'CSS Grid와 Flexbox: 모던 레이아웃 완벽 가이드',
      content: '# CSS Grid와 Flexbox: 모던 레이아웃 완벽 가이드\n\nCSS Grid와 Flexbox를 활용하여 현대적인 웹 레이아웃을 구현하는 방법을 상세히 설명합니다.',
      excerpt: 'CSS Grid와 Flexbox를 활용한 현대적인 웹 레이아웃 구현 방법',
      slug: 'css-grid-flexbox-layout-guide',
      publishedAt: new Date('2024-01-08T09:15:00Z'),
      updatedAt: new Date('2024-01-08T09:15:00Z'),
      tags: ['CSS', 'Layout', 'Design'],
      category: 'Code Solutions',
      authorId: 'user-1',
      readTime: 10,
      views: 1856
    }
  ]

  async findAll(
    filters?: PostFilters,
    sort?: PostSort,
    pagination?: PaginationOptions
  ): Promise<PostListResponse> {
    let filteredPosts = [...this.posts]

    if (filters) {
      if (filters.category) {
        filteredPosts = filteredPosts.filter(post => post.category === filters.category)
      }
      if (filters.tags && filters.tags.length > 0) {
        filteredPosts = filteredPosts.filter(post => 
          filters.tags!.some(tag => post.tags.includes(tag))
        )
      }
      if (filters.authorId) {
        filteredPosts = filteredPosts.filter(post => post.authorId === filters.authorId)
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        filteredPosts = filteredPosts.filter(post => 
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }
      if (filters.featured !== undefined) {
        filteredPosts = filteredPosts.filter(post => post.featured === filters.featured)
      }
    }

    if (sort) {
      filteredPosts.sort((a, b) => {
        let aValue, bValue
        switch (sort.field) {
          case 'publishedAt':
            aValue = a.publishedAt.getTime()
            bValue = b.publishedAt.getTime()
            break
          case 'updatedAt':
            aValue = a.updatedAt.getTime()
            bValue = b.updatedAt.getTime()
            break
          case 'views':
            aValue = a.views || 0
            bValue = b.views || 0
            break
          case 'title':
            aValue = a.title.toLowerCase()
            bValue = b.title.toLowerCase()
            break
          default:
            aValue = a.publishedAt.getTime()
            bValue = b.publishedAt.getTime()
        }
        
        if (sort.order === 'desc') {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        } else {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        }
      })
    }

    const total = filteredPosts.length
    const page = pagination?.page || 1
    const limit = pagination?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

    return {
      posts: paginatedPosts,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }
  }

  async findById(id: string): Promise<PostEntity | null> {
    return this.posts.find(post => post.id === id) || null
  }

  async findBySlug(slug: string): Promise<PostEntity | null> {
    return this.posts.find(post => post.slug === slug) || null
  }

  async create(input: CreatePostInput): Promise<PostEntity> {
    const newPost: PostEntity = {
      id: Date.now().toString(),
      ...input,
      publishedAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      readTime: Math.ceil(input.content.split(' ').length / 200)
    }

    this.posts.push(newPost)
    return newPost
  }

  async update(input: UpdatePostInput): Promise<PostEntity> {
    const postIndex = this.posts.findIndex(post => post.id === input.id)
    if (postIndex === -1) {
      throw new Error('Post not found')
    }

    const updatedPost = {
      ...this.posts[postIndex],
      ...input,
      updatedAt: new Date()
    }

    if (input.content) {
      updatedPost.readTime = Math.ceil(input.content.split(' ').length / 200)
    }

    this.posts[postIndex] = updatedPost
    return updatedPost
  }

  async delete(id: string): Promise<void> {
    const postIndex = this.posts.findIndex(post => post.id === id)
    if (postIndex === -1) {
      throw new Error('Post not found')
    }

    this.posts.splice(postIndex, 1)
  }

  async incrementViews(id: string): Promise<void> {
    const post = this.posts.find(post => post.id === id)
    if (post) {
      post.views = (post.views || 0) + 1
    }
  }

  async getCategories(): Promise<string[]> {
    const categories = new Set(this.posts.map(post => post.category))
    return Array.from(categories)
  }

  async getTags(): Promise<string[]> {
    const tags = new Set(this.posts.flatMap(post => post.tags))
    return Array.from(tags)
  }

  async getStats(): Promise<{
    totalPosts: number
    totalViews: number
    totalCategories: number
    totalTags: number
  }> {
    const totalPosts = this.posts.length
    const totalViews = this.posts.reduce((sum, post) => sum + (post.views || 0), 0)
    const categories = await this.getCategories()
    const tags = await this.getTags()

    return {
      totalPosts,
      totalViews,
      totalCategories: categories.length,
      totalTags: tags.length
    }
  }
}