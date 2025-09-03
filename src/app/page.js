"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center gap-5 min-h-screen">
      <button
        onClick={() => router.push("/addschool")}
        className="px-6 py-3 rounded-lg bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
      >
        Add School
      </button>
      <button
        onClick={() => router.push("/showschools")} 
        className="px-6 py-3 rounded-lg bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
      >
        Show Schools
      </button>
    </div>
  );
}
