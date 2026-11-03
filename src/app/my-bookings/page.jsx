"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiArrowRight,
  FiCheckCircle,
  FiXCircle,
  FiSlash,
  FiAlertTriangle,
  FiX,
  FiLayers,
  FiDollarSign,
  FiExternalLink,
  FiCheck,
} from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// Status styling configuration
const STATUS_CONFIG = {
  Pending: {
    label: "Pending",
    badgeClass:
      "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    dotClass: "bg-amber-500",
    icon: FiClock,
  },
  Confirmed: {
    label: "Confirmed",
    badgeClass:
      "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    dotClass: "bg-emerald-500",
    icon: FiCheckCircle,
  },
  Completed: {
    label: "Completed",
    badgeClass:
      "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    dotClass: "bg-blue-500",
    icon: FiCheck,
  },
  Cancelled: {
    label: "Cancelled",
    badgeClass:
      "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
    dotClass: "bg-red-500",
    icon: FiXCircle,
  },
};

function formatBookingDate(dateStr) {
  if (!dateStr) return "Date not specified";
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  } catch {}
  return dateStr;
}

export default function MyBookingsPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Fetch bookings for logged-in user
  useEffect(() => {
    let ignore = false;
    if (!user?.email) return;

    fetch(`${API_URL}/api/bookings?userEmail=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          if (data.success && Array.isArray(data.bookings)) {
            setBookings(data.bookings);
          } else {
            setBookings([]);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Error fetching bookings:", err);
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [user?.email]);

  // Handle Cancel Booking
  const handleConfirmCancel = async () => {
    if (!bookingToCancel?._id) return;

    try {
      setIsCancelling(true);
      const res = await fetch(
        `${API_URL}/api/bookings/${bookingToCancel._id}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to cancel booking reservation");
      }

      toast.success("Booking reservation cancelled successfully!");

      // Update state locally
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingToCancel._id ? { ...b, status: "Cancelled" } : b
        )
      );
      setBookingToCancel(null);
    } catch (err) {
      console.error("Cancellation error:", err);
      toast.error(err.message || "Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  // Filter bookings based on active tab
  const filteredBookings =
    activeTab === "All"
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  // Counts for tabs
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "Confirmed").length;
  const completedCount = bookings.filter((b) => b.status === "Completed").length;
  const cancelledCount = bookings.filter((b) => b.status === "Cancelled").length;

  if (isPending || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-zinc-50/60 dark:bg-zinc-950">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-zinc-50/60 dark:bg-zinc-950 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>            
            <h1 className="font-bricolage text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              My Bookings
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Track and manage all your studio session reservations
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover shadow-md shadow-brand/20 transition-all active:scale-95"
          >
            <span>Explore Studios</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-zinc-200/80 dark:border-zinc-800">
          {[
            { id: "All", label: "All Bookings", count: bookings.length },
            { id: "Pending", label: "Pending", count: pendingCount },
            { id: "Confirmed", label: "Confirmed", count: confirmedCount },
            { id: "Completed", label: "Completed", count: completedCount },
            { id: "Cancelled", label: "Cancelled", count: cancelledCount },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-all border-b-2 -mb-0.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "border-brand text-brand dark:text-brand bg-brand/5"
                    : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-brand text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 flex flex-col md:flex-row gap-6"
              >
                <div className="w-full md:w-44 h-32 bg-zinc-200 dark:bg-zinc-800 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                  <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
                  <div className="h-4 bg-zinc-100 dark:bg-zinc-800/60 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-12 sm:p-16 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mx-auto mb-4">
              <FiCalendar className="w-8 h-8" />
            </div>
            <h3 className="font-bricolage text-xl font-bold text-zinc-900 dark:text-white mb-2">
              {activeTab === "All"
                ? "No Bookings Found"
                : `No ${activeTab} Bookings`}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
              {activeTab === "All"
                ? "You haven't reserved any studio creative spaces yet. Explore available studios and lock in your next creative session."
                : `You currently have no reservations marked with status "${activeTab}".`}
            </p>
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover shadow-md shadow-brand/20 transition-all active:scale-95"
            >
              <span>Explore Studios</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Bookings List */
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const statusCfg =
                STATUS_CONFIG[booking.status] || STATUS_CONFIG.Pending;
              const StatusIcon = statusCfg.icon;
              const isPendingStatus = booking.status === "Pending";

              return (
                <div
                  key={booking._id}
                  className="group bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-5 sm:p-6 shadow-xs hover:border-brand/40 transition-all flex flex-col md:flex-row md:items-center gap-5 sm:gap-6"
                >
                  {/* Studio Thumbnail */}
                  <div className="relative w-full md:w-44 h-36 md:h-32 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200/70 dark:border-zinc-700/60">
                    <Image
                      src={
                        booking.studioImage ||
                        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop"
                      }
                      alt={booking.studioTitle || "Studio Booking"}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-900/80 backdrop-blur-xs text-white uppercase tracking-wider">
                        {booking.category || "Studio"}
                      </span>
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div className="flex-1 space-y-2.5 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <span>Booking ID:</span>
                      <span className="font-mono font-medium text-zinc-600 dark:text-zinc-300">
                        #{booking._id ? String(booking._id).slice(-6).toUpperCase() : ""}
                      </span>
                    </div>

                    <h3 className="font-bricolage text-lg sm:text-xl font-bold text-zinc-900 dark:text-white truncate">
                      {booking.studioId ? (
                        <Link
                          href={`/studios/${booking.studioId}`}
                          className="hover:text-brand transition-colors inline-flex items-center gap-1.5"
                        >
                          <span className="truncate">{booking.studioTitle}</span>
                          <FiExternalLink className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover:opacity-100" />
                        </Link>
                      ) : (
                        booking.studioTitle
                      )}
                    </h3>

                    {/* Metadata chips */}
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar className="w-3.5 h-3.5 text-brand shrink-0" />
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                          {formatBookingDate(booking.bookingDate)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <FiClock className="w-3.5 h-3.5 text-brand shrink-0" />
                        <span>
                          {booking.startTime || "10:00"} - {booking.endTime || "14:00"}{" "}
                          ({booking.totalHours || 1} hrs)
                        </span>
                      </div>

                      {booking.studioLocation && (
                        <div className="flex items-center gap-1.5 max-w-xs truncate">
                          <FiMapPin className="w-3.5 h-3.5 text-brand shrink-0" />
                          <span className="truncate">{booking.studioLocation}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status, Pricing & Actions */}
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-zinc-800 shrink-0">
                    {/* Price */}
                    <div className="text-left md:text-right">
                      <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">
                        Total Amount
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-bricolage text-2xl font-black text-brand">
                          ${booking.totalPrice}
                        </span>
                        {booking.hourlyRate > 0 && (
                          <span className="text-xs text-zinc-400">
                            (${booking.hourlyRate}/hr)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Badge & Cancel Action */}
                    <div className="flex flex-col sm:flex-row md:flex-col items-end gap-2">
                      {/* Status Badge (Pending, Confirmed, Completed, Cancelled) */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusCfg.badgeClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotClass}`} />
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span>{statusCfg.label}</span>
                      </span>

                      {/* Cancel Booking Option (Only for Pending status) */}
                      {isPendingStatus && (
                        <button
                          type="button"
                          onClick={() => setBookingToCancel(booking)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200/80 dark:border-red-900/50 hover:border-red-300 dark:hover:border-red-800 transition-all cursor-pointer active:scale-95"
                        >
                          <FiSlash className="w-3 h-3" />
                          <span>Cancel Booking</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {bookingToCancel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-6 relative">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setBookingToCancel(null)}
              disabled={isCancelling}
              className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            {/* Warning Icon & Heading */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/70 dark:border-red-900/50 flex items-center justify-center shrink-0">
                <FiAlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bricolage text-xl font-bold text-zinc-900 dark:text-white">
                  Cancel Booking?
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  This reservation slot will be released back to the host.
                </p>
              </div>
            </div>

            {/* Booking Details Box */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/60 space-y-2 text-xs">
              <div className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                {bookingToCancel.studioTitle}
              </div>
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                <FiCalendar className="w-3.5 h-3.5 text-brand" />
                <span>{formatBookingDate(bookingToCancel.bookingDate)}</span>
                <span>•</span>
                <FiClock className="w-3.5 h-3.5 text-brand" />
                <span>
                  {bookingToCancel.startTime} - {bookingToCancel.endTime} (
                  {bookingToCancel.totalHours} hrs)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-200/60 dark:border-zinc-700/60">
                <FiDollarSign className="w-3.5 h-3.5 text-brand" />
                <span className="font-bold text-zinc-900 dark:text-white">
                  ${bookingToCancel.totalPrice}
                </span>
                <span>total booked amount</span>
              </div>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Are you sure you want to cancel this pending studio reservation?
              This action cannot be undone once confirmed.
            </p>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBookingToCancel(null)}
                disabled={isCancelling}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Keep Booking
              </button>

              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 transition-all cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isCancelling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <>
                    <FiSlash className="w-4 h-4" />
                    <span>Yes, Cancel Booking</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
