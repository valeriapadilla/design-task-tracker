'use client'

import { useState, useEffect } from 'react'
import { Project } from '@/lib/types'
import { PROJECT_STATUS } from '@/lib/utils/constants'

interface EditProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdateProject: (projectId: string, data: { title: string; description: string; status: string }) => Promise<void>
  project: Project | null
}

export function EditProjectModal({ 
  isOpen, 
  onClose, 
  onUpdateProject, 
  project 
}: EditProjectModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (project) {
      setTitle(project.title)
      setDescription(project.description || '')
      setStatus(project.status)
    }
  }, [project])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project) return

    setLoading(true)
    try {
      await onUpdateProject(project.id, { title, description, status })
      onClose()
    } catch (error) {
      console.error('Error updating project:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !project) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Editar Proyecto</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee focus:border-transparent"
              >
                <option value={PROJECT_STATUS.CREADO}>Creado</option>
                <option value={PROJECT_STATUS.ASIGNADO}>Asignado</option>
                <option value={PROJECT_STATUS.EN_PROGRESO}>En Progreso</option>
                <option value={PROJECT_STATUS.ENTREGADO}>Entregado</option>
                <option value={PROJECT_STATUS.APROBADO}>Aprobado</option>
                <option value={PROJECT_STATUS.RECHAZADO}>Rechazado</option>
              </select>
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
                disabled={loading}
                className="px-4 py-2 bg-coffee text-white rounded-lg hover:bg-coffee/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
