export const BLOG_CATEGORIES = [
  'MomentTune',
  'Startup',
  'AI Automation',
  'Product & UX',
  'Build Log',
  'Blog Growth',
  'Tech Insights',
  'Code Solutions', 
  'Study Journal'
] as const

export type BlogCategory = typeof BLOG_CATEGORIES[number]

export const CATEGORY_DESCRIPTIONS = {
  'MomentTune': 'MomentTune 제작 과정, 의사결정, 출시 준비를 기록합니다.',
  'Startup': '1인 창업, MVP 제작, 실험과 검증 과정을 다룹니다.',
  'AI Automation': 'AI 에이전트와 업무 자동화 실험을 정리합니다.',
  'Product & UX': '서비스 기획, UX/UI, 제품 사고를 다룹니다.',
  'Build Log': 'AI 코딩 도구와 실제 빌드 과정을 기록합니다.',
  'Blog Growth': '블로그 운영, SEO, 수익화 실험을 공유합니다.',
  'Tech Insights': '기술 트렌드와 인사이트를 공유합니다.',
  'Code Solutions': '실무에서 마주하는 문제와 해결책을 다룹니다.',
  'Study Journal': '학습 과정과 기록을 공유하는 일지입니다.'
} as const

export const CATEGORY_COLORS = {
  'MomentTune': 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
  'Startup': 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
  'AI Automation': 'linear-gradient(135deg, #E0F2FE, #BAE6FD)',
  'Product & UX': 'linear-gradient(135deg, #FCE7F3, #FBCFE8)',
  'Build Log': 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
  'Blog Growth': 'linear-gradient(135deg, #EDE9FE, #DDD6FE)',
  'Tech Insights': 'linear-gradient(135deg, #B3E5FC, #81D4FA)',
  'Code Solutions': 'linear-gradient(135deg, #FFB5A7, #FCD29F)', 
  'Study Journal': 'linear-gradient(135deg, #F8BBD9, #E2E2FD)'
} as const
