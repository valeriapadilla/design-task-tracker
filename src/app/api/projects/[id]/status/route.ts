import { NextRequest } from 'next/server'
import { requireAdmin, requireDisenador } from '@/lib/auth/requireRole'
import { projectService } from '@/services/projectService'
import { UpdateStatusSchema, AdminUpdateStatusSchema } from '@/lib/validations'
import { ok, badRequest } from '@/lib/http/responses'

// Cambiar estado del proyecto
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { status } = body
    const { id } = await params
    
    // Verificar si es admin (puede cambiar a cualquier estado)
    try {
      await requireAdmin()
      const validatedStatus = AdminUpdateStatusSchema.parse({ status })
      const project = await projectService.updateStatus(id, validatedStatus.status)
      return ok(project)
    } catch {
      // Si no es admin, verificar si es diseñador
      await requireDisenador()
      const validatedStatus = UpdateStatusSchema.parse({ status })
      const project = await projectService.updateStatus(id, validatedStatus.status)
      return ok(project)
    }
  } catch (error) {
    return badRequest('Error al cambiar estado del proyecto', error)
  }
}