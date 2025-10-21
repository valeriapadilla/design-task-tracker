import { createClient } from '@/lib/supabase/server'
import type { Project} from '@/lib/types'
import type { CreateProjectForm, UpdateProjectForm, ProjectQueryForm } from '@/lib/validations'
import { PROJECT_STATUS } from '@/lib/utils/constants'
import { fileService } from './fileService'

export const projectService = {
  // Obtener todos los proyectos 
  async getAll(filters?: ProjectQueryForm): Promise<{ data: Project[], total: number }> {
    const supabase = await createClient()
    
    let query = supabase
      .from('projects')
      .select('*', { count: 'exact' })
    
    // Aplicar filtros
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters?.search) {
      query = query.ilike('title', `%${filters.search}%`)
    }
    
    // Paginación
    const page = filters?.page || 1
    const pageSize = filters?.pageSize || 10
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    
    query = query.range(from, to)
    
    const { data, error, count } = await query
    
    if (error) throw error
    
    return { data: data || [], total: count || 0 }
  },

  // Obtener proyecto por ID
  async getById(id: string): Promise<Project> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Crear proyecto
  async create(projectData: CreateProjectForm, userId: string): Promise<Project> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...projectData,
        brand_id: userId,
        status: PROJECT_STATUS.CREADO
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating project:', error)
      throw error
    }
    
    console.log('Project created successfully:', data)
    return data
  },

  // Actualizar proyecto
  async update(id: string, updates: UpdateProjectForm): Promise<Project> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Eliminar proyecto
  async delete(id: string): Promise<void> {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Asignar diseñador 
  async assignDesigner(id: string, designerId: string): Promise<Project> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('projects')
      .update({
        designer_id: designerId,
        status: PROJECT_STATUS.ASIGNADO
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Actualizar estado del proyecto
  async updateStatus(id: string, status: string): Promise<Project> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('projects')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Agregar archivos a un proyecto
  async addFiles(id: string, files: File[]): Promise<Project> {
    const supabase = await createClient()
    
    const uploadedUrls = await fileService.uploadFiles(files, id)
    
    // Obtener proyecto actual
    const project = await this.getById(id)
    
    const updatedFiles = [...project.files, ...uploadedUrls]
    
    const { data, error } = await supabase
      .from('projects')
      .update({ files: updatedFiles })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Eliminar archivos de un proyecto
  async removeFiles(id: string, fileUrls: string[]): Promise<Project> {
    const supabase = await createClient()
    
    await fileService.deleteFiles(fileUrls)
    
    const project = await this.getById(id)
    
    const updatedFiles = project.files.filter(file => !fileUrls.includes(file))
    
    const { data, error } = await supabase
      .from('projects')
      .update({ files: updatedFiles })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}