"use client";

import { useEffect, useState } from "react";

export default function ShowSchoolsPage() {
    const [schools, setSchools] = useState([]);

    useEffect(() => {
        fetch("/api/schools/getschool")
            .then((res) => res.json())
            .then((data) => setSchools(data));
    }, []);

    return (
        <div className="p-6" style={{ "margin-top": '3rem' }}>
            <h1 className="text-3xl font-bold mb-6 text-center">Schools</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {schools.length > 0 ? (schools.map((school) => (
                    <div
                        key={school.id}
                        className="border rounded-xl shadow-md overflow-hidden bg-white hover:shadow-lg transition flex flex-col"
                    >
                        {/* Image */}
                        <div className="w-full h-48 overflow-hidden">
                            <img
                                src={school.image}
                                alt={school.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col flex-grow">
                            <h2 className="text-lg font-semibold mb-1 line-clamp-1">
                                {school.name}
                            </h2>
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {school.address}
                            </p>
                            <p className="text-sm text-gray-500 mt-auto">
                                {school.city}, {school.state}
                            </p>
                        </div>
                    </div>)
                )) : <div className="col-span-full flex items-center justify-center min-h-[100px] bg-gray-50 rounded-lg shadow-md p-6">
                    <div className="text-center">
                        <h2 className="mt-4 text-lg font-semibold text-gray-700">No schools available</h2>
                    </div>
                </div>
                }
            </div>
        </div>
    );
}
