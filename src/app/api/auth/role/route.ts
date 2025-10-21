import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth/requireRole'
import { authService } from '@/services/authService'
import { roleSchema } from '@/lib/validations'
import { ok, badRequest } from '@/lib/http/responses'

// Actualizar rol del usuario
export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { role } = roleSchema.parse(body)
    
    await authService.updateUserRole(user.id, role)
    
    return ok({
      message: 'Rol actualizado exitosamente',
      role
    })
  } catch (error) {
    return badRequest('Error al actualizar rol', error)
  }
}
