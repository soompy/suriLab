import { redirect } from 'next/navigation'

interface WriteRedirectPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function WriteRedirectPage({ searchParams }: WriteRedirectPageProps) {
  const params = await searchParams
  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        query.append(key, item)
      }
    } else if (value !== undefined) {
      query.set(key, value)
    }
  }

  const queryString = query.toString()
  redirect(queryString ? `/admin/posts/new?${queryString}` : '/admin/posts/new')
}
