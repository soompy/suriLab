import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const image = await prisma.uploadedImage.findUnique({ where: { id } })
  if (!image) return new Response(null, { status: 404 })
  return new Response(new Uint8Array(image.data), {
    headers: {
      'Content-Type': image.mimeType,
      'Content-Length': String(image.data.length),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff'
    }
  })
}
