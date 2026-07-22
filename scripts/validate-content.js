#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const CONTENT_ROOT = path.join(process.cwd(), 'content')
const CONTENT_DIRECTORIES = ['momenttune', 'ai-workflow', 'build-log', 'startup', 'career']
const REQUIRED_FIELDS = [
  'title',
  'description',
  'date',
  'updated',
  'category',
  'tags',
  'slug',
  'status',
  'featured',
  'relatedPosts',
]
const VALID_STATUSES = ['idea', 'draft', 'review', 'published']
const VALID_CATEGORIES = ['MomentTune', 'AI Workflow', 'Build Log', 'Startup', 'Career']
const MIN_DESCRIPTION_LENGTH = 50
const MAX_DESCRIPTION_LENGTH = 160
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function parseScalar(value) {
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

function parseFrontMatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)

  if (!match) {
    return {
      frontMatter: {},
      body: markdown,
    }
  }

  const frontMatter = {}
  const lines = match[1].split(/\r?\n/)

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    if (!line.trim()) continue

    const keyMatch = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/)
    if (!keyMatch) continue

    const [, key, rawValue] = keyMatch

    if (rawValue.trim() === '') {
      const values = []

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

function getMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return []

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name)

    if (entry.isDirectory()) return getMarkdownFiles(entryPath)
    if (entry.isFile() && entry.name.endsWith('.md')) return [entryPath]

    return []
  })
}

function relativeFile(filePath) {
  return path.relative(process.cwd(), filePath)
}

function isValidDate(value) {
  if (typeof value !== 'string') return false

  const parsed = new Date(value)
  return !Number.isNaN(parsed.getTime())
}

function validateContentFiles(files) {
  const errors = []
  const warnings = []
  const slugs = new Map()

  for (const filePath of files) {
    const markdown = fs.readFileSync(filePath, 'utf8')
    const { frontMatter, body } = parseFrontMatter(markdown)
    const fileLabel = relativeFile(filePath)

    for (const field of REQUIRED_FIELDS) {
      if (frontMatter[field] === undefined || frontMatter[field] === '') {
        errors.push(`${fileLabel}: missing required front matter field "${field}"`)
      }
    }

    if (!frontMatter.title || String(frontMatter.title).trim().length === 0) {
      errors.push(`${fileLabel}: title must not be empty`)
    }

    if (!body.trim()) {
      errors.push(`${fileLabel}: body must not be empty`)
    }

    if (!VALID_STATUSES.includes(frontMatter.status)) {
      errors.push(`${fileLabel}: status must be one of ${VALID_STATUSES.join(', ')}`)
    }

    if (!VALID_CATEGORIES.includes(frontMatter.category)) {
      errors.push(`${fileLabel}: category must be one of ${VALID_CATEGORIES.join(', ')}`)
    }

    if (!Array.isArray(frontMatter.tags) || frontMatter.tags.length === 0) {
      errors.push(`${fileLabel}: tags must include at least one tag`)
    }

    if (!Array.isArray(frontMatter.relatedPosts)) {
      errors.push(`${fileLabel}: relatedPosts must be an array`)
    }

    if (typeof frontMatter.featured !== 'boolean') {
      errors.push(`${fileLabel}: featured must be true or false`)
    }

    const description = String(frontMatter.description || '').trim()
    if (description.length > 0 && description.length < MIN_DESCRIPTION_LENGTH) {
      warnings.push(`${fileLabel}: description is short (${description.length} chars, recommended ${MIN_DESCRIPTION_LENGTH}-${MAX_DESCRIPTION_LENGTH})`)
    }
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      errors.push(`${fileLabel}: description is too long (${description.length} chars, max ${MAX_DESCRIPTION_LENGTH})`)
    }

    const slug = String(frontMatter.slug || '').trim()
    if (slug) {
      if (!SLUG_PATTERN.test(slug)) {
        errors.push(`${fileLabel}: slug must use lowercase letters, numbers, and single hyphens only`)
      }

      if (slugs.has(slug)) {
        errors.push(`${fileLabel}: duplicate slug "${slug}" also used by ${slugs.get(slug)}`)
      } else {
        slugs.set(slug, fileLabel)
      }
    }

    if (!isValidDate(frontMatter.date)) {
      errors.push(`${fileLabel}: date must be a valid date string`)
    }

    if (!isValidDate(frontMatter.updated)) {
      errors.push(`${fileLabel}: updated must be a valid date string`)
    }

    if (frontMatter.status !== 'published') {
      warnings.push(`${fileLabel}: status "${frontMatter.status}" will not be exposed publicly`)
    }
  }

  return {
    errors,
    warnings,
    checkedFiles: files.length,
  }
}

function main() {
  const files = CONTENT_DIRECTORIES.flatMap((directory) => (
    getMarkdownFiles(path.join(CONTENT_ROOT, directory))
  ))
  const { errors, warnings, checkedFiles } = validateContentFiles(files)

  if (warnings.length > 0) {
    console.warn('Content warnings:')
    for (const warning of warnings) {
      console.warn(`- ${warning}`)
    }
  }

  if (errors.length > 0) {
    console.error('Content validation failed:')
    for (const error of errors) {
      console.error(`- ${error}`)
    }
    process.exit(1)
  }

  console.log(`Content validation passed. Checked ${checkedFiles} markdown file(s).`)
  console.log('Only posts with status "published" are eligible for public routes, sitemap, and RSS.')
}

if (require.main === module) {
  main()
}

module.exports = {
  parseFrontMatter,
  validateContentFiles,
}
