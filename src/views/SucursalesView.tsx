import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sucursal } from '../types';
import {
  Building2,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Users,
  MapPin,
  Phone,
  FolderTree,
  Save,
  X,
  AlertTriangle,
  Search
} from 'lucide-react';

export const SucursalesView: React.FC = () => {
  const {
    sucursales,
    departamentos,
    usuarios,
    addSucursal,
    updateSucursal,
    toggleSucursalActiva
  } = useApp();

  const [mainTab, setMainTab] = useState<'list' | 'form'>('list');
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sucursalToToggle, setSucursalToToggle] = useState<Sucursal | null>(null);

  // Form State
  const [nombre, setNombre] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [gerenteId, setGerenteId] = useState('');
  const [selectedDeptos, setSelectedDeptos] = useState<string[]>([]);
  const [totalTrabajadores, setTotalTrabajadores] = useState(25);

  const startCreate = () => {
    setSelectedSucursal(null);
    setNombre('');
    setCiudad('');
    setDireccion('');
    setTelefono('+56 2 2940 ');
    setGerenteId(usuarios[1]?.id || '');
    setSelectedDeptos(['dep-1', 'dep-2']);
    setTotalTrabajadores(20);
    setMainTab('form');
  };

  const startEdit = (suc: Sucursal) => {
    setSelectedSucursal(suc);
    setNombre(suc.nombre);
    setCiudad(suc.ciudad);
    setDireccion(suc.direccion);
    setTelefono(suc.telefono);
    setGerenteId(suc.gerenteId);
    setSelectedDeptos(suc.departamentosIds);
    setTotalTrabajadores(suc.totalTrabajadores);
    setMainTab('form');
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSucursal) {
      updateSucursal(selectedSucursal.id, {
        nombre,
        ciudad,
        direccion,
        telefono,
        gerenteId,
        departamentosIds: selectedDeptos,
        totalTrabajadores
      });
    } else {
      addSucursal({
        nombre,
        ciudad,
        direccion,
        telefono,
        gerenteId,
        departamentosIds: selectedDeptos,
        totalTrabajadores
      });
    }
    setMainTab('list');
  };

  const handleConfirmToggle = () => {
    if (sucursalToToggle) {
      toggleSucursalActiva(sucursalToToggle.id);
      setSucursalToToggle(null);
    }
  };

  const filteredSucursales = sucursales.filter(s =>
    s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Blueprint 1: Tab Navigation Bar */}
      <div className="flex border-b border-[#E4E2E1] mb-2">
        <button
          onClick={() => setMainTab('list')}
          className={`px-4 py-2.5 text-small font-bold border-b-2 transition-all cursor-pointer ${
            mainTab === 'list'
              ? 'border-[#A6192E] text-[#A6192E]'
              : 'border-transparent text-[#64748B] hover:text-[#202124]'
          }`}
        >
          Listado de Sucursales ({sucursales.length})
        </button>
        <button
          onClick={startCreate}
          className={`px-4 py-2.5 text-small font-bold border-b-2 transition-all cursor-pointer ${
            mainTab === 'form'
              ? 'border-[#A6192E] text-[#A6192E]'
              : 'border-transparent text-[#64748B] hover:text-[#202124]'
          }`}
        >
          {selectedSucursal ? `Editar: ${selectedSucursal.codigo}` : '+ Registrar Nueva Sucursal'}
        </button>
      </div>

      {/* VIEW 1: LISTADO */}
      {mainTab === 'list' && (
        <div className="space-y-4">
          <div className="bg-white rounded-sm border border-[#E4E2E1] shadow-2xs overflow-hidden">
            {/* Toolbar */}
            <div className="p-3 border-b border-[#E4E2E1] flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <Search size={14} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar sucursal por nombre, ciudad o código..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-sm text-xs border border-[#E4E2E1] bg-[#FCF9F8] text-[#202124] focus:outline-none focus:border-[#A6192E]"
                />
              </div>
              <button
                onClick={startCreate}
                className="px-3 py-1.5 rounded-sm bg-[#A6192E] hover:bg-[#871326] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle size={14} /> Nueva Sucursal
              </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E4E2E1] text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    <th className="py-2.5 px-3">CÓDIGO / SUCURSAL</th>
                    <th className="py-2.5 px-3">UBICACIÓN</th>
                    <th className="py-2.5 px-3">GERENTE ASIGNADO</th>
                    <th className="py-2.5 px-3">DEPARTAMENTOS</th>
                    <th className="py-2.5 px-3 text-center">TRABAJADORES</th>
                    <th className="py-2.5 px-3">ESTADO</th>
                    <th className="py-2.5 px-3 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E2E1] text-xs font-medium text-[#202124]">
                  {filteredSucursales.map((suc) => {
                    const gerente = usuarios.find(u => u.id === suc.gerenteId);
                    return (
                      <tr key={suc.id} className="hover:bg-[#FCF9F8] transition-colors">
                        <td className="py-3 px-3">
                          <div>
                            <span className="text-[10px] font-mono text-[#64748B]">{suc.codigo}</span>
                            <span className="font-bold text-[#202124] block">{suc.nombre}</span>
                            <span className="text-[10px] text-[#64748B] flex items-center gap-1 mt-0.5">
                              <Phone size={11} /> {suc.telefono}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-[#64748B]">
                          <div className="flex items-start gap-1">
                            <MapPin size={13} className="shrink-0 text-[#A6192E] mt-0.5" />
                            <div>
                              <span className="font-bold text-[#202124] block">{suc.ciudad}</span>
                              <span className="text-[10px]">{suc.direccion}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-bold text-[#202124] block">{gerente?.nombre || 'Por asignar'}</span>
                          <span className="text-[10px] text-[#64748B]">{gerente?.email}</span>
                        </td>

                        <td className="py-3 px-3 text-[#64748B]">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {suc.departamentosIds.map(depId => {
                              const dep = departamentos.find(d => d.id === depId);
                              return (
                                <span key={depId} className="px-1.5 py-0.5 bg-[#F6F3F2] border border-[#E4E2E1] rounded-sm text-[10px]">
                                  {dep?.nombre.split(' ')[0]}
                                </span>
                              );
                            })}
                          </div>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span className="font-bold text-xs bg-slate-100 px-2 py-0.5 rounded-sm">
                            {suc.totalTrabajadores}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          {suc.activo ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-tiny font-bold uppercase bg-emerald-100 text-[#16A34A] border border-emerald-200">
                              <CheckCircle2 size={11} /> Activa
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-tiny font-bold uppercase bg-slate-100 text-slate-500 border border-slate-300">
                              <XCircle size={11} /> Inactiva
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => startEdit(suc)}
                              title="Editar Sucursal"
                              className="p-1 rounded-sm text-[#64748B] hover:text-[#16A34A] hover:bg-emerald-50 cursor-pointer"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => setSucursalToToggle(suc)}
                              title={suc.activo ? 'Desactivar' : 'Activar'}
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

            {/* Mobile Stacked Card View */}
            <div className="block md:hidden p-3 space-y-3">
              {filteredSucursales.map(suc => (
                <div key={suc.id} className="p-3 rounded-sm border border-[#E4E2E1] bg-white space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-[#64748B]">{suc.codigo}</span>
                    <span className="text-tiny font-bold uppercase text-[#16A34A]">{suc.activo ? 'Activa' : 'Inactiva'}</span>
                  </div>
                  <h4 className="font-bold text-xs text-[#202124]">{suc.nombre}</h4>
                  <p className="text-[11px] text-[#64748B]">{suc.ciudad} • {suc.totalTrabajadores} trabajadores</p>
                  <div className="pt-2 border-t border-[#E4E2E1] flex justify-end gap-2">
                    <button
                      onClick={() => startEdit(suc)}
                      className="px-2.5 py-1 rounded-sm border border-[#E4E2E1] text-xs font-semibold text-[#202124]"
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
                <Building2 size={16} className="text-[#A6192E]" />
                {selectedSucursal ? `Editar Sucursal: ${selectedSucursal.codigo}` : 'Registrar Nueva Sucursal'}
              </h3>
              <button
                type="button"
                onClick={() => setMainTab('list')}
                className="p-1 rounded text-[#64748B] hover:text-[#202124] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-5 sm:p-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Nombre de la Sucursal <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Sucursal Oriente (Centro Logístico)"
                    className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none focus:border-[#A6192E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1">
                      Ciudad / Comuna <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={ciudad}
                      onChange={(e) => setCiudad(e.target.value)}
                      placeholder="Ej: Concepción"
                      className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none focus:border-[#A6192E]"
                    />
                  </div>
                  <div>
                    <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1">
                      Teléfono de Contacto
                    </label>
                    <input
                      type="text"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="+56 2 2940 8400"
                      className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none focus:border-[#A6192E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Dirección Física Completa
                  </label>
                  <input
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Av. Industrial 800, Módulo 5"
                    className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none focus:border-[#A6192E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1">
                      Gerente a Cargo
                    </label>
                    <select
                      value={gerenteId}
                      onChange={(e) => setGerenteId(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none focus:border-[#A6192E]"
                    >
                      {usuarios.filter(u => u.rolKey === 'gerente_sucursal' || u.rolKey === 'admin_ceo').map(u => (
                        <option key={u.id} value={u.id}>{u.nombre} ({u.cargo})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1">
                      Dotación de Trabajadores Estimada
                    </label>
                    <input
                      type="number"
                      value={totalTrabajadores}
                      onChange={(e) => setTotalTrabajadores(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none focus:border-[#A6192E]"
                    />
                  </div>
                </div>

                {/* Associated Departments Checklist */}
                <div>
                  <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-2">
                    Departamentos Habilitados en esta Sucursal
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {departamentos.map(d => {
                      const isChecked = selectedDeptos.includes(d.id);
                      return (
                        <label key={d.id} className="p-2 border border-[#E4E2E1] rounded-sm flex items-center gap-2 cursor-pointer bg-[#FCF9F8]">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDeptos([...selectedDeptos, d.id]);
                              } else {
                                setSelectedDeptos(selectedDeptos.filter(id => id !== d.id));
                              }
                            }}
                            className="accent-[#A6192E]"
                          />
                          <span className="text-xs text-[#202124]">{d.nombre}</span>
                        </label>
                      );
                    })}
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
                  <span>Guardar Sucursal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal to Toggle/Deactivate (Blueprint 4) */}
      {sucursalToToggle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#E4E2E1] rounded-sm shadow-xl w-full max-w-md p-5 text-[#202124] space-y-4">
            <div className="flex items-center gap-3 text-[#DC2626]">
              <div className="p-2 rounded-sm bg-rose-50 border border-rose-200">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
                  {sucursalToToggle.activo ? 'Desactivar Sucursal' : 'Reactivar Sucursal'}
                </h3>
                <p className="text-[11px] text-[#64748B]">
                  Afectará la segmentación de comunicados dirigidos.
                </p>
              </div>
            </div>

            <p className="text-xs text-[#202124]">
              ¿Estás seguro de {sucursalToToggle.activo ? 'desactivar' : 'reactivar'} la sucursal{' '}
              <strong className="font-bold">{sucursalToToggle.nombre}</strong>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E4E2E1]">
              <button
                type="button"
                onClick={() => setSucursalToToggle(null)}
                className="px-3 py-1.5 rounded-sm border border-[#E4E2E1] text-xs font-semibold text-[#64748B] hover:bg-[#F6F3F2]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmToggle}
                className="px-4 py-1.5 rounded-sm bg-[#DC2626] text-white text-xs font-bold hover:bg-rose-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
