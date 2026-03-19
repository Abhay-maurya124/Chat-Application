import React, { useState, useEffect } from 'react'
import { LuMessageCircleHeart, LuSearch, LuX, LuMenu } from "react-icons/lu"
import { IoPersonCircle } from "react-icons/io5"
import ProfileBottom from './ProfileBottom.jsx'
import { useSocket } from '../Context/Socket.jsx'
import { useFetchData } from '../Context/FetchContext'

const Sidebar = ({ AllChat, allUsers, createChat, getUserChats, showSidebar, onClose }) => {
    const [ToggleSidebar, setToggleSidebar] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const { onlineUsers, socket } = useSocket()
    const { profiledata, setAllChat, activeChatIdRef } = useFetchData()

    const usersArray = Array.isArray(allUsers)
        ? allUsers
        : (allUsers?.user || allUsers?.users || allUsers?.allUsers || []);

    const filteredGlobalUsers = usersArray.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        if (!socket) return;

        const handleUpdateSeen = ({ chatId, userId }) => {
            if (userId === profiledata?._id || chatId === activeChatIdRef.current) {
                setAllChat(prev => {
                    if (!prev?.chats) return prev;
                    return {
                        ...prev,
                        chats: prev.chats.map(item =>
                            item.chat._id === chatId
                                ? { ...item, chat: { ...item.chat, unSeencount: 0 } }
                                : item
                        )
                    };
                });
            }
        };

        socket.on("messagesSeen", handleUpdateSeen);
        return () => socket.off("messagesSeen", handleUpdateSeen);
    }, [socket, profiledata?._id, setAllChat, activeChatIdRef]);

    const handleChatClick = (chatId) => {
        getUserChats(chatId);
        onClose?.();
    };

    const sidebarContent = (
        <>
            <div className='h-24 md:h-28 flex flex-col justify-center px-3 md:px-4 gap-3 md:gap-4 border-b border-gray-700/50 bg-[#202c33]'>
                {ToggleSidebar ? (
                    <div className='flex justify-between items-center animate-in fade-in duration-300'>
                        <div className='flex items-center gap-2 md:gap-3 min-w-0'>
                            <div className='bg-blue-600 text-white p-2 rounded-lg shadow-lg flex-shrink-0'>
                                <LuMessageCircleHeart size={24} className="md:w-7 md:h-7" />
                            </div>
                            <h1 className='font-bold text-lg md:text-2xl text-white tracking-tight truncate'>Messages</h1>
                        </div>
                        <button
                            onClick={() => setToggleSidebar(false)}
                            className='p-2 text-gray-400 hover:bg-gray-700 rounded-full transition-all flex-shrink-0'
                        >
                            <LuSearch size={20} className="md:w-6 md:h-6" />
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
                                placeholder='Search users...'
                                className='w-full bg-[#2a3942] text-white text-xs md:text-sm rounded-lg pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500 border-none'
                            />
                            <LuSearch className='absolute left-2 md:left-3 top-2.5 md:top-3 text-gray-500 flex-shrink-0' size={16} />
                        </div>
                        <button
                            onClick={() => { setToggleSidebar(true); setSearchQuery(""); }}
                            className='p-2 text-gray-400 hover:text-red-400 flex-shrink-0'
                        >
                            <LuX size={20} />
                        </button>
                    </div>
                )}
            </div>

            <div className='flex-1 overflow-y-auto bg-[#111b21] pb-24 md:pb-20 custom-scrollbar'>
                {ToggleSidebar ? (
                    <div className='flex flex-col'>
                        {AllChat?.chats?.map((item) => {
                            const person = item.user;
                            const isOnline = onlineUsers.includes(person?._id);
                            if (!person?.name) return null;
                            return (
                                <div
                                    key={item.chat?._id}
                                    onClick={() => handleChatClick(item.chat?._id)}
                                    className='flex items-center gap-2 md:gap-4 px-3 md:px-4 py-2 md:py-3 hover:bg-[#202c33] cursor-pointer border-b border-gray-800/40 transition-all active:bg-gray-800'
                                >
                                    <div className='relative text-gray-500 flex-shrink-0'>
                                        <IoPersonCircle size={40} className="md:w-14 md:h-14" />
                                        {isOnline && (
                                            <span className='absolute bottom-0 right-0 w-2.5 md:w-3 h-2.5 md:h-3 bg-green-500 rounded-full border-2 border-[#111b21]'></span>
                                        )}
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex justify-between items-center gap-2'>
                                            <h2 className='text-white font-semibold truncate text-xs md:text-base'>{person.name}</h2>
                                            <span className='text-[9px] md:text-[10px] text-gray-500 flex-shrink-0'>
                                                {item.chat?.updatedAt
                                                    ? new Date(item.chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                    : ""}
                                            </span>
                                        </div>
                                        <div className='flex justify-between items-center gap-2 mt-1'>
                                            <p className='text-xs md:text-sm text-gray-400 truncate flex-1'>
                                                {item.chat?.latestMessage?.text || "Click to say hi!"}
                                            </p>
                                            {item.chat?.unSeencount > 0 && (
                                                <div className='bg-green-500 text-[#111b21] text-[9px] md:text-[10px] font-bold min-w-[18px] md:min-w-[22px] h-[18px] md:h-[22px] rounded-full flex items-center justify-center px-1 flex-shrink-0'>
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
                        <p className='px-3 md:px-4 py-2 text-[10px] md:text-xs font-bold text-blue-500 uppercase tracking-widest'>All Users</p>
                        {filteredGlobalUsers?.map((user) => {
                            const isOnline = onlineUsers.includes(user?._id);
                            return (
                                <div
                                    key={user._id}
                                    onClick={() => { createChat(user._id); setToggleSidebar(true); onClose?.(); }}
                                    className='flex items-center gap-2 md:gap-4 px-3 md:px-4 py-2 md:py-3 hover:bg-[#202c33] cursor-pointer border-b border-gray-800/40 transition-all active:bg-gray-800'
                                >
                                    <div className='relative text-blue-500 flex-shrink-0'>
                                        <IoPersonCircle size={36} className="md:w-12 md:h-12" />
                                        {isOnline && (
                                            <span className='absolute bottom-0 right-0 w-2.5 md:w-3 h-2.5 md:h-3 bg-green-500 rounded-full border-2 border-[#111b21]'></span>
                                        )}
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <h2 className='text-white font-medium text-xs md:text-base truncate'>{user.name}</h2>
                                        <p className='text-[9px] md:text-xs text-gray-500 truncate'>{user.email}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <ProfileBottom value={AllChat} />
        </>
    );

    return (
        <>
            <div className='hidden md:flex bg-[#111b21] w-[30vw] min-w-[280px] h-screen relative flex-col border-r border-gray-700'>
                {sidebarContent}
            </div>

            {showSidebar && (
                <>
                    <div
                        className='fixed inset-0 bg-black/50 md:hidden z-40'
                        onClick={onClose}
                    />
                    <div className='fixed left-0 top-0 h-screen w-[75vw] max-w-sm bg-[#111b21] flex flex-col border-r border-gray-700 z-50 animate-in slide-in-from-left-full duration-300'>
                        {sidebarContent}
                    </div>
                </>
            )}
        </>
    );
}

export default Sidebar;