import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { ComunicadosView } from './views/ComunicadosView';
import { DetalleComunicadoView } from './views/DetalleComunicadoView';
import { SeguimientoLecturaView } from './views/SeguimientoLecturaView';
import { SucursalesView } from './views/SucursalesView';
import { DepartamentosView } from './views/DepartamentosView';
import { UsuariosView } from './views/UsuariosView';
import { RolesPermisosView } from './views/RolesPermisosView';
import { CentroNotificacionesView } from './views/CentroNotificacionesView';
import { AuditoriaView } from './views/AuditoriaView';
import { ConfiguracionView } from './views/ConfiguracionView';

const MainLayout: React.FC = () => {
  const { isLoggedIn, currentView } = useApp();

  if (!isLoggedIn) {
    return <LoginView />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'comunicados':
      case 'crear-comunicado':
        return <ComunicadosView />;
      case 'detalle-comunicado':
        return <DetalleComunicadoView />;
      case 'seguimiento':
        return <SeguimientoLecturaView />;
      case 'sucursales':
        return <SucursalesView />;
      case 'departamentos':
        return <DepartamentosView />;
      case 'usuarios':
        return <UsuariosView />;
      case 'roles':
        return <RolesPermisosView />;
      case 'notificaciones':
        return <CentroNotificacionesView />;
      case 'auditoria':
        return <AuditoriaView />;
      case 'configuracion':
        return <ConfiguracionView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FCF9F8] font-['Inter',sans-serif]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TopBar */}
        <TopBar />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
