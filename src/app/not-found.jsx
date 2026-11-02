import React from "react";
import Link from "next/link";
import {
  FiHome,
  FiCompass,
} from "react-icons/fi";

export const metadata = {
  title: "404 - Studio Space Not Found | StudioSpace",
  description:
    "The creative studio workspace or production stage you are looking for could not be found.",
};

export default function NotFound() {

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50/50 dark:bg-zinc-950 transition-colors">
      <div className="max-w-2xl w-full text-center">
        {/* Studio Illustration Graphic */}
        <div className="relative mx-auto mb-3 w-full max-w-md h-56 sm:h-64 flex items-center justify-center">
          {/* Subtle glow background */}
          <div className="absolute inset-0 bg-linear-to-tr from-brand/10 via-emerald-500/5 to-teal-500/10 rounded-full blur-3xl -z-10" />

          {/* Creative Studio 404 SVG Illustration */}
          <svg
            viewBox="0 0 480 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full max-h-64 drop-shadow-md select-none"
            aria-hidden="true"
          >
            {/* Studio Floor Line */}
            <path
              d="M30 220 H450"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="text-zinc-200 dark:text-zinc-800"
            />
            <path
              d="M70 232 H410"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              strokeLinecap="round"
              className="text-zinc-300 dark:text-zinc-800/80"
            />

            {/* Left Spotlight / Softbox Stand */}
            <g className="text-zinc-400 dark:text-zinc-600">
              {/* Tripod Legs */}
              <line x1="85" y1="125" x2="60" y2="220" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <line x1="85" y1="125" x2="110" y2="220" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <line x1="85" y1="100" x2="85" y2="180" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              {/* Central pole */}
              <line x1="85" y1="70" x2="85" y2="125" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

              {/* Spotlight Head tilted right */}
              <g transform="rotate(25 85 70)">
                <rect x="68" y="52" width="34" height="26" rx="4" className="fill-zinc-800 dark:fill-zinc-700" />
                <path d="M102 50 L126 40 L126 88 L102 80 Z" className="fill-zinc-700 dark:fill-zinc-600" />
                {/* Light Bulb */}
                <circle cx="106" cy="64" r="5" className="fill-brand" />
              </g>

              {/* Light Cone Ray */}
              <path
                d="M110 75 L290 190 L180 220 Z"
                fill="url(#spotlight-gradient)"
                opacity="0.35"
              />
            </g>

            {/* Center: Film Clapperboard with "404" */}
            <g transform="translate(180, 50)">
              {/* Drop Shadow */}
              <rect x="4" y="24" width="130" height="110" rx="14" fill="#000000" opacity="0.12" />

              {/* Clapper Body */}
              <rect
                x="0"
                y="20"
                width="130"
                height="110"
                rx="14"
                className="fill-white dark:fill-zinc-900 stroke-zinc-300 dark:stroke-zinc-700"
                strokeWidth="2"
              />

              {/* Clapper Top Stick (Open hinge angle) */}
              <g transform="rotate(-12 0 20)">
                <rect
                  x="0"
                  y="0"
                  width="130"
                  height="22"
                  rx="6"
                  className="fill-zinc-900 dark:fill-zinc-800 stroke-zinc-700"
                  strokeWidth="1.5"
                />
                {/* Diagonal Stripes on top stick */}
                <path d="M22 0 L10 22 M46 0 L34 22 M70 0 L58 22 M94 0 L82 22 M118 0 L106 22" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
              </g>

              {/* Horizontal divider stick */}
              <rect
                x="0"
                y="20"
                width="130"
                height="14"
                className="fill-zinc-900 dark:fill-zinc-800 stroke-zinc-700"
                strokeWidth="1"
              />
              <path d="M22 20 L10 34 M46 20 L34 34 M70 20 L58 34 M94 20 L82 34 M118 20 L106 34" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />

              {/* Clapperboard Text: Scene 404 */}
              <text x="65" y="70" textAnchor="middle" className="fill-brand font-black" style={{ fontSize: "28px", fontWeight: "900", fontFamily: "var(--font-bricolage), sans-serif" }}>
                404
              </text>
              <text x="65" y="90" textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-400 font-bold" style={{ fontSize: "10px", letterSpacing: "2px" }}>
                SCENE MISSING
              </text>

              {/* Data grid line inside clapperboard */}
              <line x1="16" y1="102" x2="114" y2="102" stroke="currentColor" strokeWidth="1" className="text-zinc-200 dark:text-zinc-800" />
              <text x="35" y="118" textAnchor="middle" className="fill-zinc-400 dark:fill-zinc-500" style={{ fontSize: "8px", fontWeight: "600" }}>
                TAKE: 01
              </text>
              <text x="95" y="118" textAnchor="middle" className="fill-zinc-400 dark:fill-zinc-500" style={{ fontSize: "8px", fontWeight: "600" }}>
                ROLL: NONE
              </text>
            </g>

            {/* Right: Studio Video / Cinema Camera */}
            <g className="text-zinc-400 dark:text-zinc-600" transform="translate(350, 90)">
              {/* Tripod Legs */}
              <line x1="30" y1="40" x2="0" y2="130" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <line x1="30" y1="40" x2="30" y2="130" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <line x1="30" y1="40" x2="60" y2="130" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <line x1="10" y1="100" x2="50" y2="100" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

              {/* Camera Body */}
              <rect x="8" y="10" width="46" height="30" rx="6" className="fill-zinc-800 dark:fill-zinc-700" />
              {/* Lens pointing toward clapperboard (left) */}
              <path d="M8 18 L-8 12 L-8 38 L8 32 Z" className="fill-zinc-700 dark:fill-zinc-600" />
              <rect x="-12" y="10" width="4" height="30" rx="2" className="fill-zinc-900 dark:fill-zinc-500" />

              {/* Top Handle & Mic */}
              <path d="M18 10 L18 2 L42 2 L42 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              {/* Recording Red Indicator Light */}
              <circle cx="44" cy="18" r="3" className="fill-red-500 animate-pulse" />
              {/* Viewfinder display */}
              <rect x="22" y="-4" width="16" height="10" rx="2" className="fill-brand/40 stroke-brand" strokeWidth="1" />
            </g>

            {/* Floating film particles/accents */}
            <circle cx="150" cy="40" r="3" className="fill-brand/60 animate-ping" />
            <circle cx="340" cy="50" r="2.5" className="fill-teal-400/70" />
            <circle cx="120" cy="180" r="2" className="fill-brand/40" />
            <circle cx="370" cy="200" r="2" className="fill-emerald-400/40" />

            {/* Definitions for Gradients */}
            <defs>
              <linearGradient id="spotlight-gradient" x1="100" y1="70" x2="250" y2="210" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>Error 404 • Page Not Found</span>
        </div>

        {/* Headline */}
        <h1 className="font-bricolage text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-4">
          Lost on the Studio Floor?
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        {/* Action Buttons: Direct Return to Home + Explore Studios */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12">
          {/* Direct Return to Home button as specified in requirements */}
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-brand hover:bg-brand-hover active:scale-[0.98] transition-all shadow-md shadow-brand/20 cursor-pointer"
          >
            <FiHome className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            href="/studios"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-brand dark:hover:border-brand hover:text-brand dark:hover:text-brand active:scale-[0.98] transition-all shadow-2xs cursor-pointer"
          >
            <FiCompass className="w-4 h-4" />
            <span>Explore All Studios</span>
          </Link>
        </div>
        
      </div>
    </div>
  );
}
