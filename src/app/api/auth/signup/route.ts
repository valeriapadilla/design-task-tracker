import { NextRequest } from 'next/server'
import { authService } from '@/services/authService'
import { registerSchema } from '@/lib/validations'
import { created, badRequest } from '@/lib/http/responses'

// Registrar usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, full_name } = registerSchema.parse(body)
    
    const result = await authService.signUp(email, password, full_name)
    
    return created({
      message: 'Usuario registrado exitosamente',
      user: result.user
    })
  } catch (error) {
    return badRequest('Error al registrar usuario', error)
  }
}
