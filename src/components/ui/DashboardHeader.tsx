import Link from 'next/link'

interface DashboardHeaderProps {
  brandName: string
  userRole: string
  userName: string
  onSignOut: () => void
}

export function DashboardHeader({ 
  brandName, 
  userRole, 
  userName, 
  onSignOut 
}: DashboardHeaderProps) {
  return (
    <header className="bg-transparent">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">{brandName}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Hola, {userName}</span>
            <button 
              onClick={onSignOut}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
