import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiCamera,
  FiVideo,
  FiMic,
  FiMusic,
  FiArrowUpRight,
  FiArrowRight,
} from "react-icons/fi";
import { FaPalette } from "react-icons/fa6";

const categories = [
  {
    id: "photo-studios",
    name: "Photo Studios",
    query: "Photo Studios",
    tagline: "Cyc walls, strobe kits & natural daylight lofts",
    count: "140+ Spaces",
    image: "/categories/photo-studios.jpg",
    icon: FiCamera,
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    id: "sound-stages",
    name: "Sound Stages",
    query: "Sound Stages",
    tagline: "Cinema grids, soundproof floors & green screens",
    count: "85+ Stages",
    image: "/categories/sound-stages.jpg",
    icon: FiVideo,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "podcast-rooms",
    name: "Podcast Rooms",
    query: "Podcast Rooms",
    tagline: "Shure SM7B mics, multi-cam 4K & acoustic foam",
    count: "65+ Rooms",
    image: "/categories/podcast-rooms.jpg",
    icon: FiMic,
    color: "from-purple-500/20 to-violet-500/20",
  },
  {
    id: "music-suites",
    name: "Music Suites",
    query: "Music Suites",
    tagline: "Mixing consoles, vocal booths & analog gear",
    count: "95+ Suites",
    image: "/categories/music-suites.jpg",
    icon: FiMusic,
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    id: "art-workshops",
    name: "Art Workshops",
    query: "Art Workshops",
    tagline: "Easels, pottery wheels & open creator space",
    count: "70+ Studios",
    image: "/categories/art-workshops.jpg",
    icon: FaPalette,
    color: "from-rose-500/20 to-pink-500/20",
  },
];

const CategorySection = () => {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-zinc-50/70 dark:bg-zinc-950 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 lg:mb-14">
          <div className="max-w-2xl space-y-3">
            <h2 className="font-bricolage text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
              Browse by Studio Categories
            </h2>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
              Explore specialized environments pre-equipped with high-end lighting,
              sound treatment, and creative infrastructure tailored to your workflow.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-hover transition-colors group self-start md:self-end shrink-0"
          >
            <span>Explore All Studios</span>
            <FiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const targetHref = `/studios?category=${encodeURIComponent(category.query)}`;

            return (
              <Link
                key={category.id}
                href={targetHref}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl h-88 sm:h-96 p-5 sm:p-6 border border-zinc-200/90 dark:border-zinc-800 bg-zinc-900 shadow-xs hover:shadow-xl hover:shadow-brand/10 hover:border-brand/50 dark:hover:border-brand/50 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
                aria-label={`Explore ${category.name}`}
              >
                <div className="absolute inset-0">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/20" />
                  <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/80" />
                  <div className="absolute inset-0 bg-brand/0 group-hover:bg-brand/10 transition-colors duration-300" />
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/15 dark:bg-black/40 backdrop-blur-md border border-white/20 text-white shadow-sm group-hover:bg-brand group-hover:border-brand group-hover:text-white transition-all duration-300">
                    <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 dark:bg-black/30 backdrop-blur-md border border-white/15 text-white/80 group-hover:bg-brand group-hover:border-brand group-hover:text-white transition-all duration-300">
                    <FiArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>

                <div className="relative z-10 space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-white/15 dark:bg-zinc-800/80 backdrop-blur-md text-zinc-100 border border-white/10">
                    {category.count}
                  </span>

                  <h3 className="font-bricolage text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight group-hover:text-brand transition-colors duration-200">
                    {category.name}
                  </h3>

                  <p className="text-xs text-zinc-300/90 leading-relaxed font-light line-clamp-2">
                    {category.tagline}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
