'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useProjects } from '@/hooks/useProjects'
import { USER_ROLES } from '@/lib/utils/constants'
import { ProjectTable } from '@/components/ui/ProjectTable'
import { ProjectDetail } from '@/components/ui/ProjectDetail'
import { CreateProjectModal } from '@/components/ui/CreateProjectModal'
import { DashboardHeader } from '@/components/ui/DashboardHeader'
import { Project } from '@/lib/types'
import type { ProjectQueryForm } from '@/lib/validations'

export default function MarcaDashboard() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const { projects, loading: projectsLoading, error: projectsError, fetchProjects, createProject } = useProjects()

  // Configurar filtros para la API
  const getApiFilters = (): ProjectQueryForm => {
    const baseFilters: ProjectQueryForm = {
      page: 1,
      pageSize: 50
    }

    // Para marca, solo necesitamos dos categorías:
    // - Pendiente: creado, asignado, en_progreso, entregado
    // - Completado: aprobado, rechazado
    // - Todos: todos los estados
    
    return baseFilters // Por ahora traemos todos y filtramos en el frontend
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
    if (!loading) {
      if (!user) {
        router.push('/login')
        return
      }
      if (user.role !== USER_ROLES.MARCA) {
        router.push('/')
        return
      }
    }
  }, [loading, user, router])

  // Cargar proyectos inicialmente
  useEffect(() => {
    if (user && user.role === USER_ROLES.MARCA) {
      fetchProjects(getApiFilters())
    }
  }, [user])

  // Actualizar proyectos cuando cambie el filtro
  useEffect(() => {
    if (user && user.role === USER_ROLES.MARCA) {
      fetchProjects(getApiFilters())
    }
  }, [user]) // Solo cuando cambie el usuario, no el filtro

  const handleCreateProject = async (projectData: { title: string; description: string; files: File[] }) => {
    try {
      // Primero crear el proyecto básico
      const project = await createProject({
        title: projectData.title,
        description: projectData.description
      })

      // Si hay archivos, subirlos por separado
      if (projectData.files.length > 0 && project?.id) {
        const formData = new FormData()
        formData.append('projectId', project.id)
        
        projectData.files.forEach((file) => {
          formData.append('files', file)
        })

        const filesResponse = await fetch('/api/files', {
          method: 'POST',
          body: formData,
        })

        if (!filesResponse.ok) {
          throw new Error('Error al subir archivos')
        }

        const filesData = await filesResponse.json()
        
        // Actualizar el proyecto con las URLs de los archivos
        const updateData = {
          files: filesData.data?.files || []
        }
        console.log('Update data being sent:', updateData)
        
        // Debug: Probar validación primero
        const debugResponse = await fetch('/api/debug', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        })
        
        const debugResult = await debugResponse.json()
        console.log('Debug validation result:', debugResult)
        
        if (!debugResponse.ok) {
          throw new Error(`Validation failed: ${debugResult.message}`)
        }
        
        // Verificar que el proyecto existe antes de actualizar
        console.log('Verifying project exists before update...')
        const verifyResponse = await fetch(`/api/projects/${project.id}`)
        if (!verifyResponse.ok) {
          throw new Error('Proyecto no encontrado para actualizar')
        }
        const verifyData = await verifyResponse.json()
        console.log('Project verification:', verifyData)
        
        const updateResponse = await fetch(`/api/projects/${project.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        })

        if (!updateResponse.ok) {
          const errorText = await updateResponse.text()
          console.error('Update failed:', updateResponse.status, errorText)
          throw new Error('Error al actualizar proyecto con archivos')
        }

        const updatedProject = await updateResponse.json()
        console.log('Project updated with files:', updatedProject)
      }

      // Recargar la lista de proyectos
      fetchProjects(getApiFilters())
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }

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
        userRole="Marca"
        userName={user?.full_name || ''}
        onSignOut={async () => {
          await signOut()
          router.push('/')
        }}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Dashboard Marca
          </h2>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            + Crear Proyecto
          </button>
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
          <ProjectTable 
            projects={getFilteredProjects()} 
            onProjectSelect={setSelectedProject}
          />
        )}

        {/* Project Detail Modal */}
        <ProjectDetail 
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />

        {/* Create Project Modal */}
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateProject={handleCreateProject}
        />
      </main>
    </div>
  )
}