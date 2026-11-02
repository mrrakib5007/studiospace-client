"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyStudiosRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/my-listings");
  }, [router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-zinc-50/60 dark:bg-zinc-950">
      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  );
}