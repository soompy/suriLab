import { redirect } from 'next/navigation'

export default function WriteRedirectPage() {
  redirect('/admin/posts/new')
}
