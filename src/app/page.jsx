import { Suspense } from "react";
import Banner from "@/components/Home/Banner";

export default function Home() {
  return (
    <div>
      <Suspense fallback={<div className="w-full h-135 sm:h-145 lg:h-160 bg-zinc-950" />}>
        <Banner />
      </Suspense>
    </div>
  );
}
