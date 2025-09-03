"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    const target = pathname === "/addschool" ? "/showschools" : "/addschool";
  const label = pathname === "/addschool" ? "Show Schools" : "+ Add School";
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
          <div className="hidden md:flex">
            <Link
              href={target}
              className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
            >
              {label}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
