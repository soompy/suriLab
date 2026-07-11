import { NextRequest } from 'next/server'
import { RelatedPostsAPIHandler } from '@/infrastructure/api/posts'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return RelatedPostsAPIHandler.GET(request, { params: await params })
}
