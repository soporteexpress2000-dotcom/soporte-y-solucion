const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un correo válido']
    },
    contraseña: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    rol: {
        type: String,
        enum: ['admin', 'tecnico', 'usuario'],
        default: 'usuario'
    },
    telefono: {
        type: String,
        default: ''
    },
    dependencia: {
        type: String,
        default: ''
    },
    activo: {
        type: Boolean,
        default: true
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: true,
    collection: 'users'
});

// Encriptar contraseña antes de guardar en la base de datos
userSchema.pre('save', async function(next) {
    if (!this.isModified('contraseña')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.contraseña = await bcrypt.hash(this.contraseña, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para verificar la contraseña ingresada
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.contraseña);
};

module.exports = mongoose.model('User', userSchema);
