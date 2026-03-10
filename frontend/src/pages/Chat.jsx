import React from 'react'
import Chatwindow from '../component/Chatwindow'
import Sidebar from '../component/Sidebar'

const Chat = () => {
    return (
        <div className='grid grid-cols-2 absolute'>
            <Sidebar />
            <Chatwindow />
        </div>
    )
}

export default Chat