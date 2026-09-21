const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const rollback = new Error('Image verification completed; roll back test data')

async function main() {
  const data = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=', 'base64')
  try {
    await prisma.$transaction(async transaction => {
      const created = await transaction.uploadedImage.create({ data: { data, mimeType: 'image/png' } })
      const stored = await transaction.uploadedImage.findUniqueOrThrow({ where: { id: created.id } })
      if (stored.mimeType !== 'image/png' || !Buffer.from(stored.data).equals(data)) {
        throw new Error('Stored image differs from uploaded bytes')
      }
      throw rollback
    })
  } catch (error) {
    if (error !== rollback) throw error
  }
  console.log('Image storage: write/read verified; test transaction rolled back.')
}

main().catch(() => {
  console.error('Image storage verification failed. Check database connectivity and migrations.')
  process.exitCode = 1
}).finally(() => prisma.$disconnect())
