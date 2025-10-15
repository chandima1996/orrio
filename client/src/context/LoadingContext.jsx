import React, { createContext, useState, useContext } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false); // Default is not loading

  const value = { isLoading, setIsLoading };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};

// Custom hook for easy access
export const useLoading = () => useContext(LoadingContext);
