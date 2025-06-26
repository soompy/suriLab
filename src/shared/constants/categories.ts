export const BLOG_CATEGORIES = [
  'Tech Insights',
  'Code Solutions', 
  'Study Journal'
] as const

export type BlogCategory = typeof BLOG_CATEGORIES[number]

export const CATEGORY_DESCRIPTIONS = {
  'Tech Insights': '기술 트렌드와 인사이트를 공유합니다.',
  'Code Solutions': '실무에서 마주하는 문제와 해결책을 다룹니다.',
  'Study Journal': '학습 과정과 기록을 공유하는 일지입니다.'
} as const

export const CATEGORY_COLORS = {
  'Tech Insights': 'linear-gradient(135deg, #B3E5FC, #81D4FA)',
  'Code Solutions': 'linear-gradient(135deg, #FFB5A7, #FCD29F)', 
  'Study Journal': 'linear-gradient(135deg, #F8BBD9, #E2E2FD)'
} as const