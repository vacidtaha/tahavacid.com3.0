import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Artık tüm cihazlara erişim sağlanıyor
  return NextResponse.next()
}

// Middleware çalışacağı yolları belirt
export const config = {
  matcher: ['/admin/:path*']
} 