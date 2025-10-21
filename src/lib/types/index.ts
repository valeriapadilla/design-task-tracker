import type { UserRole } from '@/lib/utils/constants'
import type { ProjectStatus } from '@/lib/utils/constants'

export interface SessionUser {
  id: string
  email: string
  role: UserRole | null
  full_name: string | null
}

export type { UserRole }

export interface Project {
  id: string
  title: string
  description: string | null
  files: string[]
  status: ProjectStatus
  created_at: string
  brand_id: string
  designer_id: string | null
}

