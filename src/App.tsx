
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignupPatient from "./pages/SignupPatient";
import SignupClinician from "./pages/SignupClinician";
import NotFound from "./pages/NotFound";

// Patient pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientChat from "./pages/patient/PatientChat";
import PatientTasks from "./pages/patient/PatientTasks";
import PatientSessions from "./pages/patient/PatientSessions";
import PatientInsights from "./pages/patient/PatientInsights";
import PatientSettings from "./pages/patient/PatientSettings";
import PatientProfile from "./pages/patient/PatientProfile";

// Clinician pages
import ClinicianDashboard from "./pages/clinician/ClinicianDashboard";
import ClinicianSessions from "./pages/clinician/Sessions";
import ClinicianTasks from "./pages/clinician/Tasks";
import ClinicianReports from "./pages/clinician/Reports";
import ClinicianSettings from "./pages/clinician/ClinicianSettings";
import ClinicianProfile from "./pages/clinician/ClinicianProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup/patient" element={<SignupPatient />} />
          <Route path="/signup/clinician" element={<SignupClinician />} />
          
          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/chat" element={<PatientChat />} />
          <Route path="/patient/tasks" element={<PatientTasks />} />
          <Route path="/patient/sessions" element={<PatientSessions />} />
          <Route path="/patient/insights" element={<PatientInsights />} />
          <Route path="/patient/settings" element={<PatientSettings />} />
          <Route path="/patient/profile" element={<PatientProfile />} />
          
          {/* Clinician Routes */}
          <Route path="/clinician/dashboard" element={<ClinicianDashboard />} />
          <Route path="/clinician/sessions" element={<ClinicianSessions />} />
          <Route path="/clinician/tasks" element={<ClinicianTasks />} />
          <Route path="/clinician/reports" element={<ClinicianReports />} />
          <Route path="/clinician/settings" element={<ClinicianSettings />} />
          <Route path="/clinician/profile" element={<ClinicianProfile />} />
          
          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
