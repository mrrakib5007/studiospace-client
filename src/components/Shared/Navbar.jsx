"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { useSession, signOut } from "@/lib/auth-client";
import {
  FiMenu,
  FiX,
  FiLogIn,
  FiUserPlus,
  FiSun,
  FiMoon,
  FiUser,
  FiChevronDown,
  FiPlusCircle,
  FiList,
  FiCalendar,
  FiLogOut,
} from "react-icons/fi";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/about" },
];

const userMenuItems = [
  { name: "Dashboard", href: "/profile", icon: FiUser },
  { name: "Add New Studio", href: "/add-studio", icon: FiPlusCircle },
  { name: "My Studio Listings", href: "/my-studios", icon: FiList },
  { name: "My Bookings", href: "/my-bookings", icon: FiCalendar },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Better-Auth reactive session
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const userPhoto = user?.image || user?.photoURL;

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
  return () => clearTimeout(t);
  }, []);

  const toggleTheme = () => {
    const isDark = resolvedTheme === "dark" || (!resolvedTheme && theme === "dark");
    setTheme(isDark ? "light" : "dark");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

  return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isOpen) setIsOpen(false);
        if (isUserMenuOpen) setIsUserMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isUserMenuOpen]);

  // Handle click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
  return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href.startsWith("/#")) {
      return false;
    }
    if (pathname === href) {
      return true;
    }
    return pathname.startsWith(href + "/");
  };

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setIsOpen(false);
    try {
      await signOut();
      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to log out");
    }
  };

  return (
    <>
      {/* Sticky Header with Backdrop Blur and Active Route Indicators */}
      <header
        className={`sticky top-0 z-40 w-full py-3.5 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-xs border-b border-zinc-200/80 dark:border-zinc-800"
            : "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-100 dark:border-zinc-800/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2.5 focus:outline-none"
              aria-label="StudioSpace Home"
            >
              <Image
                src="/logo.png"
                alt="StudioSpace Logo"
                width={40}
                height={40}
                className="w-10 h-10 rounded-xl object-contain"
                priority
              />
              <span className="font-bricolage text-2xl font-bold tracking-tight text-brand-secondary dark:text-white">
                Studio<span className="text-brand">Space</span>
              </span>
            </Link>

            {/* Desktop Navigation with Active Route Indicators */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.href);
              return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? "text-brand bg-brand/10 font-semibold"
                        : "text-zinc-600 dark:text-zinc-300 hover:text-brand dark:hover:text-brand hover:bg-brand/5 dark:hover:bg-brand/10"
                    }`}
                  >
                    {link.name}
                    {active && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-brand" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Right Actions (Theme Toggle & Auth State) */}
            <div className="hidden md:flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title={
                  mounted
                    ? resolvedTheme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                    : "Toggle theme"
                }
                className="p-2.5 rounded-xl text-zinc-600 hover:text-brand hover:bg-brand/10 dark:text-zinc-300 dark:hover:text-brand dark:hover:bg-brand/10 transition-colors focus:outline-none cursor-pointer"
              >
                {mounted ? (
                  resolvedTheme === "dark" ? (
                    <FiSun className="w-5 h-5 text-amber-400" />
                  ) : (
                    <FiMoon className="w-5 h-5" />
                  )
                ) : (
                  <span className="w-5 h-5 flex items-center justify-center">
                    <FiSun className="hidden dark:block w-5 h-5 text-amber-400" />
                    <FiMoon className="block dark:hidden w-5 h-5" />
                  </span>
                )}
              </button>

              {/* Authentication State */}
              {isPending ? (
                // Skeleton loader while session is being resolved
                <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              ) : user ? (
                // User Avatar and Dropdown on Click
                <div
                  ref={userMenuRef}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-brand/40 dark:hover:border-brand/40 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all focus:outline-none cursor-pointer"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                  >
                    {userPhoto ? (
                      <Image
                        src={userPhoto}
                        alt={user.name || "User Avatar"}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-brand/30"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand/10 text-brand font-bold text-xs flex items-center justify-center ring-2 ring-brand/30">
                        {user.name ? (
                          user.name.charAt(0).toUpperCase()
                        ) : (
                          <FiUser className="w-4 h-4" />
                        )}
                      </div>
                    )}

                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 max-w-25 truncate">
                      {user.name?.split(" ")[0] || "Account"}
                    </span>
                    <FiChevronDown
                      className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                        isUserMenuOpen ? "rotate-180 text-brand" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none py-2 z-50">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-3">
                          {userPhoto ? (
                            <Image
                              src={userPhoto}
                              alt={user.name || "User"}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-brand/20"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-brand/10 text-brand font-bold text-sm flex items-center justify-center ring-2 ring-brand/20">
                              {user.name ? (
                                user.name.charAt(0).toUpperCase()
                              ) : (
                                <FiUser className="w-5 h-5" />
                              )}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                              {user.name || "User"}
                            </p>
                            {user.email && (
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                                {user.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Dropdown Items */}
                      <div className="py-1.5">
                        {userMenuItems.map((item) => {
                          const active = isActive(item.href);
                          const Icon = item.icon;
                        return (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={() => setIsUserMenuOpen(false)}
                              className={`flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors ${
                                active
                                  ? "text-brand bg-brand/10 font-semibold"
                                  : "text-zinc-700 dark:text-zinc-300 hover:text-brand hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Icon
                                  className={`w-4 h-4 ${
                                    active ? "text-brand" : "text-zinc-400"
                                  }`}
                                />
                                <span>{item.name}</span>
                              </div>
                              {active && (
                                <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                              )}
                            </Link>
                          );
                        })}
                      </div>

                      {/* Logout Button */}
                      <div className="pt-1 mt-1 border-t border-zinc-100 dark:border-zinc-800">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                        >
                          <FiLogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Guest Actions
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-semibold border border-brand text-brand hover:bg-brand/5 dark:hover:bg-brand/10 transition-colors duration-200 rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-hover rounded-lg shadow-sm hover:shadow-md hover:shadow-brand/20 transition-all duration-200 active:scale-95"
                  >
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Actions (Theme Toggle & Menu Hamburger) */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title={
                  mounted
                    ? resolvedTheme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                    : "Toggle theme"
                }
                className="p-2 rounded-xl text-zinc-600 hover:text-brand hover:bg-brand/10 dark:text-zinc-300 dark:hover:text-brand dark:hover:bg-brand/10 transition-colors focus:outline-none cursor-pointer"
              >
                {mounted ? (
                  resolvedTheme === "dark" ? (
                    <FiSun className="w-5 h-5 text-amber-400" />
                  ) : (
                    <FiMoon className="w-5 h-5" />
                  )
                ) : (
                  <span className="w-5 h-5 flex items-center justify-center">
                    <FiSun className="hidden dark:block w-5 h-5 text-amber-400" />
                    <FiMoon className="block dark:hidden w-5 h-5" />
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="p-2.5 rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-brand hover:bg-brand/10 dark:hover:bg-brand/10 transition-colors focus:outline-none"
                aria-label="Open mobile menu"
                aria-expanded={isOpen}
              >
                <FiMenu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[85%] max-w-sm bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 focus:outline-none"
          >
            <Image
              src="/logo.png"
              alt="StudioSpace Logo"
              width={36}
              height={36}
              className="w-9 h-9 rounded-xl object-contain"
            />
            <span className="font-bricolage text-xl font-bold tracking-tight text-brand-secondary dark:text-white">
              Studio<span className="text-brand">Space</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-brand hover:bg-brand/10 dark:hover:bg-brand/10 transition-colors focus:outline-none"
            aria-label="Close mobile menu"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation Content */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          {/* User Profile Card (if logged in) */}
          {user && (
            <div className="mb-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 flex items-center gap-3">
              {userPhoto ? (
                <Image
                  src={userPhoto}
                  alt={user.name || "User"}
                  width={44}
                  height={44}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-brand/30"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-brand/10 text-brand font-bold text-base flex items-center justify-center ring-2 ring-brand/30">
                  {user.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    <FiUser className="w-5 h-5" />
                  )}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {user.name || "User"}
                </p>
                {user.email && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                    {user.email}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
            Main Menu
          </p>
          <nav className="flex flex-col space-y-1 mb-6">
            {navLinks.map((link) => {
              const active = isActive(link.href);
            return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "text-brand bg-brand/10 font-semibold"
                      : "text-zinc-700 dark:text-zinc-300 hover:text-brand hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <span>{link.name}</span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Quick Links (if logged in) */}
          {user && (
            <>
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                Account
              </p>
              <nav className="flex flex-col space-y-1">
                {userMenuItems.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? "text-brand bg-brand/10 font-semibold"
                          : "text-zinc-700 dark:text-zinc-300 hover:text-brand hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 ${
                            active ? "text-brand" : "text-zinc-400"
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>
                      {active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </>
          )}
        </div>

        {/* Mobile Footer Actions */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/90">
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          ) : (
            <div className="space-y-2.5">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-brand dark:hover:border-brand hover:text-brand hover:bg-brand/5 dark:hover:bg-brand/10 transition-colors shadow-2xs"
              >
                <FiLogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover shadow-sm hover:shadow-md hover:shadow-brand/20 transition-all active:scale-[0.99]"
              >
                <FiUserPlus className="w-4 h-4" />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
