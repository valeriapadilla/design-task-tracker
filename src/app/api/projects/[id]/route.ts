import { NextRequest } from 'next/server'
import { requireAnyRole } from '@/lib/auth/requireRole'
import { projectService } from '@/services/projectService'
import { UpdateProjectSchema } from '@/lib/validations'
import { ok, badRequest, notFound } from '@/lib/http/responses'
import { USER_ROLES } from '@/lib/utils/constants'

// Obtener proyecto por ID
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAnyRole([USER_ROLES.ADMIN, USER_ROLES.MARCA, USER_ROLES.DISEÑADOR])
    
    const { id } = await params
    const project = await projectService.getById(id)
    return ok(project)
  } catch (error) {
    return notFound('Proyecto no encontrado')
  }
}

// Actualizar proyecto
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAnyRole([USER_ROLES.ADMIN, USER_ROLES.MARCA])
    
    const body = await request.json()
    const updates = UpdateProjectSchema.parse(body)
    
    const { id } = await params
    const project = await projectService.update(id, updates)
    return ok(project)
  } catch (error) {
    return badRequest('Error al actualizar proyecto', error)
  }
}
// Eliminar proyecto
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAnyRole([USER_ROLES.ADMIN, USER_ROLES.MARCA])
    
    const { id } = await params
    await projectService.delete(id)
    return ok({ message: 'Proyecto eliminado' })
  } catch (error) {
    return badRequest('Error al eliminar proyecto', error)
  }
}