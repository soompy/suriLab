#!/usr/bin/env node

/**
 * 카테고리 정리 스크립트
 * 모든 중복 및 불필요한 카테고리를 정리합니다.
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function cleanupCategories() {
  try {
    console.log('🧹 카테고리 정리를 시작합니다...')
    
    // 모든 카테고리와 포스트 조회
    const allCategories = await prisma.category.findMany({
      include: {
        posts: true
      }
    })

    console.log('\n📋 현재 카테고리 상태:')
    allCategories.forEach(category => {
      console.log(`  - "${category.name}" (ID: ${category.id}) - ${category.posts.length}개 포스트`)
    })

    // "Developer Tips" 카테고리 확인
    const devTipsCategory = await prisma.category.findUnique({
      where: { name: 'Developer Tips' }
    })

    if (!devTipsCategory) {
      console.error('❌ "Developer Tips" 카테고리를 찾을 수 없습니다.')
      return
    }

    // 정리할 카테고리들 (tech, 기술 등)
    const categoriesToCleanup = allCategories.filter(cat => 
      cat.name === 'tech' || 
      cat.name === '기술' || 
      cat.id === 'tech' ||
      (cat.name !== 'Developer Tips' && cat.name !== 'Tech Insights' && cat.name !== 'Code Solutions')
    )

    for (const categoryToCleanup of categoriesToCleanup) {
      console.log(`\n🔄 "${categoryToCleanup.name}" 카테고리 정리 중...`)
      
      if (categoryToCleanup.posts.length > 0) {
        console.log(`📄 ${categoryToCleanup.posts.length}개 포스트를 "Developer Tips"로 이동합니다...`)
        
        // 포스트들을 Developer Tips로 이동
        await prisma.post.updateMany({
          where: { categoryId: categoryToCleanup.id },
          data: { categoryId: devTipsCategory.id }
        })

        console.log('✅ 포스트 이동 완료')
      }

      // 카테고리 삭제
      await prisma.category.delete({
        where: { id: categoryToCleanup.id }
      })

      console.log(`✅ "${categoryToCleanup.name}" 카테고리 삭제 완료`)
    }

    // 표준 카테고리 3개가 모두 있는지 확인하고 없으면 생성
    const standardCategories = [
      {
        id: 'tech-insights',
        name: 'Tech Insights',
        description: '기술 트렌드와 인사이트를 공유합니다.',
        color: '#8b5cf6'
      },
      {
        id: 'code-solutions',
        name: 'Code Solutions',
        description: '실무에서 마주하는 문제와 해결책을 다룹니다.',
        color: '#10b981'
      },
      {
        id: 'developer-tips',
        name: 'Developer Tips',
        description: '개발 생산성을 높이는 팁과 노하우를 제공합니다.',
        color: '#3b82f6'
      }
    ]

    for (const stdCategory of standardCategories) {
      await prisma.category.upsert({
        where: { name: stdCategory.name },
        update: {
          description: stdCategory.description,
          color: stdCategory.color
        },
        create: stdCategory
      })
    }

    // 최종 결과 확인
    const finalCategories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    console.log('\n✅ 카테고리 정리 완료!')
    console.log('\n📋 최종 카테고리 목록:')
    finalCategories.forEach(category => {
      console.log(`  - ${category.name} (${category._count.posts}개 포스트)`)
    })

  } catch (error) {
    console.error('❌ 카테고리 정리 중 오류가 발생했습니다:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// 스크립트 실행
cleanupCategories()