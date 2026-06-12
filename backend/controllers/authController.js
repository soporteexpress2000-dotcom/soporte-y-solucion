const User = require('../models/User');
const AccessCode = require('../models/AccessCode');
const generateToken = require('../utils/generateToken');

// @desc    Registrar un nuevo usuario (con código de acceso/PIN de oficina)
// @route   POST /api/auth/register
// @access  Public
const registrarUsuario = async (req, res) => {
    const { nombre, email, contraseña, telefono, codigoAcceso } = req.body;

    try {
        // 1. Validar campos requeridos
        if (!nombre || !email || !contraseña || !codigoAcceso) {
            return res.status(400).json({ message: 'Por favor complete todos los campos requeridos' });
        }

        // 2. Verificar si el correo ya está registrado
        const usuarioExiste = await User.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({ message: 'Este correo electrónico ya está registrado' });
        }

        // 3. Validar el PIN de la oficina (AccessCode)
        const pinValido = await AccessCode.findOne({ codigo: codigoAcceso });
        if (!pinValido) {
            return res.status(400).json({ message: 'El PIN ingresado no existe en el sistema' });
        }

        if (pinValido.utilizado) {
            return res.status(400).json({ message: 'Este PIN ya ha sido utilizado para registrar otro usuario' });
        }

        // 4. Crear el nuevo usuario mapeando la dependencia asociada al PIN
        const user = await User.create({
            nombre,
            email,
            contraseña,
            telefono: telefono || '',
            dependencia: pinValido.dependencia, // Asigna automáticamente la oficina/dependencia
            rol: 'usuario' // Por defecto son usuarios de soporte interno de sus oficinas
        });

        if (user) {
            // 5. Marcar el PIN como utilizado por este usuario
            pinValido.utilizado = true;
            pinValido.utilizadoPor = user._id;
            pinValido.fechaUtilizacion = new Date();
            await pinValido.save();

            // 6. Enviar respuesta con el token de acceso
            res.status(201).json({
                _id: user._id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol,
                dependencia: user.dependencia,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Datos de usuario inválidos' });
        }

    } catch (error) {
        console.error('Error en registro:', error.message);
        res.status(500).json({ message: 'Error en el servidor al registrar el usuario' });
    }
};

// @desc    Iniciar sesión de usuario
// @route   POST /api/auth/login
// @access  Public
const iniciarSesion = async (req, res) => {
    const { email, contraseña } = req.body;

    try {
        if (!email || !contraseña) {
            return res.status(400).json({ message: 'Por favor ingrese correo y contraseña' });
        }

        // Buscar el usuario por email
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(contraseña))) {
            if (!user.activo) {
                return res.status(403).json({ message: 'Su cuenta ha sido desactivada. Comuníquese con soporte' });
            }

            res.json({
                _id: user._id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol,
                dependencia: user.dependencia,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }

    } catch (error) {
        console.error('Error en login:', error.message);
        res.status(500).json({ message: 'Error en el servidor al iniciar sesión' });
    }
};

// @desc    Obtener perfil del usuario autenticado actual
// @route   GET /api/auth/me
// @access  Private
const obtenerUsuarioActual = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-contraseña');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener perfil:', error.message);
        res.status(500).json({ message: 'Error en el servidor al obtener el perfil' });
    }
};

module.exports = {
    registrarUsuario,
    iniciarSesion,
    obtenerUsuarioActual
};
