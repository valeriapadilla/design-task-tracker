'use client'

import { useState, useEffect } from 'react'
import type { Project } from '@/lib/types'
import type { ProjectQueryForm } from '@/lib/validations'

export function useDesignerProjects() {
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    projects,
    loading,
    error,
    total,
    fetchProjects,
    updateStatus,
  }
}
