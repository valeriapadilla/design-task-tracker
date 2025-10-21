import { NextRequest } from 'next/server'
import { requireAnyRole, requireMarca } from '@/lib/auth/requireRole'
import { projectService } from '@/services/projectService'
import { CreateProjectSchema, ProjectQuerySchema } from '@/lib/validations'
import { ok, created, badRequest } from '@/lib/http/responses'
import { USER_ROLES } from '@/lib/utils/constants'

// Listar proyectos
export async function GET(request: NextRequest) {
  try {
    await requireAnyRole([USER_ROLES.ADMIN, USER_ROLES.MARCA, USER_ROLES.DISEÑADOR])

    const { searchParams } = new URL(request.url)
    const filters = ProjectQuerySchema.parse({
      page: searchParams.get('page'),
      pageSize: searchParams.get('pageSize'),
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined
    })
    
    const result = await projectService.getAll(filters)
    return ok(result)
  } catch (error) {
    return badRequest('Error al obtener proyectos', error)
  }
}

// Crear proyecto
export async function POST(request: NextRequest) {
  try {
    const user = await requireMarca()
    
    const body = await request.json()
    const projectData = CreateProjectSchema.parse(body)
    
    const project = await projectService.create(projectData, user.id)
    return created(project)
  } catch (error) {
    return badRequest('Error al crear proyecto', error)
  }
}