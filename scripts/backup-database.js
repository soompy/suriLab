#!/usr/bin/env node

/**
 * 데이터베이스 백업 스크립트
 * 포스트 데이터를 JSON 파일로 백업하여 데이터 손실을 방지합니다.
 */

const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function createBackup() {
  try {
    console.log('🔄 데이터베이스 백업을 시작합니다...')
    
    // 백업 디렉토리 생성
    const backupDir = path.join(process.cwd(), 'backups')
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    // 현재 시간으로 파일명 생성
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`)

    // 모든 데이터 조회
    const [posts, categories, tags, users, comments] = await Promise.all([
      prisma.post.findMany({
        include: {
          author: true,
          category: true,
          tags: true,
          comments: {
            include: {
              author: true
            }
          }
        }
      }),
      prisma.category.findMany(),
      prisma.tag.findMany(),
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.comment.findMany({
        include: {
          author: true,
          post: {
            select: {
              id: true,
              title: true,
              slug: true
            }
          }
        }
      })
    ])

    // 백업 데이터 구성
    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      statistics: {
        posts: posts.length,
        categories: categories.length,
        tags: tags.length,
        users: users.length,
        comments: comments.length
      },
      data: {
        posts,
        categories,
        tags,
        users,
        comments
      }
    }

    // 파일로 저장
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2), 'utf8')

    console.log('✅ 백업이 완료되었습니다!')
    console.log(`📁 백업 파일: ${backupFile}`)
    console.log(`📊 백업 통계:`)
    console.log(`   - 포스트: ${posts.length}개`)
    console.log(`   - 카테고리: ${categories.length}개`)
    console.log(`   - 태그: ${tags.length}개`)
    console.log(`   - 사용자: ${users.length}개`)
    console.log(`   - 댓글: ${comments.length}개`)

    // 오래된 백업 파일 정리 (10개 이상 시)
    cleanupOldBackups(backupDir)

  } catch (error) {
    console.error('❌ 백업 중 오류가 발생했습니다:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

function cleanupOldBackups(backupDir) {
  try {
    const backupFiles = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('backup-') && file.endsWith('.json'))
      .map(file => ({
        name: file,
        path: path.join(backupDir, file),
        stat: fs.statSync(path.join(backupDir, file))
      }))
      .sort((a, b) => b.stat.mtime - a.stat.mtime)

    if (backupFiles.length > 10) {
      const filesToDelete = backupFiles.slice(10)
      filesToDelete.forEach(file => {
        fs.unlinkSync(file.path)
        console.log(`🗑️  오래된 백업 파일 삭제: ${file.name}`)
      })
    }
  } catch (error) {
    console.warn('⚠️  백업 파일 정리 중 오류:', error.message)
  }
}

// 스크립트 실행
createBackup()