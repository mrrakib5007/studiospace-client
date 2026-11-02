"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiMapPin,
  FiStar,
  FiUsers,
  FiArrowRight,
  FiShield,
} from "react-icons/fi";

const StudioCard = ({ studio }) => {
  if (!studio) return null;

  const {
    _id,
    title,
    category,
    hourlyRate,
    securityDeposit,
    maxCapacity,
    location,
    image,
    rating = 4.9,
    reviewCount = 0,
  } = studio;

  return (
    <div className="group flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none hover:border-brand/40 dark:hover:border-brand/40 transition-all duration-300">
      {/* Studio Image & Badges */}
      <div className="relative w-full aspect-16/10 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={image || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop"}
          alt={title || "Creative Studio Workspace"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between pointer-events-none">
          {/* Category Badge */}
          <span className="backdrop-blur-md bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 text-xs font-semibold px-3 py-1.5 rounded-full shadow-xs border border-white/20 dark:border-zinc-700">
            {category || "Creative Space"}
          </span>

          {/* Rating Badge */}
          <div className="flex items-center gap-1.5 backdrop-blur-md bg-black/65 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-xs">
            <FiStar className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{Number(rating).toFixed(1)}</span>
            {reviewCount > 0 && (
              <span className="text-zinc-300 text-[11px] font-normal">
                ({reviewCount})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
            <FiMapPin className="w-3.5 h-3.5 text-brand shrink-0" />
            <span className="truncate">{location || "Location on request"}</span>
          </div>

          {/* Title */}
          <h3 className="font-bricolage text-lg sm:text-xl font-bold text-zinc-900 dark:text-white group-hover:text-brand transition-colors line-clamp-1 tracking-tight">
            <Link href={`/studios/${_id}`}>
              {title}
            </Link>
          </h3>

          {/* Meta Specifications */}
          <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            {maxCapacity && (
              <div className="flex items-center gap-1.5">
                <FiUsers className="w-3.5 h-3.5 text-zinc-400" />
                <span>Up to {maxCapacity} creators</span>
              </div>
            )}
            {securityDeposit > 0 && (
              <div className="flex items-center gap-1.5">
                <FiShield className="w-3.5 h-3.5 text-zinc-400" />
                <span>${securityDeposit} deposit</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Footer: Pricing & Action Button */}
        <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div>
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-medium">
              Rate
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-bricolage text-xl font-black text-brand tracking-tight">
                ${hourlyRate}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                / hr
              </span>
            </div>
          </div>

          <Link
            href={`/studios/${_id}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-brand hover:bg-brand-hover rounded-xl shadow-xs hover:shadow-md hover:shadow-brand/20 transition-all duration-200 active:scale-95 group/btn"
          >
            <span>View Details</span>
            <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudioCard;
