import { NextRequest, NextResponse } from 'next/server'
import { getPostBySlug } from '../../../../../infrastructure/api/posts'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params
    const post = await getPostBySlug(params.slug)
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }
    
    // 공개 API에서는 발행된 글만 반환
    if (!post.isPublished) {
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