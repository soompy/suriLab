import { prisma } from './prisma'

export async function initializeDatabase() {
  try {
    // 데이터베이스 연결 테스트
    await prisma.$connect()
    console.log('Database connected successfully')

    // 프로덕션에서는 기본 데이터 생성
    if (process.env.NODE_ENV === 'production') {
      // 기본 데이터 생성 (스키마는 이미 존재한다고 가정)
      await createDefaultData()
    }
  } catch (error) {
    console.error('Database initialization failed:', error)
    // 에러가 발생해도 계속 진행
    console.log('Continuing without database initialization...')
  }
}

// 스키마 생성 함수는 필요시에만 사용
// async function createSchema() { ... }

async function createDefaultData() {
  try {
    // 기본 사용자 확인/생성
    const existingUser = await prisma.user.findFirst({ where: { email: 'yzsumin@naver.com' } })
    if (!existingUser) {
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
    const existingCategory = await prisma.category.findFirst({ where: { name: '기술' } })
    if (!existingCategory) {
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
    const existingTag = await prisma.tag.findFirst({ where: { name: 'React' } })
    if (!existingTag) {
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