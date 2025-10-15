import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Star } from "lucide-react";

const statsData = [
  {
    icon: <Building2 className="h-8 w-8 text-white" />, // Icon color eka white karanna
    value: "150+",
    label: "Hotels Registered",
    bgImage:
      "https://images.unsplash.com/photo-1561501900-3701fa6a0864?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170", // Nawa bgImage prop eka
  },
  {
    icon: <Users className="h-8 w-8 text-white" />, // Icon color eka white karanna
    value: "10k+",
    label: "Happy Customers",
    bgImage:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
  },
  {
    icon: <Star className="h-8 w-8 text-white" />, // Icon color eka white karanna
    value: "4.9",
    label: "Overall Rating",
    bgImage:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1174",
  },
];

const StatsSection = () => {
  return (
    <section className="pb-16 sm:pb-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }} // Animate when it comes into view
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }} // Animate only once
            >
              <Card className="relative overflow-hidden group">
                {" "}
                {/* relative, overflow-hidden, group add karanna */}
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" // Animation add karanna
                  style={{ backgroundImage: `url(${stat.bgImage})` }}
                ></div>
                {/* Overlay (text eka hodata penna) */}
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors duration-300"></div>
                <CardContent className="relative z-10 p-10 flex flex-col items-center gap-4 text-white">
                  {" "}
                  {/* text-white, relative z-10 add karanna */}
                  {stat.icon}
                  <p className="text-4xl font-bold">{stat.value}</p>
                  <p className="text-xl font-semibold">{stat.label}</p>{" "}
                  {/* Label text size eka poddak wadi karamu */}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
