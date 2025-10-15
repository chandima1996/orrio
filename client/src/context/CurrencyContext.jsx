import React, { createContext, useState, useContext } from "react";

// Danata api dummy conversion rate ekak use karamu
const LKR_CONVERSION_RATE = 300; // Example: 1 USD = 300 LKR

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("USD"); // Default currency

  const value = {
    currency,
    setCurrency,
    conversionRate: currency === "LKR" ? LKR_CONVERSION_RATE : 1,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Custom hook ekak hadagamu lesiyata use karanna
export const useCurrency = () => useContext(CurrencyContext);
