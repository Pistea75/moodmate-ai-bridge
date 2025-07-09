
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignupPatient from "./pages/SignupPatient";
import SignupClinician from "./pages/SignupClinician";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Security from "./pages/Security";
import FAQ from "./pages/FAQ";
import HelpCenter from "./pages/HelpCenter";
import NotFound from "./pages/NotFound";
import TestPage from "./pages/TestPage";

// Patient pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientProfile from "./pages/patient/PatientProfile";
import PatientSettings from "./pages/patient/PatientSettings";
import PatientChat from "./pages/patient/PatientChat";
import PatientSessions from "./pages/patient/PatientSessions";
import PatientTasks from "./pages/patient/PatientTasks";
import PatientInsights from "./pages/patient/PatientInsights";

// Clinician pages
import ClinicianDashboard from "./pages/clinician/ClinicianDashboard";
import Analytics from "./pages/clinician/Analytics";
import RiskManagement from "./pages/clinician/RiskManagement";
import Patients from "./pages/clinician/Patients";
import PatientDetail from "./pages/clinician/PatientDetail";
import Sessions from "./pages/clinician/Sessions";
import Tasks from "./pages/clinician/Tasks";
import Reports from "./pages/clinician/Reports";
import TrainAI from "./pages/clinician/TrainAI";
import ClinicianProfile from "./pages/clinician/ClinicianProfile";
import ClinicianSettings from "./pages/clinician/ClinicianSettings";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup/patient" element={<SignupPatient />} />
              <Route path="/signup/clinician" element={<SignupClinician />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/security" element={<Security />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/test" element={<TestPage />} />

              {/* Patient routes */}
              <Route path="/patient/dashboard" element={
                <ProtectedRoute requiredRole="patient">
                  <PatientDashboard />
                </ProtectedRoute>
              } />
              <Route path="/patient/profile" element={
                <ProtectedRoute requiredRole="patient">
                  <PatientProfile />
                </ProtectedRoute>
              } />
              <Route path="/patient/settings" element={
                <ProtectedRoute requiredRole="patient">
                  <PatientSettings />
                </ProtectedRoute>
              } />
              <Route path="/patient/chat" element={
                <ProtectedRoute requiredRole="patient">
                  <PatientChat />
                </ProtectedRoute>
              } />
              <Route path="/patient/sessions" element={
                <ProtectedRoute requiredRole="patient">
                  <PatientSessions />
                </ProtectedRoute>
              } />
              <Route path="/patient/tasks" element={
                <ProtectedRoute requiredRole="patient">
                  <PatientTasks />
                </ProtectedRoute>
              } />
              <Route path="/patient/insights" element={
                <ProtectedRoute requiredRole="patient">
                  <PatientInsights />
                </ProtectedRoute>
              } />

              {/* Clinician routes */}
              <Route path="/clinician/dashboard" element={
                <ProtectedRoute requiredRole="clinician">
                  <ClinicianDashboard />
                </ProtectedRoute>
              } />
              <Route path="/clinician/analytics" element={
                <ProtectedRoute requiredRole="clinician">
                  <Analytics />
                </ProtectedRoute>
              } />
              <Route path="/clinician/risk-management" element={
                <ProtectedRoute requiredRole="clinician">
                  <RiskManagement />
                </ProtectedRoute>
              } />
              <Route path="/clinician/patients" element={
                <ProtectedRoute requiredRole="clinician">
                  <Patients />
                </ProtectedRoute>
              } />
              <Route path="/clinician/patients/:id" element={
                <ProtectedRoute requiredRole="clinician">
                  <PatientDetail />
                </ProtectedRoute>
              } />
              <Route path="/clinician/sessions" element={
                <ProtectedRoute requiredRole="clinician">
                  <Sessions />
                </ProtectedRoute>
              } />
              <Route path="/clinician/tasks" element={
                <ProtectedRoute requiredRole="clinician">
                  <Tasks />
                </ProtectedRoute>
              } />
              <Route path="/clinician/reports" element={
                <ProtectedRoute requiredRole="clinician">
                  <Reports />
                </ProtectedRoute>
              } />
              <Route path="/clinician/train-ai" element={
                <ProtectedRoute requiredRole="clinician">
                  <TrainAI />
                </ProtectedRoute>
              } />
              <Route path="/clinician/profile" element={
                <ProtectedRoute requiredRole="clinician">
                  <ClinicianProfile />
                </ProtectedRoute>
              } />
              <Route path="/clinician/settings" element={
                <ProtectedRoute requiredRole="clinician">
                  <ClinicianSettings />
                </ProtectedRoute>
              } />

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
