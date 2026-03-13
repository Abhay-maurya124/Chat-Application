import React, { useState } from 'react'
import { LuMessageCircleHeart, LuSearch, LuX } from "react-icons/lu"
import { IoPersonCircle } from "react-icons/io5"
import { useFetchData } from '../Context/FetchContext.jsx'

const Sidebar = () => {
    const [ToggleSidebar, setToggleSidebar] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    
    // Destructure everything we need from Context
    const { AllChat, getAlluser, createChat, Loading } = useFetchData()

    // 1. Dynamic Search Logic
    // If ToggleSidebar is false, we filter the global user list
    const filteredUsers = getAlluser?.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className='bg-[#111b21] w-[30vw] h-screen relative flex flex-col border-r border-gray-700'>
            
            {/* --- HEADER SECTION --- */}
            <div className='h-[120px] flex flex-col justify-center px-4 gap-4 border-b border-gray-700/50 bg-[#202c33]'>
                {ToggleSidebar ? (
                    <div className='flex justify-between items-center animate-in fade-in duration-300'>
                        <div className='flex items-center gap-3'>
                            <div className='bg-blue-600 text-white p-2 rounded-lg shadow-lg'>
                                <LuMessageCircleHeart size={28} />
                            </div>
                            <h1 className='font-bold text-2xl text-white tracking-tight'>Messages</h1>
                        </div>
                        <button
                            onClick={() => setToggleSidebar(false)}
                            className='p-2.5 text-gray-400 hover:bg-gray-700 rounded-full transition-all'
                        >
                            <LuSearch size={24} />
                        </button>
                    </div>
                ) : (
                    <div className='flex items-center gap-2 animate-in slide-in-from-right-4 duration-300'>
                        <div className='flex-1 relative'>
                            <input
                                autoFocus
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder='Search users to start chat...'
                                className='w-full bg-[#2a3942] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500 border-none placeholder:text-gray-500'
                            />
                            <LuSearch className='absolute left-3 top-3 text-gray-500' size={18} />
                        </div>
                        <button 
                            onClick={() => {
                                setToggleSidebar(true);
                                setSearchQuery("");
                            }} 
                            className='p-2 text-gray-400 hover:text-red-400'
                        >
                            <LuX size={24} />
                        </button>
                    </div>
                )}
            </div>

            {/* --- LIST AREA --- */}
            <div className='flex-1 overflow-y-auto bg-[#111b21] custom-scrollbar'>
                
                {ToggleSidebar ? (
                    /* VIEW 1: EXISTING CHATS */
                    <div className='flex flex-col'>
                        {AllChat?.chats?.map((chat) => (
                            <div 
                                key={chat._id} 
                                className='flex items-center gap-4 px-4 py-3 hover:bg-[#202c33] cursor-pointer border-b border-gray-800/40 transition-all'
                            >
                                <div className='text-gray-500'><IoPersonCircle size={55} /></div>
                                <div className='flex-1 min-w-0'>
                                    <div className='flex justify-between items-center'>
                                        <h2 className='text-white font-semibold truncate'>{chat.chatName || "Chat"}</h2>
                                        <span className='text-[10px] text-gray-400'>
                                            {chat.latestMessage ? new Date(chat.latestMessage.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                                        </span>
                                    </div>
                                    <p className='text-sm text-gray-500 truncate'>{chat.latestMessage?.text || "No messages yet"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* VIEW 2: SEARCH NEW USERS */
                    <div className='flex flex-col'>
                        <p className='px-4 py-2 text-xs font-bold text-green-500 uppercase tracking-widest'>Global Users</p>
                        {filteredUsers?.length > 0 ? (
                            filteredUsers.map((user) => (
                                <div 
                                    key={user._id}
                                    onClick={() => createChat(user._id)}
                                    className='flex items-center gap-4 px-4 py-3 hover:bg-[#202c33] cursor-pointer border-b border-gray-800/40'
                                >
                                    <div className='text-blue-500'><IoPersonCircle size={50} /></div>
                                    <div className='flex-1'>
                                        <h2 className='text-white font-medium'>{user.name}</h2>
                                        <p className='text-xs text-gray-500'>Click to start messaging</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='p-10 text-center text-gray-500 text-sm'>
                                {searchQuery ? "No users found" : "Start typing to find someone..."}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Sidebar