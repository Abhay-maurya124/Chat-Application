import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const USerChats = createContext()

const FetchContext = ({ children }) => {
    const [profiledata, setprofiledata] = useState(null)
    const [getAlluser, setgetAlluser] = useState(null)
    const [updateUserdetail, setupdateUserdetail] = useState(null)
    const [Chat, setChat] = useState(null)
    const [AllChat, setAllChat] = useState(null)
    const [sendMessage, setsendMessage] = useState([])
    const [Loading, setLoading] = useState(true)
    const [Getmessages, setGetmessages] = useState(null)

    const fetchProfileInfo = async () => {
        const token = localStorage.getItem("token")
        if (!token) return;
        try {
            const res = await axios.get("http://localhost:5000/v1/user/profile", {
                headers: { authorization: `Bearer ${token}` }
            })
            setprofiledata(res.data)
            setLoading(false)
        } catch (error) {
            console.error(error)
        }
    }

    const UpdateProfileInfo = async (newName) => {
        const token = localStorage.getItem("token")
        const res = await axios.post("http://localhost:5000/v1/user/update", { name: newName }, {
            headers: { authorization: `Bearer ${token}` }
        })
        await Promise.all([getAllchat(), GetAllUserInfo(), fetchProfileInfo()]);
        setupdateUserdetail(res.data)
        setLoading(false)
    }

    const GetAllUserInfo = async () => {
        const res = await axios.get(`http://localhost:5000/v1/user/alluser`)
        setgetAlluser(res.data.user)
        setLoading(false)
    }

    const createChat = async (otherUserId) => {
        const token = localStorage.getItem("token")
        const res = await axios.post("http://localhost:5002/v2/newChat", { otherUserId }, {
            headers: { authorization: `Bearer ${token}` }
        })
        setChat(res.data)
        await getAllchat();
        setLoading(false)
    }

    const NewMessage = async (chatId, text, imageFile) => {
        const token = localStorage.getItem("token")
        const formData = new FormData()
        formData.append("chatId", chatId)
        if (text) formData.append("text", text)
        if (imageFile) formData.append("image", imageFile)

        const res = await axios.post("http://localhost:5002/v2/message", formData, {
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        })
        setsendMessage(res.data)
        setLoading(false)
        return res.data
    }

    const getAllchat = async () => {
        const token = localStorage.getItem("token")
        if (!token) return;
        try {
            const res = await axios.get("http://localhost:5002/v2/chat/all", {
                headers: { authorization: `Bearer ${token}` }
            })
            setAllChat(res.data)
            setLoading(false)
            return res.data
        } catch (error) {
            console.error(error);
        }
    }

  const getUserChats = async (chatId) => {
    const token = localStorage.getItem("token");
    if (!chatId || !token) return;

    try {
        const res = await axios.get(`http://localhost:5002/v2/message/${chatId}`, {
            headers: { authorization: `Bearer ${token}` }
        });

        setGetmessages({ ...res.data, activeChatId: chatId });

        // NEW: Only mark as seen if the last message wasn't sent by me
        const messages = res.data.messages;
        if (messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg.senderId !== profiledata?._id && !lastMsg.seen) {
                // Call backend to update status to seen
                await axios.put(`http://localhost:5002/v2/message/seen/${chatId}`, {}, {
                    headers: { authorization: `Bearer ${token}` }
                });
            }
        }

        await getAllchat(); // Refresh sidebar to remove the green count
        setLoading(false);
    } catch (error) {
        console.error(error);
    }
};
    const logout = () => {
        localStorage.removeItem("token");
        setprofiledata(null);
        setAllChat(null);
        setGetmessages(null);
        setgetAlluser(null);
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            fetchProfileInfo()
            GetAllUserInfo()
            getAllchat()
        }
    }, [])

    return (
        <USerChats.Provider value={{
            profiledata, getAlluser, Chat, AllChat, Getmessages, sendMessage, Loading, setLoading,
            fetchProfileInfo, GetAllUserInfo, createChat, getAllchat, UpdateProfileInfo, NewMessage, getUserChats, logout
        }}>
            {children}
        </USerChats.Provider>
    )
}

export default FetchContext

export const useFetchData = () => {
    const context = useContext(USerChats)
    if (!context) throw new Error("useFetchData must be used inside FetchContext provider")
    return context
}