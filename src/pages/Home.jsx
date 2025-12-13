import React, { lazy, Suspense } from "react";
import Hero from "../components/Hero";
import ImageSlider from "../components/ImageSlider";

// Lazy load components below the fold for better initial load performance
const AccommodationCards = lazy(() => import("../components/AccommodationCards"));
const RoomShowcase = lazy(() => import("../components/RoomShowcase"));
const BentoBlogs = lazy(() => import("../components/BentoBlogs"));
const LocationMap = lazy(() => import("../components/LocationMap"));

// Loading placeholder component
const SectionLoader = () => (
  <div className="w-full h-[400px] bg-[#f5f3ed] animate-pulse" />
);

const Home = () => {
  return (
    <div className="overflow-x-hidden" style={{ scrollBehavior: 'smooth' }}>
      <Hero />
      <ImageSlider />
      <Suspense fallback={<SectionLoader />}>
        <AccommodationCards />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <RoomShowcase />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <BentoBlogs />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <LocationMap />
      </Suspense>
    </div>
  );
};

export default React.memo(Home);
