'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { USER_ROLES } from '@/lib/utils/constants'

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { updateRole, user } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) return
    
    setLoading(true)
    setError('')

    try {
      await updateRole(selectedRole as any)
      
      // Redirigir según el rol seleccionado
      if (selectedRole === USER_ROLES.MARCA) {
        router.push('/dashboard/marca')
      } else if (selectedRole === USER_ROLES.DISEÑADOR) {
        router.push('/dashboard/disenador')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Error al seleccionar rol')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#eef1bd_0%,_#bbd686_35%,_white_70%)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Selecciona tu Rol</h2>
            <p className="text-gray-600">¿Cómo quieres usar Flash Designer?</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedRole === USER_ROLES.MARCA 
                    ? 'border-gray-800 bg-gray-50' 
                    : 'border-gray-300 hover:border-gray-500'
                }`}
                onClick={() => setSelectedRole(USER_ROLES.MARCA)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedRole === USER_ROLES.MARCA 
                      ? 'border-gray-800 bg-gray-800' 
                      : 'border-gray-400'
                  }`}>
                    {selectedRole === USER_ROLES.MARCA && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Marca</h3>
                    <p className="text-sm text-gray-600">
                      Crear proyectos de diseño y trabajar con diseñadores
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedRole === USER_ROLES.DISEÑADOR 
                    ? 'border-gray-800 bg-gray-50' 
                    : 'border-gray-300 hover:border-gray-500'
                }`}
                onClick={() => setSelectedRole(USER_ROLES.DISEÑADOR)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedRole === USER_ROLES.DISEÑADOR 
                      ? 'border-gray-800 bg-gray-800' 
                      : 'border-gray-400'
                  }`}>
                    {selectedRole === USER_ROLES.DISEÑADOR && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Diseñador</h3>
                    <p className="text-sm text-gray-600">
                      Trabajar en proyectos asignados y crear diseños
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !selectedRole}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Configurando...' : 'Continuar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
