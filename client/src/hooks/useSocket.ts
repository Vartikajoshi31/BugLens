import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(window.location.origin, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
};

export const useSocket = (event?: string, callback?: (data: any) => void) => {
  useEffect(() => {
    const socketInstance = getSocket();

    if (event && callback) {
      socketInstance.on(event, callback);
    }

    return () => {
      if (event && callback) {
        socketInstance.off(event, callback);
      }
    };
  }, [event, callback]);

  return getSocket();
};
