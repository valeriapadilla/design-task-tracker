'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useAdminProjects } from '@/hooks/useAdminProjects'
import { AdminProjectTable } from './AdminProjectTable'
import { ProjectDetail } from './ProjectDetail'
import { EditProjectModal } from './EditProjectModal'
import { AssignDesignerModal } from './AssignDesignerModal'
import { DashboardHeader } from './DashboardHeader'
import { Project } from '@/lib/types'
import type { ProjectQueryForm } from '@/lib/validations'

export function AdminDashboard() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [assignProject, setAssignProject] = useState<Project | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [isSigningOut, setIsSigningOut] = useState(false)

  const { 
    projects, 
    loading: projectsLoading, 
    error: projectsError, 
    fetchProjects,
    updateProject,
    assignDesigner,
    approveProject,
    rejectProject,
    updateStatus
  } = useAdminProjects()

  // Configurar filtros para la API
  const getApiFilters = (): ProjectQueryForm => {
    return {
      page: 1,
      pageSize: 50
    }
  }

  // Filtrar proyectos en el frontend según la categoría seleccionada
  const getFilteredProjects = (): Project[] => {
    if (!Array.isArray(projects)) return []
    
    switch (filter) {
      case 'pending':
        // Pendiente: creado, asignado, en_progreso, entregado
        return projects.filter(project => 
          ['creado', 'asignado', 'en_progreso', 'entregado'].includes(project.status)
        )
      case 'completed':
        // Completado: aprobado, rechazado
        return projects.filter(project => 
          ['aprobado', 'rechazado'].includes(project.status)
        )
      case 'all':
      default:
        return projects
    }
  }

  useEffect(() => {
    if (!loading && !isSigningOut) {
      if (!user) {
        router.push('/login')
        return
      }
      if ((user.role as string) !== 'admin') {
        router.push('/')
        return
      }
    }
  }, [loading, user, router, isSigningOut])

  // Cargar proyectos inicialmente
  useEffect(() => {
    if (user && (user.role as string) === 'admin') {
      fetchProjects(getApiFilters())
    }
  }, [user])


  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#eef1bd_0%,_#bbd686_35%,_white_70%)] flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#eef1bd_0%,_#bbd686_35%,_white_70%)]">
      {/* Header */}
      <DashboardHeader 
        brandName="Flash Designer"
        userRole="Admin"
        userName={user?.full_name || ''}
        onSignOut={async () => {
          setIsSigningOut(true)
          await signOut()
          router.replace('/')
        }}
      />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Panel de Administración
          </h2>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-800">Filtrar proyectos:</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors border ${
                  filter === 'all' 
                    ? 'border-green-500 text-green-600 bg-green-50' 
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors border ${
                  filter === 'pending' 
                    ? 'border-yellow-500 text-yellow-600 bg-yellow-50' 
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                Pendientes
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors border ${
                  filter === 'completed' 
                    ? 'border-green-500 text-green-600 bg-green-50' 
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                Completados
              </button>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        {projectsLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando proyectos...</p>
            </div>
          </div>
        ) : projectsError ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error: {projectsError}</p>
              <button 
                onClick={() => fetchProjects(getApiFilters())}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : (
          <AdminProjectTable 
            projects={getFilteredProjects()} 
            onProjectSelect={setSelectedProject}
            onEditProject={setEditProject}
            onAssignDesigner={setAssignProject}
            onApproveProject={approveProject}
            onRejectProject={rejectProject}
            onUpdateProject={updateProject}
            onAssignDesignerToProject={assignDesigner}
            onUpdateStatus={updateStatus}
          />
        )}

        {/* Project Detail Modal */}
        <ProjectDetail 
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />

        {/* Edit Project Modal */}
        <EditProjectModal
          isOpen={!!editProject}
          onClose={() => setEditProject(null)}
          onUpdateProject={updateProject}
          project={editProject}
        />

        {/* Assign Designer Modal */}
        <AssignDesignerModal
          isOpen={!!assignProject}
          onClose={() => setAssignProject(null)}
          onAssignDesigner={assignDesigner}
          project={assignProject}
        />
      </main>
    </div>
  )
}
