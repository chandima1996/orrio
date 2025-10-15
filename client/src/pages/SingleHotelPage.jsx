import React, { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Phone,
  Wifi,
  UtensilsCrossed,
  ParkingSquare,
  Star,
  Mail,
  Building2,
  Heart,
  Sparkles,
  Dumbbell,
} from "lucide-react";
import RoomCard from "../components/custom/RoomCard";
import LoadingSpinner from "../components/custom/LoadingSpinner";
import SearchBar from "../components/custom/SearchBar";

const SingleHotelPage = () => {
  const { id: hotelId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("price-asc");

  const searchBarInitialData = useMemo(
    () => ({
      searchTerm: searchParams.get("q") || "",
      dateRange: {
        from: searchParams.get("from")
          ? new Date(searchParams.get("from"))
          : undefined,
        to: searchParams.get("to")
          ? new Date(searchParams.get("to"))
          : undefined,
      },
      guests: Number(searchParams.get("guests")) || 0,
    }),
    [searchParams]
  );

  const dateRangeForRoomCard = searchBarInitialData.dateRange;

  useEffect(() => {
    const fetchHotelAndRooms = async () => {
      if (!hotelId) return;
      setLoading(true);
      setError(null);
      try {
        const [hotelRes, roomsRes] = await Promise.all([
          fetch(`http://localhost:5001/api/hotels/${hotelId}`),
          fetch(`http://localhost:5001/api/rooms/hotel/${hotelId}`),
        ]);

        if (!hotelRes.ok) throw new Error("Hotel not found");
        if (!roomsRes.ok) throw new Error("Could not fetch rooms");

        const hotelData = await hotelRes.json();
        const allRoomsData = await roomsRes.json();

        setHotel(hotelData);
        setAllRooms(allRoomsData);
      } catch (err) {
        setError(err.message);
        toast.error("Error", { description: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchHotelAndRooms();
  }, [hotelId]);

  const { availableRooms, otherRooms } = useMemo(() => {
    const totalGuests = searchBarInitialData.guests;

    if (totalGuests <= 1) {
      return { availableRooms: [], otherRooms: allRooms };
    }

    const available = allRooms.filter((room) => room.capacity >= totalGuests);
    const other = allRooms.filter((room) => room.capacity < totalGuests);

    return { availableRooms: available, otherRooms: other };
  }, [allRooms, searchBarInitialData.guests]);

  const sortedAvailableRooms = useMemo(() => {
    const sorted = [...availableRooms];
    if (sortBy === "price-asc")
      sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
    else if (sortBy === "price-desc")
      sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
    return sorted;
  }, [availableRooms, sortBy]);

  const sortedOtherRooms = useMemo(() => {
    const sorted = [...otherRooms];
    if (sortBy === "price-asc")
      sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
    else if (sortBy === "price-desc")
      sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
    return sorted;
  }, [otherRooms, sortBy]);

  const handleSearch = ({ searchTerm, dateRange, guests }) => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (dateRange.from) params.set("from", dateRange.from.toISOString());
    if (dateRange.to) params.set("to", dateRange.to.toISOString());
    if (guests > 0) params.set("guests", guests.toString());
    navigate(`/hotels?${params.toString()}`);
  };

  const amenityIcons = {
    Wifi: <Wifi size={20} />,
    Pool: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
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
    Parking: <ParkingSquare size={20} />,
    Restaurant: <UtensilsCrossed size={20} />,
    Spa: <Sparkles size={20} />,
    Gym: <Dumbbell size={20} />,
    Bar: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
      >
        <path d="M12 14.5a2.5 2.5 0 0 1-2.5-2.5V8h5v4a2.5 2.5 0 0 1-2.5 2.5Z" />
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8Z" />
      </svg>
    ),
  };

  if (loading)
    return (
      <div className="pt-24">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return (
      <div className="pt-24 text-center">
        <h1>Error: {error}</h1>
      </div>
    );
  if (!hotel)
    return (
      <div className="pt-24 text-center">
        <h1>Hotel not found.</h1>
      </div>
    );

  return (
    <div className="pt-20 bg-muted/20">
      <div className="container px-4 py-12 mx-auto">
        <Carousel className="w-full mb-8 -mx-4">
          <CarouselContent>
            {hotel.images.map((img, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <img
                    src={img}
                    alt={`${hotel.name} image ${index + 1}`}
                    className="object-cover w-full rounded-lg shadow-md h-72"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-14" />
          <CarouselNext className="mr-14" />
        </Carousel>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-4xl font-bold tracking-tight">
                {hotel.name}
              </h1>
              <Button
                size="icon"
                variant="outline"
                className="flex-shrink-0 rounded-full"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex items-center gap-2 mb-6 text-lg text-muted-foreground">
              <MapPin size={20} />
              <span>{hotel.location}</span>
            </div>
            <p className="leading-relaxed text-gray-700">
              {hotel.description ||
                `Welcome to ${hotel.name}, a sanctuary of luxury and comfort nestled in the heart of ${hotel.location}.`}
            </p>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-xl font-semibold">Hotel Amenities</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {hotel.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3">
                      {amenityIcons[amenity] || <Star size={20} />}
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
                <h3 className="mb-4 text-xl font-semibold">Contact Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Building2 size={16} />
                    <span>{hotel.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={16} />
                    <span>{hotel.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} />
                    <span>{hotel.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="my-16">
          <h2 className="mb-8 text-3xl font-bold text-center">
            Search Again or Modify
          </h2>
          <SearchBar
            onSearch={handleSearch}
            initialData={searchBarInitialData}
          />
        </div>

        <div className="container px-4 mx-auto mt-16">
          <div className="flex flex-col items-center justify-between mb-8 sm:flex-row">
            <h2 className="text-3xl font-bold">Rooms</h2>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px] mt-4 sm:mt-0">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {availableRooms.length > 0 && (
            <div className="mb-12">
              <h3 className="mb-6 text-2xl font-semibold text-green-600">
                Rooms Matching Your Search ({availableRooms.length})
              </h3>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {sortedAvailableRooms.map((room) => (
                  <RoomCard
                    key={room._id}
                    room={room}
                    hotelId={hotelId}
                    dateRange={dateRangeForRoomCard}
                  />
                ))}
              </div>
            </div>
          )}

          {otherRooms.length > 0 && (
            <div>
              <h3 className="mb-6 text-2xl font-semibold">
                {availableRooms.length > 0
                  ? "Other Available Rooms"
                  : "All Available Rooms"}
              </h3>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {sortedOtherRooms.map((room) => (
                  <RoomCard
                    key={room._id}
                    room={room}
                    hotelId={hotelId}
                    dateRange={dateRangeForRoomCard}
                  />
                ))}
              </div>
            </div>
          )}
          {availableRooms.length === 0 &&
            otherRooms.length === 0 &&
            !loading && (
              <p className="py-10 text-center text-muted-foreground">
                No rooms available for this hotel based on your criteria.
              </p>
            )}
        </div>
      </div>
    </div>
  );
};

export default SingleHotelPage;
