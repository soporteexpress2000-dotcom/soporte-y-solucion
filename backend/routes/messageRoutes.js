const express = require('express');
const router = express.Router();
const { enviarMensaje, obtenerMensajes } = require('../controllers/messageController');
const { proteger } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware opcional por si chatean desde portal público sin cuenta
const cargarUsuarioOpcional = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-contraseña');
        } catch (error) {
            // Ignorar error
        }
    }
    next();
};

router.post('/', cargarUsuarioOpcional, enviarMensaje);
router.get('/:ticketId', proteger, obtenerMensajes);

module.exports = router;
