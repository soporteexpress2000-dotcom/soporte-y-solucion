const mongoose = require('mongoose');

const accessCodeSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: [true, 'El PIN/Código de acceso es obligatorio'],
        unique: true,
        trim: true
    },
    dependencia: {
        type: String,
        required: [true, 'La dependencia u oficina asociada es obligatoria'],
        trim: true
    },
    utilizado: {
        type: Boolean,
        default: false
    },
    utilizadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    fechaUtilizacion: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    collection: 'access_codes'
});

module.exports = mongoose.model('AccessCode', accessCodeSchema);
