import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import router from './routes.mjs';

const app = express();
const httpServer = createServer(app);

// Configura CORS para permitir solicitudes desde múltiples orígenes de clientes
app.use(cors({
    origin: ['http://127.0.0.1:5173', 'http://127.0.0.1:3001'], // Añade aquí todos los orígenes permitidos
    methods: ['GET', 'POST', 'PUT']
}));

app.use(express.json());

const io = new SocketIOServer(httpServer, {
    cors: {
        origin: ['http://127.0.0.1:5173', 'http://127.0.0.1:3001'], // Igual que arriba, incluye todos los orígenes permitidos
        methods: ['GET', 'POST', 'PUT']
    }
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api', router);

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');
    // Aquí puedes manejar eventos específicos del socket
});

// No necesitas llamar a `connection.connect` aquí
httpServer.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
