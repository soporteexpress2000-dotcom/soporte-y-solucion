const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true,
        index: true
    },
    // Si el remitente es un usuario registrado (técnico, admin, etc.)
    remitente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    // Si el remitente es un cliente externo (público)
    nombreRemitente: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: [true, 'El mensaje no puede estar vacío'],
        trim: true
    },
    // Define si es una nota interna visible solo para técnicos/admins
    esInterno: {
        type: Boolean,
        default: false,
        index: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
