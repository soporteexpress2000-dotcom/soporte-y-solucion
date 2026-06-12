const Message = require('../models/Message');
const Ticket = require('../models/Ticket');

// @desc    Enviar un mensaje de chat dentro de un ticket
// @route   POST /api/messages
// @access  Private/Public (Opcional si es público con código de acceso)
const enviarMensaje = async (req, res) => {
    const { ticketId, contenido, esInterno, nombreRemitente } = req.body;

    try {
        if (!ticketId || !contenido) {
            return res.status(400).json({ message: 'El ID de ticket y el contenido son requeridos' });
        }

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'El ticket especificado no existe' });
        }

        let remitenteId = null;
        let remitenteNombre = nombreRemitente || 'Invitado';

        if (req.user) {
            remitenteId = req.user._id;
            remitenteNombre = req.user.nombre;
        }

        const message = await Message.create({
            ticket: ticketId,
            remitente: remitenteId,
            nombreRemitente: remitenteNombre,
            contenido,
            esInterno: esInterno || false
        });

        // Poblamos la referencia del remitente por si el frontend necesita mostrar rol/avatar
        const mensajePoblado = await Message.findById(message._id).populate('remitente', 'nombre rol email');

        // Emitir mensaje por Socket.io a la sala correspondiente del ticket
        const io = req.app.get('io');
        io.to(ticketId.toString()).emit('messageReceived', mensajePoblado);

        res.status(201).json(mensajePoblado);
    } catch (error) {
        console.error('Error al enviar mensaje:', error.message);
        res.status(500).json({ message: 'Error en el servidor al enviar el mensaje' });
    }
};

// @desc    Obtener el historial de mensajes de un ticket
// @route   GET /api/messages/:ticketId
// @access  Private
const obtenerMensajes = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'El ticket especificado no existe' });
        }

        let filtro = { ticket: req.params.ticketId };

        // Si el usuario es un cliente de oficina normal (no técnico ni admin), ocultamos las notas internas
        if (req.user && req.user.rol === 'usuario') {
            filtro.esInterno = false;
        }

        const mensajes = await Message.find(filtro)
            .populate('remitente', 'nombre rol email')
            .sort({ createdAt: 1 }); // Orden cronológico antiguo a nuevo

        res.json(mensajes);
    } catch (error) {
        console.error('Error al obtener mensajes:', error.message);
        res.status(500).json({ message: 'Error en el servidor al cargar los mensajes' });
    }
};

module.exports = {
    enviarMensaje,
    obtenerMensajes
};
