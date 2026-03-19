import React, { useState, useEffect } from 'react'
import { IoCheckmarkSharp, IoCloseSharp } from 'react-icons/io5'
import { LuLogOut, LuSettings2, LuPencil } from 'react-icons/lu'
import { useFetchData } from '../Context/FetchContext'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

const ProfileBottom = () => {
    const navigate = useNavigate()
    const { profiledata, UpdateProfileInfo } = useFetchData()
    const [isEditing, setIsEditing] = useState(false)
    const [newName, setNewName] = useState('')

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
        <div className='absolute bottom-0 left-0 w-full bg-[#202c33] border-t border-gray-700 px-2 md:px-4 py-2 md:py-3 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.3)] z-20'>
            <div className='flex items-center gap-2 md:gap-3 min-w-0 flex-1'>
                <div className='relative flex-shrink-0'>
                    <div className='w-8 md:w-11 h-8 md:h-11 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm'>
                        {profiledata?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className='absolute bottom-0 right-0 w-2 md:w-2.5 h-2 md:h-2.5 bg-green-500 border border-[#202c33] rounded-full'></div>
                </div>

                <div className='flex flex-col min-w-0 flex-1'>
                    {isEditing ? (
                        <div className='flex items-center gap-1 bg-[#2a3942] rounded-md px-1.5 md:px-2 py-1 border border-green-500/50'>
                            <input
                                autoFocus
                                className='bg-transparent text-white text-xs md:text-sm outline-none w-full min-w-0'
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleUpdate();
                                    if (e.key === 'Escape') setIsEditing(false);
                                }}
                            />
                            <div className='flex items-center border-l border-gray-600 ml-1 pl-1 gap-0.5 flex-shrink-0'>
                                <button onClick={handleUpdate} className='text-green-500 hover:text-green-400 p-0.5'>
                                    <IoCheckmarkSharp size={14} />
                                </button>
                                <button onClick={() => setIsEditing(false)} className='text-gray-400 hover:text-red-400 p-0.5'>
                                    <IoCloseSharp size={14} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className='flex items-center gap-1 group cursor-pointer' onClick={() => setIsEditing(true)}>
                            <h2 className='text-white text-xs md:text-sm font-bold leading-tight truncate max-w-[90px] md:max-w-[120px]'>
                                {profiledata?.name || "Set Name..."}
                            </h2>
                            <LuPencil size={10} className="md:w-3 md:h-3 text-gray-500 group-hover:text-white transition-colors flex-shrink-0" />
                        </div>
                    )}
                    <span className='text-[8px] md:text-[10px] text-gray-500 uppercase font-bold tracking-wider'>My Profile</span>
                </div>
            </div>

            <div className='flex items-center gap-0.5 md:gap-1 ml-1 md:ml-2 flex-shrink-0'>
                <button
                    className='p-1.5 md:p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-all'
                    title="Logout"
                    onClick={() => {
                        localStorage.removeItem('token')
                        toast.success("Logout successful!!")
                        setTimeout(() => {
                            navigate('/')
                        }, 2000);
                    }}
                >
                    <LuLogOut size={16} className="md:w-5 md:h-5" />
                </button>
                <ToastContainer />
                <button
                    title="Settings"
                    className='p-1.5 md:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-all group'
                >
                    <LuSettings2 size={16} className="md:w-5 md:h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>
            </div>
        </div>
    )
}

export default ProfileBottom