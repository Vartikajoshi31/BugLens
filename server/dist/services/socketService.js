"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitEvent = exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io = null;
const initSocket = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        },
    });
    io.on('connection', (socket) => {
        console.log(`🔌 Socket Client Connected: ${socket.id}`);
        socket.on('join:room', (room) => {
            socket.join(room);
        });
        socket.on('disconnect', () => {
            console.log(`🔌 Socket Client Disconnected: ${socket.id}`);
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error('Socket.io has not been initialized!');
    }
    return io;
};
exports.getIO = getIO;
const emitEvent = (event, data) => {
    if (io) {
        io.emit(event, data);
    }
};
exports.emitEvent = emitEvent;
