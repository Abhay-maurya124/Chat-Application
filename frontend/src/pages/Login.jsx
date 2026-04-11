import React, { useEffect, useState } from 'react'
import { useChatState } from '../Context/NewContext';
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
    const { loading, setloading } = useChatState()
    const [email, setemail] = useState("")
    const navigate = useNavigate()
  const userURL = import.meta.env.VITE_USER_SERVICE_URL;

    const handleSubmit = async (e) => {
        setloading(true)
        e.preventDefault()
        try {
            const res = await axios.post(`${userURL}/v1/user/login`, { email })
            console.log(res)
            if (res.data.success == true) {
                toast("Otp Sent successful");
                setTimeout(() => {
                    navigate(`/verify?email=${email}`)
                }, 3000);
            }
        } catch (error) {
            console.log(error)
            toast("Too many request wait for 5 min and Try again !");
            setloading(false)
        }
    };

    return (
        <div className="min-h-screen w-full flex absolute overflow-hidden md:overflow-y-auto items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-black px-4 flex-col">
            <ToastContainer theme='dark' />

            <div className="mb-6 md:mb-8 text-center">
                <h2 className="text-indigo-400 font-medium tracking-widest uppercase text-xs md:text-sm mb-2 md:mb-3">Secure Access</h2>
                <h1 className="text-2xl md:text-4xl font-extrabold text-white">
                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">ChatApp</span>
                </h1>
            </div>

            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 transition-all">
                <h1 className="text-xl md:text-2xl font-bold text-white text-center mb-6 md:mb-8">
                    Login Now
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <div className="relative">
                        <label className="text-xs font-semibold text-indigo-300 uppercase ml-1 mb-2 block">Email Address</label>
                        <input
                            type="email"
                            onChange={(e) => setemail(e.target.value)}
                            placeholder="name@company.com"
                            required
                            name="email"
                            className="w-full px-3 md:px-4 py-3 md:py-4 rounded-lg md:rounded-xl bg-slate-800/50 text-white placeholder-gray-500 border border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                        />
                    </div>

                    {loading ? (
                        <button
                            type="submit"
                            disabled
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 md:py-4 rounded-lg md:rounded-xl shadow-lg shadow-indigo-500/30 transition-all text-sm md:text-base opacity-75 cursor-not-allowed"
                        >
                            Sending OTP
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 md:py-4 rounded-lg md:rounded-xl shadow-lg shadow-indigo-500/30 transform hover:scale-105 active:scale-[0.98] transition-all text-sm md:text-base"
                        >
                            Send OTP
                        </button>
                    )}
                </form>

                <p className="mt-6 md:mt-8 text-center text-slate-400 text-xs md:text-sm">
                    By continuing, you agree to our <span className="text-indigo-400 cursor-pointer hover:underline">Terms of Service</span>
                </p>
            </div>
        </div>
    )
}

export default Login