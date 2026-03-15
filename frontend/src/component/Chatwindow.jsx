import React, { useState } from 'react'
import { IoPersonCircle, IoSend, IoCheckmark, IoCheckmarkDone } from 'react-icons/io5'
import { GrAttachment } from "react-icons/gr"
import { useFetchData } from '../Context/FetchContext'

const Chatwindow = () => {
    const { Getmessages, NewMessage, profiledata, getUserChats } = useFetchData()
    const [text, setText] = useState('')
    const [image, setImage] = useState(null)

    if (!Getmessages) {
        return (
            <div className='flex-1 bg-[#222e35] h-screen flex flex-col items-center justify-center text-gray-400 border-l border-gray-700'>
                <div className='text-6xl mb-4'>💬</div>
                <h1 className='text-2xl font-light'>Select a conversation</h1>
            </div>
        )
    }

    const handleSendmsg = async (e) => {
        e.preventDefault();
        if (!text && !image) return;
        const idToSend = Getmessages.activeChatId;
        await NewMessage(idToSend, text, image);
        setText('');
        setImage(null);
        await getUserChats(idToSend);
    }

    return (
        <div className='bg-[#0b141a] w-[70vw] h-screen flex flex-col border-l border-gray-700'>
            <div className="bg-[#202c33] p-4 flex gap-4 items-center text-white shadow-md">
                <p className='text-4xl text-gray-400'><IoPersonCircle /></p>
                <div className='flex-1'>
                    <p className='text-base font-semibold'>{Getmessages.user?.name || "User"}</p>
                    <p className='text-xs text-green-500'>online</p>
                </div>
            </div>

            <div className='flex-1 overflow-y-auto px-10 py-4 flex flex-col gap-2 bg-[#0b141a] custom-scrollbar'>
                {Getmessages.messages?.map((msg) => {
                    const isMe = msg.senderId === profiledata?._id;
                    return (
                        <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[60%] px-3 py-1.5 rounded-lg text-sm shadow-sm ${isMe ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-white rounded-tl-none'}`}>
                                {msg.image && <img src={msg.image} alt="sent" className="rounded mb-1 max-h-60 w-full object-cover" />}
                                <p>{msg.text}</p>
                                <div className='flex items-center justify-end gap-1 mt-1'>
                                    <p className='text-[10px] text-gray-400'>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    {isMe && (
                                        <span className={msg.seen ? "text-blue-400" : "text-gray-400"}>
                                            {msg.seen ? <IoCheckmarkDone size={16} /> : <IoCheckmark size={16} />}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className='bg-[#202c33] p-3 flex items-center gap-3'>
                <form onSubmit={handleSendmsg} className='flex-1 flex items-center gap-3'>
                    <label className='text-xl text-gray-400 cursor-pointer hover:text-white'>
                        <GrAttachment /><input type="file" className='hidden' onChange={(e) => setImage(e.target.files[0])} />
                    </label>
                    <div className='flex-1 relative'>
                        {image && <div className='absolute -top-12 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded'>Attached: {image.name}</div>}
                        <input type="text" value={text} onChange={(e) => setText(e.target.value)} className='w-full h-10 px-4 text-sm text-white rounded-lg bg-[#2a3942] focus:outline-none' placeholder='Type a message...' />
                    </div>
                    <button className='text-xl text-gray-400 hover:text-white' type='submit' disabled={!text && !image}><IoSend /></button>
                </form>
            </div>
        </div>
    )
}

export default Chatwindow;