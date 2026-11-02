"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowRight, FiStar, FiRefreshCw } from "react-icons/fi";
import StudioCard from "@/components/Studios/StudioCard";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const FeaturedSkeletonCard = () => (
  <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden animate-pulse">
    <div className="w-full aspect-16/10 bg-zinc-200 dark:bg-zinc-800" />
    <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between space-y-4">
      <div>
        <div className="w-28 h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded-md mb-2.5" />
        <div className="w-3/4 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-md mb-2" />
        <div className="w-1/2 h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="w-16 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
        <div className="w-28 h-9 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
      </div>
    </div>
  </div>
);

const FeaturedStudios = () => {
  const [studios, setStudios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let ignore = false;

    fetch(`${API_URL}/api/studios?limit=6&sort=rating-high`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!ignore) {
          if (data.success) {
            setStudios(data.studios || []);
            setError(null);
          } else {
            setError(data.message || "Failed to load featured studios");
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Error loading featured studios:", err);
          setError("Unable to connect to the studio server.");
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [refreshIndex]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setRefreshIndex((prev) => prev + 1);
  };

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-white dark:bg-zinc-950 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12 lg:mb-14">
          <h2 className="font-bricolage text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
            Featured Studio Spaces
          </h2>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
            Explore our highest-rated studio spaces, hand-picked for quality
            lighting, soundproofing, and professional creator amenities.
          </p>
        </div>

        {/* Studios Grid / Loading / Error State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <FeaturedSkeletonCard key={idx} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 text-center max-w-md mx-auto">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand hover:bg-brand-hover transition-all cursor-pointer"
            >
              <FiRefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : studios.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            No featured studios available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}

        {/* Bottom CTA to explore all studios */}
        {!isLoading && studios.length > 0 && (
          <div className="mt-14 sm:mt-16 text-center">
          <Link
            href="/studios"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl text-sm sm:text-base font-semibold text-white bg-brand hover:bg-brand-hover shadow-md hover:shadow-lg hover:shadow-brand/25 transition-all duration-200 active:scale-95 group cursor-pointer"
          >
            <span>Browse All Studio Listings</span>
            <FiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedStudios;