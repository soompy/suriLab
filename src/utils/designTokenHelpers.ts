import { designTokens } from '@/config/designTokens'

export const getSpacing = (size: keyof typeof designTokens.spacing) => {
  return designTokens.spacing[size]
}

export const getColor = (
  category: keyof typeof designTokens.colors,
  variant?: string | number
) => {
  const colorCategory = designTokens.colors[category]
  
  if (typeof colorCategory === 'string') {
    return colorCategory
  }
  
  if (typeof colorCategory === 'object' && variant) {
    return colorCategory[variant as keyof typeof colorCategory]
  }
  
  return colorCategory
}

export const getTypography = (
  property: keyof typeof designTokens.typography,
  variant?: string
) => {
  const typographyProperty = designTokens.typography[property]
  
  if (typeof typographyProperty === 'object' && variant) {
    return typographyProperty[variant as keyof typeof typographyProperty]
  }
  
  return typographyProperty
}

export const getShadow = (variant: keyof typeof designTokens.shadow = 'DEFAULT') => {
  return designTokens.shadow[variant]
}

export const getBorderRadius = (variant: keyof typeof designTokens.borderRadius = 'DEFAULT') => {
  return designTokens.borderRadius[variant]
}

export const getBreakpoint = (size: keyof typeof designTokens.breakpoints) => {
  return designTokens.breakpoints[size]
}

export const getDuration = (variant: keyof typeof designTokens.duration) => {
  return designTokens.duration[variant]
}

export const getEase = (variant: keyof typeof designTokens.ease) => {
  return designTokens.ease[variant]
}

export const getZIndex = (variant: keyof typeof designTokens.zIndex) => {
  return designTokens.zIndex[variant]
}

// 테마별 색상 헬퍼
export const getThemedColor = (
  isDarkMode: boolean,
  lightColor: string,
  darkColor: string
) => {
  return isDarkMode ? darkColor : lightColor
}

// 반응형 미디어 쿼리 생성
export const createMediaQuery = (breakpoint: keyof typeof designTokens.breakpoints) => {
  return `@media (min-width: ${designTokens.breakpoints[breakpoint]})`
}

// 그라데이션 색상 생성
export const createGradient = (
  direction: string,
  colors: string[]
) => {
  return `linear-gradient(${direction}, ${colors.join(', ')})`
}

// 타이포그래피 스타일 조합
export const createTypographyStyle = (
  fontSize: keyof typeof designTokens.typography.fontSize,
  fontWeight: keyof typeof designTokens.typography.fontWeight,
  lineHeight: keyof typeof designTokens.typography.lineHeight
) => {
  return {
    fontSize: designTokens.typography.fontSize[fontSize],
    fontWeight: designTokens.typography.fontWeight[fontWeight],
    lineHeight: designTokens.typography.lineHeight[lineHeight],
  }
}

// 박스 섀도우 조합
export const createBoxShadow = (
  shadows: (keyof typeof designTokens.shadow)[]
) => {
  return shadows.map(shadow => designTokens.shadow[shadow]).join(', ')
}

// 간격 계산
export const calculateSpacing = (
  base: keyof typeof designTokens.spacing,
  multiplier: number
) => {
  const baseValue = parseFloat(designTokens.spacing[base].replace('rem', ''))
  return `${baseValue * multiplier}rem`
}

// 색상 투명도 조절
export const applyOpacity = (color: string, opacity: number) => {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }
  return color
}