'use client'

import { useState, useEffect } from 'react'
import type { Project } from '@/lib/types'
import type { ProjectQueryForm } from '@/lib/validations'

export function useProjects(filters?: ProjectQueryForm) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

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
        
        // La API devuelve {data: {data: [...], total: 2}}, necesitamos extraer el array interno
        let projectsArray = []
        let totalCount = 0
        
        if (data.data && typeof data.data === 'object') {
          // Si data.data es un objeto con estructura {data: [...], total: 2}
          if (Array.isArray(data.data.data)) {
            projectsArray = data.data.data
            totalCount = data.data.total || 0
          } else if (Array.isArray(data.data)) {
            // Si data.data es directamente un array
            projectsArray = data.data
            totalCount = data.total || 0
          }
        }
        
        setProjects(projectsArray)
        setTotal(totalCount)
      } else {
        throw new Error('Error al cargar proyectos')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData: { title: string; description: string; files?: string[] }) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })
      
      if (response.ok) {
        const data = await response.json()
        setProjects(prev => Array.isArray(prev) ? [data.data, ...prev] : [data.data])
        return data.data
      } else {
        throw new Error('Error al crear proyecto')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateProject = async (id: string, updates: { title?: string; description?: string; designer_id?: string }) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      
      if (response.ok) {
        const data = await response.json()
        setProjects(prev => prev.map(p => p.id === id ? data.data : p))
        return data.data
      } else {
        throw new Error('Error al actualizar proyecto')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== id))
      } else {
        throw new Error('Error al eliminar proyecto')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/projects/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setProjects(prev => prev.map(p => p.id === id ? data.data : p))
        return data.data
      } else {
        throw new Error('Error al actualizar estado')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const assignDesigner = async (id: string, designerId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/projects/${id}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ designer_id: designerId }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setProjects(prev => prev.map(p => p.id === id ? data.data : p))
        return data.data
      } else {
        throw new Error('Error al asignar diseñador')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (filters) {
      fetchProjects(filters)
    }
  }, [filters?.page, filters?.pageSize, filters?.status, filters?.search, filters])

  return {
    projects,
    loading,
    error,
    total,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    updateStatus,
    assignDesigner,
  }
}

