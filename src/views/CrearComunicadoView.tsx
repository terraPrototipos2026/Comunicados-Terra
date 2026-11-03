import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  PrioridadComunicado,
  AlcanceTipo,
  ImagenAdjunta,
  PdfAdjunto,
  Comunicado,
  RoleKey
} from '../types';
import {
  FileText,
  AlertOctagon,
  AlertTriangle,
  Info,
  Upload,
  Image as ImageIcon,
  FileCheck,
  Trash2,
  MoveUp,
  MoveDown,
  Star,
  Users,
  Building2,
  FolderTree,
  Calendar,
  Eye,
  CheckCircle2,
  X,
  Save,
  Send,
  Bold,
  Italic,
  List,
  Heading2,
  Link2,
  Lock,
  ShieldCheck,
  UserCheck,
  Briefcase,
  Layers,
  ArrowRight,
  UserCog
} from 'lucide-react';

export const CrearComunicadoView: React.FC = () => {
  const {
    sucursales,
    departamentos,
    usuarios,
    addComunicado,
    setCurrentView,
    currentUser,
    activeRole,
    setActiveRole
  } = useApp();

  const isCEO = activeRole === 'admin_ceo' || activeRole === 'rrhh';
  const isGerente = activeRole === 'gerente_sucursal';
  const isEncargado = activeRole === 'encargado_depto';
  const isWorker = activeRole === 'trabajador';

  const userSucursal = sucursales.find(s => s.id === currentUser.sucursalId) || sucursales[0];
  const userDepto = departamentos.find(d => d.id === currentUser.departamentoId) || departamentos[0];

  // Encargados de Área de la empresa
  const encargadosArea = useMemo(() => {
    return usuarios.filter(u => u.rolKey === 'encargado_depto');
  }, [usuarios]);

  // Default initial scope based on role
  const initialAlcance: AlcanceTipo = isCEO 
    ? 'toda_empresa' 
    : isGerente 
    ? 'sucursal' 
    : 'encargados_area';

  // Form states
  const [titulo, setTitulo] = useState('');
  const [extracto, setExtracto] = useState('');
  const [cuerpoHtml, setCuerpoHtml] = useState(
    `<p>Por medio del presente comunicado oficial se informa a los colaboradores lo siguiente:</p>\n<p>Favor revisar los anexos adjuntos y confirmar la recepción de esta circular en la plataforma.</p>`
  );
  const [prioridad, setPrioridad] = useState<PrioridadComunicado>('normal');
  const [alcanceTipo, setAlcanceTipo] = useState<AlcanceTipo>(initialAlcance);
  const [selectedSucursales, setSelectedSucursales] = useState<string[]>(
    isGerente ? [userSucursal.id] : ['suc-1', 'suc-2', 'suc-3']
  );
  const [selectedDepartamentos, setSelectedDepartamentos] = useState<string[]>(
    isEncargado ? [userDepto.id] : []
  );
  const [selectedUsuarios, setSelectedUsuarios] = useState<string[]>([]);
  const [selectedEncargados, setSelectedEncargados] = useState<string[]>(
    usuarios.filter(u => u.rolKey === 'encargado_depto').map(u => u.id)
  );

  // Sync initial scope whenever activeRole changes
  useEffect(() => {
    if (isCEO) {
      setAlcanceTipo('toda_empresa');
    } else if (isGerente) {
      setAlcanceTipo('sucursal');
      setSelectedSucursales([userSucursal.id]);
    } else if (isEncargado) {
      setAlcanceTipo('encargados_area');
      setSelectedDepartamentos([userDepto.id]);
    }
  }, [activeRole, userSucursal.id, userDepto.id, isCEO, isGerente, isEncargado]);

  // Attachments
  const [imagenes, setImagenes] = useState<ImagenAdjunta[]>([
    {
      id: 'img-demo-1',
      url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80',
      nombre: 'comunicado_planta_operaciones.jpg',
      tamano: '2.4 MB',
      esPrincipal: true,
      orden: 1
    }
  ]);

  const [pdfs, setPdfs] = useState<PdfAdjunto[]>([
    {
      id: 'pdf-demo-1',
      nombre: 'Circular_Oficial_Procedimientos_2026.pdf',
      tamano: '2.1 MB',
      url: '#',
      paginas: 4
    }
  ]);

  const [scheduleDate, setScheduleDate] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);

  // Modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [confirmPublishType, setConfirmPublishType] = useState<'publicado' | 'borrador' | 'programado'>('publicado');

  // Simulated upload states
  const [uploadError, setUploadError] = useState('');

  // Target estimation calculation
  const estimatedRecipients = useMemo(() => {
    if (alcanceTipo === 'toda_empresa') {
      return 191;
    }
    if (alcanceTipo === 'encargados_area') {
      return selectedEncargados.length || encargadosArea.length;
    }
    if (alcanceTipo === 'sucursal') {
      if (isGerente) return userSucursal.totalTrabajadores;
      let count = 0;
      selectedSucursales.forEach(sId => {
        const suc = sucursales.find(s => s.id === sId);
        if (suc) count += suc.totalTrabajadores;
      });
      return count || 15;
    }
    if (alcanceTipo === 'departamento') {
      if (isEncargado) return userDepto.totalTrabajadores;
      let count = 0;
      selectedDepartamentos.forEach(dId => {
        const dep = departamentos.find(d => d.id === dId);
        if (dep) count += dep.totalTrabajadores;
      });
      return count || 10;
    }
    if (alcanceTipo === 'individual') {
      return selectedUsuarios.length || 1;
    }
    return 191;
  }, [
    alcanceTipo,
    selectedSucursales,
    selectedDepartamentos,
    selectedUsuarios,
    selectedEncargados,
    isGerente,
    isEncargado,
    userSucursal,
    userDepto,
    sucursales,
    departamentos,
    encargadosArea
  ]);

  // Image actions
  const handleSetPrimary = (index: number) => {
    setImagenes(prev =>
      prev.map((img, i) => ({
        ...img,
        esPrincipal: i === index,
        orden: i === index ? 1 : i + 2
      }))
    );
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= imagenes.length) return;
    const copy = [...imagenes];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    // update order numbers
    setImagenes(copy.map((img, idx) => ({ ...img, orden: idx + 1 })));
  };

  const handleRemoveImage = (index: number) => {
    const filtered = imagenes.filter((_, i) => i !== index);
    if (filtered.length > 0 && !filtered.some(img => img.esPrincipal)) {
      filtered[0].esPrincipal = true;
    }
    setImagenes(filtered);
  };

  const handleSimulatedImageUpload = () => {
    const sampleImages = [
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&auto=format&fit=crop&q=80'
    ];
    const randomUrl = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    const newImg: ImagenAdjunta = {
      id: `img-${Date.now()}`,
      url: randomUrl,
      nombre: `adjunto_terreno_${imagenes.length + 1}.jpg`,
      tamano: '1.9 MB',
      esPrincipal: imagenes.length === 0,
      orden: imagenes.length + 1
    };
    setImagenes(prev => [...prev, newImg]);
  };

  const handleSimulatedPdfUpload = () => {
    const newPdf: PdfAdjunto = {
      id: `pdf-${Date.now()}`,
      nombre: `Anexo_Normativo_Instructivo_${pdfs.length + 1}.pdf`,
      tamano: '1.4 MB',
      url: '#',
      paginas: Math.floor(Math.random() * 8) + 2
    };
    setPdfs(prev => [...prev, newPdf]);
  };

  const handleRemovePdf = (id: string) => {
    setPdfs(prev => prev.filter(p => p.id !== id));
  };

  const executePublish = (status: 'publicado' | 'borrador' | 'programado') => {
    if (!titulo.trim()) {
      alert('Por favor ingrese el título del comunicado institucional.');
      return;
    }

    const created = addComunicado({
      titulo,
      extracto: extracto || titulo,
      cuerpoHtml,
      prioridad,
      estado: status,
      alcanceTipo,
      targetSucursales: isGerente ? [userSucursal.id] : isEncargado ? [] : selectedSucursales,
      targetDepartamentos: isEncargado && alcanceTipo === 'departamento' ? [userDepto.id] : selectedDepartamentos,
      targetUsuarios: alcanceTipo === 'encargados_area' ? selectedEncargados : selectedUsuarios,
      programadoEn: status === 'programado' ? scheduleDate : undefined,
      imagenes,
      pdfs,
      totalDestinatarios: estimatedRecipients
    });

    setShowConfirmModal(false);
    setCurrentView('detalle-comunicado', created.id);
  };

  if (isWorker) {
    return (
      <div className="w-full lg:w-3/5 mx-auto bg-white border border-[#E4E2E1] rounded-sm p-8 text-center space-y-4 shadow-2xs">
        <div className="w-12 h-12 bg-red-50 text-[#A6192E] rounded-sm flex items-center justify-center mx-auto">
          <Lock size={24} />
        </div>
        <h2 className="text-base font-bold text-[#202124] uppercase tracking-wider">
          Módulo Restringido por Perfil
        </h2>
        <p className="text-xs text-[#64748B] max-w-md mx-auto leading-relaxed">
          Su rol actual es <strong>Trabajador / Operario</strong>. Los colaboradores tienen permisos exclusivos de recepción, visualización de documentos y confirmación oficial de lectura.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setCurrentView('comunicados')}
            className="px-4 py-2 rounded-sm bg-[#A6192E] hover:bg-[#871326] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Ver Mis Comunicados Recibidos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-4/5 mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E4E2E1] pb-3">
        <div>
          <h1 className="text-base font-bold text-[#202124] uppercase tracking-wider flex items-center gap-2">
            <FileText size={18} className="text-[#A6192E]" />
            Redactar y Distribuir Nuevo Comunicado
          </h1>
          <p className="text-xs text-[#64748B]">
            Emisión oficial con seguimiento obligatorio de lectura y registro en auditoría
          </p>
        </div>
        <button
          onClick={() => setCurrentView('comunicados')}
          className="px-3 py-1.5 rounded-sm border border-[#E4E2E1] bg-white text-xs font-semibold text-[#64748B] hover:bg-[#F6F3F2] cursor-pointer"
        >
          Volver a Comunicados
        </button>
      </div>

      {/* Main Form Body */}
      <div className="space-y-6">
        {/* SECTION 1: INFORMACIÓN GENERAL */}
        <div className="bg-white border border-[#E4E2E1] rounded-sm p-5 space-y-4 shadow-2xs">
          <div className="border-b border-[#E4E2E1] pb-2 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#202124] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-sm bg-[#A6192E] text-white flex items-center justify-center text-[10px]">1</span>
              Información General y Contenido
            </h2>
            <span className="text-[10px] text-[#64748B]">Campos con * son obligatorios</span>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Título del Comunicado <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Protocolo de Seguridad Ocupacional y Cambio de EPP en Planta..."
                className="w-full px-3 py-2 rounded-sm text-xs font-semibold border border-[#E4E2E1] bg-[#FCF9F8] text-[#202124] focus:outline-none focus:border-[#A6192E] focus:ring-1 focus:ring-[#A6192E]"
              />
            </div>

            {/* Extract */}
            <div>
              <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Extracto / Resumen Ejecutivo (para notificación push en smartphones)
              </label>
              <input
                type="text"
                value={extracto}
                onChange={(e) => setExtracto(e.target.value)}
                placeholder="Breve resumen que verán los operarios en la notificación del teléfono antes de abrir..."
                className="w-full px-3 py-1.5 rounded-sm text-xs border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none focus:border-[#A6192E]"
              />
            </div>

            {/* Priority Selector */}
            <div>
              <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                Nivel de Prioridad <span className="text-[#DC2626]">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPrioridad('normal')}
                  className={`p-3 rounded-sm border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    prioridad === 'normal'
                      ? 'border-slate-800 bg-slate-50 ring-1 ring-slate-800'
                      : 'border-[#E4E2E1] bg-white hover:bg-[#FCF9F8]'
                  }`}
                >
                  <Info size={16} className="text-slate-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-xs text-[#202124] block">Normal</span>
                    <span className="text-[10px] text-[#64748B] leading-tight">
                      Avisos generales, capacitaciones y actividades corporativas.
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPrioridad('importante')}
                  className={`p-3 rounded-sm border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    prioridad === 'importante'
                      ? 'border-[#F28C00] bg-amber-50/60 ring-1 ring-[#F28C00]'
                      : 'border-[#E4E2E1] bg-white hover:bg-[#FCF9F8]'
                  }`}
                >
                  <AlertTriangle size={16} className="text-[#F28C00] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-xs text-[#F28C00] block">Importante</span>
                    <span className="text-[10px] text-[#64748B] leading-tight">
                      Políticas de turnos, normativas internas y beneficios.
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPrioridad('urgente')}
                  className={`p-3 rounded-sm border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    prioridad === 'urgente'
                      ? 'border-[#DC2626] bg-red-50/60 ring-1 ring-[#DC2626]'
                      : 'border-[#E4E2E1] bg-white hover:bg-[#FCF9F8]'
                  }`}
                >
                  <AlertOctagon size={16} className="text-[#DC2626] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-xs text-[#DC2626] block">Urgente</span>
                    <span className="text-[10px] text-[#64748B] leading-tight">
                      Alertas de seguridad, emergencias y retiros inmediatos.
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Rich Editor Simulated */}
            <div>
              <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Cuerpo del Comunicado (Editor Enriquecido) <span className="text-[#DC2626]">*</span>
              </label>
              <div className="border border-[#E4E2E1] rounded-sm overflow-hidden bg-white">
                {/* Editor Toolbar */}
                <div className="bg-[#F8FAFC] border-b border-[#E4E2E1] p-1.5 flex flex-wrap items-center gap-1 text-[#64748B]">
                  <button
                    type="button"
                    onClick={() => setCuerpoHtml(prev => prev + '\n<strong>[Texto en negrita]</strong>')}
                    className="p-1 hover:bg-[#E4E2E1] rounded text-[#202124] text-xs font-bold cursor-pointer"
                    title="Negrita"
                  >
                    <Bold size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCuerpoHtml(prev => prev + '\n<em>[Texto en cursiva]</em>')}
                    className="p-1 hover:bg-[#E4E2E1] rounded text-[#202124] text-xs cursor-pointer"
                    title="Cursiva"
                  >
                    <Italic size={13} />
                  </button>
                  <span className="w-px h-4 bg-[#E4E2E1] mx-1" />
                  <button
                    type="button"
                    onClick={() => setCuerpoHtml(prev => prev + '\n<h3>[Subtítulo de Sección]</h3>')}
                    className="p-1 hover:bg-[#E4E2E1] rounded text-[#202124] text-xs cursor-pointer"
                    title="Título de sección"
                  >
                    <Heading2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCuerpoHtml(prev => prev + '\n<ul>\n  <li>Punto obligatorio 1</li>\n  <li>Punto obligatorio 2</li>\n</ul>')}
                    className="p-1 hover:bg-[#E4E2E1] rounded text-[#202124] text-xs cursor-pointer"
                    title="Lista con viñetas"
                  >
                    <List size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCuerpoHtml(prev => prev + '\n<a href="#" class="text-[#A6192E] underline">[Enlace a normativa interna]</a>')}
                    className="p-1 hover:bg-[#E4E2E1] rounded text-[#202124] text-xs cursor-pointer"
                    title="Insertar enlace institucional"
                  >
                    <Link2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCuerpoHtml(prev => prev + '\n<div class="p-3 my-2 border-l-4 border-[#A6192E] bg-red-50 text-red-900 font-semibold">\n  <strong>NOTA OBLIGATORIA:</strong> Indique aquí una advertencia legal relevante.\n</div>')}
                    className="px-2 py-0.5 hover:bg-[#E4E2E1] rounded text-[10px] font-bold text-[#A6192E] cursor-pointer"
                    title="Insertar recuadro de advertencia"
                  >
                    + Cuadro Alerta
                  </button>
                  <span className="ml-auto text-[10px] text-[#64748B] font-mono">Modo: HTML Estructurado</span>
                </div>
                {/* Textarea */}
                <textarea
                  rows={6}
                  value={cuerpoHtml}
                  onChange={(e) => setCuerpoHtml(e.target.value)}
                  className="w-full p-3 text-xs font-mono text-[#202124] bg-white focus:outline-none"
                  placeholder="Redacte aquí el texto oficial..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: ARCHIVOS ADJUNTOS (IMÁGENES Y PDF) */}
        <div className="bg-white border border-[#E4E2E1] rounded-sm p-5 space-y-4 shadow-2xs">
          <div className="border-b border-[#E4E2E1] pb-2 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#202124] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-sm bg-[#A6192E] text-white flex items-center justify-center text-[10px]">2</span>
              Galería de Imágenes y Documentos PDF
            </h2>
            <span className="text-[10px] text-[#64748B]">Almacenamiento en servidor propio</span>
          </div>

          {/* Images Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#202124] block">Imágenes Institucionales ({imagenes.length})</span>
                <span className="text-[11px] text-[#64748B]">
                  Formatos permitidos: JPG, PNG. La primera imagen se usará como portada principal.
                </span>
              </div>
              <button
                type="button"
                onClick={handleSimulatedImageUpload}
                className="px-3 py-1 rounded-sm border border-[#E4E2E1] bg-[#FCF9F8] hover:bg-[#F6F3F2] text-xs font-semibold text-[#202124] flex items-center gap-1 cursor-pointer"
              >
                <Upload size={13} className="text-[#A6192E]" />
                <span>Cargar Imagen</span>
              </button>
            </div>

            {/* Images List with reordering & primary selection */}
            {imagenes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {imagenes.map((img, idx) => (
                  <div
                    key={img.id}
                    className={`relative p-2 rounded-sm border ${
                      img.esPrincipal ? 'border-[#A6192E] bg-[#A6192E]/5 ring-1 ring-[#A6192E]' : 'border-[#E4E2E1] bg-white'
                    } flex flex-col justify-between`}
                  >
                    <div className="relative">
                      <img
                        src={img.url}
                        alt={img.nombre}
                        className="w-full h-28 object-cover rounded-sm border border-[#E4E2E1]"
                      />
                      {img.esPrincipal && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-sm bg-[#A6192E] text-white text-[9px] font-bold flex items-center gap-1">
                          <Star size={10} /> PORTADA
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-xs">
                      <span className="font-bold text-[#202124] block truncate">{img.nombre}</span>
                      <span className="text-[10px] text-[#64748B]">{img.tamano}</span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#E4E2E1] flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded text-[#64748B] hover:text-[#202124] disabled:opacity-30 cursor-pointer"
                          title="Mover arriba"
                        >
                          <MoveUp size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, 'down')}
                          disabled={idx === imagenes.length - 1}
                          className="p-1 rounded text-[#64748B] hover:text-[#202124] disabled:opacity-30 cursor-pointer"
                          title="Mover abajo"
                        >
                          <MoveDown size={12} />
                        </button>
                        {!img.esPrincipal && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(idx)}
                            className="text-[10px] text-[#A6192E] font-bold hover:underline ml-1"
                          >
                            Hacer Portada
                          </button>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1 text-[#DC2626] hover:bg-red-50 rounded"
                        title="Eliminar"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border border-dashed border-[#E4E2E1] rounded-sm text-center text-xs text-[#64748B]">
                Sin imágenes adjuntas. Puede agregar fotos de terreno, circulares o esquemas visuales.
              </div>
            )}
          </div>

          {/* PDFs Section */}
          <div className="space-y-3 pt-3 border-t border-[#E4E2E1]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#202124] block">Documentos Oficiales en PDF ({pdfs.length})</span>
                <span className="text-[11px] text-[#64748B]">
                  Validación automática: Solo archivos .PDF con tamaño máximo de 25MB por archivo.
                </span>
              </div>
              <button
                type="button"
                onClick={handleSimulatedPdfUpload}
                className="px-3 py-1 rounded-sm border border-[#E4E2E1] bg-[#FCF9F8] hover:bg-[#F6F3F2] text-xs font-semibold text-[#202124] flex items-center gap-1 cursor-pointer"
              >
                <Upload size={13} className="text-[#A6192E]" />
                <span>Adjuntar PDF</span>
              </button>
            </div>

            {pdfs.length > 0 ? (
              <div className="space-y-2">
                {pdfs.map((pdf) => (
                  <div
                    key={pdf.id}
                    className="p-2.5 rounded-sm border border-[#E4E2E1] bg-[#FCF9F8] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-sm bg-red-100 text-[#A6192E]">
                        <FileText size={16} />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#202124] block">{pdf.nombre}</span>
                        <span className="text-[10px] text-[#64748B]">
                          {pdf.tamano} • {pdf.paginas} páginas • Verificación digital completada
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePdf(pdf.id)}
                      className="p-1 text-[#DC2626] hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 border border-dashed border-[#E4E2E1] rounded-sm text-center text-xs text-[#64748B]">
                Sin documentos PDF adjuntos.
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: DESTINATARIOS JERÁRQUICOS SEGÚN ROL */}
        <div className="bg-white border border-[#E4E2E1] rounded-sm p-5 space-y-4 shadow-2xs">
          <div className="border-b border-[#E4E2E1] pb-2 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#202124] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-sm bg-[#A6192E] text-white flex items-center justify-center text-[10px]">3</span>
              Alcance y Selección Jerárquica de Destinatarios
            </h2>
            <div className="px-2 py-0.5 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
              Estimado de Alcance: ~{estimatedRecipients} colaboradores
            </div>
          </div>

          {/* Quick Role Simulation Bar */}
          <div className="p-3 bg-[#FCF9F8] border border-[#E4E2E1] rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <UserCog size={15} className="text-[#A6192E]" />
              <div>
                <span className="text-xs font-bold text-[#202124] block">Simulador de Rol Emisor:</span>
                <span className="text-[11px] text-[#64748B]">Verifique cómo cambian en vivo los permisos y restricciones de envío</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveRole('admin_ceo')}
                className={`px-2.5 py-1 text-xs rounded-sm transition-all cursor-pointer ${
                  isCEO
                    ? 'bg-[#A6192E] text-white font-bold shadow-2xs'
                    : 'bg-white border border-[#E4E2E1] text-[#202124] hover:bg-[#F6F3F2]'
                }`}
              >
                1. CEO (Sin restricción)
              </button>
              <button
                type="button"
                onClick={() => setActiveRole('gerente_sucursal')}
                className={`px-2.5 py-1 text-xs rounded-sm transition-all cursor-pointer ${
                  isGerente
                    ? 'bg-[#F28C00] text-white font-bold shadow-2xs'
                    : 'bg-white border border-[#E4E2E1] text-[#202124] hover:bg-[#F6F3F2]'
                }`}
              >
                2. Gerente Sucursal (Solo su sede)
              </button>
              <button
                type="button"
                onClick={() => setActiveRole('encargado_depto')}
                className={`px-2.5 py-1 text-xs rounded-sm transition-all cursor-pointer ${
                  isEncargado
                    ? 'bg-blue-700 text-white font-bold shadow-2xs'
                    : 'bg-white border border-[#E4E2E1] text-[#202124] hover:bg-[#F6F3F2]'
                }`}
              >
                3. Encargado de Área (Solo a encargados de área)
              </button>
              <button
                type="button"
                onClick={() => setActiveRole('trabajador')}
                className="px-2.5 py-1 text-xs rounded-sm bg-white border border-[#E4E2E1] text-slate-500 hover:bg-[#F6F3F2] cursor-pointer"
                title="Probar pantalla de bloqueo para operarios"
              >
                4. Operario (Bloqueado)
              </button>
            </div>
          </div>

          {/* Role Authorization Context Banner */}
          {isCEO && (
            <div className="p-3 bg-red-50/70 border border-red-200 rounded-sm text-xs text-red-950 flex items-start gap-2.5">
              <ShieldCheck size={18} className="text-[#A6192E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#A6192E] block">Permiso Total Corporativo — Dirección General / CEO:</span>
                <span>Tiene autorización completa e irrestricta. Puede emitir comunicados a Toda la Empresa (100% de la dotación - 191 colaboradores), cualquier combinación de sucursales, cualquier departamento, a la red de encargados de área o a trabajadores específicos.</span>
              </div>
            </div>
          )}

          {isGerente && (
            <div className="p-3 bg-amber-50/90 border border-amber-300 rounded-sm text-xs text-amber-950 flex items-start gap-2.5">
              <Building2 size={18} className="text-[#F28C00] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#F28C00] block">Alcance Delimitado a su Sede — {userSucursal.nombre}:</span>
                <span>Como Gerente de Sucursal, <strong>solo podrá mandar a los colaboradores de su propia sucursal</strong> ({userSucursal.totalTrabajadores} personas). La opción «Toda la Empresa» y otras sedes se encuentran <strong>bloqueadas por política corporativa</strong>.</span>
              </div>
            </div>
          )}

          {isEncargado && (
            <div className="p-3 bg-blue-50/90 border border-blue-300 rounded-sm text-xs text-blue-950 flex items-start gap-2.5">
              <FolderTree size={18} className="text-blue-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-blue-800 block">Alcance Jerárquico de Área — {userDepto.nombre}:</span>
                <span>Como Encargado de Área, <strong>solo podrá enviar comunicados a los Encargados de Área (Jefaturas)</strong> ({encargadosArea.length} encargados a nivel corporativo) o al personal operativo de su propia área. Los envíos a toda la empresa y a sucursales completas están <strong>estrictamente restringidos</strong>.</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Hierarchical Scope Option Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {/* Option 1: Toda la Empresa (CEO only) */}
              <button
                type="button"
                disabled={!isCEO}
                onClick={() => isCEO && setAlcanceTipo('toda_empresa')}
                className={`p-3 rounded-sm border text-left transition-all ${
                  alcanceTipo === 'toda_empresa'
                    ? 'border-[#A6192E] bg-[#A6192E]/5 ring-1 ring-[#A6192E]'
                    : isCEO
                    ? 'border-[#E4E2E1] bg-white hover:bg-[#FCF9F8] cursor-pointer'
                    : 'border-[#E4E2E1] bg-slate-100/70 opacity-60 cursor-not-allowed'
                }`}
                title={!isCEO ? 'Restringido exclusivamente al CEO / Dirección General' : 'Emisión al 100% de la dotación'}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#202124] block">Toda la Empresa</span>
                  {!isCEO ? (
                    <span title="Restringido al CEO">
                      <Lock size={13} className="text-[#DC2626]" />
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                  )}
                </div>
                <span className="text-[10px] text-[#64748B] block leading-tight">
                  {isCEO ? '100% dotación (191 colaboradores)' : 'Solo Dirección (CEO)'}
                </span>
                {!isCEO && (
                  <span className="inline-block mt-1 text-[9px] font-bold text-[#DC2626] bg-red-50 px-1 py-0.5 rounded">
                    Bloqueado
                  </span>
                )}
              </button>

              {/* Option 2: Por Sucursal (CEO or Gerente locked to theirs) */}
              <button
                type="button"
                disabled={isEncargado}
                onClick={() => {
                  if (!isEncargado) {
                    setAlcanceTipo('sucursal');
                    if (isGerente) setSelectedSucursales([userSucursal.id]);
                  }
                }}
                className={`p-3 rounded-sm border text-left transition-all ${
                  alcanceTipo === 'sucursal'
                    ? 'border-[#A6192E] bg-[#A6192E]/5 ring-1 ring-[#A6192E]'
                    : !isEncargado
                    ? 'border-[#E4E2E1] bg-white hover:bg-[#FCF9F8] cursor-pointer'
                    : 'border-[#E4E2E1] bg-slate-100/70 opacity-60 cursor-not-allowed'
                }`}
                title={isEncargado ? 'Restringido: el Encargado de Área solo envía a Encargados de Área' : ''}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#202124] block">
                    {isGerente ? 'Mi Sucursal' : 'Por Sucursal'}
                  </span>
                  {isEncargado ? (
                    <span title="Restringido a Gerencia y CEO">
                      <Lock size={13} className="text-[#DC2626]" />
                    </span>
                  ) : (
                    <Building2 size={13} className="text-[#F28C00]" />
                  )}
                </div>
                <span className="text-[10px] text-[#64748B] block leading-tight">
                  {isGerente ? `${userSucursal.ciudad} (${userSucursal.totalTrabajadores})` : isEncargado ? 'No autorizado' : 'Central, Norte o Sur'}
                </span>
                {isGerente && (
                  <span className="inline-block mt-1 text-[9px] font-bold text-amber-800 bg-amber-50 px-1 py-0.5 rounded">
                    Fijado a mi sede
                  </span>
                )}
                {isEncargado && (
                  <span className="inline-block mt-1 text-[9px] font-bold text-[#DC2626] bg-red-50 px-1 py-0.5 rounded">
                    Bloqueado
                  </span>
                )}
              </button>

              {/* Option 3: A Encargados de Área (Highlighted for Encargado de Área) */}
              <button
                type="button"
                disabled={isGerente}
                onClick={() => {
                  if (!isGerente) {
                    setAlcanceTipo('encargados_area');
                  }
                }}
                className={`p-3 rounded-sm border text-left transition-all ${
                  alcanceTipo === 'encargados_area'
                    ? 'border-[#A6192E] bg-[#A6192E]/5 ring-1 ring-[#A6192E]'
                    : !isGerente
                    ? 'border-[#E4E2E1] bg-white hover:bg-[#FCF9F8] cursor-pointer'
                    : 'border-[#E4E2E1] bg-slate-100/70 opacity-60 cursor-not-allowed'
                }`}
                title={isGerente ? 'El Gerente de Sucursal solo emite a colaboradores de su propia sucursal' : 'Comunicado directo a los Encargados de Área'}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#202124] block">A Encargados de Área</span>
                  {isGerente ? (
                    <span title="Restringido: el Gerente solo envía a su sucursal">
                      <Lock size={13} className="text-[#DC2626]" />
                    </span>
                  ) : (
                    <Users size={13} className="text-blue-700" />
                  )}
                </div>
                <span className="text-[10px] text-[#64748B] block leading-tight">
                  {isGerente ? 'Solo personal local' : `${encargadosArea.length} Jefaturas de Área`}
                </span>
                {isEncargado && (
                  <span className="inline-block mt-1 text-[9px] font-bold text-blue-800 bg-blue-50 px-1 py-0.5 rounded">
                    Objetivo Principal
                  </span>
                )}
                {isGerente && (
                  <span className="inline-block mt-1 text-[9px] font-bold text-[#DC2626] bg-red-50 px-1 py-0.5 rounded">
                    Bloqueado
                  </span>
                )}
              </button>

              {/* Option 4: Por Departamento / Área */}
              <button
                type="button"
                onClick={() => {
                  setAlcanceTipo('departamento');
                  if (isEncargado) setSelectedDepartamentos([userDepto.id]);
                }}
                className={`p-3 rounded-sm border text-left cursor-pointer transition-all ${
                  alcanceTipo === 'departamento'
                    ? 'border-[#A6192E] bg-[#A6192E]/5 ring-1 ring-[#A6192E]'
                    : 'border-[#E4E2E1] bg-white hover:bg-[#FCF9F8]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#202124] block">
                    {isEncargado ? 'Mi Propia Área' : 'Por Departamento'}
                  </span>
                  <FolderTree size={13} className="text-slate-600" />
                </div>
                <span className="text-[10px] text-[#64748B] block leading-tight">
                  {isEncargado ? `${userDepto.nombre} (${userDepto.totalTrabajadores})` : isGerente ? 'Deptos. de mi sede' : 'Cualquier departamento'}
                </span>
                {isEncargado && (
                  <span className="inline-block mt-1 text-[9px] font-bold text-slate-700 bg-slate-100 px-1 py-0.5 rounded">
                    Mi dotación
                  </span>
                )}
              </button>

              {/* Option 5: Trabajadores Específicos / Nominativos */}
              <button
                type="button"
                onClick={() => setAlcanceTipo('individual')}
                className={`p-3 rounded-sm border text-left cursor-pointer transition-all ${
                  alcanceTipo === 'individual'
                    ? 'border-[#A6192E] bg-[#A6192E]/5 ring-1 ring-[#A6192E]'
                    : 'border-[#E4E2E1] bg-white hover:bg-[#FCF9F8]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#202124] block">Nominativo</span>
                  <UserCheck size={13} className="text-slate-600" />
                </div>
                <span className="text-[10px] text-[#64748B] block leading-tight">
                  {isGerente ? 'Solo de mi sucursal' : isEncargado ? 'Encargados o mi área' : 'Cualquier colaborador'}
                </span>
                <span className="inline-block mt-1 text-[9px] font-bold text-slate-500 bg-slate-100 px-1 py-0.5 rounded">
                  Filtro puntual
                </span>
              </button>
            </div>

            {/* Sub-selector 1: TODA LA EMPRESA */}
            {alcanceTipo === 'toda_empresa' && (
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-sm space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-950">
                    Distribución Masiva Corporativa Habilitada
                  </span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Este comunicado oficial será entregado de manera obligatoria a <strong>todos los 191 colaboradores</strong> activos de Grupo Terra distribuidos en Casa Central, Sucursal Norte y Sucursal Sur.
                </p>
                <div className="flex items-center gap-4 text-[11px] text-emerald-800 pt-1">
                  <span>✓ 3 Sucursales</span>
                  <span>✓ 6 Departamentos</span>
                  <span>✓ Confirmación digital obligatoria</span>
                </div>
              </div>
            )}

            {/* Sub-selector 2: SUCURSALES */}
            {alcanceTipo === 'sucursal' && (
              <div className="p-3.5 bg-[#FCF9F8] border border-[#E4E2E1] rounded-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#202124]">
                    {isGerente ? `Sucursal autorizada para su emisión (${userSucursal.nombre}):` : 'Seleccione las sucursales destinatarias:'}
                  </span>
                  {isGerente && (
                    <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-sm font-semibold">
                      Restricción activa: Solo su sede
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {sucursales.map(s => {
                    const isMyBranch = s.id === userSucursal.id;
                    const isChecked = selectedSucursales.includes(s.id);
                    const isDisabled = isGerente && !isMyBranch;

                    return (
                      <label
                        key={s.id}
                        className={`p-2.5 rounded-sm border flex items-center justify-between text-xs transition-all ${
                          isDisabled
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                            : isChecked
                            ? 'border-[#A6192E] bg-white font-bold cursor-pointer shadow-2xs'
                            : 'border-[#E4E2E1] bg-white cursor-pointer hover:bg-[#FCF9F8]'
                        }`}
                        title={isDisabled ? 'Bloqueado: Los Gerentes de Sucursal no pueden enviar a otras sedes' : ''}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            disabled={isDisabled}
                            checked={isChecked}
                            onChange={(e) => {
                              if (isGerente) return;
                              if (e.target.checked) {
                                setSelectedSucursales([...selectedSucursales, s.id]);
                              } else {
                                setSelectedSucursales(selectedSucursales.filter(id => id !== s.id));
                              }
                            }}
                            className="accent-[#A6192E]"
                          />
                          <div>
                            <span className="block">{s.nombre.split('(')[0]}</span>
                            <span className="text-[10px] text-[#64748B] font-normal">
                              {s.ciudad} • {s.totalTrabajadores} trabajadores
                            </span>
                          </div>
                        </div>
                        {isDisabled && (
                          <span title="Restringido: solo el CEO puede enviar a esta sucursal">
                            <Lock size={13} className="text-slate-400" />
                          </span>
                        )}
                        {isChecked && isGerente && (
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                            Mi sede
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-selector 3: A ENCARGADOS DE ÁREA */}
            {alcanceTipo === 'encargados_area' && (
              <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-blue-950 block">
                      Destinatarios: Encargados de Área (Jefaturas Corporativas)
                    </span>
                    <span className="text-[11px] text-blue-800">
                      Envío directo a los líderes y encargados departamentales de todas las sucursales ({encargadosArea.length} encargados)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedEncargados(encargadosArea.map(u => u.id))}
                      className="px-2 py-1 text-[11px] font-semibold bg-white border border-blue-200 text-blue-800 hover:bg-blue-50 rounded-sm cursor-pointer"
                    >
                      Marcar Todos
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedEncargados([])}
                      className="px-2 py-1 text-[11px] font-semibold bg-white border border-blue-200 text-blue-800 hover:bg-blue-50 rounded-sm cursor-pointer"
                    >
                      Desmarcar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {encargadosArea.map(enc => {
                    const isChecked = selectedEncargados.includes(enc.id);
                    const dep = departamentos.find(d => d.id === enc.departamentoId);
                    const suc = sucursales.find(s => s.id === enc.sucursalId);

                    return (
                      <label
                        key={enc.id}
                        className={`p-2.5 rounded-sm border flex items-center justify-between text-xs cursor-pointer transition-all ${
                          isChecked
                            ? 'border-blue-600 bg-white font-semibold shadow-2xs'
                            : 'border-blue-100 bg-white/70 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedEncargados([...selectedEncargados, enc.id]);
                              } else {
                                setSelectedEncargados(selectedEncargados.filter(id => id !== enc.id));
                              }
                            }}
                            className="accent-blue-700"
                          />
                          <img
                            src={enc.avatar}
                            alt={enc.nombre}
                            className="w-7 h-7 rounded-sm object-cover border border-[#E4E2E1] shrink-0"
                          />
                          <div className="truncate">
                            <span className="font-bold text-[#202124] block truncate">{enc.nombre}</span>
                            <span className="text-[10px] text-[#64748B] block truncate">
                              {enc.cargo} • {dep?.nombre} ({suc?.ciudad})
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded shrink-0">
                          Encargado
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-selector 4: DEPARTAMENTOS */}
            {alcanceTipo === 'departamento' && (
              <div className="p-3.5 bg-[#FCF9F8] border border-[#E4E2E1] rounded-sm space-y-2">
                <span className="text-xs font-bold text-[#202124] block">
                  {isEncargado 
                    ? `Departamento asignado bajo su jefatura:` 
                    : isGerente 
                    ? `Departamentos operativos en su sede (${userSucursal.nombre.split('(')[0]}):` 
                    : 'Seleccione los departamentos destinatarios:'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {departamentos
                    .filter(d => !isGerente || userSucursal.departamentosIds.includes(d.id))
                    .map(d => {
                      const isMyDepto = d.id === userDepto.id;
                      const isChecked = selectedDepartamentos.includes(d.id);
                      const isLockedForEncargado = isEncargado && !isMyDepto;

                      return (
                        <label
                          key={d.id}
                          className={`p-2.5 rounded-sm border flex items-center justify-between text-xs transition-all ${
                            isLockedForEncargado
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                              : isChecked
                              ? 'border-[#A6192E] bg-white font-bold cursor-pointer shadow-2xs'
                              : 'border-[#E4E2E1] bg-white cursor-pointer hover:bg-[#FCF9F8]'
                          }`}
                          title={isLockedForEncargado ? 'Bloqueado: Los Encargados de Área no pueden emitir a otros departamentos' : ''}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <input
                              type="checkbox"
                              disabled={isLockedForEncargado}
                              checked={isChecked}
                              onChange={(e) => {
                                if (isEncargado) return;
                                if (e.target.checked) {
                                  setSelectedDepartamentos([...selectedDepartamentos, d.id]);
                                } else {
                                  setSelectedDepartamentos(selectedDepartamentos.filter(id => id !== d.id));
                                }
                              }}
                              className="accent-[#A6192E]"
                            />
                            <div className="truncate">
                              <span className="truncate block">{d.nombre}</span>
                              <span className="text-[10px] text-[#64748B] font-normal">
                                {d.totalTrabajadores} operarios
                              </span>
                            </div>
                          </div>
                          {isLockedForEncargado && (
                            <span title="Restringido">
                              <Lock size={12} className="text-slate-400" />
                            </span>
                          )}
                          {isMyDepto && isEncargado && (
                            <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1 py-0.5 rounded">
                              Mi área
                            </span>
                          )}
                        </label>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Sub-selector 5: TRABAJADORES NOMINATIVOS */}
            {alcanceTipo === 'individual' && (
              <div className="p-3.5 bg-[#FCF9F8] border border-[#E4E2E1] rounded-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#202124] block">
                    {isEncargado 
                      ? `Colaboradores autorizados (Encargados de Área o personal de ${userDepto.nombre}):` 
                      : isGerente 
                      ? `Colaboradores de su sede (${userSucursal.nombre.split('(')[0]}):` 
                      : 'Seleccione trabajadores destinatarios:'}
                  </span>
                  <span className="text-[11px] text-[#64748B]">
                    {selectedUsuarios.length} seleccionados
                  </span>
                </div>
                <div className="max-h-52 overflow-y-auto space-y-1.5 border border-[#E4E2E1] bg-white p-2 rounded-sm">
                  {usuarios
                    .filter(u => {
                      if (isEncargado) {
                        // Can select other encargados or people from their department
                        return u.rolKey === 'encargado_depto' || u.departamentoId === userDepto.id;
                      }
                      if (isGerente) {
                        // Strictly within their sucursal
                        return u.sucursalId === userSucursal.id;
                      }
                      return true;
                    })
                    .map(u => {
                      const isChecked = selectedUsuarios.includes(u.id);
                      const isEnc = u.rolKey === 'encargado_depto';
                      return (
                        <label key={u.id} className="flex items-center justify-between p-1.5 hover:bg-[#FCF9F8] rounded text-xs cursor-pointer">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUsuarios([...selectedUsuarios, u.id]);
                                } else {
                                  setSelectedUsuarios(selectedUsuarios.filter(id => id !== u.id));
                                }
                              }}
                              className="accent-[#A6192E]"
                            />
                            <img
                              src={u.avatar}
                              alt={u.nombre}
                              className="w-5 h-5 rounded-full object-cover border border-[#E4E2E1]"
                            />
                            <span className="font-semibold text-[#202124]">{u.nombre}</span>
                            <span className="text-[#64748B]">({u.cargo})</span>
                          </div>
                          {isEnc && (
                            <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1 py-0.5 rounded">
                              Encargado Área
                            </span>
                          )}
                        </label>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: PROGRAMACIÓN Y ACCIONES */}
        <div className="bg-white border border-[#E4E2E1] rounded-sm p-5 space-y-4 shadow-2xs">
          <div className="border-b border-[#E4E2E1] pb-2 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#202124] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-sm bg-[#A6192E] text-white flex items-center justify-center text-[10px]">4</span>
              Opciones de Publicación
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isScheduled}
                onChange={(e) => setIsScheduled(e.target.checked)}
                className="accent-[#A6192E]"
              />
              <span className="text-xs font-bold text-[#202124]">Programar para emisión automática en fecha futura</span>
            </label>

            {isScheduled && (
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-[#64748B]" />
                <input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="px-2 py-1 rounded-sm border border-[#E4E2E1] text-xs font-medium"
                />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-[#E4E2E1] flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="px-4 py-2 rounded-sm border border-[#E4E2E1] bg-white text-xs font-semibold text-[#202124] hover:bg-[#F6F3F2] flex items-center gap-1.5 cursor-pointer"
            >
              <Eye size={14} className="text-[#64748B]" />
              <span>Vista Previa Completa</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmPublishType('borrador');
                  setShowConfirmModal(true);
                }}
                className="px-4 py-2 rounded-sm border border-slate-300 text-xs font-semibold text-[#64748B] hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
              >
                <Save size={14} />
                <span>Guardar Borrador</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setConfirmPublishType(isScheduled ? 'programado' : 'publicado');
                  setShowConfirmModal(true);
                }}
                className="px-5 py-2 rounded-sm bg-[#A6192E] hover:bg-[#871326] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Send size={14} />
                <span>{isScheduled ? 'Programar Envío' : 'Publicar Inmediatamente'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL BEFORE PUBLISH */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#E4E2E1] rounded-sm shadow-xl w-full max-w-lg p-5 text-[#202124] space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-sm bg-[#A6192E]/10 text-[#A6192E]">
                <Send size={22} />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
                  Confirmar Emisión Oficial de Comunicado
                </h3>
                <p className="text-[11px] text-[#64748B]">
                  Revise los parámetros de distribución antes del despacho.
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#FCF9F8] border border-[#E4E2E1] rounded-sm space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Título:</span>
                <span className="font-bold text-[#202124] max-w-xs truncate">{titulo || 'Sin título'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Prioridad:</span>
                <span className="font-bold uppercase text-[#A6192E]">{prioridad}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Destinatarios estimados:</span>
                <span className="font-bold text-emerald-700">~{estimatedRecipients} colaboradores</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Archivos:</span>
                <span>{imagenes.length} imagen(es), {pdfs.length} PDF(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Acción:</span>
                <span className="font-bold uppercase">{confirmPublishType}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#64748B]">
              Al confirmar, los colaboradores recibirán la notificación institucional y se activará el registro de confirmaciones en auditoría.
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E4E2E1]">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-3 py-1.5 rounded-sm border border-[#E4E2E1] text-xs font-semibold text-[#64748B] hover:bg-[#F6F3F2]"
              >
                Volver al Formulario
              </button>
              <button
                type="button"
                onClick={() => executePublish(confirmPublishType)}
                className="px-4 py-1.5 rounded-sm bg-[#A6192E] hover:bg-[#871326] text-white text-xs font-bold"
              >
                Confirmar y Emitir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL LIVE PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-[#E4E2E1] rounded-sm shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E2E1]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A6192E]">
                  VISTA PREVIA DEL RECEPTOR
                </span>
                <h3 className="text-sm font-bold text-[#202124]">
                  Así visualizarán los trabajadores este comunicado oficial
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1 text-[#64748B] hover:text-[#202124]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Preview Banner */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-sm text-tiny font-bold uppercase bg-[#A6192E] text-white">
                  {prioridad}
                </span>
                <span className="text-xs text-[#64748B]">Emisión Oficial Grupo Terra</span>
              </div>

              <h2 className="text-lg font-black text-[#202124]">{titulo || 'Título del Comunicado'}</h2>

              {imagenes.length > 0 && (
                <img
                  src={imagenes[0].url}
                  alt="Portada"
                  className="w-full h-64 object-cover rounded-sm border border-[#E4E2E1]"
                />
              )}

              <div
                className="text-xs text-[#202124] leading-relaxed border-t border-b border-[#E4E2E1] py-4"
                dangerouslySetInnerHTML={{ __html: cuerpoHtml }}
              />

              {pdfs.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
                    Documentos Oficiales Adjuntos:
                  </h4>
                  <div className="space-y-1.5">
                    {pdfs.map(p => (
                      <div key={p.id} className="p-2 border border-[#E4E2E1] rounded-sm flex items-center gap-2 text-xs">
                        <FileText size={15} className="text-[#A6192E]" />
                        <span className="font-semibold">{p.nombre}</span>
                        <span className="text-[10px] text-[#64748B]">({p.tamano})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#E4E2E1] flex justify-end">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-1.5 rounded-sm bg-[#A6192E] text-white text-xs font-bold"
              >
                Cerrar Vista Previa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
