import React, { useEffect, useState } from 'react'
import { IoPersonCircle } from 'react-icons/io5'
import { ToastContainer, toast } from 'react-toastify';

const MyProfile = () => {

    return (
        <footer className='absolute bottom-3 p-6 m-2 w-[29vw] rounded-lg flex gap-4 items-center border border-gray-500 bg-slate-900'>
            <ToastContainer position="bottom-right" theme="dark" />

            <div className='text-4xl text-white'>
                <IoPersonCircle />
            </div>

            <div className="flex flex-col flex-1">
                <p className='text-xl font-bold text-white truncate'>
                    name
                </p>
                <p className='text-xs text-gray-400'>name</p>
            </div>

            <button
                className='text-sm font-medium text-red-400 hover:text-red-300 transition-colors'
            >
                Logout
            </button>
        </footer>
    )
}

export default MyProfile