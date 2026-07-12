import { NextRequest } from 'next/server'
import { AdjacentPostsAPIHandler } from '@/infrastructure/api/posts'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return AdjacentPostsAPIHandler.GET(request, { params: await params })
}
