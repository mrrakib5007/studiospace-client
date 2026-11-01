"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

import {
  FiArrowRight,
  FiCompass,
  FiPlusCircle,
  FiCheckCircle,
} from "react-icons/fi";

const slides = [
  {
    id: 1,
    headline: "Unleash Your Vision in World-Class Production Studios",
    subtext:
      "Book soundproof soundstages, full-service cyclorama walls, and professional cinema lighting rigs by the hour. Tailored for commercial directors, indie filmmakers, and video creators.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop",
    features: ["Infinity Cyc Wall", "Pre-rigged 4K/8K Lights", "Soundproof Stages"],
  },
  {
    id: 2,
    headline: "Sunlit Creative Spaces Crafted for Editorial Photography",
    subtext:
      "Discover high-ceiling lofts flooded with pure northern daylight, curated furniture, and seamless backdrop rollers. Elevate your fashion, portrait, and lookbook shoots.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
    features: ["Floor-to-Ceiling Windows", "Profoto Strobe Kits", "HMU Dressing Rooms"],
  },
  {
    id: 3,
    headline: "Acoustically Tuned Suites for Music & Podcast Production",
    subtext:
      "Record pristine audio with calibrated vocal booths, vintage outboard gear, and 4-camera podcast setups. Instant hourly access with zero long-term commitments.",
    image:
      "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=2070&auto=format&fit=crop",
    features: ["Acoustically Treated", "Neumann & Shure Mics", "Multi-Cam Video Setup"],
  },
  {
    id: 4,
    headline: "Expansive Wooden Floors for Dance & Rehearsal Movement",
    subtext:
      "Shock-absorbing sprung hardwood floors, floor-to-ceiling mirror walls, and Bluetooth surround sound. The ultimate space for choreography, auditions, and physical workshops.",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop",
    features: ["Sprung Harlequin Floor", "Full Mirror Walls", "Surround Sound Array"],
  },
];

const SlideContent = ({ slide, priority = false }) => (
  <div className="relative w-full h-full">
    <div className="absolute inset-0">
      <Image
        src={slide.image}
        alt={slide.headline}
        fill
        priority={priority}
        className="object-cover object-center transition-transform duration-7000 ease-out scale-105"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-linear-to-r from-zinc-950/80 via-zinc-950/45 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-zinc-950/60 via-transparent to-zinc-950/20" />
    </div>

    <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center py-8 sm:py-10">
      <div className="max-w-2xl lg:max-w-3xl space-y-4 sm:space-y-5">
        <h1 className="font-bricolage text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] drop-shadow-md">
          {slide.headline}
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-zinc-100/90 leading-relaxed max-w-2xl font-light drop-shadow-xs">
          {slide.subtext}
        </p>

        <div className="hidden sm:flex flex-wrap items-center gap-2 pt-0.5">
          {slide.features.map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 backdrop-blur-xs border border-white/10 text-xs font-medium text-zinc-300"
            >
              <FiCheckCircle className="w-3.5 h-3.5 text-brand" />
              <span>{feature}</span>
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1.5 sm:pt-2">
          <Link
            href="/studios"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-sm sm:text-base font-semibold text-white bg-brand hover:bg-brand-hover shadow-lg shadow-brand/25 hover:shadow-xl hover:shadow-brand/35 transition-all duration-200 active:scale-95 group cursor-pointer"
          >
            <FiCompass className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
            <span>Explore Studios</span>
            <FiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          <Link
            href="/add-studio"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-sm sm:text-base font-semibold text-white bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-white/35 transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
          >
            <FiPlusCircle className="w-5 h-5 text-brand" />
            <span>Host Your Space</span>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const Banner = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-zinc-950">
      {mounted ? (
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1000}
          loop={true}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          className="w-full h-135 sm:h-145 lg:h-160 select-none"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.id} className="relative w-full h-full">
              <SlideContent slide={slide} priority={index === 0} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="w-full h-135 sm:h-145 lg:h-160 select-none relative">
          <SlideContent slide={slides[0]} priority={true} />
        </div>
      )}
    </section>
  );
};

export default Banner;
