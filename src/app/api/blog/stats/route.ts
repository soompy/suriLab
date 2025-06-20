import { BlogStatsAPIHandler } from '../../../../infrastructure/api/posts'

export async function GET() {
  return BlogStatsAPIHandler.GET()
}