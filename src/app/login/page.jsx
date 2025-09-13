"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Login() {
    const [email, setEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const sendOtp = async (e) => {
        e.preventDefault();
        setOtp("");
        setLoading(true);
        if (!email) {
            toast.error("Please enter your email");
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
        }
        else {
            toast.success("OTP sent successfully on mail. It may land in spam.");
            setLoading(false);
            setOtpSent(true);
        }

    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/schools/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
        });
        if (res.ok) { router.push("/"); }
        else { toast.error(res.error || "Invalid OTP!"); }
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
                                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition cursor-pointer"
                            >
                                {loading?"Sending":"Send OTP"}
                            </button>
                        </form>
                        <p className="mt-4 text-center text-sm text-gray-600">
                            Don’t have an account?{" "}
                            <Link to="/signup" className="text-blue-600 hover:underline">
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
                        <div className="flex flex-row gap-2">
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition cursor-pointer"
                            >
                                Verify OTP
                            </button>

                            {/* Resend OTP */}
                            <button
                                type="button"
                                onClick={sendOtp}
                                className="w-full py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition cursor-pointer"
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
