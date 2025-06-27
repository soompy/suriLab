import { NextRequest, NextResponse } from 'next/server'

interface SummarizeRequest {
  content: string
  title?: string
}

export async function POST(request: NextRequest) {
  try {
    const { content }: SummarizeRequest = await request.json()

    if (!content || content.trim().length < 50) {
      return NextResponse.json(
        { error: '요약할 내용이 너무 짧습니다. 최소 50자 이상 입력해주세요.' },
        { status: 400 }
      )
    }

    // AI 요약 로직 - 현재는 간단한 휴리스틱 기반 요약 구현
    const summary = generateSummary(content)

    return NextResponse.json({
      success: true,
      summary,
      wordCount: content.split(' ').length,
      charCount: content.length
    })

  } catch (error) {
    console.error('Summarize error:', error)
    return NextResponse.json(
      { error: '요약 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

function generateSummary(content: string): string {
  // 마크다운 제거 및 텍스트 정리
  const cleanContent = content
    .replace(/#{1,6}\s+/g, '') // 헤딩 제거
    .replace(/\*\*(.*?)\*\*/g, '$1') // 볼드 제거
    .replace(/\*(.*?)\*/g, '$1') // 이탤릭 제거
    .replace(/`(.*?)`/g, '$1') // 인라인 코드 제거
    .replace(/```[\s\S]*?```/g, '') // 코드 블록 완전 제거
    .replace(/!\[.*?\]\(.*?\)/g, '') // 이미지 완전 제거
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 링크에서 텍스트만 추출
    .replace(/>\s+/g, '') // 인용문 기호 제거
    .replace(/[-*+]\s+/g, '') // 리스트 기호 제거
    .replace(/\n+/g, ' ') // 줄바꿈을 공백으로 변경
    .replace(/\s+/g, ' ') // 연속 공백 정리
    .trim()

  if (!cleanContent) {
    return '내용을 입력하면 AI가 자동으로 요약을 생성합니다.'
  }

  // 문장 분리
  const sentences = cleanContent
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 15) // 더 긴 문장만 선택

  if (sentences.length === 0) {
    return '요약할 수 있는 충분한 내용이 없습니다.'
  }

  // 핵심 키워드 추출 (더 엄격한 필터링)
  const words = cleanContent.toLowerCase()
    .replace(/[^\w\s가-힣]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2)

  const wordFreq: { [key: string]: number } = {}
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1
  })

  // 확장된 불용어 제거
  const stopWords = [
    '그리고', '그런데', '하지만', '그러나', '또한', '그래서', '따라서', 
    '이것', '저것', '것이', '것을', '수가', '있다', '없다', '한다', '된다', 
    '이다', '아니다', '때문', '경우', '상황', '방법', '문제', '결과',
    '통해', '위해', '대해', '관련', '필요', '가능', '중요', '다양',
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'was', 'one', 'our'
  ]
  stopWords.forEach(word => delete wordFreq[word])

  // 상위 키워드 선택 (더 적게)
  const topWords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([word]) => word)

  // 문장 점수 계산 (더 엄격한 기준)
  const sentenceScores = sentences.map(sentence => {
    const lowerSentence = sentence.toLowerCase()
    let score = 0
    
    // 키워드 포함 점수 (가중치 증가)
    topWords.forEach(word => {
      if (lowerSentence.includes(word)) {
        score += (wordFreq[word] || 0) * 2
      }
    })
    
    // 첫 번째 문장에 높은 가중치
    const index = sentences.indexOf(sentence)
    if (index === 0) score += 5
    else if (index < sentences.length * 0.2) score += 3
    
    // 핵심 표현이 포함된 문장 우선
    const keyPhrases = ['목적', '목표', '중심', '핵심', '주요', '특징', '장점', '방법', '해결', '개발', '구현', '활용']
    keyPhrases.forEach(phrase => {
      if (lowerSentence.includes(phrase)) {
        score += 3
      }
    })
    
    // 적절한 길이의 문장 선호 (40-120자)
    const length = sentence.length
    if (length >= 40 && length <= 120) score += 2

    return { sentence, score, index }
  })

  // 최고 점수의 1-2개 문장만 선택
  const topSentences = sentenceScores
    .sort((a, b) => b.score - a.score)
    .slice(0, sentences.length === 1 ? 1 : 2) // 전체 문장이 1개면 1개, 아니면 2개
    .sort((a, b) => a.index - b.index) // 원래 순서대로 정렬
    .map(item => item.sentence.trim())

  let summary = topSentences.join('. ')
  
  // 문장 끝 정리
  if (summary && !summary.match(/[.!?]$/)) {
    summary += '.'
  }

  // 길이 제한 (100자 이내로 더 짧게)
  if (summary.length > 100) {
    // 첫 번째 문장만 사용하거나 적절히 자르기
    const firstSentence = topSentences[0]
    if (firstSentence && firstSentence.length <= 100) {
      summary = firstSentence
    } else {
      summary = summary.substring(0, 97) + '...'
    }
  }

  // 너무 짧은 경우 첫 번째 문장 사용
  if (summary.length < 20) {
    const firstSentence = sentences[0]
    if (firstSentence) {
      summary = firstSentence.length > 100 
        ? firstSentence.substring(0, 97) + '...'
        : firstSentence
    }
  }

  return summary || '내용을 더 입력해주시면 더 정확한 요약을 생성할 수 있습니다.'
}