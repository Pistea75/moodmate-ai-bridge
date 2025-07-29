
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { EnhancedSecurityProvider } from "@/components/security/EnhancedSecurityProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Import all your pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignupPatient from "./pages/SignupPatient";
import SignupClinician from "./pages/SignupClinician";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Patient pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientProfile from "./pages/patient/PatientProfile";
import PatientSettings from "./pages/patient/PatientSettings";
import PatientMood from "./pages/patient/PatientMood";
import PatientTasks from "./pages/patient/PatientTasks";
import PatientSessions from "./pages/patient/PatientSessions";
import PatientChat from "./pages/patient/PatientChat";
import PatientMessages from "./pages/patient/PatientMessages";
import PatientInsights from "./pages/patient/PatientInsights";
import PatientMoodInsights from "./pages/patient/PatientMoodInsights";
import Goals from "./pages/patient/Goals";

// Clinician pages
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
import TreatmentPlans from "./pages/clinician/TreatmentPlans";
import TrainAI from "./pages/clinician/TrainAI";
import Reminders from "./pages/clinician/Reminders";
import ResourceLibraryPage from "./pages/clinician/ResourceLibrary";
import RiskManagement from "./pages/clinician/RiskManagement";

// Admin pages
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import SystemHealth from "./pages/admin/SystemHealth";
import AuditTrail from "./pages/admin/AuditTrail";
import SecurityLogs from "./pages/admin/SecurityLogs";
import SystemSettings from "./pages/admin/SystemSettings";

// Public pages
import Landing from "./pages/Landing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Security from "./pages/Security";
import HelpCenter from "./pages/HelpCenter";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error?.message?.includes('JWT')) return false;
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <TooltipProvider>
              <LanguageProvider>
                <AuthProvider>
                  <EnhancedSecurityProvider>
                    <div className="min-h-screen bg-background">
                      <Toaster />
                      <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Index />} />
                        <Route path="/landing" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup-patient" element={<SignupPatient />} />
                        <Route path="/signup-clinician" element={<SignupClinician />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/features" element={<Features />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/security" element={<Security />} />
                        <Route path="/help" element={<HelpCenter />} />

                        {/* Patient routes */}
                        <Route path="/patient/*" element={
                          <ProtectedRoute requiredRole="patient">
                            <Routes>
                              <Route path="dashboard" element={<PatientDashboard />} />
                              <Route path="profile" element={<PatientProfile />} />
                              <Route path="settings" element={<PatientSettings />} />
                              <Route path="mood" element={<PatientMood />} />
                              <Route path="tasks" element={<PatientTasks />} />
                              <Route path="sessions" element={<PatientSessions />} />
                              <Route path="chat" element={<PatientChat />} />
                              <Route path="messages" element={<PatientMessages />} />
                              <Route path="insights" element={<PatientInsights />} />
                              <Route path="mood-insights" element={<PatientMoodInsights />} />
                              <Route path="goals" element={<Goals />} />
                            </Routes>
                          </ProtectedRoute>
                        } />

                        {/* Clinician routes */}
                        <Route path="/clinician/*" element={
                          <ProtectedRoute requiredRole="clinician">
                            <Routes>
                              <Route path="dashboard" element={<ClinicianDashboard />} />
                              <Route path="profile" element={<ClinicianProfile />} />
                              <Route path="settings" element={<ClinicianSettings />} />
                              <Route path="patients" element={<Patients />} />
                              <Route path="patients/:patientId" element={<PatientDetail />} />
                              <Route path="sessions" element={<Sessions />} />
                              <Route path="tasks" element={<Tasks />} />
                              <Route path="reports" element={<Reports />} />
                              <Route path="analytics" element={<Analytics />} />
                              <Route path="communications" element={<Communications />} />
                              <Route path="treatment-plans" element={<TreatmentPlans />} />
                              <Route path="train-ai" element={<TrainAI />} />
                              <Route path="reminders" element={<Reminders />} />
                              <Route path="resource-library" element={<ResourceLibraryPage />} />
                              <Route path="risk-management" element={<RiskManagement />} />
                            </Routes>
                          </ProtectedRoute>
                        } />

                        {/* Admin routes */}
                        <Route path="/admin/*" element={
                          <ProtectedRoute>
                            <Routes>
                              <Route path="dashboard" element={<SuperAdminDashboard />} />
                              <Route path="users" element={<UserManagement />} />
                              <Route path="system-health" element={<SystemHealth />} />
                              <Route path="audit-trail" element={<AuditTrail />} />
                              <Route path="security-logs" element={<SecurityLogs />} />
                              <Route path="settings" element={<SystemSettings />} />
                            </Routes>
                          </ProtectedRoute>
                        } />

                        {/* 404 route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                  </EnhancedSecurityProvider>
                </AuthProvider>
              </LanguageProvider>
            </TooltipProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
