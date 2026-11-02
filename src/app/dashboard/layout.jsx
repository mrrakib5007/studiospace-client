"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { useSession, signOut } from "@/lib/auth-client";
import {
  FiArrowLeft,
  FiHome,
  FiUser,
  FiPlusCircle,
  FiList,
  FiLogOut,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiChevronDown,
  FiChevronRight,
  FiExternalLink,
} from "react-icons/fi";
import { FaCalendarAlt } from "react-icons/fa";

const sidebarNavItems = [
  {
    name: "Profile",
    href: "/dashboard",
    icon: FiUser,
    exact: true,
  },
  {
    name: "Add New Studio",
    href: "/dashboard/add-studio",
    icon: FiPlusCircle,
    exact: false,
  },
  {
    name: "My Studios Listing",
    href: "/dashboard/my-studios",
    icon: FiList,
    exact: false,
  },
  {
    name: "My Bookings",
    href: "/dashboard/my-bookings",
    icon: FaCalendarAlt,
    exact: false,
  },
];

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const headerMenuRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  // Route protection
  useEffect(() => {
    if (!isPending && !user) {
      toast.error("Please login to access your Creator Dashboard");
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname || "/dashboard")}`);
    }
  }, [isPending, user, router, pathname]);

  // Click outside to close top header profile popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerMenuRef.current && !headerMenuRef.current.contains(e.target)) {
        setIsHeaderMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    const isDark = resolvedTheme === "dark" || (!resolvedTheme && theme === "dark");
    setTheme(isDark ? "light" : "dark");
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to log out");
    }
  };

  const userPhoto = user?.image || user?.photoURL;
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const isLinkActive = (item) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-zinc-50/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Mobile Top App Bar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:text-brand hover:bg-brand/10 transition-colors focus:outline-none cursor-pointer"
            aria-label="Open navigation menu"
          >
            <FiMenu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-2 focus:outline-none">
            <Image
              src="/logo.png"
              alt="StudioSpace"
              width={30}
              height={30}
              className="w-7 h-7 rounded-lg object-contain"
            />
            <span className="font-bricolage text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
              Studio<span className="text-brand">Space</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme toggle mobile */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:text-brand hover:bg-brand/10 transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle theme"
          >
            {mounted && resolvedTheme === "dark" ? (
              <FiSun className="w-4 h-4 text-amber-400" />
            ) : (
              <FiMoon className="w-4 h-4" />
            )}
          </button>

          {/* User Avatar */}
          <Link
            href="/dashboard"
            className="w-8 h-8 rounded-full ring-2 ring-brand/30 overflow-hidden shrink-0 flex items-center justify-center bg-brand/10 text-brand font-bold text-xs"
          >
            {userPhoto ? (
              <Image
                unoptimized
                src={userPhoto}
                alt={user?.name || "User"}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : (
              userInitial
            )}
          </Link>
        </div>
      </header>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 shrink-0 h-screen sticky top-0 bg-white dark:bg-zinc-900 border-r border-zinc-200/80 dark:border-zinc-800/80 z-30 select-none">
        {/* Top: Logo & Back to Home */}
        <div className="p-5 pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
          {/* Brand Link */}
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="group flex items-center gap-2.5 focus:outline-none"
              aria-label="StudioSpace Home"
            >
              <Image
                src="/logo.png"
                alt="StudioSpace Logo"
                width={36}
                height={36}
                className="w-9 h-9 rounded-xl object-contain transition-transform group-hover:scale-105"
                priority
              />
              <span className="font-bricolage text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Studio<span className="text-brand">Space</span>
              </span>
            </Link>

            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand/10 text-brand rounded-md border border-brand/20">
              Host
            </span>
          </div>

          {/* Direct Back to Home button */}
          <Link
            href="/"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/60 hover:bg-brand/10 hover:text-brand dark:hover:text-brand hover:border-brand/30 border border-transparent transition-all group"
          >
            <div className="flex items-center gap-2">
              <FiArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Home</span>
            </div>            
          </Link>
        </div>

        {/* Middle: Navigation Links (Clean without descriptions) */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Workspace Navigation
          </p>

          {sidebarNavItems.map((item) => {
            const active = isLinkActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-brand text-white font-semibold shadow-xs shadow-brand/30"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 hover:text-brand dark:hover:text-brand"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      active
                        ? "text-white"
                        : "text-zinc-400 group-hover:text-brand dark:group-hover:text-brand"
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </div>

                <FiChevronRight
                  className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                    active
                      ? "text-white translate-x-0.5"
                      : "text-zinc-300 dark:text-zinc-600 group-hover:text-brand group-hover:translate-x-0.5"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Bottom: Minimal User Info */}
        <div className="p-3.5 border-t border-zinc-100 dark:border-zinc-800/70 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200/70 dark:border-zinc-700/70 shadow-2xs">
            <div className="w-9 h-9 rounded-full ring-2 ring-brand/30 overflow-hidden shrink-0 flex items-center justify-center bg-brand/10 text-brand font-bold text-xs">
              {userPhoto ? (
                <Image
                  unoptimized
                  src={userPhoto}
                  alt={user?.name || "User Avatar"}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              ) : (
                userInitial
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate leading-tight">
                {user?.name || "Creator User"}
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate leading-tight mt-0.5">
                {user?.email || "creator@studiospace.com"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer Menu */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[80%] max-w-xs bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Dashboard Navigation"
      >
        <div>
          {/* Mobile Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 focus:outline-none"
            >
              <Image
                src="/logo.png"
                alt="StudioSpace Logo"
                width={32}
                height={32}
                className="w-8 h-8 rounded-xl object-contain"
              />
              <span className="font-bricolage text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                Studio<span className="text-brand">Space</span>
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-brand hover:bg-brand/10 transition-colors focus:outline-none"
              aria-label="Close menu"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Back to Home Link */}
          <div className="p-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-brand/10 hover:text-brand transition-all"
            >
              <div className="flex items-center gap-2.5">
                <FiArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </div>
              <FiExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-2 space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
              Dashboard Menu
            </p>
            {sidebarNavItems.map((item) => {
              const active = isLinkActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-brand text-white font-semibold"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-brand"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  <FiChevronRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Drawer Bottom User Card */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
            <div className="w-10 h-10 rounded-full ring-2 ring-brand/30 overflow-hidden shrink-0 flex items-center justify-center bg-brand/10 text-brand font-bold text-sm">
              {userPhoto ? (
                <Image
                  unoptimized
                  src={userPhoto}
                  alt={user?.name || "User"}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                userInitial
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {user?.name || "Creator User"}
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 transition-colors cursor-pointer"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area on the Right */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-6 lg:px-8 py-4 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border-b border-zinc-200/70 dark:border-zinc-800/70 sticky top-0 z-20">
          <div>
            <h1 className="font-bricolage text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Creator Dashboard
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Manage your profile, listings, and production studio settings
            </p>
          </div>

          {/* Top Right: Dark mode toggle & Profile with small popup */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-xl text-zinc-600 hover:text-brand hover:bg-brand/10 dark:text-zinc-300 dark:hover:text-brand dark:hover:bg-brand/10 transition-colors focus:outline-none cursor-pointer"
              title={
                mounted && resolvedTheme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {mounted && resolvedTheme === "dark" ? (
                <FiSun className="w-4.5 h-4.5 text-amber-400" />
              ) : (
                <FiMoon className="w-4.5 h-4.5" />
              )}
            </button>

            {/* Profile Avatar & Small Popup (Go to home, logout) */}
            <div ref={headerMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsHeaderMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-brand/40 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-all focus:outline-none cursor-pointer"
                aria-expanded={isHeaderMenuOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 rounded-full ring-2 ring-brand/30 overflow-hidden shrink-0 flex items-center justify-center bg-brand/10 text-brand font-bold text-xs">
                  {userPhoto ? (
                    <Image
                      unoptimized
                      src={userPhoto}
                      alt={user?.name || "User"}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    userInitial
                  )}
                </div>
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 max-w-28 truncate">
                  {user?.name ? user.name.split(" ")[0] : "Account"}
                </span>
                <FiChevronDown
                  className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                    isHeaderMenuOpen ? "rotate-180 text-brand" : ""
                  }`}
                />
              </button>

              {/* Small Popup Dropdown */}
              {isHeaderMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none py-2 z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                      {user?.email || ""}
                    </p>
                  </div>

                  {/* Links: Go to Home */}
                  <div className="py-1">
                    <Link
                      href="/"
                      onClick={() => setIsHeaderMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-brand hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                    >
                      <FiHome className="w-4 h-4 text-zinc-400" />
                      <span>Go to Home</span>
                    </Link>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-1 mt-1 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsHeaderMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Children Container */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
