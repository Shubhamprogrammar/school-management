"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Login() {
    const [email, setEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0); // in seconds

    // Countdown effect
    useEffect(() => {
        let timer;
        if (timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format time mm:ss
    const formatTime = (seconds) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, "0");
        const s = String(seconds % 60).padStart(2, "0");
        return `${m}:${s}`;
    };

    const sendOtp = async (e) => {
        e.preventDefault();
        setOtp("");
        setLoading(true);
        if (!email) {
            toast.error("Please enter your email");
            setLoading(false);
            return;
        }
        const res = await fetch("/api/schools/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        if (!res.ok) {
            const data = await res.json();
            setLoading(false);
            toast.error(data.message || "Failed to send OTP");
            return;
        } else {
            toast.success("OTP sent successfully on mail. Check spam if not found!");
            setLoading(false);
            setOtpSent(true);
            setTimeLeft(600); // 10 minutes countdown
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/schools/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
        });
        if (res.ok) {
            window.location.href = "/";
        } else {
            const data = await res.json();
            toast.error(data.message || "Invalid OTP!");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {otpSent ? "Verify OTP" : "Login with Email"}
                </h2>

                {!otpSent ? (
                    <>
                        <form onSubmit={sendOtp} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-2 px-4 font-semibold rounded-lg shadow-md transition ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"}`}
                            >
                                {loading ? "Sending..." : "Send OTP"}
                            </button>
                        </form>
                        <p className="mt-4 text-center text-sm text-gray-600">
                            Don’t have an account?{" "}
                            <Link href="/signup" className="text-blue-600 hover:underline">
                                Sign up here
                            </Link>
                        </p>
                    </>
                ) : (
                    <form onSubmit={verifyOtp} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter the OTP sent to your email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                required
                            />
                        </div>

                        {/* Countdown */}
                        {timeLeft > 0 && (
                            <p className="text-sm text-red-600 text-end" style={{marginTop: "-10px", marginBottom: "10px"}}>
                                OTP expires in <span className="font-semibold">{formatTime(timeLeft)}</span>
                            </p>
                        )}

                        <div className="flex flex-row gap-2">
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition cursor-pointer"
                            >
                                Verify OTP
                            </button>

                            {/* Resend OTP disabled until timer ends */}
                            <button
                                type="button"
                                onClick={sendOtp}
                                disabled={timeLeft > 0}
                                className={`w-full py-2 px-4 font-semibold rounded-lg shadow-md transition ${
                                    timeLeft > 0
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                                }`}
                            >
                                Resend OTP
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
