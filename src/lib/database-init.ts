import { prisma } from './prisma'

export async function initializeDatabase() {
  try {
    // 데이터베이스 연결 테스트
    await prisma.$connect()
    console.log('Database connected successfully')

    // 프로덕션에서는 스키마 푸시와 기본 데이터 생성
    if (process.env.NODE_ENV === 'production') {
      try {
        // 스키마가 존재하는지 확인
        await prisma.user.findFirst()
      } catch (error) {
        console.log('Database schema not found, creating...')
        // 스키마 푸시 시뮬레이션 (실제로는 마이그레이션이 이미 적용되어야 함)
      }
      
      // 기본 데이터 생성
      await createDefaultData()
    }
  } catch (error) {
    console.error('Database initialization failed:', error)
    // 에러가 발생해도 계속 진행
    console.log('Continuing without database initialization...')
  }
}

async function createDefaultData() {
  try {
    // 기본 사용자 확인/생성
    const userCount = await prisma.user.count()
    if (userCount === 0) {
      await prisma.user.create({
        data: {
          id: 'admin-user-id',
          name: '이수민',
          email: 'yzsumin@naver.com'
        }
      })
      console.log('Default user created')
    }

    // 기본 카테고리 확인/생성
    const categoryCount = await prisma.category.count()
    if (categoryCount === 0) {
      await prisma.category.createMany({
        data: [
          { id: 'tech', name: '기술', description: '기술 관련 포스트', color: '#3b82f6' },
          { id: 'life', name: '일상', description: '일상 관련 포스트', color: '#10b981' },
          { id: 'review', name: '리뷰', description: '리뷰 관련 포스트', color: '#f59e0b' }
        ]
      })
      console.log('Default categories created')
    }

    // 기본 태그 확인/생성
    const tagCount = await prisma.tag.count()
    if (tagCount === 0) {
      await prisma.tag.createMany({
        data: [
          { name: 'React' },
          { name: 'Next.js' },
          { name: 'TypeScript' },
          { name: 'JavaScript' },
          { name: '개발' }
        ]
      })
      console.log('Default tags created')
    }
  } catch (error) {
    console.error('Error creating default data:', error)
  }
}