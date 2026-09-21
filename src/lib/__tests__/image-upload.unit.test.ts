import { IMAGE_ACCEPT, MAX_IMAGE_SIZE, matchesImageSignature, validateImageFile } from '../image-upload'

describe('image upload validation', () => {
  it.each(IMAGE_ACCEPT.split(','))('accepts %s within the size limit', type => {
    expect(validateImageFile({ type, size: MAX_IMAGE_SIZE })).toBeNull()
  })
  it.each([0, MAX_IMAGE_SIZE + 1])('rejects invalid size %s', size => {
    expect(validateImageFile({ type: 'image/png', size })).not.toBeNull()
  })
  it('rejects active content and spoofed image types', () => {
    expect(validateImageFile({ type: 'image/svg+xml', size: 100 })).not.toBeNull()
    expect(matchesImageSignature(new Uint8Array([60, 115, 99, 114, 105, 112, 116, 62]), 'image/png')).toBe(false)
  })
  it.each([
    ['image/png', [137, 80, 78, 71, 13, 10, 26, 10]],
    ['image/jpeg', [255, 216, 255]],
    ['image/gif', [71, 73, 70, 56, 57, 97]],
    ['image/webp', [82, 73, 70, 70, 0, 0, 0, 0, 87, 69, 66, 80]],
  ])('recognizes %s signatures', (type, bytes) => {
    expect(matchesImageSignature(new Uint8Array(bytes as number[]), type as string)).toBe(true)
  })
})
