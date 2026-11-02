import { Suspense } from "react";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Shared/Navbar";
import ThemeProvider from "@/components/ThemeProvider";
import Footer from "@/components/Shared/Footer";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata = {
  title: "StudioSpace - Your Creative Hub",
  description: "StudioSpace - Peer-to-Peer Creative Workspace & Production Studio Sharing Platform",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${bricolageGrotesque.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<div className="h-16 w-full" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Toaster />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
