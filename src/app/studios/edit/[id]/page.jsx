"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import {
  FiEdit2,
  FiArrowLeft,
  FiUploadCloud,
  FiLink,
  FiDollarSign,
  FiMapPin,
  FiUsers,
  FiCheck,
  FiUser,
  FiMail,
  FiSave,
  FiAlertCircle,
} from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const categories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Art Workshop",
];

const availableAmenities = [
  "Cyclorama Wall",
  "Profoto Lighting Kit",
  "Hair & Makeup Station",
  "High-Speed WiFi",
  "Freight Elevator",
  "Air Conditioning",
  "Acoustic Soundproofing",
  "Drive-In Loading Door",
];

function EditStudioContent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const { data: session, isPending: isAuthPending } = useSession();
  const user = session?.user;

  const [isLoadingStudio, setIsLoadingStudio] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Photo Studio",
    location: "",
    hourlyRate: "",
    securityDeposit: "",
    maxCapacity: "",
    overview: "",
    image: "",
    amenities: [],
    ownerName: "",
    ownerEmail: "",
  });

  // Auth Guard
  useEffect(() => {
    if (!isAuthPending && !user) {
      router.push(`/login?callbackUrl=/studios/edit/${id}`);
    }
  }, [isAuthPending, user, router, id]);

  // Fetch Existing Studio Data
  useEffect(() => {
    if (!id) return;
    let ignore = false;

    fetch(`${API_URL}/api/studios/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!ignore) {
          if (data.success && data.studio) {
            const s = data.studio;
            setFormData({
              title: s.title || "",
              category: s.category || "Photo Studio",
              location: s.location || "",
              hourlyRate: s.hourlyRate !== undefined ? String(s.hourlyRate) : "",
              securityDeposit:
                s.securityDeposit !== undefined ? String(s.securityDeposit) : "150",
              maxCapacity:
                s.maxCapacity !== undefined ? String(s.maxCapacity) : "15",
              overview: s.overview || "",
              image: s.image || "",
              amenities: Array.isArray(s.amenities) ? s.amenities : [],
              ownerName: s.ownerName || user?.name || "Verified Host",
              ownerEmail: s.ownerEmail || user?.email || "",
            });
            setLoadError(null);
          } else {
            setLoadError(data.message || "Studio workspace not found");
          }
          setIsLoadingStudio(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Error loading studio details:", err);
          setLoadError("Unable to retrieve studio listing details.");
          setIsLoadingStudio(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [id, user?.name, user?.email]);

  const toggleAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  // ImgBB Upload Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file is too large. Max size is 5MB.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading photo to ImgBB...");

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64 = event.target?.result;
          const res = await fetch(`${API_URL}/api/upload`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64, name: file.name }),
          });

          const data = await res.json();
          if (!data.success || !data.url) {
            throw new Error(data.message || "Failed to upload image");
          }

          setFormData((prev) => ({ ...prev, image: data.url }));
          toast.success("Image uploaded successfully!", { id: toastId });
        } catch (err) {
          toast.error(err.message || "Upload failed", { id: toastId });
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Failed to read file", { id: toastId });
      setIsUploading(false);
    }
  };

  // Submit Update via PUT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Studio title cannot be empty.");
      return;
    }

    if (!formData.location.trim()) {
      toast.error("Location cannot be empty.");
      return;
    }

    if (!formData.hourlyRate || Number(formData.hourlyRate) <= 0) {
      toast.error("Please enter a valid hourly rate.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Updating studio listing...");

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        hourlyRate: Number(formData.hourlyRate),
        securityDeposit: formData.securityDeposit
          ? Number(formData.securityDeposit)
          : 150,
        maxCapacity: formData.maxCapacity
          ? Number(formData.maxCapacity)
          : 15,
        location: formData.location,
        image: formData.image,
        amenities: formData.amenities,
        overview: formData.overview,
      };

      const res = await fetch(`${API_URL}/api/studios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update studio workspace");
      }

      toast.success("Studio updated successfully!", { id: toastId });
      router.push("/my-listings");
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.message || "Failed to update studio.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthPending || !user || isLoadingStudio) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-zinc-50/60 dark:bg-zinc-950">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-zinc-50/60 dark:bg-zinc-950">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 sm:p-10 text-center max-w-md mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-bricolage text-xl font-bold text-zinc-900 dark:text-white mb-2">
            Failed to Load Studio
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{loadError}</p>
          <Link
            href="/my-listings"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover transition-all"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to My Listings</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-zinc-50/60 dark:bg-zinc-950 transition-colors">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="space-y-4">
          <Link
            href="/my-listings"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-brand transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to My Listings</span>
          </Link>

          <div>
            <h1 className="font-bricolage text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Update Studio Space
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
              Edit specifications, pricing, amenities, and imagery for your listing
            </p>
          </div>
        </div>

        {/* Update Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-6 sm:p-8 shadow-xs space-y-6"
        >
          {/* Studio Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Studio Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Apex Horizon Cyc Stage & Soundstage"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
          </div>

          {/* Category & Hourly Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Hourly Rate ($) *
              </label>
              <div className="relative">
                <FiDollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.hourlyRate}
                  onChange={(e) =>
                    setFormData({ ...formData, hourlyRate: e.target.value })
                  }
                  placeholder="75"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Location & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Location (City, State) *
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Downtown Arts District, Los Angeles, CA"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Max Capacity
              </label>
              <div className="relative">
                <FiUsers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="number"
                  min="1"
                  value={formData.maxCapacity}
                  onChange={(e) =>
                    setFormData({ ...formData, maxCapacity: e.target.value })
                  }
                  placeholder="25"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Image Upload / URL with Live Preview */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Studio Image (Cover Photo)
            </label>

            {formData.image && (
              <div className="relative w-full aspect-video max-w-sm rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 mb-3">
                <Image
                  src={formData.image}
                  alt="Studio Cover Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1 w-full">
                <FiLink className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/... or paste URL"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                />
              </div>

              <label
                className={`w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:border-brand text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-all ${
                  isUploading
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {isUploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <FiUploadCloud className="w-4 h-4 text-brand" />
                    <span>Upload Device Image</span>
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
          </div>

          {/* Overview Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Overview & Specifications
            </label>
            <textarea
              rows={4}
              value={formData.overview}
              onChange={(e) =>
                setFormData({ ...formData, overview: e.target.value })
              }
              placeholder="Describe the studio's features, lighting grid, ceiling clearance..."
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all resize-none"
            />
          </div>

          {/* Amenities Multi-Select */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Amenities & Equipment
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {availableAmenities.map((amenity) => {
                const selected = formData.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                      selected
                        ? "bg-brand/10 border-brand text-brand font-semibold"
                        : "bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-brand/40"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                        selected
                          ? "bg-brand text-white"
                          : "border border-zinc-300 dark:border-zinc-600"
                      }`}
                    >
                      {selected && <FiCheck className="w-3 h-3" />}
                    </div>
                    <span className="truncate">{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Read-Only Host Information */}
          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Host & Creator Information (Read-only)
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Host credentials are bound to the original owner and cannot be altered
                </p>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-brand/10 text-brand">
                Listing Owner
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Host Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Host Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    readOnly
                    value={formData.ownerName}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 text-sm text-zinc-700 dark:text-zinc-300 font-medium cursor-not-allowed select-none focus:outline-none"
                  />
                </div>
              </div>

              {/* Host Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Host Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="email"
                    readOnly
                    value={formData.ownerEmail}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 text-sm text-zinc-700 dark:text-zinc-300 font-medium cursor-not-allowed select-none focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
            <Link
              href="/my-listings"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-brand hover:bg-brand-hover active:scale-[0.98] transition-all shadow-md shadow-brand/20 disabled:opacity-60 cursor-pointer"
            >
              <FiSave className="w-4 h-4" />
              <span>{isSubmitting ? "Saving..." : "Update Studio"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditStudioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-zinc-50/60 dark:bg-zinc-950">
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <EditStudioContent />
    </Suspense>
  );
}