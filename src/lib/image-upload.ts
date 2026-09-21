export const MAX_IMAGE_SIZE = 4 * 1024 * 1024
export const IMAGE_ACCEPT = 'image/jpeg,image/png,image/gif,image/webp'

export function validateImageFile(file: { size: number; type: string }): string | null {
  if (!IMAGE_ACCEPT.split(',').includes(file.type)) return 'JPEG, PNG, GIF, WebP 이미지만 업로드할 수 있습니다.'
  if (!file.size || file.size > MAX_IMAGE_SIZE) return '이미지는 0바이트보다 크고 4MB 이하여야 합니다.'
  return null
}

export function matchesImageSignature(bytes: Uint8Array, type: string): boolean {
  const starts = (...values: number[]) => values.every((value, index) => bytes[index] === value)
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end))
  switch (type) {
    case 'image/jpeg': return starts(0xff, 0xd8, 0xff)
    case 'image/png': return starts(137, 80, 78, 71, 13, 10, 26, 10)
    case 'image/gif': return ['GIF87a', 'GIF89a'].includes(ascii(0, 6))
    case 'image/webp': return ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP'
    default: return false
  }
}
