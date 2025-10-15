import React from "react";
import { Building2, Sparkles, UserCheck } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="pt-20 bg-muted/20">
      <section className="py-20 text-center bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            About{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              Orrio
            </span>
          </h1>
          <p className="max-w-2xl mx-auto mt-4 text-lg">
            Revolutionizing the hotel booking experience with the power of
            Artificial Intelligence.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold">Our Mission</h2>
          <p className="max-w-3xl mx-auto leading-relaxed text-muted-foreground">
            At Orrio, our mission is to simplify travel planning by providing a
            seamless, intelligent, and personalized hotel booking platform. We
            believe finding the perfect stay should be as delightful as the
            journey itself. By leveraging cutting-edge AI, we analyze your
            desires—whether it's a "quiet beachside hotel with a pool" or a
            "vibrant city-center stay for a business trip"—to deliver curated
            results that perfectly match your vibe.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container px-4 mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Service 1 */}
            <div className="p-6 text-center border rounded-lg">
              <Sparkles className="w-12 h-12 text-primary" />

              <h3 className="mb-2 text-xl font-semibold">AI-Powered Search</h3>
              <p className="text-muted-foreground">
                Describe your ideal vacation, and our AI will find the perfect
                hotel for you.
              </p>
            </div>
            <div className="p-6 text-center border rounded-lg">
              <Building2 className="w-12 h-12 text-primary" />

              <h3 className="mb-2 text-xl font-semibold">Vast Hotel Network</h3>
              <p className="text-muted-foreground">
                From luxury resorts to cozy boutique hotels, our extensive
                network ensures you have the best options.
              </p>
            </div>
            <div className="p-6 text-center border rounded-lg">
              <UserCheck className="w-12 h-12 text-primary" />

              <h3 className="mb-2 text-xl font-semibold">Seamless Booking</h3>
              <p className="text-muted-foreground">
                A secure, straightforward, and user-friendly booking process
                from start to finish.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
