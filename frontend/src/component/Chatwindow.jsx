import React, { useState, useEffect, useRef } from 'react'
import { IoPersonCircle, IoSend, IoCheckmarkDone, IoCheckmark } from 'react-icons/io5'
import { useFetchData } from '../Context/FetchContext'
import { useSocket } from '../Context/Socket'

const Chatwindow = () => {
    const { Getmessages, NewMessage, profiledata, setGetmessages, getUserAllChats } = useFetchData()
    const { socket } = useSocket()
    const [text, setText] = useState('')
    const scrollRef = useRef(null)

    // Auto-scroll on new messages
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [Getmessages?.messages]);

    // ✅ Mark as seen when opening a chat or receiving a new message while in it
    useEffect(() => {
        if (socket && Getmessages?.activeChatId && profiledata?._id) {
            socket.emit("markAsSeen", {
                chatId: Getmessages.activeChatId,
                userId: profiledata._id
            });
        }
    }, [Getmessages?.activeChatId, Getmessages?.messages?.length, socket, profiledata?._id]);

    // ✅ FIX: getUserAllChats added to dep array so the ref is always fresh
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (msg) => {
            if (Getmessages?.activeChatId === msg.chatId) {
                setGetmessages(prev => {
                    // Deduplicate by _id
                    const exists = prev.messages.some(m => m._id === msg._id);
                    if (exists) return prev;
                    return { ...prev, messages: [...prev.messages, msg] };
                });
                // Mark instantly seen since this chat is open
                socket.emit("markAsSeen", {
                    chatId: msg.chatId,
                    userId: profiledata?._id
                });
            }
            // Refresh sidebar unread counts
            getUserAllChats();
        };

        // ✅ FIX: Update ALL messages to seen:true so double-tick shows correctly
        const handleMessagesSeen = ({ chatId }) => {
            if (Getmessages?.activeChatId === chatId) {
                setGetmessages(prev => ({
                    ...prev,
                    messages: prev.messages.map(m => ({ ...m, seen: true }))
                }));
            }
        };

        socket.on("newMessage", handleNewMessage);
        socket.on("messagesSeen", handleMessagesSeen);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("messagesSeen", handleMessagesSeen);
        };
    }, [socket, Getmessages?.activeChatId, profiledata?._id, setGetmessages, getUserAllChats]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        const cid = Getmessages.activeChatId;
        await NewMessage(cid, text);
        setText('');
    };

    if (!Getmessages) {
        return (
            <div className="flex-1 bg-[#222e35] flex items-center justify-center text-gray-400">
                <p>Select a chat to start messaging</p>
            </div>
        );
    }

    return (
        <div className='bg-[#0b141a] flex-1 flex flex-col'>
            {/* Header */}
            <div className="bg-[#202c33] p-4 text-white flex items-center gap-3">
                <IoPersonCircle size={40} />
                <p>{Getmessages.user?.name}</p>
            </div>

            {/* Messages */}
            <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-2'>
                {Getmessages.messages?.map((msg) => (
                    <div
                        key={msg._id}
                        className={`flex ${msg.senderId === profiledata?._id ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`p-2 rounded-lg max-w-xs ${msg.senderId === profiledata?._id ? 'bg-[#005c4b]' : 'bg-[#202c33]'} text-white`}>
                            {msg.text}
                            {/* ✅ Single tick = sent, Double blue tick = seen */}
                            {msg.senderId === profiledata?._id && (
                                <div className="flex justify-end text-xs mt-1">
                                    {msg.seen
                                        ? <IoCheckmarkDone className="text-blue-400" />
                                        : <IoCheckmark className="text-gray-400" />
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-[#202c33] flex gap-2">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-[#2a3942] rounded p-2 text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-green-500"
                />
                <button type="submit" className="text-white">
                    <IoSend size={24} />
                </button>
            </form>
        </div>
    )
}

export default Chatwindow;