import React, { useState } from 'react'
import { LuMessageCircleHeart, LuSearch, LuX } from "react-icons/lu"
import { IoPersonCircle } from "react-icons/io5"
import ProfileBottom from './ProfileBottom.jsx'

const Sidebar = ({ AllChat, getAlluser, createChat, getUserChats }) => {
    const [ToggleSidebar, setToggleSidebar] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const usersArray = Array.isArray(getAlluser) ? getAlluser : (getAlluser?.users || getAlluser?.allUsers || []);

    const filteredGlobalUsers = usersArray.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='bg-[#111b21] w-[30vw] h-screen relative flex flex-col border-r border-gray-700'>
            <div className='h-[120px] flex flex-col justify-center px-4 gap-4 border-b border-gray-700/50 bg-[#202c33]'>
                {ToggleSidebar ? (
                    <div className='flex justify-between items-center animate-in fade-in duration-300'>
                        <div className='flex items-center gap-3'>
                            <div className='bg-blue-600 text-white p-2 rounded-lg shadow-lg'>
                                <LuMessageCircleHeart size={28} />
                            </div>
                            <h1 className='font-bold text-2xl text-white tracking-tight'>Messages</h1>
                        </div>
                        <button onClick={() => setToggleSidebar(false)} className='p-2.5 text-gray-400 hover:bg-gray-700 rounded-full transition-all'>
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
                                placeholder='Search for someone new...'
                                className='w-full bg-[#2a3942] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500 border-none'
                            />
                            <LuSearch className='absolute left-3 top-3 text-gray-500' size={18} />
                        </div>
                        <button onClick={() => { setToggleSidebar(true); setSearchQuery(""); }} className='p-2 text-gray-400 hover:text-red-400'>
                            <LuX size={24} />
                        </button>
                    </div>
                )}
            </div>

            <div className='flex-1 overflow-y-auto bg-[#111b21] pb-20 custom-scrollbar'>
                {ToggleSidebar ? (
                    <div className='flex flex-col'>
                        {AllChat?.chats?.map((item) => {
                            const person = item.user;
                            if (!person?.name) return null;
                            return (
                                <div key={item.chat?._id} onClick={() => getUserChats(item.chat?._id)} className='flex items-center gap-4 px-4 py-3 hover:bg-[#202c33] cursor-pointer border-b border-gray-800/40 transition-all'>
                                    <div className='text-gray-500'><IoPersonCircle size={55} /></div>
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex justify-between items-center'>
                                            <h2 className='text-white font-semibold truncate'>{person.name}</h2>
                                            <span className='text-[10px] text-gray-500'>
                                                {item.chat?.updatedAt ? new Date(item.chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                            </span>
                                        </div>
                                        <div className='flex justify-between items-center gap-2'>
                                            <p className='text-sm text-gray-400 truncate flex-1'>{item.chat?.latestMessage?.text || "Click to say hi!"}</p>
                                            {item.chat?.unSeencount > 0 && (
                                                <div className='bg-green-500 text-[#111b21] text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1'>
                                                    {item.chat.unSeencount}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className='flex flex-col'>
                        <p className='px-4 py-2 text-xs font-bold text-blue-500 uppercase tracking-widest'>All Users</p>
                        {filteredGlobalUsers?.map((user) => (
                            <div key={user._id} onClick={() => { createChat(user._id); setToggleSidebar(true); }} className='flex items-center gap-4 px-4 py-3 hover:bg-[#202c33] cursor-pointer border-b border-gray-800/40 transition-all'>
                                <div className='text-blue-500'><IoPersonCircle size={50} /></div>
                                <div className='flex-1'>
                                    <h2 className='text-white font-medium'>{user.name}</h2>
                                    <p className='text-xs text-gray-500'>{user.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <ProfileBottom value={AllChat} />
        </div>
    )
}

export default Sidebar;