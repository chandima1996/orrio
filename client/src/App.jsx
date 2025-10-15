import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/custom/Navbar";
import Footer from "./components/custom/Footer";
import GlobalLoader from "./components/custom/GlobalLoader";
import { Toaster } from "@/components/ui/sonner";
import LoadingSpinner from "./components/custom/LoadingSpinner";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const HotelsPage = React.lazy(() => import("./pages/HotelsPage"));
const SingleHotelPage = React.lazy(() => import("./pages/SingleHotelPage"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const AdminDashboardPage = React.lazy(() =>
  import("./pages/AdminDashboardPage")
);
const BookingPage = React.lazy(() => import("./pages/BookingPage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));

function App() {
  return (
    <>
      <Navbar />
      <GlobalLoader />

      <main className="min-h-screen">
        <Suspense
          fallback={
            <div className="pt-32">
              <LoadingSpinner />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/hotels" element={<HotelsPage />} />
            <Route path="/hotels/:id" element={<SingleHotelPage />} />
            <Route path="/booking" element={<BookingPage />} />

            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
