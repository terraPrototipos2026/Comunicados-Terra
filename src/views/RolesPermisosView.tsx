import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role, PermissionCategory } from '../types';
import {
  ShieldCheck,
  PlusCircle,
  Save,
  CheckCircle2,
  Lock,
  Layers,
  HelpCircle,
  X
} from 'lucide-react';

interface PermisoDef {
  code: string;
  label: string;
  categoria: PermissionCategory;
  desc: string;
}

const PERMISOS_SISTEMA: PermisoDef[] = [
  // Usuarios
  { code: 'crear', label: 'Crear Usuarios', categoria: 'usuarios', desc: 'Permite registrar nuevas cuentas de colaboradores' },
  { code: 'editar', label: 'Editar Usuarios', categoria: 'usuarios', desc: 'Permite modificar cargos, sucursales y perfiles' },
  { code: 'eliminar', label: 'Desactivar Usuarios', categoria: 'usuarios', desc: 'Permite suspender cuentas de acceso' },
  { code: 'ver_dispositivos', label: 'Ver Dispositivos', categoria: 'usuarios', desc: 'Auditar terminales registrados y versiones de la app' },

  // Sucursales
  { code: 'crear', label: 'Crear Sucursales', categoria: 'sucursales', desc: 'Habilitar nuevas sedes o plantas operativas' },
  { code: 'editar', label: 'Editar Sucursales', categoria: 'sucursales', desc: 'Modificar direcciones, gerentes y teléfonos' },
  { code: 'desactivar', label: 'Desactivar Sucursales', categoria: 'sucursales', desc: 'Pausar operaciones y comunicaciones para la sede' },

  // Departamentos
  { code: 'crear', label: 'Crear Departamentos', categoria: 'departamentos', desc: 'Crear nuevas áreas funcionales' },
  { code: 'editar', label: 'Editar Departamentos', categoria: 'departamentos', desc: 'Modificar encargados y sucursales asignadas' },

  // Comunicados
  { code: 'crear_global', label: 'Comunicados Globales', categoria: 'comunicados', desc: 'Emitir circulares oficiales a toda la empresa' },
  { code: 'crear_sucursal', label: 'Comunicados por Sucursal', categoria: 'comunicados', desc: 'Emitir avisos específicos a sucursales autorizadas' },
  { code: 'crear_depto', label: 'Comunicados por Departamento', categoria: 'comunicados', desc: 'Emitir avisos internos de su área de trabajo' },
  { code: 'anular', label: 'Anular Comunicados', categoria: 'comunicados', desc: 'Retirar comunicados vigentes del sistema' },

  // Notificaciones
  { code: 'enviar_urgente', label: 'Disparo de Alertas Urgentes', categoria: 'notificaciones', desc: 'Enviar push prioritario de alto impacto' },
  { code: 'configurar_recordatorios', label: 'Recordatorios Masivos', categoria: 'notificaciones', desc: 'Notificar a trabajadores con lecturas pendientes' },

  // Estadísticas
  { code: 'ver_globales', label: 'Estadísticas Globales', categoria: 'estadisticas', desc: 'Acceso a métricas corporativas y gráficos de cumplimiento' },
  { code: 'ver_sucursal', label: 'Estadísticas de Sucursal', categoria: 'estadisticas', desc: 'Métricas limitadas a su propia sede' },
  { code: 'exportar_reportes', label: 'Exportación de Datos', categoria: 'estadisticas', desc: 'Descarga de planillas CSV de auditoría' },

  // Auditoría
  { code: 'consultar_bitacora', label: 'Consultar Bitácora', categoria: 'auditoria', desc: 'Acceso inmutable al registro de eventos del sistema' }
];

export const RolesPermisosView: React.FC = () => {
  const { roles, updateRolPermisos, addRol } = useApp();
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || 'rol-1');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  const currentRole = roles.find(r => r.id === selectedRoleId) || roles[0];

  const handleTogglePermiso = (cat: PermissionCategory, code: string) => {
    if (currentRole.esSistema && currentRole.key === 'admin_ceo') {
      alert('El rol de Administrador Principal posee permisos absolutos inmutables para garantizar la gobernanza del sistema.');
      return;
    }

    const currentCatPerms = currentRole.permisos[cat] || [];
    let updatedCatPerms: string[];
    if (currentCatPerms.includes(code)) {
      updatedCatPerms = currentCatPerms.filter(c => c !== code);
    } else {
      updatedCatPerms = [...currentCatPerms, code];
    }

    const updatedAllPerms = {
      ...currentRole.permisos,
      [cat]: updatedCatPerms
    };

    updateRolPermisos(currentRole.id, updatedAllPerms);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCreateNewRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const newRole: Role = {
      id: `rol-${Date.now()}`,
      key: 'encargado_depto', // Dynamic roles default
      nombre: newRoleName,
      descripcion: newRoleDesc || 'Rol personalizado con permisos específicos definidos por administración.',
      esSistema: false,
      permisos: {
        usuarios: [],
        sucursales: [],
        departamentos: [],
        comunicados: ['crear_depto'],
        notificaciones: ['configurar_recordatorios'],
        estadisticas: ['ver_sucursal'],
        auditoria: []
      }
    };

    addRol(newRole);
    setSelectedRoleId(newRole.id);
    setShowCreateModal(false);
    setNewRoleName('');
    setNewRoleDesc('');
  };

  const categorias: { key: PermissionCategory; label: string }[] = [
    { key: 'usuarios', label: '1. Gestión de Usuarios' },
    { key: 'sucursales', label: '2. Sucursales Corporativas' },
    { key: 'departamentos', label: '3. Departamentos' },
    { key: 'comunicados', label: '4. Comunicados Oficiales' },
    { key: 'notificaciones', label: '5. Centro de Notificaciones' },
    { key: 'estadisticas', label: '6. Métricas y Estadísticas' },
    { key: 'auditoria', label: '7. Auditoría y Bitácora' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-[#202124] uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#A6192E]" />
            Matriz Dinámica de Roles y Permisos
          </h1>
          <p className="text-xs text-[#64748B]">
            Control de privilegios por categoría para la emisión y administración de comunicados
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-1.5 rounded-sm bg-[#A6192E] hover:bg-[#871326] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle size={14} />
          <span>Crear Rol Dinámico</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={15} />
          <span>Matriz de permisos actualizada y sincronizada en tiempo real con las sesiones activas.</span>
        </div>
      )}

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {roles.map((r) => {
          const isSelected = r.id === selectedRoleId;
          return (
            <button
              key={r.id}
              onClick={() => setSelectedRoleId(r.id)}
              className={`p-3 rounded-sm border text-left cursor-pointer transition-all ${
                isSelected
                  ? 'border-[#A6192E] bg-white ring-1 ring-[#A6192E] shadow-2xs'
                  : 'border-[#E4E2E1] bg-[#FCF9F8] hover:bg-white text-[#64748B]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold ${isSelected ? 'text-[#A6192E]' : 'text-[#202124]'}`}>
                  {r.nombre.split('(')[0]}
                </span>
                {r.esSistema && (
                  <span title="Rol de Sistema">
                    <Lock size={11} className="text-[#64748B]" />
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#64748B] line-clamp-1">{r.descripcion}</span>
            </button>
          );
        })}
      </div>

      {/* Role Details Panel & Matrix */}
      <div className="bg-white border border-[#E4E2E1] rounded-sm p-5 space-y-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E4E2E1]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#202124]">{currentRole.nombre}</h2>
              {currentRole.esSistema && (
                <span className="px-1.5 py-0.5 rounded-sm bg-slate-100 border border-slate-200 text-[10px] font-bold text-[#64748B]">
                  SISTEMA
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">{currentRole.descripcion}</p>
          </div>

          <div className="text-[11px] text-[#64748B]">
            Marque las casillas para conceder o revocar permisos específicos a este rol.
          </div>
        </div>

        {/* Categories Grouped Matrix */}
        <div className="space-y-6">
          {categorias.map((cat) => {
            const catPermisos = PERMISOS_SISTEMA.filter(p => p.categoria === cat.key);
            const activePermsForRole = currentRole.permisos[cat.key] || [];

            return (
              <div key={cat.key} className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124] bg-[#F8FAFC] px-3 py-1.5 border border-[#E4E2E1] rounded-sm">
                  {cat.label}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pl-1">
                  {catPermisos.map((perm) => {
                    const hasPerm = activePermsForRole.includes(perm.code);
                    const isImmutableAdmin = currentRole.esSistema && currentRole.key === 'admin_ceo';

                    return (
                      <label
                        key={perm.code}
                        className={`p-2.5 rounded-sm border flex items-start gap-2.5 cursor-pointer transition-colors ${
                          hasPerm
                            ? 'border-[#A6192E]/40 bg-[#A6192E]/5'
                            : 'border-[#E4E2E1] bg-white hover:bg-[#FCF9F8]'
                        } ${isImmutableAdmin ? 'cursor-not-allowed opacity-90' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={hasPerm}
                          disabled={isImmutableAdmin}
                          onChange={() => handleTogglePermiso(cat.key, perm.code)}
                          className="mt-0.5 accent-[#A6192E]"
                        />
                        <div className="flex-1">
                          <span className={`text-xs font-bold block ${hasPerm ? 'text-[#A6192E]' : 'text-[#202124]'}`}>
                            {perm.label}
                          </span>
                          <span className="text-[10px] text-[#64748B] leading-tight block mt-0.5">
                            {perm.desc}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE ROLE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#E4E2E1] rounded-sm shadow-xl w-full max-w-md p-5 text-[#202124] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E2E1]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
                Crear Nuevo Rol Dinámico
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-[#64748B]">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateNewRole} className="space-y-3">
              <div>
                <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Nombre del Rol <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="Ej: Supervisor de Turno de Noche"
                  className="w-full px-2.5 py-1.5 rounded-sm text-xs border border-[#E4E2E1] focus:outline-none focus:border-[#A6192E]"
                />
              </div>

              <div>
                <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Descripción del Alcance
                </label>
                <textarea
                  rows={3}
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Especifique responsabilidades y motivo de creación de este rol..."
                  className="w-full px-2.5 py-1.5 rounded-sm text-xs border border-[#E4E2E1] focus:outline-none focus:border-[#A6192E]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E4E2E1]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-sm border border-[#E4E2E1] text-xs font-semibold text-[#64748B] hover:bg-[#F6F3F2]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-sm bg-[#A6192E] text-white text-xs font-bold hover:bg-[#871326]"
                >
                  Crear Rol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
