#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const {
  CATEGORY_TO_DIR,
  CONTENT_ROOT,
  askConfirmation,
  ensureDir,
  getExistingContentSlugs,
  parseArgs,
  parseFrontMatter,
  relativePath,
  stringifyFrontMatter,
} = require('./utils')

async function main() {
  const args = parseArgs()
  if (!args.file) {
    throw new Error('Missing required argument: --file=<draft-file>')
  }

  const draftFile = path.resolve(String(args.file))
  const markdown = fs.readFileSync(draftFile, 'utf8')
  const { frontMatter, body } = parseFrontMatter(markdown)

  if (frontMatter.reviewed !== true) {
    throw new Error('Only reviewed: true drafts can be published.')
  }

  if (getExistingContentSlugs().includes(frontMatter.slug)) {
    throw new Error(`Slug already exists in content directory: ${frontMatter.slug}`)
  }

  const categoryDir = CATEGORY_TO_DIR[frontMatter.category]
  if (!categoryDir) {
    throw new Error(`Unsupported category for publishing: ${frontMatter.category}`)
  }

  const targetDir = path.join(CONTENT_ROOT, categoryDir)
  const targetFile = path.join(targetDir, `${frontMatter.slug}.md`)
  const confirmed = await askConfirmation(`Publish ${relativePath(draftFile)} to ${relativePath(targetFile)}?`)

  if (!confirmed) {
    console.log('Publish cancelled.')
    return
  }

  ensureDir(targetDir)
  const publishedFrontMatter = {
    ...frontMatter,
    status: 'published',
  }
  fs.writeFileSync(targetFile, stringifyFrontMatter(publishedFrontMatter, body), 'utf8')

  try {
    execSync('npm run content:validate', { stdio: 'inherit' })
    execSync('npm run build', { stdio: 'inherit' })
  } catch {
    if (fs.existsSync(targetFile)) {
      fs.unlinkSync(targetFile)
    }
    throw new Error('Publish validation failed. Copied content file was rolled back.')
  }

  console.log(`Published content file created: ${relativePath(targetFile)}`)
  console.log('No git push or deployment was performed.')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
