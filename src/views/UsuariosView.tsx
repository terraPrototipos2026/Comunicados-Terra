import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Usuario, RoleKey } from '../types';
import {
  Users,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Smartphone,
  Shield,
  Building2,
  FolderTree,
  Mail,
  Save,
  X,
  Search,
  AlertTriangle
} from 'lucide-react';

export const UsuariosView: React.FC = () => {
  const {
    usuarios,
    sucursales,
    departamentos,
    roles,
    addUsuario,
    updateUsuario,
    toggleUsuarioActivo
  } = useApp();

  const [mainTab, setMainTab] = useState<'list' | 'form'>('list');
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState<string>('all');
  const [filterSucursal, setFilterSucursal] = useState<string>('all');

  // Modal devices inspection
  const [userForDevices, setUserForDevices] = useState<Usuario | null>(null);

  // Form State
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('');
  const [rolKey, setRolKey] = useState<RoleKey>('trabajador');
  const [sucursalId, setSucursalId] = useState('suc-1');
  const [departamentoId, setDepartamentoId] = useState('dep-1');

  const startCreate = () => {
    setSelectedUser(null);
    setNombre('');
    setRut('');
    setEmail('');
    setCargo('');
    setRolKey('trabajador');
    setSucursalId(sucursales[0]?.id || 'suc-1');
    setDepartamentoId(departamentos[0]?.id || 'dep-1');
    setMainTab('form');
  };

  const startEdit = (user: Usuario) => {
    setSelectedUser(user);
    setNombre(user.nombre);
    setRut(user.rut);
    setEmail(user.email);
    setCargo(user.cargo);
    setRolKey(user.rolKey);
    setSucursalId(user.sucursalId);
    setDepartamentoId(user.departamentoId);
    setMainTab('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      updateUsuario(selectedUser.id, {
        nombre,
        rut,
        email,
        cargo,
        rolKey,
        sucursalId,
        departamentoId
      });
    } else {
      addUsuario({
        nombre,
        rut,
        email,
        cargo,
        rolKey,
        sucursalId,
        departamentoId
      });
    }
    setMainTab('list');
  };

  const filteredUsuarios = usuarios.filter(u => {
    const matchSearch =
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.cargo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRol = filterRol === 'all' || u.rolKey === filterRol;
    const matchSucursal = filterSucursal === 'all' || u.sucursalId === filterSucursal;

    return matchSearch && matchRol && matchSucursal;
  });

  return (
    <div className="space-y-6">
      {/* Blueprint 1: Tab Navigation */}
      <div className="flex border-b border-[#E4E2E1] mb-2">
        <button
          onClick={() => setMainTab('list')}
          className={`px-4 py-2.5 text-small font-bold border-b-2 transition-all cursor-pointer ${
            mainTab === 'list'
              ? 'border-[#A6192E] text-[#A6192E]'
              : 'border-transparent text-[#64748B] hover:text-[#202124]'
          }`}
        >
          Listado de Usuarios y Cuentas ({usuarios.length})
        </button>
        <button
          onClick={startCreate}
          className={`px-4 py-2.5 text-small font-bold border-b-2 transition-all cursor-pointer ${
            mainTab === 'form'
              ? 'border-[#A6192E] text-[#A6192E]'
              : 'border-transparent text-[#64748B] hover:text-[#202124]'
          }`}
        >
          {selectedUser ? `Editar: ${selectedUser.nombre}` : '+ Registrar Nuevo Usuario'}
        </button>
      </div>

      {/* VIEW 1: LISTADO */}
      {mainTab === 'list' && (
        <div className="space-y-4">
          <div className="bg-white rounded-sm border border-[#E4E2E1] shadow-2xs overflow-hidden">
            {/* Toolbar */}
            <div className="p-3 border-b border-[#E4E2E1] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <Search size={14} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, RUT, correo o cargo..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-sm text-xs border border-[#E4E2E1] bg-[#FCF9F8] text-[#202124] focus:outline-none focus:border-[#A6192E]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase text-[#64748B]">Rol:</span>
                  <select
                    value={filterRol}
                    onChange={(e) => setFilterRol(e.target.value)}
                    className="px-2 py-1 rounded-sm text-xs border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none"
                  >
                    <option value="all">Todos los Roles</option>
                    <option value="admin_ceo">Administrador (CEO)</option>
                    <option value="gerente_sucursal">Gerente Sucursal</option>
                    <option value="encargado_depto">Encargado Depto.</option>
                    <option value="rrhh">Recursos Humanos</option>
                    <option value="trabajador">Trabajador</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase text-[#64748B]">Sucursal:</span>
                  <select
                    value={filterSucursal}
                    onChange={(e) => setFilterSucursal(e.target.value)}
                    className="px-2 py-1 rounded-sm text-xs border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none"
                  >
                    <option value="all">Todas</option>
                    {sucursales.map(s => (
                      <option key={s.id} value={s.id}>{s.nombre.split('(')[0]}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={startCreate}
                  className="px-3 py-1.5 rounded-sm bg-[#A6192E] hover:bg-[#871326] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle size={14} /> Nuevo Usuario
                </button>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E4E2E1] text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    <th className="py-2.5 px-3">USUARIO / IDENTIFICACIÓN</th>
                    <th className="py-2.5 px-3">ROL CORPORATIVO</th>
                    <th className="py-2.5 px-3">SUCURSAL</th>
                    <th className="py-2.5 px-3">DEPARTAMENTO</th>
                    <th className="py-2.5 px-3 text-center">DISPOSITIVOS</th>
                    <th className="py-2.5 px-3">ESTADO</th>
                    <th className="py-2.5 px-3 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E2E1] text-xs font-medium text-[#202124]">
                  {filteredUsuarios.map((usr) => {
                    const suc = sucursales.find(s => s.id === usr.sucursalId);
                    const dep = departamentos.find(d => d.id === usr.departamentoId);
                    const role = roles.find(r => r.key === usr.rolKey);

                    return (
                      <tr key={usr.id} className="hover:bg-[#FCF9F8] transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={usr.avatar}
                              alt={usr.nombre}
                              className="w-8 h-8 rounded-sm object-cover border border-[#E4E2E1]"
                            />
                            <div>
                              <span className="font-bold text-[#202124] block">{usr.nombre}</span>
                              <span className="text-[10px] text-[#64748B] font-mono">{usr.rut} • {usr.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="inline-flex px-1.5 py-0.5 rounded-sm text-tiny font-bold uppercase bg-[#A6192E]/10 text-[#A6192E] border border-[#A6192E]/20">
                            {role?.nombre.split('(')[0] || usr.rolKey}
                          </span>
                          <span className="text-[10px] text-[#64748B] block mt-0.5">{usr.cargo}</span>
                        </td>

                        <td className="py-3 px-3 text-[#64748B]">
                          {suc?.nombre.split('(')[0] || 'Central'}
                        </td>

                        <td className="py-3 px-3 text-[#64748B]">
                          {dep?.nombre || 'General'}
                        </td>

                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => setUserForDevices(usr)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border border-[#E4E2E1] bg-[#FCF9F8] hover:bg-slate-100 text-[11px] font-semibold text-[#202124] cursor-pointer"
                            title="Ver detalle de dispositivos y versiones de TerraApp"
                          >
                            <Smartphone size={12} className="text-[#A6192E]" />
                            <span>{usr.dispositivos.length} disp.</span>
                          </button>
                        </td>

                        <td className="py-3 px-3">
                          {usr.activo ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-tiny font-bold uppercase bg-emerald-100 text-[#16A34A] border border-emerald-200">
                              <CheckCircle2 size={11} /> Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-tiny font-bold uppercase bg-slate-100 text-slate-500 border border-slate-300">
                              <XCircle size={11} /> Inactivo
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => startEdit(usr)}
                              title="Editar Usuario"
                              className="p-1 rounded-sm text-[#64748B] hover:text-[#16A34A] hover:bg-emerald-50 cursor-pointer"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => toggleUsuarioActivo(usr.id)}
                              title={usr.activo ? 'Desactivar cuenta' : 'Activar cuenta'}
                              className="p-1 rounded-sm text-[#64748B] hover:text-[#DC2626] hover:bg-rose-50 cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="block md:hidden p-3 space-y-3">
              {filteredUsuarios.map(usr => (
                <div key={usr.id} className="p-3 rounded-sm border border-[#E4E2E1] bg-white space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-[#202124]">{usr.nombre}</span>
                    <span className="text-tiny font-bold uppercase text-[#16A34A]">{usr.activo ? 'Activo' : 'Inactivo'}</span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">{usr.cargo} • {usr.email}</p>
                  <div className="pt-2 border-t border-[#E4E2E1] flex justify-between items-center">
                    <button
                      onClick={() => setUserForDevices(usr)}
                      className="text-xs text-[#A6192E] font-semibold"
                    >
                      Ver dispositivos ({usr.dispositivos.length})
                    </button>
                    <button
                      onClick={() => startEdit(usr)}
                      className="px-2.5 py-1 rounded-sm border border-[#E4E2E1] text-xs font-semibold"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CENTRED FORM PANEL (Blueprint 3) */}
      {mainTab === 'form' && (
        <div className="w-full lg:w-3/5 mx-auto animate-in fade-in">
          <div className="bg-white border border-[#E4E2E1] rounded-sm shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-[#E4E2E1] bg-[#F8FAFC] flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124] flex items-center gap-2">
                <Users size={16} className="text-[#A6192E]" />
                {selectedUser ? `Editar Usuario: ${selectedUser.nombre}` : 'Registrar Nuevo Trabajador'}
              </h3>
              <button
                type="button"
                onClick={() => setMainTab('list')}
                className="p-1 rounded text-[#64748B] hover:text-[#202124] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1">
                      Nombre Completo <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej: Marcelo Ríos Soto"
                      className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none focus:border-[#A6192E]"
                    />
                  </div>
                  <div>
                    <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1">
                      RUT / DNI <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={rut}
                      onChange={(e) => setRut(e.target.value)}
                      placeholder="18.992.103-5"
                      className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none focus:border-[#A6192E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1">
                      Correo Electrónico Corporativo <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="usuario@terraempresa.com"
                      className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none focus:border-[#A6192E]"
                    />
                  </div>
                  <div>
                    <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1">
                      Cargo Oficial <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value)}
                      placeholder="Ej: Operario de Logística y Grúa"
                      className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none focus:border-[#A6192E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1">
                      Rol de Permisos <span className="text-[#DC2626]">*</span>
                    </label>
                    <select
                      value={rolKey}
                      onChange={(e) => setRolKey(e.target.value as RoleKey)}
                      className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none focus:border-[#A6192E]"
                    >
                      <option value="trabajador">Trabajador / Operario</option>
                      <option value="encargado_depto">Encargado Depto.</option>
                      <option value="gerente_sucursal">Gerente Sucursal</option>
                      <option value="rrhh">Recursos Humanos</option>
                      <option value="admin_ceo">Administrador (CEO)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1">
                      Sucursal Asignada
                    </label>
                    <select
                      value={sucursalId}
                      onChange={(e) => setSucursalId(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none focus:border-[#A6192E]"
                    >
                      {sucursales.map(s => (
                        <option key={s.id} value={s.id}>{s.nombre.split('(')[0]}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1">
                      Departamento
                    </label>
                    <select
                      value={departamentoId}
                      onChange={(e) => setDepartamentoId(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none focus:border-[#A6192E]"
                    >
                      {departamentos.map(d => (
                        <option key={d.id} value={d.id}>{d.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-4 border-t border-[#E4E2E1] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setMainTab('list')}
                  className="px-4 py-1.5 rounded-sm border border-[#E4E2E1] text-xs font-semibold text-[#64748B] hover:bg-[#F6F3F2] cursor-pointer"
                >
                  Cancelar y Volver
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-sm bg-[#A6192E] hover:bg-[#871326] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Save size={14} />
                  <span>Guardar Cuenta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DISPOSITIVOS REGISTRADOS */}
      {userForDevices && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#E4E2E1] rounded-sm shadow-xl w-full max-w-lg p-5 text-[#202124] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E2E1]">
              <div className="flex items-center gap-2">
                <Smartphone size={18} className="text-[#A6192E]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
                  Dispositivos Registrados - {userForDevices.nombre}
                </h3>
              </div>
              <button onClick={() => setUserForDevices(null)} className="p-1 text-[#64748B]">
                <X size={16} />
              </button>
            </div>

            <p className="text-[11px] text-[#64748B]">
              Terminales autorizados con token push activo para recepción de comunicados obligatorios.
            </p>

            <div className="space-y-2">
              {userForDevices.dispositivos.map((dev) => (
                <div key={dev.id} className="p-3 rounded-sm border border-[#E4E2E1] bg-[#FCF9F8] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-[#202124] block">{dev.modelo}</span>
                    <span className="text-[10px] text-[#64748B] font-mono">
                      Tipo: {dev.tipo.toUpperCase()} • {dev.versionApp}
                    </span>
                    <span className="text-[10px] text-[#64748B] block mt-0.5">
                      Último acceso autenticado: <strong>{dev.ultimoAcceso}</strong>
                    </span>
                  </div>
                  <div>
                    {dev.tokenActivo ? (
                      <span className="px-1.5 py-0.5 rounded-sm text-[10px] font-bold bg-emerald-100 text-[#16A34A] border border-emerald-200">
                        Token Push Activo
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-sm text-[10px] font-bold bg-slate-100 text-slate-500">
                        Inactivo
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E4E2E1] flex justify-end">
              <button
                onClick={() => setUserForDevices(null)}
                className="px-4 py-1.5 rounded-sm bg-[#A6192E] text-white text-xs font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
