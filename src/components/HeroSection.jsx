import React from 'react';
import AboutText from './AboutText';
import ImageStack from './ImageStack';

const HeroSection = () => {
  return (
    <section className="relative w-full bg-gray-50">
      <div className="flex flex-col lg:flex-row mx-auto">
        <AboutText />
        <ImageStack />
      </div>
    </section>
  );
};  

export default HeroSection;
