"use client";

import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddSchoolPage() {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      email_id: "",
      contact: "",
      address: "",
      city: "",
      state: "",
      image: null
    }
  });
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    const formData = new FormData();
    setLoading(true);
    Object.keys(data).forEach((key) => {
      if (key !== "image") {
        formData.append(key, data[key]);
      }
    });

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    const res = await fetch("/api/schools/addschool", {
      method: "POST",
      body: formData,
    });
    const responsedata = await res.json();

    if (res.ok) {
      toast.success("School added successfully!");
      setLoading(false);
      reset();
      setFileName("");
    } else {
      setLoading(false);
      toast.error(responsedata.error || "Failed to add school.");
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 " style={{ "marginTop": '5rem' }}>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Add New School
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* School Name */}
          <div>
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Name is required",
                minLength: { value: 3, message: "Name must be at least 3 characters" },
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Name can only contain letters and spaces",
                },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  value={field.value || ""}
                  placeholder="School Name"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              )}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Controller
              name="email_id"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              }}
              render={({ field }) => (
                <input
                  type="email"
                  {...field}
                  value={field.value || ""}
                  placeholder="Email ID"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              )}
            />
            {errors.email_id && (
              <p className="text-red-500 text-sm mt-1">{errors.email_id.message}</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <Controller
              name="contact"
              control={control}
              rules={{
                required: "Contact is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Contact must be a 10-digit number",
                },
              }}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  value={field.value || ""}
                  placeholder="Contact Number"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              )}
            />
            {errors.contact && (
              <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <Controller
              name="address"
              control={control}
              rules={{
                required: "Address is required",
              }}
              render={({ field }) => (
                <input
                  {...field}
                  value={field.value || ""}
                  placeholder="Address"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              )}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

          {/* City & State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Controller
                name="city"
                control={control}
                rules={{
                  required: "City is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "City can only contain letters",
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value || ""}
                    placeholder="City"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                )}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <Controller
                name="state"
                control={control}
                rules={{
                  required: "State is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "State can only contain letters",
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value || ""}
                    placeholder="State"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                )}
              />
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <Controller
              name="image"
              control={control}
              rules={{ required: "Image is required" }}
              render={({ field: { onChange } }) => (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      onChange(e.target.files);
                      setFileName(e.target.files[0]?.name || "");
                    }}
                  />
                  <span className="text-gray-500">
                    {fileName ? `📂 ${fileName}` : "📤 Click to upload"}
                  </span>
                </label>
              )}
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300 shadow-md cursor-pointer"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
