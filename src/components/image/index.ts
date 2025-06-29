export { default as OptimizedImage } from '../OptimizedImage'
export { default as AvatarImage } from './AvatarImage'
export { default as ThumbnailImage } from './ThumbnailImage'
export { ContentImage } from './ContentImage'
export { default as ProjectImage } from './ProjectImage'

// Re-export common types
export interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
  priority?: boolean
  quality?: number
  onClick?: () => void
}

// Image optimization utilities
export const imageConfig = {
  quality: {
    thumbnail: 75,
    content: 85,
    avatar: 90,
    hero: 95,
  },
  sizes: {
    thumbnail: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px',
    content: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px',
    avatar: '80px',
    hero: '100vw',
  },
  breakpoints: {
    mobile: 768,
    tablet: 1200,
    desktop: 1920,
  },
}