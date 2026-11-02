"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession, authClient } from "@/lib/auth-client";
import {
  FiUser,
  FiCalendar,
  FiCompass,
  FiTrendingUp,
  FiDollarSign,
  FiCamera,
  FiEdit2,
  FiLink,
  FiUploadCloud,
  FiSave,
  FiX,
} from "react-icons/fi";


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

function ProfileCard({ user }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || user?.photoURL || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  // Dynamic Studio & Booking Statistics
  const [stats, setStats] = useState({
    totalBookings: 0,
    myStudios: 0,
    upcomingShoots: 0,
    totalSpent: 0,
  });
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  // Fetch dynamic studio statistics for the logged-in user
  useEffect(() => {
    let ignore = false;
    if (!user?.email) return;

    fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-stats?email=${encodeURIComponent(
        user.email
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          if (data.success && data.stats) {
            setStats(data.stats);
          }
          setIsStatsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Error fetching studio statistics:", err);
          setIsStatsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [user?.email]);

  const dynamicStatCards = [
    {
      id: "total-bookings",
      label: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      icon: FiCalendar,
      bgColor: "bg-sky-50 dark:bg-sky-950/40",
      iconColor: "text-sky-500",
    },
    {
      id: "my-studios",
      label: "My Studios",
      value: stats.myStudios.toLocaleString(),
      icon: FiCompass,
      bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
      iconColor: "text-emerald-500",
    },
    {
      id: "upcoming-shoots",
      label: "Upcoming Shoots",
      value: stats.upcomingShoots.toLocaleString(),
      icon: FiTrendingUp,
      bgColor: "bg-amber-50 dark:bg-amber-950/40",
      iconColor: "text-amber-500",
    },
    {
      id: "total-spent",
      label: "Total Spent",
      value: `$${Number(stats.totalSpent || 0).toLocaleString()}`,
      icon: FiDollarSign,
      bgColor: "bg-fuchsia-50 dark:bg-fuchsia-950/40",
      iconColor: "text-fuchsia-500",
    },
  ];

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isEditing) {
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditing]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isEditing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isEditing]);

  // Handle local file upload via backend ImgBB API
  const handleFileUpload = async (e) => {
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

    setIsUploading(true);
    const toastId = toast.loading("Uploading image to ImgBB...");

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

          setImage(data.url);
          setPreviewError(false);
          toast.success("Image uploaded to ImgBB successfully!", { id: toastId });
        } catch (err) {
          console.error("Upload error:", err);
          toast.error(err.message || "Failed to upload image to ImgBB", { id: toastId });
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Failed to read image file", { id: toastId });
      setIsUploading(false);
    }
  };

  // Submit profile updates (only photo and name)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedImage = image.trim();

    if (!trimmedName) {
      toast.error("Name cannot be empty.");
      return;
    }

    if (trimmedImage && !isValidURL(trimmedImage)) {
      toast.error("Please enter a valid image URL (e.g. https://...).");
      return;
    }

    setIsSaving(true);
    try {
      const res = await authClient.updateUser({
        name: trimmedName,
        image: trimmedImage,
      });

      if (res?.error) {
        throw new Error(res.error.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      router.refresh();
      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(err.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenEdit = () => {
    setName(user?.name || "");
    setImage(user?.image || user?.photoURL || "");
    setPreviewError(false);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setName(user?.name || "");
    setImage(user?.image || user?.photoURL || "");
    setPreviewError(false);
    setIsEditing(false);
  };

  const currentPhoto = user?.image || user?.photoURL;
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const activeAvatar = isEditing ? (image.trim() || currentPhoto) : currentPhoto;

  // Format CreatedAt date as "MMM YYYY"
  const formattedMemberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Mar 2024";

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT COLUMN: PROFILE CARD ================= */}
        <div className="lg:col-span-4 xl:col-span-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs p-6 sm:p-7 transition-colors">
            <div className="flex flex-col items-center text-center">
              {/* Profile Photo with Camera Badge */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full ring-4 ring-zinc-100 dark:ring-zinc-800 overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-3xl font-extrabold text-brand shadow-md">
                  {currentPhoto ? (
                    <Image
                      unoptimized
                      src={currentPhoto}
                      alt={user?.name || "Profile Photo"}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{initial}</span>
                  )}
                </div>

                {/* Small camera edit badge on avatar */}
                <button
                  type="button"
                  onClick={handleOpenEdit}
                  title="Change photo"
                  aria-label="Change photo"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand hover:bg-brand-hover text-white flex items-center justify-center shadow-md border-2 border-white dark:border-zinc-900 transition-transform active:scale-90 cursor-pointer"
                >
                  <FiCamera className="w-4 h-4" />
                </button>
              </div>

              {/* User Name */}
              <h2 className="font-bricolage text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-4 tracking-tight">
                {user?.name || "Anonymous User"}
              </h2>

              {/* Info Details List */}
              <div className="w-full pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-3.5 text-sm">
                <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
                  <span className="font-normal">Member since</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {formattedMemberSince}
                  </span>
                </div>

                <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
                  <span className="font-normal">Email</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-44 text-right">
                    {user?.email || "N/A"}
                  </span>
                </div>
              </div>

              {/* Edit Profile Button (Brand Color) */}
              <button
                type="button"
                onClick={handleOpenEdit}
                className="w-full mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white bg-brand hover:bg-brand-hover active:scale-[0.98] transition-all shadow-md shadow-brand/20 cursor-pointer"
              >
                <FiEdit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: 4 STATS CARDS ================= */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-4">
          <h3 className="font-bricolage text-lg font-bold text-zinc-900 dark:text-white">
            Studio Statistics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dynamicStatCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.id}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-5 sm:p-6 shadow-xs flex items-center justify-between transition-colors hover:border-brand/40"
                >
                  <div>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {stat.label}
                    </p>
                    {isStatsLoading ? (
                      <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse mt-2" />
                    ) : (
                      <p className="font-bricolage text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-1.5 tracking-tight">
                        {stat.value}
                      </p>
                    )}
                  </div>

                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bgColor} ${stat.iconColor} shrink-0`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= EDIT PROFILE POPUP / MODAL ================= */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={handleCancelEdit}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3
                id="edit-profile-title"
                className="font-bricolage text-xl font-bold text-zinc-900 dark:text-white"
              >
                Edit Profile
              </h3>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-5 pt-4">
              {/* Profile Photo Live Preview */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-20 h-20 rounded-full ring-4 ring-brand/30 overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-2xl font-extrabold text-brand shadow-md">
                  {activeAvatar && !previewError ? (
                    <Image
                      unoptimized
                      src={activeAvatar}
                      alt="Avatar Preview"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      onError={() => setPreviewError(true)}
                    />
                  ) : (
                    <span>{initial}</span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Profile Photo Preview
                </p>
              </div>

              {/* Profile Photo Option 1: URL input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="modal-profile-image-url"
                  className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                >
                  Profile Photo (Image URL)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <FiLink className="w-4 h-4" />
                  </div>
                  <input
                    id="modal-profile-image-url"
                    type="url"
                    value={image}
                    onChange={(e) => {
                      setImage(e.target.value);
                      setPreviewError(false);
                    }}
                    placeholder="https://i.ibb.co/... or image URL"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>
              </div>

              {/* Profile Photo Option 2: Upload to ImgBB */}
              <div className="flex items-center justify-center p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                <label
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-brand hover:text-brand text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-all shadow-2xs ${
                    isUploading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  {isUploading ? (
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
                    disabled={isUploading}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Name Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="modal-profile-name"
                  className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                >
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <input
                    id="modal-profile-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-brand hover:bg-brand-hover active:scale-[0.98] transition-all shadow-md shadow-brand/20 disabled:opacity-60 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FiSave className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login?callbackUrl=/profile");
    }
  }, [isPending, user, router]);

  if (isPending || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-zinc-50/60 dark:bg-zinc-950 transition-colors">
        <div className="w-full max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-pulse">
            <div className="lg:col-span-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col items-center space-y-4">
              <div className="w-28 h-28 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="w-36 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
              <div className="w-full h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl mt-4" />
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 h-28"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-zinc-50/60 dark:bg-zinc-950 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div>
          <h1 className="font-bricolage text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            My Profile
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
            Manage your account settings and studio preferences
          </p>
        </div>

        {/* Profile Card & Stats Grid */}
        <ProfileCard key={user.id || user.email} user={user} />
      </div>
    </div>
  );
}