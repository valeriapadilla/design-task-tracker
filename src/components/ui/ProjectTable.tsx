'use client'

import { useState } from 'react'
import { Project } from '@/lib/types'
import { PROJECT_STATUS } from '@/lib/utils/constants'

interface ProjectTableProps {
  projects: Project[]
  onProjectSelect: (project: Project) => void
}

const statusColors = {
  [PROJECT_STATUS.CREADO]: 'bg-gray-100 text-gray-800',
  [PROJECT_STATUS.ASIGNADO]: 'bg-blue-100 text-blue-800',
  [PROJECT_STATUS.EN_PROGRESO]: 'bg-yellow-100 text-yellow-800',
  [PROJECT_STATUS.ENTREGADO]: 'bg-purple-100 text-purple-800',
  [PROJECT_STATUS.APROBADO]: 'bg-green-100 text-green-800',
  [PROJECT_STATUS.RECHAZADO]: 'bg-red-100 text-red-800'
}

const statusLabels = {
  [PROJECT_STATUS.CREADO]: 'Creado',
  [PROJECT_STATUS.ASIGNADO]: 'Asignado',
  [PROJECT_STATUS.EN_PROGRESO]: 'En Progreso',
  [PROJECT_STATUS.ENTREGADO]: 'Entregado',
  [PROJECT_STATUS.APROBADO]: 'Aprobado',
  [PROJECT_STATUS.RECHAZADO]: 'Rechazado'
}

export function ProjectTable({ projects, onProjectSelect }: ProjectTableProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    onProjectSelect(project)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Mis Proyectos</h3>
          <span className="text-sm text-gray-500">{projects.length} proyectos</span>
        </div>
      </div>

      {/* Table */}
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
                Diseñador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(projects) ? projects.map((project) => (
              <tr
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                {/* Proyecto */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">
                      {project.title}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {project.description || 'Sin descripción'}
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
                          {project.files.length} archivo{project.files.length !== 1 ? 's' : ''}
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

                {/* Diseñador */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {project.designer_id ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {project.designer_id.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">Diseñador</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No asignado</span>
                    )}
                  </div>
                </td>

                {/* Estado */}
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[project.status]}`}>
                    {statusLabels[project.status]}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No hay datos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tienes proyectos</h3>
          <p className="mt-1 text-sm text-gray-500">Crea tu primer proyecto para comenzar.</p>
        </div>
      )}
    </div>
  )
}
