import { NextRequest } from 'next/server'
import { authService } from '@/services/authService'
import { loginSchema } from '@/lib/validations'
import { ok, badRequest } from '@/lib/http/responses'

// Iniciar sesión
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)
    
    const result = await authService.signIn(email, password)
    
    return ok({
      message: 'Sesión iniciada exitosamente',
      user: result.user
    })
  } catch (error) {
    return badRequest('Error al iniciar sesión', error)
  }
}