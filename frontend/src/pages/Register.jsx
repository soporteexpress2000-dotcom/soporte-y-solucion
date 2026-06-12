import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, Phone, Key, Activity, ArrowRight } from 'lucide-react';

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [telefono, setTelefono] = useState('');
    const [codigoAcceso, setCodigoAcceso] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombre || !email || !contraseña || !codigoAcceso) {
            return toast.error('Por favor complete todos los campos requeridos');
        }

        if (contraseña.length < 6) {
            return toast.error('La contraseña debe tener al menos 6 caracteres');
        }

        setLoading(true);
        const result = await register(nombre, email, contraseña, telefono, codigoAcceso);
        setLoading(false);

        if (result.success) {
            toast.success('¡Registro exitoso y sesión iniciada!');
            navigate('/app');
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
                <div className="flex justify-center items-center gap-2 text-purple-500 font-extrabold text-2xl tracking-wider">
                    <Activity className="h-8 w-8 animate-pulse text-purple-400" />
                    <span>SOPORTE & SOLUCIÓN</span>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">
                    Crea tu cuenta de oficina
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
                <div className="bg-slate-900/60 backdrop-blur-xl py-8 px-4 shadow-2xl border border-slate-800/80 rounded-2xl sm:px-10">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                                Nombre Completo *
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-800 rounded-lg bg-slate-950 text-slate-100 placeholder-slate-505 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all sm:text-sm"
                                    placeholder="Andrés Pérez"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                                Correo Electrónico *
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-800 rounded-lg bg-slate-950 text-slate-100 placeholder-slate-505 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all sm:text-sm"
                                    placeholder="correo@ejemplo.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                                Contraseña * (mínimo 6 caracteres)
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={contraseña}
                                    onChange={(e) => setContraseña(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-800 rounded-lg bg-slate-950 text-slate-100 placeholder-slate-505 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                                Teléfono de Oficina / Extensión
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="text"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-800 rounded-lg bg-slate-950 text-slate-100 placeholder-slate-505 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all sm:text-sm"
                                    placeholder="Ext. 204 o Celular"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                                PIN de Acceso / Código de Oficina *
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Key className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={codigoAcceso}
                                    onChange={(e) => setCodigoAcceso(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-800 rounded-lg bg-slate-950 text-slate-100 placeholder-slate-505 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all sm:text-sm font-mono tracking-widest uppercase"
                                    placeholder="111111"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99] transition-all"
                            >
                                {loading ? 'Creando cuenta...' : 'Registrar Cuenta'}
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
