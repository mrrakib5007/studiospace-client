"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import {
  FiPlusCircle,
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiStar,
  FiExternalLink,
  FiAlertTriangle,
  FiX,
  FiLayers,
} from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export default function MyListingsPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [studios, setStudios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studioToDelete, setStudioToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch studios owned by currently logged-in user
  useEffect(() => {
    let ignore = false;
    if (!user?.email) return;

    fetch(`${API_URL}/api/studios?ownerEmail=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          if (data.success && data.studios) {
            setStudios(data.studios);
          } else {
            setStudios([]);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Error fetching listings:", err);
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [user?.email]);

  // Handle studio deletion
  const handleDeleteConfirm = async () => {
    if (!studioToDelete?._id) return;

    setIsDeleting(true);
    const toastId = toast.loading("Deleting studio listing...");

    try {
      const res = await fetch(`${API_URL}/api/studios/${studioToDelete._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete studio listing");
      }

      setStudios((prev) => prev.filter((s) => s._id !== studioToDelete._id));
      toast.success("Studio listing deleted successfully!", { id: toastId });
      setStudioToDelete(null);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.message || "Could not delete studio workspace", {
        id: toastId,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isPending || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-zinc-50/60 dark:bg-zinc-950">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-zinc-50/60 dark:bg-zinc-950 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-bricolage text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              My Studio Listings
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Manage, update, and review your hosted creative studio spaces
            </p>
          </div>

          <Link
            href="/add-studio"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover shadow-md shadow-brand/20 transition-all active:scale-95"
          >
            <FiPlusCircle className="w-4 h-4" />
            <span>Add New Studio</span>
          </Link>
        </div>

        {/* Listings Content */}
        {isLoading ? (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-4 animate-pulse">
            <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
            <div className="h-16 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl" />
            <div className="h-16 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl" />
            <div className="h-16 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl" />
          </div>
        ) : studios.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-12 sm:p-16 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mx-auto mb-4">
              <FiLayers className="w-8 h-8" />
            </div>
            <h3 className="font-bricolage text-xl font-bold text-zinc-900 dark:text-white mb-2">
              No Studio Listings Yet
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
              You haven&apos;t published any creative studios under your account. Publish your first workspace to start accepting creator bookings.
            </p>
            <Link
              href="/add-studio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover shadow-md shadow-brand/20 transition-all active:scale-95"
            >
              <FiPlusCircle className="w-4 h-4" />
              <span>List Your First Studio</span>
            </Link>
          </div>
        ) : (
          /* Table & Card Format */
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200/80 dark:border-zinc-800 text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Studio Workspace
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Hourly Rate
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Rating
                    </th>
                    <th scope="col" className="px-6 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {studios.map((studio) => (
                    <tr
                      key={studio._id}
                      className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      {/* Image & Title */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 min-w-64">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200/70 dark:border-zinc-700/60">
                            <Image
                              src={
                                studio.image ||
                                "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop"
                              }
                              alt={studio.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/studios/${studio._id}`}
                              className="font-bricolage font-bold text-zinc-900 dark:text-white hover:text-brand transition-colors truncate block text-base"
                            >
                              {studio.title}
                            </Link>
                            <Link
                              href={`/studios/${studio._id}`}
                              className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-brand mt-0.5"
                            >
                              <span>View Details</span>
                              <FiExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/60 dark:border-zinc-700/60">
                          {studio.category || "General"}
                        </span>
                      </td>

                      {/* Hourly Rate */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bricolage text-base font-extrabold text-brand">
                          ${studio.hourlyRate}
                        </span>
                        <span className="text-xs text-zinc-400 ml-1">/ hr</span>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-300 max-w-xs truncate">
                          <FiMapPin className="w-3.5 h-3.5 text-brand shrink-0" />
                          <span className="truncate">{studio.location}</span>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200/60 dark:border-amber-800/50">
                          <FiStar className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{Number(studio.rating || 5.0).toFixed(1)}</span>
                        </div>
                      </td>

                      {/* Actions: Update & Delete */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-2">
                          {/* Update Button */}
                          <Link
                            href={`/studios/edit/${studio._id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-brand hover:text-white dark:hover:bg-brand transition-all border border-zinc-200 dark:border-zinc-700 hover:border-brand cursor-pointer"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                            <span>Update</span>
                          </Link>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setStudioToDelete(studio)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all border border-red-200 dark:border-red-900/60 hover:border-red-600 cursor-pointer"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {studioToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => !isDeleting && setStudioToDelete(null)}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Close Button */}
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => setStudioToDelete(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>

            {/* Warning Icon */}
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
              <FiAlertTriangle className="w-6 h-6" />
            </div>

            {/* Modal Text */}
            <h3 className="font-bricolage text-xl font-bold text-zinc-900 dark:text-white mb-2">
              Delete Studio Listing?
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-zinc-900 dark:text-white">
                &ldquo;{studioToDelete.title}&rdquo;
              </span>
              ? This action cannot be undone and will remove it from search and creator bookings.
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setStudioToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all shadow-md shadow-red-600/20 disabled:opacity-60 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <FiTrash2 className="w-3.5 h-3.5" />
                    <span>Delete Listing</span>
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