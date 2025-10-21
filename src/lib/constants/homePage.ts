export const BRAND_CONFIG = {
  brandName: 'Flash Designer',
  loginText: 'Iniciar Sesión',
  registerText: 'Registrarse',
  loginHref: '/login',
  registerHref: '/register'
} as const

export const HERO_CONFIG = {
  title: 'Diseños para',
  subtitle: 'Profesionales',
  description: 'Conecta con diseñadores talentosos para proyectos de diseño rápidos y profesionales. Desde logos hasta materiales de marketing, encuentra el diseñador perfecto para tu marca.'
} as const

export const FEATURES_CONFIG = [
  {
    icon: '⚡',
    iconBgColor: '',
    title: 'Diseños Rápidos',
    description: 'Proyectos completados en tiempo récord sin comprometer la calidad del diseño.'
  },
  {
    icon: '🎨',
    iconBgColor: '',
    title: 'Diseñadores Talentosos',
    description: 'Conecta con diseñadores profesionales verificados y especializados.'
  },
  {
    icon: '📱',
    iconBgColor: '',
    title: 'Seguimiento en Tiempo Real',
    description: 'Monitorea el progreso de tus proyectos desde cualquier dispositivo.'
  }
] as const

export const STYLES = {
  background: 'min-h-screen bg-[radial-gradient(ellipse_at_top,_#eef1bd_0%,_#bbd686_35%,_white_70%)]',
  featuresContainer: 'mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-8'
} as const
