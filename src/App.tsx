
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Services from "./pages/Services";
import Grievances from "./pages/Grievances";
import Contact from "./pages/Contact";
import Department from "./pages/Department";
import ZonalOffice from "./pages/ZonalOffice";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { AuthProvider } from "./contexts/AuthContext";

// Import Service Pages
import BirthDeathCertificate from "./pages/ServicePages/BirthDeathCertificate";
import PropertyTaxPage from "./pages/ServicePages/PropertyTaxPage";
import WaterBillPage from "./pages/ServicePages/WaterBillPage";
import TradeLicensePage from "./pages/ServicePages/TradeLicensePage";
import BuildingPermitPage from "./pages/ServicePages/BuildingPermitPage";
import MarriageRegistrationPage from "./pages/ServicePages/MarriageRegistrationPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/grievances" element={<Grievances />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/department/:id" element={<Department />} />
            <Route path="/zonal-office/:id" element={<ZonalOffice />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Service Routes */}
            <Route path="/services/birth-death-certificate" element={<BirthDeathCertificate />} />
            <Route path="/services/property-tax" element={<PropertyTaxPage />} />
            <Route path="/services/water-bill" element={<WaterBillPage />} />
            <Route path="/services/trade-license" element={<TradeLicensePage />} />
            <Route path="/services/building-permit" element={<BuildingPermitPage />} />
            <Route path="/services/marriage-registration" element={<MarriageRegistrationPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
