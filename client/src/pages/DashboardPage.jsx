import React, { useState, useEffect, useMemo } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import LoadingSpinner from "@/components/custom/LoadingSpinner";
import HotelCard from "@/components/custom/HotelCard";
import { useLoading } from "@/context/LoadingContext";

const MyBookings = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [filterHotelId, setFilterHotelId] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDateRange, setFilterDateRange] = useState({
    from: undefined,
    to: undefined,
  });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(
        "http://localhost:5001/api/bookings/mybookings",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch bookings.");
      const data = await response.json();
      setAllBookings(
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (error) {
      toast.error("Error", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    return allBookings.filter((booking) => {
      if (filterHotelId !== "all" && booking.hotel._id !== filterHotelId)
        return false;
      if (filterStatus !== "all" && booking.bookingStatus !== filterStatus)
        return false;
      if (filterDateRange.from && filterDateRange.to) {
        const bookingStart = new Date(booking.checkInDate);
        const filterInterval = {
          start: startOfDay(filterDateRange.from),
          end: endOfDay(filterDateRange.to),
        };
        if (!isWithinInterval(bookingStart, filterInterval)) return false;
      }
      return true;
    });
  }, [allBookings, filterHotelId, filterStatus, filterDateRange]);

  const handleClearFilters = () => {
    setFilterHotelId("all");
    setFilterStatus("all");
    setFilterDateRange({ from: undefined, to: undefined });
  };

  const handleViewBooking = (booking) => {
    const params = new URLSearchParams();
    params.set("bookingId", booking._id);
    navigate(`/booking?${params.toString()}`);
  };

  const handlePayNow = (booking) => {
    handleViewBooking(booking);
  };

  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setIsCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    if (!bookingToCancel) return;
    try {
      const token = await getToken();
      const response = await fetch(
        `http://localhost:5001/api/bookings/${bookingToCancel._id}/cancel`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to cancel booking.");

      toast.success("Booking Cancelled", {
        description: "Your booking has been successfully cancelled.",
      });
      fetchBookings();
    } catch (error) {
      toast.error("Cancellation Failed", { description: error.message });
    } finally {
      setIsCancelDialogOpen(false);
      setBookingToCancel(null);
    }
  };

  const uniqueHotels = useMemo(() => {
    const hotels = new Map();
    allBookings.forEach((b) => {
      if (b.hotel) {
        hotels.set(b.hotel._id, b.hotel.name);
      }
    });
    return Array.from(hotels, ([id, name]) => ({ id, name }));
  }, [allBookings]);

  const upcomingBookings = filteredBookings.filter(
    (b) => b.bookingStatus === "pending"
  );
  const pastBookings = filteredBookings.filter(
    (b) => b.bookingStatus !== "pending"
  );

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
          <CardDescription>
            View and manage your upcoming and past bookings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 p-4 mb-6 border rounded-lg sm:grid-cols-2 md:grid-cols-4 bg-muted/50">
            <Select value={filterHotelId} onValueChange={setFilterHotelId}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Hotel..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hotels</SelectItem>
                {uniqueHotels.map((h) => (
                  <SelectItem key={h.id} value={h.id}>
                    {h.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="justify-start w-full font-normal text-left text-muted-foreground bg-background"
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {filterDateRange?.from ? (
                    filterDateRange.to ? (
                      `${format(filterDateRange.from, "LLL dd")} - ${format(
                        filterDateRange.to,
                        "LLL dd"
                      )}`
                    ) : (
                      format(filterDateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Filter by Date...</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  selected={filterDateRange}
                  onSelect={setFilterDateRange}
                />
              </PopoverContent>
            </Popover>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="history">
                History ({pastBookings.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
              <div className="mt-4 space-y-4">
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex flex-col justify-between gap-4 p-4 border rounded-md sm:flex-row sm:items-center"
                    >
                      <div>
                        <h3 className="font-bold">
                          {booking.hotel.name} -{" "}
                          <span className="font-normal">
                            {booking.room.type}
                          </span>
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(booking.checkInDate), "PPP")} to{" "}
                          {format(new Date(booking.checkOutDate), "PPP")}
                        </p>
                      </div>
                      <div className="flex self-end flex-shrink-0 gap-2 sm:self-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleViewBooking(booking)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePayNow(booking)}
                        >
                          Pay Now
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelClick(booking)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-center text-muted-foreground">
                    You have no upcoming bookings matching the filters.
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="history">
              <div className="mt-4 space-y-4">
                {pastBookings.length > 0 ? (
                  pastBookings.map((booking) => (
                    <div key={booking._id} className="p-4 border rounded-md">
                      <h3 className="font-bold">
                        {booking.hotel.name} -{" "}
                        <span className="font-normal">{booking.room.type}</span>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.checkInDate), "PPP")} to{" "}
                        {format(new Date(booking.checkOutDate), "PPP")}
                      </p>
                      <p className="mt-2 text-sm font-semibold capitalize">
                        Status: {booking.bookingStatus}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-center text-muted-foreground">
                    You have no past bookings matching the filters.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to cancel?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will cancel your booking for
              <span className="font-bold"> {bookingToCancel?.hotel.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>
              Yes, Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const { setIsLoading } = useLoading();
  const { getToken } = useAuth();

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(
        "http://localhost:5001/api/users/me/favorites",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch favorites.");
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      toast.error("Error", { description: "Could not fetch favorites." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [getToken]);

  const handleFavoriteChange = (hotelId, isCurrentlyFavorite) => {
    if (!isCurrentlyFavorite) {
      setFavorites((prev) => prev.filter((hotel) => hotel._id !== hotelId));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Favorite Hotels</CardTitle>
        <CardDescription>Your saved hotels for future trips.</CardDescription>
      </CardHeader>
      <CardContent>
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((hotel) => (
              <HotelCard
                key={hotel._id}
                hotel={hotel}
                onFavChange={handleFavoriteChange}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            You have not added any hotels to your favorites yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const detailsSchema = z.object({
  firstName: z.string().min(2, "First name is too short."),
  lastName: z.string().min(2, "Last name is too short."),
  contactNo: z
    .string()
    .min(10, "Contact number seems invalid.")
    .optional()
    .or(z.literal("")),
});

const ManageDetails = () => {
  const { user } = useUser();

  const form = useForm({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      contactNo: user?.publicMetadata?.contactNo || "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await user.update({
        firstName: values.firstName,
        lastName: values.lastName,
        publicMetadata: { ...user.publicMetadata, contactNo: values.contactNo },
      });
      toast.success("Success!", {
        description: "Your details have been updated.",
      });
    } catch (error) {
      toast.error("Error", { description: "Failed to update details." });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
        <CardDescription>
          Update your personal information here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-lg space-y-4"
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
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const DashboardPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded)
    return (
      <div className="pt-24">
        <LoadingSpinner />
      </div>
    );
  if (!isSignedIn) {
    return (
      <div className="container pt-24 text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">
          Please sign in to view your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 pt-24 mx-auto">
      <h1 className="mb-2 text-4xl font-bold">My Dashboard</h1>
      <p className="mb-8 text-muted-foreground">
        Welcome back, {user.firstName}!
      </p>

      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bookings">Booking History</TabsTrigger>
          <TabsTrigger value="favorites">My Favorites</TabsTrigger>
          <TabsTrigger value="details">Personal Details</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="mt-6">
          <MyBookings />
        </TabsContent>
        <TabsContent value="favorites" className="mt-6">
          <MyFavorites />
        </TabsContent>
        <TabsContent value="details" className="mt-6">
          <ManageDetails />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
