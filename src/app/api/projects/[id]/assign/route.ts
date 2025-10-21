import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireRole'
import { projectService } from '@/services/projectService'
import { AssignDesignerSchema } from '@/lib/validations'
import { ok, badRequest } from '@/lib/http/responses'

// Asignar diseñador a proyecto
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin() // Solo admin puede asignar
    
    const body = await request.json()
    const { designer_id } = AssignDesignerSchema.parse(body)
    const { id } = await params
    
    const project = await projectService.assignDesigner(id, designer_id)
    return ok(project)
  } catch (error) {
    return badRequest('Error al asignar diseñador', error)
  }
}