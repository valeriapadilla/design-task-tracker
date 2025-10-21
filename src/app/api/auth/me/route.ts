import { NextRequest } from 'next/server'
import { getSessionUser } from '@/lib/auth/getSession'
import { ok, unauthorized } from '@/lib/http/responses'

// Obtener usuario actual
export async function GET(_request: NextRequest) {
  try {
    const user = await getSessionUser()
    
    if (!user) {
      return unauthorized('Usuario no autenticado')
    }
    
    return ok(user)
  } catch (error) {
    return unauthorized('Error al obtener usuario')
  }
}
