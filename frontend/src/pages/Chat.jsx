import React, { useEffect, useState } from 'react'
import Chatwindow from '../component/Chatwindow'
import Sidebar from '../component/Sidebar'
import { useFetchData } from '../Context/FetchContext'
import { LuMenu, LuX } from 'react-icons/lu'

const Chat = () => {
    const { AllChat, allUsers, createChat, profiledata, getUserChats } = useFetchData()
    const [showSidebar, setShowSidebar] = useState(false)

    useEffect(() => {
        getUserChats
    }, [])

    return (
        <div className='flex w-full h-screen overflow-hidden bg-[#0b141a]'>
            <Sidebar 
                AllChat={AllChat} 
                allUsers={allUsers} 
                createChat={createChat} 
                profiledata={profiledata} 
                getUserChats={getUserChats}
                showSidebar={showSidebar}
                onClose={() => setShowSidebar(false)}
            />
            
            <div className='flex-1 flex flex-col relative h-full md:h-screen'>
                <div className='md:hidden bg-[#202c33] p-3 flex items-center justify-between border-b border-gray-700 z-30'>
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className='p-2 hover:bg-gray-700 rounded-full transition-all'
                    >
                        {showSidebar ? <LuX size={24} /> : <LuMenu size={24} />}
                    </button>
                    <span className='text-white font-semibold text-sm'>Chat</span>
                    <div className='w-10' />
                </div>
                
                <Chatwindow onBackClick={() => setShowSidebar(true)} />
            </div>
        </div>
    )
}

export default Chat