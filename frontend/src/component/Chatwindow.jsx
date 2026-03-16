import React, { useState, useEffect, useRef } from 'react'
import { IoPersonCircle, IoSend, IoCheckmarkDone, IoCheckmark } from 'react-icons/io5'
import { useFetchData } from '../Context/FetchContext'
import { useSocket } from '../Context/Socket'

const Chatwindow = () => {
    const { Getmessages, NewMessage, profiledata, setGetmessages, getUserAllChats } = useFetchData()
    const { socket } = useSocket()
    const [text, setText] = useState('')
    const scrollRef = useRef(null)

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [Getmessages?.messages]);

    useEffect(() => {
        if (!socket) return;

        socket.on("newMessage", (msg) => {
            if (Getmessages?.activeChatId === msg.chatId) {
                setGetmessages(prev => ({ ...prev, messages: [...prev.messages, msg] }));
            }
            getUserAllChats();
        });

        socket.on("messagesSeen", ({ chatId }) => {
            if (Getmessages?.activeChatId === chatId) {
                setGetmessages(prev => ({
                    ...prev,
                    messages: prev.messages.map(m => ({ ...m, seen: true }))
                }));
            }
        });

        return () => {
            socket.off("newMessage");
            socket.off("messagesSeen");
        };
    }, [socket, Getmessages?.activeChatId]);

    if (!Getmessages) return <div className="flex-1 bg-[#222e35]" />;

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text) return;
        const cid = Getmessages.activeChatId;
        await NewMessage(cid, text);
        setText('');
    };
    useEffect(() => {
        if (!socket || !setGetmessages) return;

        const handleNewMessage = (newMessage) => {
            const isFromOtherUser = newMessage.senderId !== profiledata?._id;

            if (Getmessages?.activeChatId === newMessage.chatId && isFromOtherUser) {
                setGetmessages((prev) => ({
                    ...prev,
                    messages: [...(prev?.messages || []), newMessage]
                }));
            }
            getUserAllChats();
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket, Getmessages?.activeChatId, profiledata?._id]);
    return (
        <div className='bg-[#0b141a] flex-1 flex flex-col'>
            <div className="bg-[#202c33] p-4 text-white flex items-center gap-3">
                <IoPersonCircle size={40} />
                <p>{Getmessages.user?.name}</p>
            </div>
            <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-2'>
                {Getmessages.messages?.map((msg) => (
                    <div key={msg._id} className={`flex ${msg.senderId === profiledata?._id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-2 rounded-lg max-w-xs ${msg.senderId === profiledata?._id ? 'bg-[#005c4b]' : 'bg-[#202c33]'} text-white`}>
                            {msg.text}
                            <div className="flex justify-end text-xs">
                                {msg.senderId === profiledata?._id && (msg.seen ? <IoCheckmarkDone className="text-blue-400" /> : <IoCheckmark />)}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>
            <form onSubmit={handleSend} className="p-4 bg-[#202c33] flex gap-2">
                <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 bg-[#2a3942] rounded p-2 text-white" />
                <button type="submit" className="text-white"><IoSend size={24} /></button>
            </form>
        </div>
    )
}
export default Chatwindow;