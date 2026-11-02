import { Suspense } from "react";
import Banner from "@/components/Home/Banner";
import FeaturedStudios from "@/components/Home/FeaturedStudios";
import CategorySection from "@/components/Home/CategorySection";
import HowItWorks from "@/components/Home/HowItWorks";
import HostGuarantee from "@/components/Home/HostGuarantee";

export default function Home() {
  return (
    <div>
      <Suspense fallback={<div className="w-full h-135 sm:h-145 lg:h-160 bg-zinc-950" />}>
        <Banner />
      </Suspense>
      <FeaturedStudios />
      <CategorySection />
      <HowItWorks />
      <HostGuarantee />
    </div>
  );
}
