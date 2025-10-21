import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth/requireRole'
import { createClient } from '@/lib/supabase/server'
import { ok, badRequest } from '@/lib/http/responses'

// Obtener lista de diseñadores con nombres desde auth.users (usuarios autenticados)
export async function GET() {
  try {
    await requireAuth() // Solo requiere autenticación, no admin
    
    const supabase = await createClient()
    
    // Ejecutar función SQL personalizada para obtener diseñadores con nombres
    const { data, error } = await supabase.rpc('get_designers_with_names')
    
    if (error) throw error
    
    return ok(data || [])
  } catch (error: unknown) {
    return badRequest('Error al obtener diseñadores', error)
  }
}
