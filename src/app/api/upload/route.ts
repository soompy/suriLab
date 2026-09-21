import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { MAX_IMAGE_SIZE, matchesImageSignature, validateImageFile } from '@/lib/image-upload'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: '관리자 로그인이 필요합니다.' }, { status: 401 })
  }
  if (Number(request.headers.get('content-length')) > MAX_IMAGE_SIZE + 64 * 1024) {
    return NextResponse.json({ error: '이미지는 4MB 이하여야 합니다.' }, { status: 413 })
  }
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: '올바른 이미지 파일을 선택해주세요.' }, { status: 400 })
  }
  const file = formData.get('image')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: '이미지 파일을 선택해주세요.' }, { status: 400 })
  }
  const error = validateImageFile(file)
  if (error) return NextResponse.json({ error }, { status: 400 })
  try {
    const data = new Uint8Array(await file.arrayBuffer())
    if (!matchesImageSignature(data, file.type)) {
      return NextResponse.json({ error: '이미지 내용과 파일 형식이 일치하지 않습니다.' }, { status: 400 })
    }
    const image = await prisma.uploadedImage.create({
      data: { data, mimeType: file.type }, select: { id: true }
    })
    return NextResponse.json({ success: true, url: `/api/images/${image.id}` }, { status: 201 })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: '이미지 저장에 실패했습니다. 잠시 후 다시 시도해주세요.' }, { status: 500 })
  }
}
