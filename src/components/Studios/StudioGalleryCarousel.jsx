"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
  FiX,
  FiImage,
} from "react-icons/fi";

const StudioGalleryCarousel = ({ images = [], fallbackImage = "", title = "Studio Workspace" }) => {

  const rawList = Array.isArray(images) && images.length > 0 ? images : fallbackImage ? [fallbackImage] : [];
  const imageList = rawList.filter((img) => typeof img === "string" && img.trim() !== "");
  const totalImages = imageList.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Navigate next
  const handlePrev = useCallback(() => {
    if (totalImages <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  const handleNext = useCallback(() => {
    if (totalImages <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  // Keyboard navigation
  useEffect(() => {
    if (totalImages <= 1) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape" && isLightboxOpen) setIsLightboxOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext, totalImages, isLightboxOpen]);


  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      handleNext(); // Swiped left -> Next
    } else if (distance < -minSwipeDistance) {
      handlePrev(); // Swiped right -> Prev
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // No images available
  if (totalImages === 0) {
    return (
      <div className="w-full h-72 sm:h-96 md:h-120 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex flex-col items-center justify-center text-zinc-400 border border-zinc-200 dark:border-zinc-800">
        <FiImage className="w-12 h-12 mb-2 text-zinc-300 dark:text-zinc-600" />
        <span className="text-sm font-medium">No studio images available</span>
      </div>
    );
  }

  // Exactly 1 image 
  if (totalImages === 1) {
    return (
      <div className="relative w-full h-72 sm:h-96 md:h-120 rounded-3xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 border border-zinc-200/90 dark:border-zinc-800 shadow-sm group">
        <Image
          src={imageList[0]}
          alt={title}
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1200px"
          className="object-cover transition-transform duration-500 group-hover:scale-102"
        />

        {/* Floating expand button */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          aria-label="View Fullscreen"
          className="absolute top-4 right-4 p-2.5 rounded-2xl bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer"
        >
          <FiMaximize2 className="w-4 h-4" />
        </button>

        {/* Fullscreen Lightbox Modal */}
        {isLightboxOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close fullscreen view"
            >
              <FiX className="w-6 h-6" />
            </button>
            <div className="relative w-full max-w-5xl h-[80vh] rounded-2xl overflow-hidden">
              <Image
                src={imageList[0]}
                alt={title}
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Active Slide Display */}
      <div
        className="relative w-full h-72 sm:h-96 md:h-120 rounded-3xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 border border-zinc-200/90 dark:border-zinc-800 shadow-sm group select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={imageList[currentIndex]}
          alt={`${title} - Photo ${currentIndex + 1}`}
          fill
          priority={currentIndex === 0}
          sizes="(max-width: 1280px) 100vw, 1200px"
          className="object-cover transition-opacity duration-300"
        />

        {/* Image Counter Badge */}
        <div className="absolute top-4 left-4 backdrop-blur-md bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
          {currentIndex + 1} / {totalImages} Photos
        </div>

        {/* Expand / Lightbox Button */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          aria-label="View Fullscreen"
          className="absolute top-4 right-4 p-2.5 rounded-2xl bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer"
        >
          <FiMaximize2 className="w-4 h-4" />
        </button>

        {/* Previous Slide Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Photo"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-black/55 backdrop-blur-md hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105 shadow-md cursor-pointer"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Slide Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Photo"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-black/55 backdrop-blur-md hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105 shadow-md cursor-pointer"
        >
          <FiChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnail Strip (All images in small clickable preview cards) */}
      <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5">
        {imageList.map((imgUrl, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`View photo ${idx + 1}`}
              className={`relative aspect-16/10 rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 transition-all duration-200 cursor-pointer ${
                isActive
                  ? "ring-3 ring-brand shadow-md scale-[1.02]"
                  : "opacity-60 hover:opacity-100 border border-zinc-200/80 dark:border-zinc-800"
              }`}
            >
              <Image
                src={imgUrl}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 20vw, 15vw"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close fullscreen view"
          >
            <FiX className="w-6 h-6" />
          </button>

          {/* Lightbox Prev / Next */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous Photo"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <FiChevronLeft className="w-7 h-7" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next Photo"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <FiChevronRight className="w-7 h-7" />
          </button>

          <div
            className="relative w-full max-w-5xl h-[80vh] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imageList[currentIndex]}
              alt={`${title} - Fullscreen ${currentIndex + 1}`}
              fill
              className="object-contain"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
              {currentIndex + 1} of {totalImages}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudioGalleryCarousel;
