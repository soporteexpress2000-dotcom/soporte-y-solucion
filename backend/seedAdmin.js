const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Cargar variables de entorno
dotenv.config();

const createAdmin = async () => {
    try {
        // Conectar a la base de datos
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB para crear cuenta de administrador...');

        // Verificar si el administrador ya existe
        const adminExiste = await User.findOne({ email: 'admin@soporte.com' });
        if (adminExiste) {
            console.log('El usuario administrador (admin@soporte.com) ya existe en la base de datos.');
            process.exit(0);
        }

        // Crear el administrador por defecto
        const nuevoAdmin = await User.create({
            nombre: 'Administrador de Soporte',
            email: 'admin@soporte.com',
            contraseña: 'admin123456', // Se encriptará automáticamente en el hook pre-save de Mongoose
            rol: 'admin',
            dependencia: 'Sistemas y Tecnología',
            telefono: 'Ext 100',
            activo: true
        });

        console.log('¡Administrador creado con éxito!');
        console.log('------------------------------------------------');
        console.log(`Correo: ${nuevoAdmin.email}`);
        console.log('Contraseña: admin123456');
        console.log('------------------------------------------------');

        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error al crear el administrador:', error.message);
        process.exit(1);
    }
};

createAdmin();
