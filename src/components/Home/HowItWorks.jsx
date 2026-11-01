import React from "react";
import Link from "next/link";
import {
  FiSearch,
  FiClock,
  FiZap,
  FiFilm,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";

const steps = [
  {
    step: "01",
    title: "Discover Spaces",
    description:
      "Explore verified production stages, photo lofts, and recording suites filtered by gear, cyc walls, and natural daylight.",
    perk: "Smart equipment filters",
    icon: FiSearch,
  },
  {
    step: "02",
    title: "Select Shoot Hours",
    description:
      "Inspect live calendar availability and choose flexible hourly slots or full-day shoot blocks that fit your production timeline.",
    perk: "Flexible hourly rates",
    icon: FiClock,
  },
  {
    step: "03",
    title: "Book Instantly",
    description:
      "Reserve in seconds with secure digital checkout, instant host confirmation, and straightforward arrival instructions.",
    perk: "Instant confirmation",
    icon: FiZap,
  },
  {
    step: "04",
    title: "Create & Produce",
    description:
      "Step into a fully prepped, climate-controlled studio equipped with professional gear and bring your creative vision to life.",
    perk: "Turnkey creative setup",
    icon: FiFilm,
  },
];

const HowItWorks = () => {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-white dark:bg-zinc-950 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-16">
          <h2 className="font-bricolage text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
            How Booking Works
          </h2>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
            From discovering your dream studio to rolling camera on set,
            renting production spaces on StudioSpace takes just four simple steps.
          </p>
        </div>

        {/* 4-Step Interactive Cards Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-14 left-[12%] right-[12%] h-0.5 bg-linear-to-r from-brand/20 via-brand/40 to-brand/20 z-0 pointer-events-none" />

          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative z-10 flex flex-col justify-between h-full p-6 sm:p-7 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xs hover:shadow-xl hover:shadow-brand/5 hover:border-brand/40 dark:hover:border-brand/40 transition-all duration-300 hover:-translate-y-1.5"
              >
                <div>
                  {/* Top Bar: Icon & Step Number */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand/10 text-brand border border-brand/20 group-hover:bg-brand group-hover:text-white group-hover:border-brand transition-all duration-300 shadow-xs">
                      <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    </div>

                    <span className="font-mono text-2xl font-bold text-zinc-300 dark:text-zinc-700 group-hover:text-brand transition-colors duration-300">
                      {item.step}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bricolage text-xl font-bold text-zinc-900 dark:text-white mb-2.5 group-hover:text-brand transition-colors duration-200">
                    {item.title}
                  </h3>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Highlight Chip */}
                <div className="pt-6 mt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  <FiCheckCircle className="w-3.5 h-3.5 text-brand shrink-0" />
                  <span>{item.perk}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-14 sm:mt-16 text-center">
          <Link
            href="/studios"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white bg-brand hover:bg-brand-hover shadow-md hover:shadow-lg hover:shadow-brand/25 transition-all duration-200 active:scale-95 group cursor-pointer"
          >
            <span>Start Exploring Studios</span>
            <FiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
