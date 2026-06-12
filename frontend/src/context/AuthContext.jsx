import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await API.get('/auth/me');
                    setUser(res.data);
                } catch (error) {
                    console.error('Error al validar sesión:', error);
                    logout();
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, contraseña) => {
        try {
            const res = await API.post('/auth/login', { email, contraseña });
            localStorage.setItem('token', res.data.token);
            setUser({
                _id: res.data._id,
                nombre: res.data.nombre,
                email: res.data.email,
                rol: res.data.rol,
                dependencia: res.data.dependencia
            });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error de inicio de sesión'
            };
        }
    };

    const register = async (nombre, email, contraseña, telefono, codigoAcceso) => {
        try {
            const res = await API.post('/auth/register', {
                nombre,
                email,
                contraseña,
                telefono,
                codigoAcceso
            });
            localStorage.setItem('token', res.data.token);
            setUser({
                _id: res.data._id,
                nombre: res.data.nombre,
                email: res.data.email,
                rol: res.data.rol,
                dependencia: res.data.dependencia
            });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error en el registro'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
