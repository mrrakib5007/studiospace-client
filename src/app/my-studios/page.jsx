"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  FiPlusCircle,
  FiMapPin,
  FiStar,
  FiEye,
  FiGrid,
  FiArrowRight,
} from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export default function MyStudiosPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [studios, setStudios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login?callbackUrl=/my-studios");
    }
  }, [isPending, user, router]);

  useEffect(() => {
    let ignore = false;
    if (!user?.email) return;

    // Fetch studios owned by this user
    fetch(`${API_URL}/api/studios?ownerEmail=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          if (data.success && data.studios?.length > 0) {
            setStudios(data.studios);
          } else {
            setStudios([]);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Error fetching user studios:", err);
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [user?.email]);

  if (isPending || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-zinc-50/60 dark:bg-zinc-950">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-zinc-50/60 dark:bg-zinc-950 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header with CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-bricolage text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              My Studio Listings
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Manage and review your published creative production spaces
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

        {/* Studios Grid or Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 h-64 animate-pulse"
              />
            ))}
          </div>
        ) : studios.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto mb-4">
              <FiGrid className="w-7 h-7" />
            </div>
            <h3 className="font-bricolage text-xl font-bold text-zinc-900 dark:text-white mb-2">
              No Studios Listed Yet
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              You haven&apos;t listed any production spaces yet. List your studio to start accepting bookings.
            </p>
            <Link
              href="/add-studio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover transition-all"
            >
              <FiPlusCircle className="w-4 h-4" />
              <span>List Your First Studio</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studios.map((studio) => (
              <div
                key={studio._id}
                className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 overflow-hidden shadow-xs hover:border-brand/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full aspect-16/10 bg-zinc-100 dark:bg-zinc-800">
                    <Image
                      src={
                        studio.image ||
                        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop"
                      }
                      alt={studio.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-zinc-900 dark:text-white border border-white/20">
                      {studio.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <FiMapPin className="w-3.5 h-3.5 text-brand" />
                      <span className="truncate">{studio.location}</span>
                    </div>

                    <h3 className="font-bricolage text-lg font-bold text-zinc-900 dark:text-white line-clamp-1">
                      {studio.title}
                    </h3>

                    <div className="flex items-center justify-between pt-2">
                      <span className="font-bricolage text-lg font-black text-brand">
                        ${studio.hourlyRate}
                        <span className="text-xs font-normal text-zinc-400 ml-1">
                          / hr
                        </span>
                      </span>

                      <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                        <FiStar className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{studio.rating || 5.0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <Link
                    href={`/studios/${studio._id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                  >
                    <FiEye className="w-3.5 h-3.5" />
                    <span>View Public Page</span>
                  </Link>

                  <Link
                    href={`/studios/${studio._id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-brand"
                  >
                    <span>Details</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}