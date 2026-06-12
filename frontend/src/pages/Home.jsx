import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Activity, User, FileText, Send, CheckCircle2, Copy, HelpCircle } from 'lucide-react';
import API from '../api/axios';

const Home = () => {
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        categoria: 'Otro',
        prioridad: 'media',
        nombreContacto: '',
        correoContacto: '',
        telefonoContacto: '',
        dependencia: 'Sistemas y Tecnología',
        pinCode: ''
    });

    const [loading, setLoading] = useState(false);
    const [trackingCode, setTrackingCode] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.titulo || !formData.descripcion || !formData.nombreContacto || !formData.correoContacto || !formData.pinCode) {
            return toast.error('Por favor complete todos los campos obligatorios (*)');
        }

        setLoading(true);
        try {
            const res = await API.post('/tickets', formData);
            toast.success('¡Ticket radicado con éxito!');
            setTrackingCode(res.data.codigoAcceso);
            // Limpiar formulario
            setFormData({
                titulo: '',
                descripcion: '',
                categoria: 'Otro',
                prioridad: 'media',
                nombreContacto: '',
                correoContacto: '',
                telefonoContacto: '',
                dependencia: 'Sistemas y Tecnología',
                pinCode: ''
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al enviar el ticket');
        } finally {
            setLoading(false);
        }
    };

    const copiarAlPortapapeles = () => {
        navigator.clipboard.writeText(trackingCode);
        toast.success('¡Código copiado al portapapeles!');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-900/10 blur-[130px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-900/10 blur-[130px] pointer-events-none"></div>

            {/* Header / Navbar */}
            <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex justify-between items-center z-10 sticky top-0">
                <div className="flex items-center gap-2 text-purple-500 font-extrabold text-xl tracking-wider">
                    <Activity className="h-6 w-6 text-purple-400" />
                    <span>SOPORTE & SOLUCIÓN</span>
                </div>
                
                {/* Botón de acceso de administrador en la esquina */}
                <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    title="Acceso para Técnicos y Administradores"
                >
                    <User className="h-4 w-4 text-purple-400" />
                    <span>Acceso Técnico</span>
                </button>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 z-10 flex flex-col items-center justify-center">
                
                {/* Modal de éxito tras radicar */}
                {trackingCode ? (
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl text-center max-w-md w-full animate-in fade-in zoom-in duration-300">
                        <CheckCircle2 className="h-16 w-16 text-emerald-400 mx-auto mb-4 animate-bounce" />
                        <h2 className="text-2xl font-extrabold text-white mb-2">¡Solicitud Radicada!</h2>
                        <p className="text-slate-400 text-sm mb-6">
                            Guarda este código para consultar el estado de tu caso o chatear con el técnico:
                        </p>
                        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-3 mb-6 font-mono text-xl tracking-widest text-purple-400 font-bold">
                            <span>{trackingCode}</span>
                            <button 
                                onClick={copiarAlPortapapeles}
                                className="text-slate-500 hover:text-slate-300 transition-colors p-1.5 hover:bg-slate-900 rounded-lg"
                                title="Copiar código"
                            >
                                <Copy className="h-5 w-5" />
                            </button>
                        </div>
                        <button
                            onClick={() => setTrackingCode('')}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all"
                        >
                            Radicar otro ticket
                        </button>
                    </div>
                ) : (
                    /* Formulario de radicación */
                    <div className="w-full bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl p-6 sm:p-10">
                        <div className="text-center mb-8">
                            <span className="bg-purple-950/80 border border-purple-800/50 text-purple-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                Radicación Interna
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                                Nueva Solicitud de Soporte
                            </h1>
                            <p className="text-slate-400 text-sm mt-1">
                                Envía tu ticket de manera inmediata usando el PIN de tu oficina
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Datos de contacto */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-b border-slate-800/60 pb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                                        Nombre de Contacto *
                                    </label>
                                    <input
                                        type="text"
                                        name="nombreContacto"
                                        required
                                        value={formData.nombreContacto}
                                        onChange={handleChange}
                                        className="block w-full px-4 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                                        placeholder="Ej. Juan Pérez"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                                        Correo de Oficina *
                                    </label>
                                    <input
                                        type="email"
                                        name="correoContacto"
                                        required
                                        value={formData.correoContacto}
                                        onChange={handleChange}
                                        className="block w-full px-4 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                                        placeholder="Ej. juan@oficina.com"
                                    />
                                </div>
                            </div>

                            {/* Datos del Ticket */}
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    {/* Dependencia/Oficina */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                                            Oficina / Dependencia *
                                        </label>
                                        <select
                                            name="dependencia"
                                            value={formData.dependencia}
                                            onChange={handleChange}
                                            className="block w-full px-4 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                                        >
                                            <option value="Sistemas y Tecnología">Sistemas y Tecnología</option>
                                            <option value="Administración General">Administración General</option>
                                            <option value="Recursos Humanos">Recursos Humanos</option>
                                            <option value="Contabilidad y Finanzas">Contabilidad y Finanzas</option>
                                            <option value="Atención al Cliente">Atención al Cliente</option>
                                            <option value="Dirección General">Dirección General</option>
                                        </select>
                                    </div>

                                    {/* PIN de Validación */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                                            PIN de Oficina *
                                        </label>
                                        <input
                                            type="text"
                                            name="pinCode"
                                            required
                                            value={formData.pinCode}
                                            onChange={handleChange}
                                            className="block w-full px-4 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm font-mono tracking-widest text-center"
                                            placeholder="111111"
                                            maxLength={6}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Categoria */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                                            Categoría del Problema
                                        </label>
                                        <select
                                            name="categoria"
                                            value={formData.categoria}
                                            onChange={handleChange}
                                            className="block w-full px-4 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                                        >
                                            <option value="Soporte Técnico">Soporte Técnico</option>
                                            <option value="Soporte de Software">Soporte de Software</option>
                                            <option value="Red e Internet">Red e Internet</option>
                                            <option value="Cuentas y Accesos">Cuentas y Accesos</option>
                                            <option value="Consulta / Asesoría">Consulta / Asesoría</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                    </div>

                                    {/* Prioridad */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                                            Prioridad
                                        </label>
                                        <select
                                            name="prioridad"
                                            value={formData.prioridad}
                                            onChange={handleChange}
                                            className="block w-full px-4 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                                        >
                                            <option value="baja">Baja</option>
                                            <option value="media">Media</option>
                                            <option value="alta">Alta (Urgente)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Titulo */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                                        Asunto / Resumen *
                                    </label>
                                    <input
                                        type="text"
                                        name="titulo"
                                        required
                                        value={formData.titulo}
                                        onChange={handleChange}
                                        className="block w-full px-4 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                                        placeholder="Ej. Impresora sin conexión en oficina"
                                    />
                                </div>

                                {/* Descripcion */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                                        Descripción Detallada *
                                    </label>
                                    <textarea
                                        name="descripcion"
                                        required
                                        rows={4}
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        className="block w-full px-4 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm resize-none"
                                        placeholder="Describa el problema con el mayor detalle posible para ayudar al técnico..."
                                    />
                                </div>
                            </div>

                            {/* Botón enviar */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99] transition-all"
                                >
                                    {loading ? 'Enviando solicitud...' : 'Radicar Solicitud'}
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
