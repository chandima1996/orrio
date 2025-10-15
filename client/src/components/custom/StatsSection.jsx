import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Star } from "lucide-react";

const statsData = [
  {
    icon: <Building2 className="w-8 h-8 text-white" />,
    value: "150+",
    label: "Hotels Registered",
    bgImage:
      "https://images.unsplash.com/photo-1561501900-3701fa6a0864?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
  },
  {
    icon: <Users className="w-8 h-8 text-white" />,
    value: "10k+",
    label: "Happy Customers",
    bgImage:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
  },
  {
    icon: <Star className="w-8 h-8 text-white" />,
    value: "4.9",
    label: "Overall Rating",
    bgImage:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1174",
  },
];

const StatsSection = () => {
  return (
    <section className="pb-16 sm:pb-24">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="relative overflow-hidden group">
                <div
                  className="absolute inset-0 transition-transform duration-500 bg-center bg-cover group-hover:scale-105"
                  style={{ backgroundImage: `url(${stat.bgImage})` }}
                ></div>
                <div className="absolute inset-0 transition-colors duration-300 bg-black/60 group-hover:bg-black/70"></div>
                <CardContent className="relative z-10 flex flex-col items-center gap-4 p-10 text-white">
                  {stat.icon}
                  <p className="text-4xl font-bold">{stat.value}</p>
                  <p className="text-xl font-semibold">{stat.label}</p>{" "}
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
