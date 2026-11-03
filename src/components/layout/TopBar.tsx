import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleKey } from '../../types';
import {
  Bell,
  Search,
  Building2,
  ShieldCheck,
  LogOut,
  ChevronDown,
  UserCheck,
  AlertTriangle,
  Server,
  X,
  Settings
} from 'lucide-react';

const ROLE_LABELS: Record<RoleKey, { label: string; badge: string; color: string }> = {
  admin_ceo: { label: 'Administrador (CEO)', badge: 'Acceso Total', color: 'bg-red-900 text-white' },
  gerente_sucursal: { label: 'Gerente Sucursal', badge: 'Nivel Sucursal', color: 'bg-[#A6192E] text-white' },
  encargado_depto: { label: 'Encargado Depto.', badge: 'Operativo', color: 'bg-amber-600 text-white' },
  rrhh: { label: 'Recursos Humanos', badge: 'Gestión Personas', color: 'bg-blue-700 text-white' },
  trabajador: { label: 'Trabajador / Operario', badge: 'Solo Lectura', color: 'bg-slate-700 text-white' },
};

export const TopBar: React.FC = () => {
  const {
    currentUser,
    activeRole,
    setActiveRole,
    currentView,
    setCurrentView,
    sucursales,
    filtroSucursalId,
    setFiltroSucursalId,
    notificaciones,
    logout
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentSucursal = sucursales.find(s => s.id === currentUser.sucursalId);
  const urgentCount = notificaciones.filter(n => n.tipo === 'urgente' || n.estado === 'Con advertencias').length;

  const viewTitles: Record<string, string> = {
    dashboard: 'Dashboard Principal',
    comunicados: 'Gestión de Comunicados',
    'crear-comunicado': 'Nuevo Comunicado Institucional',
    'detalle-comunicado': 'Detalle del Comunicado',
    seguimiento: 'Seguimiento y Confirmación de Lectura',
    sucursales: 'Administración de Sucursales',
    departamentos: 'Gestión de Departamentos',
    usuarios: 'Gestión de Usuarios y Dispositivos',
    roles: 'Matriz de Roles y Permisos',
    notificaciones: 'Centro de Notificaciones y Distribución',
    auditoria: 'Bitácora de Auditoría del Sistema',
    configuracion: 'Configuración del Sistema y Accesibilidad',
  };

  return (
    <header className="h-14 border-b border-[#E4E2E1] bg-white sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-xs select-none">
      {/* Left: Breadcrumbs & View Title */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#64748B] font-medium">
          <span className="hover:text-[#A6192E] cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            Grupo Terra
          </span>
          <span>/</span>
          <span className="text-[#202124] font-semibold">
            {viewTitles[currentView] || 'Módulo'}
          </span>
        </div>
        <div className="sm:hidden font-bold text-sm text-[#202124]">
          {viewTitles[currentView] || 'Terra'}
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#64748B]">
            <Search size={14} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar comunicado, ID de trabajador o sucursal..."
            className="w-full pl-8 pr-4 py-1.5 rounded-sm text-xs font-medium border border-[#E4E2E1] bg-[#FCF9F8] text-[#202124] placeholder:text-[#64748B] focus:outline-none focus:border-[#A6192E] focus:ring-1 focus:ring-[#A6192E] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#64748B] hover:text-[#202124]"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* On-premise status badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 bg-[#F6F3F2] border border-[#E4E2E1] rounded-sm text-[11px] font-semibold text-[#64748B]" title="Almacenamiento e infraestructura local corporativa">
          <Server size={12} className="text-[#16A34A]" />
          <span>Servidor Local: Operativo</span>
        </div>

        {/* Global Branch Filter (for Admin / HR) */}
        {(activeRole === 'admin_ceo' || activeRole === 'rrhh') && (
          <div className="hidden md:flex items-center gap-1.5 bg-[#FCF9F8] border border-[#E4E2E1] rounded-sm px-2 py-1 text-xs">
            <Building2 size={13} className="text-[#64748B]" />
            <select
              value={filtroSucursalId}
              onChange={(e) => setFiltroSucursalId(e.target.value)}
              className="bg-transparent text-[#202124] text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">Todas las Sucursales</option>
              {sucursales.map(s => (
                <option key={s.id} value={s.id}>{s.nombre.split('(')[0]}</option>
              ))}
            </select>
          </div>
        )}

        {/* ROLE SIMULATOR SWITCHER (KEY REQUIREMENT) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-[#A6192E]/30 bg-[#A6192E]/5 hover:bg-[#A6192E]/10 text-xs font-semibold text-[#A6192E] transition-colors cursor-pointer"
            title="Simular vista de otro Rol y probar permisos"
          >
            <ShieldCheck size={14} className="text-[#A6192E]" />
            <span className="hidden sm:inline">Simular Rol:</span>
            <span className="font-bold underline">{ROLE_LABELS[activeRole].label.split(' ')[0]}</span>
            <ChevronDown size={12} />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-1 w-64 bg-white border border-[#E4E2E1] rounded-sm shadow-lg py-1.5 z-50 text-xs animate-in fade-in">
              <div className="px-3 py-1.5 border-b border-[#E4E2E1] text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                Probar funcionalidad por rol:
              </div>
              {(Object.keys(ROLE_LABELS) as RoleKey[]).map((rk) => (
                <button
                  key={rk}
                  onClick={() => {
                    setActiveRole(rk);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#F6F3F2] cursor-pointer transition-colors ${
                    activeRole === rk ? 'bg-[#FCF9F8] font-bold text-[#A6192E]' : 'text-[#202124]'
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{ROLE_LABELS[rk].label}</span>
                    <span className="text-[10px] text-[#64748B] font-normal">{ROLE_LABELS[rk].badge}</span>
                  </div>
                  {activeRole === rk && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#A6192E]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Urgent Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-1.5 rounded-sm border border-[#E4E2E1] bg-white hover:bg-[#F6F3F2] text-[#64748B] hover:text-[#202124] relative cursor-pointer"
            title="Centro de alertas urgentes"
          >
            <Bell size={16} />
            {urgentCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 bg-[#DC2626] text-white text-[10px] font-bold rounded-sm flex items-center justify-center animate-pulse">
                {urgentCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-1 w-80 bg-white border border-[#E4E2E1] rounded-sm shadow-xl p-3 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#E4E2E1]">
                <span className="text-xs font-bold text-[#202124] uppercase tracking-wider">Alertas y Distribución</span>
                <button
                  onClick={() => { setCurrentView('notificaciones'); setShowNotifMenu(false); }}
                  className="text-[11px] text-[#A6192E] font-semibold hover:underline"
                >
                  Ver todas
                </button>
              </div>
              <div className="py-2 space-y-2">
                {notificaciones.slice(0, 3).map((n) => (
                  <div key={n.id} className="p-2 rounded-sm bg-[#FCF9F8] border border-[#E4E2E1] text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#202124]">
                      {n.tipo === 'urgente' && <AlertTriangle size={13} className="text-[#DC2626]" />}
                      <span className="truncate">{n.titulo}</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-2">{n.mensaje}</p>
                    <div className="flex items-center justify-between text-[10px] text-[#64748B] mt-1 pt-1 border-t border-[#E4E2E1]">
                      <span>{n.fechaEnvio}</span>
                      <span className="font-semibold text-[#16A34A]">{n.entregados} entregados</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* System Settings Quick Button */}
        <button
          onClick={() => setCurrentView('configuracion')}
          className={`p-1.5 rounded-sm border transition-colors cursor-pointer ${
            currentView === 'configuracion'
              ? 'border-[#A6192E] bg-[#A6192E]/10 text-[#A6192E]'
              : 'border-[#E4E2E1] bg-white hover:bg-[#F6F3F2] text-[#64748B] hover:text-[#202124]'
          }`}
          title="Configuración del Sistema y Accesibilidad (Fuentes, componentes y sonido)"
        >
          <Settings size={16} />
        </button>

        {/* User Profile Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-sm border border-[#E4E2E1] hover:border-[#64748B] bg-white transition-colors cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.nombre}
              className="w-6 h-6 rounded-sm object-cover border border-[#E4E2E1]"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-[#202124] leading-tight truncate max-w-[120px]">
                {currentUser.nombre.split(' ')[0]} {currentUser.nombre.split(' ')[1]?.[0]}.
              </span>
              <span className="text-[10px] text-[#64748B] leading-tight truncate max-w-[120px]">
                {currentUser.cargo.split(' ')[0]}
              </span>
            </div>
            <ChevronDown size={12} className="text-[#64748B]" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-1 w-56 bg-white border border-[#E4E2E1] rounded-sm shadow-lg py-2 z-50 text-xs">
              <div className="px-3 pb-2 border-b border-[#E4E2E1]">
                <p className="font-bold text-[#202124]">{currentUser.nombre}</p>
                <p className="text-[11px] text-[#64748B]">{currentUser.email}</p>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded-sm text-[10px] font-semibold bg-[#A6192E]/10 text-[#A6192E]">
                  {currentUser.cargo}
                </span>
                <p className="text-[10px] text-[#64748B] mt-1">
                  Sucursal: <strong>{currentSucursal?.nombre.split('(')[0] || 'Central'}</strong>
                </p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => { setCurrentView('configuracion'); setShowUserMenu(false); }}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-[#202124] hover:bg-[#F6F3F2] cursor-pointer"
                >
                  <Settings size={13} className="text-[#64748B]" />
                  <span>Configuración y Fuentes</span>
                </button>
                <button
                  onClick={() => { setCurrentView('usuarios'); setShowUserMenu(false); }}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-[#202124] hover:bg-[#F6F3F2] cursor-pointer"
                >
                  <UserCheck size={13} className="text-[#64748B]" />
                  <span>Mis Dispositivos ({currentUser.dispositivos.length})</span>
                </button>
                <button
                  onClick={() => { logout(); setShowUserMenu(false); }}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-[#DC2626] hover:bg-red-50 cursor-pointer"
                >
                  <LogOut size={13} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
