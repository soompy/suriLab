import { PostRepository } from '../../repositories/PostRepository'
import { PostEntity, CreatePostInput } from '../../entities/Post'

export interface CreatePostUseCase {
  execute(input: CreatePostInput): Promise<PostEntity>
}

export class CreatePostUseCaseImpl implements CreatePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(input: CreatePostInput): Promise<PostEntity> {
    this.validateInput(input)
    
    // Repository handles slug duplication automatically by appending timestamp
    // No need to check for duplicates here
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

    // More flexible slug pattern that allows Korean characters, alphanumeric, and hyphens
    const slugPattern = /^[a-z0-9가-힣]+(?:-[a-z0-9가-힣]+)*$/i
    if (!slugPattern.test(input.slug)) {
      throw new Error('Slug must contain only alphanumeric characters, Korean characters, and hyphens')
    }
  }
}