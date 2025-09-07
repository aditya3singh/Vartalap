import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext)
    return socket
}

export const SocketProvider = (props) => {
  const { children } = props;
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
    const connection = io(socketUrl, {
      path: '/.netlify/functions/socket',
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5
    });
    
    console.log("socket connection", connection);
    setSocket(connection);

    return () => {
      connection.close();
    };
  }, []);

  socket?.on('connect_error', async (err) => {
    console.log("Error establishing socket", err);
    try {
      await fetch('/.netlify/functions/socket', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error initializing socket server:', error);
    }
  });

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};