import { PostEntity, PostFilters, PostSort, PaginationOptions } from '../../entities/Post';
import { PostRepository } from '../../repositories/PostRepository';

export interface SearchPostsRequest {
  searchQuery: string;
  category?: string;
  tags?: string[];
  isPublished?: boolean;
  page?: number;
  limit?: number;
}

export interface SearchPostsResponse {
  posts: PostEntity[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export class SearchPosts {
  constructor(private postRepository: PostRepository) {}

  async execute(request: SearchPostsRequest): Promise<SearchPostsResponse> {
    const {
      searchQuery,
      category,
      tags,
      isPublished = true,
      page = 1,
      limit = 10,
    } = request;

    const filters: PostFilters = {
      searchQuery,
      category,
      tags,
      isPublished,
    };

    const sort: PostSort = {
      field: 'publishedAt',
      order: 'desc',
    };

    const pagination: PaginationOptions = {
      page,
      limit,
    };

    const result = await this.postRepository.findAll(filters, sort, pagination);

    return {
      posts: result.posts,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      hasMore: result.page < result.totalPages,
    };
  }
}