import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const HotelCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="w-full h-52" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="w-3/4 h-6" />
        <Skeleton className="w-1/4 h-4" />
        <Skeleton className="w-1/2 h-4" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="w-12 h-4" />
          <Skeleton className="w-12 h-4" />
          <Skeleton className="w-12 h-4" />
        </div>
        <Skeleton className="w-full h-10 mt-4" />
      </CardContent>
    </Card>
  );
};

export default HotelCardSkeleton;
