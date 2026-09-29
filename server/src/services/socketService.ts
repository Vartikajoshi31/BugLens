import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;

export const initSocket = (httpServer: HTTPServer): SocketIOServer => {
  io = new (SocketIOServer as any)(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  });

  io!.on('connection', (socket) => {
    console.log(`🔌 Socket Client Connected: ${socket.id}`);

    socket.on('join:room', (room) => {
      socket.join(room);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket Client Disconnected: ${socket.id}`);
    });
  });

  return io!;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io has not been initialized!');
  }
  return io;
};

export const emitEvent = (event: string, data: any) => {
  if (io) {
    io.emit(event, data);
  }
};
