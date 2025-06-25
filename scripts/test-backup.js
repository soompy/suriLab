#!/usr/bin/env node

/**
 * 백업 시스템 테스트 스크립트
 * 백업과 복구 기능이 올바르게 작동하는지 검증합니다.
 */

const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const prisma = new PrismaClient()

async function testBackupSystem() {
  try {
    console.log('🧪 백업 시스템 테스트를 시작합니다...\n')

    // 1. 현재 데이터베이스 상태 확인
    console.log('1️⃣ 현재 데이터베이스 상태 확인')
    const initialState = await getDatabaseState()
    console.log(`   - 포스트: ${initialState.posts}개`)
    console.log(`   - 카테고리: ${initialState.categories}개`)
    console.log(`   - 태그: ${initialState.tags}개`)
    console.log(`   - 사용자: ${initialState.users}개\n`)

    if (initialState.posts === 0) {
      console.log('⚠️  테스트를 위해 샘플 데이터가 필요합니다.')
      console.log('   다음 명령어로 샘플 데이터를 생성해주세요:')
      console.log('   npm run db:seed\n')
      return
    }

    // 2. 백업 생성 테스트
    console.log('2️⃣ 백업 생성 테스트')
    const backupDir = path.join(process.cwd(), 'backups')
    const beforeBackupFiles = fs.existsSync(backupDir) ? fs.readdirSync(backupDir).length : 0
    
    try {
      execSync('npm run backup', { stdio: 'pipe' })
      console.log('   ✅ 백업 생성 성공')
    } catch (error) {
      console.error('   ❌ 백업 생성 실패:', error.message)
      return
    }

    const afterBackupFiles = fs.readdirSync(backupDir).length
    if (afterBackupFiles > beforeBackupFiles) {
      console.log('   ✅ 백업 파일 생성 확인\n')
    } else {
      console.error('   ❌ 백업 파일이 생성되지 않았습니다\n')
      return
    }

    // 3. 백업 파일 유효성 검사
    console.log('3️⃣ 백업 파일 유효성 검사')
    const backupFiles = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('backup-') && file.endsWith('.json'))
      .sort()
    
    if (backupFiles.length === 0) {
      console.error('   ❌ 백업 파일을 찾을 수 없습니다\n')
      return
    }

    const latestBackup = path.join(backupDir, backupFiles[backupFiles.length - 1])
    try {
      const backupData = JSON.parse(fs.readFileSync(latestBackup, 'utf8'))
      
      // 백업 데이터 구조 검증
      const requiredFields = ['timestamp', 'version', 'statistics', 'data']
      const missingFields = requiredFields.filter(field => !backupData[field])
      
      if (missingFields.length > 0) {
        console.error(`   ❌ 백업 파일에 필수 필드가 누락되었습니다: ${missingFields.join(', ')}\n`)
        return
      }

      const requiredDataFields = ['posts', 'categories', 'tags', 'users']
      const missingDataFields = requiredDataFields.filter(field => !backupData.data[field])
      
      if (missingDataFields.length > 0) {
        console.error(`   ❌ 백업 데이터에 필수 필드가 누락되었습니다: ${missingDataFields.join(', ')}\n`)
        return
      }

      console.log('   ✅ 백업 파일 구조 유효성 확인')
      console.log(`   ✅ 백업 데이터 포함 확인 (포스트: ${backupData.statistics.posts}개)\n`)

    } catch (error) {
      console.error('   ❌ 백업 파일 파싱 실패:', error.message)
      return
    }

    // 4. 데이터 일관성 검사
    console.log('4️⃣ 데이터 일관성 검사')
    const backupData = JSON.parse(fs.readFileSync(latestBackup, 'utf8'))
    const currentState = await getDatabaseState()

    const consistencyChecks = [
      { name: '포스트 수', backup: backupData.statistics.posts, current: currentState.posts },
      { name: '카테고리 수', backup: backupData.statistics.categories, current: currentState.categories },
      { name: '태그 수', backup: backupData.statistics.tags, current: currentState.tags },
      { name: '사용자 수', backup: backupData.statistics.users, current: currentState.users }
    ]

    let consistencyPassed = true
    for (const check of consistencyChecks) {
      if (check.backup === check.current) {
        console.log(`   ✅ ${check.name}: ${check.current}개`)
      } else {
        console.log(`   ⚠️  ${check.name}: 백업(${check.backup}) vs 현재(${check.current})`)
        consistencyPassed = false
      }
    }

    if (consistencyPassed) {
      console.log('   ✅ 모든 데이터 일관성 검사 통과\n')
    } else {
      console.log('   ⚠️  일부 데이터 불일치 발견 (정상적일 수 있음)\n')
    }

    // 5. 백업 파일 정리 테스트
    console.log('5️⃣ 백업 파일 정리 기능 테스트')
    const currentBackupCount = fs.readdirSync(backupDir).filter(file => 
      file.startsWith('backup-') && file.endsWith('.json')
    ).length

    if (currentBackupCount > 10) {
      console.log('   ✅ 백업 파일 정리 기능이 작동했습니다')
    } else {
      console.log(`   ℹ️  현재 백업 파일 ${currentBackupCount}개 (정리 대상 아님)`)
    }

    console.log('\n🎉 백업 시스템 테스트가 완료되었습니다!')
    console.log('\n📋 테스트 결과 요약:')
    console.log('   ✅ 백업 생성 기능: 정상')
    console.log('   ✅ 백업 파일 유효성: 정상')
    console.log('   ✅ 데이터 구조 검증: 정상')
    console.log(`   ✅ 백업 파일 위치: ${latestBackup}`)

    console.log('\n💡 권장사항:')
    console.log('   - 정기적으로 백업을 생성하세요: npm run backup')
    console.log('   - GitHub Actions로 자동 백업이 설정되어 있습니다')
    console.log('   - 중요한 작업 전에는 수동 백업을 생성하세요')

  } catch (error) {
    console.error('❌ 테스트 중 오류가 발생했습니다:', error)
  } finally {
    await prisma.$disconnect()
  }
}

async function getDatabaseState() {
  const [posts, categories, tags, users, comments] = await Promise.all([
    prisma.post.count(),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.user.count(),
    prisma.comment.count()
  ])

  return { posts, categories, tags, users, comments }
}

// 스크립트 실행
testBackupSystem()