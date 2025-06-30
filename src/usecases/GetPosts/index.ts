import { PostRepository } from '../../repositories/PostRepository'
import { PostEntity, PostFilters, PostSort, PaginationOptions, PostListResponse } from '../../entities/Post'

export interface GetPostsUseCase {
  execute(
    filters?: PostFilters,
    sort?: PostSort,
    pagination?: PaginationOptions
  ): Promise<PostListResponse>
}

export class GetPostsUseCaseImpl implements GetPostsUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(
    filters?: PostFilters,
    sort?: PostSort,
    pagination?: PaginationOptions
  ): Promise<PostListResponse> {
    const defaultSort: PostSort = {
      field: 'publishedAt',
      order: 'desc'
    }

    const defaultPagination: PaginationOptions = {
      page: 1,
      limit: 10
    }

    return await this.postRepository.findAll(
      filters,
      sort || defaultSort,
      pagination || defaultPagination
    )
  }
}

export interface GetPostByIdUseCase {
  execute(id: string): Promise<PostEntity | null>
}

export class GetPostByIdUseCaseImpl implements GetPostByIdUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(id: string): Promise<PostEntity | null> {
    const post = await this.postRepository.findById(id)
    return post
  }
}

export interface GetPostBySlugUseCase {
  execute(slug: string): Promise<PostEntity | null>
}

export class GetPostBySlugUseCaseImpl implements GetPostBySlugUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(slug: string): Promise<PostEntity | null> {
    const post = await this.postRepository.findBySlug(slug)
    return post
  }
}

export interface GetBlogStatsUseCase {
  execute(): Promise<{
    totalPosts: number
    totalViews: number
    totalCategories: number
    totalTags: number
    categories: string[]
    tags: string[]
  }>
}

export class GetBlogStatsUseCaseImpl implements GetBlogStatsUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(): Promise<{
    totalPosts: number
    totalViews: number
    totalCategories: number
    totalTags: number
    categories: string[]
    tags: string[]
  }> {
    const [stats, categories, tags] = await Promise.all([
      this.postRepository.getStats(),
      this.postRepository.getCategories(),
      this.postRepository.getTags()
    ])

    return {
      ...stats,
      categories,
      tags
    }
  }
}