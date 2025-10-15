import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Phone, Mail, MapPin, Send } from "lucide-react";

const ContactPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    // This is a placeholder for a real email sending service (e.g., Resend, EmailJS)
    console.log(data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Message Sent!", {
      description:
        "Thank you for contacting us. We will get back to you shortly.",
    });
    reset();
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-muted/20">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl font-bold md:text-5xl">Get In Touch</h1>
          <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
            We'd love to hear from you. Whether you have a question, feedback,
            or need assistance, our team is ready to help.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container px-4 py-16 mx-auto">
        <div className="grid items-start grid-cols-1 gap-16 md:grid-cols-2">
          {/* === START: UPDATED CONTACT INFO (LEFT SIDE) === */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">
              Contact Information
            </h2>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Our Address</h3>
                <p className="text-muted-foreground">
                  123 Galle Road, Colombo 03, Sri Lanka
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Email Us</h3>
                <p className="text-muted-foreground">support@orrio.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Call Us</h3>
                <p className="text-muted-foreground">+94 11 234 5678</p>
              </div>
            </div>
          </div>
          {/* === END: UPDATED CONTACT INFO === */}

          {/* === START: UPDATED CONTACT FORM (RIGHT SIDE) === */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      {...register("name", { required: true })}
                      placeholder="Your Name"
                    />
                    <Input
                      {...register("email", { required: true })}
                      type="email"
                      placeholder="Your Email"
                    />
                  </div>
                  <Input
                    {...register("subject", { required: true })}
                    placeholder="Subject"
                  />
                  <Textarea
                    {...register("message", { required: true })}
                    placeholder="Your Message"
                    rows={5}
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        {" "}
                        <Send className="w-4 h-4 mr-2" /> Send Message{" "}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          {/* === END: UPDATED CONTACT FORM === */}
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
