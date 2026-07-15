const { MockContentIdeaProvider } = require('./mock-provider')

function createIdeaProvider(providerName = process.env.CONTENT_AI_PROVIDER || 'mock') {
  if (providerName === 'mock') {
    return new MockContentIdeaProvider()
  }

  throw new Error(`Unsupported content AI provider: ${providerName}. Only mock is implemented.`)
}

module.exports = {
  createIdeaProvider,
}

