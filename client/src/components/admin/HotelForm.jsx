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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const allAmenities = [
  "Wifi",
  "Pool",
  "Parking",
  "Restaurant",
  "Spa",
  "Gym",
  "Pet Friendly",
  "Beach Access",
  "Bar",
];

const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  location: z.string().min(3, { message: "Location is required." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." }),
  starClass: z.coerce.number().int().min(1).max(5),
  rating: z.coerce.number().min(1).max(5),
  images: z.string().min(1, { message: "At least one image URL is required." }),
  amenities: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one amenity.",
  }),
});

const HotelForm = ({ onSuccess, initialData }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      location: "",
      description: "",
      email: "",
      phone: "",
      starClass: 3,
      rating: 4.0,
      images: "",
      amenities: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      const formattedData = {
        ...initialData,
        images: initialData.images.join("\n"),
      };
      form.reset(formattedData);
    }
  }, [initialData, form]);

  const onSubmit = async (values) => {
    const processedValues = {
      ...values,
      images: values.images.split("\n").filter((url) => url.trim() !== ""),
    };

    try {
      const isEditMode = !!initialData;
      const url = isEditMode
        ? `http://localhost:5001/api/hotels/${initialData._id}`
        : "http://localhost:5001/api/hotels";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(processedValues),
      });
      if (!response.ok)
        throw new Error(`Failed to ${isEditMode ? "update" : "create"} hotel`);

      toast.success("Success!", {
        description: `Hotel has been ${isEditMode ? "updated" : "added"}.`,
      });
      onSuccess();
    } catch (error) {
      toast.error("Error!", { description: error.message });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hotel Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Eiffel View Elegance" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Paris, France" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A chic boutique hotel..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="starClass"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stars</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
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
                {allAmenities.map((item) => (
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
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URLs (one per line)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="https://.../image1.jpg&#10;https://.../image2.jpg"
                  className="resize-y"
                  {...field}
                />
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
      </form>
    </Form>
  );
};

export default HotelForm;
