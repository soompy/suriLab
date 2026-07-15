#!/usr/bin/env node

const path = require('path')
const { createIdeaProvider } = require('./providers')
const {
  AUTOMATION_ROOT,
  ensureDir,
  parseArgs,
  readJson,
  writeJson,
} = require('./utils')

async function main() {
  const args = parseArgs()
  const count = Number(args.count || 10)
  const topicsConfig = readJson(path.join(AUTOMATION_ROOT, 'config', 'topics.json'))
  const provider = createIdeaProvider(args.provider)
  const ideasDir = path.join(AUTOMATION_ROOT, 'queue', 'ideas')
  ensureDir(ideasDir)

  const ideas = await provider.generateIdeas({
    topics: topicsConfig.topics,
    count,
  })

  for (const idea of ideas) {
    writeJson(path.join(ideasDir, `${idea.id}.json`), idea)
  }

  console.log(`Generated ${ideas.length} idea file(s) in ${path.relative(process.cwd(), ideasDir)}.`)
  console.log('Provider: mock. No external AI API was called.')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

