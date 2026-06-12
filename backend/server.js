const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const { errorHandler } = require('./middleware/errorMiddleware');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos (se ejecutará cuando se configure el MONGO_URI)
const connectDB = require('./config/db');
connectDB();

const app = express();
const server = http.createServer(app);

// Configuración de Socket.io para tiempo real
const io = socketIo(server, {
    transports: ['websocket', 'polling'],
    cors: {
        origin: '*', // Se puede restringir en producción
        methods: ['GET', 'POST']
    }
});

app.set('io', io);

// Eventos de Socket.io para tiempo real
io.on('connection', (socket) => {
    console.log('Cliente Socket.io conectado:', socket.id);

    // Unirse a una sala específica del ticket/solicitud
    socket.on('joinRequest', (requestId) => {
        socket.join(requestId);
        console.log(`Socket ${socket.id} unido a la solicitud: ${requestId}`);
    });

    // Indicador de escritura
    socket.on('typing', ({ requestId, role }) => {
        socket.to(requestId).emit('userTyping', { role });
    });

    socket.on('stopTyping', (requestId) => {
        socket.to(requestId).emit('userStopTyping');
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

// Middlewares estándar
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas base y de diagnóstico
app.get('/test-server', (req, res) => {
    res.send('Servidor de Soporte y Solución en funcionamiento...');
});

// Endpoint de diagnóstico
const mongoose = require('mongoose');
app.get('/api/diag', async (req, res) => {
    try {
        const state = mongoose.connection.readyState;
        res.json({
            status: 'ok',
            dbState: state,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Error en diagnóstico' });
    }
});

// Manejador de errores global
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
