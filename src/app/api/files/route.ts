import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth/requireRole'
import { fileService } from '@/services/fileService'
import { ok, badRequest } from '@/lib/http/responses'

// Subir archivos a un proyecto
export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    
    const formData = await request.formData()
    const projectId = formData.get('projectId') as string
    const files = formData.getAll('files') as File[]
    
    if (!projectId) {
      return badRequest('ID del proyecto es requerido')
    }
    
    if (!files || files.length === 0) {
      return badRequest('Al menos un archivo es requerido')
    }
    
    // Validar que los archivos no estén vacíos
    const validFiles = files.filter(file => file.size > 0)
    if (validFiles.length === 0) {
      return badRequest('Los archivos no pueden estar vacíos')
    }
    
    // Subir archivos
    const uploadedUrls = await fileService.uploadFiles(validFiles, projectId)
    
    return ok({
      message: 'Archivos subidos exitosamente',
      files: uploadedUrls,
      count: uploadedUrls.length
    })
  } catch (error) {
    return badRequest('Error al subir archivos', error)
  }
}

// Eliminar archivos de un proyecto
export async function DELETE(request: NextRequest) {
  try {
    await requireAuth()
    
    const body = await request.json()
    const { fileUrls } = body
    
    if (!fileUrls || !Array.isArray(fileUrls)) {
      return badRequest('URLs de archivos son requeridas')
    }
    
    await fileService.deleteFiles(fileUrls)
    
    return ok({
      message: 'Archivos eliminados exitosamente',
      count: fileUrls.length
    })
  } catch (error) {
    return badRequest('Error al eliminar archivos', error)
  }
}
