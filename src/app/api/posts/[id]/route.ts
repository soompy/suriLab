import { NextRequest } from 'next/server'
import { PostAPIHandler } from '../../../../infrastructure/api/posts'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  return PostAPIHandler.GET(request, { params })
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  return PostAPIHandler.PUT(request, { params })
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  return PostAPIHandler.DELETE(request, { params })
}