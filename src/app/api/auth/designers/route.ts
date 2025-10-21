import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireRole'
import { authService } from '@/services/authService'
import { ok, badRequest } from '@/lib/http/responses'

// Obtener lista de diseñadores (solo admin)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()
    
    const designers = await authService.getDesigners()
    return ok(designers)
  } catch (error) {
    return badRequest('Error al obtener diseñadores', error)
  }
}
