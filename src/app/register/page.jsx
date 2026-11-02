"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import {
  FiUser,
  FiMail,
  FiLock,
  FiImage,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiUploadCloud,
  FiCheck,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// Verify if a string is a valid web URL
const isValidURL = (url) => {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const router = useRouter();

  // Handle uploading photo to ImgBB via server upload API
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file is too large. Max size is 5MB.");
      return;
    }

    setIsUploadingPhoto(true);
    const toastId = toast.loading("Uploading photo to ImgBB...");

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64 = event.target?.result;
          const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/upload`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64, name: file.name }),
          });

          const data = await res.json();
          if (!data.success || !data.url) {
            throw new Error(data.message || "Failed to upload image to ImgBB");
          }

          setFormData((prev) => ({ ...prev, photoURL: data.url }));
          setErrors((prev) => ({ ...prev, photoURL: "" }));
          toast.success("Photo uploaded to ImgBB successfully!", { id: toastId });
        } catch (err) {
          console.error("Upload error:", err);
          toast.error(err.message || "Failed to upload photo", { id: toastId });
        } finally {
          setIsUploadingPhoto(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Failed to read image file", { id: toastId });
      setIsUploadingPhoto(false);
    }
  };

  // Validate individual field or all fields
  const validateField = (name, value) => {
    let error = "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!emailRegex.test(value.trim())) {
          error = "Please enter a valid email address";
        }
        break;
      case "photoURL":
        if (!value.trim()) {
          error = "Photo URL is required";
        } else if (!isValidURL(value)) {
          error = "Please enter a valid image URL (e.g. https://...)";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        } else if (!/[A-Z]/.test(value)) {
          error = "Password must have at least one uppercase letter";
        } else if (!/[a-z]/.test(value)) {
          error = "Password must have at least one lowercase letter";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for the current field as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      photoURL: validateField("photoURL", formData.photoURL),
      password: validateField("password", formData.password),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => err !== "");
    if (hasErrors) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate registration network request
      await new Promise((resolve) => setTimeout(resolve, 600));

      const {data, error} = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: formData.photoURL,
      })

      if (error) {        
        toast.error("Failed to create account. Please try again.");
        return;
      }

      if (data) {
        setFormData({ name: "", email: "", photoURL: "", password: "" });
        await toast.success("Account registered successfully!");
        router.push("/login");
      }      

      

    } catch {
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Google Registration Error:", error);
      toast.error("Google registration failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50/70 dark:bg-zinc-950 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-9 shadow-xl shadow-zinc-200/50 dark:shadow-none transition-colors">
        {/* Header */}
        <div className="mb-7 text-center">
          <h1 className="font-bricolage text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 font-light">
            Join thousands of creators booking world-class studios on demand.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
            >
              Full Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Mahabub Rahman Rakib"
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-zinc-800/60 border text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-zinc-200 dark:border-zinc-700 focus:ring-brand/30 focus:border-brand"
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-zinc-800/60 border text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-zinc-200 dark:border-zinc-700 focus:ring-brand/30 focus:border-brand"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          {/* Photo URL & ImgBB Upload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="photoURL"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
              >
                Profile Photo (Paste URL or Upload)
              </label>
              {isValidURL(formData.photoURL) && (
                <span className="text-[11px] font-semibold text-brand flex items-center gap-1">
                  <FiCheck className="w-3 h-3" />
                  Photo Ready
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <FiImage className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  id="photoURL"
                  name="photoURL"
                  type="url"
                  value={formData.photoURL}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Paste image URL (e.g. Unsplash, ImgBB)"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-zinc-800/60 border text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.photoURL
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-zinc-200 dark:border-zinc-700 focus:ring-brand/30 focus:border-brand"
                  }`}
                />
              </div>

              {/* Upload to ImgBB Button & Preview */}
              <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
                <label
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-brand hover:text-brand text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-all shadow-2xs ${
                    isUploadingPhoto ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  {isUploadingPhoto ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-brand border-t-transparent animate-spin" />
                      <span>Uploading to ImgBB...</span>
                    </>
                  ) : (
                    <>
                      <FiUploadCloud className="w-4 h-4 text-brand" />
                      <span>Upload from Device</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingPhoto}
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {isValidURL(formData.photoURL) && (
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-8 h-8 rounded-full ring-2 ring-brand/40 overflow-hidden bg-zinc-200 dark:bg-zinc-700">
                      <Image
                        unoptimized
                        src={formData.photoURL}
                        alt="Photo Preview"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {errors.photoURL && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                {errors.photoURL}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter a secure password"
                className={`w-full pl-10 pr-11 py-2.5 text-sm rounded-xl bg-white dark:bg-zinc-800/60 border text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-zinc-200 dark:border-zinc-700 focus:ring-brand/30 focus:border-brand"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <FiEyeOff className="w-4 h-4" />
                ) : (
                  <FiEye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                {errors.password}
              </p>
            )}
          </div>

          {/* Register Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover shadow-md shadow-brand/20 hover:shadow-lg hover:shadow-brand/30 transition-all duration-200 active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            <span>{isLoading ? "Creating Account..." : "Register Now"}</span>
            {!isLoading && <FiArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-400 dark:text-zinc-500 font-medium">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Sign-up (Google) - Below Register Button */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={isGoogleLoading || isLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 hover:border-brand/40 dark:hover:border-brand/40 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-200 shadow-2xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <FcGoogle className="w-5 h-5" />
          <span>
            {isGoogleLoading ? "Connecting with Google..." : "Continue with Google"}
          </span>
        </button>

        {/* Login Link Footer */}
        <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800 text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-brand hover:text-brand-hover hover:underline transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
