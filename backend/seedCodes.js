const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AccessCode = require('./models/AccessCode');

// Cargar variables de entorno
dotenv.config();

// Lista inicial de dependencias y sus códigos de acceso (PINs)
const codigosIniciales = [
    { codigo: '111111', dependencia: 'Sistemas y Tecnología' },
    { codigo: '222222', dependencia: 'Administración General' },
    { codigo: '333333', dependencia: 'Recursos Humanos' },
    { codigo: '444444', dependencia: 'Contabilidad y Finanzas' },
    { codigo: '555555', dependencia: 'Atención al Cliente' },
    { codigo: '666666', dependencia: 'Dirección General' }
];

const seedCodes = async () => {
    try {
        // Conectar a la base de datos
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB para sembrar códigos...');

        // Limpiar códigos existentes
        await AccessCode.deleteMany();
        console.log('Códigos anteriores eliminados de la base de datos.');

        // Insertar nuevos códigos
        const createdCodes = await AccessCode.insertMany(codigosIniciales);
        console.log('¡Nuevos códigos creados exitosamente!');
        console.table(createdCodes.map(c => ({ PIN: c.codigo, Oficina: c.dependencia })));

        // Cerrar conexión
        mongoose.connection.close();
        console.log('Conexión a la base de datos cerrada.');
        process.exit(0);
    } catch (error) {
        console.error('Error al sembrar los códigos:', error.message);
        process.exit(1);
    }
};

seedCodes();
