import React from "react";
import Link from "next/link";
import {
  FiShield,
  FiUserCheck,
  FiLock,
  FiHeadphones,
  FiCheckCircle,
  FiArrowRight,
  FiAward,
} from "react-icons/fi";

const guarantees = [
  {
    id: "liability",
    tag: "Up to $1M Coverage",
    title: "Liability Protection",
    description:
      "Comprehensive property and personal liability protection covering both hosts and creators against accidental damage during booked production sessions.",
    points: [
      "$1,000,000 property damage shield",
      "Zero deductible on verified claims",
      "Fast 48-hour claim resolution",
    ],
    icon: FiShield,
  },
  {
    id: "verified-profiles",
    tag: "100% ID Verified",
    title: "Verified Profiles",
    description:
      "Every studio owner and creator undergoes thorough identity verification, secure payment screening, and transparent peer reviews.",
    points: [
      "Government ID & biometrics check",
      "Verified studio ownership badges",
      "Authentic community review history",
    ],
    icon: FiUserCheck,
  },
  {
    id: "equipment-safety",
    tag: "Gear Protection",
    title: "Equipment Safety",
    description:
      "Digital equipment check-in logs ensure cameras, strobe kits, and cinema rigs are inspected and documented before and after every booking.",
    points: [
      "Digital gear inspection logs",
      "Equipment replacement guarantee",
      "Dispute mediation support",
    ],
    icon: FiLock,
  },
  {
    id: "support-24-7",
    tag: "Always Available",
    title: "24/7 Support",
    description:
      "Real industry professionals available 24 hours a day, 7 days a week. From access troubleshooting to booking extensions, we've got your back.",
    points: [
      "Under 2-minute live chat response",
      "Direct emergency phone hotline",
      "On-demand production concierge",
    ],
    icon: FiHeadphones,
  },
];

const trustStats = [
  { value: "99.8%", label: "Dispute-Free Bookings" },
  { value: "$1M", label: "Host Protection Guarantee" },
  { value: "15,000+", label: "Completed Productions" },
  { value: "24/7", label: "Live Concierge Support" },
];

const HostGuarantee = () => {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-zinc-50/70 dark:bg-zinc-950 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-16">
          <h2 className="font-bricolage text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
            Host Guarantee & Creator Support
          </h2>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
            Create with total peace of mind. StudioSpace safeguards every session with
            industry-leading insurance coverage, verified profiles, and round-the-clock creator assistance.
          </p>
        </div>

        {/* 4 Guarantees Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between h-full p-6 sm:p-7 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xs hover:shadow-xl hover:shadow-brand/5 hover:border-brand/40 dark:hover:border-brand/40 transition-all duration-300 hover:-translate-y-1.5"
              >
                <div>
                  {/* Top Bar: Icon & Pill Tag */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand/10 text-brand border border-brand/20 group-hover:bg-brand group-hover:text-white group-hover:border-brand transition-all duration-300 shadow-xs">
                      <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    </div>

                    <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-md bg-brand/10 dark:bg-brand/15 text-brand">
                      {item.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bricolage text-xl font-bold text-zinc-900 dark:text-white mb-2.5 group-hover:text-brand transition-colors duration-200">
                    {item.title}
                  </h3>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-light mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Feature Points Checklist */}
                <div className="pt-5 border-t border-zinc-100 dark:border-zinc-800/70 space-y-2.5">
                  {item.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      <FiCheckCircle className="w-3.5 h-3.5 text-brand shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Platform Trust Highlight Banner */}
        <div className="mt-12 sm:mt-14 p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 w-full lg:w-auto text-center lg:text-left">
            {trustStats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="font-bricolage text-2xl sm:text-3xl font-extrabold text-brand tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
            <Link
              href="/studios"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover shadow-md hover:shadow-lg hover:shadow-brand/25 transition-all duration-200 active:scale-95 group cursor-pointer"
            >              
              <span>Explore Protected Spaces</span>
              <FiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HostGuarantee;
