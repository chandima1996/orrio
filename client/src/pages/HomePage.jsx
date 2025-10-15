import React from "react";
import HeroSection from "../components/custom/HeroSection";
import FeaturedHotels from "../components/custom/FeaturedHotels";
import StatsSection from "../components/custom/StatsSection";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <FeaturedHotels />
      <StatsSection />
    </>
  );
};

export default HomePage;
