"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  FiMenu,
  FiX,
  FiLogIn,
  FiUserPlus,
  FiSun,
  FiMoon,
} from "react-icons/fi";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "About Us", href: "/about" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-xs border-b border-zinc-200/80 dark:border-zinc-800 py-3"
            : "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-100 dark:border-zinc-800/80 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
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

            <div className="hidden md:flex items-center gap-3">
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

      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[82%] max-w-sm bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
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

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
            Menu
          </p>
          <nav className="flex flex-col space-y-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-base font-medium transition-colors ${
                    active
                      ? "text-brand bg-brand/10 font-semibold"
                      : "text-zinc-700 dark:text-zinc-300 hover:text-brand dark:hover:text-brand hover:bg-brand/5 dark:hover:bg-brand/10"
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
        </div>

        <div className="p-5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/90 space-y-3">          
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
      </aside>
    </>
  );
};

export default Navbar;