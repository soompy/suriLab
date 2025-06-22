export const BLOG_CATEGORIES = [
  'Tech Insights',
  'Code Solutions', 
  'Developer Tips'
] as const

export type BlogCategory = typeof BLOG_CATEGORIES[number]

export const CATEGORY_DESCRIPTIONS = {
  'Tech Insights': '기술 트렌드와 인사이트를 공유합니다',
  'Code Solutions': '실무에서 마주하는 문제와 해결책을 다룹니다',
  'Developer Tips': '개발 생산성을 높이는 팁과 노하우를 제공합니다'
} as const

export const CATEGORY_COLORS = {
  'Tech Insights': 'linear-gradient(135deg, #B3E5FC, #81D4FA)',
  'Code Solutions': 'linear-gradient(135deg, #FFB5A7, #FCD29F)', 
  'Developer Tips': 'linear-gradient(135deg, #F8BBD9, #E2E2FD)'
} as const