const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rutas por token JWT
const proteger = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener el token del encabezado "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // Verificar token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Obtener usuario del token y añadirlo a la petición (excluyendo la contraseña)
            req.user = await User.findById(decoded.id).select('-contraseña');

            if (!req.user) {
                return res.status(401).json({ message: 'Usuario no encontrado, autorización denegada' });
            }

            if (!req.user.activo) {
                return res.status(403).json({ message: 'Este usuario ha sido desactivado' });
            }

            next();
        } catch (error) {
            console.error('Error de autenticación JWT:', error.message);
            res.status(401).json({ message: 'No autorizado, token fallido o expirado' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'No autorizado, no se proporcionó ningún token' });
    }
};

// Middleware para restringir acceso solo a administradores
const soloAdmin = (req, res, next) => {
    if (req.user && req.user.rol === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado, se requieren permisos de administrador' });
    }
};

module.exports = { proteger, soloAdmin };
