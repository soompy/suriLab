#!/usr/bin/env tsx

/**
 * SQLite에서 Neon PostgreSQL로 데이터 마이그레이션
 * 
 * 실행 방법:
 * 1. .env 파일에 Neon DATABASE_URL 설정
 * 2. npm run db:migrate-to-neon
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

// SQLite 데이터베이스 존재 확인
const sqliteDbPath = path.join(process.cwd(), 'prisma', 'dev.db')
const hasExistingData = fs.existsSync(sqliteDbPath)

if (!hasExistingData) {
  console.log('📝 No existing SQLite database found. Starting with fresh PostgreSQL database.')
  process.exit(0)
}

// 임시로 환경변수를 백업하고 SQLite용으로 변경
const originalUrl = process.env.DATABASE_URL
process.env.DATABASE_URL = `file:${sqliteDbPath}`

// SQLite 클라이언트 (기존 데이터)
const sqliteClient = new PrismaClient()

// PostgreSQL 클라이언트를 위해 원래 URL 복원
process.env.DATABASE_URL = originalUrl
const postgresClient = new PrismaClient()

async function migrateData() {
  try {
    console.log('🚀 Starting migration from SQLite to Neon PostgreSQL...')
    
    // 1. 사용자 마이그레이션
    console.log('📊 Migrating users...')
    const users = await sqliteClient.user.findMany()
    if (users.length > 0) {
      await postgresClient.user.createMany({
        data: users,
        skipDuplicates: true
      })
      console.log(`✅ Migrated ${users.length} users`)
    }

    // 2. 카테고리 마이그레이션
    console.log('📂 Migrating categories...')
    const categories = await sqliteClient.category.findMany()
    if (categories.length > 0) {
      await postgresClient.category.createMany({
        data: categories,
        skipDuplicates: true
      })
      console.log(`✅ Migrated ${categories.length} categories`)
    }

    // 3. 태그 마이그레이션
    console.log('🏷️ Migrating tags...')
    const tags = await sqliteClient.tag.findMany()
    if (tags.length > 0) {
      await postgresClient.tag.createMany({
        data: tags,
        skipDuplicates: true
      })
      console.log(`✅ Migrated ${tags.length} tags`)
    }

    // 4. 포스트 마이그레이션 (관계 데이터 포함)
    console.log('📝 Migrating posts...')
    const posts = await sqliteClient.post.findMany({
      include: {
        tags: true
      }
    })
    
    for (const post of posts) {
      const { tags: postTags, ...postData } = post
      
      // 포스트 생성
      const createdPost = await postgresClient.post.create({
        data: {
          ...postData,
          tags: {
            connect: postTags.map(tag => ({ id: tag.id }))
          }
        }
      })
      console.log(`✅ Migrated post: ${createdPost.title}`)
    }

    // 5. 댓글 마이그레이션
    console.log('💬 Migrating comments...')
    const comments = await sqliteClient.comment.findMany()
    if (comments.length > 0) {
      await postgresClient.comment.createMany({
        data: comments,
        skipDuplicates: true
      })
      console.log(`✅ Migrated ${comments.length} comments`)
    }

    // 6. 좋아요 마이그레이션
    console.log('❤️ Migrating likes...')
    const likes = await sqliteClient.like.findMany()
    if (likes.length > 0) {
      await postgresClient.like.createMany({
        data: likes,
        skipDuplicates: true
      })
      console.log(`✅ Migrated ${likes.length} likes`)
    }

    console.log('🎉 Migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await sqliteClient.$disconnect()
    await postgresClient.$disconnect()
  }
}

// 스크립트 실행
if (require.main === module) {
  migrateData()
    .then(() => {
      console.log('✨ All done! Your data has been migrated to Neon PostgreSQL.')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error)
      process.exit(1)
    })
}

export { migrateData }