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

    const Token = localStorage.getItem("token")

    const fetchProfileInfo = async () => {
        const res = await axios.get("http://localhost:5000/v1/user/profile", {
            headers: {
                authorization: `Bearer ${Token}`
            }
        })
        setprofiledata(res.data)
        setLoading(false)
    }

    const GetAllUserInfo = async () => {
        const res = await axios.get(`http://localhost:5000/v1/user/alluser`)
        setgetAlluser(res.data.user)
        setLoading(false)

    }

    const updateUser = async (updatedname) => {
        const res = await axios.post("http://localhost:5000/v1/user/profile", { updatedname }, {
            headers: {
                authorization: `Bearer ${Token}`
            }
        })
        setupdateUserdetail(res.data)
        setLoading(false)

    }

    const createChat = async (otherUserId) => {
        const res = await axios.post("http://localhost:5002/v2/newChat", { otherUserId }, {
            headers: {
                authorization: `Bearer ${Token}`
            }
        })
        setChat(res.data)
        setLoading(false)
    }

    const NewMessage = async (chatId, text, imageFile) => {
        const formData = new FormData()
        formData.append("chatId", chatId)
        if (text) formData.append("text", text)
        if (imageFile) formData.append("image", imageFile)

        const res = await axios.post("http://localhost:5002/v2/message", formData, {
            headers: {
                authorization: `Bearer ${Token}`,
                "Content-Type": "multipart/form-data"
            }
        })
        setsendMessage(res.data)
        setLoading(false)

        return res.data
    }

    const getAllchat = async () => {
        const res = await axios.get("http://localhost:5002/v2/chat/all", {
            headers: {
                authorization: `Bearer ${Token}`
            }
        })
        setAllChat(res.data)
        setLoading(false)
        return res.data
    }

    const getUserChats = async (chatId) => {
        const res = await axios.get(`http://localhost:5002/v2/message/${chatId}`, {
            headers: {
                authorization: `Bearer ${Token}`
            }
        })
        setLoading(false)

        return res.data
    }

    // useEffect(() => {
    //     fetchProfileInfo(),
    //         getUserChats,
    //         getAllchat(),
    //         GetAllUserInfo()
    // }, [])

    return (
        <USerChats.Provider value={{
            profiledata,
            getAlluser,
            Chat,
            AllChat,
            sendMessage,
            Loading, 
            setLoading,
            fetchProfileInfo,
            GetAllUserInfo,
            updateUser,
            createChat,
            getAllchat,
            NewMessage,
            getUserChats
        }}>
            {children}
        </USerChats.Provider>
    )
}

export default FetchContext

export const useFetchData = () => {
    const context = useContext(USerChats)
    if (!context) {
        throw new Error("useFetchData must be used inside FetchContext provider")
    }
    return context
}