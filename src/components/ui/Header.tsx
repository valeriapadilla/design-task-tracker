import Link from 'next/link'

interface HeaderProps {
  brandName: string
  loginText: string
  registerText: string
  loginHref: string
  registerHref: string
}

export function Header({ 
  brandName, 
  loginText, 
  registerText, 
  loginHref, 
  registerHref 
}: HeaderProps) {
  return (
    <header className="bg-transparent">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">{brandName}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href={loginHref} 
              className="text-gray-800 hover:text-gray-600 font-medium transition-colors duration-200"
            >
              {loginText}
            </Link>
            <Link 
              href={registerHref} 
              className="px-6 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200"
            >
              {registerText}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
