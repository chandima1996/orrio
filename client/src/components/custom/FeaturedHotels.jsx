import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import HotelCard from "./HotelCard";
import HotelCardSkeleton from "./HotelCardSkeleton"; // Skeleton import karaganna

const FeaturedHotels = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5001/api/hotels");
        if (!response.ok) {
          throw new Error(
            "Could not fetch hotel data. Please try again later."
          );
        }

        // === START: THE FIX ===
        // The backend now returns an object like { hotels: [...] }
        const data = await response.json();
        const allHotels = data.hotels; // Get the array from the 'hotels' property
        // === END: THE FIX ===

        // Ensure allHotels is an array before filtering
        if (Array.isArray(allHotels)) {
          const topRated = allHotels.filter((hotel) => hotel.rating >= 4.9);
          setFeatured(topRated);
        } else {
          // Handle cases where the response is not as expected
          setFeatured([]);
          console.error("API response is not an array:", allHotels);
        }
      } catch (error) {
        console.error("Error fetching featured hotels:", error);
        toast.error("Failed to load hotels", { description: error.message });
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-muted/40">
      <div className="container px-4 mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Top Rated Stays
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Discover our most loved hotels, chosen by guests like you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <HotelCardSkeleton key={index} />
            ))
          ) : featured.length > 0 ? (
            featured.map((hotel) => <HotelCard key={hotel._id} hotel={hotel} />)
          ) : (
            <p className="text-center col-span-full text-muted-foreground">
              Currently, no hotels have a rating of 4.9 or higher.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default React.memo(FeaturedHotels);
