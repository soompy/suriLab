/** @jest-environment node */
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/upload/route'
import { GET } from '@/app/api/images/[id]/route'
import { verifyAdminToken } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/auth-server', () => ({ verifyAdminToken: jest.fn() }))
jest.mock('@/lib/prisma', () => ({ prisma: { uploadedImage: { create: jest.fn(), findUnique: jest.fn() } } }))
const auth = jest.mocked(verifyAdminToken)
const create = jest.mocked(prisma.uploadedImage.create)
const find = jest.mocked(prisma.uploadedImage.findUnique)

function request(value?: File | string) {
  const form = new FormData()
  if (value !== undefined) form.set('image', value)
  return new NextRequest('http://localhost/api/upload', { method: 'POST', body: form })
}

beforeEach(() => {
  jest.clearAllMocks()
  auth.mockReturnValue(true)
})

it('rejects unauthenticated uploads without writing to the DB', async () => {
  auth.mockReturnValue(false)
  expect((await POST(request())).status).toBe(401)
  expect(create).not.toHaveBeenCalled()
})

it.each([undefined, 'not a file'])('rejects missing or non-file values', async value => {
  expect((await POST(request(value))).status).toBe(400)
  expect(create).not.toHaveBeenCalled()
})

it('rejects spoofed image content', async () => {
  expect((await POST(request(new File(['<html>'], 'test.png', { type: 'image/png' })))).status).toBe(400)
  expect(create).not.toHaveBeenCalled()
})

it('persists validated bytes and returns a stable URL', async () => {
  create.mockResolvedValue({ id: 'test-image' } as Awaited<ReturnType<typeof prisma.uploadedImage.create>>)
  const bytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])
  const response = await POST(request(new File([bytes], 'test.png', { type: 'image/png' })))
  expect(response.status).toBe(201)
  expect(await response.json()).toEqual({ success: true, url: '/api/images/test-image' })
  expect(create).toHaveBeenCalledWith({ data: { data: bytes, mimeType: 'image/png' }, select: { id: true } })
})

it('serves saved images publicly with the stored MIME and immutable cache', async () => {
  const data = new Uint8Array([255, 216, 255])
  find.mockResolvedValue({ id: 'test-image', data, mimeType: 'image/jpeg', createdAt: new Date() })
  const response = await GET(new Request('http://localhost'), { params: Promise.resolve({ id: 'test-image' }) })
  expect(response.headers.get('content-type')).toBe('image/jpeg')
  expect(response.headers.get('cache-control')).toContain('immutable')
  expect(new Uint8Array(await response.arrayBuffer())).toEqual(data)
})

it('returns 404 for unknown images', async () => {
  find.mockResolvedValue(null)
  expect((await GET(new Request('http://localhost'), { params: Promise.resolve({ id: 'missing' }) })).status).toBe(404)
})
