import {createClient} from '@/lib/supabase/server'
import type { SessionUser } from '@/lib/types'
import type { UserRole } from '@/lib/utils/constants'

export async function getSessionUser(): Promise<SessionUser | null>{
    try{
        const supabase = await createClient()

        const {data: {user}, error: authError} = await supabase.auth.getUser()

        if (authError || !user) return null

        const role = user.user_metadata?.role as UserRole | null
        const full_name = user.user_metadata?.full_name || null

        return {
            id: user.id,
            email: user.email!,
            role: role,
            full_name: full_name,
        }   
    } catch(error){
        console.error('Error getting session user:', error)
        return null
    }
}

