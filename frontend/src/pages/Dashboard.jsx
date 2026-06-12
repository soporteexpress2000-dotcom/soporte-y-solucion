import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Activity, User, Shield, Briefcase, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        toast.success('¡Sesión cerrada correctamente!');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            {/* Navbar */}
            <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-purple-500 font-extrabold text-xl tracking-wider">
                    <Activity className="h-6 w-6 text-purple-400" />
                    <span>SOPORTE & SOLUCIÓN</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">
                            ¡Bienvenido de nuevo, {user?.nombre}!
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Panel general para la gestión de solicitudes y soporte técnico.
                        </p>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* User Info Card */}
                    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl md:col-span-1">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
                            <User className="h-5 w-5 text-purple-400" />
                            Tu Perfil de Oficina
                        </h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <span className="text-slate-500 block">Nombre</span>
                                <span className="text-slate-200 font-medium">{user?.nombre}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Correo Electrónico</span>
                                <span className="text-slate-200 font-medium">{user?.email}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Dependencia / Oficina</span>
                                <span className="text-slate-200 font-medium flex items-center gap-1.5 mt-0.5">
                                    <Briefcase className="h-4 w-4 text-slate-400" />
                                    {user?.dependencia || 'No asignada'}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Rol en el Sistema</span>
                                <span className="text-slate-200 font-medium flex items-center gap-1.5 mt-0.5">
                                    <Shield className="h-4 w-4 text-slate-400" />
                                    <span className="capitalize">{user?.rol}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl md:col-span-2 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
                                <FileText className="h-5 w-5 text-purple-400" />
                                Resumen de Solicitudes
                            </h3>
                            <p className="text-slate-400 text-sm">
                                Este panel se conectará con el listado de tickets en tiempo real de tu oficina (**{user?.dependencia}**). Desde aquí podrás:
                            </p>
                            <ul className="list-disc pl-5 mt-3 text-slate-300 text-sm space-y-2">
                                <li>Crear nuevas solicitudes internas y adjuntar archivos explicativos.</li>
                                <li>Chatear directamente en tiempo real con el personal de tecnología y soporte.</li>
                                <li>Recibir notificaciones cuando el estado de tu caso cambie.</li>
                            </ul>
                        </div>
                        <div className="pt-6 border-t border-slate-800/60 mt-6 flex justify-end">
                            <button
                                onClick={() => toast.success('¡Módulo de creación en desarrollo!')}
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg transform hover:scale-[1.01] active:scale-[0.99] transition-all"
                            >
                                Nueva Solicitud
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
