import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Wallet,
  Building2,
  Star,
  BedDouble,
  LayoutGrid,
  List,
  Users,
  Minus,
  Plus,
} from "lucide-react";

// Shadcn UI and Custom Components
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import HotelCard from "@/components/custom/HotelCard";
import HotelCardSkeleton from "../components/custom/HotelCardSkeleton";
import SearchBar from "../components/custom/SearchBar";

const HotelsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // --- State Management ---
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");

  const searchBarInitialData = {
    searchTerm: searchParams.get("q") || "",
    dateRange: {
      from: searchParams.get("from")
        ? new Date(searchParams.get("from"))
        : undefined,
      to: searchParams.get("to") ? new Date(searchParams.get("to")) : undefined,
    },
    // Guest count is now managed by the filter state below
  };

  // Filter States
  const [guests, setGuests] = useState(Number(searchParams.get("guests")) || 1); // UPDATED
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [sliderValue, setSliderValue] = useState([0, 5000]);
  const [allLocations, setAllLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedHotelClass, setSelectedHotelClass] = useState([]);
  const [selectedUserRating, setSelectedUserRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Fetch Room Stats for Slider Range
  useEffect(() => {
    const fetchRoomStats = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/rooms/stats");
        const stats = await response.json();
        if (stats.minPrice && stats.maxPrice) {
          setPriceRange({ min: stats.minPrice, max: stats.maxPrice });
          setSliderValue([stats.minPrice, stats.maxPrice]);
        }
      } catch (error) {
        console.error("Failed to fetch room stats", error);
      }
    };
    fetchRoomStats();
  }, []);

  // Main Data Fetching Logic (depends on all filters)
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      const params = new URLSearchParams(searchParams);

      // Add all filter states to the params
      params.set("minPrice", sliderValue[0]);
      params.set("maxPrice", sliderValue[1]);
      params.set("guests", guests.toString()); // UPDATED

      params.delete("location");
      params.delete("starClass");
      params.delete("amenities");

      selectedLocations.forEach((loc) => params.append("location", loc));
      selectedHotelClass.forEach((star) => params.append("starClass", star));
      if (selectedUserRating > 0)
        params.set("userRating", selectedUserRating.toString());
      selectedAmenities.forEach((am) => params.append("amenities", am));

      const query = params.toString();
      const endpoint = params.get("q") ? "search" : "";

      try {
        const response = await fetch(
          `http://localhost:5001/api/hotels/${endpoint}?${query}`
        );
        const data = await response.json();
        const hotelsArray = data.hotels || (Array.isArray(data) ? data : []);
        setHotels(hotelsArray);

        if (
          allLocations.length === 0 &&
          !params.get("q") &&
          !params.get("location")
        ) {
          const locations = [
            ...new Set(hotelsArray.map((hotel) => hotel.location)),
          ];
          setAllLocations(locations);
        }
      } catch (error) {
        toast.error("Error", { description: "Could not fetch hotel data." });
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => fetchHotels(), 500);
    return () => clearTimeout(timer);
  }, [
    searchParams,
    sliderValue,
    selectedLocations,
    selectedHotelClass,
    selectedUserRating,
    selectedAmenities,
    guests,
  ]); // UPDATED

  // Event Handlers
  const handleSearch = ({ searchTerm, dateRange }) => {
    // adults/children removed
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (dateRange.from) params.set("from", dateRange.from.toISOString());
    if (dateRange.to) params.set("to", dateRange.to.toISOString());
    setSearchParams(params);
  };

  const handleClearAllSearch = () => {
    setGuests(1);
    setSliderValue([priceRange.min, priceRange.max]);
    setSelectedLocations([]);
    setSelectedHotelClass([]);
    setSelectedUserRating(0);
    setSelectedAmenities([]);
    setSearchParams({});
  };

  const handleHotelClassClick = (star) =>
    setSelectedHotelClass((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
  const handleUserRatingClick = (rating) =>
    setSelectedUserRating((prev) => (prev === rating ? 0 : rating));
  const handleAmenityChange = (amenity) =>
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );

  return (
    <div className="pt-20">
      <section className="py-12 bg-muted/40">
        <div className="container px-4 mx-auto">
          <h1 className="mb-8 text-3xl font-bold text-center sm:text-4xl">
            Find Your Next Stay
          </h1>
          <SearchBar
            onSearch={handleSearch}
            initialData={searchBarInitialData}
          />
        </div>
      </section>

      <section className="py-12">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col gap-8 md:flex-row">
            <aside className="w-full md:w-1/4 lg:w-1/5">
              <h2 className="mb-4 text-xl font-bold">Filters</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="flex items-center gap-2 mb-2 font-semibold">
                    <Users size={18} /> Guests
                  </h3>
                  <div className="flex items-center justify-between">
                    <Label>Total Guests</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setGuests((p) => Math.max(1, p - 1))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span>{guests}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setGuests((p) => p + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 mb-2 font-semibold">
                    Location
                  </h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start w-full"
                      >
                        {selectedLocations.length > 0
                          ? `${selectedLocations.length} selected`
                          : "Select Locations"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Available Locations</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {allLocations.map((location) => (
                        <DropdownMenuCheckboxItem
                          key={location}
                          checked={selectedLocations.includes(location)}
                          onCheckedChange={(checked) =>
                            setSelectedLocations((prev) =>
                              checked
                                ? [...prev, location]
                                : prev.filter((l) => l !== location)
                            )
                          }
                        >
                          {location}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 mb-2 font-semibold">
                    <Wallet size={18} /> Price Range
                  </h3>
                  <Slider
                    value={sliderValue}
                    min={priceRange.min}
                    max={priceRange.max}
                    step={10}
                    onValueChange={setSliderValue}
                  />
                  <p className="mt-2 text-sm text-center text-muted-foreground">
                    ${sliderValue[0]} - ${sliderValue[1]}
                  </p>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 mb-2 font-semibold">
                    <Building2 size={18} /> Hotel Class
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {[5, 4, 3].map((star) => (
                      <Button
                        key={star}
                        variant={
                          selectedHotelClass.includes(star)
                            ? "default"
                            : "outline"
                        }
                        className="flex-grow"
                        onClick={() => handleHotelClassClick(star)}
                      >
                        {star} Star
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 mb-2 font-semibold">
                    <Star size={18} /> User Rating
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { label: "4.8+", value: 4.8 },
                      { label: "4.5+", value: 4.5 },
                      { label: "4.0+", value: 4 },
                    ].map((rating) => (
                      <Button
                        key={rating.label}
                        variant={
                          selectedUserRating === rating.value
                            ? "default"
                            : "outline"
                        }
                        className="flex-grow"
                        onClick={() => handleUserRatingClick(rating.value)}
                      >
                        {rating.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 mb-2 font-semibold">
                    <BedDouble size={18} /> Amenities
                  </h3>
                  <div className="space-y-2">
                    {["Wifi", "Pool", "Parking", "Spa", "Gym"].map(
                      (amenity) => (
                        <div key={amenity} className="flex items-center">
                          <Checkbox
                            id={amenity}
                            checked={selectedAmenities.includes(amenity)}
                            onCheckedChange={() => handleAmenityChange(amenity)}
                          />
                          <label
                            htmlFor={amenity}
                            className="ml-2 text-sm font-medium"
                          >
                            {amenity}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={handleClearAllSearch}
                >
                  Clear All Filters
                </Button>
              </div>
            </aside>
            <main className="w-full md:w-3/4 lg:w-4/5">
              <div className="flex justify-end gap-2 mb-4">
                <Button
                  variant={view === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setView("grid")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={view === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setView("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 items-start"
                    : "flex flex-col gap-4"
                }
              >
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <HotelCardSkeleton key={index} />
                  ))
                ) : hotels.length > 0 ? (
                  hotels.map((hotel) => (
                    <HotelCard key={hotel._id} hotel={hotel} view={view} />
                  ))
                ) : (
                  <div className="py-10 text-center col-span-full">
                    <p className="text-muted-foreground">
                      No hotels found matching your criteria. Try adjusting your
                      search.
                    </p>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HotelsPage;
