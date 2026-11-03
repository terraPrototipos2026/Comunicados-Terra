import React from 'react';
import { useApp } from '../context/AppContext';
import { ComunicadosListView } from './ComunicadosListView';
import { CrearComunicadoView } from './CrearComunicadoView';
import { FileText, PlusCircle } from 'lucide-react';

export const ComunicadosView: React.FC = () => {
  const {
    activeRole,
    comunicados,
    comunicadosTab,
    setComunicadosTab,
    setCurrentView,
  } = useApp();

  const isWorker = activeRole === 'trabajador';
  const canCreate = !isWorker;

  // Pending urgent count for badge
  const pendingUrgents = comunicados.filter(
    (c) => c.prioridad === 'urgente' && c.estado === 'publicado'
  ).length;

  return (
    <div className="space-y-5">
      {/* Blueprint 1: Tab Navigation Bar */}
      <div className="flex items-center border-b border-[#E4E2E1] gap-1 sm:gap-2">
        <button
          onClick={() => setComunicadosTab('list')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            comunicadosTab === 'list'
              ? 'border-[#A6192E] text-[#A6192E]'
              : 'border-transparent text-[#64748B] hover:text-[#202124]'
          }`}
        >
          <FileText size={15} />
          <span>{isWorker ? 'Mis Comunicados' : 'Listado de Comunicados'}</span>
          <span
            className={`ml-1 px-1.5 py-0.5 rounded-xs text-[10px] font-bold ${
              comunicadosTab === 'list'
                ? 'bg-[#A6192E]/10 text-[#A6192E]'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {comunicados.length}
          </span>
          {pendingUrgents > 0 && (
            <span className="px-1.5 py-0.5 rounded-xs text-[10px] font-bold bg-[#DC2626] text-white">
              {pendingUrgents} {pendingUrgents === 1 ? 'urgente' : 'urgentes'}
            </span>
          )}
        </button>

        {canCreate && (
          <button
            onClick={() => setComunicadosTab('create')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              comunicadosTab === 'create'
                ? 'border-[#A6192E] text-[#A6192E]'
                : 'border-transparent text-[#64748B] hover:text-[#202124]'
            }`}
          >
            <PlusCircle size={15} />
            <span>+ Redactar Comunicado</span>
          </button>
        )}
      </div>

      {/* Tab Panels */}
      {comunicadosTab === 'list' ? (
        <ComunicadosListView
          onNavigateToCreate={() => setComunicadosTab('create')}
          hideHeader={false}
        />
      ) : canCreate ? (
        <CrearComunicadoView
          onCancel={() => setComunicadosTab('list')}
          onSuccess={(newId) => setCurrentView('detalle-comunicado', newId)}
        />
      ) : (
        <ComunicadosListView
          onNavigateToCreate={() => setComunicadosTab('create')}
          hideHeader={false}
        />
      )}
    </div>
  );
};

