import React, { createContext, useContext, useState } from 'react'
const USerChats = createContext()
const FetchContext = ({ children }) => {
    const [profiledata, setprofiledata] = useState(null)
    const [getAlluser, setgetAlluser] = useState(null)
    const [updateUserdetail, setupdateUserdetail] = useState(null)
    const [Chat, setChat] = useState(null)
    const [AllChat, setAllChat] = useState(null)
    const [sendMessage, setsendMessage] = useState([])
    const Token = localStorage.getItem("token")
    const fetchProfileInfo = async () => {
        const res = await axios.get("http://localhost:5000/v1/user/profile", { profiledata }, {
            headers: {
                authorization: `Bearer ${Token}`
            }
        })
        setprofiledata(res.data)
        console.log(res.data)
    }

    const GetAllUserInfo = async () => {
        const res = await axios.get(`http://localhost:5000/v1/user/alluser`, { getAlluser })
        setgetAlluser(res.data)
    }

    const updateUser = async () => {
        const res = await axios.post("http://localhost:5000/v1/user/profile", { updateUserdetail }, {
            headers: {
                authorization: `Bearer ${Token}`
            }
        })
        setupdateUserdetail(res.data)

    }

    const getchat = async () => {
        const res = await axios.post("http://localhost:5000/v2/newChat", { Chat }, {
            headers: {
                authorization: `Bearer ${Token}`
            }
        })
        setChat(res.data)
    }
    const NewMessage = async () => {
        const res = await axios.post("http://localhost:5000/v2/message", { sendMessage }, {
            headers: {
                authorization: `Bearer ${Token}`
            }
        })
        setsendMessage(res.data)
    }
    const getAllchat = async () => {
        const res = await axios.post("http://localhost:5000/v2/chat/all", { AllChat }, {
            headers: {
                authorization: `Bearer ${Token}`
            }
        })
        setAllChat(res.data)
    }


    const UserChats = async () => {
        const res = await axios.post(`http://localhost:5000/v2/message/${Chatid}`, { AllChat }, {
            headers: {
                authorization: `Bearer ${Token}`
            }
        })
        setAllChat(res.data)
    }
    return (
        <USerChats.Provider value={{ fetchProfileInfo, GetAllUserInfo, updateUser, getchat, getAllchat, NewMessage ,UserChats}}>
            {children}
        </USerChats.Provider>
    )
}

export default FetchContext

export const useFetchData = () => {
    const context = useContext(USerChats);
    if (!context) {
        throw new Error("useFetchData have some error");
    }
    return context;
};