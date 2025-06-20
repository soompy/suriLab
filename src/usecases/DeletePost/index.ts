import { PostRepository } from '../../repositories/PostRepository'

export interface DeletePostUseCase {
  execute(id: string): Promise<void>
}

export class DeletePostUseCaseImpl implements DeletePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(id: string): Promise<void> {
    if (!id.trim()) {
      throw new Error('Post ID is required')
    }

    const existingPost = await this.postRepository.findById(id)
    if (!existingPost) {
      throw new Error('Post not found')
    }

    await this.postRepository.delete(id)
  }
}