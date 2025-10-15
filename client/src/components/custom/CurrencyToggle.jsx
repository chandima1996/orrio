import React from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {currency}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setCurrency("USD")}>
          USD ($)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrency("LKR")}>
          LKR (Rs)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
