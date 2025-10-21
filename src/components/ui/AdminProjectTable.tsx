'use client'

import { useState } from 'react'
import { Project } from '@/lib/types'
import { PROJECT_STATUS, PROJECT_STATUS_LABELS } from '@/lib/utils/constants'
import { useDesigners } from '@/hooks/useDesigners'

interface AdminProjectTableProps {
  projects: Project[]
  onProjectSelect: (project: Project) => void
  onEditProject: (project: Project) => void
  onAssignDesigner: (project: Project) => void
  onApproveProject: (projectId: string) => Promise<void>
  onRejectProject: (projectId: string) => Promise<void>
  onUpdateProject: (projectId: string, data: { title: string; description: string; status: string }) => Promise<void>
  onAssignDesignerToProject: (projectId: string, designerId: string) => Promise<void>
  onUpdateStatus: (projectId: string, status: string) => Promise<void>
}


export function AdminProjectTable({ 
  projects, 
  onProjectSelect, 
  onEditProject, 
  onAssignDesigner,
  onApproveProject,
  onRejectProject,
  onUpdateProject,
  onAssignDesignerToProject,
  onUpdateStatus
}: AdminProjectTableProps) {
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null)
  const { designers } = useDesigners()

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    setLoadingProjectId(projectId)
    try {
      await onUpdateStatus(projectId, newStatus)
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setLoadingProjectId(null)
    }
  }

  const handleDesignerChange = async (projectId: string, designerId: string) => {
    setLoadingProjectId(projectId)
    try {
      await onAssignDesignerToProject(projectId, designerId)
    } catch (error) {
      console.error('Error assigning designer:', error)
    } finally {
      setLoadingProjectId(null)
    }
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
          <h3 className="text-lg font-semibold text-gray-900">Todos los Proyectos</h3>
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
              <tr key={project.id} className="hover:bg-gray-50">
                {/* Proyecto */}
                <td className="px-6 py-4">
                  <div 
                    className="flex flex-col cursor-pointer"
                    onClick={() => onProjectSelect(project)}
                  >
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
                  <select
                    value={project.designer_id || ''}
                    onChange={(e) => handleDesignerChange(project.id, e.target.value)}
                    disabled={loadingProjectId === project.id}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                  >
                    <option value="">Sin asignar</option>
                    {designers.map((designer) => (
                      <option key={designer.id} value={designer.id}>
                        {designer.full_name}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Estado */}
                <td className="px-6 py-4">
                  <select
                    value={project.status}
                    onChange={(e) => handleStatusChange(project.id, e.target.value)}
                    disabled={loadingProjectId === project.id}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                  >
                    <option value={PROJECT_STATUS.CREADO}>{PROJECT_STATUS_LABELS[PROJECT_STATUS.CREADO]}</option>
                    <option value={PROJECT_STATUS.ASIGNADO}>{PROJECT_STATUS_LABELS[PROJECT_STATUS.ASIGNADO]}</option>
                    <option value={PROJECT_STATUS.EN_PROGRESO}>{PROJECT_STATUS_LABELS[PROJECT_STATUS.EN_PROGRESO]}</option>
                    <option value={PROJECT_STATUS.ENTREGADO}>{PROJECT_STATUS_LABELS[PROJECT_STATUS.ENTREGADO]}</option>
                    <option value={PROJECT_STATUS.APROBADO}>{PROJECT_STATUS_LABELS[PROJECT_STATUS.APROBADO]}</option>
                    <option value={PROJECT_STATUS.RECHAZADO}>{PROJECT_STATUS_LABELS[PROJECT_STATUS.RECHAZADO]}</option>
                  </select>
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay proyectos</h3>
          <p className="mt-1 text-sm text-gray-500">Los proyectos aparecerán aquí cuando sean creados.</p>
        </div>
      )}
    </div>
  )
}
