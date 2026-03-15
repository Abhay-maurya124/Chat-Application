import React, { useState, useEffect } from 'react'
import { IoPersonCircle, IoCheckmarkSharp, IoCloseSharp } from 'react-icons/io5'
import { LuLogOut, LuSettings2, LuPencil } from 'react-icons/lu'
import { useFetchData } from '../Context/FetchContext'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
const ProfileBottom = () => {
    const navigate = useNavigate()
    const { profiledata,
        UpdateProfileInfo } = useFetchData()
    const [isEditing, setIsEditing] = useState(false)
    const [newName, setNewName] = useState('')

    // Keep state in sync with context data
    useEffect(() => {
        if (profiledata?.name) {
            setNewName(profiledata.name)
        }
    }, [profiledata])

    const handleUpdate = () => {
        if (newName.trim() !== "" && newName !== profiledata?.name) {
            UpdateProfileInfo(newName)
        }
        setIsEditing(false)
    }

    return (
        <div className='absolute bottom-0 left-0 w-full bg-[#202c33] border-t border-gray-700 px-4 py-3 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.3)] z-20'>
            <div className='flex items-center gap-3 min-w-0 flex-1'>
                {/* Avatar Section */}
                <div className='relative flex-shrink-0'>
                    <IoPersonCircle size={45} className='text-gray-400' />
                    <div className='absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#202c33] rounded-full'></div>
                </div>

                {/* Name/Input Section */}
                <div className='flex flex-col min-w-0 flex-1'>
                    {isEditing ? (
                        <div className='flex items-center gap-1 bg-[#2a3942] rounded-md px-2 py-1 border border-green-500/50 animate-in fade-in zoom-in-95 duration-200'>
                            <input
                                autoFocus
                                className='bg-transparent text-white text-sm outline-none w-full'
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleUpdate();
                                    if (e.key === 'Escape') setIsEditing(false);
                                }}
                            />
                            <div className='flex items-center border-l border-gray-600 ml-1 pl-1 gap-1'>
                                <button onClick={handleUpdate} className='text-green-500 hover:text-green-400'>
                                    <IoCheckmarkSharp size={18} />
                                </button>
                                <button onClick={() => setIsEditing(false)} className='text-gray-400 hover:text-red-400'>
                                    <IoCloseSharp size={18} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className='flex items-center gap-2 group cursor-pointer' onClick={() => setIsEditing(true)}>
                            <h2 className='text-white text-sm font-bold leading-tight truncate max-w-[120px]'>
                                {profiledata?.name || "Set Name..."}
                            </h2>
                            <LuPencil size={12} className='text-gray-500 group-hover:text-white transition-colors' />
                        </div>
                    )}
                    <span className='text-[10px] text-gray-500 uppercase font-bold tracking-wider'>My Profile</span>
                </div>
            </div>

            {/* Actions Section */}
            <div className='flex items-center gap-1 ml-2'>
                <button
                    className='p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-all'
                    title="Logout"
                    onClick={() => {
                        localStorage.removeItem('token')
                        toast.success("Logout successful!!")
                        setTimeout(() => {
                            navigate('/')
                        }, 2000);
                    }}
                >
                   
                    <LuLogOut size={18} />
                </button>
                 <ToastContainer />
                <button
                    title="Settings"
                    className='p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-all group'
                >
                    <LuSettings2 size={20} className='group-hover:rotate-90 transition-transform duration-300' />
                </button>
            </div>
        </div>
    )
}

export default ProfileBottom