import React from "react";
import { useLoading } from "@/context/LoadingContext";
import { Loader2 } from "lucide-react";

const GlobalLoader = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null; // If not loading, show nothing

  return (
    // Full screen overlay
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex justify-center items-center z-[9999]">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  );
};

export default GlobalLoader;
