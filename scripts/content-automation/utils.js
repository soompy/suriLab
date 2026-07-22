const fs = require('fs')
const path = require('path')
const readline = require('readline')

const ROOT = process.cwd()
const AUTOMATION_ROOT = path.join(ROOT, 'automation')
const CONTENT_ROOT = path.join(ROOT, 'content')
const QUEUE_ROOT = path.join(AUTOMATION_ROOT, 'queue')
const REPORTS_ROOT = path.join(AUTOMATION_ROOT, 'reports')

const CATEGORY_TO_DIR = {
  MomentTune: 'momenttune',
  'AI Workflow': 'ai-workflow',
  'Build Log': 'build-log',
  Startup: 'startup',
  Career: 'career',
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath))
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

function parseArgs(argv = process.argv.slice(2)) {
  const args = {}

  for (const arg of argv) {
    if (!arg.startsWith('--')) continue

    const separatorIndex = arg.indexOf('=')
    if (separatorIndex === -1) {
      args[arg.slice(2)] = true
    } else {
      args[arg.slice(2, separatorIndex)] = arg.slice(separatorIndex + 1)
    }
  }

  return args
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/[가-힣]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

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

function yamlValue(value) {
  if (typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    return `\n${value.map((item) => `  - "${String(item).replace(/"/g, '\\"')}"`).join('\n')}`
  }

  return `"${String(value ?? '').replace(/"/g, '\\"')}"`
}

function stringifyFrontMatter(frontMatter, body) {
  const lines = Object.entries(frontMatter).map(([key, value]) => `${key}: ${yamlValue(value)}`)
  return `---\n${lines.join('\n')}\n---\n\n${body.trim()}\n`
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

function getExistingContentSlugs() {
  return getMarkdownFiles(CONTENT_ROOT)
    .map((filePath) => parseFrontMatter(fs.readFileSync(filePath, 'utf8')).frontMatter.slug)
    .filter((slug) => typeof slug === 'string' && slug.length > 0)
}

function getDraftFiles() {
  return getMarkdownFiles(path.join(QUEUE_ROOT, 'drafts'))
}

function getIdeaFiles() {
  const ideasDir = path.join(QUEUE_ROOT, 'ideas')
  if (!fs.existsSync(ideasDir)) return []

  return fs.readdirSync(ideasDir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => path.join(ideasDir, file))
}

function findIdeaById(id) {
  for (const filePath of getIdeaFiles()) {
    const idea = readJson(filePath)
    if (idea.id === id) {
      return {
        filePath,
        idea,
      }
    }
  }

  return null
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(`${question} (yes/no) `, (answer) => {
      rl.close()
      resolve(answer.trim().toLowerCase() === 'yes')
    })
  })
}

function relativePath(filePath) {
  return path.relative(ROOT, filePath)
}

module.exports = {
  AUTOMATION_ROOT,
  CATEGORY_TO_DIR,
  CONTENT_ROOT,
  QUEUE_ROOT,
  REPORTS_ROOT,
  SLUG_PATTERN,
  askConfirmation,
  ensureDir,
  findIdeaById,
  getDraftFiles,
  getExistingContentSlugs,
  getIdeaFiles,
  parseArgs,
  parseFrontMatter,
  readJson,
  relativePath,
  slugify,
  stringifyFrontMatter,
  today,
  writeJson,
}
