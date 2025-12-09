import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Lightbox from '../components/Lightbox';

const galleryImages = [
  { id: 1, src: '/swaranjali1.png', alt: 'Elegant event setup', span: 'col-span-2 row-span-2' },
  { id: 2, src: '/swaranjali2.jpg', alt: 'Intricate floral decoration' },
  { id: 3, src: '/swaranjali3.jpg', alt: 'Candid moment at a celebration' },
  { id: 4, src: '/swaranjali4.png', alt: 'Luxurious dining table arrangement', span: 'col-span-2' },
  { id: 5, src: '/swaranjali5.png', alt: 'Couple sharing a moment' },
  { id: 6, src: '/swaranjali6.avif', alt: 'Grand venue overview', span: 'col-span-2 row-span-2' },
  { id: 7, src: '/swaranjali7.avif', alt: 'Detailed shot of decor' },
  { id: 8, src: '/swaranjali8.avif', alt: 'Guests enjoying the event' },
  { id: 9, src: '/swaranjali9.avif', alt: 'Artistic shot of the venue' },
  { id: 10, src: '/swaranjali10.png', alt: 'Evening ambiance with lights' },
  { id: 11, src: '/swaranjali11.png', alt: 'Beautifully crafted centerpiece', span: 'col-span-2' },
  { id: 12, src: '/swaranjali12.png', alt: 'Evening ambiance with lights' },
  { id: 13, src: '/swaranjali13.png', alt: 'Evening ambiance with lights' },
];

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const GalleryPage = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + galleryImages.length) % galleryImages.length);
  };

  const imagesForLightbox = galleryImages.map(img => img.src);

  return (
    <>
      <div className="bg-[#FDFDFD] min-h-screen font-sans">
        <header className="py-16 md:py-24 text-center mt-8">
          <motion.h1 
            className="text-5xl md:text-7xl font-serif font-light text-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our Gallery
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            A glimpse into the timeless moments we've crafted.
          </motion.p>
        </header>

        <main className="px-4 md:px-8 lg:px-12 pb-16">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                className={`group relative overflow-hidden rounded-md cursor-pointer ${image.span || ''}`}
                onClick={() => openLightbox(index)}
                variants={imageVariants}
                layout
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </motion.div>
        </main>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={imagesForLightbox}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </>
  );
};

export default GalleryPage;
