import { redirect } from 'next/navigation'

interface LegacyAdminPostEditPageProps {
  params: Promise<{ id: string }>
}

export default async function LegacyAdminPostEditPage({ params }: LegacyAdminPostEditPageProps) {
  const { id } = await params

  redirect(`/admin/posts/new?edit=${id}`)
}
