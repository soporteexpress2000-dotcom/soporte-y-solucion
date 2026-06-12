import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Componente de Ruta Protegida (Evita accesos no autenticados)
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Cargando perfil...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <Toaster 
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#0f172a',
                        color: '#f8fafc',
                        border: '1px solid #1e293b'
                    }
                }}
            />
            <Router>
                <Routes>
                    {/* Rutas Públicas de Auth */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Ruta Privada / Dashboard */}
                    <Route 
                        path="/app" 
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } 
                    />

                    {/* Redirección por defecto */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
