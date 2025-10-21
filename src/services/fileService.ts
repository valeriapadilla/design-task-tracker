import { createClient } from '@/lib/supabase/server'

export const fileService = {

  async uploadFile(file: File, projectId: string): Promise<string> {
    const supabase = await createClient()
    
    // Generar nombre único para el archivo
    const timestamp = Date.now()
    // Limpiar el nombre del archivo para evitar caracteres especiales
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${projectId}/${timestamp}-${cleanFileName}`
    
    const { data, error } = await supabase.storage
      .from('project-files')
      .upload(fileName, file)
    
    if (error) throw error
    
    // Generar URL firmada que siempre funciona (válida por 1 año)
    const { data: urlData, error: urlError } = await supabase.storage
      .from('project-files')
      .createSignedUrl(data.path, 365 * 24 * 60 * 60) // 1 año en segundos
    
    if (urlError) throw urlError
    
    return urlData.signedUrl
  },

  async uploadFiles(files: File[], projectId: string): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, projectId))
    return Promise.all(uploadPromises)
  },

  async deleteFile(fileUrl: string): Promise<void> {
    const supabase = await createClient()
    
    // Extraer el path del archivo desde la URL
    const filePath = this.extractFilePath(fileUrl)
    
    const { error } = await supabase.storage
      .from('project-files')
      .remove([filePath])
    
    if (error) throw error
  },

  extractFilePath(fileUrl: string): string {
    const url = new URL(fileUrl)
    
    // Para URLs firmadas: /storage/v1/object/sign/project-files/path?token=...
    if (url.pathname.includes('/sign/')) {
      const pathParts = url.pathname.split('/')
      const projectFilesIndex = pathParts.findIndex(part => part === 'project-files')
      if (projectFilesIndex !== -1 && projectFilesIndex + 1 < pathParts.length) {
        return pathParts.slice(projectFilesIndex + 1).join('/')
      }
    }
    
    // Para URLs públicas: /storage/v1/object/public/project-files/path
    if (url.pathname.includes('/public/')) {
      const pathParts = url.pathname.split('/')
      const projectFilesIndex = pathParts.findIndex(part => part === 'project-files')
      if (projectFilesIndex !== -1 && projectFilesIndex + 1 < pathParts.length) {
        return pathParts.slice(projectFilesIndex + 1).join('/')
      }
    }
    
    // Fallback para el formato anterior
    const pathParts = url.pathname.split('/')
    const fileName = pathParts[pathParts.length - 1]
    const projectId = pathParts[pathParts.length - 2]
    return `${projectId}/${fileName}`
  },

  async deleteFiles(fileUrls: string[]): Promise<void> {
    const deletePromises = fileUrls.map(url => this.deleteFile(url))
    await Promise.all(deletePromises)
  },

}
