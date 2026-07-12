export interface MarkdownHeading {
  id: string
  text: string
  level: 2 | 3
  line: number
}

const headingPattern = /^(#{2,3})\s+(.+)$/gm

export function getPlainHeadingText(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map(getPlainHeadingText).join('')
  }

  if (value && typeof value === 'object' && 'props' in value) {
    const props = (value as { props?: { children?: unknown } }).props
    return getPlainHeadingText(props?.children)
  }

  return String(value ?? '')
}

export function cleanMarkdownHeadingText(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function createHeadingSlug(text: string): string {
  const slug = cleanMarkdownHeadingText(text)
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return slug || 'section'
}

export function getUniqueHeadingId(text: string, counts: Map<string, number>): string {
  const baseId = createHeadingSlug(text)
  const nextCount = (counts.get(baseId) || 0) + 1
  counts.set(baseId, nextCount)

  return nextCount === 1 ? baseId : `${baseId}-${nextCount}`
}

export function extractMarkdownHeadings(content: string): MarkdownHeading[] {
  const counts = new Map<string, number>()
  const headings: MarkdownHeading[] = []
  let match: RegExpExecArray | null

  while ((match = headingPattern.exec(content)) !== null) {
    const level = match[1].length as 2 | 3
    const text = cleanMarkdownHeadingText(match[2])

    if (!text) continue

    headings.push({
      id: getUniqueHeadingId(text, counts),
      text,
      level,
      line: content.slice(0, match.index).split('\n').length
    })
  }

  return headings
}
