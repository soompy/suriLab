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
    .replace(/```[\s\S]*?```/g, '[코드 블록]') // 코드 블록을 간단히 표시
    .replace(/!\[.*?\]\(.*?\)/g, '[이미지]') // 이미지를 간단히 표시
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
    .filter(s => s.length > 10) // 너무 짧은 문장 제거

  if (sentences.length === 0) {
    return '요약할 수 있는 충분한 내용이 없습니다.'
  }

  // 중요 키워드 추출 (간단한 TF-IDF 기반)
  const words = cleanContent.toLowerCase()
    .replace(/[^\w\s가-힣]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2)

  const wordFreq: { [key: string]: number } = {}
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1
  })

  // 불용어 제거 (간단한 버전)
  const stopWords = ['그리고', '그런데', '하지만', '그러나', '또한', '그래서', '따라서', '이것', '저것', '것이', '것을', '수가', '있다', '없다', '한다', '된다', '이다', '아니다']
  stopWords.forEach(word => delete wordFreq[word])

  // 상위 키워드 선택
  const topWords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word)

  // 키워드가 포함된 문장들의 점수 계산
  const sentenceScores = sentences.map(sentence => {
    const lowerSentence = sentence.toLowerCase()
    let score = 0
    
    // 키워드 포함 점수
    topWords.forEach(word => {
      if (lowerSentence.includes(word)) {
        score += wordFreq[word] || 0
      }
    })
    
    // 문장 위치 점수 (앞부분과 뒷부분에 가중치)
    const index = sentences.indexOf(sentence)
    if (index < sentences.length * 0.3) score += 2 // 앞부분
    if (index > sentences.length * 0.7) score += 1 // 뒷부분
    
    // 문장 길이 점수 (너무 짧거나 길지 않은 문장 선호)
    const length = sentence.length
    if (length > 30 && length < 150) score += 1

    return { sentence, score, index }
  })

  // 상위 문장들 선택 (전체의 20-30% 또는 최대 3문장)
  const selectedCount = Math.min(3, Math.max(1, Math.ceil(sentences.length * 0.25)))
  const topSentences = sentenceScores
    .sort((a, b) => b.score - a.score)
    .slice(0, selectedCount)
    .sort((a, b) => a.index - b.index) // 원래 순서대로 정렬
    .map(item => item.sentence)

  let summary = topSentences.join('. ')
  
  // 문장 끝 정리
  if (summary && !summary.match(/[.!?]$/)) {
    summary += '.'
  }

  // 길이 제한 (150자 이내)
  if (summary.length > 150) {
    summary = summary.substring(0, 147) + '...'
  }

  // 최소 길이 보장
  if (summary.length < 20) {
    const firstSentence = sentences[0]
    if (firstSentence) {
      summary = firstSentence.length > 150 
        ? firstSentence.substring(0, 147) + '...'
        : firstSentence
    }
  }

  return summary || '내용을 더 입력해주시면 더 정확한 요약을 생성할 수 있습니다.'
}