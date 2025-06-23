#!/usr/bin/env tsx

/**
 * PostgreSQL 마이그레이션 스크립트
 * SQLite에서 PostgreSQL로 데이터베이스를 마이그레이션합니다.
 */

import { PrismaClient } from '@prisma/client'

const sqlitePrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./database.db' // 로컬 SQLite 데이터베이스
    }
  }
})

const postgresqlPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRESQL_DATABASE_URL // PostgreSQL 데이터베이스
    }
  }
})

async function migrateData() {
  try {
    console.log('🚀 PostgreSQL 마이그레이션 시작...')

    // 1. PostgreSQL 데이터베이스에 연결
    await postgresqlPrisma.$connect()
    console.log('✅ PostgreSQL 연결 성공')

    // 2. SQLite 데이터 읽기
    console.log('📖 SQLite 데이터 읽는 중...')
    
    const users = await sqlitePrisma.user.findMany()
    const categories = await sqlitePrisma.category.findMany()
    const tags = await sqlitePrisma.tag.findMany()
    const posts = await sqlitePrisma.post.findMany({
      include: {
        tags: true
      }
    })
    const comments = await sqlitePrisma.comment.findMany()
    const likes = await sqlitePrisma.like.findMany()

    console.log(`📊 데이터 현황:`)
    console.log(`  - 사용자: ${users.length}개`)
    console.log(`  - 카테고리: ${categories.length}개`)
    console.log(`  - 태그: ${tags.length}개`)
    console.log(`  - 포스트: ${posts.length}개`)
    console.log(`  - 댓글: ${comments.length}개`)
    console.log(`  - 좋아요: ${likes.length}개`)

    // 3. PostgreSQL에 데이터 마이그레이션
    console.log('💾 PostgreSQL로 데이터 마이그레이션 중...')

    // 사용자 마이그레이션
    if (users.length > 0) {
      await postgresqlPrisma.user.createMany({
        data: users,
        skipDuplicates: true
      })
      console.log(`✅ 사용자 ${users.length}개 마이그레이션 완료`)
    }

    // 카테고리 마이그레이션
    if (categories.length > 0) {
      await postgresqlPrisma.category.createMany({
        data: categories,
        skipDuplicates: true
      })
      console.log(`✅ 카테고리 ${categories.length}개 마이그레이션 완료`)
    }

    // 태그 마이그레이션
    if (tags.length > 0) {
      await postgresqlPrisma.tag.createMany({
        data: tags,
        skipDuplicates: true
      })
      console.log(`✅ 태그 ${tags.length}개 마이그레이션 완료`)
    }

    // 포스트 마이그레이션 (태그 관계는 별도 처리)
    for (const post of posts) {
      const { tags: postTags, ...postData } = post
      
      // 포스트 생성
      const createdPost = await postgresqlPrisma.post.upsert({
        where: { id: post.id },
        update: postData,
        create: postData
      })

      // 태그 관계 설정
      if (postTags.length > 0) {
        await postgresqlPrisma.post.update({
          where: { id: createdPost.id },
          data: {
            tags: {
              connect: postTags.map(tag => ({ id: tag.id }))
            }
          }
        })
      }
    }
    console.log(`✅ 포스트 ${posts.length}개 마이그레이션 완료`)

    // 댓글 마이그레이션
    if (comments.length > 0) {
      await postgresqlPrisma.comment.createMany({
        data: comments,
        skipDuplicates: true
      })
      console.log(`✅ 댓글 ${comments.length}개 마이그레이션 완료`)
    }

    // 좋아요 마이그레이션
    if (likes.length > 0) {
      await postgresqlPrisma.like.createMany({
        data: likes,
        skipDuplicates: true
      })
      console.log(`✅ 좋아요 ${likes.length}개 마이그레이션 완료`)
    }

    console.log('🎉 PostgreSQL 마이그레이션 완료!')

  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error)
    throw error
  } finally {
    await sqlitePrisma.$disconnect()
    await postgresqlPrisma.$disconnect()
  }
}

// 스크립트 실행
if (require.main === module) {
  migrateData()
    .then(() => {
      console.log('✅ 마이그레이션 성공!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ 마이그레이션 실패:', error)
      process.exit(1)
    })
}

export { migrateData }