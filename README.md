# Design Task Tracker

Una aplicación web para gestionar proyectos de diseño entre marcas y diseñadores, facilitando la comunicación y seguimiento del progreso de trabajos creativos.

## 🚀 Tecnologías

- **Frontend:** Next.js 15, React 19, TypeScript
- **Backend:** Next.js API Routes, Supabase
- **Base de datos:** PostgreSQL (Supabase)
- **Storage:** Supabase Storage
- **Autenticación:** Supabase Auth
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## 🏗️ Arquitectura

**Arquitectura Full-Stack con Next.js:**
- **Frontend:** Páginas React con Server/Client Components
- **Backend:** API Routes para lógica de negocio
- **Base de datos:** Supabase como BaaS (Backend as a Service)
- **Autenticación:** JWT con cookies seguras
- **Storage:** Archivos en buckets de Supabase

## 🛠️ Instrucciones de instalación

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Cuenta de Supabase

### Pasos

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd design-task-tracker
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear archivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

4. **Configurar Supabase**
- Crear proyecto en Supabase
- Configurar tablas: `profiles`, `projects`
- Crear bucket de storage: `project-files`
- Configurar políticas RLS

### Estructura de la base de datos

**Tabla `profiles`:**
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT CHECK (role IN ('admin', 'marca', 'diseñador')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Tabla `projects`:**
```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'creado',
  brand_id UUID REFERENCES profiles(id),
  designer_id UUID REFERENCES profiles(id),
  files TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

6. **Abrir en el navegador**
```
http://localhost:3000
```

## 💡 Explicación técnica

### ¿Por qué Next.js?
- **Full-stack:** Frontend y backend en un solo framework
- **SSR/SSG:** Mejor SEO y rendimiento
- **API Routes:** Backend integrado sin servidor separado
- **TypeScript:** Tipado estático para menos errores

### ¿Por qué Supabase?
- **BaaS completo:** Base de datos, auth y storage en uno
- **PostgreSQL:** Base de datos robusta y escalable
- **RLS:** Seguridad a nivel de fila automática
- **Real-time:** Actualizaciones en tiempo real

### Decisiones de arquitectura

**Autenticación con cookies:**
- Más seguro que localStorage
- Funciona con SSR
- Protección CSRF automática

**JWT con rol en el token:**
- El rol se guarda en `user_metadata` del JWT
- Mayor seguridad: no se puede modificar desde el cliente
- Validación server-side en cada request
- Evita consultas innecesarias a la base de datos

**Validaciones con schemas (Zod):**
- Validación de entrada en API routes
- Schemas específicos por rol: `UpdateStatusSchema`, `AdminUpdateStatusSchema`
- Type safety en tiempo de compilación
- Prevención de errores de validación

**API Routes en lugar de servidor separado:**
- Menos complejidad de deployment
- Misma base de código
- Mejor rendimiento (menos latencia)

**Storage en Supabase:**
- URLs firmadas para seguridad
- Escalabilidad automática
- Integración nativa con la base de datos

**Componentes separados por rol:**
- `AdminDashboard`, `DesignerProjectTable`, etc.
- Reutilización de código
- Mantenimiento más fácil

## 🛡️ Rutas y protección

### Rutas públicas
- `/` - Página principal
- `/login` - Inicio de sesión
- `/register` - Registro de usuarios
- `/auth/callback` - Callback de autenticación Supabase

### Rutas protegidas por rol

**Admin (`/dashboard`):**
- Gestión completa de proyectos
- Asignación de diseñadores
- Aprobación/rechazo de entregas

**Marca (`/dashboard/marca`):**
- Crear proyectos
- Ver proyectos propios
- Aprobar/rechazar entregas

**Diseñador (`/dashboard/disenador`):**
- Ver proyectos asignados
- Cambiar estado de proyectos
- Subir archivos

### Middleware de protección
```typescript
// middleware.ts
- Verifica autenticación en rutas /dashboard/*
- Redirige según el rol del usuario
- Protege rutas específicas por rol
```

### API Routes protegidas
```typescript
// requireRole.ts
- requireAdmin() - Solo administradores
- requireDisenador() - Solo diseñadores
- requireAuth() - Usuario autenticado
```

### Validaciones con schemas
```typescript
// validations/index.ts
- UpdateStatusSchema - Estados que puede cambiar un diseñador
- AdminUpdateStatusSchema - Todos los estados (solo admin)
- registerSchema - Validación de registro
- loginSchema - Validación de login
```

### Flujo de seguridad
1. **JWT Token:** Contiene rol en `user_metadata`
2. **Middleware:** Verifica autenticación y rol
3. **API Route:** Valida con schema específico
4. **Database:** RLS protege datos por rol

### 🛡️ Row Level Security (RLS) en Supabase

Hemos implementado políticas de RLS para asegurar que los usuarios solo puedan acceder a los datos que les corresponden, basándose en su rol y propiedad de los registros.

**Tabla `profiles`:**
- **Admins can view all profiles** - SELECT para todos los perfiles
- **Users can update own profile** - UPDATE solo su propio perfil  
- **Users can view own profile** - SELECT solo su propio perfil

**Tabla `projects`:**
- **Admins can delete all projects** - DELETE todos los proyectos
- **Admins can update all projects** - UPDATE todos los proyectos
- **Admins can view all projects** - SELECT todos los proyectos
- **Brands can create projects** - INSERT nuevos proyectos
- **Brands can delete their own projects** - DELETE solo sus proyectos
- **Brands can update their own projects** - UPDATE solo sus proyectos
- **Brands can view their own projects** - SELECT solo sus proyectos
- **Designers can update project status** - UPDATE estado de proyectos asignados
- **Designers can view assigned projects** - SELECT solo proyectos asignados

Estas políticas garantizan que la información sensible y las acciones críticas estén protegidas a nivel de base de datos, complementando la seguridad a nivel de aplicación.

## 📁 Estructura del proyecto

```
src/
├── app/                 # Páginas y API routes
│   ├── api/            # API Routes protegidas
│   ├── dashboard/      # Dashboards por rol
│   └── auth/           # Callback de autenticación
├── components/ui/       # Componentes reutilizables
├── hooks/              # Custom hooks
├── lib/                # Utilidades y configuración
│   ├── auth/           # Funciones de autenticación
│   └── supabase/       # Clientes de Supabase
├── services/           # Lógica de negocio
└── middleware.ts       # Middleware de autenticación
```

## 🔐 Roles y permisos

- **Admin:** Gestión completa de proyectos y usuarios
- **Marca:** Crear proyectos y aprobar entregas
- **Diseñador:** Trabajar en proyectos asignados

## 🚀 Deployment

El proyecto está configurado para deploy automático en Vercel:

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push

**URLs de producción:**
- Site URL: `https://design-task-tracker.vercel.app`
- Auth Callback: `https://design-task-tracker.vercel.app/auth/callback`