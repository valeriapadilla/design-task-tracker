//obtener la sesión del usuario

import {createClient} from '@/lib/supabase/server'
import type { SessionUser } from '@/lib/types'
import type { UserRole } from '@/lib/utils/constants'

export async function getSessionUser(): Promise<SessionUser | null>{
    try{
        const supabase = await createClient()

        const {data: {user}, error: authError} = await supabase.auth.getUser()

        if (authError || !user) return null

        const role = user.app_metadata?.role as UserRole | null

        const {data: profile, error: profileError} = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single()

        if (profileError || !profile) return null

        return {
            id: user.id,
            email: user.email!,
            role,
            full_name: profile.full_name,
        }   
    } catch(error){
        console.error('Error getting session user:', error)
        return null
    }
}

