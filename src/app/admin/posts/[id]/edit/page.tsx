import { redirect } from 'next/navigation'

interface AdminPostEditPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminPostEditPage({ params }: AdminPostEditPageProps) {
  const { id } = await params

  redirect(`/admin/posts/new?edit=${id}`)
}
