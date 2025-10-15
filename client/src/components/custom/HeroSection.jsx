import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const carouselImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=2070&auto=format&fit=crop",
];

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const onMouseMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;

    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;

    setRotate({ x: rotateX, y: rotateY });
  };

  const onMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/hotels?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative w-full h-[80vh] sm:h-[90vh] flex items-center justify-center overflow-hidden">
      <Carousel
        className="absolute w-full h-full"
        opts={{ loop: true }}
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {carouselImages.map((src, index) => (
            <CarouselItem key={index}>
              <div className="w-full h-[80vh] sm:h-[90vh]">
                <img
                  src={src}
                  alt={`Hotel Promotion ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

      <motion.div
        className="relative z-10 flex flex-col items-center p-8 text-center text-white rounded-2xl bg-black/20 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          y: 0,
          rotateX: rotate.x,
          rotateY: rotate.y,
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          rotateX: { type: "spring", stiffness: 300, damping: 20 },
          rotateY: { type: "spring", stiffness: 300, damping: 20 },
        }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ perspective: "1000px" }}
      >
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Find Your Perfect Stay
        </h1>
        <p className="max-w-xl mt-4 text-lg text-gray-200 sm:text-xl">
          Discover the best hotels with our AI-powered search. Your next
          adventure awaits.
        </p>

        <div className="w-full max-w-2xl mt-8">
          <div className="relative">
            <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-4 top-1/2" />
            <Input
              type="search"
              placeholder="Describe your perfect stay..."
              className="w-full py-6 pl-12 pr-32 text-base text-black rounded-full bg-white/90 placeholder:text-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              className="absolute flex items-center px-4 py-2 -translate-y-1/2 rounded-full right-2 top-1/2 gap-x-2"
              onClick={handleSearch}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">AI Search</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
