import { PrismaClient } from '@prisma/client'
import { PostEntity, CreatePostInput, UpdatePostInput, PostFilters, PostSort, PaginationOptions, PostListResponse } from '../../entities/Post'
import { PostRepository } from '../PostRepository'

export class PrismaPostRepository implements PostRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(
    filters?: PostFilters,
    sort?: PostSort,
    pagination?: PaginationOptions
  ): Promise<PostListResponse> {
    const where: any = {}

    if (filters) {
      if (filters.category) {
        where.category = { name: filters.category }
      }
      if (filters.tags && filters.tags.length > 0) {
        where.tags = {
          some: {
            name: { in: filters.tags }
          }
        }
      }
      if (filters.authorId) {
        where.authorId = filters.authorId
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        where.OR = [
          { title: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { tags: { some: { name: { contains: query, mode: 'insensitive' } } } }
        ]
      }
      if (filters.featured !== undefined) {
        where.featured = filters.featured
      }
      if (filters.isPublished !== undefined) {
        where.isPublished = filters.isPublished
      }
    }

    const orderBy: any = {}
    if (sort) {
      orderBy[sort.field] = sort.order
    } else {
      orderBy.publishedAt = 'desc'
    }

    const page = pagination?.page || 1
    const limit = pagination?.limit || 10
    const skip = (page - 1) * limit

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          tags: true,
          category: true,
          author: true
        }
      }),
      this.prisma.post.count({ where })
    ])

    return {
      posts: posts.map(this.mapToEntity),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }
  }

  async findById(id: string): Promise<PostEntity | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        tags: true,
        category: true,
        author: true
      }
    })

    return post ? this.mapToEntity(post) : null
  }

  async findBySlug(slug: string): Promise<PostEntity | null> {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        tags: true,
        category: true,
        author: true
      }
    })

    return post ? this.mapToEntity(post) : null
  }

  async create(input: CreatePostInput): Promise<PostEntity> {
    // 카테고리가 존재하는지 확인하고 없으면 생성
    const category = await this.prisma.category.upsert({
      where: { name: input.category },
      update: {},
      create: { name: input.category }
    })

    // 사용자가 존재하는지 확인하고 없으면 기본 사용자 생성
    const author = await this.prisma.user.upsert({
      where: { id: input.authorId },
      update: {},
      create: { 
        id: input.authorId,
        name: 'Blog Author',
        email: 'author@example.com'
      }
    })

    // slug 중복 확인 및 처리
    let finalSlug = input.slug
    const existingPost = await this.prisma.post.findUnique({ 
      where: { slug: input.slug },
      select: { id: true }
    })
    if (existingPost) {
      finalSlug = `${input.slug}-${Date.now()}`
    }

    const post = await this.prisma.post.create({
      data: {
        title: input.title,
        content: input.content,
        excerpt: input.excerpt,
        slug: finalSlug,
        featured: input.featured || false,
        isPublished: input.isPublished || false,
        readTime: Math.ceil(input.content.split(' ').length / 200),
        categoryId: category.id,
        authorId: author.id,
        tags: {
          connectOrCreate: input.tags.map(tagName => ({
            where: { name: tagName },
            create: { name: tagName }
          }))
        }
      },
      include: {
        tags: true,
        category: true,
        author: true
      }
    })

    return this.mapToEntity(post)
  }

  async update(input: UpdatePostInput): Promise<PostEntity> {
    const updateData: any = {}
    
    if (input.title) updateData.title = input.title
    if (input.content) {
      updateData.content = input.content
      updateData.readTime = Math.ceil(input.content.split(' ').length / 200)
    }
    if (input.excerpt) updateData.excerpt = input.excerpt
    if (input.slug) {
      // slug 중복 확인 및 처리
      const existingPost = await this.prisma.post.findUnique({ 
        where: { slug: input.slug },
        select: { id: true }
      })
      if (existingPost && existingPost.id !== input.id) {
        updateData.slug = `${input.slug}-${Date.now()}`
      } else {
        updateData.slug = input.slug
      }
    }
    if (input.featured !== undefined) updateData.featured = input.featured
    if (input.isPublished !== undefined) {
      updateData.isPublished = input.isPublished
      // 처음 발행될 때 publishedAt 업데이트
      if (input.isPublished === true) {
        const currentPost = await this.prisma.post.findUnique({ 
          where: { id: input.id },
          select: { isPublished: true }
        })
        if (currentPost && !currentPost.isPublished) {
          updateData.publishedAt = new Date()
        }
      }
    }

    if (input.category) {
      const category = await this.prisma.category.upsert({
        where: { name: input.category },
        update: {},
        create: { name: input.category }
      })
      updateData.categoryId = category.id
    }

    if (input.tags) {
      updateData.tags = {
        set: [],
        connectOrCreate: input.tags.map(tagName => ({
          where: { name: tagName },
          create: { name: tagName }
        }))
      }
    }

    const post = await this.prisma.post.update({
      where: { id: input.id },
      data: updateData,
      include: {
        tags: true,
        category: true,
        author: true
      }
    })

    return this.mapToEntity(post)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.post.delete({
      where: { id }
    })
  }

  async incrementViews(id: string): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: {
        views: {
          increment: 1
        }
      }
    })
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.prisma.category.findMany({
      select: { name: true }
    })
    return categories.map(cat => cat.name)
  }

  async getTags(): Promise<string[]> {
    const tags = await this.prisma.tag.findMany({
      select: { name: true }
    })
    return tags.map(tag => tag.name)
  }

  async getStats(): Promise<{
    totalPosts: number
    totalViews: number
    totalCategories: number
    totalTags: number
  }> {
    const [totalPosts, totalViews, totalCategories, totalTags] = await Promise.all([
      this.prisma.post.count({
        where: { 
          isPublished: true,
          author: {
            email: {
              not: 'yzsumin@naver.com'
            }
          }
        }
      }),
      this.prisma.post.aggregate({
        _sum: { views: true },
        where: { 
          isPublished: true,
          author: {
            email: {
              not: 'yzsumin@naver.com'
            }
          }
        }
      }),
      this.prisma.category.count(),
      this.prisma.tag.count()
    ])

    return {
      totalPosts,
      totalViews: totalViews._sum.views || 0,
      totalCategories,
      totalTags
    }
  }

  private mapToEntity(post: any): PostEntity {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      slug: post.slug,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      tags: post.tags.map((tag: any) => tag.name),
      category: post.category.name,
      authorId: post.authorId,
      readTime: post.readTime,
      views: post.views,
      featured: post.featured,
      isPublished: post.isPublished
    }
  }
}