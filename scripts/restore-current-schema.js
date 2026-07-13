#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

function loadDotEnv() {
  const envPath = path.join(process.cwd(), '.env')
  if (!fs.existsSync(envPath)) return

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) continue

    const key = trimmed.slice(0, separatorIndex).trim()
    const rawValue = trimmed.slice(separatorIndex + 1).trim()
    const value = rawValue.replace(/^["']|["']$/g, '')

    if (key && process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

function findLatestBackup() {
  const backupDir = path.join(process.cwd(), 'backups')
  if (!fs.existsSync(backupDir)) {
    throw new Error('backups directory does not exist.')
  }

  const backupFile = fs
    .readdirSync(backupDir)
    .filter((file) => file.startsWith('backup-current-schema-') && file.endsWith('.json'))
    .sort()
    .pop()

  if (!backupFile) {
    throw new Error('No current-schema backup JSON found in backups directory.')
  }

  return path.join(backupDir, backupFile)
}

function parseDate(value) {
  return value ? new Date(value) : undefined
}

function validateBackup(backupData) {
  if (backupData.version !== '2.0-current-schema') {
    throw new Error(`Unsupported backup version: ${backupData.version || 'unknown'}`)
  }

  const data = backupData.data
  const requiredCollections = ['users', 'categories', 'tags', 'posts', 'comments', 'likes']

  for (const collection of requiredCollections) {
    if (!Array.isArray(data?.[collection])) {
      throw new Error(`Backup is missing data.${collection}.`)
    }
  }
}

async function main() {
  loadDotEnv()

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is missing. Add it to .env before running restore.')
    process.exit(1)
  }

  const backupFile = process.argv[2] ? path.resolve(process.argv[2]) : findLatestBackup()
  const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'))
  validateBackup(backupData)

  const { users, categories, tags, posts, comments, likes } = backupData.data
  const prisma = new PrismaClient()

  try {
    await prisma.$queryRaw`SELECT 1`

    await prisma.$transaction(
      async (tx) => {
        await tx.like.deleteMany()
        await tx.comment.deleteMany()
        await tx.post.deleteMany()
        await tx.tag.deleteMany()
        await tx.category.deleteMany()
        await tx.user.deleteMany()

        for (const user of users) {
          await tx.user.create({
            data: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          })
        }

        for (const category of categories) {
          await tx.category.create({
            data: {
              id: category.id,
              name: category.name,
              description: category.description,
              color: category.color,
            },
          })
        }

        for (const tag of tags) {
          await tx.tag.create({
            data: {
              id: tag.id,
              name: tag.name,
            },
          })
        }

        for (const post of posts) {
          await tx.post.create({
            data: {
              id: post.id,
              title: post.title,
              content: post.content,
              excerpt: post.excerpt,
              series: post.series,
              thumbnail: post.thumbnail,
              slug: post.slug,
              publishedAt: parseDate(post.publishedAt),
              updatedAt: parseDate(post.updatedAt),
              readTime: post.readTime,
              views: post.views,
              featured: post.featured,
              isPublished: post.isPublished,
              categoryId: post.categoryId,
              authorId: post.authorId,
              tags: post.tags?.length
                ? {
                    connect: post.tags.map((tag) => ({ id: tag.id })),
                  }
                : undefined,
            },
          })
        }

        for (const comment of comments) {
          await tx.comment.create({
            data: {
              id: comment.id,
              content: comment.content,
              authorName: comment.authorName,
              authorEmail: comment.authorEmail,
              createdAt: parseDate(comment.createdAt),
              updatedAt: parseDate(comment.updatedAt),
              postId: comment.postId,
            },
          })
        }

        for (const like of likes) {
          await tx.like.create({
            data: {
              id: like.id,
              createdAt: parseDate(like.createdAt),
              postId: like.postId,
              ipAddress: like.ipAddress,
            },
          })
        }
      },
      {
        timeout: 30_000,
      },
    )

    const [totalPosts, publishedPosts, totalCategories, totalTags] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { isPublished: true } }),
      prisma.category.count(),
      prisma.tag.count(),
    ])

    console.log('Restore completed.')
    console.log(`File: ${backupFile}`)
    console.log(`Posts: ${publishedPosts} published / ${totalPosts} total`)
    console.log(`Categories: ${totalCategories}`)
    console.log(`Tags: ${totalTags}`)
  } catch (error) {
    console.error('Restore failed.')
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

main()
