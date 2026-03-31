import React, { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import Hero from "../components/Hero";
import ImageSlider from "../components/ImageSlider";
import { useGlobalSEO } from "../hooks/useGlobalSEO";

// Lazy load components below the fold for better initial load performance
const AccommodationCards = lazy(() => import("../components/AccommodationCards"));
const RoomShowcase = lazy(() => import("../components/RoomShowcase"));
const BentoBlogs = lazy(() => import("../components/BentoBlogs"));
const LocationMap = lazy(() => import("../components/LocationMap"));
const CTA = lazy(() => import("../components/CTA"));
const PremiumAbout = lazy(() => import("../components/PremiumAbout"));
const FAQSection = lazy(() => import("../components/FAQSection"));
const Activities = lazy(() => import("../components/Activities"));
const Villaslider = lazy(() => import("../components/Villaslider"));
// Loading placeholder component

const SectionLoader = () => (
  <div className="w-full h-[400px] bg-[#f5f3ed] animate-pulse" />
);

const Home = () => {
  // Don't block render - use defaults immediately, update in background
  const { seoSettings } = useGlobalSEO();
  const siteUrl = seoSettings?.siteUrl || window.location.origin;
  const ogImage = seoSettings?.defaultOgImage || `${siteUrl}/slider5.webp`;

  // Render immediately with available data (don't wait for loading)
  return (
    <>
      <Helmet>
        <title>{seoSettings?.defaultMetaTitle || 'The Arboreal Resort | Luxury Nature Retreat in Lonavala'}</title>
        <meta
          name="description"
          content={seoSettings?.defaultMetaDescription || 'Experience luxury in the heart of nature. Private pool rooms, mountain views, premium amenities. Book your stay at The Arboreal Resort, Lonavala.'}
        />
        {seoSettings?.defaultKeywords && seoSettings.defaultKeywords.length > 0 && (
          <meta name="keywords" content={seoSettings.defaultKeywords.join(', ')} />
        )}
        <link rel="canonical" href={siteUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={seoSettings?.defaultMetaTitle || 'The Arboreal Resort | Luxury Nature Retreat in Lonavala'} />
        <meta property="og:description" content={seoSettings?.defaultMetaDescription || 'Experience luxury in the heart of nature. Private pool rooms, mountain views, premium amenities.'} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={ogImage} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoSettings?.defaultMetaTitle || 'The Arboreal Resort'} />
        <meta name="twitter:description" content={seoSettings?.defaultMetaDescription || 'Experience luxury in the heart of nature.'} />
        <meta name="twitter:image" content={ogImage} />

        {/* Structured Data */}
        {seoSettings?.structuredDataEnabled && seoSettings?.structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(seoSettings.structuredData)}
          </script>
        )}
      </Helmet>
      <div 
        className="overflow-x-hidden"
        style={{ scrollBehavior: 'auto' }}
      >
        <Hero />
        {/* <CTA /> */}
        <ImageSlider />
        <Suspense fallback={<SectionLoader />}>
          {/* <AccommodationCards /> */}
          <PremiumAbout/>
        </Suspense>
        {/* <Suspense fallback={<SectionLoader />}>
          <RoomShowcase />
        </Suspense> */}
        <Suspense fallback={<SectionLoader />}>
          <Villaslider/>
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Activities/>
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <BentoBlogs />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
        <FAQSection />
          <LocationMap />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
         
        </Suspense>
      </div>
    </>
  );
};

export default React.memo(Home);
