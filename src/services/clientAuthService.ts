import { createClient } from '@/lib/supabase/client'

export const clientAuthService = {
  async signUp(email: string, password: string, fullName: string) {
    const supabase = createClient()
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })
    
    if (authError) throw authError
    
    // Crear perfil en la tabla profiles
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          role: null // seleccionar rol después 
        })
      
      if (profileError) {
        console.error('Error creating profile:', profileError)
        // No lanzar error aquí para no interrumpir el registro
      }
    }
    
    return authData
  },

  async signIn(email: string, password: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  async signOut() {
    const supabase = createClient()
    
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const supabase = createClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }
}
