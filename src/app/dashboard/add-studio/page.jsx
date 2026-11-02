"use client";

import React from "react";
import Link from "next/link";
import { FiPlusCircle, FiArrowRight, FiCamera, FiCheckCircle } from "react-icons/fi";

export default function DashboardAddStudioPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-12 border border-zinc-200/80 dark:border-zinc-800 text-center max-w-2xl mx-auto shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mx-auto mb-5 shadow-xs">
          <FiPlusCircle className="w-8 h-8" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand/10 text-brand border border-brand/20 mb-3">
          Step 1 • Add Studio
        </span>

        <h2 className="font-bricolage text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-3">
          List Your Creative Space
        </h2>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8 max-w-lg mx-auto leading-relaxed">
          The studio listing form is being prepared. You will be able to submit title, categories, hourly rate, security deposit, capacity, address, and upload photos with ImgBB.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-brand hover:bg-brand-hover transition-all shadow-md shadow-brand/20 cursor-pointer"
          >
            <span>Back to Profile</span>
          </Link>
          <Link
            href="/dashboard/my-studios"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 transition-all cursor-pointer"
          >
            <span>View My Studios</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
