"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/schools/check-auth", { credentials: "include" });
        const data = await res.json();
        setIsLoggedIn(data.authenticated);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/schools/logout", { method: "POST" });
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <nav className="bg-blue-600 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-white text-2xl font-bold hover:text-gray-200 transition">
              Reno Platforms
            </Link>
          </div>

          {/* Right Button */}
          <div className="md:flex">
            {!isLoggedIn ? (
              <Link
                href="/signup"
                className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition cursor-pointer"
              >
                Signup/Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition cursor-pointer"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
