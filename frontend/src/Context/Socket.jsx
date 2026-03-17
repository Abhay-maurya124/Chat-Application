import { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { useFetchData } from './FetchContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { profiledata } = useFetchData();
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        // ✅ FIX: Disconnect old socket before creating new one (handles re-login)
        if (!profiledata?._id) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        const newSocket = io("http://localhost:5002", {
            query: { userId: profiledata._id }
        });

        setSocket(newSocket);

        newSocket.on("getOnlineUser", (users) => {
            setOnlineUsers(users);
        });

        return () => {
            newSocket.off("getOnlineUser");
            newSocket.disconnect();
        };
    }, [profiledata?._id]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);