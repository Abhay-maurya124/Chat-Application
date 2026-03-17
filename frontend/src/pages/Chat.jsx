import React, { useEffect } from 'react'
import Chatwindow from '../component/Chatwindow'
import Sidebar from '../component/Sidebar'
import { useFetchData } from '../Context/FetchContext'
const Chat = () => {
    const { AllChat, allUsers, createChat, profiledata, getUserChats } = useFetchData()
    useEffect(() => {
        getUserChats
    }, [])
    return (

        <div className='flex w-full h-screen overflow-hidden'>
            <Sidebar {...{ AllChat, allUsers, createChat, profiledata, getUserChats }} />
            <Chatwindow />
        </div>
    )
}

export default Chat