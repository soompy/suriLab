import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    await prisma.post.update({
      where: { id: params.id },
      data: {
        views: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error incrementing views:', error)
    return NextResponse.json(
      { error: 'Failed to increment views' },
      { status: 500 }
    )
  }
}