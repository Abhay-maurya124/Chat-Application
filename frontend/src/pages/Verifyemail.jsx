import axios from 'axios';
import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useFetchData } from '../Context/FetchContext';

const Verifyemail = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // ✅ FIX: Also grab getUserAllChats and fetchGlobalUsers to bootstrap everything after verify
    const { fetchProfile, fetchGlobalUsers, getUserAllChats } = useFetchData();

    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email");

    const handleChange = (value, index) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join("");
        if (otpCode.length < 6) return toast.warning("Please enter all 6 digits");

        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/v1/user/verify", {
                email,
                otp: otpCode
            });

            // ✅ FIX: Store token FIRST, then fetch all data before navigating
            // This ensures the app state is fully loaded — no reload needed
            localStorage.setItem("token", res.data.Token);

            toast.success("Email verified successfully!");

            // Fetch profile and seed app state in parallel
            const userData = await fetchProfile();
            if (userData) {
                await Promise.all([getUserAllChats(), fetchGlobalUsers()]);
            }

            navigate("/chat");

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Invalid OTP, please try again");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full absolute flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-black px-4 flex-col">
            <ToastContainer />
            <div className="mb-8 text-center">
                <h2 className="text-indigo-400 font-medium tracking-widest uppercase text-sm mb-2">Verification</h2>
                <h1 className="text-4xl font-extrabold text-white">
                    Confirm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Identity</span>
                </h1>
                <p className="text-slate-400 mt-4">
                    Enter the code sent to <span className="text-white font-semibold">{email}</span>
                </p>
            </div>

            <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 sm:p-12 transition-all">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex justify-between gap-2">
                        {otp.map((item, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={item}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                disabled={loading}
                                className="w-10 h-12 sm:w-16 sm:h-20 text-center text-2xl font-bold bg-slate-800/50 text-white border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                            />
                        ))}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transform active:scale-[0.98] transition-all disabled:cursor-not-allowed"
                    >
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-400">
                    Didn't receive the code?{" "}
                    <span className="text-indigo-400 cursor-pointer hover:underline font-medium">Resend OTP</span>
                </div>
            </div>
        </div>
    );
};

export default Verifyemail;