import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Departamento } from '../types';
import {
  FolderTree,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Building2,
  UserCheck,
  Save,
  X,
  AlertTriangle,
  Search
} from 'lucide-react';

export const DepartamentosView: React.FC = () => {
  const {
    departamentos,
    sucursales,
    usuarios,
    addDepartamento,
    updateDepartamento,
    toggleDepartamentoActivo
  } = useApp();

  const [mainTab, setMainTab] = useState<'list' | 'form'>('list');
  const [selectedDepto, setSelectedDepto] = useState<Departamento | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptoToToggle, setDeptoToToggle] = useState<Departamento | null>(null);

  // Form State
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [encargadoId, setEncargadoId] = useState('');
  const [selectedSucursales, setSelectedSucursales] = useState<string[]>(['suc-1']);
  const [totalTrabajadores, setTotalTrabajadores] = useState(15);

  const startCreate = () => {
    setSelectedDepto(null);
    setNombre('');
    setDescripcion('');
    setEncargadoId(usuarios[5]?.id || '');
    setSelectedSucursales(['suc-1', 'suc-2']);
    setTotalTrabajadores(12);
    setMainTab('form');
  };

  const startEdit = (dep: Departamento) => {
    setSelectedDepto(dep);
    setNombre(dep.nombre);
    setDescripcion(dep.descripcion);
    setEncargadoId(dep.encargadoId);
    setSelectedSucursales(dep.sucursalesIds);
    setTotalTrabajadores(dep.totalTrabajadores);
    setMainTab('form');
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDepto) {
      updateDepartamento(selectedDepto.id, {
        nombre,
        descripcion,
        encargadoId,
        sucursalesIds: selectedSucursales,
        totalTrabajadores
      });
    } else {
      addDepartamento({
        nombre,
        descripcion,
        encargadoId,
        sucursalesIds: selectedSucursales,
        totalTrabajadores
      });
    }
    setMainTab('list');
  };

  const handleConfirmToggle = () => {
    if (deptoToToggle) {
      toggleDepartamentoActivo(deptoToToggle.id);
      setDeptoToToggle(null);
    }
  };

  const filteredDeptos = departamentos.filter(d =>
    d.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
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
          Listado de Departamentos ({departamentos.length})
        </button>
        <button
          onClick={startCreate}
          className={`px-4 py-2.5 text-small font-bold border-b-2 transition-all cursor-pointer ${
            mainTab === 'form'
              ? 'border-[#A6192E] text-[#A6192E]'
              : 'border-transparent text-[#64748B] hover:text-[#202124]'
          }`}
        >
          {selectedDepto ? `Editar: ${selectedDepto.codigo}` : '+ Registrar Nuevo Departamento'}
        </button>
      </div>

      {/* VIEW 1: LIST */}
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
                  placeholder="Buscar por departamento o código..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-sm text-xs border border-[#E4E2E1] bg-[#FCF9F8] text-[#202124] focus:outline-none focus:border-[#A6192E]"
                />
              </div>
              <button
                onClick={startCreate}
                className="px-3 py-1.5 rounded-sm bg-[#A6192E] hover:bg-[#871326] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle size={14} /> Nuevo Departamento
              </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E4E2E1] text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    <th className="py-2.5 px-3">CÓDIGO / DEPARTAMENTO</th>
                    <th className="py-2.5 px-3">DESCRIPCIÓN</th>
                    <th className="py-2.5 px-3">ENCARGADO ASIGNADO</th>
                    <th className="py-2.5 px-3">SUCURSALES VINCULADAS</th>
                    <th className="py-2.5 px-3 text-center">TRABAJADORES</th>
                    <th className="py-2.5 px-3">ESTADO</th>
                    <th className="py-2.5 px-3 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E2E1] text-xs font-medium text-[#202124]">
                  {filteredDeptos.map((dep) => {
                    const encargado = usuarios.find(u => u.id === dep.encargadoId);
                    return (
                      <tr key={dep.id} className="hover:bg-[#FCF9F8] transition-colors">
                        <td className="py-3 px-3">
                          <div>
                            <span className="text-[10px] font-mono text-[#64748B]">{dep.codigo}</span>
                            <span className="font-bold text-[#202124] block">{dep.nombre}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-[#64748B] max-w-xs truncate">
                          {dep.descripcion}
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-bold text-[#202124] block">{encargado?.nombre || 'Sin encargado'}</span>
                          <span className="text-[10px] text-[#64748B]">{encargado?.cargo || 'Cargo no asignado'}</span>
                        </td>

                        <td className="py-3 px-3 text-[#64748B]">
                          <div className="flex flex-wrap gap-1">
                            {dep.sucursalesIds.map(sucId => {
                              const suc = sucursales.find(s => s.id === sucId);
                              return (
                                <span key={sucId} className="px-1.5 py-0.5 bg-[#F6F3F2] border border-[#E4E2E1] rounded-sm text-[10px]">
                                  {suc?.nombre.split('(')[0]}
                                </span>
                              );
                            })}
                          </div>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span className="font-bold text-xs bg-slate-100 px-2 py-0.5 rounded-sm">
                            {dep.totalTrabajadores}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          {dep.activo ? (
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
                              onClick={() => startEdit(dep)}
                              title="Editar Departamento"
                              className="p-1 rounded-sm text-[#64748B] hover:text-[#16A34A] hover:bg-emerald-50 cursor-pointer"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => setDeptoToToggle(dep)}
                              title={dep.activo ? 'Desactivar' : 'Activar'}
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
              {filteredDeptos.map(dep => (
                <div key={dep.id} className="p-3 rounded-sm border border-[#E4E2E1] bg-white space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-[#64748B]">{dep.codigo}</span>
                    <span className="text-tiny font-bold uppercase text-[#16A34A]">{dep.activo ? 'Activo' : 'Inactivo'}</span>
                  </div>
                  <h4 className="font-bold text-xs text-[#202124]">{dep.nombre}</h4>
                  <p className="text-[11px] text-[#64748B]">{dep.descripcion}</p>
                  <div className="pt-2 border-t border-[#E4E2E1] flex justify-end">
                    <button
                      onClick={() => startEdit(dep)}
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

      {/* VIEW 2: FORM PANEL (Blueprint 3) */}
      {mainTab === 'form' && (
        <div className="w-full lg:w-3/5 mx-auto animate-in fade-in">
          <div className="bg-white border border-[#E4E2E1] rounded-sm shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-[#E4E2E1] bg-[#F8FAFC] flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124] flex items-center gap-2">
                <FolderTree size={16} className="text-[#A6192E]" />
                {selectedDepto ? `Editar Departamento: ${selectedDepto.codigo}` : 'Registrar Nuevo Departamento'}
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
                    Nombre del Departamento <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Control de Calidad y Procesos"
                    className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none focus:border-[#A6192E]"
                  />
                </div>

                <div>
                  <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Descripción Operativa
                  </label>
                  <textarea
                    rows={3}
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Objetivo y alcances operacionales del departamento..."
                    className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none focus:border-[#A6192E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1">
                      Encargado del Departamento
                    </label>
                    <select
                      value={encargadoId}
                      onChange={(e) => setEncargadoId(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none focus:border-[#A6192E]"
                    >
                      {usuarios.map(u => (
                        <option key={u.id} value={u.id}>{u.nombre} - {u.cargo}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1">
                      Trabajadores Estimados
                    </label>
                    <input
                      type="number"
                      value={totalTrabajadores}
                      onChange={(e) => setTotalTrabajadores(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none focus:border-[#A6192E]"
                    />
                  </div>
                </div>

                {/* Sucursales vinculadas */}
                <div>
                  <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-2">
                    Sucursales con Presencia de este Departamento
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {sucursales.map(s => {
                      const isChecked = selectedSucursales.includes(s.id);
                      return (
                        <label key={s.id} className="p-2 border border-[#E4E2E1] rounded-sm flex items-center gap-2 cursor-pointer bg-[#FCF9F8]">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSucursales([...selectedSucursales, s.id]);
                              } else {
                                setSelectedSucursales(selectedSucursales.filter(id => id !== s.id));
                              }
                            }}
                            className="accent-[#A6192E]"
                          />
                          <span className="text-xs text-[#202124]">{s.nombre.split('(')[0]}</span>
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
                  <span>Guardar Departamento</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal to Toggle/Deactivate */}
      {deptoToToggle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#E4E2E1] rounded-sm shadow-xl w-full max-w-md p-5 text-[#202124] space-y-4">
            <div className="flex items-center gap-3 text-[#DC2626]">
              <div className="p-2 rounded-sm bg-rose-50 border border-rose-200">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
                  {deptoToToggle.activo ? 'Desactivar Departamento' : 'Reactivar Departamento'}
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#202124]">
              ¿Estás seguro de {deptoToToggle.activo ? 'desactivar' : 'reactivar'} el departamento{' '}
              <strong className="font-bold">{deptoToToggle.nombre}</strong>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E4E2E1]">
              <button
                type="button"
                onClick={() => setDeptoToToggle(null)}
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
