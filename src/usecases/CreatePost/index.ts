import { PostRepository } from '../../repositories/PostRepository'
import { PostEntity, CreatePostInput } from '../../entities/Post'

export interface CreatePostUseCase {
  execute(input: CreatePostInput): Promise<PostEntity>
}

export class CreatePostUseCaseImpl implements CreatePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(input: CreatePostInput): Promise<PostEntity> {
    this.validateInput(input)
    
    const existingPost = await this.postRepository.findBySlug(input.slug)
    if (existingPost) {
      throw new Error('Post with this slug already exists')
    }

    return await this.postRepository.create(input)
  }

  private validateInput(input: CreatePostInput): void {
    if (!input.title.trim()) {
      throw new Error('Title is required')
    }
    if (!input.content.trim()) {
      throw new Error('Content is required')
    }
    if (!input.excerpt.trim()) {
      throw new Error('Excerpt is required')
    }
    if (!input.slug.trim()) {
      throw new Error('Slug is required')
    }
    if (!input.category.trim()) {
      throw new Error('Category is required')
    }
    if (!input.authorId.trim()) {
      throw new Error('Author ID is required')
    }
    if (input.tags.length === 0) {
      throw new Error('At least one tag is required')
    }

    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!slugPattern.test(input.slug)) {
      throw new Error('Slug must be lowercase alphanumeric with hyphens only')
    }
  }
}