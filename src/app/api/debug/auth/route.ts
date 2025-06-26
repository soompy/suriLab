import { NextRequest, NextResponse } from 'next/server'
import { getTokenStats } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    // 개발 환경에서만 접근 가능
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Debug endpoint not available in production' },
        { status: 403 }
      )
    }

    const stats = getTokenStats()
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      tokenStats: stats,
      request: {
        url: request.url,
        method: request.method,
        headers: {
          authorization: request.headers.get('authorization') ? 
            `Bearer ${request.headers.get('authorization')?.substring(7, 15)}...` : 
            'None',
          userAgent: request.headers.get('user-agent'),
        }
      }
    })
  } catch (error) {
    console.error('[DEBUG] Error in auth debug endpoint:', error)
    return NextResponse.json(
      { error: 'Debug endpoint error' },
      { status: 500 }
    )
  }
}