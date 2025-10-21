'use client'

import { useState, useEffect } from 'react'
import { Project } from '@/lib/types'

interface Designer {
  id: string
  full_name: string
}

interface AssignDesignerModalProps {
  isOpen: boolean
  onClose: () => void
  onAssignDesigner: (projectId: string, designerId: string) => Promise<void>
  project: Project | null
}

export function AssignDesignerModal({ 
  isOpen, 
  onClose, 
  onAssignDesigner, 
  project 
}: AssignDesignerModalProps) {
  const [designers, setDesigners] = useState<Designer[]>([])
  const [selectedDesignerId, setSelectedDesignerId] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingDesigners, setLoadingDesigners] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchDesigners()
    }
  }, [isOpen])

  const fetchDesigners = async () => {
    setLoadingDesigners(true)
    try {
      const response = await fetch('/api/auth/designers')
      if (response.ok) {
        const data = await response.json()
        setDesigners(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching designers:', error)
    } finally {
      setLoadingDesigners(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project || !selectedDesignerId) return

    setLoading(true)
    try {
      await onAssignDesigner(project.id, selectedDesignerId)
      onClose()
    } catch (error) {
      console.error('Error assigning designer:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !project) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Asignar Diseñador</h2>
          <p className="text-sm text-gray-600 mb-4">Proyecto: {project.title}</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Diseñador
              </label>
              {loadingDesigners ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center">
                  <span className="text-gray-500">Cargando diseñadores...</span>
                </div>
              ) : (
                <select
                  value={selectedDesignerId}
                  onChange={(e) => setSelectedDesignerId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar diseñador</option>
                  {designers.map((designer) => (
                    <option key={designer.id} value={designer.id}>
                      {designer.full_name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !selectedDesignerId}
                className="px-4 py-2 bg-coffee text-white rounded-lg hover:bg-coffee/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Asignando...' : 'Asignar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
