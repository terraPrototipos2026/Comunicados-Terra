import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EstadoLectura } from '../types';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Eye,
  AlertCircle,
  Search,
  Filter,
  Download,
  Send,
  Building2,
  FolderTree,
  Smartphone,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  FileText,
  AlertTriangle,
  AlertOctagon,
  Users
} from 'lucide-react';

export const SeguimientoLecturaView: React.FC = () => {
  const {
    comunicados,
    selectedComunicadoId,
    setCurrentView,
    sucursales,
    departamentos,
    enviarRecordatorioLectura
  } = useApp();

  const [viewMode, setViewMode] = useState<'individual' | 'consolidado'>('individual');
  const [activeComId, setActiveComId] = useState<string>(selectedComunicadoId || comunicados[0]?.id || 'com-001');
  const [filterEstado, setFilterEstado] = useState<string>('all');
  const [filterSucursal, setFilterSucursal] = useState<string>('all');
  const [filterDepartamento, setFilterDepartamento] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [exportNotice, setExportNotice] = useState(false);
  const [reminderNotice, setReminderNotice] = useState(false);

  const selectedComunicado = comunicados.find(c => c.id === activeComId) || comunicados[0];

  const totalDestinatarios = selectedComunicado.totalDestinatarios;
  const totalConfirmados = selectedComunicado.totalConfirmados;
  const totalVisualizados = selectedComunicado.totalVisualizados;
  const totalPendientes = Math.max(0, totalDestinatarios - totalConfirmados);
  const pctConfirmacion = totalDestinatarios > 0 ? Math.round((totalConfirmados / totalDestinatarios) * 100) : 0;
  const pctVisualizacion = totalDestinatarios > 0 ? Math.round((totalVisualizados / totalDestinatarios) * 100) : 0;

  // Filtered workers list for individual view
  const filteredConfirmaciones = useMemo(() => {
    return selectedComunicado.confirmaciones.filter(c => {
      const matchSearch =
        c.usuarioNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cargo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchEstado = filterEstado === 'all' || c.estado === filterEstado;
      const matchSucursal = filterSucursal === 'all' || c.sucursalNombre.toLowerCase().includes(filterSucursal.toLowerCase());
      const matchDepto = filterDepartamento === 'all' || c.departamentoNombre.toLowerCase().includes(filterDepartamento.toLowerCase());

      return matchSearch && matchEstado && matchSucursal && matchDepto;
    });
  }, [selectedComunicado, searchTerm, filterEstado, filterSucursal, filterDepartamento]);

  const handleExportCsv = () => {
    const headers = ['Nombre', 'RUT', 'Cargo', 'Sucursal', 'Departamento', 'Estado Lectura', 'Fecha Visualizacion', 'Fecha Confirmacion', 'Dispositivo'];
    const rows = filteredConfirmaciones.map(c => [
      `"${c.usuarioNombre}"`,
      `"${c.rut}"`,
      `"${c.cargo}"`,
      `"${c.sucursalNombre}"`,
      `"${c.departamentoNombre}"`,
      `"${c.estado.toUpperCase()}"`,
      `"${c.visualizadoEn || 'No registrado'}"`,
      `"${c.confirmadoEn || 'Sin confirmar'}"`,
      `"${c.dispositivoConfirmacion || 'N/A'}"`
    ]);
    const csvString = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte_seguimiento_${selectedComunicado.codigo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3500);
  };

  const handleExportConsolidadoCsv = () => {
    const headers = ['Codigo', 'Titulo', 'Prioridad', 'Estado', 'Fecha Publicacion', 'Destinatarios', 'Visualizados', 'Confirmados', 'Pendientes', 'Tasa Confirmacion'];
    const rows = comunicados.filter(c => c.estado === 'publicado').map(c => [
      `"${c.codigo}"`,
      `"${c.titulo.replace(/"/g, '""')}"`,
      `"${c.prioridad.toUpperCase()}"`,
      `"${c.estado.toUpperCase()}"`,
      `"${c.publicadoEn || c.creadoEn}"`,
      c.totalDestinatarios,
      c.totalVisualizados,
      c.totalConfirmados,
      c.totalDestinatarios - c.totalConfirmados,
      `"${Math.round((c.totalConfirmados / (c.totalDestinatarios || 1)) * 100)}%"`
    ]);
    const csvString = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `resumen_consolidado_comunicados.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3500);
  };

  const handleSendReminder = () => {
    enviarRecordatorioLectura(selectedComunicado.id);
    setReminderNotice(true);
    setTimeout(() => setReminderNotice(false), 3500);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-[#202124] uppercase tracking-wider flex items-center gap-2">
            <BarChart3 size={18} className="text-[#A6192E]" />
            Seguimiento Analítico de Confirmación de Lectura
          </h1>
          <p className="text-xs text-[#64748B]">
            Verificación de cumplimiento, trazabilidad legal y métricas segmentadas por comunicado
          </p>
        </div>

        {/* View Switcher Tabs: Individual vs Consolidado */}
        <div className="flex items-center p-0.5 bg-slate-200/80 rounded-sm text-xs font-semibold self-start lg:self-auto">
          <button
            onClick={() => setViewMode('individual')}
            className={`px-3 py-1.5 rounded-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'individual'
                ? 'bg-white text-[#A6192E] shadow-xs font-bold'
                : 'text-slate-700 hover:text-black'
            }`}
          >
            <Filter size={13} />
            <span>Filtro por Comunicado</span>
          </button>
          <button
            onClick={() => setViewMode('consolidado')}
            className={`px-3 py-1.5 rounded-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'consolidado'
                ? 'bg-white text-[#A6192E] shadow-xs font-bold'
                : 'text-slate-700 hover:text-black'
            }`}
          >
            <Layers size={13} />
            <span>Matriz de Todos los Comunicados</span>
          </button>
        </div>
      </div>

      {/* Critical Legal Distinction Alert */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-sm text-xs text-blue-900 flex items-center gap-2">
        <Info size={16} className="text-blue-700 shrink-0" />
        <span>
          <strong>Diferenciación Operativa:</strong> El <em>Envío de Notificación</em> confirma el despacho al smartphone o navegador. La <em>Lectura Confirmada</em> requiere la acción explícita y autenticada del trabajador con registro de timestamp.
        </span>
      </div>

      {/* ========================================================= */}
      {/* MODE 1: FILTRO POR COMUNICADO INDIVIDUAL */}
      {/* ========================================================= */}
      {viewMode === 'individual' && (
        <div className="space-y-4 animate-in fade-in">
          {/* PROMINENT COMUNICADO SELECTOR & SUMMARY CARD */}
          <div className="bg-white border border-[#E4E2E1] rounded-sm p-4 shadow-2xs space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#E4E2E1]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#202124] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#A6192E]" />
                  Seleccionar Comunicado a Analizar:
                </span>
              </div>

              {/* Enhanced Select with code and priority indicator */}
              <div className="flex-1 max-w-xl">
                <select
                  value={activeComId}
                  onChange={(e) => setActiveComId(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm text-xs font-bold border border-[#A6192E]/40 bg-[#FCF9F8] text-[#202124] focus:outline-none focus:border-[#A6192E] focus:ring-1 focus:ring-[#A6192E] cursor-pointer shadow-xs"
                >
                  {comunicados.filter(c => c.estado === 'publicado').map(c => {
                    const pct = c.totalDestinatarios > 0 ? Math.round((c.totalConfirmados / c.totalDestinatarios) * 100) : 0;
                    return (
                      <option key={c.id} value={c.id}>
                        [{c.codigo}] • {c.prioridad.toUpperCase()} • {c.titulo.slice(0, 55)}... ({pct}% confirmado)
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Active Comunicado Detail Summary Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-[#FCF9F8] p-3 rounded-sm border border-[#E4E2E1]">
              <div className="space-y-1 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] font-bold bg-white px-2 py-0.5 rounded-sm border border-[#E4E2E1] text-[#64748B]">
                    {selectedComunicado.codigo}
                  </span>
                  <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase ${
                    selectedComunicado.prioridad === 'urgente' 
                      ? 'bg-red-100 text-[#DC2626] border border-red-200' 
                      : selectedComunicado.prioridad === 'importante'
                      ? 'bg-amber-100 text-[#F28C00] border border-amber-200'
                      : 'bg-slate-100 text-[#64748B] border border-slate-200'
                  }`}>
                    {selectedComunicado.prioridad}
                  </span>
                  <span className="text-[11px] text-[#64748B] flex items-center gap-1">
                    <Calendar size={12} /> {selectedComunicado.publicadoEn || selectedComunicado.creadoEn}
                  </span>
                  <span className="text-[11px] text-[#64748B]">
                    • Autor: <strong className="text-[#202124]">{selectedComunicado.autorNombre}</strong> ({selectedComunicado.autorRol})
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#202124] leading-snug">
                  {selectedComunicado.titulo}
                </h3>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#64748B] block">Cumplimiento</span>
                  <span className="text-lg font-black text-[#16A34A]">{pctConfirmacion}%</span>
                </div>
                <button
                  onClick={() => setCurrentView('detalle-comunicado', selectedComunicado.id)}
                  className="px-3 py-1.5 rounded-sm border border-[#E4E2E1] bg-white hover:bg-[#F6F3F2] text-xs font-semibold text-[#A6192E] flex items-center gap-1 cursor-pointer"
                >
                  <Eye size={13} />
                  <span>Ver Contenido</span>
                </button>
              </div>
            </div>
          </div>

          {/* Metrics Banner */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-white border border-[#E4E2E1] p-3.5 rounded-sm shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                Total Destinatarios
              </span>
              <span className="text-2xl font-black text-[#202124] block mt-1">{totalDestinatarios}</span>
              <span className="text-[10px] text-[#64748B]">Colaboradores alcanzados</span>
            </div>

            <div className="bg-white border border-[#E4E2E1] p-3.5 rounded-sm shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                Visualizados
              </span>
              <span className="text-2xl font-black text-blue-700 block mt-1">{totalVisualizados}</span>
              <span className="text-[10px] text-blue-600 font-semibold">{pctVisualizacion}% apertura</span>
            </div>

            <div className="bg-white border border-[#E4E2E1] p-3.5 rounded-sm shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                Lectura Confirmada
              </span>
              <span className="text-2xl font-black text-[#16A34A] block mt-1">{totalConfirmados}</span>
              <span className="text-[10px] text-emerald-600 font-semibold">{pctConfirmacion}% confirmación oficial</span>
            </div>

            <div className="bg-white border border-[#E4E2E1] p-3.5 rounded-sm shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                Pendientes
              </span>
              <span className="text-2xl font-black text-[#DC2626] block mt-1">{totalPendientes}</span>
              <span className="text-[10px] text-rose-600 font-semibold">Sin confirmación</span>
            </div>

            <div className="col-span-2 lg:col-span-1 bg-white border border-[#E4E2E1] p-3.5 rounded-sm shadow-2xs flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                Acción Masiva
              </span>
              <button
                onClick={handleSendReminder}
                disabled={totalPendientes === 0}
                className="w-full py-1.5 px-2 rounded-sm bg-[#A6192E] hover:bg-[#871326] text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Send size={12} />
                <span>Recordar a {totalPendientes}</span>
              </button>
            </div>
          </div>

          {/* Feedback Alerts */}
          {exportNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={15} />
              <span>Archivo CSV descargado con éxito: "reporte_seguimiento_{selectedComunicado.codigo}.csv".</span>
            </div>
          )}

          {reminderNotice && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-sm text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={15} />
              <span>Recordatorio push prioritario enviado a los dispositivos de los {totalPendientes} colaboradores pendientes.</span>
            </div>
          )}

          {/* Detailed Table Container */}
          <div className="bg-white border border-[#E4E2E1] rounded-sm shadow-2xs overflow-hidden">
            {/* Toolbar with Search + Estado + Sucursal + Departamento + Export CSV */}
            <div className="p-3 border-b border-[#E4E2E1] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <Search size={14} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar trabajador por nombre, RUT o cargo..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-sm text-xs border border-[#E4E2E1] bg-[#FCF9F8] text-[#202124] focus:outline-none focus:border-[#A6192E]"
                />
              </div>

              {/* Filters & Export */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold uppercase text-[#64748B]">Estado:</span>
                  <select
                    value={filterEstado}
                    onChange={(e) => setFilterEstado(e.target.value)}
                    className="px-2 py-1 rounded-sm text-xs border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none"
                  >
                    <option value="all">Todos</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="visualizado">Solo Visualizado</option>
                    <option value="pendiente">Pendiente</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold uppercase text-[#64748B]">Sucursal:</span>
                  <select
                    value={filterSucursal}
                    onChange={(e) => setFilterSucursal(e.target.value)}
                    className="px-2 py-1 rounded-sm text-xs border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none"
                  >
                    <option value="all">Todas</option>
                    <option value="Central">Central</option>
                    <option value="Norte">Norte</option>
                    <option value="Sur">Sur</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold uppercase text-[#64748B]">Depto:</span>
                  <select
                    value={filterDepartamento}
                    onChange={(e) => setFilterDepartamento(e.target.value)}
                    className="px-2 py-1 rounded-sm text-xs border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none max-w-[130px]"
                  >
                    <option value="all">Todos</option>
                    {departamentos.map(d => (
                      <option key={d.id} value={d.nombre}>{d.nombre.split(' ')[0]}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleExportCsv}
                  className="px-3 py-1 rounded-sm border border-[#E4E2E1] bg-white hover:bg-[#FCF9F8] text-xs font-semibold text-[#202124] flex items-center gap-1 cursor-pointer"
                >
                  <Download size={13} className="text-[#A6192E]" />
                  <span>Exportar CSV</span>
                </button>
              </div>
            </div>

            {/* High-density Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E4E2E1] text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    <th className="py-2.5 px-3">COLABORADOR / RUT</th>
                    <th className="py-2.5 px-3">SUCURSAL</th>
                    <th className="py-2.5 px-3">DEPARTAMENTO</th>
                    <th className="py-2.5 px-3">ESTADO DE LECTURA</th>
                    <th className="py-2.5 px-3">VISUALIZADO</th>
                    <th className="py-2.5 px-3">CONFIRMACIÓN OFICIAL</th>
                    <th className="py-2.5 px-3">DISPOSITIVO REGISTRADO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E2E1] text-xs font-medium text-[#202124]">
                  {filteredConfirmaciones.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-xs text-[#64748B]">
                        No hay registros con los filtros seleccionados para este comunicado.
                      </td>
                    </tr>
                  ) : (
                    filteredConfirmaciones.map((conf) => (
                      <tr key={conf.usuarioId} className="hover:bg-[#FCF9F8] transition-colors">
                        <td className="py-2.5 px-3">
                          <div>
                            <span className="font-bold text-[#202124] block">{conf.usuarioNombre}</span>
                            <span className="text-[10px] font-mono text-[#64748B]">{conf.rut} • {conf.cargo}</span>
                          </div>
                        </td>

                        <td className="py-2.5 px-3 text-[#64748B]">
                          {conf.sucursalNombre.split('(')[0]}
                        </td>

                        <td className="py-2.5 px-3 text-[#64748B]">
                          {conf.departamentoNombre}
                        </td>

                        <td className="py-2.5 px-3">
                          {conf.estado === 'confirmado' ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-tiny font-bold uppercase bg-emerald-100 text-[#16A34A] border border-emerald-200">
                              <CheckCircle2 size={11} /> Confirmado
                            </span>
                          ) : conf.estado === 'visualizado' ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-tiny font-bold uppercase bg-blue-100 text-blue-700 border border-blue-200">
                              <Eye size={11} /> Visualizado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-tiny font-bold uppercase bg-rose-100 text-[#DC2626] border border-rose-200">
                              <Clock size={11} /> Pendiente
                            </span>
                          )}
                        </td>

                        <td className="py-2.5 px-3 text-[#64748B] font-mono text-[11px]">
                          {conf.visualizadoEn || '—'}
                        </td>

                        <td className="py-2.5 px-3 text-[#64748B] font-mono text-[11px]">
                          {conf.confirmadoEn ? (
                            <span className="font-bold text-emerald-700">{conf.confirmadoEn}</span>
                          ) : (
                            <span className="text-slate-400">Sin confirmar</span>
                          )}
                        </td>

                        <td className="py-2.5 px-3 text-[#64748B] text-[11px]">
                          {conf.dispositivoConfirmacion ? (
                            <div className="flex items-center gap-1">
                              <Smartphone size={12} className="text-[#64748B]" />
                              <span className="truncate max-w-[150px]">{conf.dispositivoConfirmacion}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 2: MATRIZ CONSOLIDADA DE TODOS LOS COMUNICADOS */}
      {/* ========================================================= */}
      {viewMode === 'consolidado' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white border border-[#E4E2E1] rounded-sm p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
                Matriz Comparativa de Cumplimiento por Comunicado
              </h2>
              <p className="text-[11px] text-[#64748B]">
                Haga clic en "Ver Trabajadores" en cualquier fila para filtrar y auditar las firmas individualmente.
              </p>
            </div>
            <button
              onClick={handleExportConsolidadoCsv}
              className="px-3.5 py-1.5 rounded-sm border border-[#E4E2E1] bg-white hover:bg-[#FCF9F8] text-xs font-semibold text-[#202124] flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Download size={13} className="text-[#A6192E]" />
              <span>Exportar Matriz Consolidada</span>
            </button>
          </div>

          <div className="bg-white border border-[#E4E2E1] rounded-sm shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E4E2E1] text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    <th className="py-2.5 px-3">CÓDIGO / TÍTULO</th>
                    <th className="py-2.5 px-3">PRIORIDAD</th>
                    <th className="py-2.5 px-3">FECHA EMISIÓN</th>
                    <th className="py-2.5 px-3 text-center">DESTINATARIOS</th>
                    <th className="py-2.5 px-3 text-center">CONFIRMADOS</th>
                    <th className="py-2.5 px-3 text-center">PENDIENTES</th>
                    <th className="py-2.5 px-3 text-center">% CUMPLIMIENTO</th>
                    <th className="py-2.5 px-3 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E2E1] text-xs font-medium text-[#202124]">
                  {comunicados.filter(c => c.estado === 'publicado').map((c) => {
                    const pct = c.totalDestinatarios > 0 ? Math.round((c.totalConfirmados / c.totalDestinatarios) * 100) : 0;
                    const pendientes = c.totalDestinatarios - c.totalConfirmados;
                    const isSelected = c.id === activeComId;

                    return (
                      <tr key={c.id} className={`hover:bg-[#FCF9F8] transition-colors ${isSelected ? 'bg-[#A6192E]/5' : ''}`}>
                        <td className="py-3 px-3">
                          <div className="flex flex-col max-w-sm">
                            <span className="font-mono text-[10px] text-[#64748B]">{c.codigo}</span>
                            <span className="font-bold text-[#202124] truncate hover:text-[#A6192E] cursor-pointer" onClick={() => { setActiveComId(c.id); setViewMode('individual'); }}>
                              {c.titulo}
                            </span>
                            <span className="text-[10px] text-[#64748B] truncate">Autor: {c.autorNombre}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className={`inline-flex px-1.5 py-0.5 rounded-sm text-tiny font-bold uppercase ${
                            c.prioridad === 'urgente'
                              ? 'bg-red-100 text-[#DC2626] border border-red-200'
                              : c.prioridad === 'importante'
                              ? 'bg-amber-100 text-[#F28C00] border border-amber-200'
                              : 'bg-slate-100 text-[#64748B] border border-slate-200'
                          }`}>
                            {c.prioridad}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-[#64748B]">
                          {c.publicadoEn || c.creadoEn}
                        </td>

                        <td className="py-3 px-3 text-center font-bold">
                          {c.totalDestinatarios}
                        </td>

                        <td className="py-3 px-3 text-center font-bold text-[#16A34A]">
                          {c.totalConfirmados}
                        </td>

                        <td className="py-3 px-3 text-center font-bold text-[#DC2626]">
                          {pendientes}
                        </td>

                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 bg-[#E4E2E1] rounded-sm h-1.5 overflow-hidden">
                              <div
                                className={`h-full ${pct >= 80 ? 'bg-[#16A34A]' : pct >= 50 ? 'bg-[#F28C00]' : 'bg-[#DC2626]'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="font-bold text-xs">{pct}%</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setActiveComId(c.id);
                                setViewMode('individual');
                              }}
                              className="px-2.5 py-1 rounded-sm bg-[#A6192E] text-white text-[11px] font-bold hover:bg-[#871326] flex items-center gap-1 cursor-pointer shadow-2xs"
                            >
                              <span>Ver Trabajadores</span>
                              <ArrowRight size={11} />
                            </button>
                            <button
                              onClick={() => setCurrentView('detalle-comunicado', c.id)}
                              className="p-1 rounded-sm text-[#64748B] hover:text-[#202124] hover:bg-slate-100 cursor-pointer"
                              title="Ver detalle del texto"
                            >
                              <Eye size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
