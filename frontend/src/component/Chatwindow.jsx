import React, { useState, useEffect, useRef } from 'react'
import { IoPersonCircle, IoSend, IoCheckmarkDone, IoCheckmark, IoArrowBack } from 'react-icons/io5'
import { useFetchData } from '../Context/FetchContext'
import { useSocket } from '../Context/Socket'

const Chatwindow = ({ onBackClick }) => {
    const {
        Getmessages,
        NewMessage,
        profiledata,
        setGetmessages,
        getUserAllChats,
        activeChatIdRef
    } = useFetchData()
    const { socket } = useSocket()
    const [text, setText] = useState('')
    const scrollRef = useRef(null)

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [Getmessages?.messages]);

    useEffect(() => {
        if (socket && Getmessages?.activeChatId && profiledata?._id) {
            socket.emit("markAsSeen", {
                chatId: Getmessages.activeChatId,
                userId: profiledata._id
            });
        }
    }, [Getmessages?.activeChatId, Getmessages?.messages?.length, socket, profiledata?._id]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (msg) => {
            const isCurrentChat = activeChatIdRef.current === msg.chatId;

            if (isCurrentChat) {
                setGetmessages(prev => {
                    const exists = prev.messages.some(m => m._id === msg._id);
                    if (exists) return prev;
                    return { ...prev, messages: [...prev.messages, msg] };
                });

                socket.emit("markAsSeen", {
                    chatId: msg.chatId,
                    userId: profiledata?._id
                });
            }

            getUserAllChats();
        };

        const handleMessagesSeen = ({ chatId, messageIds }) => {
            if (activeChatIdRef.current === chatId) {
                setGetmessages(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        messages: prev.messages.map(m => 
                            messageIds.includes(m._id.toString()) 
                                ? { ...m, seen: true } 
                                : m
                        )
                    };
                });
            }
        };

        socket.on("newMessage", handleNewMessage);
        socket.on("messagesSeen", handleMessagesSeen);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("messagesSeen", handleMessagesSeen);
        };
    }, [socket, profiledata?._id, setGetmessages, getUserAllChats, activeChatIdRef]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        const cid = Getmessages.activeChatId;
        await NewMessage(cid, text);
        setText('');
    };

    if (!Getmessages) {
        return (
            <div className="flex-1 bg-[#0b141a] flex items-center justify-center text-gray-400 px-4">
                <p className="text-center text-sm md:text-base">Select a chat to start messaging</p>
            </div>
        );
    }

    return (
        <div className='bg-[#0b141a] flex-1 flex flex-col h-screen md:h-full'>
            <div className="bg-[#202c33] p-3 md:p-4 text-white flex items-center gap-3 border-b border-gray-700">
                {onBackClick && (
                    <button
                        onClick={onBackClick}
                        className="md:hidden p-2 hover:bg-gray-700 rounded-full transition-all -ml-2"
                    >
                        <IoArrowBack size={24} />
                    </button>
                )}
                <IoPersonCircle size={40} className="text-gray-400" />
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate text-sm md:text-base">{Getmessages.user?.name}</p>
                    <p className="text-xs text-gray-400">Active now</p>
                </div>
            </div>

            <div className='flex-1 overflow-y-auto p-3 md:p-4 flex flex-col gap-2 bg-[#0b141a]'>
                {Getmessages.messages?.map((msg) => (
                    <div
                        key={msg._id}
                        className={`flex ${msg.senderId === profiledata?._id ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`p-2 md:p-3 rounded-lg max-w-xs md:max-w-md text-sm md:text-base ${msg.senderId === profiledata?._id ? 'bg-[#005c4b] text-white' : 'bg-[#202c33] text-gray-100'} break-words`}>
                            {msg.image && (
                                <div className="mb-2">
                                    <img src={msg.image.url} alt="sent" className="rounded max-w-xs h-auto" />
                                </div>
                            )}
                            {msg.text && <p>{msg.text}</p>}
                            {msg.senderId === profiledata?._id && (
                                <div className="flex justify-end text-xs mt-1 gap-1">
                                    {msg.seen
                                        ? <IoCheckmarkDone className="text-blue-400" size={16} />
                                        : <IoCheckmark className="text-gray-500" size={16} />
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 md:p-4 bg-[#202c33] flex gap-2 border-t border-gray-700">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-[#2a3942] rounded-lg p-2 md:p-3 text-white text-sm md:text-base placeholder-gray-500 outline-none focus:ring-1 focus:ring-green-500 border-none"
                />
                <button 
                    type="submit" 
                    className="text-white hover:text-green-400 p-2 hover:bg-[#2a3942] rounded-lg transition-all"
                >
                    <IoSend size={20} />
                </button>
            </form>
        </div>
    );
}

export default Chatwindow;