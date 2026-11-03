export type RoleKey = 
  | 'admin_ceo'
  | 'gerente_sucursal'
  | 'encargado_depto'
  | 'rrhh'
  | 'trabajador';

export type PermissionCategory = 
  | 'usuarios' 
  | 'sucursales' 
  | 'departamentos' 
  | 'comunicados' 
  | 'notificaciones' 
  | 'estadisticas' 
  | 'auditoria';

export interface Role {
  id: string;
  key: RoleKey;
  nombre: string;
  descripcion: string;
  esSistema: boolean;
  permisos: {
    [key in PermissionCategory]?: string[];
  };
}

export interface DispositivoRegistrado {
  id: string;
  modelo: string;
  tipo: 'android' | 'ios' | 'web';
  versionApp: string;
  ultimoAcceso: string;
  tokenActivo: boolean;
}

export interface Usuario {
  id: string;
  nombre: string;
  rut: string;
  email: string;
  rolKey: RoleKey;
  sucursalId: string;
  departamentoId: string;
  cargo: string;
  activo: boolean;
  avatar: string;
  dispositivos: DispositivoRegistrado[];
}

export interface Sucursal {
  id: string;
  nombre: string;
  codigo: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  gerenteId: string;
  departamentosIds: string[];
  activo: boolean;
  totalTrabajadores: number;
}

export interface Departamento {
  id: string;
  nombre: string;
  codigo: string;
  encargadoId: string;
  sucursalesIds: string[];
  activo: boolean;
  descripcion: string;
  totalTrabajadores: number;
}

export type PrioridadComunicado = 'normal' | 'importante' | 'urgente';
export type EstadoComunicado = 'borrador' | 'programado' | 'publicado' | 'anulado';
export type AlcanceTipo = 'toda_empresa' | 'sucursal' | 'departamento' | 'individual' | 'encargados_area';
export type TipoFormatoComunicado = 'rapido' | 'completo';

export interface ImagenAdjunta {
  id: string;
  url: string;
  nombre: string;
  tamano: string;
  esPrincipal: boolean;
  orden: number;
}

export interface PdfAdjunto {
  id: string;
  nombre: string;
  tamano: string;
  url: string;
  paginas: number;
}

export type EstadoLectura = 'pendiente' | 'visualizado' | 'confirmado';

export interface ConfirmacionUsuario {
  usuarioId: string;
  usuarioNombre: string;
  rut: string;
  sucursalNombre: string;
  departamentoNombre: string;
  cargo: string;
  estado: EstadoLectura;
  visualizadoEn?: string;
  confirmadoEn?: string;
  dispositivoConfirmacion?: string;
}

export interface Comunicado {
  id: string;
  codigo: string;
  titulo: string;
  extracto: string;
  cuerpoHtml: string;
  prioridad: PrioridadComunicado;
  estado: EstadoComunicado;
  alcanceTipo: AlcanceTipo;
  targetSucursales: string[];
  targetDepartamentos: string[];
  targetUsuarios: string[];
  autorId: string;
  autorNombre: string;
  autorRol: string;
  creadoEn: string;
  publicadoEn?: string;
  programadoEn?: string;
  imagenes: ImagenAdjunta[];
  pdfs: PdfAdjunto[];
  totalDestinatarios: number;
  totalVisualizados: number;
  totalConfirmados: number;
  confirmaciones: ConfirmacionUsuario[];
  tipoFormato?: TipoFormatoComunicado;
}

export interface EventoAuditoria {
  id: string;
  fechaHora: string;
  usuarioId: string;
  usuarioNombre: string;
  rolNombre: string;
  accion: 'Creación de comunicado' | 'Publicación de comunicado' | 'Anulación de comunicado' | 'Modificación de rol' | 'Asignación de permisos' | 'Creación de usuario' | 'Actualización de usuario' | 'Desactivación de sucursal' | 'Envío de recordatorio masivo';
  categoria: 'comunicados' | 'usuarios' | 'roles' | 'sucursales' | 'notificaciones';
  descripcion: string;
  ip: string;
}

export interface NotificacionSistema {
  id: string;
  comunicadoId?: string;
  titulo: string;
  mensaje: string;
  tipo: PrioridadComunicado | 'recordatorio' | 'sistema';
  canal: 'App Móvil' | 'Web Push' | 'Todos';
  fechaEnvio: string;
  destinatarios: number;
  entregados: number;
  fallidos: number;
  estado: 'Enviado con éxito' | 'En proceso' | 'Con advertencias';
  incidencia?: string;
}

export type EscalaFuente = 'pequena' | 'normal' | 'mediana' | 'grande' | 'extragrande';
export type DensidadUI = 'compacta' | 'normal' | 'comoda' | 'tactil';
export type ModoVisual = 'corporativo' | 'alto_contraste' | 'oscuro_suave';
export type FamiliaTipografica = 'inter' | 'atkinson' | 'roboto' | 'mono';

export interface ConfiguracionSistema {
  // Tipografía y Accesibilidad Visual
  escalaFuente: EscalaFuente;
  porcentajeFuente: number; // 90, 100, 115, 130, 145
  pesoFuenteAumentado: boolean;
  familiaTipografica: FamiliaTipografica;
  
  // Escala de Componentes e Interfaz
  densidadUI: DensidadUI;
  tamanoBotones: 'normal' | 'grande' | 'extragrande';
  tamanoIconos: 'normal' | 'mediano' | 'grande';
  bordesAcentuados: boolean;
  
  // Accesibilidad Funcional y Visual
  modoVisual: ModoVisual;
  reducirAnimaciones: boolean;
  resaltarElementosInteractivos: boolean;
  cursorAumentado: boolean;
  lectorPantallaOptimizado: boolean;
  
  // Parámetros Operativos del Sistema
  sonidoAlertasUrgentes: boolean;
  volumenSonido: number; // 0 a 100
  intervaloActualizacionSegundos: number; // 15, 30, 60, 120
  notificacionesFlotantes: boolean;
  servidorLocalPush: boolean;
  direccionIpServidor: string;
}
