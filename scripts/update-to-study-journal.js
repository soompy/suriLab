#!/usr/bin/env node

/**
 * 카테고리 업데이트 스크립트
 * "Developer Tips" 카테고리를 "Study Journal"로 변경합니다.
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateToStudyJournal() {
  try {
    console.log('🔄 Developer Tips → Study Journal 변경을 시작합니다...')
    
    // 기존 "Developer Tips" 카테고리 확인
    const oldCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name: 'Developer Tips' },
          { id: 'developer-tips' }
        ]
      },
      include: {
        posts: true
      }
    })

    if (oldCategory) {
      console.log(`📁 기존 카테고리 발견: "${oldCategory.name}" (ID: ${oldCategory.id})`)
      console.log(`📄 연결된 포스트 수: ${oldCategory.posts.length}개`)

      // "Study Journal" 카테고리가 이미 있는지 확인
      const existingStudyJournal = await prisma.category.findUnique({
        where: { name: 'Study Journal' }
      })

      if (existingStudyJournal) {
        console.log('⚠️  "Study Journal" 카테고리가 이미 존재합니다.')
        console.log('기존 포스트들을 "Study Journal" 카테고리로 이동합니다...')

        // 포스트들을 새 카테고리로 이동
        await prisma.post.updateMany({
          where: { categoryId: oldCategory.id },
          data: { categoryId: existingStudyJournal.id }
        })

        // 기존 카테고리 삭제
        await prisma.category.delete({
          where: { id: oldCategory.id }
        })

        console.log('✅ 포스트 이동 및 기존 카테고리 삭제 완료')
      } else {
        // "Developer Tips" 카테고리를 "Study Journal"로 업데이트
        await prisma.category.update({
          where: { id: oldCategory.id },
          data: {
            id: 'study-journal',
            name: 'Study Journal',
            description: '학습 과정과 기록을 공유하는 일지입니다.',
            color: '#3b82f6'
          }
        })

        console.log('✅ 카테고리 업데이트 완료')
      }
    } else {
      console.log('ℹ️  "Developer Tips" 카테고리를 찾을 수 없습니다.')
    }

    // "Study Journal" 카테고리가 존재하는지 최종 확인
    const studyJournalCategory = await prisma.category.findUnique({
      where: { name: 'Study Journal' },
      include: {
        posts: true
      }
    })

    if (studyJournalCategory) {
      console.log('✅ "Study Journal" 카테고리 확인됨')
      console.log(`📄 연결된 포스트 수: ${studyJournalCategory.posts.length}개`)
    } else {
      console.log('⚠️  "Study Journal" 카테고리가 없습니다. 새로 생성합니다...')
      
      await prisma.category.create({
        data: {
          id: 'study-journal',
          name: 'Study Journal',
          description: '학습 과정과 기록을 공유하는 일지입니다.',
          color: '#3b82f6'
        }
      })

      console.log('✅ "Study Journal" 카테고리 생성 완료')
    }

    // 최종 카테고리 목록 출력
    const allCategories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })

    console.log('\n📋 현재 카테고리 목록:')
    allCategories.forEach(category => {
      console.log(`  - ${category.name} (${category._count.posts}개 포스트)`)
    })

    console.log('\n🎉 카테고리 업데이트가 완료되었습니다!')

  } catch (error) {
    console.error('❌ 카테고리 업데이트 중 오류가 발생했습니다:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// 스크립트 실행
updateToStudyJournal()