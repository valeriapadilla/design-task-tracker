import {getSessionUser} from '@/lib/auth/getSession'
import type {SessionUser} from '@/lib/types'
import {USER_ROLES, type UserRole} from '@/lib/utils/constants'

export async function requireAuth(): Promise<SessionUser>{
    const user = await getSessionUser()
    if(!user){
        throw new Error('UNAUTHORIZED')
    }
    return user
}

export async function requireRole(requiredRole: UserRole): Promise<SessionUser> {
    const user = await requireAuth()
    if (!user.role) {
        throw new Error('ROLE_REQUIRED')
    }
    if(user.role !== requiredRole){
        throw new Error('FORBIDDEN')
    }
    return user
}

export async function requireAnyRole(allowedRoles: UserRole[]): Promise<SessionUser>{
    const user = await requireAuth()
    if (!user.role) {
        throw new Error('ROLE_REQUIRED')
    }
    if(!allowedRoles.includes(user.role)){
        throw new Error('FORBIDDEN')
    }
    return user
}

//helpers especificos para roles
export const requireAdmin = () => requireRole(USER_ROLES.ADMIN)
export const requireMarca = () => requireRole(USER_ROLES.MARCA)
export const requireDisenador = () => requireRole(USER_ROLES.DISEÑADOR)


