import fs from 'fs'
import path from 'path'
import type { PostEntity } from '@/entities/Post'

export const CONTENT_ROOT = path.join(process.cwd(), 'content')

export const CONTENT_CATEGORIES = [
  'MomentTune',
  'AI Workflow',
  'Build Log',
  'Startup',
  'Career',
] as const

export const CONTENT_STATUSES = [
  'idea',
  'draft',
  'review',
  'published',
] as const

export type ContentCategory = (typeof CONTENT_CATEGORIES)[number]
export type ContentStatus = (typeof CONTENT_STATUSES)[number]

export interface ContentFrontMatter {
  title: string
  description: string
  date: string
  updated: string
  category: ContentCategory
  tags: string[]
  slug: string
  status: ContentStatus
  featured: boolean
  relatedPosts: string[]
}

export interface ContentPostEntity extends PostEntity {
  source: 'content'
  status: ContentStatus
  relatedPosts: string[]
  filePath: string
}

const CONTENT_DIRECTORIES = [
  'momenttune',
  'ai-workflow',
  'build-log',
  'startup',
  'career',
]

function parseScalar(value: string) {
  const trimmed = value.trim()

  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (trimmed === '[]') return []
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean)
  }

  return trimmed.replace(/^["']|["']$/g, '')
}

export function parseFrontMatter(markdown: string) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)

  if (!match) {
    return {
      frontMatter: {},
      body: markdown,
    }
  }

  const frontMatter: Record<string, unknown> = {}
  const lines = match[1].split(/\r?\n/)

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    if (!line.trim()) continue

    const keyMatch = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/)
    if (!keyMatch) continue

    const [, key, rawValue] = keyMatch

    if (rawValue.trim() === '') {
      const values: string[] = []

      while (index + 1 < lines.length) {
        const nextLine = lines[index + 1]
        const itemMatch = nextLine.match(/^\s*-\s*(.*)$/)

        if (!itemMatch) break

        values.push(itemMatch[1].trim().replace(/^["']|["']$/g, ''))
        index += 1
      }

      frontMatter[key] = values
    } else {
      frontMatter[key] = parseScalar(rawValue)
    }
  }

  return {
    frontMatter,
    body: match[2],
  }
}

function isContentStatus(value: unknown): value is ContentStatus {
  return typeof value === 'string' && CONTENT_STATUSES.includes(value as ContentStatus)
}

function isContentCategory(value: unknown): value is ContentCategory {
  return typeof value === 'string' && CONTENT_CATEGORIES.includes(value as ContentCategory)
}

function toStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : []
}

function getReadTime(content: string) {
  const wordCount = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[^\w가-힣\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.ceil(wordCount / 200))
}

function parseContentDate(value: string, fallback?: Date) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return fallback || new Date(0)
  }

  return date
}

function toContentPost(filePath: string): ContentPostEntity | null {
  const markdown = fs.readFileSync(filePath, 'utf8')
  const { frontMatter, body } = parseFrontMatter(markdown)
  const status = isContentStatus(frontMatter.status) ? frontMatter.status : 'idea'
  const category = isContentCategory(frontMatter.category) ? frontMatter.category : 'Startup'
  const slug = typeof frontMatter.slug === 'string' ? frontMatter.slug.trim() : ''
  const title = typeof frontMatter.title === 'string' ? frontMatter.title.trim() : ''
  const description = typeof frontMatter.description === 'string' ? frontMatter.description.trim() : ''
  const date = typeof frontMatter.date === 'string' ? frontMatter.date : new Date().toISOString()
  const updated = typeof frontMatter.updated === 'string' ? frontMatter.updated : date
  const publishedAt = parseContentDate(date)
  const updatedAt = parseContentDate(updated, publishedAt)

  if (!slug || !title) return null

  return {
    id: `content:${slug}`,
    title,
    content: body.trim(),
    excerpt: description,
    description,
    series: null,
    thumbnail: null,
    slug,
    publishedAt,
    updatedAt,
    tags: toStringArray(frontMatter.tags),
    category,
    authorId: 'content',
    readTime: getReadTime(body),
    views: 0,
    featured: Boolean(frontMatter.featured),
    isPublished: status === 'published',
    draft: status !== 'published',
    source: 'content',
    status,
    relatedPosts: toStringArray(frontMatter.relatedPosts),
    filePath,
  }
}

function getMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name)

    if (entry.isDirectory()) return getMarkdownFiles(entryPath)
    if (entry.isFile() && entry.name.endsWith('.md')) return [entryPath]

    return []
  })
}

export function getAllContentPosts() {
  return CONTENT_DIRECTORIES
    .flatMap((directory) => getMarkdownFiles(path.join(CONTENT_ROOT, directory)))
    .map(toContentPost)
    .filter((post): post is ContentPostEntity => Boolean(post))
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
}

export function getPublishedContentPosts() {
  return getAllContentPosts().filter((post) => post.status === 'published')
}

export function getPublishedContentPostBySlug(slug: string) {
  return getPublishedContentPosts().find((post) => post.slug === slug) || null
}

export function getContentPostById(id: string) {
  return getAllContentPosts().find((post) => post.id === id) || null
}

export function getPublishedContentPostById(id: string) {
  return getPublishedContentPosts().find((post) => post.id === id) || null
}

export function isContentPostId(id: string) {
  return id.startsWith('content:')
}
