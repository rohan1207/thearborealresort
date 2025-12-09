import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const images = [
  'https://i.postimg.cc/W15yCRc9/pexels-photo-19211689.jpg',
  'https://i.postimg.cc/W15yCRc9/pexels-photo-19211689.jpg',
  'https://i.postimg.cc/W15yCRc9/pexels-photo-19211689.jpg',
  'https://i.postimg.cc/W15yCRc9/pexels-photo-19211689.jpg',
  'https://i.postimg.cc/W15yCRc9/pexels-photo-19211689.jpg',
  'https://i.postimg.cc/W15yCRc9/pexels-photo-19211689.jpg',
];

const ImageStack = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });

  // Create transforms for each image
  const imageTransforms = images.map((_, i) => {
    const start = i * 0.1;
    const end = 1;
    const inputRange = [start, Math.min(start + 0.2, end)];

    const x = useTransform(scrollYProgress, inputRange, ['0%', `-${(i + 1) * 20}%`]);
    const y = useTransform(scrollYProgress, inputRange, ['0%', `-${(i + 1) * 5}%`]);
    const rotate = useTransform(scrollYProgress, inputRange, [0, -10 - i * 2]);
    const scale = useTransform(scrollYProgress, [0.8, 1], [1, 2]); // For the last image
    const zIndex = useTransform(scrollYProgress, [0, 1], [images.length - i, images.length - i]);

    if (i === images.length - 1) {
        const finalScale = useTransform(scrollYProgress, [0.8, 1], [1, 2.5]);
        const finalX = useTransform(scrollYProgress, [0.8, 1], [x.get(), '-50%']);
        const finalY = useTransform(scrollYProgress, [0.8, 1], [y.get(), '-50%']);
        return { x: finalX, y: finalY, rotate, scale: finalScale, zIndex };
    }

    return { x, y, rotate, scale: 1, zIndex };
  });

  return (
    <div ref={targetRef} className="w-full lg:w-1/2 h-screen sticky top-0 flex items-center justify-center">
      <div className="relative w-3/4 h-1/2">
        {images.map((src, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-full origin-center"
            style={{
              ...imageTransforms[i],
              top: '50%',
              left: '50%',
              x: '-50%',
              y: '-50%',
            }}
          >
            <img
              src={src}
              alt={`About us image ${i + 1}`}
              className="w-full h-full object-cover rounded-md shadow-2xl"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ImageStack;
