const Ticket = require('../models/Ticket');
const User = require('../models/User');
const AccessCode = require('../models/AccessCode');

// @desc    Crear un nuevo ticket/solicitud
// @route   POST /api/tickets
// @access  Private/Public
const crearTicket = async (req, res) => {
    const { 
        titulo, 
        descripcion, 
        categoria, 
        prioridad, 
        nombreContacto, 
        correoContacto, 
        telefonoContacto, 
        dependencia, 
        pinCode 
    } = req.body;

    try {
        if (!titulo || !descripcion) {
            return res.status(400).json({ message: 'El título y la descripción son obligatorios' });
        }

        let ticketData = {
            titulo,
            descripcion,
            categoria: categoria || 'Otro',
            prioridad: prioridad || 'media'
        };

        // Si el usuario está autenticado (Administrador o Técnico)
        if (req.user) {
            ticketData.creadoPor = req.user._id;
            ticketData.dependencia = req.user.dependencia || 'Sistemas y Tecnología';
            ticketData.nombreContacto = req.user.nombre;
            ticketData.correoContacto = req.user.email;
            ticketData.telefonoContacto = req.user.telefono || '';
        } else {
            // Radicación de ticket por parte de una oficina (flujo público/interno sin login)
            if (!nombreContacto || !correoContacto || !dependencia || !pinCode) {
                return res.status(400).json({ 
                    message: 'El nombre, correo, oficina y el PIN son obligatorios para enviar la solicitud' 
                });
            }

            // Validar PIN de oficina
            const pinValido = await AccessCode.findOne({ codigo: pinCode });
            if (!pinValido) {
                return res.status(400).json({ message: 'El PIN ingresado es incorrecto o inválido' });
            }

            // Validar que el PIN corresponda a la oficina seleccionada
            if (pinValido.dependencia !== dependencia) {
                return res.status(400).json({ 
                    message: `El PIN ingresado no corresponde a la oficina seleccionada (${dependencia})` 
                });
            }

            ticketData.nombreContacto = nombreContacto;
            ticketData.correoContacto = correoContacto;
            ticketData.telefonoContacto = telefonoContacto || '';
            ticketData.dependencia = dependencia;
            ticketData.codigoAcceso = Math.random().toString(36).substring(2, 8).toUpperCase(); // Código de rastreo de 6 dígitos
        }

        const ticket = await Ticket.create(ticketData);

        // Emitir evento Socket.io de nueva solicitud creada
        const io = req.app.get('io');
        io.emit('ticketCreated', ticket);

        res.status(201).json(ticket);
    } catch (error) {
        console.error('Error al crear ticket:', error.message);
        res.status(500).json({ message: 'Error en el servidor al crear la solicitud' });
    }
};

// @desc    Obtener todas las solicitudes con filtros
// @route   GET /api/tickets
// @access  Private
const obtenerTickets = async (req, res) => {
    try {
        let filtro = {};

        // Si es un usuario normal (no admin ni tecnico), solo ve las solicitudes de su oficina/dependencia
        if (req.user.rol === 'usuario') {
            filtro.dependencia = req.user.dependencia;
        }

        // Filtros opcionales por estado, prioridad o asignación
        if (req.query.estado) filtro.estado = req.query.estado;
        if (req.query.prioridad) filtro.prioridad = req.query.prioridad;
        if (req.query.categoria) filtro.categoria = req.query.categoria;

        const tickets = await Ticket.find(filtro)
            .populate('creadoPor', 'nombre email dependencia')
            .populate('asignadoA', 'nombre email')
            .sort({ createdAt: -1 });

        res.json(tickets);
    } catch (error) {
        console.error('Error al obtener solicitudes:', error.message);
        res.status(500).json({ message: 'Error en el servidor al obtener las solicitudes' });
    }
};

// @desc    Obtener detalles de un ticket
// @route   GET /api/tickets/:id
// @access  Private
const obtenerTicketPorId = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('creadoPor', 'nombre email dependencia')
            .populate('asignadoA', 'nombre email');

        if (!ticket) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }

        // Validación de permisos: un usuario normal solo ve tickets de su propia oficina
        if (req.user.rol === 'usuario' && ticket.dependencia !== req.user.dependencia) {
            return res.status(403).json({ message: 'No tiene permisos para ver esta solicitud' });
        }

        res.json(ticket);
    } catch (error) {
        console.error('Error al obtener detalles del ticket:', error.message);
        res.status(500).json({ message: 'Error en el servidor al obtener detalles' });
    }
};

// @desc    Actualizar estado o técnico asignado de un ticket
// @route   PUT /api/tickets/:id
// @access  Private
const actualizarTicket = async (req, res) => {
    const { estado, prioridad, asignadoA, comentarioResolucion, categoria } = req.body;

    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }

        // Restricción: usuario de oficina solo puede actualizar prioridad o descripción si el ticket está abierto
        if (req.user.rol === 'usuario') {
            if (ticket.estado !== 'abierto') {
                return res.status(400).json({ message: 'No se puede modificar una solicitud en progreso o resuelta' });
            }
            if (prioridad) ticket.prioridad = prioridad;
        } else {
            // Técnicos y Administradores pueden cambiar todo
            if (estado) ticket.estado = estado;
            if (prioridad) ticket.prioridad = prioridad;
            if (categoria) ticket.categoria = categoria;
            if (comentarioResolucion) ticket.comentarioResolucion = comentarioResolucion;

            if (asignadoA) {
                const tecnicoExiste = await User.findById(asignadoA);
                if (tecnicoExiste) {
                    ticket.asignadoA = asignadoA;
                }
            }
        }

        const ticketActualizado = await ticket.save();

        // Emitir actualización por Socket.io a la sala del ticket
        const io = req.app.get('io');
        io.to(ticket._id.toString()).emit('ticketUpdated', ticketActualizado);
        io.emit('ticketListUpdate', ticketActualizado); // Actualiza paneles globales de técnicos

        res.json(ticketActualizado);
    } catch (error) {
        console.error('Error al actualizar ticket:', error.message);
        res.status(500).json({ message: 'Error en el servidor al actualizar la solicitud' });
    }
};

module.exports = {
    crearTicket,
    obtenerTickets,
    obtenerTicketPorId,
    actualizarTicket
};
