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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import RoomForm from "./RoomForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const ManageRooms = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState(null);
  const [roomToDelete, setRoomToDelete] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoadingHotels(true);
      try {
        const response = await fetch("http://localhost:5001/api/hotels");
        const data = await response.json();
        setHotels(data.hotels || (Array.isArray(data) ? data : []));
      } catch (error) {
        toast.error("Error", { description: "Failed to fetch hotels." });
        setHotels([]); // Set to empty array on error
      } finally {
        setLoadingHotels(false);
      }
    };
    fetchHotels();
  }, []);

  const fetchRoomsForHotel = async (hotelId) => {
    if (!hotelId) {
      setRooms([]);
      return;
    }
    setLoadingRooms(true);
    try {
      const response = await fetch(
        `http://localhost:5001/api/rooms/hotel/${hotelId}`
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        setRooms(data);
      } else {
        console.error("API did not return an array for rooms:", data);
        throw new Error("Received invalid room data from server.");
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to fetch rooms for the selected hotel.",
      });
      setRooms([]);
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    fetchRoomsForHotel(selectedHotelId);
  }, [selectedHotelId]);

  const handleDialogClose = () => {
    setIsFormDialogOpen(false);
    setRoomToEdit(null);
  };

  const handleFormSuccess = () => {
    handleDialogClose();
    fetchRoomsForHotel(selectedHotelId);
  };

  const handleEditClick = (room) => {
    setRoomToEdit(room);
    setIsFormDialogOpen(true);
  };

  const handleDeleteClick = (room) => {
    setRoomToDelete(room);
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!roomToDelete) return;
    try {
      const response = await fetch(
        `http://localhost:5001/api/rooms/${roomToDelete._id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete room.");
      fetchRoomsForHotel(selectedHotelId);
      toast.success("Deleted!", {
        description: `Room "${roomToDelete.type}" has been removed.`,
      });
    } catch (error) {
      toast.error("Error!", { description: "Could not delete the room." });
    } finally {
      setIsConfirmDialogOpen(false);
      setRoomToDelete(null);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex flex-col items-start justify-between gap-4 mb-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold">Manage Rooms</h2>
        <div className="flex w-full gap-4 sm:w-auto">
          <Select onValueChange={setSelectedHotelId} value={selectedHotelId}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select a Hotel" />
            </SelectTrigger>
            <SelectContent>
              {loadingHotels ? (
                <p className="p-2 text-sm text-muted-foreground">
                  Loading hotels...
                </p>
              ) : hotels.length > 0 ? (
                hotels.map((hotel) => (
                  <SelectItem key={hotel._id} value={hotel._id}>
                    {hotel.name}
                  </SelectItem>
                ))
              ) : (
                <p className="p-2 text-sm text-muted-foreground">
                  No hotels found.
                </p>
              )}
            </SelectContent>
          </Select>
          <Button
            onClick={() => setIsFormDialogOpen(true)}
            disabled={!selectedHotelId}
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Add New Room
          </Button>
        </div>
      </div>
      <Dialog open={isFormDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {roomToEdit ? "Edit Room" : "Add New Room"}
            </DialogTitle>
          </DialogHeader>
          <RoomForm
            onSuccess={handleFormSuccess}
            hotelId={selectedHotelId}
            initialData={roomToEdit}
          />
        </DialogContent>
      </Dialog>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room Type</TableHead>
              <TableHead>Price/Night</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingRooms ? (
              <TableRow>
                <TableCell colSpan="4" className="h-24">
                  <LoadingSpinner />
                </TableCell>
              </TableRow>
            ) : rooms.length > 0 ? (
              rooms.map((room) => (
                <TableRow key={room._id}>
                  <TableCell className="font-medium">{room.type}</TableCell>
                  <TableCell>${room.pricePerNight}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-8 h-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditClick(room)}>
                          Edit Room
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500 hover:!text-red-500"
                          onClick={() => handleDeleteClick(room)}
                        >
                          Delete Room
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="4" className="h-24 text-center">
                  {selectedHotelId
                    ? "No rooms found for this hotel. Add one to get started!"
                    : "Please select a hotel to see its rooms."}
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
              This will permanently delete the room{" "}
              <span className="font-bold">"{roomToDelete?.type}"</span>.
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

export default ManageRooms;
