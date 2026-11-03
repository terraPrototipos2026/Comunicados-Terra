import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  RoleKey,
  Role,
  Sucursal,
  Departamento,
  Usuario,
  Comunicado,
  EventoAuditoria,
  NotificacionSistema,
  PermissionCategory,
  ConfiguracionSistema,
} from '../types';
import {
  INITIAL_ROLES,
  INITIAL_SUCURSALES,
  INITIAL_DEPARTAMENTOS,
  INITIAL_USUARIOS,
  INITIAL_COMUNICADOS,
  INITIAL_AUDITORIA,
  INITIAL_NOTIFICACIONES,
} from '../data/mockData';

interface AppContextType {
  isLoggedIn: boolean;
  currentUser: Usuario;
  activeRole: RoleKey;
  currentView: string;
  selectedComunicadoId: string | null;
  filtroSucursalId: string | 'all';
  roles: Role[];
  sucursales: Sucursal[];
  departamentos: Departamento[];
  usuarios: Usuario[];
  comunicados: Comunicado[];
  auditoria: EventoAuditoria[];
  notificaciones: NotificacionSistema[];
  
  // Navigation & Role Simulation
  setCurrentView: (view: string, comunicadoId?: string) => void;
  setActiveRole: (role: RoleKey) => void;
  setFiltroSucursalId: (id: string | 'all') => void;
  login: (email: string) => void;
  logout: () => void;
  
  // Actions
  addComunicado: (nuevo: Partial<Comunicado>) => Comunicado;
  updateComunicado: (id: string, cambios: Partial<Comunicado>) => void;
  anularComunicado: (id: string) => void;
  confirmarLecturaTrabajador: (comunicadoId: string) => void;
  
  addSucursal: (suc: Partial<Sucursal>) => void;
  updateSucursal: (id: string, suc: Partial<Sucursal>) => void;
  toggleSucursalActiva: (id: string) => void;
  
  addDepartamento: (dep: Partial<Departamento>) => void;
  updateDepartamento: (id: string, dep: Partial<Departamento>) => void;
  toggleDepartamentoActivo: (id: string) => void;
  
  addUsuario: (usr: Partial<Usuario>) => void;
  updateUsuario: (id: string, usr: Partial<Usuario>) => void;
  toggleUsuarioActivo: (id: string) => void;
  
  updateRolPermisos: (rolId: string, permisos: Role['permisos']) => void;
  addRol: (rol: Role) => void;
  enviarRecordatorioLectura: (comunicadoId: string) => void;

  // System Configuration & Accessibility
  configuracion: ConfiguracionSistema;
  updateConfiguracion: (cambios: Partial<ConfiguracionSistema>) => void;
  restablecerConfiguracion: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeRole, setActiveRoleState] = useState<RoleKey>('admin_ceo');
  const [currentView, setCurrentViewState] = useState<string>('dashboard');
  const [selectedComunicadoId, setSelectedComunicadoId] = useState<string | null>('com-001');
  const [filtroSucursalId, setFiltroSucursalId] = useState<string | 'all'>('all');

  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [sucursales, setSucursales] = useState<Sucursal[]>(INITIAL_SUCURSALES);
  const [departamentos, setDepartamentos] = useState<Departamento[]>(INITIAL_DEPARTAMENTOS);
  const [usuarios, setUsuarios] = useState<Usuario[]>(INITIAL_USUARIOS);
  const [comunicados, setComunicados] = useState<Comunicado[]>(INITIAL_COMUNICADOS);
  const [auditoria, setAuditoria] = useState<EventoAuditoria[]>(INITIAL_AUDITORIA);
  const [notificaciones, setNotificaciones] = useState<NotificacionSistema[]>(INITIAL_NOTIFICACIONES);

  const DEFAULT_CONFIG: ConfiguracionSistema = {
    escalaFuente: 'normal',
    porcentajeFuente: 100,
    pesoFuenteAumentado: false,
    familiaTipografica: 'inter',
    densidadUI: 'normal',
    tamanoBotones: 'normal',
    tamanoIconos: 'normal',
    bordesAcentuados: false,
    modoVisual: 'corporativo',
    reducirAnimaciones: false,
    resaltarElementosInteractivos: false,
    cursorAumentado: false,
    lectorPantallaOptimizado: false,
    sonidoAlertasUrgentes: true,
    volumenSonido: 80,
    intervaloActualizacionSegundos: 30,
    notificacionesFlotantes: true,
    servidorLocalPush: true,
    direccionIpServidor: '192.168.10.45',
  };

  const [configuracion, setConfiguracion] = useState<ConfiguracionSistema>(() => {
    try {
      const guardada = localStorage.getItem('terra_comms_config');
      if (guardada) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(guardada) };
      }
    } catch {
      // Ignorar fallback
    }
    return DEFAULT_CONFIG;
  });

  useEffect(() => {
    try {
      localStorage.setItem('terra_comms_config', JSON.stringify(configuracion));
    } catch {
      // Ignorar fallback
    }

    const root = document.documentElement;
    root.classList.remove(
      'font-scale-pequena', 'font-scale-normal', 'font-scale-mediana', 'font-scale-grande', 'font-scale-extragrande',
      'font-inter', 'font-atkinson', 'font-roboto', 'font-mono',
      'font-weight-boost',
      'density-compacta', 'density-normal', 'density-comoda', 'density-tactil',
      'icons-normal', 'icons-grande', 'icons-extragrande',
      'borders-accentuated',
      'highlight-interactive',
      'reduce-motion',
      'theme-corporativo', 'theme-alto_contraste', 'theme-oscuro_suave'
    );

    root.classList.add(`font-scale-${configuracion.escalaFuente}`);
    root.classList.add(`font-${configuracion.familiaTipografica}`);
    root.classList.add(`density-${configuracion.densidadUI}`);
    root.classList.add(`theme-${configuracion.modoVisual}`);

    if (configuracion.pesoFuenteAumentado) root.classList.add('font-weight-boost');
    if (configuracion.tamanoIconos === 'mediano') root.classList.add('icons-mediano');
    if (configuracion.tamanoIconos === 'grande') root.classList.add('icons-grande');
    if (configuracion.bordesAcentuados) root.classList.add('borders-accentuated');
    if (configuracion.resaltarElementosInteractivos) root.classList.add('highlight-interactive');
    if (configuracion.reducirAnimaciones) root.classList.add('reduce-motion');
  }, [configuracion]);

  const updateConfiguracion = (cambios: Partial<ConfiguracionSistema>) => {
    setConfiguracion(prev => ({ ...prev, ...cambios }));
    addAuditoriaEntry(
      'Actualización de usuario',
      'roles',
      'Ajuste de preferencias del sistema y configuración de accesibilidad visual.'
    );
  };

  const restablecerConfiguracion = () => {
    setConfiguracion(DEFAULT_CONFIG);
  };

  // Pick realistic user according to active role
  const currentUser = React.useMemo(() => {
    switch (activeRole) {
      case 'admin_ceo':
        return usuarios.find(u => u.rolKey === 'admin_ceo') || usuarios[0];
      case 'gerente_sucursal':
        return usuarios.find(u => u.rolKey === 'gerente_sucursal') || usuarios[1];
      case 'encargado_depto':
        return usuarios.find(u => u.rolKey === 'encargado_depto') || usuarios[5];
      case 'rrhh':
        return usuarios.find(u => u.rolKey === 'rrhh') || usuarios[4];
      case 'trabajador':
        return usuarios.find(u => u.rolKey === 'trabajador') || usuarios[10];
      default:
        return usuarios[0];
    }
  }, [activeRole, usuarios]);

  const setActiveRole = (role: RoleKey) => {
    setActiveRoleState(role);
    // If worker switches, make sure worker sees their dashboard or communications
    if (role === 'trabajador' && (currentView === 'roles' || currentView === 'auditoria' || currentView === 'crear-comunicado')) {
      setCurrentViewState('comunicados');
    }
  };

  const setCurrentView = (view: string, comunicadoId?: string) => {
    if (comunicadoId) {
      setSelectedComunicadoId(comunicadoId);
    }
    setCurrentViewState(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = (email: string) => {
    const found = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setActiveRoleState(found.rolKey);
    }
    setIsLoggedIn(true);
    setCurrentViewState('dashboard');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentViewState('login');
  };

  const addAuditoriaEntry = (
    accion: EventoAuditoria['accion'],
    categoria: EventoAuditoria['categoria'],
    descripcion: string
  ) => {
    const nuevoEvento: EventoAuditoria = {
      id: `aud-${Date.now()}`,
      fechaHora: new Date().toISOString().replace('T', ' ').slice(0, 19),
      usuarioId: currentUser.id,
      usuarioNombre: currentUser.nombre,
      rolNombre: currentUser.cargo,
      accion,
      categoria,
      descripcion,
      ip: '192.168.10.45'
    };
    setAuditoria(prev => [nuevoEvento, ...prev]);
  };

  const addComunicado = (nuevo: Partial<Comunicado>): Comunicado => {
    const nextCode = `COM-2026-${String(comunicados.length + 90).padStart(3, '0')}`;
    const fullComunicado: Comunicado = {
      id: `com-${Date.now()}`,
      codigo: nextCode,
      titulo: nuevo.titulo || 'Sin título',
      extracto: nuevo.extracto || '',
      cuerpoHtml: nuevo.cuerpoHtml || '',
      prioridad: nuevo.prioridad || 'normal',
      estado: nuevo.estado || 'publicado',
      alcanceTipo: nuevo.alcanceTipo || 'toda_empresa',
      targetSucursales: nuevo.targetSucursales || [],
      targetDepartamentos: nuevo.targetDepartamentos || [],
      targetUsuarios: nuevo.targetUsuarios || [],
      autorId: currentUser.id,
      autorNombre: currentUser.nombre,
      autorRol: currentUser.cargo,
      creadoEn: new Date().toISOString().replace('T', ' ').slice(0, 16),
      publicadoEn: nuevo.estado === 'publicado' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : undefined,
      programadoEn: nuevo.programadoEn,
      imagenes: nuevo.imagenes || [],
      pdfs: nuevo.pdfs || [],
      totalDestinatarios: nuevo.totalDestinatarios || 191,
      totalVisualizados: 0,
      totalConfirmados: 0,
      confirmaciones: usuarios.map(u => ({
        usuarioId: u.id,
        usuarioNombre: u.nombre,
        rut: u.rut,
        sucursalNombre: sucursales.find(s => s.id === u.sucursalId)?.nombre || 'Central',
        departamentoNombre: departamentos.find(d => d.id === u.departamentoId)?.nombre || 'General',
        cargo: u.cargo,
        estado: 'pendiente'
      }))
    };

    setComunicados(prev => [fullComunicado, ...prev]);

    // System Notification entry
    if (fullComunicado.estado === 'publicado') {
      const notif: NotificacionSistema = {
        id: `notif-${Date.now()}`,
        comunicadoId: fullComunicado.id,
        titulo: `${fullComunicado.prioridad === 'urgente' ? 'ALERTA URGENTE: ' : 'Nuevo Comunicado: '}${fullComunicado.titulo}`,
        mensaje: fullComunicado.extracto || 'Se ha publicado un nuevo comunicado oficial en el sistema.',
        tipo: fullComunicado.prioridad,
        canal: 'Todos',
        fechaEnvio: new Date().toISOString().replace('T', ' ').slice(0, 16),
        destinatarios: fullComunicado.totalDestinatarios,
        entregados: fullComunicado.totalDestinatarios,
        fallidos: 0,
        estado: 'Enviado con éxito'
      };
      setNotificaciones(prev => [notif, ...prev]);
    }

    addAuditoriaEntry(
      fullComunicado.estado === 'publicado' ? 'Publicación de comunicado' : 'Creación de comunicado',
      'comunicados',
      `${fullComunicado.estado === 'publicado' ? 'Publicación oficial' : 'Creación de borrador'} del comunicado ${fullComunicado.codigo}: "${fullComunicado.titulo}".`
    );

    return fullComunicado;
  };

  const updateComunicado = (id: string, cambios: Partial<Comunicado>) => {
    setComunicados(prev => prev.map(c => c.id === id ? { ...c, ...cambios } : c));
  };

  const anularComunicado = (id: string) => {
    setComunicados(prev => prev.map(c => {
      if (c.id === id) {
        addAuditoriaEntry('Anulación de comunicado', 'comunicados', `Anulación del comunicado ${c.codigo} por decisión administrativa.`);
        return { ...c, estado: 'anulado' };
      }
      return c;
    }));
  };

  const confirmarLecturaTrabajador = (comunicadoId: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setComunicados(prev => prev.map(c => {
      if (c.id === comunicadoId) {
        const exist = c.confirmaciones.find(conf => conf.usuarioId === currentUser.id);
        let updatedConfs = [...c.confirmaciones];
        if (exist) {
          updatedConfs = updatedConfs.map(conf => 
            conf.usuarioId === currentUser.id 
              ? { ...conf, estado: 'confirmado', confirmadoEn: timestamp, visualizadoEn: conf.visualizadoEn || timestamp, dispositivoConfirmacion: currentUser.dispositivos[0]?.modelo || 'Móvil Corporativo' }
              : conf
          );
        } else {
          updatedConfs.push({
            usuarioId: currentUser.id,
            usuarioNombre: currentUser.nombre,
            rut: currentUser.rut,
            sucursalNombre: sucursales.find(s => s.id === currentUser.sucursalId)?.nombre || 'Central',
            departamentoNombre: departamentos.find(d => d.id === currentUser.departamentoId)?.nombre || 'General',
            cargo: currentUser.cargo,
            estado: 'confirmado',
            visualizadoEn: timestamp,
            confirmadoEn: timestamp,
            dispositivoConfirmacion: currentUser.dispositivos[0]?.modelo || 'Móvil Corporativo'
          });
        }
        return {
          ...c,
          confirmaciones: updatedConfs,
          totalConfirmados: updatedConfs.filter(x => x.estado === 'confirmado').length,
          totalVisualizados: updatedConfs.filter(x => x.estado === 'confirmado' || x.estado === 'visualizado').length
        };
      }
      return c;
    }));
  };

  const enviarRecordatorioLectura = (comunicadoId: string) => {
    const com = comunicados.find(c => c.id === comunicadoId);
    if (!com) return;
    const pendientes = com.totalDestinatarios - com.totalConfirmados;
    const notif: NotificacionSistema = {
      id: `notif-${Date.now()}`,
      comunicadoId: com.id,
      titulo: `Recordatorio de Lectura: ${com.titulo}`,
      mensaje: `Aviso masivo enviado a ${pendientes} trabajadores que aún no registran confirmación de lectura.`,
      tipo: 'recordatorio',
      canal: 'App Móvil',
      fechaEnvio: new Date().toISOString().replace('T', ' ').slice(0, 16),
      destinatarios: pendientes,
      entregados: pendientes,
      fallidos: 0,
      estado: 'Enviado con éxito'
    };
    setNotificaciones(prev => [notif, ...prev]);
    addAuditoriaEntry(
      'Envío de recordatorio masivo',
      'notificaciones',
      `Recordatorio prioritario despachado a ${pendientes} colaboradores pendientes para el comunicado ${com.codigo}.`
    );
  };

  const addSucursal = (suc: Partial<Sucursal>) => {
    const newSuc: Sucursal = {
      id: `suc-${Date.now()}`,
      codigo: `SUC-0${sucursales.length + 1}`,
      nombre: suc.nombre || 'Nueva Sucursal',
      ciudad: suc.ciudad || '',
      direccion: suc.direccion || '',
      telefono: suc.telefono || '',
      gerenteId: suc.gerenteId || usuarios[1].id,
      departamentosIds: suc.departamentosIds || ['dep-1', 'dep-2'],
      activo: true,
      totalTrabajadores: suc.totalTrabajadores || 12
    };
    setSucursales(prev => [...prev, newSuc]);
    addAuditoriaEntry('Creación de usuario', 'sucursales', `Alta de nueva sucursal "${newSuc.nombre}" (${newSuc.codigo}).`);
  };

  const updateSucursal = (id: string, suc: Partial<Sucursal>) => {
    setSucursales(prev => prev.map(s => s.id === id ? { ...s, ...suc } : s));
  };

  const toggleSucursalActiva = (id: string) => {
    setSucursales(prev => prev.map(s => {
      if (s.id === id) {
        const nuevoEstado = !s.activo;
        if (!nuevoEstado) {
          addAuditoriaEntry('Desactivación de sucursal', 'sucursales', `Desactivación operativa de la sucursal "${s.nombre}".`);
        }
        return { ...s, activo: nuevoEstado };
      }
      return s;
    }));
  };

  const addDepartamento = (dep: Partial<Departamento>) => {
    const newDep: Departamento = {
      id: `dep-${Date.now()}`,
      codigo: `DEP-${(dep.nombre || 'DEP').slice(0, 3).toUpperCase()}`,
      nombre: dep.nombre || 'Nuevo Departamento',
      encargadoId: dep.encargadoId || usuarios[5].id,
      sucursalesIds: dep.sucursalesIds || ['suc-1'],
      activo: true,
      descripcion: dep.descripcion || '',
      totalTrabajadores: dep.totalTrabajadores || 8
    };
    setDepartamentos(prev => [...prev, newDep]);
    addAuditoriaEntry('Creación de usuario', 'sucursales', `Creación de departamento "${newDep.nombre}".`);
  };

  const updateDepartamento = (id: string, dep: Partial<Departamento>) => {
    setDepartamentos(prev => prev.map(d => d.id === id ? { ...d, ...dep } : d));
  };

  const toggleDepartamentoActivo = (id: string) => {
    setDepartamentos(prev => prev.map(d => d.id === id ? { ...d, activo: !d.activo } : d));
  };

  const addUsuario = (usr: Partial<Usuario>) => {
    const newUser: Usuario = {
      id: `usr-${Date.now()}`,
      nombre: usr.nombre || 'Nuevo Usuario',
      rut: usr.rut || '11.222.333-4',
      email: usr.email || 'nuevo@terraempresa.com',
      rolKey: usr.rolKey || 'trabajador',
      sucursalId: usr.sucursalId || 'suc-1',
      departamentoId: usr.departamentoId || 'dep-1',
      cargo: usr.cargo || 'Operario',
      activo: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      dispositivos: [
        {
          id: `dev-${Date.now()}`,
          modelo: 'Dispositivo Corporativo Asignado',
          tipo: 'android',
          versionApp: 'TerraApp v1.9.4',
          ultimoAcceso: 'Reciente',
          tokenActivo: true
        }
      ]
    };
    setUsuarios(prev => [newUser, ...prev]);
    addAuditoriaEntry('Creación de usuario', 'usuarios', `Registro de cuenta para ${newUser.nombre} (${newUser.cargo}).`);
  };

  const updateUsuario = (id: string, usr: Partial<Usuario>) => {
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ...usr } : u));
    addAuditoriaEntry('Actualización de usuario', 'usuarios', `Modificación de ficha de usuario ID: ${id}.`);
  };

  const toggleUsuarioActivo = (id: string) => {
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, activo: !u.activo } : u));
  };

  const updateRolPermisos = (rolId: string, permisos: Role['permisos']) => {
    setRoles(prev => prev.map(r => r.id === rolId ? { ...r, permisos } : r));
    addAuditoriaEntry('Asignación de permisos', 'roles', `Actualización de matriz de permisos para rol ID: ${rolId}.`);
  };

  const addRol = (rol: Role) => {
    setRoles(prev => [...prev, rol]);
    addAuditoriaEntry('Modificación de rol', 'roles', `Creación de nuevo rol dinámico "${rol.nombre}".`);
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        currentUser,
        activeRole,
        currentView,
        selectedComunicadoId,
        filtroSucursalId,
        roles,
        sucursales,
        departamentos,
        usuarios,
        comunicados,
        auditoria,
        notificaciones,
        setCurrentView,
        setActiveRole,
        setFiltroSucursalId,
        login,
        logout,
        addComunicado,
        updateComunicado,
        anularComunicado,
        confirmarLecturaTrabajador,
        addSucursal,
        updateSucursal,
        toggleSucursalActiva,
        addDepartamento,
        updateDepartamento,
        toggleDepartamentoActivo,
        addUsuario,
        updateUsuario,
        toggleUsuarioActivo,
        updateRolPermisos,
        addRol,
        enviarRecordatorioLectura,
        configuracion,
        updateConfiguracion,
        restablecerConfiguracion,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
