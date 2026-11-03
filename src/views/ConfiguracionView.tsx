import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Type,
  LayoutGrid,
  Eye,
  Sliders,
  RotateCcw,
  CheckCircle2,
  Volume2,
  Server,
  Sparkles,
  Check,
  ZoomIn,
  HelpCircle,
  FileText,
  Play
} from 'lucide-react';
import { EscalaFuente, DensidadUI, FamiliaTipografica } from '../types';

export const ConfiguracionView: React.FC = () => {
  const { configuracion, updateConfiguracion, restablecerConfiguracion, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'fuentes' | 'componentes' | 'accesibilidad' | 'sistema'>('fuentes');
  const [mensajeGuardado, setMensajeGuardado] = useState<string | null>(null);
  const [sonidoReproduciendo, setSonidoReproduciendo] = useState(false);

  const opcionesFuente: { id: EscalaFuente; label: string; porcentaje: number; desc: string; ejemplo: string }[] = [
    { id: 'pequena', label: 'Compacta', porcentaje: 90, desc: '90% - Máxima densidad de información', ejemplo: 'Vista para analistas de datos' },
    { id: 'normal', label: 'Estándar', porcentaje: 100, desc: '100% - Escala oficial corporativa', ejemplo: 'Lectura estándar en monitores' },
    { id: 'mediana', label: 'Mediana', porcentaje: 115, desc: '115% - Incremento de legibilidad (+15%)', ejemplo: 'Mayor comodidad visual diaria' },
    { id: 'grande', label: 'Grande', porcentaje: 130, desc: '130% - Accesibilidad visual (+30%)', ejemplo: 'Recomendado para lectura a distancia' },
    { id: 'extragrande', label: 'Extra Grande', porcentaje: 145, desc: '145% - Máxima accesibilidad (+45%)', ejemplo: 'Kioscos táctiles y baja visión' },
  ];

  const opcionesDensidad: { id: DensidadUI; label: string; desc: string; padding: string }[] = [
    { id: 'compacta', label: 'Alta Densidad', desc: 'Espacios reducidos, tablas densas y botones compactos (30px)', padding: 'Padding -35%' },
    { id: 'normal', label: 'Equilibrada', desc: 'Espaciado corporativo estándar de TerraComms (38px)', padding: 'Padding 100%' },
    { id: 'comoda', label: 'Cómoda', desc: 'Controles más amplios y holgados con mayor separación (44px)', padding: 'Padding +25%' },
    { id: 'tactil', label: 'Táctil / Kiosco', desc: 'Objetivos de toque mínimo de 48px para pantallas táctiles', padding: 'Padding +50%' },
  ];

  const opcionesFamilia: { id: FamiliaTipografica; label: string; desc: string; preview: string }[] = [
    { id: 'inter', label: 'Inter Corporate', desc: 'Fuente geométrica moderna oficial de Grupo Terra', preview: 'Terra Comunicados 123' },
    { id: 'atkinson', label: 'Atkinson Legible', desc: 'Diseñada por el Instituto Braille para máxima distinción de letras', preview: 'Terra Comunicados 123' },
    { id: 'roboto', label: 'Roboto Clean', desc: 'Fuente neutral con excelente renderizado en alta densidad', preview: 'Terra Comunicados 123' },
    { id: 'mono', label: 'Técnica / Monospace', desc: 'Ideal para códigos de comunicados, RUTs y trazabilidad', preview: 'COM-2026-092' },
  ];

  const handleGuardar = () => {
    setMensajeGuardado('Preferencias de visualización y sistema aplicadas y guardadas correctamente.');
    setTimeout(() => setMensajeGuardado(null), 3500);
  };

  const handleProbarAudio = () => {
    try {
      setSonidoReproduciendo(true);
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5

      const vol = (configuracion.volumenSonido / 100) * 0.35;
      gain.gain.setValueAtTime(vol, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.38);

      setTimeout(() => setSonidoReproduciendo(false), 400);
    } catch {
      setSonidoReproduciendo(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E4E2E1]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#A6192E]/10 rounded-sm text-[#A6192E]">
              <Settings size={20} />
            </div>
            <h1 className="text-base font-bold text-[#202124] uppercase tracking-wider">
              Configuración del Sistema y Accesibilidad
            </h1>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Personaliza el tamaño de fuentes, la escala de componentes, densidad visual y parámetros de comunicación.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={restablecerConfiguracion}
            className="px-3 py-1.5 rounded-sm border border-[#E4E2E1] bg-white hover:bg-[#F6F3F2] text-xs font-semibold text-[#64748B] hover:text-[#202124] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Restablecer todos los ajustes a los valores por defecto del sistema"
          >
            <RotateCcw size={13} />
            <span>Restablecer</span>
          </button>

          <button
            onClick={handleGuardar}
            className="px-4 py-1.5 rounded-sm bg-[#A6192E] hover:bg-[#871326] text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Check size={14} />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>

      {/* Alert Banner if Saved */}
      {mensajeGuardado && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#16A34A]" />
            <span>{mensajeGuardado}</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-mono">Persistido en navegador</span>
        </div>
      )}

      {/* Current Configuration Summary Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white border border-[#E4E2E1] p-2.5 rounded-sm flex items-center gap-2.5 shadow-2xs">
          <div className="p-2 rounded-sm bg-slate-100 text-[#202124]">
            <Type size={16} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">Escala de Texto</span>
            <span className="text-xs font-black text-[#A6192E] capitalize">
              {configuracion.escalaFuente} ({configuracion.porcentajeFuente}%)
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#E4E2E1] p-2.5 rounded-sm flex items-center gap-2.5 shadow-2xs">
          <div className="p-2 rounded-sm bg-slate-100 text-[#202124]">
            <LayoutGrid size={16} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">Densidad UI</span>
            <span className="text-xs font-black text-[#202124] capitalize">
              {configuracion.densidadUI}
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#E4E2E1] p-2.5 rounded-sm flex items-center gap-2.5 shadow-2xs">
          <div className="p-2 rounded-sm bg-slate-100 text-[#202124]">
            <Eye size={16} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">Tema Visual</span>
            <span className="text-xs font-black text-[#202124] capitalize">
              {configuracion.modoVisual.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#E4E2E1] p-2.5 rounded-sm flex items-center gap-2.5 shadow-2xs">
          <div className="p-2 rounded-sm bg-slate-100 text-[#202124]">
            <Server size={16} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">Infraestructura</span>
            <span className="text-xs font-black text-[#16A34A]">
              On-Premise Local
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="border-b border-[#E4E2E1] flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('fuentes')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'fuentes'
              ? 'border-[#A6192E] text-[#A6192E] bg-white'
              : 'border-transparent text-[#64748B] hover:text-[#202124] hover:bg-slate-50'
          }`}
        >
          <Type size={15} />
          <span>Tipografía y Fuentes</span>
        </button>

        <button
          onClick={() => setActiveTab('componentes')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'componentes'
              ? 'border-[#A6192E] text-[#A6192E] bg-white'
              : 'border-transparent text-[#64748B] hover:text-[#202124] hover:bg-slate-50'
          }`}
        >
          <LayoutGrid size={15} />
          <span>Componentes y Densidad</span>
        </button>

        <button
          onClick={() => setActiveTab('accesibilidad')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'accesibilidad'
              ? 'border-[#A6192E] text-[#A6192E] bg-white'
              : 'border-transparent text-[#64748B] hover:text-[#202124] hover:bg-slate-50'
          }`}
        >
          <Eye size={15} />
          <span>Accesibilidad y Contraste</span>
        </button>

        <button
          onClick={() => setActiveTab('sistema')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'sistema'
              ? 'border-[#A6192E] text-[#A6192E] bg-white'
              : 'border-transparent text-[#64748B] hover:text-[#202124] hover:bg-slate-50'
          }`}
        >
          <Sliders size={15} />
          <span>Notificaciones y Red</span>
        </button>
      </div>

      {/* Main Content: Split with Live Interactive Preview Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* TAB 1: FUENTES Y TIPOGRAFÍA */}
          {activeTab === 'fuentes' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Escala de Tamaño */}
              <div className="bg-white border border-[#E4E2E1] p-4 rounded-sm shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ZoomIn size={16} className="text-[#A6192E]" />
                    <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
                      Tamaño Global de Fuente ({configuracion.porcentajeFuente}%)
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono text-[#64748B]">
                    Afecta todo el texto del sistema
                  </span>
                </div>

                <p className="text-xs text-[#64748B]">
                  Ajusta el tamaño base de las fuentes de la aplicación. Al aumentarla, todo el contenido, comunicados, tablas y formularios se redimensionan armónicamente.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
                  {opcionesFuente.map((op) => {
                    const isSelected = configuracion.escalaFuente === op.id;
                    return (
                      <button
                        key={op.id}
                        onClick={() => updateConfiguracion({ escalaFuente: op.id, porcentajeFuente: op.porcentaje })}
                        className={`p-3 rounded-sm border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#A6192E]/5 border-[#A6192E] text-[#A6192E] shadow-2xs ring-1 ring-[#A6192E]'
                            : 'bg-white border-[#E4E2E1] hover:border-slate-400 text-[#202124]'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="font-bold text-xs">{op.label}</span>
                          {isSelected && <Check size={13} className="text-[#A6192E]" />}
                        </div>
                        <span className="text-sm font-extrabold block">{op.porcentaje}%</span>
                        <span className="text-[10px] text-[#64748B] mt-1 leading-tight line-clamp-2">
                          {op.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Familia Tipográfica */}
              <div className="bg-white border border-[#E4E2E1] p-4 rounded-sm shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <Type size={16} className="text-[#A6192E]" />
                  <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
                    Familia Tipográfica
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {opcionesFamilia.map((f) => {
                    const isSelected = configuracion.familiaTipografica === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => updateConfiguracion({ familiaTipografica: f.id })}
                        className={`p-3 rounded-sm border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#A6192E]/5 border-[#A6192E] ring-1 ring-[#A6192E]'
                            : 'bg-white border-[#E4E2E1] hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-[#202124]">{f.label}</span>
                          {isSelected && <Check size={14} className="text-[#A6192E]" />}
                        </div>
                        <p className="text-[11px] text-[#64748B] mb-2">{f.desc}</p>
                        <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-xs text-xs text-[#202124] font-medium truncate">
                          {f.preview}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Refuerzo de Peso Tipográfico */}
              <div className="bg-white border border-[#E4E2E1] p-4 rounded-sm shadow-2xs flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#202124] block">
                    Refuerzo de Peso y Trazos (Negrita Aumentada)
                  </span>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    Engrosa levemente las fuentes para personas con dificultades de lectura en pantallas brillantes.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={configuracion.pesoFuenteAumentado}
                    onChange={(e) => updateConfiguracion({ pesoFuenteAumentado: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#A6192E]"></div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: COMPONENTES Y DENSIDAD */}
          {activeTab === 'componentes' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Densidad de Componentes */}
              <div className="bg-white border border-[#E4E2E1] p-4 rounded-sm shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <LayoutGrid size={16} className="text-[#A6192E]" />
                  <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
                    Densidad y Espaciado de Componentes
                  </h2>
                </div>
                <p className="text-xs text-[#64748B]">
                  Controla la altura de los botones, el padding interno de las tablas y el espacio entre filas para optimizar la vista a tu forma de trabajo o dispositivo.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {opcionesDensidad.map((d) => {
                    const isSelected = configuracion.densidadUI === d.id;
                    return (
                      <button
                        key={d.id}
                        onClick={() => updateConfiguracion({ densidadUI: d.id })}
                        className={`p-3 rounded-sm border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#A6192E]/5 border-[#A6192E] ring-1 ring-[#A6192E]'
                            : 'bg-white border-[#E4E2E1] hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-[#202124]">{d.label}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-slate-100 text-[#64748B] font-mono">
                            {d.padding}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748B]">{d.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tamaño de Botones */}
              <div className="bg-white border border-[#E4E2E1] p-4 rounded-sm shadow-2xs space-y-3">
                <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
                  Escala de Botones y Controles de Acción
                </h2>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['normal', 'grande', 'extragrande'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => updateConfiguracion({ tamanoBotones: t })}
                      className={`p-2.5 rounded-sm border text-center transition-all cursor-pointer ${
                        configuracion.tamanoBotones === t
                          ? 'bg-[#A6192E] text-white font-bold border-[#A6192E]'
                          : 'bg-white border-[#E4E2E1] hover:border-slate-400 text-[#202124]'
                      }`}
                    >
                      <span className="text-xs capitalize">{t === 'normal' ? 'Estándar' : t === 'grande' ? 'Aumentado' : 'Máximo'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tamaño de Iconos */}
              <div className="bg-white border border-[#E4E2E1] p-4 rounded-sm shadow-2xs space-y-3">
                <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
                  Tamaño de Iconos de Navegación y Acciones
                </h2>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['normal', 'mediano', 'grande'] as const).map((ti) => (
                    <button
                      key={ti}
                      onClick={() => updateConfiguracion({ tamanoIconos: ti })}
                      className={`p-2.5 rounded-sm border text-center transition-all cursor-pointer ${
                        configuracion.tamanoIconos === ti
                          ? 'bg-[#A6192E] text-white font-bold border-[#A6192E]'
                          : 'bg-white border-[#E4E2E1] hover:border-slate-400 text-[#202124]'
                      }`}
                    >
                      <span className="text-xs capitalize">{ti === 'normal' ? 'Normal (18px)' : ti === 'mediano' ? 'Mediano (22px)' : 'Grande (26px)'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bordes Acentuados */}
              <div className="bg-white border border-[#E4E2E1] p-4 rounded-sm shadow-2xs flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#202124] block">
                    Bordes Estructurados y Marcados (2px)
                  </span>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    Refuerza las líneas divisorias entre tarjetas, tablas y paneles según los estándares de diseño empresarial.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={configuracion.bordesAcentuados}
                    onChange={(e) => updateConfiguracion({ bordesAcentuados: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#A6192E]"></div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: ACCESIBILIDAD Y CONTRASTE */}
          {activeTab === 'accesibilidad' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Modo Visual */}
              <div className="bg-white border border-[#E4E2E1] p-4 rounded-sm shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-[#A6192E]" />
                  <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
                    Modo de Contraste y Tema
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => updateConfiguracion({ modoVisual: 'corporativo' })}
                    className={`p-3 rounded-sm border text-left transition-all cursor-pointer ${
                      configuracion.modoVisual === 'corporativo'
                        ? 'border-[#A6192E] bg-[#A6192E]/5 ring-1 ring-[#A6192E]'
                        : 'border-[#E4E2E1] bg-white hover:border-slate-400'
                    }`}
                  >
                    <span className="font-bold text-xs text-[#202124] block mb-1">Corporativo Terra</span>
                    <span className="text-[10px] text-[#64748B] block">Gama oficial blanca, gris pizarra y granate</span>
                  </button>

                  <button
                    onClick={() => updateConfiguracion({ modoVisual: 'alto_contraste' })}
                    className={`p-3 rounded-sm border text-left transition-all cursor-pointer ${
                      configuracion.modoVisual === 'alto_contraste'
                        ? 'border-[#A6192E] bg-[#A6192E]/5 ring-1 ring-[#A6192E]'
                        : 'border-[#E4E2E1] bg-white hover:border-slate-400'
                    }`}
                  >
                    <span className="font-bold text-xs text-[#202124] block mb-1">Alto Contraste</span>
                    <span className="text-[10px] text-[#64748B] block">Bordes negros nítidos y contraste máximo</span>
                  </button>

                  <button
                    onClick={() => updateConfiguracion({ modoVisual: 'oscuro_suave' })}
                    className={`p-3 rounded-sm border text-left transition-all cursor-pointer ${
                      configuracion.modoVisual === 'oscuro_suave'
                        ? 'border-[#A6192E] bg-[#A6192E]/5 ring-1 ring-[#A6192E]'
                        : 'border-[#E4E2E1] bg-white hover:border-slate-400'
                    }`}
                  >
                    <span className="font-bold text-xs text-[#202124] block mb-1">Oscuro Slate</span>
                    <span className="text-[10px] text-[#64748B] block">Ideal para ambientes con poca luz y fatiga visual</span>
                  </button>
                </div>
              </div>

              {/* Opciones Accesibilidad Checkboxes */}
              <div className="bg-white border border-[#E4E2E1] p-4 rounded-sm shadow-2xs space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#202124] block">
                      Reducir Animaciones y Transiciones
                    </span>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Desactiva efectos visuales y movimientos rápidos para evitar distracciones o mareo por movimiento.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={configuracion.reducirAnimaciones}
                      onChange={(e) => updateConfiguracion({ reducirAnimaciones: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#A6192E]"></div>
                  </label>
                </div>

                <div className="border-t border-[#E4E2E1] pt-3 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#202124] block">
                      Resaltar Enlaces y Elementos Clickeables
                    </span>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Subraya los hipervínculos y aplica un contorno de foco de alto contraste al navegar con teclado (Tab).
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={configuracion.resaltarElementosInteractivos}
                      onChange={(e) => updateConfiguracion({ resaltarElementosInteractivos: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#A6192E]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SISTEMA Y NOTIFICACIONES */}
          {activeTab === 'sistema' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Alertas Sonoras */}
              <div className="bg-white border border-[#E4E2E1] p-4 rounded-sm shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 size={16} className="text-[#A6192E]" />
                    <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
                      Alertas Sonoras para Comunicados Urgentes
                    </h2>
                  </div>
                  <button
                    onClick={handleProbarAudio}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-sm text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Play size={12} className={sonidoReproduciendo ? 'text-[#A6192E] animate-pulse' : ''} />
                    <span>Probar Tono</span>
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-[#202124] block">
                      Reproducir tono acústico en alertas críticas
                    </span>
                    <p className="text-[11px] text-[#64748B]">
                      Notifica con aviso sonoro cuando un comunicado clasificado como URGENTE es recibido en el panel.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={configuracion.sonidoAlertasUrgentes}
                      onChange={(e) => updateConfiguracion({ sonidoAlertasUrgentes: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#A6192E]"></div>
                  </label>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#64748B]">Volumen de notificación:</span>
                    <span className="font-bold text-[#202124]">{configuracion.volumenSonido}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={configuracion.volumenSonido}
                    onChange={(e) => updateConfiguracion({ volumenSonido: Number(e.target.value) })}
                    className="w-full accent-[#A6192E] cursor-pointer"
                  />
                </div>
              </div>

              {/* Intervalo de Actualización */}
              <div className="bg-white border border-[#E4E2E1] p-4 rounded-sm shadow-2xs space-y-3">
                <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
                  Frecuencia de Sincronización en Segundo Plano
                </h2>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 60, 120].map((seg) => (
                    <button
                      key={seg}
                      onClick={() => updateConfiguracion({ intervaloActualizacionSegundos: seg })}
                      className={`p-2.5 rounded-sm border text-center transition-all cursor-pointer ${
                        configuracion.intervaloActualizacionSegundos === seg
                          ? 'bg-[#A6192E] text-white font-bold border-[#A6192E]'
                          : 'bg-white border-[#E4E2E1] hover:border-slate-400 text-[#202124]'
                      }`}
                    >
                      <span className="text-xs">{seg} seg</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Configuración On-Premise */}
              <div className="bg-white border border-[#E4E2E1] p-4 rounded-sm shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <Server size={16} className="text-[#16A34A]" />
                  <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
                    Servidor Broker Local (On-Premise)
                  </h2>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#64748B] block">Dirección IP Host Local:</label>
                  <input
                    type="text"
                    value={configuracion.direccionIpServidor}
                    onChange={(e) => updateConfiguracion({ direccionIpServidor: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-sm border border-[#E4E2E1] bg-[#FCF9F8] text-xs font-mono text-[#202124] focus:outline-none focus:border-[#A6192E]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Interactive Preview Canvas (Right Column) */}
        <div className="lg:col-span-5 space-y-3 sticky top-16">
          <div className="flex items-center justify-between pb-1 border-b border-[#E4E2E1]">
            <div className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#A6192E]" />
              <span className="text-xs font-bold text-[#202124] uppercase tracking-wider">
                Previsualización en Vivo
              </span>
            </div>
            <span className="text-[10px] bg-[#A6192E]/10 text-[#A6192E] px-2 py-0.5 rounded-sm font-bold">
              Escala: {configuracion.porcentajeFuente}%
            </span>
          </div>

          <div className="p-4 bg-white border border-[#E4E2E1] rounded-sm shadow-sm space-y-3">
            {/* Mock Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#E4E2E1]">
              <span className="text-[10px] font-bold text-[#DC2626] uppercase px-1.5 py-0.5 bg-red-50 border border-red-200 rounded-sm">
                Prioridad Urgente
              </span>
              <span className="text-[10px] text-[#64748B] font-mono">COM-2026-094</span>
            </div>

            {/* Mock Title & Content */}
            <div>
              <h3 className="text-sm font-bold text-[#202124] leading-snug">
                Mantenimiento de Servidores y Protocolo de Turnos
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Este es un ejemplo en tiempo real de cómo los colaboradores y gerentes verán los comunicados con la escala y fuente seleccionadas.
              </p>
            </div>

            {/* Mock Action Controls */}
            <div className="pt-2 flex items-center gap-2">
              <button
                className={`px-3 py-1.5 rounded-sm bg-[#A6192E] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs ${
                  configuracion.tamanoBotones === 'extragrande' ? 'py-3 text-sm' : configuracion.tamanoBotones === 'grande' ? 'py-2' : ''
                }`}
              >
                <Check size={14} />
                <span>Confirmar Lectura</span>
              </button>

              <button
                className={`px-3 py-1.5 rounded-sm border border-[#E4E2E1] bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 ${
                  configuracion.tamanoBotones === 'extragrande' ? 'py-3 text-sm' : configuracion.tamanoBotones === 'grande' ? 'py-2' : ''
                }`}
              >
                <FileText size={14} />
                <span>Descargar PDF</span>
              </button>
            </div>

            {/* Mock Data Table Row */}
            <div className="pt-2 border-t border-[#E4E2E1]">
              <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                Trazabilidad y confirmación:
              </div>
              <div className="p-2 rounded-sm bg-[#FCF9F8] border border-[#E4E2E1] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#202124]">{currentUser.nombre}</span>
                <span className="px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Lectura Verificada
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-sm text-xs text-amber-900 flex items-start gap-2">
            <HelpCircle size={15} className="shrink-0 text-amber-600 mt-0.5" />
            <p className="text-[11px] leading-tight">
              Los cambios en la escala de fuentes y densidad se almacenan localmente y persistirán automáticamente cada vez que inicies sesión en cualquier sucursal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
