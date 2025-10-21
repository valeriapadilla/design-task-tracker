'use client'

import { useState } from 'react'
import { Project } from '@/lib/types'
import { PROJECT_STATUS, PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '@/lib/utils/constants'

interface DesignerProjectTableProps {
  projects: Project[]
  onProjectSelect: (project: Project) => void
  onUpdateStatus: (projectId: string, status: string) => Promise<void>
}

export function DesignerProjectTable({ 
  projects, 
  onProjectSelect, 
  onUpdateStatus 
}: DesignerProjectTableProps) {
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null)

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    try {
      setLoadingProjectId(projectId)
      await onUpdateStatus(projectId, newStatus)
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setLoadingProjectId(null)
    }
  }

  // Estados que el diseñador puede cambiar
  const getAvailableStatuses = (currentStatus: string) => {
    switch (currentStatus) {
      case PROJECT_STATUS.ASIGNADO:
        return [
          { value: PROJECT_STATUS.EN_PROGRESO, label: PROJECT_STATUS_LABELS[PROJECT_STATUS.EN_PROGRESO] }
        ]
      case PROJECT_STATUS.EN_PROGRESO:
        return [
          { value: PROJECT_STATUS.ENTREGADO, label: PROJECT_STATUS_LABELS[PROJECT_STATUS.ENTREGADO] }
        ]
      default:
        return []
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Mis Proyectos Asignados</h3>
          <span className="text-sm text-gray-600">{projects.length} proyectos</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proyecto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Archivos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.length > 0 ? projects.map((project) => {
              const availableStatuses = getAvailableStatuses(project.status)
              
              return (
                <tr key={project.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onProjectSelect(project)}>
                  {/* Proyecto */}
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{project.title}</div>
                      <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {project.description}
                      </div>
                    </div>
                  </td>

                  {/* Archivos */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {project.files && project.files.length > 0 ? (
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <span className="text-sm text-gray-600">
                            {project.files.length} {project.files.length === 1 ? 'archivo' : 'archivos'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Sin archivos</span>
                      )}
                    </div>
                  </td>

                  {/* Fecha */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(project.created_at)}
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${PROJECT_STATUS_COLORS[project.status]}`}>
                      {PROJECT_STATUS_LABELS[project.status]}
                    </span>
                  </td>

                  {/* Acción */}
                  <td className="px-6 py-4">
                    {availableStatuses.length > 0 ? (
                      <select
                        onChange={(e) => {
                          e.stopPropagation()
                          handleStatusChange(project.id, e.target.value)
                        }}
                        disabled={loadingProjectId === project.id}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                        value=""
                      >
                        <option value="">Cambiar estado</option>
                        {availableStatuses.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-sm text-gray-400">Sin acciones</span>
                    )}
                  </td>
                </tr>
              )
            }) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No hay proyectos asignados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
