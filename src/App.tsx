
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/patient/register" element={<PatientRegister />} />
          <Route path="/patient/login" element={<PatientLogin />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/doctor/register" element={<DoctorRegister />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/patient-history" element={<PatientHistory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
