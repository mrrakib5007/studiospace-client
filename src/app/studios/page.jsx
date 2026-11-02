"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FiSearch,
  FiX,
  FiRefreshCw,
  FiFrown,
} from "react-icons/fi";
import StudioCard from "@/components/Studios/StudioCard";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const categories = [
  "All",
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Art Workshop",
];

const sortOptions = [
  { label: "Newest Listings", value: "newest" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Highest Rated", value: "rating-high" },
];

const StudioSkeletonCard = () => (
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

const ExploreStudiosContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Derive selected category directly from URL query param
  const urlCategory = searchParams.get("category");
  const selectedCategory =
    urlCategory && categories.includes(urlCategory) ? urlCategory : "All";

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [studios, setStudios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch studios from API when filters change
  useEffect(() => {
    let ignore = false;
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== "All") {
      params.append("category", selectedCategory);
    }
    if (debouncedSearch.trim()) {
      params.append("search", debouncedSearch.trim());
    }
    if (sortBy) {
      params.append("sort", sortBy);
    }

    fetch(`${API_URL}/api/studios?${params.toString()}`)
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
            setError(data.message || "Failed to load studios");
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Error loading studios:", err);
          setError(
            "Unable to connect to the studio server. Please make sure the backend is running."
          );
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [selectedCategory, debouncedSearch, sortBy]);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setIsLoading(true);
    if (category === "All") {
      router.replace("/studios");
    } else {
      router.replace(`/studios?category=${encodeURIComponent(category)}`);
    }
  };

  const handleSortChange = (e) => {
    setIsLoading(true);
    setSortBy(e.target.value);
  };

  const handleSearchChange = (e) => {
    setIsLoading(true);
    setSearchQuery(e.target.value);
  };

  const handleResetFilters = () => {
    setIsLoading(true);
    setSearchQuery("");
    setDebouncedSearch("");
    setSortBy("newest");
    router.replace("/studios");
  };

  const retryFetch = () => {
    setIsLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== "All") {
      params.append("category", selectedCategory);
    }
    if (debouncedSearch.trim()) {
      params.append("search", debouncedSearch.trim());
    }
    if (sortBy) {
      params.append("sort", sortBy);
    }
    fetch(`${API_URL}/api/studios?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStudios(data.studios || []);
          setError(null);
        } else {
          setError(data.message || "Failed to load studios");
        }
      })
      .catch(() => {
        setError(
          "Unable to connect to the studio server. Please make sure the backend is running."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-zinc-50/60 dark:bg-zinc-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-left mb-6 sm:mb-8">
          <h1 className="font-bricolage text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Explore Production Studios
          </h1>
        </div>

        {/* Filter & Search Bar Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm mb-8 sm:mb-10 transition-colors">
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center">
            {/* 1. Search Box (Larger / flex-1) */}
            <div className="relative flex-1 w-full">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search studios by title or city (e.g. Brooklyn, Stage, Podcast)..."
                className="w-full h-11 pl-10 pr-9 py-2 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 2. Category Selection (Same width and height as Sort By) */}
            <div className="w-full md:w-56 shrink-0">
              <select
                id="category-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
                aria-label="Filter by Category"
                className="w-full h-11 px-3.5 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all cursor-pointer"
              >
                <option value="All">All Categories</option>
                {categories
                  .filter((cat) => cat !== "All")
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>

            {/* 3. Sort By Selection (Same width and height as Category) */}
            <div className="w-full md:w-56 shrink-0">
              <select
                id="sort-select"
                value={sortBy}
                onChange={handleSortChange}
                aria-label="Sort Studios"
                className="w-full h-11 px-3.5 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Info & Active Filters bar */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {isLoading ? (
              "Searching studio spaces..."
            ) : (
              <>
                Showing{" "}
                <span className="font-bold text-zinc-900 dark:text-white">
                  {studios.length}
                </span>{" "}
                available creative {studios.length === 1 ? "space" : "spaces"}
              </>
            )}
          </p>

          {(selectedCategory !== "All" || searchQuery.trim() !== "") && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-hover hover:underline transition-colors cursor-pointer"
            >
              <FiRefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Studio Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <StudioSkeletonCard key={idx} />
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 sm:p-14 text-center max-w-xl mx-auto shadow-sm my-8">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center mb-4">
              <FiFrown className="w-7 h-7" />
            </div>
            <h2 className="font-bricolage text-xl font-bold text-zinc-900 dark:text-white mb-2">
              Failed to Load Studios
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
              {error}
            </p>
            <button
              type="button"
              onClick={retryFetch}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover transition-all active:scale-95 shadow-sm"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Retry Request</span>
            </button>
          </div>
        ) : studios.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 sm:p-14 text-center max-w-xl mx-auto shadow-sm my-8">
            <div className="w-14 h-14 mx-auto rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mb-4">
              <FiSearch className="w-7 h-7" />
            </div>
            <h2 className="font-bricolage text-xl font-bold text-zinc-900 dark:text-white mb-2">
              No Studio Spaces Found
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
              We couldn&apos;t find any creative studios matching your current filters. Try selecting another category or searching with different keywords.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover transition-all active:scale-95 shadow-sm"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          /* Studios Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StudiosPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-50/60 dark:bg-zinc-950 py-12 flex items-center justify-center">
          <div className="w-9 h-9 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ExploreStudiosContent />
    </Suspense>
  );
};

export default StudiosPage;
