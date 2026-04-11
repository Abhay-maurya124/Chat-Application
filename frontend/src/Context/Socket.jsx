import { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { useFetchData } from './FetchContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { profiledata } = useFetchData();
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        if (!profiledata?._id) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        const newSocket = io(import.meta.env.VITE_CHAT_SERVICE_URL, {
            query: { userId: profiledata._id }
        });

        setSocket(newSocket);
        newSocket.on("getOnlineUser", (users) => setOnlineUsers(users));

        return () => {
            newSocket.off("getOnlineUser");
            newSocket.disconnect();
        };
    }, [profiledata?._id]); 

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);