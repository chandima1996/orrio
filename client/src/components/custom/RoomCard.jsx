import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Bed, Users, Square, BedDouble } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

const RoomCard = ({ room, hotelId, dateRange }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currency, conversionRate } = useCurrency();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState(null);

  const displayPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(room.pricePerNight * conversionRate);

  const handleProceedToBooking = () => {
    if (!dateRange || !dateRange.from || !dateRange.to) {
      toast.error("Please select a check-in and check-out date first!");
      return;
    }
    if (!selectedRoomNumber) {
      return toast.error("Please select an available room number to proceed.");
    }

    const params = new URLSearchParams(searchParams);
    params.set("hotelId", hotelId);
    params.set("roomId", room._id);
    params.set("from", dateRange.from.toISOString());
    params.set("to", dateRange.to.toISOString());
    params.set("roomNumber", selectedRoomNumber);

    navigate(`/booking?${params.toString()}`);
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group dark:hover:ring-1 dark:hover:ring-slate-500">
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {room.images.map((src, index) => (
              <CarouselItem key={index}>
                <img
                  src={src}
                  alt={`${room.type} image ${index + 1}`}
                  className="object-cover w-full h-48"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute transition-opacity -translate-y-1/2 opacity-0 left-2 top-1/2 group-hover:opacity-100" />
          <CarouselNext className="absolute transition-opacity -translate-y-1/2 opacity-0 right-2 top-1/2 group-hover:opacity-100" />
        </Carousel>
      </div>

      <CardContent className="flex flex-col flex-grow p-4">
        <h3 className="mb-4 text-lg font-bold">{room.type}</h3>
        <div className="grid grid-cols-2 mb-4 text-sm gap-x-4 gap-y-3 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>Capacity: {room.capacity}</span>
          </div>
          <div className="flex items-center gap-2">
            <Square size={16} />
            <span>{room.size} sq. ft.</span>
          </div>
          {room.beds.king > 0 && (
            <div className="flex items-center gap-2">
              <BedDouble size={16} />
              <span>{room.beds.king} King Bed(s)</span>
            </div>
          )}
          {room.beds.queen > 0 && (
            <div className="flex items-center gap-2">
              <Bed size={16} />
              <span>{room.beds.queen} Queen Bed(s)</span>
            </div>
          )}
        </div>
        <div className="flex-grow" />
        <div className="pt-4 mt-auto border-t">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Price per night</span>
            <span className="text-xl font-bold">{displayPrice}</span>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">Book Now</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Your Room Number</DialogTitle>
                <DialogDescription>
                  Choose an available room for your stay.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <RadioGroup
                  onValueChange={setSelectedRoomNumber}
                  defaultValue={selectedRoomNumber}
                >
                  <div className="space-y-2">
                    {room.roomNumbers.map((rn) => (
                      <div key={rn.number} className="flex items-center">
                        <RadioGroupItem
                          value={rn.number}
                          id={rn._id}
                          disabled={!rn.isAvailable}
                        />
                        <Label
                          htmlFor={rn._id}
                          className={`ml-2 ${
                            !rn.isAvailable
                              ? "text-muted-foreground line-through"
                              : ""
                          }`}
                        >
                          Room {rn.number}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
                {room.roomNumbers.every((rn) => !rn.isAvailable) && (
                  <p className="mt-4 text-red-500">
                    Sorry, no rooms of this type are available.
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button
                  onClick={handleProceedToBooking}
                  disabled={!selectedRoomNumber}
                >
                  Proceed to Booking
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
