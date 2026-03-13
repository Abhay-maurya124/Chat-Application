import React, { useState } from 'react'
import { IoPersonCircle } from 'react-icons/io5'
import { GrAttachment } from "react-icons/gr"
import { IoSend } from "react-icons/io5"
import { useFetchData } from '../Context/FetchContext'

const Chatwindow = () => {
const {} = useFetchData()
 

    return (
        <div className='bg-gradient-to-br from-blue-950 to-black w-[70vw] h-screen absolute right-0 flex flex-col'>
            {/* <div className="hover:bg-[#1b0c8f] p-6 m-2 rounded-lg flex gap-4 items-center border border-gray-500 hover:text-white/90 text-white transition-all ease-in cursor-pointer">
                <p className='text-5xl border rounded-full'>
                    <IoPersonCircle />
                </p>
                <div>
                    <p className='text-xl font-bold'>Abhay Maurya</p>
                    <p className='text-lg text-green-500'>Online</p>
                </div>
            </div>

            <div className='flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3'>
                
            </div>

            <div className='p-4 mx-2 mb-4 rounded-lg flex gap-3 items-center border border-gray-600 bg-blue-950/30 backdrop-blur'>
                <label className='text-xl text-white cursor-pointer hover:bg-blue-800 p-3 rounded-full transition-all ease-in-out'>
                    <GrAttachment />
                    <input type="file" className='hidden' />
                </label>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className='flex-1 h-11 px-4 text-base text-white rounded-lg bg-blue-900/40 border border-gray-600 focus:outline-none focus:border-blue-400 placeholder:text-gray-400'
                    placeholder='Type a message...'
                />
                <button
                    onClick={handleSend}
                    className='text-xl text-white cursor-pointer hover:bg-blue-600 p-3 rounded-full transition-all ease-in-out'
                >
                    <IoSend />
                </button>
            </div> */}
        </div>
    )
}

export default Chatwindow