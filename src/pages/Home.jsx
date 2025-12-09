import React from "react";
import Hero from "../components/Hero";

import ImageSlider from "../components/ImageSlider";
import AccommodationCards from "../components/AccommodationCards";
import RoomShowcase from "../components/RoomShowcase";
import BentoBlogs from "../components/BentoBlogs";
import LocationMap from "../components/LocationMap";
// import Testimonials from "../components/Testimonials";

const Home = () => {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <ImageSlider />
      <AccommodationCards />
      <RoomShowcase />
      <BentoBlogs />
      {/* <Testimonials /> */}
      <LocationMap />
    </div>
  );
};

export default Home;
