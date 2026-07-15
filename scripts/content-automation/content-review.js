#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const {
  REPORTS_ROOT,
  SLUG_PATTERN,
  ensureDir,
  getExistingContentSlugs,
  parseArgs,
  parseFrontMatter,
  relativePath,
  stringifyFrontMatter,
  today,
  writeJson,
} = require('./utils')

const REQUIRED_FIELDS = ['title', 'description', 'slug', 'date', 'category', 'tags', 'status', 'sourceIdeaId', 'reviewed']
const EXAGGERATED_PATTERNS = [
  /무조건/g,
  /완벽(?:한|하게)?/g,
  /폭발적/g,
  /100\s*%/g,
  /하루\s*만에\s*수익/g,
  /돈\s*버는\s*법/g,
]
const UNSOURCED_NUMBER_PATTERN = /(\d+(?:\.\d+)?\s*(?:%|배|만원|시간|분|명|개|원))/g

function isValidDate(value) {
  const date = new Date(value)
  return typeof value === 'string' && !Number.isNaN(date.getTime())
}

function hasCitationNearby(body, matchIndex) {
  const nearby = body.slice(Math.max(0, matchIndex - 120), matchIndex + 160)
  return /\[[^\]]+\]\(https?:\/\/[^)]+\)|https?:\/\//.test(nearby)
}

function reviewDraft(filePath) {
  const markdown = fs.readFileSync(filePath, 'utf8')
  const { frontMatter, body } = parseFrontMatter(markdown)
  const blockingIssues = []
  const warnings = []

  for (const field of REQUIRED_FIELDS) {
    if (frontMatter[field] === undefined || frontMatter[field] === '') {
      blockingIssues.push(`Missing required front matter field: ${field}`)
    }
  }

  if (!frontMatter.title) blockingIssues.push('Title is missing.')
  if (!frontMatter.description) blockingIssues.push('Description is missing.')
  if (!SLUG_PATTERN.test(String(frontMatter.slug || ''))) {
    blockingIssues.push('Slug must use lowercase letters, numbers, and single hyphens only.')
  }

  const duplicateSlugs = getExistingContentSlugs().filter((slug) => slug === frontMatter.slug)
  if (duplicateSlugs.length > 0) {
    blockingIssues.push(`Slug already exists in content directory: ${frontMatter.slug}`)
  }

  if (!isValidDate(frontMatter.date)) {
    blockingIssues.push('Date must be a valid date string.')
  }

  if (body.trim().length < 600) {
    warnings.push('Body is shorter than 600 characters. Add concrete project context before publishing.')
  }

  if (body.includes('[작성자 경험 입력 필요]')) {
    blockingIssues.push('Author experience placeholder remains.')
  }

  for (const pattern of EXAGGERATED_PATTERNS) {
    const matches = body.match(pattern)
    if (matches) {
      warnings.push(`Potential exaggerated expression found: ${Array.from(new Set(matches)).join(', ')}`)
    }
  }

  let numberMatch = UNSOURCED_NUMBER_PATTERN.exec(body)
  while (numberMatch) {
    if (!hasCitationNearby(body, numberMatch.index)) {
      warnings.push(`Numeric claim may need a source: ${numberMatch[1]}`)
    }
    numberMatch = UNSOURCED_NUMBER_PATTERN.exec(body)
  }

  if (!/\[[^\]]+\]\(\/posts\/[^)]+\)/.test(body)) {
    warnings.push('No internal blog link found.')
  }

  if (!/##\s*CTA|CTA|구독|댓글|공유|확인해보세요|적용해보세요/i.test(body)) {
    warnings.push('CTA section or CTA-like sentence is missing.')
  }

  const publishable = blockingIssues.length === 0

  return {
    file: relativePath(filePath),
    title: frontMatter.title || null,
    slug: frontMatter.slug || null,
    publishable,
    blockingIssues,
    warnings,
    reviewedAt: new Date().toISOString(),
    frontMatter,
    body,
  }
}

function writeReports(result) {
  ensureDir(REPORTS_ROOT)
  const reportBase = `${today()}-${result.slug || path.basename(result.file, '.md')}`
  const jsonFile = path.join(REPORTS_ROOT, `${reportBase}.json`)
  const mdFile = path.join(REPORTS_ROOT, `${reportBase}.md`)

  writeJson(jsonFile, {
    file: result.file,
    title: result.title,
    slug: result.slug,
    publishable: result.publishable,
    blockingIssues: result.blockingIssues,
    warnings: result.warnings,
    reviewedAt: result.reviewedAt,
  })

  const markdown = `# Content Review Report

- File: \`${result.file}\`
- Title: ${result.title || '-'}
- Slug: ${result.slug || '-'}
- Publishable: ${result.publishable ? 'yes' : 'no'}
- Reviewed at: ${result.reviewedAt}

## Blocking Issues

${result.blockingIssues.length > 0 ? result.blockingIssues.map((issue) => `- ${issue}`).join('\n') : '- None'}

## Warnings

${result.warnings.length > 0 ? result.warnings.map((warning) => `- ${warning}`).join('\n') : '- None'}
`

  fs.writeFileSync(mdFile, markdown, 'utf8')

  return {
    jsonFile,
    mdFile,
  }
}

function main() {
  const args = parseArgs()
  if (!args.file) {
    throw new Error('Missing required argument: --file=<draft-file>')
  }

  const filePath = path.resolve(String(args.file))
  const result = reviewDraft(filePath)
  const { jsonFile, mdFile } = writeReports(result)

  const nextFrontMatter = {
    ...result.frontMatter,
    reviewed: result.publishable,
  }
  fs.writeFileSync(filePath, stringifyFrontMatter(nextFrontMatter, result.body), 'utf8')

  console.log(`Review report JSON: ${relativePath(jsonFile)}`)
  console.log(`Review report Markdown: ${relativePath(mdFile)}`)
  console.log(`Publishable: ${result.publishable ? 'yes' : 'no'}`)
  if (!result.publishable) {
    console.log('Draft remains reviewed: false.')
  }
}

main()

