import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Star,
  Heart,
  Wifi,
  ParkingSquare,
  UtensilsCrossed,
} from "lucide-react";

// Amenity Icons Dictionary
const amenityIcons = {
  Wifi: <Wifi className="flex-shrink-0 w-4 h-4" />,
  Pool: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      className="flex-shrink-0"
    >
      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
      <path d="M12 4v2.5" />
      <path d="m6.2 6.2 1.8 1.8" />
      <path d="m4 12 h2.5" />
      <path d="m6.2 17.8 1.8-1.8" />
      <path d="M12 20v-2.5" />
      <path d="m17.8 17.8-1.8-1.8" />
      <path d="M20 12h-2.5" />
      <path d="m17.8 6.2-1.8 1.8" />
    </svg>
  ),
  Parking: <ParkingSquare className="flex-shrink-0 w-4 h-4" />,
  Restaurant: <UtensilsCrossed className="flex-shrink-0 w-4 h-4" />,
  // Add other icons as needed
};

const handleCarouselNavClick = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

const HotelCard = ({ hotel, view = "grid", onFavChange }) => {
  const [searchParams] = useSearchParams();
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isSignedIn && user?.privateMetadata?.favorites) {
      setIsFavorite(user.privateMetadata.favorites.includes(hotel._id));
    } else {
      setIsFavorite(false);
    }
  }, [isSignedIn, user, hotel._id]);

  const linkTo = `/hotels/${hotel._id}?${searchParams.toString()}`;

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn)
      return toast.info("Please log in to manage your favorites.");

    setIsProcessing(true);
    try {
      const token = await getToken();
      const response = await fetch(
        "http://localhost:5001/api/users/me/favorites",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ hotelId: hotel._id }),
        }
      );
      if (!response.ok) throw new Error("Failed to update favorites.");

      const data = await response.json();
      const newIsFavorite = data.favorites.includes(hotel._id);
      setIsFavorite(newIsFavorite);

      await user.reload();
      if (onFavChange) onFavChange(hotel._id, newIsFavorite);
      toast.success(
        newIsFavorite ? "Added to favorites!" : "Removed from favorites."
      );
    } catch (error) {
      toast.error("Error", { description: error.message });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!hotel || !hotel._id) return null;

  // --- Grid View Specific Content ---
  const GridViewContent = () => (
    <Card className="flex flex-col h-full overflow-hidden group dark:hover:ring-1 dark:hover:ring-slate-500">
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {hotel.images.map((src, index) => (
              <CarouselItem key={index}>
                <img
                  src={src}
                  alt={hotel.name}
                  className="object-cover w-full h-52"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className="absolute transition-opacity -translate-y-1/2 opacity-0 left-2 top-1/2 group-hover:opacity-100"
            onClick={handleCarouselNavClick}
          />
          <CarouselNext
            className="absolute transition-opacity -translate-y-1/2 opacity-0 right-2 top-1/2 group-hover:opacity-100"
            onClick={handleCarouselNavClick}
          />
        </Carousel>
        {isSignedIn && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute z-10 rounded-full top-3 right-3 bg-white/80 backdrop-blur-sm"
            onClick={handleToggleFavorite}
            disabled={isProcessing}
          >
            <Heart
              className={`transition-colors ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"
              }`}
            />
          </Button>
        )}
      </div>
      <CardContent className="flex flex-col flex-grow p-4">
        <div>
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold line-clamp-1">{hotel.name}</h3>
            <div className="flex items-center flex-shrink-0 gap-1 px-2 py-1 rounded-full bg-primary text-primary-foreground">
              <Star className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {hotel.rating.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="flex items-center mt-1">
            {Array.from({ length: hotel.starClass }).map((_, index) => (
              <Star
                key={index}
                className="w-4 h-4 text-yellow-500 fill-yellow-500"
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm line-clamp-1">{hotel.location}</span>
          </div>

          {/* === START: UPDATED AMENITIES DISPLAY === */}
          <div className="flex flex-wrap items-center mt-4 gap-x-4 gap-y-2">
            {hotel.amenities.slice(0, 4).map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-2 text-sm text-muted-foreground"
                title={amenity}
              >
                {amenityIcons[amenity] || <Star className="w-4 h-4" />}
                <span>{amenity}</span>
              </div>
            ))}
          </div>
          {/* === END: UPDATED AMENITIES DISPLAY === */}
        </div>

        {/* === PRICE SECTION REMOVED, BUTTON ADDED === */}
        <div className="pt-4 mt-auto">
          <Button className="w-full">View Details</Button>
        </div>
      </CardContent>
    </Card>
  );

  // --- List View Specific Content ---
  const ListViewContent = () => (
    <Card className="flex flex-col h-full overflow-hidden group sm:flex-row dark:hover:ring-1 dark:hover:ring-slate-500">
      <div className="relative flex-shrink-0 sm:w-1/3">
        <Carousel className="w-full h-full">
          <CarouselContent>
            {hotel.images.map((src, index) => (
              <CarouselItem key={index}>
                <img
                  src={src}
                  alt={hotel.name}
                  className="object-cover w-full h-full"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute transition-opacity -translate-y-1/2 opacity-0 left-2 top-1/2 group-hover:opacity-100" />
          <CarouselNext className="absolute transition-opacity -translate-y-1/2 opacity-0 right-2 top-1/2 group-hover:opacity-100" />
        </Carousel>
        {isSignedIn && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute z-10 rounded-full top-3 right-3 bg-white/80 backdrop-blur-sm"
            onClick={handleToggleFavorite}
            disabled={isProcessing}
          >
            <Heart
              className={`transition-colors ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"
              }`}
            />
          </Button>
        )}
      </div>
      <CardContent className="flex flex-col flex-grow p-4 sm:w-2/3">
        <div>
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-bold line-clamp-1">{hotel.name}</h2>
            <div className="flex items-center flex-shrink-0 gap-1 px-2 py-1 rounded-full bg-primary text-primary-foreground">
              <Star className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {hotel.rating.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="flex items-center mt-1">
            {Array.from({ length: hotel.starClass }).map((_, index) => (
              <Star
                key={index}
                className="w-5 h-5 text-yellow-500 fill-yellow-500"
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm line-clamp-1">{hotel.location}</span>
          </div>
          <div className="flex flex-wrap items-center mt-4 gap-x-4 gap-y-2">
            {hotel.amenities.map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-1 text-sm"
                title={amenity}
              >
                {amenityIcons[amenity] || <Star className="w-4 h-4" />}
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-end justify-between pt-4 mt-auto">
          <div>
            <p className="text-sm text-muted-foreground">Starts from</p>
            <p className="text-2xl font-bold">{displayPrice}</p>
          </div>
          <Button>View Rooms</Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Link to={linkTo} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      >
        {view === "grid" ? <GridViewContent /> : <ListViewContent />}
      </motion.div>
    </Link>
  );
};

export default React.memo(HotelCard);
