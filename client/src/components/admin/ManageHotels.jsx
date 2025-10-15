import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { MoreHorizontal, PlusCircle } from "lucide-react";
import LoadingSpinner from "../custom/LoadingSpinner";
import HotelForm from "./HotelForm";

const ManageHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [hotelToEdit, setHotelToEdit] = useState(null);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/api/hotels");
      if (!response.ok) throw new Error("Failed to fetch hotels");

      const data = await response.json();
      setHotels(data.hotels || []);
    } catch (error) {
      console.error("Failed to fetch hotels:", error);
      toast.error("Error!", { description: "Could not fetch hotel data." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleDialogClose = () => {
    setIsFormDialogOpen(false);
    setHotelToEdit(null);
  };

  const handleFormSuccess = () => {
    handleDialogClose();
    fetchHotels();
  };

  const handleEditClick = (hotel) => {
    setHotelToEdit(hotel);
    setIsFormDialogOpen(true);
  };

  const handleDeleteClick = (hotel) => {
    setHotelToDelete(hotel);
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!hotelToDelete) return;
    try {
      const response = await fetch(
        `http://localhost:5001/api/hotels/${hotelToDelete._id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete hotel");

      toast.success("Deleted!", {
        description: `Hotel "${hotelToDelete.name}" has been removed.`,
      });
      fetchHotels();
    } catch (error) {
      toast.error("Error!", { description: "Could not delete the hotel." });
    } finally {
      setIsConfirmDialogOpen(false);
      setHotelToDelete(null);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Manage Hotels</h2>
        <Button onClick={() => setIsFormDialogOpen(true)}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add New Hotel
        </Button>
      </div>

      <Dialog open={isFormDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {hotelToEdit ? "Edit Hotel" : "Add New Hotel"}
            </DialogTitle>
          </DialogHeader>
          <HotelForm onSuccess={handleFormSuccess} initialData={hotelToEdit} />
        </DialogContent>
      </Dialog>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="hidden md:table-cell">Star Class</TableHead>
              <TableHead className="hidden md:table-cell">
                User Rating
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan="5" className="h-24">
                  <LoadingSpinner />
                </TableCell>
              </TableRow>
            ) : hotels.length > 0 ? (
              hotels.map((hotel) => (
                <TableRow key={hotel._id}>
                  <TableCell className="font-medium">{hotel.name}</TableCell>
                  <TableCell>{hotel.location}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {hotel.starClass} Star
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {hotel.rating}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-8 h-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleEditClick(hotel)}
                        >
                          Edit Hotel
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500 hover:!text-red-500"
                          onClick={() => handleDeleteClick(hotel)}
                        >
                          Delete Hotel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="5" className="h-24 text-center">
                  No hotels found. Add one to get started!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              hotel
              <span className="font-bold"> "{hotelToDelete?.name}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageHotels;
