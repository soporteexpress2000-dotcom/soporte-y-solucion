const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    prioridad: {
        type: String,
        enum: ['baja', 'media', 'alta'],
        default: 'media',
        index: true
    },
    estado: {
        type: String,
        enum: ['abierto', 'en_progreso', 'resuelto', 'cerrado'],
        default: 'abierto',
        index: true
    },
    categoria: {
        type: String,
        enum: [
            'Soporte Técnico',
            'Soporte de Software',
            'Red e Internet',
            'Cuentas y Accesos',
            'Consulta / Asesoría',
            'Otro'
        ],
        default: 'Otro',
        index: true
    },
    // Si la solicitud es creada por un usuario registrado (técnico, cliente registrado, admin)
    creadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        index: true
    },
    // Datos de contacto si la solicitud es creada por un cliente externo (público)
    nombreContacto: {
        type: String,
        trim: true
    },
    correoContacto: {
        type: String,
        trim: true,
        lowercase: true
    },
    telefonoContacto: {
        type: String,
        trim: true
    },
    // Técnico o agente asignado a resolver la solicitud
    asignadoA: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    // Código único de rastreo para el público externo
    codigoAcceso: {
        type: String,
        unique: true,
        sparse: true,
        index: true
    },
    adjuntos: [{
        type: String // URLs de archivos subidos
    }],
    comentarioResolucion: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Ticket', ticketSchema);
