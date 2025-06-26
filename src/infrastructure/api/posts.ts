import { NextRequest, NextResponse } from 'next/server'
import { CreatePostInput, UpdatePostInput, PostFilters, PostSort, PaginationOptions } from '../../entities/Post'
import { PrismaPostRepository } from '../../repositories/PrismaPostRepository'
import { GetPostsUseCaseImpl, GetPostByIdUseCaseImpl, GetPostBySlugUseCaseImpl, GetBlogStatsUseCaseImpl } from '../../usecases/GetPosts'
import { CreatePostUseCaseImpl } from '../../usecases/CreatePost'
import { UpdatePostUseCaseImpl } from '../../usecases/UpdatePost'
import { DeletePostUseCaseImpl } from '../../usecases/DeletePost'
import { prisma } from '../../lib/prisma'
import { initializeDatabase } from '../../lib/database-init'
import { verifyAdminPassword, createAuthResponse } from '../../lib/auth-server'

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
      // 데이터베이스 초기화 (첫 요청시에만)
      await initializeDatabase()
      
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
    } catch {
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      )
    }
  }

  static async POST(request: NextRequest) {
    try {
      console.log('[POSTS] POST request received')
      
      // 관리자 권한 확인
      const isAuthorized = verifyAdminPassword(request)
      console.log(`[POSTS] Authorization check result: ${isAuthorized}`)
      
      if (!isAuthorized) {
        console.log('[POSTS] Authorization failed, returning 401')
        return createAuthResponse('포스트 작성 권한이 없습니다.')
      }

      const body = await request.json()
      console.log('[POSTS] Creating post with data:', {
        title: body.title,
        category: body.category,
        isPublished: body.isPublished,
        // 민감한 정보는 로그에서 제외
      })
      
      // 데이터베이스 초기화 시도 (실패해도 계속 진행)
      try {
        await initializeDatabase()
        console.log('[POSTS] Database initialized successfully')
      } catch (initError) {
        console.warn('[POSTS] Database initialization failed, continuing...', initError)
      }
      
      const post = await createPost(body)
      console.log('[POSTS] Post created successfully:', {
        id: post.id,
        title: post.title,
        isPublished: post.isPublished
      })
      return NextResponse.json(post, { status: 201 })
    } catch (error) {
      console.error('[POSTS] Error creating post:', error)
      return NextResponse.json(
        { error: 'Failed to create post', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
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
    } catch {
      return NextResponse.json(
        { error: 'Failed to fetch post' },
        { status: 500 }
      )
    }
  }

  static async PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      console.log(`[POSTS] PUT request received for post ID: ${params.id}`)
      
      // 관리자 권한 확인
      const isAuthorized = verifyAdminPassword(request)
      console.log(`[POSTS] Authorization check result: ${isAuthorized}`)
      
      if (!isAuthorized) {
        console.log('[POSTS] Authorization failed for PUT request, returning 401')
        return createAuthResponse('포스트 수정 권한이 없습니다.')
      }

      const body = await request.json()
      console.log('[POSTS] Updating post with data:', {
        id: params.id,
        title: body.title,
        isPublished: body.isPublished,
        // 민감한 정보는 로그에서 제외
      })
      
      const updateInput: UpdatePostInput = {
        id: params.id,
        ...body
      }
      const post = await updatePost(updateInput)
      
      console.log('[POSTS] Post updated successfully:', {
        id: post.id,
        title: post.title,
        isPublished: post.isPublished
      })
      
      return NextResponse.json(post)
    } catch (error) {
      console.error('[POSTS] Error updating post:', error)
      return NextResponse.json(
        { error: 'Failed to update post', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 400 }
      )
    }
  }

  static async DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      // 관리자 권한 확인
      if (!verifyAdminPassword(request)) {
        return createAuthResponse('포스트 삭제 권한이 없습니다.')
      }

      await deletePost(params.id)
      return NextResponse.json({ success: true })
    } catch {
      return NextResponse.json(
        { error: 'Failed to delete post' },
        { status: 400 }
      )
    }
  }
}

export class BlogStatsAPIHandler {
  static async GET() {
    try {
      const stats = await getBlogStats()
      return NextResponse.json(stats)
    } catch {
      return NextResponse.json(
        { error: 'Failed to fetch blog stats' },
        { status: 500 }
      )
    }
  }
}