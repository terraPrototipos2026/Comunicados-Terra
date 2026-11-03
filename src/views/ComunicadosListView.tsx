import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Comunicado, EstadoComunicado, PrioridadComunicado } from '../types';
import {
  Search,
  PlusCircle,
  Eye,
  BarChart3,
  Ban,
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  FileText,
  Calendar,
  Building,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';

export const ComunicadosListView: React.FC = () => {
  const {
    comunicados,
    activeRole,
    setCurrentView,
    anularComunicado,
    sucursales
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('all');
  const [filterPrioridad, setFilterPrioridad] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Anulación modal state
  const [comunicadoToAnular, setComunicadoToAnular] = useState<Comunicado | null>(null);

  const canCreate = activeRole !== 'trabajador';

  // Filtered items
  const filteredComunicados = useMemo(() => {
    return comunicados.filter((c) => {
      const matchSearch =
        c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.autorNombre.toLowerCase().includes(searchTerm.toLowerCase());

      const matchEstado = filterEstado === 'all' || c.estado === filterEstado;
      const matchPrioridad = filterPrioridad === 'all' || c.prioridad === filterPrioridad;

      return matchSearch && matchEstado && matchPrioridad;
    });
  }, [comunicados, searchTerm, filterEstado, filterPrioridad]);

  const totalPages = Math.ceil(filteredComunicados.length / pageSize) || 1;
  const paginatedItems = filteredComunicados.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleConfirmAnular = () => {
    if (comunicadoToAnular) {
      anularComunicado(comunicadoToAnular.id);
      setComunicadoToAnular(null);
    }
  };

  const getStatusBadge = (estado: EstadoComunicado) => {
    switch (estado) {
      case 'publicado':
        return <span className="inline-flex px-1.5 py-0.5 rounded-sm text-tiny font-bold uppercase bg-emerald-100 text-[#16A34A] border border-emerald-200">Publicado</span>;
      case 'borrador':
        return <span className="inline-flex px-1.5 py-0.5 rounded-sm text-tiny font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">Borrador</span>;
      case 'programado':
        return <span className="inline-flex px-1.5 py-0.5 rounded-sm text-tiny font-bold uppercase bg-blue-100 text-blue-700 border border-blue-200">Programado</span>;
      case 'anulado':
        return <span className="inline-flex px-1.5 py-0.5 rounded-sm text-tiny font-bold uppercase bg-rose-100 text-rose-700 border border-rose-200">Anulado</span>;
    }
  };

  const getPriorityBadge = (prioridad: PrioridadComunicado) => {
    switch (prioridad) {
      case 'urgente':
        return <span className="inline-flex px-1.5 py-0.5 rounded-sm text-tiny font-bold uppercase bg-red-100 text-[#DC2626] border border-red-200">Urgente</span>;
      case 'importante':
        return <span className="inline-flex px-1.5 py-0.5 rounded-sm text-tiny font-bold uppercase bg-amber-100 text-[#F28C00] border border-amber-200">Importante</span>;
      case 'normal':
        return <span className="inline-flex px-1.5 py-0.5 rounded-sm text-tiny font-bold uppercase bg-slate-100 text-[#64748B] border border-slate-200">Normal</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-[#202124] uppercase tracking-wider">
            Gestión de Comunicados Oficiales
          </h1>
          <p className="text-xs text-[#64748B]">
            Registro, control de distribución institucional y ciclo de vida de publicaciones
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setCurrentView('crear-comunicado')}
            className="px-4 py-2 rounded-sm bg-[#A6192E] hover:bg-[#871326] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle size={15} />
            <span>Nuevo Comunicado</span>
          </button>
        )}
      </div>

      {/* Enterprise Data Table Container (Blueprint 2) */}
      <div className="bg-white rounded-sm border border-[#E4E2E1] shadow-2xs overflow-hidden">
        {/* Toolbar */}
        <div className="p-3 border-b border-[#E4E2E1] bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
              <Search size={14} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Buscar por código, título o autor..."
              className="w-full pl-9 pr-8 py-1.5 rounded-sm text-small font-medium border border-[#E4E2E1] bg-[#FCF9F8] text-[#202124] placeholder:text-[#64748B] focus:outline-none focus:border-[#A6192E] focus:ring-1 focus:ring-[#A6192E]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#64748B] hover:text-[#202124] cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter Selects */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider">Estado:</span>
              <select
                value={filterEstado}
                onChange={(e) => { setFilterEstado(e.target.value); setCurrentPage(1); }}
                className="px-2.5 py-1.5 rounded-sm text-small font-medium border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none focus:border-[#A6192E] cursor-pointer"
              >
                <option value="all">Todos los Estados</option>
                <option value="publicado">Publicado</option>
                <option value="borrador">Borrador</option>
                <option value="programado">Programado</option>
                <option value="anulado">Anulado</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider">Prioridad:</span>
              <select
                value={filterPrioridad}
                onChange={(e) => { setFilterPrioridad(e.target.value); setCurrentPage(1); }}
                className="px-2.5 py-1.5 rounded-sm text-small font-medium border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none focus:border-[#A6192E] cursor-pointer"
              >
                <option value="all">Todas</option>
                <option value="normal">Normal</option>
                <option value="importante">Importante</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E4E2E1] text-xs font-bold uppercase tracking-wider text-[#64748B] select-none">
                <th className="py-2.5 px-3">PORTADA / TÍTULO</th>
                <th className="py-2.5 px-3">PRIORIDAD</th>
                <th className="py-2.5 px-3">ESTADO</th>
                <th className="py-2.5 px-3">AUTOR</th>
                <th className="py-2.5 px-3">ALCANCE</th>
                <th className="py-2.5 px-3">FECHA</th>
                <th className="py-2.5 px-3 text-center">DEST. / CONFIRM.</th>
                <th className="py-2.5 px-3 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E2E1] text-small text-[#202124] font-medium">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[#64748B]">
                    No se encontraron comunicados con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((c) => {
                  const pct = c.totalDestinatarios > 0 ? Math.round((c.totalConfirmados / c.totalDestinatarios) * 100) : 0;
                  const primaryImg = c.imagenes.find(img => img.esPrincipal) || c.imagenes[0];

                  return (
                    <tr key={c.id} className="hover:bg-[#FCF9F8] transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          {primaryImg ? (
                            <img
                              src={primaryImg.url}
                              alt={c.titulo}
                              className="w-10 h-10 rounded-sm object-cover border border-[#E4E2E1] shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-sm bg-[#F6F3F2] border border-[#E4E2E1] flex items-center justify-center shrink-0 text-[#64748B]">
                              <FileText size={16} />
                            </div>
                          )}
                          <div className="flex flex-col max-w-xs truncate">
                            <span className="text-[10px] font-mono text-[#64748B]">{c.codigo}</span>
                            <span
                              onClick={() => setCurrentView('detalle-comunicado', c.id)}
                              className="font-bold text-[#202124] truncate hover:text-[#A6192E] cursor-pointer"
                              title={c.titulo}
                            >
                              {c.titulo}
                            </span>
                            {c.pdfs.length > 0 && (
                              <span className="text-[10px] text-[#64748B] flex items-center gap-1">
                                📎 {c.pdfs.length} PDF adjunto(s)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        {getPriorityBadge(c.prioridad)}
                      </td>

                      <td className="py-2.5 px-3">
                        {getStatusBadge(c.estado)}
                      </td>

                      <td className="py-2.5 px-3 text-[#64748B] text-xs">
                        <div className="truncate max-w-[110px]">{c.autorNombre}</div>
                      </td>

                      <td className="py-2.5 px-3 text-xs text-[#64748B]">
                        <div className="flex items-center gap-1">
                          <Building size={12} className="text-[#64748B]" />
                          <span>
                            {c.alcanceTipo === 'toda_empresa' ? 'Toda la Empresa' : 'Por Sucursal / Depto'}
                          </span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-xs text-[#64748B]">
                        {c.publicadoEn || c.programadoEn || c.creadoEn}
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-xs text-[#202124]">
                            {c.totalConfirmados} / {c.totalDestinatarios}
                          </span>
                          <span className={`text-[10px] font-bold ${pct >= 80 ? 'text-[#16A34A]' : pct >= 50 ? 'text-[#F28C00]' : 'text-[#DC2626]'}`}>
                            {pct}% lectura
                          </span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setCurrentView('detalle-comunicado', c.id)}
                            title="Ver Detalle"
                            className="p-1 rounded-sm text-[#64748B] hover:text-[#A6192E] hover:bg-[#F6F3F2] cursor-pointer transition-colors"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => setCurrentView('seguimiento', c.id)}
                            title="Ver Seguimiento de Lectura"
                            className="p-1 rounded-sm text-[#64748B] hover:text-[#16A34A] hover:bg-emerald-50 cursor-pointer transition-colors"
                          >
                            <BarChart3 size={15} />
                          </button>
                          {canCreate && c.estado !== 'anulado' && (
                            <button
                              onClick={() => setComunicadoToAnular(c)}
                              title="Anular Comunicado"
                              className="p-1 rounded-sm text-[#64748B] hover:text-[#DC2626] hover:bg-rose-50 cursor-pointer transition-colors"
                            >
                              <Ban size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card View */}
        <div className="block md:hidden p-3 space-y-3 bg-[#FCF9F8]">
          {paginatedItems.map((c) => (
            <div
              key={c.id}
              className="p-3.5 rounded-sm border border-[#E4E2E1] bg-white space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#64748B]">{c.codigo}</span>
                <div className="flex gap-1.5">
                  {getPriorityBadge(c.prioridad)}
                  {getStatusBadge(c.estado)}
                </div>
              </div>
              <p className="font-bold text-xs text-[#202124]">{c.titulo}</p>
              <div className="text-[11px] text-[#64748B] flex justify-between">
                <span>Autor: {c.autorNombre}</span>
                <span>{c.totalConfirmados}/{c.totalDestinatarios} leídos</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-[#E4E2E1]">
                <button
                  onClick={() => setCurrentView('detalle-comunicado', c.id)}
                  className="py-1 rounded-sm border border-[#E4E2E1] text-[11px] font-semibold text-[#202124] hover:bg-[#F6F3F2] flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Eye size={13} /> Ver Detalle
                </button>
                <button
                  onClick={() => setCurrentView('seguimiento', c.id)}
                  className="py-1 rounded-sm bg-[#A6192E] text-white text-[11px] font-semibold hover:bg-[#871326] flex items-center justify-center gap-1 cursor-pointer"
                >
                  <BarChart3 size={13} /> Seguimiento
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="px-3 py-2.5 border-t border-[#E4E2E1] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#64748B]">
          <div>
            Mostrando <strong>{paginatedItems.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> - <strong>{Math.min(currentPage * pageSize, filteredComunicados.length)}</strong> de <strong>{filteredComunicados.length}</strong> comunicados
          </div>
          <div className="flex items-center gap-1 self-end sm:self-auto">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-sm border border-[#E4E2E1] bg-white text-[#202124] disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="min-w-[26px] h-6 px-1.5 rounded-sm text-xs font-bold flex items-center justify-center bg-[#A6192E] text-white">
              {currentPage}
            </span>
            <span className="text-xs text-[#64748B] px-1">de {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-sm border border-[#E4E2E1] bg-white text-[#202124] disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal to Anular (Blueprint 4) */}
      {comunicadoToAnular && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#E4E2E1] rounded-sm shadow-xl w-full max-w-md p-5 text-[#202124] space-y-4">
            <div className="flex items-center gap-3 text-[#DC2626]">
              <div className="p-2 rounded-sm bg-rose-50 border border-rose-200">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
                  Anular Comunicado Institucional
                </h3>
                <p className="text-[11px] text-[#64748B]">
                  El comunicado dejará de estar visible para confirmación de los trabajadores.
                </p>
              </div>
            </div>

            <p className="text-xs text-[#202124]">
              ¿Confirmas que deseas anular el comunicado{' '}
              <strong className="font-bold text-[#A6192E]">
                "{comunicadoToAnular.titulo}"
              </strong>{' '}
              ({comunicadoToAnular.codigo})? Esta acción se registrará en la auditoría del sistema.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E4E2E1]">
              <button
                type="button"
                onClick={() => setComunicadoToAnular(null)}
                className="px-3 py-1.5 rounded-sm border border-[#E4E2E1] bg-white text-xs font-semibold text-[#64748B] hover:bg-[#F6F3F2] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmAnular}
                className="px-4 py-1.5 rounded-sm bg-[#DC2626] hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                Sí, Anular Comunicado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
