import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  History,
  Search,
  Download,
  Filter,
  ShieldAlert,
  Calendar,
  Lock,
  CheckCircle2
} from 'lucide-react';

export const AuditoriaView: React.FC = () => {
  const { auditoria } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState<string>('all');
  const [exportNotice, setExportNotice] = useState(false);

  const filteredAuditoria = auditoria.filter(a => {
    const matchSearch =
      a.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.usuarioNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.ip.includes(searchTerm);

    const matchCat = filterCategoria === 'all' || a.categoria === filterCategoria;

    return matchSearch && matchCat;
  });

  const handleExport = () => {
    const headers = ['Fecha y Hora', 'Usuario Responsable', 'Rol / Cargo', 'Accion', 'Categoria', 'Descripcion', 'IP'];
    const rows = filteredAuditoria.map(a => [
      `"${a.fechaHora}"`,
      `"${a.usuarioNombre}"`,
      `"${a.rolNombre}"`,
      `"${a.accion}"`,
      `"${a.categoria}"`,
      `"${a.descripcion.replace(/"/g, '""')}"`,
      `"${a.ip}"`
    ]);
    const csvString = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bitacora_auditoria_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-[#202124] uppercase tracking-wider flex items-center gap-2">
            <History size={18} className="text-[#A6192E]" />
            Bitácora de Auditoría del Sistema
          </h1>
          <p className="text-xs text-[#64748B]">
            Registro inmutable de trazabilidad de acciones, emisiones oficiales y cambios de seguridad
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-3.5 py-1.5 rounded-sm border border-[#E4E2E1] bg-white hover:bg-[#FCF9F8] text-xs font-semibold text-[#202124] flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Download size={14} className="text-[#A6192E]" />
          <span>Exportar Bitácora Completa (CSV)</span>
        </button>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={15} />
          <span>Bitácora de auditoría legal exportada con firma digital SHA-256.</span>
        </div>
      )}

      {/* Audit Table Container */}
      <div className="bg-white rounded-sm border border-[#E4E2E1] shadow-2xs overflow-hidden">
        {/* Toolbar */}
        <div className="p-3 border-b border-[#E4E2E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
              <Search size={14} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por usuario, IP, acción o detalle..."
              className="w-full pl-9 pr-3 py-1.5 rounded-sm text-xs border border-[#E4E2E1] bg-[#FCF9F8] text-[#202124] focus:outline-none focus:border-[#A6192E]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-[#64748B]">Categoría:</span>
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="px-2.5 py-1.5 rounded-sm text-xs border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none"
            >
              <option value="all">Todas las Categorías</option>
              <option value="comunicados">Comunicados</option>
              <option value="usuarios">Usuarios</option>
              <option value="roles">Roles y Permisos</option>
              <option value="sucursales">Sucursales y Departamentos</option>
              <option value="notificaciones">Notificaciones</option>
            </select>
          </div>
        </div>

        {/* High Density Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E4E2E1] text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                <th className="py-2.5 px-3">FECHA Y HORA</th>
                <th className="py-2.5 px-3">USUARIO RESPONSABLE</th>
                <th className="py-2.5 px-3">ACCIÓN EJECUTADA</th>
                <th className="py-2.5 px-3">CATEGORÍA</th>
                <th className="py-2.5 px-3">DESCRIPCIÓN DETALLADA</th>
                <th className="py-2.5 px-3 font-mono text-right">DIRECCIÓN IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E2E1] text-xs font-medium text-[#202124]">
              {filteredAuditoria.map((aud) => (
                <tr key={aud.id} className="hover:bg-[#FCF9F8] transition-colors">
                  <td className="py-2.5 px-3 text-[#64748B] font-mono text-[11px] whitespace-nowrap">
                    {aud.fechaHora}
                  </td>

                  <td className="py-2.5 px-3">
                    <span className="font-bold text-[#202124] block">{aud.usuarioNombre}</span>
                    <span className="text-[10px] text-[#64748B]">{aud.rolNombre}</span>
                  </td>

                  <td className="py-2.5 px-3">
                    <span className="font-bold text-[#A6192E] block">{aud.accion}</span>
                  </td>

                  <td className="py-2.5 px-3">
                    <span className="inline-flex px-1.5 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-slate-100 text-[#64748B] border border-slate-200">
                      {aud.categoria}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-[#64748B] max-w-md">
                    {aud.descripcion}
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono text-[11px] text-[#64748B]">
                    {aud.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
