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

// Labels para mostrar en UI
export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.CREADO]: 'Creado',
  [PROJECT_STATUS.ASIGNADO]: 'Asignado',
  [PROJECT_STATUS.EN_PROGRESO]: 'En Progreso',
  [PROJECT_STATUS.ENTREGADO]: 'Entregado',
  [PROJECT_STATUS.APROBADO]: 'Aprobado',
  [PROJECT_STATUS.RECHAZADO]: 'Rechazado'
} as const

// Colores para los estados
export const PROJECT_STATUS_COLORS = {
  [PROJECT_STATUS.CREADO]: 'bg-gray-100 text-gray-800',
  [PROJECT_STATUS.ASIGNADO]: 'bg-blue-100 text-blue-800',
  [PROJECT_STATUS.EN_PROGRESO]: 'bg-yellow-100 text-yellow-800',
  [PROJECT_STATUS.ENTREGADO]: 'bg-purple-100 text-purple-800',
  [PROJECT_STATUS.APROBADO]: 'bg-green-100 text-green-800',
  [PROJECT_STATUS.RECHAZADO]: 'bg-red-100 text-red-800'
} as const