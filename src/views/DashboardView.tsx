import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Building2,
  FolderTree,
  FileCheck,
  AlertOctagon,
  Percent,
  PlusCircle,
  Eye,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  ShieldAlert
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    activeRole,
    sucursales,
    departamentos,
    usuarios,
    comunicados,
    setCurrentView,
    confirmarLecturaTrabajador
  } = useApp();

  // Metrics calculation
  const totalTrabajadores = usuarios.length + 176; // Representativo
  const totalSucursales = sucursales.length;
  const totalDeptos = departamentos.length;
  const publicados = comunicados.filter(c => c.estado === 'publicado');
  const urgentesPendientes = comunicados.filter(c => c.prioridad === 'urgente' && c.estado === 'publicado');

  // Overall read rate
  const totalDestinatariosSum = publicados.reduce((acc, c) => acc + c.totalDestinatarios, 0);
  const totalConfirmadosSum = publicados.reduce((acc, c) => acc + c.totalConfirmados, 0);
  const tasaConfirmacionGlobal = totalDestinatariosSum > 0 ? Math.round((totalConfirmadosSum / totalDestinatariosSum) * 100) : 0;

  // Chart data: Comunicados por mes
  const dataMeses = [
    { mes: 'Mayo', publicados: 4, confirmados: 92 },
    { mes: 'Junio', publicados: 6, confirmados: 88 },
    { mes: 'Julio', publicados: 8, confirmados: 94 },
    { mes: 'Agosto', publicados: 5, confirmados: 89 },
    { mes: 'Septiembre', publicados: 9, confirmados: 91 },
    { mes: 'Octubre', publicados: comunicados.length, confirmados: tasaConfirmacionGlobal },
  ];

  // Chart data: Confirmaciones por sucursal
  const dataSucursales = [
    { sucursal: 'Central', confirmados: 89, pendientes: 11 },
    { sucursal: 'Norte', confirmados: 84, pendientes: 16 },
    { sucursal: 'Sur', confirmados: 78, pendientes: 22 },
  ];

  // Chart data: Prioridades
  const prioridadesCount = {
    normal: comunicados.filter(c => c.prioridad === 'normal').length,
    importante: comunicados.filter(c => c.prioridad === 'importante').length,
    urgente: comunicados.filter(c => c.prioridad === 'urgente').length,
  };

  const dataPrioridades = [
    { name: 'Normal', value: prioridadesCount.normal, color: '#64748B' },
    { name: 'Importante', value: prioridadesCount.importante, color: '#F28C00' },
    { name: 'Urgente', value: prioridadesCount.urgente, color: '#A6192E' },
  ];

  // If user is worker, show simplified worker dashboard
  const isWorker = activeRole === 'trabajador';
  const workerConfirmaciones = comunicados.filter(c => c.estado === 'publicado');
  const workerPendientes = workerConfirmaciones.filter(c => {
    const conf = c.confirmaciones.find(x => x.usuarioId === currentUser.id);
    return !conf || conf.estado !== 'confirmado';
  });

  return (
    <div className="space-y-6">
      {/* Role Context Notification Bar */}
      <div className="bg-white border border-[#E4E2E1] p-3.5 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-sm bg-[#A6192E]/10 text-[#A6192E]">
            <TrendingUp size={16} />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
              {isWorker ? 'Portal del Colaborador' : 'Consola de Supervisión y Métricas Institucionales'}
            </h2>
            <p className="text-[11px] text-[#64748B]">
              Sesión activa como: <strong className="text-[#202124]">{currentUser.nombre}</strong> ({currentUser.cargo})
            </p>
          </div>
        </div>
        {!isWorker && (
          <button
            onClick={() => setCurrentView('crear-comunicado')}
            className="px-3 py-1.5 rounded-sm bg-[#A6192E] hover:bg-[#871326] text-white text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs transition-colors"
          >
            <PlusCircle size={14} />
            <span>Nuevo Comunicado</span>
          </button>
        )}
      </div>

      {/* KPI Cards Row */}
      {isWorker ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#E4E2E1] p-4 rounded-sm shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
              Comunicados Recibidos
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#202124]">{workerConfirmaciones.length}</span>
              <FileCheck size={20} className="text-[#2563EB]" />
            </div>
            <p className="text-[10px] text-[#64748B] mt-1">Dirigidos a tu departamento</p>
          </div>

          <div className="bg-white border border-[#E4E2E1] p-4 rounded-sm shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
              Lecturas Pendientes
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className={`text-2xl font-black ${workerPendientes.length > 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
                {workerPendientes.length}
              </span>
              <AlertOctagon size={20} className={workerPendientes.length > 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'} />
            </div>
            <p className="text-[10px] text-[#64748B] mt-1">
              {workerPendientes.length > 0 ? 'Requieren confirmación obligatoria' : 'Todo al día'}
            </p>
          </div>

          <div className="bg-white border border-[#E4E2E1] p-4 rounded-sm shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
              Tu Cumplimiento
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#16A34A]">
                {workerConfirmaciones.length > 0 
                  ? `${Math.round(((workerConfirmaciones.length - workerPendientes.length) / workerConfirmaciones.length) * 100)}%` 
                  : '100%'}
              </span>
              <CheckCircle2 size={20} className="text-[#16A34A]" />
            </div>
            <p className="text-[10px] text-[#64748B] mt-1">Confirmaciones registradas</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="bg-white border border-[#E4E2E1] p-3.5 rounded-sm shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
              Trabajadores Activos
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-black text-[#202124]">{totalTrabajadores}</span>
              <Users size={16} className="text-[#64748B]" />
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">100% dotación</span>
          </div>

          <div className="bg-white border border-[#E4E2E1] p-3.5 rounded-sm shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
              Sucursales
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-black text-[#202124]">{totalSucursales}</span>
              <Building2 size={16} className="text-[#64748B]" />
            </div>
            <span className="text-[10px] text-[#64748B]">Central, Norte y Sur</span>
          </div>

          <div className="bg-white border border-[#E4E2E1] p-3.5 rounded-sm shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
              Departamentos
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-black text-[#202124]">{totalDeptos}</span>
              <FolderTree size={16} className="text-[#64748B]" />
            </div>
            <span className="text-[10px] text-[#64748B]">Estructurados</span>
          </div>

          <div className="bg-white border border-[#E4E2E1] p-3.5 rounded-sm shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
              Publicados
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-black text-[#202124]">{publicados.length}</span>
              <FileCheck size={16} className="text-[#A6192E]" />
            </div>
            <span className="text-[10px] text-[#64748B]">Vigentes</span>
          </div>

          <div className="bg-white border border-[#E4E2E1] p-3.5 rounded-sm shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
              Urgentes Activos
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-black text-[#DC2626]">{urgentesPendientes.length}</span>
              <AlertOctagon size={16} className="text-[#DC2626]" />
            </div>
            <span className="text-[10px] text-[#DC2626] font-semibold">Seguimiento crítico</span>
          </div>

          <div className="bg-white border border-[#E4E2E1] p-3.5 rounded-sm shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
              Confirmación Global
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-black text-[#16A34A]">{tasaConfirmacionGlobal}%</span>
              <Percent size={16} className="text-[#16A34A]" />
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">+4.2% vs mes anterior</span>
          </div>
        </div>
      )}

      {/* Charts Row (for Management/Admin) */}
      {!isWorker && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Chart 1: Comunicados por mes */}
          <div className="bg-white border border-[#E4E2E1] rounded-sm p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E2E1] mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
                Publicaciones por Mes
              </h3>
              <span className="text-[10px] text-[#64748B]">Últimos 6 meses</span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataMeses} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ fontSize: '11px', borderRadius: '2px', border: '1px solid #E4E2E1' }}
                  />
                  <Bar dataKey="publicados" fill="#A6192E" radius={[2, 2, 0, 0]} name="Comunicados" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Confirmación por Sucursal */}
          <div className="bg-white border border-[#E4E2E1] rounded-sm p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E2E1] mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
                Confirmación por Sucursal (%)
              </h3>
              <span className="text-[10px] text-[#16A34A] font-semibold">Meta 85%</span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataSucursales} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis type="category" dataKey="sucursal" tick={{ fontSize: 10, fill: '#202124', fontWeight: 600 }} />
                  <Tooltip
                    contentStyle={{ fontSize: '11px', borderRadius: '2px', border: '1px solid #E4E2E1' }}
                    formatter={(val) => [`${val}%`, 'Confirmados']}
                  />
                  <Bar dataKey="confirmados" fill="#16A34A" radius={[0, 2, 2, 0]} name="% Confirmado" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Prioridad de Comunicados */}
          <div className="bg-white border border-[#E4E2E1] rounded-sm p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E2E1] mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
                Distribución por Prioridad
              </h3>
              <span className="text-[10px] text-[#64748B]">Total: {comunicados.length}</span>
            </div>
            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataPrioridades}
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {dataPrioridades.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '2px' }} />
                  <Legend
                    verticalAlign="bottom"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Recent Announcements Table */}
      <div className="bg-white border border-[#E4E2E1] rounded-sm shadow-2xs overflow-hidden">
        <div className="p-3.5 border-b border-[#E4E2E1] flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
              {isWorker ? 'Tus Comunicados Recientes' : 'Comunicados Recientes y Estado de Confirmación'}
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Supervisión de distribución oficial y lecturas verificadas
            </p>
          </div>
          <button
            onClick={() => setCurrentView('comunicados')}
            className="text-xs font-semibold text-[#A6192E] hover:underline flex items-center gap-1 cursor-pointer"
          >
            Ver todos los comunicados <ArrowUpRight size={13} />
          </button>
        </div>

        {/* High Density Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E4E2E1] text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                <th className="py-2.5 px-3">CÓDIGO / TÍTULO</th>
                <th className="py-2.5 px-3">PRIORIDAD</th>
                <th className="py-2.5 px-3">ALCANCE</th>
                <th className="py-2.5 px-3">AUTOR</th>
                <th className="py-2.5 px-3">FECHA</th>
                <th className="py-2.5 px-3 text-center">DESTINATARIOS</th>
                <th className="py-2.5 px-3 text-center">% CONFIRMACIÓN</th>
                <th className="py-2.5 px-3 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E2E1] text-xs font-medium text-[#202124]">
              {comunicados.slice(0, 5).map((com) => {
                const pct = com.totalDestinatarios > 0 ? Math.round((com.totalConfirmados / com.totalDestinatarios) * 100) : 0;
                const isUrgent = com.prioridad === 'urgente';
                const isImportant = com.prioridad === 'importante';

                // Check worker reading status
                const workerConf = com.confirmaciones.find(x => x.usuarioId === currentUser.id);
                const hasConfirmed = workerConf?.estado === 'confirmado';

                return (
                  <tr key={com.id} className="hover:bg-[#FCF9F8] transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex flex-col max-w-sm">
                        <span className="text-[10px] font-mono text-[#64748B]">{com.codigo}</span>
                        <span className="font-bold text-[#202124] truncate hover:text-[#A6192E] cursor-pointer" onClick={() => setCurrentView('detalle-comunicado', com.id)}>
                          {com.titulo}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded-sm text-[10px] font-bold uppercase ${
                          isUrgent
                            ? 'bg-red-100 text-[#DC2626] border border-red-200'
                            : isImportant
                            ? 'bg-amber-100 text-[#F28C00] border border-amber-200'
                            : 'bg-slate-100 text-[#64748B] border border-slate-200'
                        }`}
                      >
                        {com.prioridad}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px] text-[#64748B]">
                      {com.alcanceTipo === 'toda_empresa' ? 'Toda la empresa' : 'Sucursales / Deptos'}
                    </td>
                    <td className="py-3 px-3 text-[11px] text-[#64748B] truncate max-w-[120px]">
                      {com.autorNombre}
                    </td>
                    <td className="py-3 px-3 text-[11px] text-[#64748B]">
                      {com.publicadoEn || com.creadoEn}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold">
                      {com.totalDestinatarios}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-[#E4E2E1] rounded-sm h-1.5 overflow-hidden">
                          <div
                            className={`h-full ${pct >= 80 ? 'bg-[#16A34A]' : pct >= 50 ? 'bg-[#F28C00]' : 'bg-[#DC2626]'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold">{pct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isWorker ? (
                        hasConfirmed ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A]">
                            <CheckCircle2 size={13} /> Confirmado
                          </span>
                        ) : (
                          <button
                            onClick={() => confirmarLecturaTrabajador(com.id)}
                            className="px-2.5 py-1 rounded-sm bg-[#A6192E] hover:bg-[#871326] text-white text-[11px] font-semibold cursor-pointer"
                          >
                            Confirmar Lectura
                          </button>
                        )
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setCurrentView('detalle-comunicado', com.id)}
                            title="Ver Detalle"
                            className="p-1 rounded-sm text-[#64748B] hover:text-[#A6192E] hover:bg-[#F6F3F2] cursor-pointer"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => setCurrentView('seguimiento', com.id)}
                            title="Seguimiento de confirmaciones"
                            className="px-2 py-0.5 rounded-sm border border-[#E4E2E1] bg-white hover:bg-[#FCF9F8] text-[10px] font-semibold text-[#64748B] hover:text-[#202124] cursor-pointer"
                          >
                            Lecturas
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden p-3 space-y-2">
          {comunicados.slice(0, 4).map((com) => (
            <div key={com.id} className="p-3 rounded-sm border border-[#E4E2E1] bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#64748B]">{com.codigo}</span>
                <span className="text-[10px] font-bold uppercase text-[#A6192E]">{com.prioridad}</span>
              </div>
              <p className="font-bold text-xs text-[#202124]">{com.titulo}</p>
              <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-2 border-t border-[#E4E2E1]">
                <span>{com.publicadoEn || com.creadoEn}</span>
                <button
                  onClick={() => setCurrentView('detalle-comunicado', com.id)}
                  className="font-bold text-[#A6192E]"
                >
                  Abrir →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
