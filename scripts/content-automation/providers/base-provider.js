class ContentIdeaProvider {
  async generateIdeas() {
    throw new Error('generateIdeas() must be implemented by a provider.')
  }
}

module.exports = {
  ContentIdeaProvider,
}

