import React, { createContext, useState, useContext } from "react";

const LKR_CONVERSION_RATE = 300;

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("USD");

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

export const useCurrency = () => useContext(CurrencyContext);
