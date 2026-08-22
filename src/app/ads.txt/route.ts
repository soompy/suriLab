const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

export const dynamic = 'force-dynamic'

export function GET() {
  const publisherId = ADSENSE_CLIENT?.replace(/^ca-/, '')
  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : '# Configure NEXT_PUBLIC_ADSENSE_CLIENT to enable AdSense ads.txt.\n'

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
