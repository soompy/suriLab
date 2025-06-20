import { PostRepository } from '../../repositories/PostRepository'
import { PostEntity, UpdatePostInput } from '../../entities/Post'

export interface UpdatePostUseCase {
  execute(input: UpdatePostInput): Promise<PostEntity>
}

export class UpdatePostUseCaseImpl implements UpdatePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(input: UpdatePostInput): Promise<PostEntity> {
    this.validateInput(input)

    const existingPost = await this.postRepository.findById(input.id)
    if (!existingPost) {
      throw new Error('Post not found')
    }

    if (input.slug && input.slug !== existingPost.slug) {
      const postWithSlug = await this.postRepository.findBySlug(input.slug)
      if (postWithSlug && postWithSlug.id !== input.id) {
        throw new Error('Post with this slug already exists')
      }
    }

    return await this.postRepository.update(input)
  }

  private validateInput(input: UpdatePostInput): void {
    if (!input.id.trim()) {
      throw new Error('Post ID is required')
    }
    
    if (input.title !== undefined && !input.title.trim()) {
      throw new Error('Title cannot be empty')
    }
    
    if (input.content !== undefined && !input.content.trim()) {
      throw new Error('Content cannot be empty')
    }
    
    if (input.excerpt !== undefined && !input.excerpt.trim()) {
      throw new Error('Excerpt cannot be empty')
    }
    
    if (input.category !== undefined && !input.category.trim()) {
      throw new Error('Category cannot be empty')
    }
    
    if (input.tags !== undefined && input.tags.length === 0) {
      throw new Error('At least one tag is required')
    }

    if (input.slug !== undefined) {
      const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
      if (!slugPattern.test(input.slug)) {
        throw new Error('Slug must be lowercase alphanumeric with hyphens only')
      }
    }
  }
}