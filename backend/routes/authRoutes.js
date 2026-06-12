const express = require('express');
const router = express.Router();
const { registrarUsuario, iniciarSesion, obtenerUsuarioActual } = require('../controllers/authController');
const { proteger } = require('../middleware/authMiddleware');

// Rutas públicas
router.post('/register', registrarUsuario);
router.post('/login', iniciarSesion);

// Rutas protegidas
router.get('/me', proteger, obtenerUsuarioActual);

module.exports = router;
