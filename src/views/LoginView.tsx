import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RoleKey } from '../types';
import { Eye, EyeOff, Lock, Mail, Megaphone, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('ivalenzuela@terraempresa.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const quickLogins: { label: string; email: string; role: RoleKey; desc: string }[] = [
    { label: 'Administrador (CEO)', email: 'ivalenzuela@terraempresa.com', role: 'admin_ceo', desc: 'Acceso total y auditoría' },
    { label: 'Gerente Sucursal', email: 'cmendoza@terraempresa.com', role: 'gerente_sucursal', desc: 'Sucursal Central' },
    { label: 'Recursos Humanos', email: 'csepulveda@terraempresa.com', role: 'rrhh', desc: 'Gestión de personal' },
    { label: 'Encargado Depto.', email: 'mbarraza@terraempresa.com', role: 'encargado_depto', desc: 'Jefe de Operaciones' },
    { label: 'Trabajador / Operario', email: 'bestay@terraempresa.com', role: 'trabajador', desc: 'Planta Norte - Solo lectura y confirmación' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Ingrese un correo corporativo válido (@terraempresa.com).');
      return;
    }
    setErrorMsg('');
    login(email);
  };

  const handleQuickLogin = (emailAddress: string) => {
    login(emailAddress);
  };

  return (
    <div className="min-h-screen bg-[#FCF9F8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Inter',sans-serif]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-sm bg-[#A6192E] flex items-center justify-center text-white shadow-sm mb-3">
            <Megaphone size={26} />
          </div>
          <h2 className="text-center text-2xl font-black text-[#202124] tracking-tight">
            TERRA<span className="text-[#A6192E]">COMMS</span>
          </h2>
          <p className="mt-1 text-center text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            Sistema de Gestión y Notificación de Comunicados
          </p>
          <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold bg-[#F6F3F2] border border-[#E4E2E1] text-[#64748B]">
            Acceso Privado Corporativo • Infraestructura Propia
          </span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-8 border border-[#E4E2E1] rounded-sm shadow-sm">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-sm bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Correo Electrónico Corporativo <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <Mail size={15} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@terraempresa.com"
                  className="w-full pl-9 pr-3 py-2 rounded-sm text-xs font-medium border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none focus:border-[#A6192E] focus:ring-1 focus:ring-[#A6192E]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-tiny font-bold uppercase tracking-wider text-[#64748B]">
                  Contraseña <span className="text-[#DC2626]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowRecoveryModal(true)}
                  className="text-[11px] font-semibold text-[#A6192E] hover:underline cursor-pointer"
                >
                  ¿Olvidó su contraseña?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <Lock size={15} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2 rounded-sm text-xs font-medium border border-[#E4E2E1] bg-white text-[#202124] focus:outline-none focus:border-[#A6192E] focus:ring-1 focus:ring-[#A6192E]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748B] hover:text-[#202124] cursor-pointer"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-sm bg-[#A6192E] hover:bg-[#871326] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck size={16} />
                Iniciar Sesión
              </button>
            </div>
          </form>

          {/* QUICK PROTOTYPE ACCESS (for reviewer convenience) */}
          <div className="mt-6 pt-5 border-t border-[#E4E2E1]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2 text-center">
              Acceso Rápido para Pruebas del Prototipo
            </p>
            <div className="space-y-1.5">
              {quickLogins.map((ql) => (
                <button
                  key={ql.role}
                  type="button"
                  onClick={() => handleQuickLogin(ql.email)}
                  className="w-full px-2.5 py-1.5 rounded-sm border border-[#E4E2E1] hover:border-[#A6192E] bg-[#FCF9F8] hover:bg-[#A6192E]/5 text-left flex items-center justify-between text-xs transition-colors cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-[#202124] block">{ql.label}</span>
                    <span className="text-[10px] text-[#64748B]">{ql.desc}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#A6192E]">Entrar →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E4E2E1] rounded-sm shadow-xl w-full max-w-md p-5 text-[#202124] space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#202124]">
              Recuperar Contraseña Corporativa
            </h3>
            {recoverySent ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Instrucciones enviadas al administrador de sistemas para restablecimiento de credenciales.</span>
              </div>
            ) : (
              <div>
                <p className="text-xs text-[#64748B] mb-3">
                  Ingrese su correo institucional. Se notificará a TI y Recursos Humanos para generar una clave temporal segura.
                </p>
                <input
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="su.correo@terraempresa.com"
                  className="w-full px-3 py-2 rounded-sm text-xs border border-[#E4E2E1] focus:outline-none focus:border-[#A6192E]"
                />
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2 border-t border-[#E4E2E1]">
              <button
                type="button"
                onClick={() => { setShowRecoveryModal(false); setRecoverySent(false); }}
                className="px-3 py-1.5 rounded-sm border border-[#E4E2E1] text-xs font-semibold text-[#64748B] hover:bg-[#F6F3F2]"
              >
                Cerrar
              </button>
              {!recoverySent && (
                <button
                  type="button"
                  onClick={() => setRecoverySent(true)}
                  className="px-4 py-1.5 rounded-sm bg-[#A6192E] text-white text-xs font-bold hover:bg-[#871326]"
                >
                  Solicitar Restablecimiento
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
