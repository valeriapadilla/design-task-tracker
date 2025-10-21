export function ok<T>(data: T) {
    return Response.json({ data }, { status: 200 })
  }
  
  export function created<T>(data: T) {
    return Response.json({ data }, { status: 201 })
  }
  
export function badRequest(message: string, details?: unknown) {
  return Response.json({ error: { message, details } }, { status: 400 })
}
  
  export function unauthorized(message = 'No autorizado') {
    return Response.json({ error: { message } }, { status: 401 })
  }
  
  export function forbidden(message = 'Acceso denegado') {
    return Response.json({ error: { message } }, { status: 403 })
  }
  
  export function notFound(message = 'Recurso no encontrado') {
    return Response.json({ error: { message } }, { status: 404 })
  }
  
  export function serverError(message = 'Error interno del servidor') {
    return Response.json({ error: { message } }, { status: 500 })
  }