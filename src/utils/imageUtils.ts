// Image optimization utilities

export interface ImageTransformOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png' | 'avif'
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right'
}

/**
 * Generate optimized image URL with transformations
 */
export function getOptimizedImageUrl(src: string): string {
  // If it's already an external URL or data URL, return as-is
  if (src.startsWith('http') || src.startsWith('data:')) {
    return src
  }

  // For local images, we'll rely on Next.js Image component optimization
  return src
}

/**
 * Generate responsive image sizes string
 */
export function getResponsiveSizes(
  breakpoints: { mobile?: number, tablet?: number, desktop?: number } = {}
): string {
  const { mobile = 768, tablet = 1200 } = breakpoints
  
  return `(max-width: ${mobile}px) 100vw, (max-width: ${tablet}px) 50vw, 33vw`
}

/**
 * Generate blur data URL for placeholder
 */
export function generateBlurDataURL(
  width: number = 10, 
  height: number = 10,
  color: string = '#f3f4f6'
): string {
  const canvas = typeof window !== 'undefined' ? document.createElement('canvas') : null
  
  if (!canvas) {
    // Fallback SVG blur placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${color}"/>
        <filter id="blur">
          <feGaussianBlur stdDeviation="2"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#blur)" fill="${color}" opacity="0.7"/>
      </svg>
    `
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
  }

  canvas.width = width
  canvas.height = height
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  
  ctx.fillStyle = color
  ctx.fillRect(0, 0, width, height)
  
  return canvas.toDataURL()
}

/**
 * Check if browser supports WebP format
 */
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false)
      return
    }

    const webP = new Image()
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2)
    }
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  })
}

/**
 * Check if browser supports AVIF format
 */
export function supportsAVIF(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false)
      return
    }

    const avif = new Image()
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2)
    }
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A='
  })
}

/**
 * Get optimal image format based on browser support
 */
export async function getOptimalFormat(): Promise<'avif' | 'webp' | 'jpeg'> {
  if (await supportsAVIF()) return 'avif'
  if (await supportsWebP()) return 'webp'
  return 'jpeg'
}

/**
 * Calculate aspect ratio from dimensions
 */
export function calculateAspectRatio(width: number, height: number): number {
  return width / height
}

/**
 * Get dimensions that maintain aspect ratio
 */
export function getMaintainedDimensions(
  originalWidth: number,
  originalHeight: number,
  targetWidth?: number,
  targetHeight?: number
): { width: number; height: number } {
  const aspectRatio = calculateAspectRatio(originalWidth, originalHeight)
  
  if (targetWidth && !targetHeight) {
    return {
      width: targetWidth,
      height: Math.round(targetWidth / aspectRatio)
    }
  }
  
  if (targetHeight && !targetWidth) {
    return {
      width: Math.round(targetHeight * aspectRatio),
      height: targetHeight
    }
  }
  
  if (targetWidth && targetHeight) {
    return { width: targetWidth, height: targetHeight }
  }
  
  return { width: originalWidth, height: originalHeight }
}

/**
 * Preload critical images
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

/**
 * Batch preload multiple images
 */
export async function preloadImages(sources: string[]): Promise<void> {
  await Promise.all(sources.map(preloadImage))
}

/**
 * Convert image file to WebP format (client-side)
 */
export function convertToWebP(file: File, quality: number = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      
      if (!ctx) {
        reject(new Error('Canvas context not available'))
        return
      }
      
      ctx.drawImage(img, 0, 0)
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to convert image'))
        }
      }, 'image/webp', quality)
    }
    
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Get image metadata (dimensions, size, etc.)
 */
export function getImageMetadata(file: File): Promise<{
  width: number
  height: number
  size: number
  type: string
  aspectRatio: number
}> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        size: file.size,
        type: file.type,
        aspectRatio: calculateAspectRatio(img.width, img.height)
      })
    }
    
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}