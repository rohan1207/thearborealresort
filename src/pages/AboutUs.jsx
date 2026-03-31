import React from "react";
import { Helmet } from "react-helmet-async";
import Hero from "../components/Hero";
import About from "../components/About";
import RoomShowcase from "../components/RoomShowcase";
import Testimonials from "../components/Testimonials";
import LocationMap from "../components/LocationMap";
import { useGlobalSEO } from "../hooks/useGlobalSEO";
import Villaslider from "../components/Villaslider";

const AboutUs = () => {
  const { seoSettings } = useGlobalSEO();
  const siteUrl = seoSettings?.siteUrl || window.location.origin;
  const ogImage = seoSettings?.defaultOgImage || `${siteUrl}/slider5.webp`;
  const pageTitle = `About Us | ${seoSettings?.siteName || 'The Arboreal Resort'}`;
  const pageDescription = `Learn about ${seoSettings?.siteName || 'The Arboreal Resort'} - our story, values, and commitment to providing a luxurious nature retreat experience in Lonavala.`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        {seoSettings?.defaultKeywords && seoSettings.defaultKeywords.length > 0 && (
          <meta name="keywords" content={seoSettings.defaultKeywords.join(', ') + ', about us, resort story'} />
        )}
        <link rel="canonical" href={`${siteUrl}/about`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/about`} />
        <meta property="og:image" content={ogImage} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <div className="overflow-x-hidden">
        <Hero />
        <About />
        {/* <RoomShowcase /> */}
        <Villaslider />
        <Testimonials />
        <LocationMap />
      </div>
    </>
  );
};

export default AboutUs;
