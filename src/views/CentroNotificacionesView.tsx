import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BellRing,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Smartphone,
  Globe,
  RefreshCw,
  Send,
  ShieldCheck,
  Server,
  Filter
} from 'lucide-react';

export const CentroNotificacionesView: React.FC = () => {
  const {
    notificaciones,
    comunicados,
    enviarRecordatorioLectura,
    setCurrentView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'historial' | 'incidencias' | 'recordatorios'>('historial');
  const [filterTipo, setFilterTipo] = useState<string>('all');
  const [reminderSuccess, setReminderSuccess] = useState<string | null>(null);

  const urgentes = notificaciones.filter(n => n.tipo === 'urgente');
  const conIncidencia = notificaciones.filter(n => n.fallidos > 0 || n.incidencia);

  const filteredNotifs = notificaciones.filter(n => {
    if (filterTipo === 'all') return true;
    return n.tipo === filterTipo;
  });

  const handleSendQuickReminder = (comunicadoId?: string) => {
    if (!comunicadoId) return;
    enviarRecordatorioLectura(comunicadoId);
    setReminderSuccess('Recordatorio masivo despachado exitosamente.');
    setTimeout(() => setReminderSuccess(null), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-[#202124] uppercase tracking-wider flex items-center gap-2">
            <BellRing size={18} className="text-[#A6192E]" />
            Centro de Notificaciones y Distribución Institucional
          </h1>
          <p className="text-xs text-[#64748B]">
            Monitoreo en tiempo real de canales Push Móvil, Web Push y despacho de alertas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
            <Server size={13} className="text-[#16A34A]" />
            <span>Broker Local Push: Activo</span>
          </span>
        </div>
      </div>

      {reminderSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={15} />
          <span>{reminderSuccess}</span>
        </div>
      )}

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E4E2E1] p-3.5 rounded-sm shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
            Notificaciones Despachadas
          </span>
          <span className="text-2xl font-black text-[#202124] block mt-1">{notificaciones.length}</span>
          <span className="text-[10px] text-[#16A34A] font-semibold">99.2% tasa de entrega</span>
        </div>

        <div className="bg-white border border-[#E4E2E1] p-3.5 rounded-sm shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
            Alertas Urgentes
          </span>
          <span className="text-2xl font-black text-[#DC2626] block mt-1">{urgentes.length}</span>
          <span className="text-[10px] text-[#DC2626] font-semibold">Prioridad crítica</span>
        </div>

        <div className="bg-white border border-[#E4E2E1] p-3.5 rounded-sm shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
            Incidencias de Entrega
          </span>
          <span className="text-2xl font-black text-[#F28C00] block mt-1">{conIncidencia.length}</span>
          <span className="text-[10px] text-amber-700 font-semibold">Terminales apagados / sin red</span>
        </div>

        <div className="bg-white border border-[#E4E2E1] p-3.5 rounded-sm shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
            Canales Conectados
          </span>
          <div className="flex items-center gap-3 mt-1.5 text-xs font-bold text-[#202124]">
            <span className="flex items-center gap-1 text-[#16A34A]">
              <Smartphone size={14} /> TerraApp (Android/iOS)
            </span>
            <span className="flex items-center gap-1 text-blue-600">
              <Globe size={14} /> Web Push
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E4E2E1] bg-white px-2 rounded-t-sm">
        <button
          onClick={() => setActiveTab('historial')}
          className={`px-4 py-2.5 text-small font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'historial'
              ? 'border-[#A6192E] text-[#A6192E]'
              : 'border-transparent text-[#64748B] hover:text-[#202124]'
          }`}
        >
          Historial de Notificaciones ({notificaciones.length})
        </button>
        <button
          onClick={() => setActiveTab('incidencias')}
          className={`px-4 py-2.5 text-small font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'incidencias'
              ? 'border-[#A6192E] text-[#A6192E]'
              : 'border-transparent text-[#64748B] hover:text-[#202124]'
          }`}
        >
          Incidencias de Distribución ({conIncidencia.length})
        </button>
        <button
          onClick={() => setActiveTab('recordatorios')}
          className={`px-4 py-2.5 text-small font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'recordatorios'
              ? 'border-[#A6192E] text-[#A6192E]'
              : 'border-transparent text-[#64748B] hover:text-[#202124]'
          }`}
        >
          Configuración de Recordatorios Automáticos
        </button>
      </div>

      {/* TAB 1: HISTORIAL DE NOTIFICACIONES */}
      {activeTab === 'historial' && (
        <div className="bg-white border border-[#E4E2E1] rounded-sm shadow-2xs overflow-hidden">
          <div className="p-3 border-b border-[#E4E2E1] flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#202124]">
              Envíos Registrados
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase text-[#64748B]">Filtrar Tipo:</span>
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="px-2 py-1 rounded-sm text-xs border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none"
              >
                <option value="all">Todos los Tipos</option>
                <option value="urgente">Urgente</option>
                <option value="importante">Importante</option>
                <option value="recordatorio">Recordatorio</option>
                <option value="normal">Normal</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-[#E4E2E1]">
            {filteredNotifs.map((n) => (
              <div key={n.id} className="p-3.5 hover:bg-[#FCF9F8] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 rounded-sm text-[10px] font-bold uppercase ${
                        n.tipo === 'urgente'
                          ? 'bg-red-100 text-[#DC2626] border border-red-200'
                          : n.tipo === 'importante'
                          ? 'bg-amber-100 text-[#F28C00] border border-amber-200'
                          : n.tipo === 'recordatorio'
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-slate-100 text-[#64748B] border border-slate-200'
                      }`}
                    >
                      {n.tipo}
                    </span>
                    <span className="font-bold text-[#202124]">{n.titulo}</span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">{n.mensaje}</p>
                  <div className="flex items-center gap-3 text-[10px] text-[#64748B] pt-0.5">
                    <span>Canal: <strong>{n.canal}</strong></span>
                    <span>•</span>
                    <span>Fecha: <strong>{n.fechaEnvio}</strong></span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center shrink-0">
                  <span className="font-mono text-xs font-bold text-emerald-700">
                    {n.entregados} / {n.destinatarios} entregados
                  </span>
                  {n.fallidos > 0 ? (
                    <span className="text-[10px] font-bold text-[#DC2626]">
                      {n.fallidos} fallidos
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      Entrega 100% exitosa
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INCIDENCIAS DE DISTRIBUCIÓN */}
      {activeTab === 'incidencias' && (
        <div className="bg-white border border-[#E4E2E1] rounded-sm p-5 shadow-2xs space-y-4">
          <div className="border-b border-[#E4E2E1] pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
              Monitoreo de Entregas Fallidas y Terminales Desconectados
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Diagnóstico de problemas de conectividad o tokens push vencidos en smartphones corporativos
            </p>
          </div>

          <div className="space-y-3">
            {conIncidencia.map(inc => (
              <div key={inc.id} className="p-3.5 rounded-sm border border-amber-200 bg-amber-50/60 flex items-start gap-3">
                <AlertTriangle size={18} className="text-[#F28C00] shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#202124]">{inc.titulo}</span>
                    <span className="text-[10px] text-[#64748B]">{inc.fechaEnvio}</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1">{inc.incidencia || 'Falla temporal en retransmisión.'}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleSendQuickReminder(inc.comunicadoId)}
                      className="px-2.5 py-1 rounded-sm bg-[#A6192E] text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Reintentar Entrega
                    </button>
                    <span className="text-[10px] text-[#64748B]">
                      Afectados: {inc.fallidos} dispositivos
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CONFIGURACIÓN DE RECORDATORIOS */}
      {activeTab === 'recordatorios' && (
        <div className="bg-white border border-[#E4E2E1] rounded-sm p-5 shadow-2xs space-y-4 w-full lg:w-3/5 mx-auto">
          <div className="border-b border-[#E4E2E1] pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
              Reglas de Recordatorio Automático de Lectura
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Configure la frecuencia de alertas automáticas para comunicados que no registran confirmación
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-2.5 p-3 rounded-sm border border-[#E4E2E1] bg-[#FCF9F8] cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-0.5 accent-[#A6192E]" />
              <div>
                <span className="font-bold text-[#202124] block">Reenvío automático a las 24 horas</span>
                <span className="text-[11px] text-[#64748B]">
                  Dispara una notificación push recordatoria al cumplirse 1 día de la emisión si el operario no ha confirmado.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-3 rounded-sm border border-[#E4E2E1] bg-[#FCF9F8] cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-0.5 accent-[#A6192E]" />
              <div>
                <span className="font-bold text-[#202124] block">Alertas críticas para Comunicados Urgentes</span>
                <span className="text-[11px] text-[#64748B]">
                  Reiteración cada 4 horas con tono prioritario hasta que se ingrese la confirmación digital.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-3 rounded-sm border border-[#E4E2E1] bg-[#FCF9F8] cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-0.5 accent-[#A6192E]" />
              <div>
                <span className="font-bold text-[#202124] block">Alerta semanal a Jefatura de Departamento</span>
                <span className="text-[11px] text-[#64748B]">
                  Envía reporte consolidado de operarios con lecturas pendientes a cada encargado de sucursal.
                </span>
              </div>
            </label>
          </div>

          <div className="pt-3 border-t border-[#E4E2E1] flex justify-end">
            <button
              onClick={() => {
                setReminderSuccess('Reglas de recordatorios automáticos actualizadas.');
                setTimeout(() => setReminderSuccess(null), 3000);
              }}
              className="px-4 py-2 rounded-sm bg-[#A6192E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#871326] cursor-pointer"
            >
              Guardar Reglas de Recordatorios
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
