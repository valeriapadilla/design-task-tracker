'use client'
import { useState, useEffect } from 'react'
import type { Project } from '@/lib/types'
import type { ProjectQueryForm } from '@/lib/validations'
import { PROJECT_STATUS } from '@/lib/utils/constants'

export function useAdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async (queryFilters?: ProjectQueryForm) => {
    try {
      setLoading(true)
      setError(null)
      
      const searchParams = new URLSearchParams()
      if (queryFilters?.page) searchParams.set('page', queryFilters.page.toString())
      if (queryFilters?.pageSize) searchParams.set('pageSize', queryFilters.pageSize.toString())
      if (queryFilters?.status) searchParams.set('status', queryFilters.status)
      if (queryFilters?.search) searchParams.set('search', queryFilters.search)
      
      const response = await fetch(`/api/projects?${searchParams.toString()}`)
      
      if (response.ok) {
        const data = await response.json()
        
        // La API devuelve {data: {data: [...], total: 2}}
        let projectsArray = []
        
        if (data.data && typeof data.data === 'object') {
          if (Array.isArray(data.data.data)) {
            projectsArray = data.data.data
          } else if (Array.isArray(data.data)) {
            projectsArray = data.data
          }
        }
        
        setProjects(projectsArray)
      } else {
        throw new Error('Error al cargar proyectos')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProject = async (projectId: string, data: { title: string; description: string; status: string }) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar proyecto')
      }

      // Recargar proyectos
      await fetchProjects({ page: 1, pageSize: 50 })
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  }

  const assignDesigner = async (projectId: string, designerId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ designer_id: designerId }),
      })

      if (!response.ok) {
        throw new Error('Error al asignar diseñador')
      }

      // Recargar proyectos
      await fetchProjects({ page: 1, pageSize: 50 })
    } catch (error) {
      console.error('Error assigning designer:', error)
      throw error
    }
  }

  const approveProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: PROJECT_STATUS.APROBADO }),
      })

      if (!response.ok) {
        throw new Error('Error al aprobar proyecto')
      }

      // Recargar proyectos
      await fetchProjects({ page: 1, pageSize: 50 })
    } catch (error) {
      console.error('Error approving project:', error)
      throw error
    }
  }

  const rejectProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: PROJECT_STATUS.RECHAZADO }),
      })

      if (!response.ok) {
        throw new Error('Error al rechazar proyecto')
      }

      // Recargar proyectos
      await fetchProjects({ page: 1, pageSize: 50 })
    } catch (error) {
      console.error('Error rejecting project:', error)
      throw error
    }
  }

  const updateStatus = async (projectId: string, status: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar estado')
      }

      // Recargar proyectos
      await fetchProjects({ page: 1, pageSize: 50 })
    } catch (error) {
      console.error('Error updating status:', error)
      throw error
    }
  }

  return {
    projects,
    loading,
    error,
    fetchProjects,
    updateProject,
    assignDesigner,
    approveProject,
    rejectProject,
    updateStatus
  }
}
