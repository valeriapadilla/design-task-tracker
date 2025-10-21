import { NextRequest } from 'next/server'
import { authService } from '@/services/authService'
import { ok, badRequest } from '@/lib/http/responses'

// Cerrar sesión
export async function POST(_request: NextRequest) {
  try {
    await authService.signOut()
    
    return ok({ message: 'Sesión cerrada exitosamente' })
  } catch (error) {
    return badRequest('Error al cerrar sesión', error)
  }
}
