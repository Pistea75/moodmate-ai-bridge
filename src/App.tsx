
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CSRFProvider } from "@/components/security/CSRFProtection";
import { SecurityHeaders } from "@/components/security/SecurityHeaders";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Import pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignupPatient from "./pages/SignupPatient";
import SignupClinician from "./pages/SignupClinician";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientProfile from "./pages/patient/PatientProfile";
import PatientSessions from "./pages/patient/PatientSessions";
import PatientTasks from "./pages/patient/PatientTasks";
import PatientMood from "./pages/patient/PatientMood";
import PatientMoodInsights from "./pages/patient/PatientMoodInsights";
import PatientInsights from "./pages/patient/PatientInsights";
import PatientChat from "./pages/patient/PatientChat";
import PatientSettings from "./pages/patient/PatientSettings";
import Goals from "./pages/patient/Goals";
import ClinicianDashboard from "./pages/clinician/ClinicianDashboard";
import ClinicianProfile from "./pages/clinician/ClinicianProfile";
import ClinicianSettings from "./pages/clinician/ClinicianSettings";
import Patients from "./pages/clinician/Patients";
import PatientDetail from "./pages/clinician/PatientDetail";
import Sessions from "./pages/clinician/Sessions";
import Tasks from "./pages/clinician/Tasks";
import Reports from "./pages/clinician/Reports";
import Analytics from "./pages/clinician/Analytics";
import Communications from "./pages/clinician/Communications";
import Reminders from "./pages/clinician/Reminders";
import TreatmentPlans from "./pages/clinician/TreatmentPlans";
import ResourceLibrary from "./pages/clinician/ResourceLibrary";
import TrainAI from "./pages/clinician/TrainAI";
import RiskManagement from "./pages/clinician/RiskManagement";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import About from "./pages/About";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import HelpCenter from "./pages/HelpCenter";
import FAQ from "./pages/FAQ";
import Security from "./pages/Security";
import NotFound from "./pages/NotFound";
import TestPage from "./pages/TestPage";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <LanguageProvider>
              <BrowserRouter>
                <CSRFProvider>
                  <SecurityHeaders />
                  <AuthProvider>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/features" element={<Features />} />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/help" element={<HelpCenter />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/security" element={<Security />} />
                      
                      {/* Auth routes */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup/patient" element={<SignupPatient />} />
                      <Route path="/signup/clinician" element={<SignupClinician />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      
                      {/* Patient routes */}
                      <Route path="/patient/dashboard" element={<PatientDashboard />} />
                      <Route path="/patient/profile" element={<PatientProfile />} />
                      <Route path="/patient/sessions" element={<PatientSessions />} />
                      <Route path="/patient/tasks" element={<PatientTasks />} />
                      <Route path="/patient/mood" element={<PatientMood />} />
                      <Route path="/patient/mood-insights" element={<PatientMoodInsights />} />
                      <Route path="/patient/insights" element={<PatientInsights />} />
                      <Route path="/patient/chat" element={<PatientChat />} />
                      <Route path="/patient/settings" element={<PatientSettings />} />
                      <Route path="/patient/goals" element={<Goals />} />
                      
                      {/* Clinician routes */}
                      <Route path="/clinician/dashboard" element={<ClinicianDashboard />} />
                      <Route path="/clinician/profile" element={<ClinicianProfile />} />
                      <Route path="/clinician/settings" element={<ClinicianSettings />} />
                      <Route path="/clinician/patients" element={<Patients />} />
                      <Route path="/clinician/patients/:patientId" element={<PatientDetail />} />
                      <Route path="/clinician/sessions" element={<Sessions />} />
                      <Route path="/clinician/tasks" element={<Tasks />} />
                      <Route path="/clinician/reports" element={<Reports />} />
                      <Route path="/clinician/analytics" element={<Analytics />} />
                      <Route path="/clinician/communications" element={<Communications />} />
                      <Route path="/clinician/reminders" element={<Reminders />} />
                      <Route path="/clinician/treatment-plans" element={<TreatmentPlans />} />
                      <Route path="/clinician/resources" element={<ResourceLibrary />} />
                      <Route path="/clinician/train-ai" element={<TrainAI />} />
                      <Route path="/clinician/risk-management" element={<RiskManagement />} />
                      
                      {/* Admin routes */}
                      <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
                      
                      {/* Test route */}
                      <Route path="/test" element={<TestPage />} />
                      
                      {/* Catch all */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AuthProvider>
                </CSRFProvider>
              </BrowserRouter>
            </LanguageProvider>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
