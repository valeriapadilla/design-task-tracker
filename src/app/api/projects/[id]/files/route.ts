import { NextRequest } from 'next/server'
import { requireAnyRole } from '@/lib/auth/requireRole'
import { projectService } from '@/services/projectService'
import { ok, badRequest, notFound } from '@/lib/http/responses'
import { USER_ROLES } from '@/lib/utils/constants'

// Obtener archivos de un proyecto (todos los roles pueden ver)
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAnyRole([USER_ROLES.ADMIN, USER_ROLES.MARCA, USER_ROLES.DISEÑADOR])
    
    const { id } = await params
    const project = await projectService.getById(id)
    
    return ok({
      projectId: id,
      files: project.files,
      count: project.files.length
    })
  } catch (error) {
    return notFound('Proyecto no encontrado')
  }
}