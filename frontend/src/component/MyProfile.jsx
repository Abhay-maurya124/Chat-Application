import React from 'react'
import { IoPersonCircle } from 'react-icons/io5'
import { ToastContainer, toast } from 'react-toastify'

const MyProfile = ({ name, email, onLogout }) => {
    return (
        <footer className='absolute bottom-3 p-4 m-2 w-[28vw] rounded-lg flex gap-4 items-center border border-gray-500 bg-slate-900'>
            <ToastContainer position="bottom-right" theme="dark" />
            <div className='text-4xl text-white'>
                <IoPersonCircle />
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
                <p className='text-base font-bold text-white truncate'>
                    {name || "User Name"}
                </p>
                <p className='text-xs text-gray-400 truncate'>{email || "user@email.com"}</p>
            </div>
            <button
                onClick={onLogout}
                className='text-sm font-medium text-red-400 hover:text-red-300 transition-colors whitespace-nowrap'
            >
                Logout
            </button>
        </footer>
    )
}

export default MyProfile