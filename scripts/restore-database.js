#!/usr/bin/env node

/**
 * 데이터베이스 복구 스크립트
 * 백업된 JSON 파일로부터 데이터를 복구합니다.
 */

const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function restoreFromBackup(backupFilePath) {
  try {
    console.log('🔄 데이터베이스 복구를 시작합니다...')
    
    // 백업 파일 존재 확인
    if (!fs.existsSync(backupFilePath)) {
      console.error(`❌ 백업 파일을 찾을 수 없습니다: ${backupFilePath}`)
      process.exit(1)
    }

    // 백업 데이터 로드
    const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'))
    
    console.log(`📅 백업 생성 시간: ${new Date(backupData.timestamp).toLocaleString('ko-KR')}`)
    console.log(`📊 백업 통계:`)
    console.log(`   - 포스트: ${backupData.statistics.posts}개`)
    console.log(`   - 카테고리: ${backupData.statistics.categories}개`)
    console.log(`   - 태그: ${backupData.statistics.tags}개`)
    console.log(`   - 사용자: ${backupData.statistics.users}개`)
    console.log(`   - 댓글: ${backupData.statistics.comments}개`)

    // 복구 확인
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })

    const confirmation = await new Promise((resolve) => {
      readline.question('⚠️  기존 데이터가 모두 삭제되고 백업 데이터로 교체됩니다. 계속하시겠습니까? (y/N): ', resolve)
    })
    readline.close()

    if (confirmation.toLowerCase() !== 'y' && confirmation.toLowerCase() !== 'yes') {
      console.log('❌ 복구가 취소되었습니다.')
      process.exit(0)
    }

    // 트랜잭션으로 데이터 복구
    await prisma.$transaction(async (tx) => {
      // 기존 데이터 삭제 (순서 중요)
      console.log('🗑️  기존 데이터 삭제 중...')
      await tx.comment.deleteMany()
      await tx.post.deleteMany()
      await tx.tag.deleteMany()
      await tx.category.deleteMany()
      await tx.user.deleteMany()

      // 사용자 복구
      if (backupData.data.users.length > 0) {
        console.log('👥 사용자 데이터 복구 중...')
        for (const user of backupData.data.users) {
          await tx.user.create({
            data: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt
            }
          })
        }
      }

      // 카테고리 복구
      if (backupData.data.categories.length > 0) {
        console.log('📁 카테고리 데이터 복구 중...')
        for (const category of backupData.data.categories) {
          await tx.category.create({
            data: {
              id: category.id,
              name: category.name,
              description: category.description,
              slug: category.slug,
              createdAt: category.createdAt,
              updatedAt: category.updatedAt
            }
          })
        }
      }

      // 태그 복구
      if (backupData.data.tags.length > 0) {
        console.log('🏷️  태그 데이터 복구 중...')
        for (const tag of backupData.data.tags) {
          await tx.tag.create({
            data: {
              id: tag.id,
              name: tag.name,
              createdAt: tag.createdAt,
              updatedAt: tag.updatedAt
            }
          })
        }
      }

      // 포스트 복구
      if (backupData.data.posts.length > 0) {
        console.log('📝 포스트 데이터 복구 중...')
        for (const post of backupData.data.posts) {
          const createdPost = await tx.post.create({
            data: {
              id: post.id,
              title: post.title,
              content: post.content,
              excerpt: post.excerpt,
              slug: post.slug,
              isPublished: post.isPublished,
              isFeatured: post.isFeatured,
              views: post.views,
              readTime: post.readTime,
              authorId: post.authorId,
              categoryId: post.categoryId,
              publishedAt: post.publishedAt,
              createdAt: post.createdAt,
              updatedAt: post.updatedAt
            }
          })

          // 포스트 태그 연결
          if (post.tags && post.tags.length > 0) {
            await tx.post.update({
              where: { id: createdPost.id },
              data: {
                tags: {
                  connect: post.tags.map(tag => ({ id: tag.id }))
                }
              }
            })
          }
        }
      }

      // 댓글 복구
      if (backupData.data.comments.length > 0) {
        console.log('💬 댓글 데이터 복구 중...')
        for (const comment of backupData.data.comments) {
          await tx.comment.create({
            data: {
              id: comment.id,
              content: comment.content,
              authorId: comment.authorId,
              postId: comment.postId,
              parentId: comment.parentId,
              createdAt: comment.createdAt,
              updatedAt: comment.updatedAt
            }
          })
        }
      }
    })

    console.log('✅ 데이터베이스 복구가 완료되었습니다!')

  } catch (error) {
    console.error('❌ 복구 중 오류가 발생했습니다:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// 스크립트 실행
const backupFilePath = process.argv[2]
if (!backupFilePath) {
  console.error('❌ 백업 파일 경로를 지정해주세요.')
  console.log('사용법: node scripts/restore-database.js <백업파일경로>')
  console.log('예시: node scripts/restore-database.js backups/backup-2024-01-01T00-00-00-000Z.json')
  process.exit(1)
}

restoreFromBackup(backupFilePath)