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

function ensureBackupDir() {
  const backupDir = path.join(process.cwd(), 'backups')
  fs.mkdirSync(backupDir, { recursive: true })
  return backupDir
}

async function main() {
  loadDotEnv()

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is missing. Add it to .env before running backup.')
    process.exit(1)
  }

  const prisma = new PrismaClient()

  try {
    await prisma.$queryRaw`SELECT 1`

    const [users, categories, tags, posts, comments, likes] = await Promise.all([
      prisma.user.findMany({
        orderBy: { id: 'asc' },
      }),
      prisma.category.findMany({
        orderBy: { name: 'asc' },
      }),
      prisma.tag.findMany({
        orderBy: { name: 'asc' },
      }),
      prisma.post.findMany({
        orderBy: { publishedAt: 'desc' },
        include: {
          category: true,
          tags: true,
          author: true,
        },
      }),
      prisma.comment.findMany({
        orderBy: { createdAt: 'asc' },
      }),
      prisma.like.findMany({
        orderBy: { createdAt: 'asc' },
      }),
    ])

    const backupData = {
      timestamp: new Date().toISOString(),
      version: '2.0-current-schema',
      schema: 'prisma/schema.prisma',
      statistics: {
        users: users.length,
        categories: categories.length,
        tags: tags.length,
        posts: posts.length,
        publishedPosts: posts.filter((post) => post.isPublished).length,
        comments: comments.length,
        likes: likes.length,
      },
      data: {
        users,
        categories,
        tags,
        posts,
        comments,
        likes,
      },
    }

    const backupDir = ensureBackupDir()
    const timestamp = backupData.timestamp.replace(/[:.]/g, '-')
    const backupFile = path.join(backupDir, `backup-current-schema-${timestamp}.json`)

    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2), 'utf8')

    console.log('Backup completed.')
    console.log(`File: ${backupFile}`)
    console.log(`Posts: ${backupData.statistics.publishedPosts} published / ${backupData.statistics.posts} total`)
    console.log(`Categories: ${backupData.statistics.categories}`)
    console.log(`Tags: ${backupData.statistics.tags}`)
    console.log(`Comments: ${backupData.statistics.comments}`)
    console.log(`Likes: ${backupData.statistics.likes}`)
  } catch (error) {
    console.error('Backup failed.')
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

main()
