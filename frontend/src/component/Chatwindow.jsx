import React from 'react'
import { IoPersonCircle } from 'react-icons/io5'
import { GrAttachment } from "react-icons/gr";

const Chatwindow = () => {
    return (
        <div>
            <div className='bg-linear-260 to-black from-blue-950  w-[70vw] h-screen absolute'>
                <div className="hover:bg-[#1b0c8f] p-6 m-2 rounded-lg flex gap-4 items-center border border-gray-500 hover:text-white/90 text-white transition-all ease-in">
                    <p className='text-5xl border rounded-full'>                    <IoPersonCircle />
                    </p>
                    <div>
                        <p className='text-xl font-bold '>Abhay Maurya</p>
                        <p className='text-lg text-green-600 '>Online</p>
                    </div>
                </div>
                <div className=' p-6 m-2 rounded-lg flex gap-4 items-center absolute bottom-10'>
                   <p className='text-xl rounded-full text-white cursor-pointer hover:bg-blue-950 p-3 transition-all ease-in-out'> <GrAttachment /></p>
                    <input type="text" className='border w-[60vw] h-10 px-10 text-xl text-white rounded-lg' placeholder='Enter the message' />
                </div>

            </div>
        </div>
    )
}

export default Chatwindow