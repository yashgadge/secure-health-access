
import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PatientRegister from "./pages/patient/Register";
import PatientLogin from "./pages/patient/Login";
import PatientDashboard from "./pages/patient/Dashboard";
import DoctorRegister from "./pages/doctor/Register";
import DoctorLogin from "./pages/doctor/Login";
import DoctorDashboard from "./pages/doctor/Dashboard";
import PatientHistory from "./pages/doctor/PatientHistory";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => {
  // Check local storage and initialize if needed
  useEffect(() => {
    const initializeApp = async () => {
      // This ensures our mock databases are loaded from localStorage on app start
      if (typeof window !== 'undefined' && window.localStorage) {
        // Import here to avoid SSR issues
        const { initMockDatabases } = await import('./utils/mockDatabase');
        initMockDatabases();
      }
    };

    initializeApp();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/patient/register" element={<PatientRegister />} />
            <Route path="/patient/login" element={<PatientLogin />} />
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/doctor/register" element={<DoctorRegister />} />
            <Route path="/doctor/login" element={<DoctorLogin />} />
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/patient-history" element={<PatientHistory />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
