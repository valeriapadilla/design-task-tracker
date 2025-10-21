'use client'

import { useState, useEffect } from 'react'
import { clientAuthService } from '@/services/clientAuthService'
import { createClient } from '@/lib/supabase/client'
import type { SessionUser } from '@/lib/types'
import type { UserRole } from '@/lib/utils/constants'

export function useAuth() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      setLoading(true)
      const currentUser = await clientAuthService.getCurrentUser()
      
      if (currentUser) {
        // Crear usuario con datos de metadatos (fuente de verdad)
        setUser({
          id: currentUser.id,
          email: currentUser.email!,
          role: currentUser.user_metadata?.role as UserRole | null,
          full_name: currentUser.user_metadata?.full_name || null
        })
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error('Error checking user:', err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // Usar solo el cliente de Supabase para registro
      const result = await clientAuthService.signUp(email, password, fullName)
      
      if (result.user) {
        await checkUser()
      }
      
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // Usar solo el cliente de Supabase para login
      const result = await clientAuthService.signIn(email, password)
      
      if (result.user) {
        await checkUser()
      }
      
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      
      // Usar solo el cliente de Supabase para logout
      await clientAuthService.signOut()
      setUser(null)
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateRole = async (role: UserRole) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/auth/role', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      })
      
      if (response.ok) {
        // Refrescar el usuario para obtener el JWT actualizado
        const currentUser = await clientAuthService.getCurrentUser()
        if (currentUser) {
          await checkUser()
        }
      } else {
        throw new Error('Error al actualizar rol')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateRole,
    isAuthenticated: !!user,
    needsRoleSelection: user && !user.role,
  }
}
