import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/lib/utils/constants'

export const authService = {

  async signUp(email: string, password: string, fullName: string) {

    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    })
    if (authError) throw authError
    
    // Crear perfil en profiles
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: fullName,
          role: null // seleccionar rol después
        })
      
      if (profileError) throw profileError
    }
    
    return authData
  },

  async signIn(email: string, password: string) {
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  // Cerrar sesión
  async signOut() {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.signOut()
    
    if (error) throw error
  },

  // Actualizar rol del usuario (después de seleccionar)
  async updateUserRole(userId: string, role: UserRole) {
    const supabase = await createClient()
    
    // Actualizar user_metadata del usuario actual (fuente de verdad)
    const { error: authError } = await supabase.auth.updateUser({
      data: { role }
    })
    
    if (authError) throw authError
    
    // También actualizar profiles para consistencia
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
    
    if (profileError) throw profileError
  },

  // Obtener usuarios para asignar (solo admin)
  async getDesigners(): Promise<Array<{ id: string, full_name: string }>> {
    const supabase = await createClient()
    
    // Obtener diseñadores desde la tabla profiles 
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('role', 'diseñador')
    
    if (error) throw error
    
    const designers = (data || []).map(profile => ({
      id: profile.id,
      full_name: profile.full_name || `Usuario ${profile.id.slice(0, 8)}`
    }))
    
    return designers
  }
}