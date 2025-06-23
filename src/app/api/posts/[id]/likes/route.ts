import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  // Fallback to a default value in production
  return 'unknown'
}

export async function GET(
  request: NextRequest,
  segmentData: { params: Promise<{ id: string }> }
) {
  try {
    const params = await segmentData.params
    const likesCount = await prisma.like.count({
      where: {
        postId: params.id
      }
    })

    const clientIP = getClientIP(request)
    const userLiked = await prisma.like.findUnique({
      where: {
        postId_ipAddress: {
          postId: params.id,
          ipAddress: clientIP
        }
      }
    })

    return NextResponse.json({
      count: likesCount,
      userLiked: !!userLiked
    })
  } catch (error) {
    console.error('Error fetching likes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch likes' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  segmentData: { params: Promise<{ id: string }> }
) {
  try {
    const params = await segmentData.params
    const clientIP = getClientIP(request)

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_ipAddress: {
          postId: params.id,
          ipAddress: clientIP
        }
      }
    })

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id
        }
      })
      
      const likesCount = await prisma.like.count({
        where: { postId: params.id }
      })

      return NextResponse.json({
        count: likesCount,
        userLiked: false,
        action: 'unliked'
      })
    } else {
      await prisma.like.create({
        data: {
          postId: params.id,
          ipAddress: clientIP
        }
      })

      const likesCount = await prisma.like.count({
        where: { postId: params.id }
      })

      return NextResponse.json({
        count: likesCount,
        userLiked: true,
        action: 'liked'
      })
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}