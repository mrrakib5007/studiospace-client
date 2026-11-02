"use client";

import React from "react";
import Link from "next/link";
import { FiList, FiPlusCircle, FiArrowRight } from "react-icons/fi";

export default function DashboardMyStudiosPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-12 border border-zinc-200/80 dark:border-zinc-800 text-center max-w-2xl mx-auto shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mx-auto mb-5 shadow-xs">
          <FiList className="w-8 h-8" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand/10 text-brand border border-brand/20 mb-3">
          Host Listings
        </span>

        <h2 className="font-bricolage text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-3">
          My Studio Listings
        </h2>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8 max-w-lg mx-auto leading-relaxed">
          Manage, update, and review all your listed workspaces in one place. Your hosted stages will appear here with live status, edit options, and delete controls.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard/add-studio"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-brand hover:bg-brand-hover transition-all shadow-md shadow-brand/20 cursor-pointer"
          >
            <FiPlusCircle className="w-4 h-4" />
            <span>Add Your First Studio</span>
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 transition-all cursor-pointer"
          >
            <span>Back to Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
