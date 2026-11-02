"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import {
  FiArrowLeft,
  FiMapPin,
  FiStar,
  FiUsers,
  FiShield,
  FiClock,
  FiCheckCircle,
  FiCalendar,
  FiMail,
  FiDollarSign,
  FiAlertCircle,
  FiCheck,
  FiX,
  FiShare2,
} from "react-icons/fi";
import StudioGalleryCarousel from "@/components/Studios/StudioGalleryCarousel";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// Loading Skeleton Component
const StudioDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-zinc-50/60 dark:bg-zinc-950 py-8 sm:py-12 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link skeleton */}
        <div className="w-36 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-md mb-6" />

        {/* Header skeleton */}
        <div className="space-y-3 mb-8">
          <div className="flex gap-2.5">
            <div className="w-24 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            <div className="w-20 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          </div>
          <div className="w-3/4 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="w-1/3 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
        </div>

        {/* Gallery Carousel skeleton */}
        <div className="space-y-4 mb-10">
          <div className="w-full h-72 sm:h-96 md:h-120 bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
          <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-16/10 bg-zinc-200 dark:bg-zinc-800 rounded-xl sm:rounded-2xl" />
            ))}
          </div>
        </div>

        {/* Content & Sidebar Grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
              ))}
            </div>
            <div className="h-40 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
            <div className="h-44 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
          </div>
          <div className="lg:col-span-1">
            <div className="h-96 bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StudioDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [studio, setStudio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking widget state
  const [shootHours, setShootHours] = useState(1);
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [startTime, setStartTime] = useState("10:00");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch studio details by ID
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
            setStudio(data.studio);
            setError(null);
          } else {
            setError(data.message || "Studio workspace not found");
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Error fetching studio details:", err);
          setError("Failed to load studio details. Please check the ID or backend server.");
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  // Pricing calculations
  const hourlyRate = studio?.hourlyRate || 0;
  const parsedHours = typeof shootHours === "number" && shootHours > 0 ? shootHours : 1;
  const totalPrice = hourlyRate * parsedHours;

  // Handle Share Studio
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Studio link copied to clipboard!");
    }
  };

  // Open booking modal or prompt login
  const handleInitiateBooking = () => {
    if (!user) {
      toast.error("Please login to reserve this creative studio.");
      router.push(`/login?callbackUrl=/studios/${id}`);
      return;
    }
    setIsModalOpen(true);
  };

  // Confirm booking reservation
  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to book.");
      return;
    }

    const bookingData = {
      studioId: studio._id,
      studioTitle: studio.title,
      studioImage: studio.image,
      hourlyRate: studio.hourlyRate,
      userEmail: user?.email,
      userName: user?.name,
      bookingDate,
      startTime,
      endTime: calculateEndTime(startTime, parsedHours),
      totalHours: parsedHours,
      totalPrice,
    };

    console.log("=== Studio Booking Request ===");
    console.log("Logged In User Email:", user?.email);
    console.log("Booking Data:", bookingData);

    toast.success("Studio booking request received successfully!");
    setIsModalOpen(false);
  };

  // Helper to calculate end time string
  function calculateEndTime(start, hours) {
    const [h, m] = start.split(":").map(Number);
    const endH = (h + Number(hours)) % 24;
    return `${String(endH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  // Loading state
  if (isLoading) {
    return <StudioDetailsSkeleton />;
  }

  // Error / Not found state
  if (error || !studio) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-10 text-center shadow-lg">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center mb-4">
            <FiAlertCircle className="w-7 h-7" />
          </div>
          <h2 className="font-bricolage text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            Studio Not Found
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
            {error || "The creative space you are looking for does not exist or may have been unlisted."}
          </p>
          <Link
            href="/studios"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover transition-all active:scale-95 shadow-sm"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Return to Explore Studios</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/60 dark:bg-zinc-950 py-8 sm:py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Share Actions */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/studios"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-brand dark:hover:text-brand transition-colors group"
          >
            <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Studios</span>
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-brand dark:hover:text-brand hover:border-brand/40 transition-colors shadow-2xs cursor-pointer"
          >
            <FiShare2 className="w-3.5 h-3.5" />
            <span>Share Studio</span>
          </button>
        </div>

        {/* Title Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand bg-brand/10 border border-brand/20 rounded-full">
              {studio.category || "Creative Workspace"}
            </span>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 text-xs font-bold">
              <FiStar className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{Number(studio.rating || 4.9).toFixed(1)}</span>
              {studio.reviewCount > 0 && (
                <span className="text-zinc-500 dark:text-zinc-400 font-normal">
                  ({studio.reviewCount} reviews)
                </span>
              )}
            </div>

            {studio.maxCapacity && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 rounded-full">
                <FiUsers className="w-3.5 h-3.5 text-zinc-400" />
                <span>Max {studio.maxCapacity} creators</span>
              </span>
            )}
          </div>

          <h1 className="font-bricolage text-2xl sm:text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
            {studio.title}
          </h1>

          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mt-2.5">
            <FiMapPin className="w-4 h-4 text-brand shrink-0" />
            <span>{studio.location || "Downtown Creative Arts District"}</span>
          </div>
        </div>

        {/* Studio Gallery Carousel (5 Images with Single Image Fallback Support) */}
        <StudioGalleryCarousel
          images={studio.images}
          fallbackImage={studio.image}
          title={studio.title}
        />

        {/* Content & Booking Sticky Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 mt-10">
          {/* Main Info Column (2 cols) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Spec Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 sm:p-6 bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl shadow-sm">
              <div className="space-y-1">
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">
                  Hourly Rate
                </span>
                <p className="font-bricolage text-2xl font-black text-brand">
                  ${studio.hourlyRate}
                  <span className="text-xs text-zinc-400 font-medium"> /hr</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">
                  Deposit
                </span>
                <p className="font-bricolage text-2xl font-bold text-zinc-900 dark:text-white">
                  ${studio.securityDeposit || 0}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">
                  Max Capacity
                </span>
                <p className="font-bricolage text-2xl font-bold text-zinc-900 dark:text-white">
                  {studio.maxCapacity || "10+"}
                  <span className="text-xs text-zinc-400 font-medium"> people</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">
                  Space Type
                </span>
                <p className="font-bricolage text-base font-bold text-zinc-900 dark:text-white truncate">
                  {studio.category || "Studio"}
                </p>
              </div>
            </div>

            {/* Overview Section */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="font-bricolage text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                About this creative workspace
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-light whitespace-pre-line">
                {studio.overview ||
                  "This state-of-the-art creative space is tailored for high-impact production shoots, recording sessions, and creative workshops. Equipped with high ceilings, precision acoustics, and premium amenities."}
              </p>
            </div>

            {/* Amenities Section */}
            {studio.amenities && studio.amenities.length > 0 && (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h2 className="font-bricolage text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-5">
                  Included Amenities & Gear
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {studio.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800"
                    >
                      <FiCheckCircle className="w-4 h-4 text-brand shrink-0" />
                      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Host Information Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="font-bricolage text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                Hosted by
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand/10 text-brand font-black text-xl flex items-center justify-center border border-brand/20 shadow-xs">
                  {studio.ownerName ? studio.ownerName.charAt(0).toUpperCase() : "H"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bricolage text-lg font-bold text-zinc-900 dark:text-white">
                      {studio.ownerName || "StudioSpace Verified Host"}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80">
                      <FiShield className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                  {studio.ownerEmail && (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      <FiMail className="w-3.5 h-3.5" />
                      <span>{studio.ownerEmail}</span>
                    </div>
                  )}                  
                </div>
              </div>
            </div>
          </div>

          {/* Right Sticky Booking Widget (1 col) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl shadow-zinc-200/40 dark:shadow-none transition-colors">
              {/* Pricing Header */}
              <div className="flex items-baseline justify-between pb-5 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                  <span className="font-bricolage text-3xl font-black text-brand tracking-tight">
                    ${studio.hourlyRate}
                  </span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                    {" "}
                    / hour
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <FiStar className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{Number(studio.rating || 4.9).toFixed(1)}</span>
                </div>
              </div>

              {/* Booking Inputs */}
              <div className="space-y-4 my-5">
                {/* Date Selection */}
                <div>
                  <label
                    htmlFor="booking-date"
                    className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5"
                  >
                    Select Shoot Date
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      id="booking-date"
                      type="date"
                      value={bookingDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand cursor-pointer"
                    />
                  </div>
                </div>

                {/* Duration & Start Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="start-time"
                      className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5"
                    >
                      Start Time
                    </label>
                    <div className="relative">
                      <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        id="start-time"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full pl-9 pr-2 py-2.5 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="shoot-hours"
                      className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5"
                    >
                      Hours
                    </label>
                    <input
                      id="shoot-hours"
                      type="number"
                      min="1"
                      step="1"
                      value={shootHours}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setShootHours(val === "" ? "" : Math.max(1, parseInt(val, 10)));
                      }}
                      onBlur={() => {
                        if (!shootHours || shootHours < 1) setShootHours(1);
                      }}
                      className="w-full px-3 py-2.5 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                      placeholder="Hours"
                    />
                  </div>
                </div>
              </div>

              {/* Price Calculation breakdown */}
              <div className="space-y-2.5 py-4 border-t border-b border-zinc-100 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>
                    ${studio.hourlyRate} × {parsedHours} {parsedHours === 1 ? "hour" : "hours"}
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    ${totalPrice}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-sm font-bold text-zinc-900 dark:text-white">
                  <span>Total</span>
                  <span className="font-bricolage text-lg text-brand font-black">
                    ${totalPrice}
                  </span>
                </div>
              </div>

              {/* Book Workspace Button */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleInitiateBooking}
                  className="w-full py-3.5 px-6 rounded-2xl text-base font-bold text-white bg-brand hover:bg-brand-hover shadow-md hover:shadow-lg hover:shadow-brand/25 transition-all active:scale-[0.98] cursor-pointer"
                >
                  Book Workspace Now
                </button>

                <p className="text-[11px] text-center text-zinc-400 mt-3 font-light">
                  You won&apos;t be billed until the host accepts your reservation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand bg-brand/10 border border-brand/20 rounded-full mb-2">
                Confirm Reservation
              </span>
              <h3 className="font-bricolage text-2xl font-black text-zinc-900 dark:text-white">
                Book {studio.title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Review your session details before sending request to the studio host.
              </p>
            </div>

            {/* Modal Details Summary */}
            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Date & Start Time:</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {bookingDate} at {startTime} ({parsedHours} {parsedHours === 1 ? "hour" : "hours"})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Location:</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-60">
                    {studio.location}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Creator Account:</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {user?.name || "Creator"} ({user?.email})
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60 text-sm font-bold text-zinc-900 dark:text-white">
                  <span>Total Amount Due:</span>
                  <span className="font-bricolage text-base text-brand font-black">
                    ${totalPrice}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-brand hover:bg-brand-hover shadow-md hover:shadow-brand/20 transition-all active:scale-95 cursor-pointer"
                >
                  Confirm & Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StudioDetailsPage = () => {
  return (
    <Suspense fallback={<StudioDetailsSkeleton />}>
      <StudioDetails />
    </Suspense>
  );
};

export default StudioDetailsPage;
