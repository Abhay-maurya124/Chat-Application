import React, { useState } from 'react'
import { useChatState } from '../Context/NewContext';
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
    const { loading, setloading } = useChatState()
    const [email, setemail] = useState("")
    console.log(email)
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        setloading(true)
        e.preventDefault()
        try {
            const res = await axios.post("http://localhost:5000/v1/user/login", { email })
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
        <div className="min-h-screen w-full flex absolute overflow-y-hidden items-center justify-center bg-linear-to-br from-indigo-900 via-slate-900 to-black px-4 flex-col">
            <ToastContainer theme='dark' />

            <div className="mb-8 text-center">

                <h2 className="text-indigo-400 font-medium tracking-widest uppercase text-sm mb-2">Secure Access</h2>

                <h1 className="text-4xl font-extrabold text-white">Welcome to <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">ChatApp</span></h1>
            </div>

            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-10 transition-all">
                <h1 className="text-2xl font-bold text-white text-center mb-8">
                    Login Now
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <label className="text-xs font-semibold text-indigo-300 uppercase ml-1 mb-2 block">Email Address</label>
                        <input
                            type="email"
                            onChange={(e) => setemail(e.target.value)}
                            placeholder="name@company.com"
                            required
                            name="email"
                            className="w-full px-4 py-4 rounded-xl bg-slate-800/50 text-white placeholder-gray-500 border border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                        />
                    </div>

                    {
                        loading ? (<button
                            type="submit"
                            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transform active:scale-[0.98] transition-all text-sm sm:text-base"
                        >
                            Sending OTP
                        </button>) : (
                            <button
                                type="submit"
                                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transform active:scale-[0.98] transition-all text-sm sm:text-base"
                            >
                                Send OTP
                            </button>
                        )
                    }
                </form>

                <p className="mt-8 text-center text-slate-400 text-xs">
                    By continuing, you agree to our <span className="text-indigo-400 cursor-pointer hover:underline">Terms of Service</span>
                </p>
            </div>
        </div>
    )
}

export default Login