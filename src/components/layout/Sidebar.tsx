import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Building2,
  FolderTree,
  Users,
  ShieldCheck,
  BellRing,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Lock,
  Megaphone
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  rolesAllowed: string[];
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, activeRole, comunicados } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  // Urgent pending count
  const pendingUrgents = comunicados.filter(c => c.prioridad === 'urgente' && c.estado === 'publicado').length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      rolesAllowed: ['admin_ceo', 'gerente_sucursal', 'encargado_depto', 'rrhh', 'trabajador'],
    },
    {
      id: 'comunicados',
      label: activeRole === 'trabajador' ? 'Mis Comunicados' : 'Comunicados',
      icon: FileText,
      rolesAllowed: ['admin_ceo', 'gerente_sucursal', 'encargado_depto', 'rrhh', 'trabajador'],
      badge: pendingUrgents > 0 ? `${pendingUrgents} urgentes` : undefined,
      badgeColor: 'bg-[#DC2626] text-white',
    },
    {
      id: 'seguimiento',
      label: activeRole === 'trabajador' ? 'Mi Confirmación' : 'Seguimiento de Lectura',
      icon: BarChart3,
      rolesAllowed: ['admin_ceo', 'gerente_sucursal', 'encargado_depto', 'rrhh', 'trabajador'],
    },
    {
      id: 'sucursales',
      label: 'Sucursales',
      icon: Building2,
      rolesAllowed: ['admin_ceo', 'gerente_sucursal'],
    },
    {
      id: 'departamentos',
      label: 'Departamentos',
      icon: FolderTree,
      rolesAllowed: ['admin_ceo', 'gerente_sucursal', 'encargado_depto', 'rrhh'],
    },
    {
      id: 'usuarios',
      label: 'Usuarios y Cuentas',
      icon: Users,
      rolesAllowed: ['admin_ceo', 'gerente_sucursal', 'rrhh'],
    },
    {
      id: 'roles',
      label: 'Roles y Permisos',
      icon: ShieldCheck,
      rolesAllowed: ['admin_ceo'],
    },
    {
      id: 'notificaciones',
      label: 'Centro Notificaciones',
      icon: BellRing,
      rolesAllowed: ['admin_ceo', 'gerente_sucursal', 'encargado_depto', 'rrhh', 'trabajador'],
    },
    {
      id: 'auditoria',
      label: 'Auditoría y Bitácora',
      icon: History,
      rolesAllowed: ['admin_ceo', 'rrhh'],
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: Settings,
      rolesAllowed: ['admin_ceo', 'gerente_sucursal', 'encargado_depto', 'rrhh', 'trabajador'],
    },
  ];

  return (
    <aside
      className={`bg-[#0F172A] text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-all duration-200 select-none z-20 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-14 border-b border-slate-800 flex items-center justify-between px-3.5 bg-[#0F172A]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-sm bg-[#A6192E] flex items-center justify-center shrink-0 shadow-sm text-white font-black text-sm">
              <Megaphone size={18} />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-sm tracking-tight text-white leading-tight">
                  TERRA<span className="text-[#A6192E] ml-1">COMMS</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                  COMUNICADOS SAAS
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer hidden md:block"
            title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
          {!collapsed && (
            <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Navegación Corporativa
            </div>
          )}

          {navItems.map((item) => {
            const hasAccess = item.rolesAllowed.includes(activeRole);
            const isActive = currentView === item.id;
            const Icon = item.icon;

            if (!hasAccess && activeRole === 'trabajador') {
              // Hide completely for cleaner operario experience
              return null;
            }

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (hasAccess) {
                    setCurrentView(item.id);
                  }
                }}
                disabled={!hasAccess}
                title={!hasAccess ? 'Acceso restringido según su rol actual' : item.label}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-sm text-xs font-semibold transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#A6192E] text-white shadow-sm'
                    : hasAccess
                    ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    : 'text-slate-600 cursor-not-allowed opacity-50'
                }`}
              >
                <Icon size={16} className={`shrink-0 ${isActive ? 'text-white' : hasAccess ? 'text-slate-400' : 'text-slate-600'}`} />
                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between truncate">
                    <span className="truncate">{item.label}</span>
                    {hasAccess ? (
                      item.badge && (
                        <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-bold ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )
                    ) : (
                      <Lock size={12} className="text-slate-600" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Info */}
      <div className="p-3 border-t border-slate-800 bg-[#0B1120] text-[11px] text-slate-400">
        {!collapsed ? (
          <div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
              <span>EMPRESA MATRIZ</span>
              <span className="font-mono text-emerald-400">ON-PREMISE</span>
            </div>
            <p className="font-bold text-white truncate">Grupo Terra S.A.</p>
            <p className="text-[10px] text-slate-400 truncate">Sede Central + 3 Sucursales</p>
          </div>
        ) : (
          <div className="text-center font-bold text-slate-500">
            GT
          </div>
        )}
      </div>
    </aside>
  );
};
