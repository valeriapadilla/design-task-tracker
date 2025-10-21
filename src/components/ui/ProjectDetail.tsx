'use client'

import { useState } from 'react'
import { Project } from '@/lib/types'
import { PROJECT_STATUS } from '@/lib/utils/constants'

interface ProjectDetailProps {
  project: Project | null
  onClose: () => void
}

const statusColors = {
  [PROJECT_STATUS.CREADO]: 'bg-gray-100 text-gray-800 border-gray-200',
  [PROJECT_STATUS.ASIGNADO]: 'bg-blue-100 text-blue-800 border-blue-200',
  [PROJECT_STATUS.EN_PROGRESO]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [PROJECT_STATUS.ENTREGADO]: 'bg-purple-100 text-purple-800 border-purple-200',
  [PROJECT_STATUS.APROBADO]: 'bg-green-100 text-green-800 border-green-200',
  [PROJECT_STATUS.RECHAZADO]: 'bg-red-100 text-red-800 border-red-200'
}

const statusLabels = {
  [PROJECT_STATUS.CREADO]: 'Creado',
  [PROJECT_STATUS.ASIGNADO]: 'Asignado',
  [PROJECT_STATUS.EN_PROGRESO]: 'En Progreso',
  [PROJECT_STATUS.ENTREGADO]: 'Entregado',
  [PROJECT_STATUS.APROBADO]: 'Aprobado',
  [PROJECT_STATUS.RECHAZADO]: 'Rechazado'
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  if (!project) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#bcd788] px-6 py-4 border-b border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{project.title}</h2>
                <p className="text-sm text-gray-600">Proyecto #{project.id.slice(-8)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${statusColors[project.status]}`}>
                {statusLabels[project.status]}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                <p className="text-gray-700 leading-relaxed">
                  {project.description || 'No hay descripción disponible para este proyecto.'}
                </p>
              </div>

              {/* Files */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Archivos</h3>
                {project.files && project.files.length > 0 ? (
                  <div className="space-y-2">
                    {project.files.map((fileUrl, index) => {
                      // Extraer el nombre del archivo de la URL
                      const fileName = fileUrl.split('/').pop()?.split('?')[0] || `Archivo ${index + 1}`
                      // Limpiar el nombre del archivo removiendo el timestamp
                      const cleanFileName = fileName.replace(/^\d+-/, '')
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <span className="text-sm text-gray-700 truncate" title={cleanFileName}>
                              {cleanFileName}
                            </span>
                          </div>
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-3 px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors flex-shrink-0"
                          >
                            Ver
                          </a>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500">No hay archivos adjuntos.</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Proyecto</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Fecha de creación</label>
                    <p className="text-sm text-gray-900">{formatDate(project.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Marca</label>
                    <p className="text-sm text-gray-900">{project.brand_id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Diseñador asignado</label>
                    <p className="text-sm text-gray-900">
                      {project.designer_id ? project.designer_id : 'No asignado'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso</h3>
                <div className="space-y-2">
                  {Object.entries(PROJECT_STATUS).map(([key, status]) => (
                    <div key={status} className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        project.status === status 
                          ? 'bg-green-500' 
                          : 'bg-gray-300'
                      }`} />
                      <span className={`text-sm ${
                        project.status === status 
                          ? 'text-gray-900 font-medium' 
                          : 'text-gray-500'
                      }`}>
                        {statusLabels[status]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
