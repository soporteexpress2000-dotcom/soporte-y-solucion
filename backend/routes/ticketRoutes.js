const express = require('express');
const router = express.Router();
const { crearTicket, obtenerTickets, obtenerTicketPorId, actualizarTicket } = require('../controllers/ticketController');
const { proteger } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware opcional para cargar usuario si hay token (para creación de tickets externos/internos)
const cargarUsuarioOpcional = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-contraseña');
        } catch (error) {
            // Se ignora el fallo porque es opcional
        }
    }
    next();
};

// Rutas
router.post('/', cargarUsuarioOpcional, crearTicket);
router.get('/', proteger, obtenerTickets);
router.get('/:id', proteger, obtenerTicketPorId);
router.put('/:id', proteger, actualizarTicket);

module.exports = router;
