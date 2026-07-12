#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')

async function main() {
  const databaseUrl = process.env.DATABASE_URL || ''
  const hostMatch = databaseUrl.match(/@([^/?]+)/)
  const host = hostMatch?.[1] || '(not set)'

  console.log('DATABASE_URL host:', host)

  const prisma = new PrismaClient()

  try {
    await prisma.$queryRaw`SELECT 1`

    const [total, published] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { isPublished: true } })
    ])

    const sample = await prisma.post.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: 5,
      select: {
        title: true,
        slug: true,
        category: { select: { name: true } }
      }
    })

    console.log('\nConnection: OK')
    console.log(`Posts: ${published} published / ${total} total`)
    console.log('\nRecent posts:')
    sample.forEach((post, index) => {
      console.log(`${index + 1}. [${post.category.name}] ${post.title}`)
    })
  } catch (error) {
    console.error('\nConnection: FAILED')
    console.error(error instanceof Error ? error.message : error)
    console.error('\nNext steps:')
    console.error('1. Open https://console.neon.tech and resume or recreate the project')
    console.error('2. Copy a fresh connection string from Connect -> Prisma')
    console.error('3. Update DATABASE_URL in .env')
    console.error('4. Run: npm run db:check')
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

main()
