import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

import { ThemeProvider } from "./components/custom/ThemeProvider";
import { CurrencyProvider } from "./context/CurrencyContext";
import { LoadingProvider } from "./context/LoadingContext";

import App from "./App.jsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key from .env file");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <LoadingProvider>
        <CurrencyProvider>
          <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <App />
            </ThemeProvider>
          </ClerkProvider>
        </CurrencyProvider>
      </LoadingProvider>
    </BrowserRouter>
  </React.StrictMode>
);
