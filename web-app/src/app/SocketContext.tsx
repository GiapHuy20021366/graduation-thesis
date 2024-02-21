import React, { createContext, useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";
import { useAuthContext } from "../hooks";
import { VITE_MESSAGE_SOCKET_URL } from "../env";

interface ISocketContextProviderProps {
  children: React.ReactNode;
}

interface ISocketContext {
  socket?: Socket;
}

export const SocketContext = createContext<ISocketContext>({});

export default function SocketContextProvider({
  children,
}: ISocketContextProviderProps) {
  const socketRef = useRef<Socket>();
  const authContext = useAuthContext();

  useEffect(() => {
    const auth = authContext.auth;
    const socket = socketRef.current;

    if (auth != null && socket == null) {
      const newSocket = io(VITE_MESSAGE_SOCKET_URL, {
        extraHeaders: {
          Authorization: auth.token,
        },
      });
      socketRef.current = newSocket;

      newSocket.on("connect", () => {
        console.log(newSocket.id);
      });
      newSocket.on("error", (err) => console.log(err));
    }

    return () => {
      if (auth == null && socket != null) {
        socket.close();
      }
    };
  }, [authContext.auth]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
