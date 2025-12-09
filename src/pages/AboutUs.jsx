import React from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import RoomShowcase from "../components/RoomShowcase";
import Testimonials from "../components/Testimonials";
import LocationMap from "../components/LocationMap";

const AboutUs = () => {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <About />
      <RoomShowcase />
      <Testimonials />
      <LocationMap />
    </div>
  );
};

export default AboutUs;
