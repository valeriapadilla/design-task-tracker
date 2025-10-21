'use client'

import { useState, useEffect } from 'react'

interface Designer {
  id: string
  full_name: string
}

export function useDesigners() {
  const [designers, setDesigners] = useState<Designer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/auth/designers-with-names')
        if (response.ok) {
          const data = await response.json()
          setDesigners(data.data || [])
        } else {
          throw new Error('Error al cargar diseñadores')
        }
      } catch (error: any) {
        console.error('Error fetching designers:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDesigners()
  }, [])

  const getDesignerName = (designerId: string): string => {
    const designer = designers.find(d => d.id === designerId)
    
    if (!designer) {
      if (loading) return 'Cargando...'
      if (error) return 'Error al cargar'
      return 'Diseñador'
    }
    
    return designer.full_name
  }

  return {
    designers,
    loading,
    error,
    getDesignerName
  }
}
