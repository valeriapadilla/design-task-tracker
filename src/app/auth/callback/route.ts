import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Las cookies ya se manejan automáticamente en tu configuración del servidor
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Si hay un error, redirigir al login
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
