import { z } from 'zod'
import { PROJECT_STATUS, type ProjectStatus } from '@/lib/utils/constants'

// Auth validations
export const loginSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
})

export const registerSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  full_name: z.string().min(2, 'Mínimo 2 caracteres')
})

// Rol validations
export const roleSchema = z.object({
  role: z.enum(['marca', 'diseñador'], {
    message: 'Rol debe ser "marca" o "diseñador"'
  })
})

// Crear proyecto (solo marca)
export const CreateProjectSchema = z.object({
  title: z.string().min(3, 'Título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'Descripción debe tener al menos 10 caracteres'),
  files: z.array(z.string()).optional().default([])
})

// Actualizar proyecto (solo marca y admin - contenido)
export const UpdateProjectSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  designer_id: z.uuid({message: 'ID de diseñador inválido'}).optional(),
  files: z.array(z.string()).optional()
})

// Asignar diseñador (solo admin)
export const AssignDesignerSchema = z.object({
  designer_id: z.uuid({message: 'ID de diseñador inválido'})
})

// Cambiar estado (diseñador: asignado a en_progreso, en_progreso aentregado)
export const UpdateStatusSchema = z.object({
  status: z.enum([PROJECT_STATUS.EN_PROGRESO, PROJECT_STATUS.ENTREGADO])
})

// Cambiar estado (admin: creado→asignado, entregado→aprobado/rechazado)
export const AdminUpdateStatusSchema = z.object({
  status: z.enum([PROJECT_STATUS.ASIGNADO, PROJECT_STATUS.APROBADO, PROJECT_STATUS.RECHAZADO])
})

// Filtros para listados
export const ProjectQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
  status: z.enum(Object.values(PROJECT_STATUS) as [ProjectStatus, ...ProjectStatus[]]).optional(),
  search: z.string().optional()
})

// Inferir tipos
export type LoginForm = z.infer<typeof loginSchema>
export type RegisterForm = z.infer<typeof registerSchema>
export type RoleForm = z.infer<typeof roleSchema>
export type CreateProjectForm = z.infer<typeof CreateProjectSchema>
export type UpdateProjectForm = z.infer<typeof UpdateProjectSchema>
export type AssignDesignerForm = z.infer<typeof AssignDesignerSchema>
export type UpdateStatusForm = z.infer<typeof UpdateStatusSchema>
export type AdminUpdateStatusForm = z.infer<typeof AdminUpdateStatusSchema>
export type ProjectQueryForm = z.infer<typeof ProjectQuerySchema>



