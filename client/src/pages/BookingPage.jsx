import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { format, differenceInCalendarDays } from "date-fns";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Shadcn UI & Custom Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar as CalendarIcon, Users } from "lucide-react";
import LoadingSpinner from "@/components/custom/LoadingSpinner";
import { useCurrency } from "@/context/CurrencyContext";
import { PaymentForm } from "../components/custom/PaymentForm";

// Load Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Zod Validation Schema for Guest Details
const guestInfoSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  email: z.string().email("Invalid email address."),
  contactNo: z.string().min(10, "A valid contact number is required."),
  address: z.string().min(5, "Address is required."),
});

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { currency, conversionRate } = useCurrency();

  // --- State Management ---
  const [step, setStep] = useState(1);
  const [paymentOption, setPaymentOption] = useState("pending");
  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guestInfo, setGuestInfo] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  // Booking details state
  const [dateRange, setDateRange] = useState({
    from: searchParams.get("from")
      ? new Date(searchParams.get("from"))
      : undefined,
    to: searchParams.get("to") ? new Date(searchParams.get("to")) : undefined,
  });
  const [adults, setAdults] = useState(Number(searchParams.get("adults")) || 1);
  const [children, setChildren] = useState(
    Number(searchParams.get("children")) || 0
  );
  const [roomNumber, setRoomNumber] = useState(
    searchParams.get("roomNumber") || ""
  );

  // Form setup
  const form = useForm({
    resolver: zodResolver(guestInfoSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.primaryEmailAddress?.emailAddress || "",
      contactNo: user?.publicMetadata?.contactNo || "",
      address: "",
    },
  });

  const bookingId = searchParams.get("bookingId");
  const hotelId = searchParams.get("hotelId");
  const roomId = searchParams.get("roomId");

  // Dynamic Calculations
  const numberOfNights =
    dateRange.to && dateRange.from
      ? differenceInCalendarDays(dateRange.to, dateRange.from)
      : 0;
  const totalPrice = room?.pricePerNight * numberOfNights;
  const displayPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(totalPrice * conversionRate);

  // Data Fetching Logic (handles both Create and View modes)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await getToken();

        if (bookingId) {
          // --- VIEW MODE ---
          const response = await fetch(
            `http://localhost:5001/api/bookings/${bookingId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!response.ok) throw new Error("Could not fetch booking details.");
          const bookingData = await response.json();

          setHotel(bookingData.hotel);
          setRoom(bookingData.room);
          setDateRange({
            from: new Date(bookingData.checkInDate),
            to: new Date(bookingData.checkOutDate),
          });
          setAdults(bookingData.guests.adults);
          setChildren(bookingData.guests.children);
          setRoomNumber(bookingData.roomNumber);
          form.reset(bookingData.guestInfo);
        } else if (hotelId && roomId) {
          // --- CREATE MODE ---
          const [hotelRes, roomRes] = await Promise.all([
            fetch(`http://localhost:5001/api/hotels/${hotelId}`),
            fetch(`http://localhost:5001/api/rooms/${roomId}`),
          ]);
          if (!hotelRes.ok || !roomRes.ok)
            throw new Error("Could not fetch details.");
          const hotelData = await hotelRes.json();
          const roomData = await roomRes.json();
          setHotel(hotelData);
          setRoom(roomData);
        } else {
          throw new Error("Required booking details are missing.");
        }
      } catch (error) {
        toast.error("Error", { description: error.message });
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookingId, hotelId, roomId, getToken, form, navigate]);

  // Form and Booking Submission Handlers
  const onDetailsSubmit = async (data) => {
    setGuestInfo(data);
    if (totalPrice <= 0)
      return toast.error("Error", {
        description: "Please select a valid date range.",
      });

    try {
      const token = await getToken();
      const response = await fetch(
        "http://localhost:5001/api/payments/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: totalPrice }),
        }
      );
      const { clientSecret } = await response.json();
      if (!clientSecret) throw new Error("Could not initialize payment.");
      setClientSecret(clientSecret);
      setStep(2);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  };

  const onConfirmBooking = async (paymentDetails = null) => {
    if (!guestInfo)
      return toast.error("Error", {
        description: "Guest details are missing.",
      });

    const bookingObject = {
      hotel: hotelId || hotel._id,
      room: roomId || room._id,
      roomNumber,
      user: user.id,
      checkInDate: dateRange.from,
      checkOutDate: dateRange.to,
      guests: { adults, children },
      totalPrice: totalPrice,
      bookingStatus: paymentDetails ? "paid" : "pending",
      paymentDetails: paymentDetails,
      guestInfo: guestInfo,
    };

    try {
      const token = await getToken();
      const response = await fetch("http://localhost:5001/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingObject),
      });
      if (!response.ok) throw new Error("Booking failed. Please try again.");

      toast.success("Booking Confirmed!", {
        description: "Your booking is successful. Check your dashboard.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  };

  const handlePaymentSuccess = (paymentId) => {
    onConfirmBooking({ paymentId, paymentMethod: "stripe" });
  };

  if (loading)
    return (
      <div className="pt-24">
        <LoadingSpinner />
      </div>
    );
  if (!hotel || !room)
    return (
      <div className="pt-24 text-center">
        <h1>Booking details could not be loaded.</h1>
      </div>
    );

  return (
    <div className="container grid grid-cols-1 gap-12 px-4 py-8 pt-24 mx-auto lg:grid-cols-3">
      {/* Left Side: Booking Summary */}
      <div className="space-y-6 lg:col-span-1">
        <h2 className="text-2xl font-bold">Your Booking Summary</h2>
        <div className="overflow-hidden border rounded-lg">
          <Carousel>
            <CarouselContent>
              {hotel.images.map((img, i) => (
                <CarouselItem key={i}>
                  <img
                    src={img}
                    alt={hotel.name}
                    className="object-cover w-full h-48"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="p-4">
            <h3 className="text-lg font-bold">{hotel.name}</h3>
            <p className="text-sm text-muted-foreground">{hotel.location}</p>
          </div>
        </div>
        <div className="overflow-hidden border rounded-lg">
          <Carousel>
            <CarouselContent>
              {room.images.map((img, i) => (
                <CarouselItem key={i}>
                  <img
                    src={img}
                    alt={room.type}
                    className="object-cover w-full h-48"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="p-4">
            <h3 className="font-semibold">{room.type}</h3>
            <p className="mt-1 text-sm font-bold text-primary">
              Room No: {roomNumber}
            </p>
          </div>
        </div>
        <div className="p-4 space-y-4 border rounded-lg">
          <h3 className="pb-2 text-lg font-semibold border-b">
            Your Trip Details
          </h3>
          <div>
            <Label>Dates</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="justify-start w-full mt-1 font-normal text-left"
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      `${format(dateRange.from, "LLL dd")} - ${format(
                        dateRange.to,
                        "LLL dd"
                      )}`
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick dates</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  disabled={{ before: new Date() }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>Guests</Label>
            <div className="flex items-center justify-between h-10 px-3 mt-1 text-sm border rounded-md">
              <span>
                {adults} Adults, {children} Children
              </span>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
          <span className="text-lg font-semibold">
            Total Price (
            {numberOfNights > 0 ? `${numberOfNights} nights` : "..."})
          </span>
          <span className="text-2xl font-bold">
            {numberOfNights > 0 ? displayPrice : "..."}
          </span>
        </div>
      </div>

      {/* Right Side: Form & Payment */}
      <div className="lg:col-span-2">
        {step === 1 && (
          <div>
            <h2 className="mb-4 text-2xl font-bold">Guest Information</h2>
            <p className="mb-6 text-muted-foreground">
              Please fill in your details to proceed.
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onDetailsSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact No.</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full !mt-8">
                  Proceed to Payment
                </Button>
              </form>
            </Form>
          </div>
        )}

        {step === 2 && (
          <div>
            <Button
              variant="link"
              onClick={() => setStep(1)}
              className="pl-0 mb-4"
            >
              ← Back to details
            </Button>
            <h2 className="mb-4 text-2xl font-bold">Payment Options</h2>
            <RadioGroup
              value={paymentOption}
              onValueChange={setPaymentOption}
              className="mb-6 space-y-2"
            >
              <Label className="flex items-center space-x-3 p-4 border rounded-md has-[:checked]:border-primary cursor-pointer">
                <RadioGroupItem value="pending" id="r1" />
                <span className="font-medium">Pay Later (at the hotel)</span>
              </Label>
              <Label className="flex items-center space-x-3 p-4 border rounded-md has-[:checked]:border-primary cursor-pointer">
                <RadioGroupItem value="pay" id="r2" />
                <span className="font-medium">Pay Now</span>
              </Label>
            </RadioGroup>

            {paymentOption === "pending" && (
              <Button onClick={() => onConfirmBooking(null)} className="w-full">
                Confirm Booking
              </Button>
            )}

            {paymentOption === "pay" && clientSecret && (
              <Elements options={{ clientSecret }} stripe={stripePromise}>
                <PaymentForm onPaymentSuccess={handlePaymentSuccess} />
              </Elements>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
