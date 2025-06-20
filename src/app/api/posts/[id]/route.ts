import { NextRequest } from 'next/server'
import { PostAPIHandler } from '../../../../infrastructure/api/posts'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return PostAPIHandler.GET(request, { params })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return PostAPIHandler.PUT(request, { params })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return PostAPIHandler.DELETE(request, { params })
}