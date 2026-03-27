import React, { useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useGlobalSEO } from '../hooks/useGlobalSEO';
import { useGallerySettings } from '../hooks/useGallerySettings';
import Lightbox from '../components/Lightbox';

const GalleryPage = () => {
  const { seoSettings } = useGlobalSEO();
  const { settings: gallerySettings, loading: galleryLoading } = useGallerySettings();
  const siteUrl = seoSettings?.siteUrl || window.location.origin;
  const ogImage = seoSettings?.defaultOgImage || `${siteUrl}/slider5.webp`;
  const pageTitle = `Gallery | ${seoSettings?.siteName || 'The Arboreal Resort'}`;
  const pageDescription = `Explore our gallery showcasing the luxury, elegance, and natural beauty of ${seoSettings?.siteName || 'The Arboreal Resort'}.`;

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  // Transform backend images to frontend format
  const galleryImages = useMemo(() => {
    if (!gallerySettings?.images || gallerySettings.images.length === 0) {
      return [];
    }
    return gallerySettings.images.map((img, index) => ({
      id: img._id || index,
      src: img.url,
      alt: img.alt || 'Gallery image',
    }));
  }, [gallerySettings]);

  // Get array of image URLs for lightbox
  const imageUrls = useMemo(() => {
    return galleryImages.map(img => img.src);
  }, [galleryImages]);

  // Lightbox handlers
  const openLightbox = useCallback((index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setCurrentIndex(null);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex !== null && currentIndex < imageUrls.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (currentIndex === imageUrls.length - 1) {
      setCurrentIndex(0); // Loop to first image
    }
  }, [currentIndex, imageUrls.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex !== null && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (currentIndex === 0) {
      setCurrentIndex(imageUrls.length - 1); // Loop to last image
    }
  }, [currentIndex, imageUrls.length]);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        {seoSettings?.defaultKeywords && seoSettings.defaultKeywords.length > 0 && (
          <meta name="keywords" content={[...seoSettings.defaultKeywords, 'gallery', 'photos', 'resort', 'luxury'].join(', ')} />
        )}
        <link rel="canonical" href={`${siteUrl}/gallery`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/gallery`} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      
      <div className="bg-[#f5f3ed] min-h-screen font-sans pt-24 md:pt-32">
        {/* Header Section */}
        <header className="py-12 md:py-20 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="font-serif italic text-gray-600 text-base md:text-lg mb-3 tracking-wide">
              Visual Journey
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-gray-900 mb-4 md:mb-6">
            Our Gallery
            </h1>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
              A curated collection of moments that capture the essence of luxury, nature, and elegance.
            </p>
          </motion.div>
        </header>

        {/* Gallery Grid */}
        <main className="px-4 sm:px-6 md:px-8 lg:px-12 pb-16 md:pb-24">
          {galleryLoading ? (
            <div className="max-w-7xl mx-auto py-12 text-center text-gray-500">
              Loading gallery...
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="max-w-7xl mx-auto py-12 text-center text-gray-500">
              No images in gallery yet.
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                {galleryImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="group relative overflow-hidden rounded-md md:rounded-lg aspect-square cursor-pointer"
                    onClick={() => openLightbox(index)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 z-10" />

                    {/* Subtle border on hover */}
                    <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-xl md:rounded-2xl transition-all duration-500 z-10" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Lightbox */}
        {lightboxOpen && currentIndex !== null && (
        <Lightbox
            images={imageUrls}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
      </div>
    </>
  );
};

export default GalleryPage;
