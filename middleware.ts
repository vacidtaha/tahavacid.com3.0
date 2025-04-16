import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Mobil cihazları tespit etmek için düzenli ifade
const MOBILE_DEVICE_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

export function middleware(request: NextRequest) {
  // İsteğin user-agent bilgisini al
  const userAgent = request.headers.get('user-agent') || ''
  
  // İstek yolunun admin ile başlayıp başlamadığını kontrol et
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')
  
  // Erişim reddedildi sayfasına erişiliyorsa kontrolü atla
  if (request.nextUrl.pathname === '/admin/access-denied') {
    return NextResponse.next()
  }
  
  // Mobil cihaz tespiti
  const isMobileDevice = MOBILE_DEVICE_REGEX.test(userAgent)
  
  // Eğer admin sayfasına mobil cihazdan erişilmeye çalışılıyorsa
  if (isAdminPage && isMobileDevice) {
    // Erişim reddedildi sayfasına yönlendir
    return NextResponse.redirect(new URL('/admin/access-denied', request.url))
  }
  
  return NextResponse.next()
}

// Middleware çalışacağı yolları belirt
export const config = {
  matcher: ['/admin/:path*']
} 