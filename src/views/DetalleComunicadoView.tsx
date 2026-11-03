import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  AlertOctagon,
  AlertTriangle,
  Info,
  Calendar,
  Building,
  Users,
  Eye,
  CheckCircle2,
  Clock,
  Download,
  Share2,
  ChevronLeft,
  X,
  ShieldCheck,
  Smartphone,
  ExternalLink
} from 'lucide-react';

export const DetalleComunicadoView: React.FC = () => {
  const {
    comunicados,
    selectedComunicadoId,
    currentUser,
    activeRole,
    setCurrentView,
    confirmarLecturaTrabajador,
    sucursales,
    departamentos,
    auditoria
  } = useApp();

  const [activeTab, setActiveTab] = useState<'contenido' | 'destinatarios' | 'confirmaciones' | 'auditoria'>('contenido');
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);
  const [selectedPdfModal, setSelectedPdfModal] = useState<string | null>(null);
  const [showMobileSimulator, setShowMobileSimulator] = useState(false);

  const comunicado = comunicados.find(c => c.id === selectedComunicadoId) || comunicados[0];

  if (!comunicado) {
    return (
      <div className="p-8 text-center text-xs text-[#64748B]">
        No se ha seleccionado ningún comunicado.
      </div>
    );
  }

  // Check worker status
  const workerConf = comunicado.confirmaciones.find(x => x.usuarioId === currentUser.id);
  const hasConfirmed = workerConf?.estado === 'confirmado';

  // Audit events for this announcement
  const relatedAuditoria = auditoria.filter(a =>
    a.descripcion.includes(comunicado.codigo) ||
    a.descripcion.includes(comunicado.titulo) ||
    a.categoria === 'comunicados'
  );

  const pctConfirmacion = comunicado.totalDestinatarios > 0
    ? Math.round((comunicado.totalConfirmados / comunicado.totalDestinatarios) * 100)
    : 0;

  return (
    <div className="w-full lg:w-4/5 mx-auto space-y-4">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('comunicados')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#A6192E] cursor-pointer"
        >
          <ChevronLeft size={16} />
          <span>Volver al Listado</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMobileSimulator(true)}
            className="px-2.5 py-1 rounded-sm border border-[#A6192E] bg-[#A6192E]/5 hover:bg-[#A6192E]/10 text-xs font-semibold text-[#A6192E] flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Previsualizar experiencia del operario en smartphone corporativo"
          >
            <Smartphone size={14} />
            <span>Simulador TerraApp Móvil</span>
          </button>

          <span className="text-[10px] font-mono bg-[#F6F3F2] border border-[#E4E2E1] px-2 py-0.5 rounded-sm text-[#64748B]">
            {comunicado.codigo}
          </span>
          {comunicado.tipoFormato === 'rapido' && (
            <span className="px-2 py-0.5 rounded-sm text-tiny font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">
              ⚡ Comunicado Rápido
            </span>
          )}
          <span className="px-2 py-0.5 rounded-sm text-tiny font-bold uppercase bg-emerald-100 text-[#16A34A] border border-emerald-200">
            {comunicado.estado}
          </span>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white border border-[#E4E2E1] rounded-sm p-5 space-y-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-sm text-tiny font-bold uppercase ${
              comunicado.prioridad === 'urgente'
                ? 'bg-red-100 text-[#DC2626] border border-red-200'
                : comunicado.prioridad === 'importante'
                ? 'bg-amber-100 text-[#F28C00] border border-amber-200'
                : 'bg-slate-100 text-[#64748B] border border-slate-200'
            }`}
          >
            Prioridad {comunicado.prioridad}
          </span>

          <span className="text-xs text-[#64748B] flex items-center gap-1">
            <Calendar size={13} />
            Publicado el: {comunicado.publicadoEn || comunicado.creadoEn}
          </span>

          <span className="text-xs text-[#64748B] flex items-center gap-1">
            <Building size={13} />
            Alcance: {comunicado.alcanceTipo === 'toda_empresa' ? 'Toda la empresa' : 'Segmentado'}
          </span>
        </div>

        <h1 className="text-lg font-black text-[#202124] tracking-tight leading-snug">
          {comunicado.titulo}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#E4E2E1] text-xs text-[#64748B]">
          <div>
            Emisor oficial: <strong className="text-[#202124]">{comunicado.autorNombre}</strong> ({comunicado.autorRol})
          </div>

          {/* WORKER CONFIRMATION CTA BUTTON */}
          <div className="flex items-center gap-2">
            {hasConfirmed ? (
              <div className="px-3 py-1.5 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-[#16A34A]" />
                <span>Lectura Confirmada ({workerConf?.confirmadoEn})</span>
              </div>
            ) : (
              <button
                onClick={() => confirmarLecturaTrabajador(comunicado.id)}
                className="px-4 py-1.5 rounded-sm bg-[#A6192E] hover:bg-[#871326] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer animate-pulse"
              >
                <CheckCircle2 size={14} />
                <span>Confirmar Lectura Oficial</span>
              </button>
            )}

            {activeRole !== 'trabajador' && (
              <button
                onClick={() => setCurrentView('seguimiento', comunicado.id)}
                className="px-3 py-1.5 rounded-sm border border-[#E4E2E1] bg-white hover:bg-[#FCF9F8] text-xs font-semibold text-[#202124] flex items-center gap-1 cursor-pointer"
              >
                <span>Ver Métrica ({pctConfirmacion}%)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation (Blueprint 1) */}
      <div className="flex border-b border-[#E4E2E1] bg-white px-2 rounded-t-sm">
        <button
          onClick={() => setActiveTab('contenido')}
          className={`px-4 py-2.5 text-small font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'contenido'
              ? 'border-[#A6192E] text-[#A6192E]'
              : 'border-transparent text-[#64748B] hover:text-[#202124]'
          }`}
        >
          Contenido y Adjuntos
        </button>
        <button
          onClick={() => setActiveTab('destinatarios')}
          className={`px-4 py-2.5 text-small font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'destinatarios'
              ? 'border-[#A6192E] text-[#A6192E]'
              : 'border-transparent text-[#64748B] hover:text-[#202124]'
          }`}
        >
          Destinatarios ({comunicado.totalDestinatarios})
        </button>
        <button
          onClick={() => setActiveTab('confirmaciones')}
          className={`px-4 py-2.5 text-small font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'confirmaciones'
              ? 'border-[#A6192E] text-[#A6192E]'
              : 'border-transparent text-[#64748B] hover:text-[#202124]'
          }`}
        >
          Confirmaciones ({comunicado.totalConfirmados}/{comunicado.totalDestinatarios})
        </button>
        <button
          onClick={() => setActiveTab('auditoria')}
          className={`px-4 py-2.5 text-small font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'auditoria'
              ? 'border-[#A6192E] text-[#A6192E]'
              : 'border-transparent text-[#64748B] hover:text-[#202124]'
          }`}
        >
          Bitácora y Auditoría
        </button>
      </div>

      {/* Tab 1: Contenido */}
      {activeTab === 'contenido' && (
        <div className="space-y-4">
          {/* Main Cover Image */}
          {comunicado.imagenes.length > 0 && (
            <div className="bg-white border border-[#E4E2E1] rounded-sm p-3 shadow-2xs">
              <div className="relative group cursor-pointer" onClick={() => setSelectedImageModal(comunicado.imagenes[0].url)}>
                <img
                  src={comunicado.imagenes[0].url}
                  alt={comunicado.titulo}
                  className="w-full h-80 object-cover rounded-sm border border-[#E4E2E1]"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1 rounded-sm">
                  <Eye size={16} /> Clic para ampliar en pantalla completa
                </div>
              </div>
              <p className="text-[11px] text-[#64748B] mt-2 italic">
                Imagen principal: {comunicado.imagenes[0].nombre} ({comunicado.imagenes[0].tamano})
              </p>
            </div>
          )}

          {/* Full Rich Body Text */}
          <div className="bg-white border border-[#E4E2E1] rounded-sm p-6 shadow-2xs text-[#202124]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3 pb-2 border-b border-[#E4E2E1]">
              Texto Oficial
            </h3>
            <div
              className="prose prose-sm max-w-none text-xs sm:text-sm leading-relaxed space-y-3"
              dangerouslySetInnerHTML={{ __html: comunicado.cuerpoHtml }}
            />
          </div>

          {/* Secondary Images Gallery */}
          {comunicado.imagenes.length > 1 && (
            <div className="bg-white border border-[#E4E2E1] rounded-sm p-4 shadow-2xs space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
                Galería de Fotografías de Terreno ({comunicado.imagenes.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {comunicado.imagenes.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setSelectedImageModal(img.url)}
                    className="cursor-pointer group relative border border-[#E4E2E1] rounded-sm overflow-hidden"
                  >
                    <img src={img.url} alt={img.nombre} className="w-full h-28 object-cover group-hover:scale-105 transition-transform" />
                    <div className="p-1.5 bg-white text-[10px] text-[#64748B] truncate">
                      {img.nombre}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attached PDFs */}
          {comunicado.pdfs.length > 0 && (
            <div className="bg-white border border-[#E4E2E1] rounded-sm p-4 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
                Documentos PDF Adjuntos para Descarga / Visualización ({comunicado.pdfs.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {comunicado.pdfs.map((pdf) => (
                  <div
                    key={pdf.id}
                    className="p-3 rounded-sm border border-[#E4E2E1] bg-[#FCF9F8] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-red-100 text-[#A6192E] rounded-sm">
                        <FileText size={18} />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#202124] block">{pdf.nombre}</span>
                        <span className="text-[10px] text-[#64748B]">{pdf.tamano} • {pdf.paginas} páginas</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPdfModal(pdf.nombre)}
                      className="px-2.5 py-1 rounded-sm border border-[#A6192E] text-[#A6192E] hover:bg-[#A6192E] hover:text-white text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <Eye size={12} /> Visualizar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Destinatarios */}
      {activeTab === 'destinatarios' && (
        <div className="bg-white border border-[#E4E2E1] rounded-sm p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E4E2E1]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
                Distribución Jerárquica del Comunicado
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Organigrama objetivo alcanzado por esta publicación
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-[#A6192E]">
              Total Destinatarios: {comunicado.totalDestinatarios}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {sucursales.map(s => (
              <div key={s.id} className="p-3 rounded-sm border border-[#E4E2E1] bg-[#FCF9F8] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#202124]">{s.nombre.split('(')[0]}</span>
                  <span className="text-[10px] font-mono text-[#16A34A] font-bold">Activa</span>
                </div>
                <p className="text-[10px] text-[#64748B]">{s.ciudad}</p>
                <div className="text-[11px] font-semibold text-[#202124] pt-1 border-t border-[#E4E2E1]">
                  Personal asignado: {s.totalTrabajadores} trabajadores
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Confirmaciones */}
      {activeTab === 'confirmaciones' && (
        <div className="bg-white border border-[#E4E2E1] rounded-sm p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E4E2E1]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
                Estado de Confirmaciones en Tiempo Real
              </h3>
              <p className="text-[11px] text-[#64748B]">
                {comunicado.totalConfirmados} de {comunicado.totalDestinatarios} confirmaciones completadas ({pctConfirmacion}%)
              </p>
            </div>
            <button
              onClick={() => setCurrentView('seguimiento', comunicado.id)}
              className="px-3 py-1.5 rounded-sm bg-[#A6192E] text-white text-xs font-bold hover:bg-[#871326] cursor-pointer"
            >
              Abrir Consola de Seguimiento Completa →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-sm border border-emerald-200 bg-emerald-50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Lectura Confirmada</span>
              <span className="text-xl font-black text-emerald-700">{comunicado.totalConfirmados}</span>
              <span className="text-[10px] text-emerald-800 block">Con firma y dispositivo registrado</span>
            </div>
            <div className="p-3 rounded-sm border border-blue-200 bg-blue-50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">Visualizados</span>
              <span className="text-xl font-black text-blue-700">{comunicado.totalVisualizados}</span>
              <span className="text-[10px] text-blue-800 block">Abrieron la notificación</span>
            </div>
            <div className="p-3 rounded-sm border border-amber-200 bg-amber-50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">Pendientes de Firma</span>
              <span className="text-xl font-black text-amber-700">{comunicado.totalDestinatarios - comunicado.totalConfirmados}</span>
              <span className="text-[10px] text-amber-800 block">Elegibles para recordatorio push</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Auditoría */}
      {activeTab === 'auditoria' && (
        <div className="bg-white border border-[#E4E2E1] rounded-sm p-5 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
            Historial de Acciones y Trazabilidad del Comunicado
          </h3>
          <div className="divide-y divide-[#E4E2E1] text-xs">
            {relatedAuditoria.map((aud) => (
              <div key={aud.id} className="py-2.5 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#202124]">{aud.accion}</span>
                    <span className="text-[10px] text-[#64748B] font-mono">IP: {aud.ip}</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5">{aud.descripcion}</p>
                </div>
                <div className="text-right text-[10px] text-[#64748B] shrink-0">
                  <span className="font-bold text-[#202124] block">{aud.usuarioNombre}</span>
                  <span>{aud.fechaHora}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL FOR IMAGES */}
      {selectedImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImageModal(null)}
              className="absolute -top-10 right-0 p-1.5 text-white hover:text-slate-300 cursor-pointer"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImageModal}
              alt="Ampliada"
              className="w-full max-h-[85vh] object-contain rounded-sm border border-slate-700"
            />
          </div>
        </div>
      )}

      {/* PDF VIEWER MODAL SIMULATOR */}
      {selectedPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs">
          <div className="bg-white border border-[#E4E2E1] rounded-sm shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col p-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E2E1]">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#A6192E]" />
                <span className="font-bold text-xs text-[#202124]">{selectedPdfModal}</span>
              </div>
              <button
                onClick={() => setSelectedPdfModal(null)}
                className="p-1 text-[#64748B] hover:text-[#202124] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Simulated PDF Canvas */}
            <div className="flex-1 bg-slate-100 p-6 overflow-y-auto flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-48 h-64 bg-white border border-slate-300 shadow-md p-4 text-left flex flex-col justify-between">
                <div>
                  <div className="h-3 w-24 bg-red-800 mb-3" />
                  <div className="space-y-1.5">
                    <div className="h-2 w-full bg-slate-200" />
                    <div className="h-2 w-5/6 bg-slate-200" />
                    <div className="h-2 w-4/6 bg-slate-200" />
                  </div>
                </div>
                <div className="text-[8px] text-slate-400 font-mono text-center">
                  Documento Oficial Protegido • Grupo Terra S.A.
                </div>
              </div>
              <p className="text-xs font-semibold text-[#202124]">
                Visor integrado de documentos corporativos en formato PDF
              </p>
              <span className="text-[11px] text-[#64748B]">
                Certificado digital y hash de integridad verificado.
              </span>
            </div>

            <div className="pt-3 border-t border-[#E4E2E1] flex justify-end">
              <button
                onClick={() => setSelectedPdfModal(null)}
                className="px-4 py-1.5 rounded-sm bg-[#A6192E] text-white text-xs font-bold"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REALISTIC SMARTPHONE SIMULATOR MODAL (TerraApp) */}
      {showMobileSimulator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative flex flex-col items-center">
            {/* Close Simulator Button */}
            <button
              onClick={() => setShowMobileSimulator(false)}
              className="absolute -top-10 right-0 p-1.5 text-white hover:text-slate-300 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <X size={18} /> Cerrar Simulador Móvil
            </button>

            {/* Smartphone Shell Frame */}
            <div className="w-[360px] h-[720px] bg-[#FCF9F8] rounded-[36px] border-[10px] border-slate-900 shadow-2xl flex flex-col overflow-hidden relative select-none">
              {/* Speaker notch & camera */}
              <div className="h-6 bg-slate-900 flex items-center justify-center">
                <div className="w-16 h-3.5 bg-black rounded-b-md flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-800" />
                  <div className="w-8 h-1 rounded-full bg-slate-800" />
                </div>
              </div>

              {/* Status Bar */}
              <div className="px-5 py-1 bg-white text-[10px] font-bold text-slate-800 flex items-center justify-between border-b border-[#E4E2E1]">
                <span>11:42</span>
                <div className="flex items-center gap-1.5 text-[9px]">
                  <span>5G</span>
                  <span>WiFi</span>
                  <span>98%</span>
                </div>
              </div>

              {/* Incoming Push Notification Banner Preview */}
              <div className="m-2.5 p-2.5 bg-white/95 border border-[#A6192E]/40 rounded-md shadow-md text-xs space-y-1 animate-in slide-in-from-top-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-xs bg-[#A6192E] text-white flex items-center justify-center text-[8px] font-black">
                      T
                    </div>
                    <span className="text-[10px] font-bold tracking-wider text-[#A6192E] uppercase">TERRAAPP • NOTIFICACIÓN PUSH</span>
                  </div>
                  <span className="text-[9px] text-slate-400">Ahora</span>
                </div>
                <p className="text-[11px] font-bold text-slate-900 truncate">{comunicado.titulo}</p>
                <p className="text-[10px] text-slate-600 line-clamp-1">{comunicado.extracto}</p>
              </div>

              {/* App Content Header */}
              <div className="px-4 py-2 bg-white border-b border-[#E4E2E1] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black text-[#A6192E] block">GRUPO TERRA</span>
                  <span className="text-xs font-bold text-slate-900">Comunicado Oficial</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-xs text-[9px] font-bold uppercase bg-slate-100 text-slate-700">
                  {comunicado.codigo}
                </span>
              </div>

              {/* App Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FCF9F8]">
                {/* Priority */}
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-xs text-[9px] font-bold uppercase ${
                    comunicado.prioridad === 'urgente' ? 'bg-red-100 text-[#DC2626]' : 'bg-amber-100 text-[#F28C00]'
                  }`}>
                    {comunicado.prioridad}
                  </span>
                  <span className="text-[10px] text-slate-500">{comunicado.publicadoEn}</span>
                </div>

                <h2 className="text-sm font-extrabold text-slate-900 leading-snug">
                  {comunicado.titulo}
                </h2>

                {/* Primary Image Preview */}
                {comunicado.imagenes.length > 0 && (
                  <img
                    src={comunicado.imagenes[0].url}
                    alt="Foto"
                    className="w-full h-36 object-cover rounded-xs border border-[#E4E2E1]"
                  />
                )}

                {/* Body Text */}
                <div
                  className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-xs border border-[#E4E2E1]"
                  dangerouslySetInnerHTML={{ __html: comunicado.cuerpoHtml }}
                />

                {/* PDF Attachment in Mobile */}
                {comunicado.pdfs.length > 0 && (
                  <div className="p-2.5 bg-white border border-[#E4E2E1] rounded-xs flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-[#A6192E]" />
                      <div>
                        <span className="font-bold text-[11px] text-slate-900 block truncate max-w-[180px]">
                          {comunicado.pdfs[0].nombre}
                        </span>
                        <span className="text-[9px] text-slate-500">{comunicado.pdfs[0].tamano}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#A6192E]">PDF</span>
                  </div>
                )}
              </div>

              {/* Bottom Sticky Confirmation Bar inside phone */}
              <div className="p-3 bg-white border-t border-[#E4E2E1]">
                {hasConfirmed ? (
                  <div className="w-full py-2.5 px-3 bg-emerald-600 text-white rounded-xs text-xs font-bold text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={16} />
                    <span>LECTURA CONFIRMADA</span>
                  </div>
                ) : (
                  <button
                    onClick={() => confirmarLecturaTrabajador(comunicado.id)}
                    className="w-full py-2.5 px-3 bg-[#A6192E] hover:bg-[#871326] text-white rounded-xs text-xs font-bold uppercase tracking-wider text-center shadow-md flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                  >
                    <CheckCircle2 size={15} />
                    <span>CONFIRMAR LECTURA OFICIAL</span>
                  </button>
                )}
                <span className="block text-[9px] text-center text-slate-400 mt-1">
                  Autenticado: {currentUser.nombre} ({currentUser.rut})
                </span>
              </div>

              {/* Home indicator bar */}
              <div className="h-4 bg-white flex items-center justify-center">
                <div className="w-28 h-1 bg-slate-300 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
