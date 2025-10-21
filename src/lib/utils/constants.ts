export const USER_ROLES = {
    ADMIN: 'admin',
    MARCA: 'marca',
    DISEÑADOR: 'diseñador'
} as const
  
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]
  
export const PROJECT_STATUS = {
    CREADO: 'creado',
    ASIGNADO: 'asignado',
    EN_PROGRESO: 'en_progreso',
    ENTREGADO: 'entregado',
    APROBADO: 'aprobado',
    RECHAZADO: 'rechazado'
  } as const
  
export type ProjectStatus = typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS]

//status permitidos para cada rol
export const STATUS_TRANSITIONS = {
    MARCA: [PROJECT_STATUS.CREADO],
    ADMIN: [PROJECT_STATUS.ASIGNADO, PROJECT_STATUS.APROBADO, PROJECT_STATUS.RECHAZADO],
    DISEÑADOR: [PROJECT_STATUS.EN_PROGRESO, PROJECT_STATUS.ENTREGADO]
  } as const