import React from 'react'
import { LuMessageCircleHeart } from "react-icons/lu";
import { IoPersonCircle } from "react-icons/io5";
import { IoPersonAddSharp } from "react-icons/io5";
import { HiArrowUturnLeft } from "react-icons/hi2";
import MyProfile from './MyProfile';

const Sidebar = () => {

    return (
        <div>
            <div className='bg-blue-900 w-[30vw] h-screen'>
                <div className='flex justify-between px-10 text-xl font-bold text-white items-center border-b border-gray-500 py-4'>
                    <p className='bg-blue-500 text-3xl p-2'><LuMessageCircleHeart /></p>
                    <span className='font-black text-2xl'>Messages</span>
                    <button className='bg-green-500 p-2 text-black/70 text-center rounded text-2xl'><IoPersonAddSharp />
                    </button>
                </div>
                <div className="hover:bg-[#1b0c8f] p-6 m-2 rounded-lg flex gap-4 items-center border border-gray-500 hover:text-white/90 text-white transition-all ease-in">
                    <p className='text-5xl border rounded-full'>                    <IoPersonCircle />
                    </p>                    <div>
                        <p className='text-xl font-bold '>Abhay Maurya</p>
                        <p className='text-lg '><HiArrowUturnLeft /></p>
                    </div>
                </div>
                <MyProfile />

            </div>

        </div>
    )
}

export default Sidebar