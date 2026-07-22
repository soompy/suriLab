import fs from 'fs'
import os from 'os'
import path from 'path'
import { getPublishedContentPosts, parseFrontMatter } from '../content'
import { validateContentFiles } from '../../../scripts/validate-content'

function writeMarkdown(dir: string, fileName: string, frontMatter: string, body = 'Body') {
  const filePath = path.join(dir, fileName)
  fs.writeFileSync(filePath, `---\n${frontMatter}\n---\n\n${body}`)
  return filePath
}

describe('content helpers', () => {
  it('parses scalar and list front matter values', () => {
    const { frontMatter, body } = parseFrontMatter(`---
title: "Title"
featured: false
tags:
  - "MomentTune"
  - "AI Workflow"
---
Markdown body`)

    expect(frontMatter).toMatchObject({
      title: 'Title',
      featured: false,
      tags: ['MomentTune', 'AI Workflow'],
    })
    expect(body).toBe('Markdown body')
  })

  it('loads published content posts from the repository content folder', () => {
    const posts = getPublishedContentPosts()

    expect(Array.isArray(posts)).toBe(true)
    posts.forEach((post) => {
      expect(post).toEqual(expect.objectContaining({
        isPublished: true,
        source: 'content',
        status: 'published',
      }))
    })
  })

  it('validates bad dates and duplicate slugs', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'suriblog-content-'))
    const sharedFrontMatter = `
title: "Title"
description: "This description is long enough for the validator to accept it safely."
date: "not-a-date"
updated: "2026-07-12"
category: "MomentTune"
tags:
  - "MomentTune"
slug: "duplicate-slug"
status: "published"
featured: false
relatedPosts: []
`.trim()

    const first = writeMarkdown(tmpDir, 'first.md', sharedFrontMatter)
    const second = writeMarkdown(tmpDir, 'second.md', sharedFrontMatter.replace('not-a-date', '2026-07-12'))

    const result = validateContentFiles([first, second])

    expect(result.errors).toEqual(expect.arrayContaining([
      expect.stringContaining('date must be a valid date string'),
      expect.stringContaining('duplicate slug "duplicate-slug"'),
    ]))
  })
})
