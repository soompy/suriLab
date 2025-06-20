import { NextRequest } from 'next/server'
import { PostsAPIHandler } from '../../../infrastructure/api/posts'

export async function GET(request: NextRequest) {
  return PostsAPIHandler.GET(request)
}

export async function POST(request: NextRequest) {
  return PostsAPIHandler.POST(request)
}