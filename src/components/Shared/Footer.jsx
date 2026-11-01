"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaFacebookF,
} from "react-icons/fa6";
import { FiMail, FiArrowRight, FiShield } from "react-icons/fi";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "About Us", href: "/about" },
  { name: "List Your Studio", href: "/studios/new" },
  { name: "Pricing & Plans", href: "/pricing" },
];

const studioCategories = [
  { name: "Photo & Daylight Studios", href: "/studios?category=photo" },
  { name: "Film & Video Stages", href: "/studios?category=video" },
  { name: "Podcast & Voiceover Rooms", href: "/studios?category=podcast" },
  { name: "Dance & Rehearsal Studios", href: "/studios?category=dance" },
  { name: "Music Recording Suites", href: "/studios?category=music" },
  { name: "Creative Art Lofts", href: "/studios?category=art" },
];

const socialLinks = [
  {
    name: "X (formerly Twitter)",
    href: "https://x.com",
    icon: FaXTwitter,
    ariaLabel: "Follow StudioSpace on X",
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: FaInstagram,
    ariaLabel: "Follow StudioSpace on Instagram",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: FaLinkedinIn,
    ariaLabel: "Connect with StudioSpace on LinkedIn",
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: FaYoutube,
    ariaLabel: "Subscribe to StudioSpace on YouTube",
  },
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: FaFacebookF,
    ariaLabel: "Follow StudioSpace on Facebook",
  },
];

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    toast.success("Thank you for subscribing to StudioSpace.");
    setEmail("");
  };

  return (
    <footer className="w-full bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200/80 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 focus:outline-none"
              aria-label="StudioSpace Home"
            >
              <Image
                src="/logo.png"
                alt="StudioSpace Logo"
                width={40}
                height={40}
                className="w-10 h-10 rounded-xl object-contain"
              />
              <span className="font-bricolage text-2xl font-bold tracking-tight text-brand-secondary dark:text-white">
                Studio<span className="text-brand">Space</span>
              </span>
            </Link>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm">
              Empowering creators, photographers, and production teams to discover,
              book, and share inspiring creative workspaces and professional studios
              on demand.
            </p>

            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
                Join our community
              </p>
              <div className="flex items-center gap-2.5">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.ariaLabel}
                      className="flex items-center justify-center w-9 h-9 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-brand hover:border-brand/40 dark:hover:border-brand/40 hover:bg-brand/5 dark:hover:bg-brand/10 shadow-2xs hover:shadow-xs transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 2: Quick Navigation Links */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bricolage text-base font-semibold text-zinc-900 dark:text-white tracking-tight">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-brand dark:hover:text-brand transition-colors duration-200 inline-block py-0.5"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Popular Studio Categories */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-bricolage text-base font-semibold text-zinc-900 dark:text-white tracking-tight">
              Popular Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              {studioCategories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-brand dark:hover:text-brand transition-colors duration-200 inline-block py-0.5"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-bricolage text-base font-semibold text-zinc-900 dark:text-white tracking-tight">
              Stay in the Loop
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Subscribe for exclusive creator discounts, fresh studio spotlights, and
              production tips.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                  aria-label="Email address for newsletter"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand hover:bg-brand-hover rounded-xl shadow-xs hover:shadow-md hover:shadow-brand/20 transition-all duration-200 active:scale-[0.99] cursor-pointer"
              >
                <span>Subscribe</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <FiShield className="w-3.5 h-3.5 text-brand" />
              <span>We protect your privacy. No spam, ever.</span>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright, System Status & Terms Notice */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex flex-wrap items-center gap-3 text-center md:text-left">
            <span>© 2026 StudioSpace Inc. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-brand dark:hover:text-brand transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-brand dark:hover:text-brand transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="hover:text-brand dark:hover:text-brand transition-colors"
            >
              Cookie Policy
            </Link>
            <Link
              href="/security"
              className="hover:text-brand dark:hover:text-brand transition-colors"
            >
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
