'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { USER_ROLES } from '@/lib/utils/constants'
import { AdminDashboard } from '../../components/ui/AdminDashboard'

export default function DashboardPage() {
  const { user, loading, isAuthenticated, needsRoleSelection, signOut } = useAuth()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    if (!loading && !isSigningOut) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (needsRoleSelection) {
        router.push('/role-selection')
      } else if (user?.role) {
        // Redirigir según el rol
        if (user.role === USER_ROLES.MARCA) {
          router.push('/dashboard/marca')
        } else if (user.role === USER_ROLES.DISEÑADOR) {
          router.push('/dashboard/disenador')
        }
        // Si es admin, se queda en el dashboard principal
      }
    }
  }, [loading, isAuthenticated, needsRoleSelection, user?.role, router, isSigningOut])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-redwood mx-auto"></div>
          <p className="text-coffee mt-4 text-center">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || needsRoleSelection) {
    return null
  }

  // Si es admin, mostrar el dashboard de admin
  if (user?.role === USER_ROLES.ADMIN) {
    return <AdminDashboard />
  }

  return (
    <div className="min-h-screen bg-gradient-warm">

      <header className="bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-coffee">Flash Designer</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-coffee">
                Hola, {user?.full_name || user?.email}
              </span>
              <span className="px-3 py-1 bg-lion text-coffee rounded-full text-sm font-medium">
                {(user?.role as string) === 'admin' ? 'Admin' : (user?.role as string) === 'marca' ? 'Marca' : (user?.role as string) === 'diseñador' ? 'Diseñador' : ''}
              </span>
              <button
                onClick={async () => {
                  setIsSigningOut(true)
                  await signOut()
                  router.replace('/')
                }}
                className="px-4 py-2 text-coffee hover:text-redwood transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-coffee mb-6">Dashboard</h2>
          
          {user?.role === USER_ROLES.MARCA && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-coffee mb-4">Mis Proyectos</h3>
              <p className="text-coffee/70">Aquí verás tus proyectos creados y su progreso.</p>
            </div>
          )}

          {user?.role === USER_ROLES.DISEÑADOR && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-coffee mb-4">Proyectos Asignados</h3>
              <p className="text-coffee/70">Aquí verás los proyectos que te han asignado.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
