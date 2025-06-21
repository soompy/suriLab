import { NextRequest, NextResponse } from 'next/server'
import { PostEntity, CreatePostInput, UpdatePostInput, PostFilters, PostSort, PaginationOptions } from '../../entities/Post'
import { PrismaPostRepository } from '../../repositories/PrismaPostRepository'
import { GetPostsUseCaseImpl, GetPostByIdUseCaseImpl, GetPostBySlugUseCaseImpl, GetBlogStatsUseCaseImpl } from '../../usecases/GetPosts'
import { CreatePostUseCaseImpl } from '../../usecases/CreatePost'
import { UpdatePostUseCaseImpl } from '../../usecases/UpdatePost'
import { DeletePostUseCaseImpl } from '../../usecases/DeletePost'
import { prisma } from '../../lib/prisma'

const postRepository = new PrismaPostRepository(prisma)
const getPostsUseCase = new GetPostsUseCaseImpl(postRepository)
const getPostByIdUseCase = new GetPostByIdUseCaseImpl(postRepository)
const getPostBySlugUseCase = new GetPostBySlugUseCaseImpl(postRepository)
const getBlogStatsUseCase = new GetBlogStatsUseCaseImpl(postRepository)
const createPostUseCase = new CreatePostUseCaseImpl(postRepository)
const updatePostUseCase = new UpdatePostUseCaseImpl(postRepository)
const deletePostUseCase = new DeletePostUseCaseImpl(postRepository)

export async function getPosts(
  filters?: PostFilters,
  sort?: PostSort,
  pagination?: PaginationOptions
) {
  try {
    return await getPostsUseCase.execute(filters, sort, pagination)
  } catch (error) {
    console.error('Error getting posts:', error)
    throw error
  }
}

export async function getPostById(id: string) {
  try {
    return await getPostByIdUseCase.execute(id)
  } catch (error) {
    console.error('Error getting post by id:', error)
    throw error
  }
}

export async function getPostBySlug(slug: string) {
  try {
    return await getPostBySlugUseCase.execute(slug)
  } catch (error) {
    console.error('Error getting post by slug:', error)
    throw error
  }
}

export async function getBlogStats() {
  try {
    return await getBlogStatsUseCase.execute()
  } catch (error) {
    console.error('Error getting blog stats:', error)
    throw error
  }
}

export async function createPost(input: CreatePostInput) {
  try {
    return await createPostUseCase.execute(input)
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

export async function updatePost(input: UpdatePostInput) {
  try {
    return await updatePostUseCase.execute(input)
  } catch (error) {
    console.error('Error updating post:', error)
    throw error
  }
}

export async function deletePost(id: string) {
  try {
    return await deletePostUseCase.execute(id)
  } catch (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}

export class PostsAPIHandler {
  static async GET(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url)
      
      const category = searchParams.get('category') || undefined
      const tags = searchParams.get('tags')?.split(',') || undefined
      const authorId = searchParams.get('authorId') || undefined
      const searchQuery = searchParams.get('search') || undefined
      const featured = searchParams.get('featured') === 'true' ? true : undefined
      const isPublished = searchParams.get('isPublished') !== 'false' ? true : searchParams.get('isPublished') === 'false' ? false : undefined
      
      const sortField = (searchParams.get('sortField') as PostSort['field']) || 'publishedAt'
      const sortOrder = (searchParams.get('sortOrder') as PostSort['order']) || 'desc'
      
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')

      const filters: PostFilters = {
        category,
        tags,
        authorId,
        searchQuery,
        featured,
        isPublished
      }

      const sort: PostSort = {
        field: sortField,
        order: sortOrder
      }

      const pagination: PaginationOptions = {
        page,
        limit
      }

      const result = await getPosts(filters, sort, pagination)
      return NextResponse.json(result)
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      )
    }
  }

  static async POST(request: NextRequest) {
    try {
      const body = await request.json()
      const post = await createPost(body)
      return NextResponse.json(post, { status: 201 })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create post'
      return NextResponse.json(
        { error: message },
        { status: 400 }
      )
    }
  }
}

export class PostAPIHandler {
  static async GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const post = await getPostById(params.id)
      if (!post) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(post)
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch post' },
        { status: 500 }
      )
    }
  }

  static async PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const body = await request.json()
      const updateInput: UpdatePostInput = {
        id: params.id,
        ...body
      }
      const post = await updatePost(updateInput)
      return NextResponse.json(post)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update post'
      const status = message.includes('not found') ? 404 : 400
      return NextResponse.json(
        { error: message },
        { status }
      )
    }
  }

  static async DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      await deletePost(params.id)
      return NextResponse.json({ success: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete post'
      const status = message.includes('not found') ? 404 : 400
      return NextResponse.json(
        { error: message },
        { status }
      )
    }
  }
}

export class BlogStatsAPIHandler {
  static async GET() {
    try {
      const stats = await getBlogStats()
      return NextResponse.json(stats)
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch blog stats' },
        { status: 500 }
      )
    }
  }
}