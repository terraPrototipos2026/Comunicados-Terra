import {
  Role,
  Sucursal,
  Departamento,
  Usuario,
  Comunicado,
  EventoAuditoria,
  NotificacionSistema,
  RoleKey,
} from '../types';

export const INITIAL_ROLES: Role[] = [
  {
    id: 'rol-1',
    key: 'admin_ceo',
    nombre: 'Administrador Principal (CEO)',
    descripcion: 'Control absoluto del sistema corporativo, sucursales, usuarios, permisos y auditoría.',
    esSistema: true,
    permisos: {
      usuarios: ['crear', 'editar', 'eliminar', 'asignar_rol', 'ver_dispositivos'],
      sucursales: ['crear', 'editar', 'desactivar', 'asignar_gerente'],
      departamentos: ['crear', 'editar', 'desactivar', 'asignar_encargado'],
      comunicados: ['crear_global', 'crear_sucursal', 'crear_depto', 'publicar_directo', 'anular', 'editar_borrador'],
      notificaciones: ['enviar_urgente', 'configurar_recordatorios', 'ver_incidencias'],
      estadisticas: ['ver_globales', 'ver_sucursal', 'exportar_reportes'],
      auditoria: ['consultar_bitacora', 'exportar_auditoria']
    }
  },
  {
    id: 'rol-2',
    key: 'gerente_sucursal',
    nombre: 'Gerente de Sucursal',
    descripcion: 'Administra y publica comunicados exclusivos para su sucursal y sus respectivos departamentos.',
    esSistema: true,
    permisos: {
      usuarios: ['ver_dispositivos'],
      sucursales: [],
      departamentos: [],
      comunicados: ['crear_sucursal', 'crear_depto', 'publicar_directo', 'editar_borrador'],
      notificaciones: ['enviar_urgente', 'configurar_recordatorios'],
      estadisticas: ['ver_sucursal', 'exportar_reportes'],
      auditoria: []
    }
  },
  {
    id: 'rol-3',
    key: 'encargado_depto',
    nombre: 'Encargado de Departamento',
    descripcion: 'Publica avisos operativos para su departamento y supervisa la confirmación de su equipo.',
    esSistema: true,
    permisos: {
      usuarios: [],
      sucursales: [],
      departamentos: [],
      comunicados: ['crear_depto', 'editar_borrador'],
      notificaciones: ['configurar_recordatorios'],
      estadisticas: ['ver_sucursal'],
      auditoria: []
    }
  },
  {
    id: 'rol-4',
    key: 'rrhh',
    nombre: 'Recursos Humanos',
    descripcion: 'Gestión de personal corporativo, inducciones, políticas y comunicados institucionales.',
    esSistema: true,
    permisos: {
      usuarios: ['crear', 'editar', 'ver_dispositivos'],
      sucursales: [],
      departamentos: ['editar'],
      comunicados: ['crear_global', 'crear_sucursal', 'crear_depto', 'publicar_directo', 'editar_borrador'],
      notificaciones: ['configurar_recordatorios'],
      estadisticas: ['ver_globales', 'exportar_reportes'],
      auditoria: ['consultar_bitacora']
    }
  },
  {
    id: 'rol-5',
    key: 'trabajador',
    nombre: 'Trabajador u Operario',
    descripcion: 'Recepción oficial de comunicados, visualización de documentos y confirmación de lectura.',
    esSistema: true,
    permisos: {
      usuarios: [],
      sucursales: [],
      departamentos: [],
      comunicados: [],
      notificaciones: [],
      estadisticas: [],
      auditoria: []
    }
  }
];

export const INITIAL_SUCURSALES: Sucursal[] = [
  {
    id: 'suc-1',
    codigo: 'SUC-CEN-01',
    nombre: 'Sucursal Central (Edificio Corporativo)',
    ciudad: 'Santiago Centro',
    direccion: 'Av. Libertador Bernardo O’Higgins 1449, Torre B',
    telefono: '+56 2 2940 8100',
    gerenteId: 'usr-2',
    departamentosIds: ['dep-1', 'dep-2', 'dep-3', 'dep-4', 'dep-5'],
    activo: true,
    totalTrabajadores: 84
  },
  {
    id: 'suc-2',
    codigo: 'SUC-NOR-02',
    nombre: 'Sucursal Norte (Planta Industrial)',
    ciudad: 'Quilicura',
    direccion: 'Panamericana Norte Km 18, Parque Empresarial',
    telefono: '+56 2 2940 8200',
    gerenteId: 'usr-3',
    departamentosIds: ['dep-1', 'dep-2', 'dep-4', 'dep-6'],
    activo: true,
    totalTrabajadores: 62
  },
  {
    id: 'suc-3',
    codigo: 'SUC-SUR-03',
    nombre: 'Sucursal Sur (Centro de Distribución)',
    ciudad: 'San Bernardo',
    direccion: 'Camino Lonquén 12200, Bodega 4-A',
    telefono: '+56 2 2940 8300',
    gerenteId: 'usr-4',
    departamentosIds: ['dep-2', 'dep-3', 'dep-6'],
    activo: true,
    totalTrabajadores: 45
  }
];

export const INITIAL_DEPARTAMENTOS: Departamento[] = [
  {
    id: 'dep-1',
    codigo: 'DEP-RRHH',
    nombre: 'Recursos Humanos',
    encargadoId: 'usr-5',
    sucursalesIds: ['suc-1', 'suc-2'],
    activo: true,
    descripcion: 'Gestión de personal, bienestar, clima laboral y contratos de trabajo.',
    totalTrabajadores: 18
  },
  {
    id: 'dep-2',
    codigo: 'DEP-OPE',
    nombre: 'Operaciones y Producción',
    encargadoId: 'usr-6',
    sucursalesIds: ['suc-1', 'suc-2', 'suc-3'],
    activo: true,
    descripcion: 'Líneas operativas en terreno, turnos productivos y control de calidad.',
    totalTrabajadores: 95
  },
  {
    id: 'dep-3',
    codigo: 'DEP-ADM',
    nombre: 'Administración y Finanzas',
    encargadoId: 'usr-7',
    sucursalesIds: ['suc-1', 'suc-3'],
    activo: true,
    descripcion: 'Contabilidad, compras, tesorería y auditoría interna.',
    totalTrabajadores: 24
  },
  {
    id: 'dep-4',
    codigo: 'DEP-LIM',
    nombre: 'Limpieza y Servicios Generales',
    encargadoId: 'usr-8',
    sucursalesIds: ['suc-1', 'suc-2'],
    activo: true,
    descripcion: 'Higiene industrial, sanitización, manejo de residuos e insumos.',
    totalTrabajadores: 22
  },
  {
    id: 'dep-5',
    codigo: 'DEP-SEG',
    nombre: 'Prevención de Riesgos y Seguridad',
    encargadoId: 'usr-9',
    sucursalesIds: ['suc-1'],
    activo: true,
    descripcion: 'Normativas de seguridad ocupacional, protocolos EPP y comités paritarios.',
    totalTrabajadores: 8
  },
  {
    id: 'dep-6',
    codigo: 'DEP-LOG',
    nombre: 'Logística y Despacho',
    encargadoId: 'usr-10',
    sucursalesIds: ['suc-2', 'suc-3'],
    activo: true,
    descripcion: 'Recepción de mercadería, inventarios, flotas y rutas de distribución.',
    totalTrabajadores: 24
  }
];

export const INITIAL_USUARIOS: Usuario[] = [
  {
    id: 'usr-1',
    nombre: 'Ignacio Valenzuela',
    rut: '12.894.231-K',
    email: 'ivalenzuela@terraempresa.com',
    rolKey: 'admin_ceo',
    sucursalId: 'suc-1',
    departamentoId: 'dep-3',
    cargo: 'Director General / CEO',
    activo: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    dispositivos: [
      { id: 'dev-101', modelo: 'MacBook Pro M3 Max - Web', tipo: 'web', versionApp: 'Portal v2.4.0', ultimoAcceso: '2026-10-31 11:42', tokenActivo: true },
      { id: 'dev-102', modelo: 'iPhone 15 Pro Max', tipo: 'ios', versionApp: 'TerraApp v1.9.4', ultimoAcceso: '2026-10-31 09:15', tokenActivo: true }
    ]
  },
  {
    id: 'usr-2',
    nombre: 'Carlos Mendoza Silva',
    rut: '14.230.119-4',
    email: 'cmendoza@terraempresa.com',
    rolKey: 'gerente_sucursal',
    sucursalId: 'suc-1',
    departamentoId: 'dep-3',
    cargo: 'Gerente General Sucursal Central',
    activo: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    dispositivos: [
      { id: 'dev-201', modelo: 'ThinkPad T14 - Windows 11', tipo: 'web', versionApp: 'Portal v2.4.0', ultimoAcceso: '2026-10-31 10:20', tokenActivo: true },
      { id: 'dev-202', modelo: 'Samsung Galaxy S24 Ultra', tipo: 'android', versionApp: 'TerraApp v1.9.4', ultimoAcceso: '2026-10-31 08:33', tokenActivo: true }
    ]
  },
  {
    id: 'usr-3',
    nombre: 'Elena Rostova Díaz',
    rut: '16.782.904-8',
    email: 'erostova@terraempresa.com',
    rolKey: 'gerente_sucursal',
    sucursalId: 'suc-2',
    departamentoId: 'dep-2',
    cargo: 'Gerente Operaciones Sucursal Norte',
    activo: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    dispositivos: [
      { id: 'dev-301', modelo: 'Dell Latitude 5440', tipo: 'web', versionApp: 'Portal v2.4.0', ultimoAcceso: '2026-10-31 11:05', tokenActivo: true },
      { id: 'dev-302', modelo: 'Xiaomi 13T Pro', tipo: 'android', versionApp: 'TerraApp v1.9.2', ultimoAcceso: '2026-10-30 18:22', tokenActivo: true }
    ]
  },
  {
    id: 'usr-4',
    nombre: 'Roberto Gómez Morales',
    rut: '13.441.872-1',
    email: 'rgomez@terraempresa.com',
    rolKey: 'gerente_sucursal',
    sucursalId: 'suc-3',
    departamentoId: 'dep-6',
    cargo: 'Gerente Logístico Sucursal Sur',
    activo: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    dispositivos: [
      { id: 'dev-401', modelo: 'HP EliteBook 840', tipo: 'web', versionApp: 'Portal v2.4.0', ultimoAcceso: '2026-10-31 09:50', tokenActivo: true }
    ]
  },
  {
    id: 'usr-5',
    nombre: 'Camila Sepúlveda Farías',
    rut: '17.309.442-5',
    email: 'csepulveda@terraempresa.com',
    rolKey: 'rrhh',
    sucursalId: 'suc-1',
    departamentoId: 'dep-1',
    cargo: 'Jefa de Desarrollo Organizacional',
    activo: true,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    dispositivos: [
      { id: 'dev-501', modelo: 'MacBook Air M2 - Web', tipo: 'web', versionApp: 'Portal v2.4.0', ultimoAcceso: '2026-10-31 11:30', tokenActivo: true }
    ]
  },
  {
    id: 'usr-6',
    nombre: 'Mauricio Barraza Tapia',
    rut: '15.612.003-2',
    email: 'mbarraza@terraempresa.com',
    rolKey: 'encargado_depto',
    sucursalId: 'suc-2',
    departamentoId: 'dep-2',
    cargo: 'Jefe de Turno de Operaciones',
    activo: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    dispositivos: [
      { id: 'dev-601', modelo: 'Motorola Edge 40', tipo: 'android', versionApp: 'TerraApp v1.9.4', ultimoAcceso: '2026-10-31 10:11', tokenActivo: true }
    ]
  },
  {
    id: 'usr-7',
    nombre: 'Patricia Carvajal Soto',
    rut: '11.839.221-7',
    email: 'pcarvajal@terraempresa.com',
    rolKey: 'encargado_depto',
    sucursalId: 'suc-1',
    departamentoId: 'dep-3',
    cargo: 'Subgerente de Finanzas y Control',
    activo: true,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    dispositivos: [
      { id: 'dev-701', modelo: 'Lenovo ThinkPad X1', tipo: 'web', versionApp: 'Portal v2.4.0', ultimoAcceso: '2026-10-31 08:45', tokenActivo: true }
    ]
  },
  {
    id: 'usr-8',
    nombre: 'Héctor Paredes Ortiz',
    rut: '13.120.941-6',
    email: 'hparedes@terraempresa.com',
    rolKey: 'encargado_depto',
    sucursalId: 'suc-2',
    departamentoId: 'dep-4',
    cargo: 'Supervisor de Higiene y Servicios',
    activo: true,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    dispositivos: [
      { id: 'dev-801', modelo: 'Samsung A34 5G', tipo: 'android', versionApp: 'TerraApp v1.9.3', ultimoAcceso: '2026-10-31 07:40', tokenActivo: true }
    ]
  },
  {
    id: 'usr-9',
    nombre: 'Andrea Muñoz Lagos',
    rut: '16.902.115-3',
    email: 'amunoz@terraempresa.com',
    rolKey: 'encargado_depto',
    sucursalId: 'suc-1',
    departamentoId: 'dep-5',
    cargo: 'Ingeniera en Prevención de Riesgos',
    activo: true,
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=120&auto=format&fit=crop&q=80',
    dispositivos: [
      { id: 'dev-901', modelo: 'ASUS ZenBook 14', tipo: 'web', versionApp: 'Portal v2.4.0', ultimoAcceso: '2026-10-31 11:15', tokenActivo: true }
    ]
  },
  {
    id: 'usr-10',
    nombre: 'Gonzalo Pavez Rivas',
    rut: '18.449.102-K',
    email: 'gpavez@terraempresa.com',
    rolKey: 'encargado_depto',
    sucursalId: 'suc-3',
    departamentoId: 'dep-6',
    cargo: 'Coordinador de Flota y Envíos',
    activo: true,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    dispositivos: [
      { id: 'dev-1001', modelo: 'Zebra TC57 Terminal Rugerizado', tipo: 'android', versionApp: 'TerraApp v1.9.4', ultimoAcceso: '2026-10-31 11:28', tokenActivo: true }
    ]
  },
  {
    id: 'usr-11',
    nombre: 'Brayan Estay Contreras',
    rut: '19.220.145-8',
    email: 'bestay@terraempresa.com',
    rolKey: 'trabajador',
    sucursalId: 'suc-2',
    departamentoId: 'dep-2',
    cargo: 'Operario Especialista en Maquinaria',
    activo: true,
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    dispositivos: [
      { id: 'dev-1101', modelo: 'Samsung Galaxy A54 5G', tipo: 'android', versionApp: 'TerraApp v1.9.4', ultimoAcceso: '2026-10-31 11:50', tokenActivo: true }
    ]
  },
  {
    id: 'usr-12',
    nombre: 'Francisca Morales Vera',
    rut: '18.991.332-1',
    email: 'fmorales@terraempresa.com',
    rolKey: 'trabajador',
    sucursalId: 'suc-1',
    departamentoId: 'dep-1',
    cargo: 'Asistente de Personal y Bienestar',
    activo: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    dispositivos: [
      { id: 'dev-1201', modelo: 'Dell Optiplex 7090 - Web', tipo: 'web', versionApp: 'Portal v2.4.0', ultimoAcceso: '2026-10-31 11:20', tokenActivo: true }
    ]
  },
  {
    id: 'usr-13',
    nombre: 'Juan Carlos Riquelme',
    rut: '15.112.483-9',
    email: 'jriquelme@terraempresa.com',
    rolKey: 'trabajador',
    sucursalId: 'suc-3',
    departamentoId: 'dep-6',
    cargo: 'Operador de Montacargas',
    activo: true,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    dispositivos: [
      { id: 'dev-1301', modelo: 'Xiaomi Redmi Note 12', tipo: 'android', versionApp: 'TerraApp v1.9.4', ultimoAcceso: '2026-10-31 08:12', tokenActivo: true }
    ]
  },
  {
    id: 'usr-14',
    nombre: 'Soledad Cárdenas Pino',
    rut: '17.882.310-4',
    email: 'scardenas@terraempresa.com',
    rolKey: 'trabajador',
    sucursalId: 'suc-1',
    departamentoId: 'dep-4',
    cargo: 'Auxiliar de Limpieza Técnica',
    activo: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    dispositivos: [
      { id: 'dev-1401', modelo: 'Motorola Moto G53', tipo: 'android', versionApp: 'TerraApp v1.9.3', ultimoAcceso: '2026-10-30 17:05', tokenActivo: true }
    ]
  },
  {
    id: 'usr-15',
    nombre: 'Matías Osorio Leiva',
    rut: '19.450.812-7',
    email: 'mosorio@terraempresa.com',
    rolKey: 'trabajador',
    sucursalId: 'suc-2',
    departamentoId: 'dep-2',
    cargo: 'Técnico Electromecánico de Planta',
    activo: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    dispositivos: [
      { id: 'dev-1501', modelo: 'Samsung Galaxy S22', tipo: 'android', versionApp: 'TerraApp v1.9.4', ultimoAcceso: '2026-10-31 11:10', tokenActivo: true }
    ]
  }
];

export const INITIAL_COMUNICADOS: Comunicado[] = [
  {
    id: 'com-001',
    codigo: 'COM-2026-089',
    titulo: 'ALERTA URGENTE: Protocolo de Seguridad Ocupacional y Cambio Obligatorio de EPP en Planta',
    extracto: 'Debido a la actualización de la normativa ministerial DS-594, todo el personal de Operaciones y Mantenimiento debe retirar su nuevo equipamiento certificado antes de las 18:00 hrs.',
    cuerpoHtml: `<p>Estimado equipo de <strong>Grupo Terra</strong>,</p>
<p>Por disposición de la <strong>Gerencia de Prevención de Riesgos y Seguridad Ocupacional</strong>, se informa a todo el personal de operaciones, mantenimiento y logística que a contar del <strong>lunes 03 de noviembre de 2026</strong> entra en vigencia el protocolo actualizado de control de riesgos críticos.</p>
<h3>1. Puntos Obligatorios de Retiro</h3>
<ul>
  <li><strong>Sucursal Norte:</strong> Bodega Central de Seguridad (Pabellón C). Encargado: Mauricio Barraza.</li>
  <li><strong>Sucursal Sur:</strong> Oficina Técnica de Logística (Andén 2). Encargado: Gonzalo Pavez.</li>
  <li><strong>Sucursal Central:</strong> Subterráneo -1, Sala de Prevención. Encargada: Andrea Muñoz.</li>
</ul>
<h3>2. Equipamiento a renovar</h3>
<p>Cascos dieléctricos clase E con barbiquejo de 3 puntas, calzado ergonómico de seguridad con puntera de composite y protectores auditivos de atenuación certificada.</p>
<div class="p-3 my-2 border-l-4 border-red-600 bg-red-50 text-red-900 text-sm">
  <strong>IMPORTANTE:</strong> La confirmación de este comunicado en la plataforma es de carácter obligatorio e intransferible para mantener la habilitación de acceso a áreas operativas.
</div>`,
    prioridad: 'urgente',
    estado: 'publicado',
    alcanceTipo: 'toda_empresa',
    targetSucursales: ['suc-1', 'suc-2', 'suc-3'],
    targetDepartamentos: ['dep-2', 'dep-4', 'dep-5', 'dep-6'],
    targetUsuarios: [],
    autorId: 'usr-9',
    autorNombre: 'Andrea Muñoz Lagos',
    autorRol: 'Ingeniera en Prevención de Riesgos',
    creadoEn: '2026-10-30 08:30',
    publicadoEn: '2026-10-30 09:00',
    imagenes: [
      {
        id: 'img-1',
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80',
        nombre: 'inspeccion_seguridad_industrial.jpg',
        tamano: '2.4 MB',
        esPrincipal: true,
        orden: 1
      },
      {
        id: 'img-2',
        url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1200&auto=format&fit=crop&q=80',
        nombre: 'equipos_proteccion_personal.jpg',
        tamano: '1.8 MB',
        esPrincipal: false,
        orden: 2
      }
    ],
    pdfs: [
      {
        id: 'pdf-1',
        nombre: 'Protocolo_EPP_DS594_Terra_2026.pdf',
        tamano: '4.6 MB',
        url: '#',
        paginas: 14
      },
      {
        id: 'pdf-2',
        nombre: 'Formulario_Recepcion_Individual.pdf',
        tamano: '840 KB',
        url: '#',
        paginas: 2
      }
    ],
    totalDestinatarios: 149,
    totalVisualizados: 138,
    totalConfirmados: 122,
    confirmaciones: [
      {
        usuarioId: 'usr-11',
        usuarioNombre: 'Brayan Estay Contreras',
        rut: '19.220.145-8',
        sucursalNombre: 'Sucursal Norte (Planta Industrial)',
        departamentoNombre: 'Operaciones y Producción',
        cargo: 'Operario Especialista en Maquinaria',
        estado: 'confirmado',
        visualizadoEn: '2026-10-30 09:14',
        confirmadoEn: '2026-10-30 09:22',
        dispositivoConfirmacion: 'Samsung Galaxy A54 5G'
      },
      {
        usuarioId: 'usr-12',
        usuarioNombre: 'Francisca Morales Vera',
        rut: '18.991.332-1',
        sucursalNombre: 'Sucursal Central (Edificio Corporativo)',
        departamentoNombre: 'Recursos Humanos',
        cargo: 'Asistente de Personal y Bienestar',
        estado: 'confirmado',
        visualizadoEn: '2026-10-30 09:30',
        confirmadoEn: '2026-10-30 09:41',
        dispositivoConfirmacion: 'Dell Optiplex 7090 - Web'
      },
      {
        usuarioId: 'usr-13',
        usuarioNombre: 'Juan Carlos Riquelme',
        rut: '15.112.483-9',
        sucursalNombre: 'Sucursal Sur (Centro de Distribución)',
        departamentoNombre: 'Logística y Despacho',
        cargo: 'Operador de Montacargas',
        estado: 'visualizado',
        visualizadoEn: '2026-10-30 11:05',
        dispositivoConfirmacion: 'Xiaomi Redmi Note 12'
      },
      {
        usuarioId: 'usr-14',
        usuarioNombre: 'Soledad Cárdenas Pino',
        rut: '17.882.310-4',
        sucursalNombre: 'Sucursal Central (Edificio Corporativo)',
        departamentoNombre: 'Limpieza y Servicios Generales',
        cargo: 'Auxiliar de Limpieza Técnica',
        estado: 'pendiente'
      },
      {
        usuarioId: 'usr-15',
        usuarioNombre: 'Matías Osorio Leiva',
        rut: '19.450.812-7',
        sucursalNombre: 'Sucursal Norte (Planta Industrial)',
        departamentoNombre: 'Operaciones y Producción',
        cargo: 'Técnico Electromecánico de Planta',
        estado: 'confirmado',
        visualizadoEn: '2026-10-30 10:02',
        confirmadoEn: '2026-10-30 10:15',
        dispositivoConfirmacion: 'Samsung Galaxy S22'
      }
    ]
  },
  {
    id: 'com-002',
    codigo: 'COM-2026-088',
    titulo: 'Calendario Oficial de Feriados y Turnos Rotativos de Fin de Año 2026',
    extracto: 'Recursos Humanos publica la planificación de descansos compensatorios y guardias de mantenimiento para los meses de noviembre y diciembre.',
    cuerpoHtml: `<p>Estimados colaboradores de <strong>Grupo Terra</strong>,</p>
<p>Se encuentra disponible para revisión de todas las sucursales el cronograma de turnos y solicitudes de feriados legales correspondientes al cierre del ejercicio 2026.</p>
<p>Cada jefe de departamento deberá consolidar las solicitudes de sus respectivos equipos antes del <strong>viernes 14 de noviembre</strong> a través del portal interno.</p>`,
    prioridad: 'importante',
    estado: 'publicado',
    alcanceTipo: 'toda_empresa',
    targetSucursales: ['suc-1', 'suc-2', 'suc-3'],
    targetDepartamentos: [],
    targetUsuarios: [],
    autorId: 'usr-5',
    autorNombre: 'Camila Sepúlveda Farías',
    autorRol: 'Jefa de Desarrollo Organizacional',
    creadoEn: '2026-10-28 14:00',
    publicadoEn: '2026-10-28 15:30',
    imagenes: [
      {
        id: 'img-3',
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
        nombre: 'oficina_corporativa_reunion.jpg',
        tamano: '3.1 MB',
        esPrincipal: true,
        orden: 1
      }
    ],
    pdfs: [
      {
        id: 'pdf-3',
        nombre: 'Calendario_Feriados_Turnos_Terra_2026.pdf',
        tamano: '1.9 MB',
        url: '#',
        paginas: 6
      }
    ],
    totalDestinatarios: 191,
    totalVisualizados: 182,
    totalConfirmados: 168,
    confirmaciones: [
      {
        usuarioId: 'usr-11',
        usuarioNombre: 'Brayan Estay Contreras',
        rut: '19.220.145-8',
        sucursalNombre: 'Sucursal Norte (Planta Industrial)',
        departamentoNombre: 'Operaciones y Producción',
        cargo: 'Operario Especialista en Maquinaria',
        estado: 'confirmado',
        visualizadoEn: '2026-10-28 16:10',
        confirmadoEn: '2026-10-28 16:30',
        dispositivoConfirmacion: 'Samsung Galaxy A54 5G'
      },
      {
        usuarioId: 'usr-12',
        usuarioNombre: 'Francisca Morales Vera',
        rut: '18.991.332-1',
        sucursalNombre: 'Sucursal Central (Edificio Corporativo)',
        departamentoNombre: 'Recursos Humanos',
        cargo: 'Asistente de Personal y Bienestar',
        estado: 'confirmado',
        visualizadoEn: '2026-10-28 15:45',
        confirmadoEn: '2026-10-28 15:55',
        dispositivoConfirmacion: 'Dell Optiplex 7090 - Web'
      }
    ]
  },
  {
    id: 'com-003',
    codigo: 'COM-2026-087',
    titulo: 'Mantenimiento Preventivo de Servidores Centrales y Plataformas Internas',
    extracto: 'Interrupción programada de servicios cloud y servidores locales el sábado 01 de noviembre entre 23:00 y 04:00 hrs.',
    cuerpoHtml: `<p>Se informa que el departamento de TI llevará a cabo una ventana de mantención programada de infraestructura de base de datos y cableado estructurado en el data center corporativo.</p>`,
    prioridad: 'normal',
    estado: 'publicado',
    alcanceTipo: 'toda_empresa',
    targetSucursales: ['suc-1', 'suc-2', 'suc-3'],
    targetDepartamentos: [],
    targetUsuarios: [],
    autorId: 'usr-1',
    autorNombre: 'Ignacio Valenzuela',
    autorRol: 'Director General / CEO',
    creadoEn: '2026-10-25 10:00',
    publicadoEn: '2026-10-25 11:00',
    imagenes: [],
    pdfs: [],
    totalDestinatarios: 191,
    totalVisualizados: 170,
    totalConfirmados: 154,
    confirmaciones: []
  },
  {
    id: 'com-004',
    codigo: 'COM-2026-086',
    titulo: 'Auditoría de Procesos Sanitarios y Certificación ISO 14001 en Sucursal Norte',
    extracto: 'Cronograma de visitas de inspectores externos para validación de manejo de residuos industriales en Planta Quilicura.',
    cuerpoHtml: `<p>A todo el personal de Sucursal Norte: Se confirma la visita del equipo auditor el próximo martes a las 09:00 hrs. Todo el personal debe portar su credencial corporativa visible.</p>`,
    prioridad: 'importante',
    estado: 'publicado',
    alcanceTipo: 'sucursal',
    targetSucursales: ['suc-2'],
    targetDepartamentos: ['dep-2', 'dep-4'],
    targetUsuarios: [],
    autorId: 'usr-3',
    autorNombre: 'Elena Rostova Díaz',
    autorRol: 'Gerente Operaciones Sucursal Norte',
    creadoEn: '2026-10-24 16:20',
    publicadoEn: '2026-10-24 17:00',
    imagenes: [
      {
        id: 'img-4',
        url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80',
        nombre: 'linea_produccion_quilicura.jpg',
        tamano: '2.1 MB',
        esPrincipal: true,
        orden: 1
      }
    ],
    pdfs: [
      {
        id: 'pdf-4',
        nombre: 'Matriz_Requisitos_Auditoria_ISO.pdf',
        tamano: '3.2 MB',
        url: '#',
        paginas: 8
      }
    ],
    totalDestinatarios: 62,
    totalVisualizados: 58,
    totalConfirmados: 54,
    confirmaciones: []
  },
  {
    id: 'com-005',
    codigo: 'COM-2026-085',
    titulo: 'Borrador: Políticas de Compensación por Trabajo en Días Feriados 2027',
    extracto: 'Documento en revisión preliminar por la Gerencia General y el departamento legal antes de su difusión abierta.',
    cuerpoHtml: `<p>Este documento es confidencial y se encuentra en etapa de validación de escala salarial por turno nocturno.</p>`,
    prioridad: 'normal',
    estado: 'borrador',
    alcanceTipo: 'sucursal',
    targetSucursales: ['suc-1'],
    targetDepartamentos: ['dep-1', 'dep-3'],
    targetUsuarios: [],
    autorId: 'usr-5',
    autorNombre: 'Camila Sepúlveda Farías',
    autorRol: 'Jefa de Desarrollo Organizacional',
    creadoEn: '2026-10-31 09:10',
    imagenes: [],
    pdfs: [],
    totalDestinatarios: 42,
    totalVisualizados: 0,
    totalConfirmados: 0,
    confirmaciones: []
  },
  {
    id: 'com-006',
    codigo: 'COM-2026-084',
    titulo: 'Programado: Lanzamiento de la Nueva Tarjeta de Beneficios y Convenios Médicos',
    extracto: 'Convenio con red de clínicas y centros odontológicos a nivel nacional para todos los trabajadores y sus cargas legales.',
    cuerpoHtml: `<p>Nos complace anunciar la alianza estratégica que otorga hasta un 60% de cobertura en salud dental y chequeos preventivos.</p>`,
    prioridad: 'importante',
    estado: 'programado',
    alcanceTipo: 'toda_empresa',
    targetSucursales: ['suc-1', 'suc-2', 'suc-3'],
    targetDepartamentos: [],
    targetUsuarios: [],
    autorId: 'usr-1',
    autorNombre: 'Ignacio Valenzuela',
    autorRol: 'Director General / CEO',
    creadoEn: '2026-10-30 17:00',
    programadoEn: '2026-11-03 08:00',
    imagenes: [
      {
        id: 'img-5',
        url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&auto=format&fit=crop&q=80',
        nombre: 'convenio_salud_terra.jpg',
        tamano: '1.5 MB',
        esPrincipal: true,
        orden: 1
      }
    ],
    pdfs: [
      {
        id: 'pdf-5',
        nombre: 'Guia_Beneficios_Convenios_2027.pdf',
        tamano: '5.1 MB',
        url: '#',
        paginas: 12
      }
    ],
    totalDestinatarios: 191,
    totalVisualizados: 0,
    totalConfirmados: 0,
    confirmaciones: []
  }
];

export const INITIAL_AUDITORIA: EventoAuditoria[] = [
  {
    id: 'aud-001',
    fechaHora: '2026-10-31 11:35:12',
    usuarioId: 'usr-1',
    usuarioNombre: 'Ignacio Valenzuela',
    rolNombre: 'Administrador Principal (CEO)',
    accion: 'Creación de usuario',
    categoria: 'usuarios',
    descripcion: 'Alta de cuenta para Matías Osorio Leiva asignado a Sucursal Norte / Operaciones.',
    ip: '192.168.10.45'
  },
  {
    id: 'aud-002',
    fechaHora: '2026-10-30 09:00:03',
    usuarioId: 'usr-9',
    usuarioNombre: 'Andrea Muñoz Lagos',
    rolNombre: 'Ingeniera en Prevención de Riesgos',
    accion: 'Publicación de comunicado',
    categoria: 'comunicados',
    descripcion: 'Publicación oficial del comunicado urgente COM-2026-089 con alcance a 149 colaboradores.',
    ip: '192.168.10.88'
  },
  {
    id: 'aud-003',
    fechaHora: '2026-10-30 09:01:20',
    usuarioId: 'usr-9',
    usuarioNombre: 'Andrea Muñoz Lagos',
    rolNombre: 'Ingeniera en Prevención de Riesgos',
    accion: 'Envío de recordatorio masivo',
    categoria: 'notificaciones',
    descripcion: 'Disparo masivo de notificación push prioritaria para confirmación de EPP.',
    ip: '192.168.10.88'
  },
  {
    id: 'aud-004',
    fechaHora: '2026-10-28 15:30:00',
    usuarioId: 'usr-5',
    usuarioNombre: 'Camila Sepúlveda Farías',
    rolNombre: 'Jefa de Desarrollo Organizacional',
    accion: 'Publicación de comunicado',
    categoria: 'comunicados',
    descripcion: 'Publicación del comunicado importante COM-2026-088 a toda la empresa.',
    ip: '192.168.10.12'
  },
  {
    id: 'aud-005',
    fechaHora: '2026-10-26 14:10:45',
    usuarioId: 'usr-1',
    usuarioNombre: 'Ignacio Valenzuela',
    rolNombre: 'Administrador Principal (CEO)',
    accion: 'Modificación de rol',
    categoria: 'roles',
    descripcion: 'Actualización de matriz de permisos para rol "Encargado de Departamento" habilitando configuración de recordatorios.',
    ip: '192.168.10.45'
  },
  {
    id: 'aud-006',
    fechaHora: '2026-10-24 17:00:11',
    usuarioId: 'usr-3',
    usuarioNombre: 'Elena Rostova Díaz',
    rolNombre: 'Gerente Operaciones Sucursal Norte',
    accion: 'Publicación de comunicado',
    categoria: 'comunicados',
    descripcion: 'Publicación de comunicado COM-2026-086 dirigido exclusivamente a Sucursal Norte.',
    ip: '192.168.20.14'
  }
];

export const INITIAL_NOTIFICACIONES: NotificacionSistema[] = [
  {
    id: 'notif-1',
    comunicadoId: 'com-001',
    titulo: 'ALERTA URGENTE: Retiro Obligatorio de Nuevos EPP',
    mensaje: 'Se ha publicado un comunicado urgente que requiere su confirmación de lectura en TerraApp.',
    tipo: 'urgente',
    canal: 'Todos',
    fechaEnvio: '2026-10-30 09:01',
    destinatarios: 149,
    entregados: 147,
    fallidos: 2,
    estado: 'Con advertencias',
    incidencia: '2 dispositivos de Sucursal Sur reportan token push inactivo (teléfonos apagados).'
  },
  {
    id: 'notif-2',
    comunicadoId: 'com-002',
    titulo: 'Nuevo Comunicado: Calendario Oficial de Feriados y Turnos',
    mensaje: 'Revise el cronograma de descansos y solicitudes para fin de año 2026.',
    tipo: 'importante',
    canal: 'App Móvil',
    fechaEnvio: '2026-10-28 15:31',
    destinatarios: 191,
    entregados: 191,
    fallidos: 0,
    estado: 'Enviado con éxito'
  },
  {
    id: 'notif-3',
    comunicadoId: 'com-003',
    titulo: 'Aviso Técnico: Mantenimiento de Servidores Centrales',
    mensaje: 'Interrupción de plataforma este sábado entre 23:00 y 04:00 hrs.',
    tipo: 'normal',
    canal: 'Web Push',
    fechaEnvio: '2026-10-25 11:02',
    destinatarios: 191,
    entregados: 189,
    fallidos: 2,
    estado: 'Enviado con éxito'
  },
  {
    id: 'notif-4',
    comunicadoId: 'com-001',
    titulo: 'Recordatorio Automático: 27 colaboradores pendientes de confirmación EPP',
    mensaje: 'Recordatorio enviado a dispositivos móviles de personal de Operaciones sin confirmar lectura.',
    tipo: 'recordatorio',
    canal: 'App Móvil',
    fechaEnvio: '2026-10-31 08:30',
    destinatarios: 27,
    entregados: 27,
    fallidos: 0,
    estado: 'Enviado con éxito'
  }
];

// Helper to calculate total active workers
export const TOTAL_EMPLEADOS_GLOBAL = INITIAL_USUARIOS.length + 176; // Total representativo 191
