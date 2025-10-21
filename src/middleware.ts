import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/getSession'
import { USER_ROLES } from '@/lib/utils/constants'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Rutas que requieren autenticación
  if (pathname.startsWith('/dashboard')) {
    const user = await getSessionUser()
    
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Si no tiene rol, redirigir a selección de rol
    if (!user.role) {
      return NextResponse.redirect(new URL('/role-selection', request.url))
    }
    
    // Proteger rutas específicas por rol
    if (pathname.startsWith('/dashboard/marca') && user.role !== USER_ROLES.MARCA) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    if (pathname.startsWith('/dashboard/disenador') && user.role !== USER_ROLES.DISEÑADOR) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    if (pathname === '/dashboard' && user.role !== USER_ROLES.ADMIN) {
      // Redirigir según el rol
      if (user.role === USER_ROLES.MARCA) {
        return NextResponse.redirect(new URL('/dashboard/marca', request.url))
      } else if (user.role === USER_ROLES.DISEÑADOR) {
        return NextResponse.redirect(new URL('/dashboard/disenador', request.url))
      }
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
