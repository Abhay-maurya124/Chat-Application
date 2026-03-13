import React, { useEffect } from 'react'
import Chatwindow from '../component/Chatwindow'
import Sidebar from '../component/Sidebar'
const Chat = () => {
    return (
        <div className='flex w-full h-screen overflow-hidden'>
            <Sidebar />
            <Chatwindow />
        </div>
    )
}

export default Chat