import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const allRoomAmenities = [
  "Ocean View",
  "City View",
  "Balcony",
  "Air Conditioning",
  "Mini Bar",
  "Free Wi-Fi",
  "TV",
  "Jacuzzi",
  "Separate Living Area",
];

const formSchema = z.object({
  hotel: z.string().min(1, "Hotel must be selected."),
  type: z.string().min(1, "Room type is required."),
  pricePerNight: z.coerce.number().positive(),
  capacity: z.coerce.number().int().positive(),
  size: z.coerce.number().int().positive(),
  beds: z.object({
    king: z.coerce.number().int().min(0),
    queen: z.coerce.number().int().min(0),
  }),
  amenities: z.array(z.string()).optional(),
  images: z.string().min(1, "At least one image URL is required."),
  roomNumberRange: z
    .string()
    .regex(/^\d+-\d+$/, { message: "Must be a range like 101-105" }), // NEW
});

const RoomForm = ({ onSuccess, hotelId, initialData }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      hotel: hotelId,
      type: "",
      pricePerNight: 80,
      capacity: 2,
      size: 250,
      beds: { king: 0, queen: 1 },
      amenities: [],
      images: "",
      roomNumberRange: "101-105", // NEW
    },
  });

  useEffect(() => {
    if (initialData) {
      const formattedData = {
        ...initialData,
        images: initialData.images.join("\n"),
      };
      form.reset(formattedData);
    } else {
      form.reset({
        type: "",
        pricePerNight: 80,
        capacity: 2,
        size: 250,
        beds: { king: 0, queen: 1 },
        amenities: [],
        images: "",
        hotel: hotelId,
      });
    }
  }, [initialData, hotelId, form]);

  const onSubmit = async (values) => {
    const processedValues = {
      ...values,
      images: values.images.split("\n").filter((url) => url.trim() !== ""),
    };

    try {
      const isEditMode = !!initialData;
      const url = isEditMode
        ? `http://localhost:5001/api/rooms/${initialData._id}`
        : "http://localhost:5001/api/rooms";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(processedValues),
      });
      if (!response.ok)
        throw new Error(`Failed to ${isEditMode ? "update" : "create"} room`);

      toast.success("Success!", {
        description: `Room has been ${isEditMode ? "updated" : "added"}.`,
      });
      onSuccess();
    } catch (error) {
      toast.error("Error!", { description: error.message });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* === START: ALL FORM FIELDS === */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Standard Room">Standard Room</SelectItem>
                  <SelectItem value="Deluxe Room">Deluxe Room</SelectItem>
                  <SelectItem value="Suite">Suite</SelectItem>
                  <SelectItem value="Family Suite">Family Suite</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="pricePerNight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size (sq.ft)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="beds.king"
            render={({ field }) => (
              <FormItem>
                <FormLabel>King Beds</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="beds.queen"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Queen Beds</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="amenities"
          render={() => (
            <FormItem>
              <FormLabel>Amenities</FormLabel>
              <div className="grid grid-cols-3 gap-2">
                {allRoomAmenities.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="amenities"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), item])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roomNumberRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Number Range</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 101-105" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URLs (one per line)</FormLabel>
              <FormControl>
                <Textarea placeholder="https://.../image1.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
        {/* === END: ALL FORM FIELDS === */}
      </form>
    </Form>
  );
};

export default RoomForm;
