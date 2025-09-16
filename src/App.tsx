
import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";

import { EnhancedSecurityProvider } from "@/components/security/EnhancedSecurityProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import LoadingFallback from "@/components/common/LoadingFallback";

// Lazy loaded pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const SignupChoice = lazy(() => import("./pages/SignupChoice"));
const SignupPatient = lazy(() => import("./pages/SignupPatient"));
const SignupClinician = lazy(() => import("./pages/SignupClinician"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// Patient pages
const PatientDashboard = lazy(() => import("./pages/patient/PatientDashboard"));
const PatientProfile = lazy(() => import("./pages/patient/PatientProfile"));
const PatientSettings = lazy(() => import("./pages/patient/PatientSettings"));
const PatientMood = lazy(() => import("./pages/patient/PatientMood"));
const PatientTasks = lazy(() => import("./pages/patient/PatientTasks"));
const PatientSessions = lazy(() => import("./pages/patient/PatientSessions"));
const PatientChat = lazy(() => import("./pages/patient/PatientChat"));
const PatientMessages = lazy(() => import("./pages/patient/PatientMessages"));
const PatientInsights = lazy(() => import("./pages/patient/PatientInsights"));
const PatientMoodInsights = lazy(() => import("./pages/patient/PatientMoodInsights"));
const Goals = lazy(() => import("./pages/patient/Goals"));
const Marketplace = lazy(() => import("./pages/patient/Marketplace"));

// Clinician pages
const ClinicianDashboard = lazy(() => import("./pages/clinician/ClinicianDashboard"));
const ClinicianProfile = lazy(() => import("./pages/clinician/ClinicianProfile"));
const ClinicianSettings = lazy(() => import("./pages/clinician/ClinicianSettings"));
const Patients = lazy(() => import("./pages/clinician/Patients"));
const PatientDetail = lazy(() => import("./pages/clinician/PatientDetail"));
const Sessions = lazy(() => import("./pages/clinician/Sessions"));
const Tasks = lazy(() => import("./pages/clinician/Tasks"));
const Reports = lazy(() => import("./pages/clinician/Reports"));
const Analytics = lazy(() => import("./pages/clinician/Analytics"));
const Communications = lazy(() => import("./pages/clinician/Communications"));
const TreatmentPlans = lazy(() => import("./pages/clinician/TreatmentPlans"));
const TrainAI = lazy(() => import("./pages/clinician/TrainAI"));
const MarketplaceProfile = lazy(() => import("./pages/clinician/MarketplaceProfile"));
const Reminders = lazy(() => import("./pages/clinician/Reminders"));
const ResourceLibraryPage = lazy(() => import("./pages/clinician/ResourceLibrary"));
const RiskManagement = lazy(() => import("./pages/clinician/RiskManagement"));

// Admin pages
const SuperAdminDashboard = lazy(() => import("./pages/admin/SuperAdminDashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const SystemHealth = lazy(() => import("./pages/admin/SystemHealth"));
const AuditTrail = lazy(() => import("./pages/admin/AuditTrail"));
const SecurityLogs = lazy(() => import("./pages/admin/SecurityLogs"));
const SystemSettings = lazy(() => import("./pages/admin/SystemSettings"));
const WaitingListManagement = lazy(() => import("./pages/admin/WaitingListManagement"));

// Public pages
const Landing = lazy(() => import("./pages/Landing"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Features = lazy(() => import("./pages/Features"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Security = lazy(() => import("./pages/Security"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const SubscriptionSuccess = lazy(() => import("./pages/SubscriptionSuccess"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PatientInviteSignup = lazy(() => import("./pages/PatientInviteSignup"));
const WaitingList = lazy(() => import("./pages/WaitingList"));
const SignupBlocked = lazy(() => import("./pages/SignupBlocked"));

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
              <AuthProvider>
                  <EnhancedSecurityProvider>
                    <div className="min-h-screen bg-background">
                      <Toaster />
                      <ShadcnToaster />
                      <Suspense fallback={<LoadingFallback />}>
                        <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Index />} />
                        <Route path="/landing" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/waitlist" element={<WaitingList />} />
                        {/* Blocked signup routes - redirect to waiting list */}
                        <Route path="/signup/choice" element={<SignupBlocked />} />
                        <Route path="/signup/patient" element={<SignupBlocked />} />
                        <Route path="/signup/clinician" element={<SignupBlocked />} />
                        {/* Keep old routes for compatibility */}
                        <Route path="/signup-patient" element={<SignupBlocked />} />
                        <Route path="/signup-clinician" element={<SignupBlocked />} />
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
                        <Route path="/subscription/success" element={<SubscriptionSuccess />} />
                        <Route path="/invite/:code" element={<PatientInviteSignup />} />

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
                              <Route path="marketplace" element={<Marketplace />} />
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
                              <Route path="marketplace-profile" element={<MarketplaceProfile />} />
                              <Route path="reminders" element={<Reminders />} />
                              <Route path="resource-library" element={<ResourceLibraryPage />} />
                              <Route path="risk-management" element={<RiskManagement />} />
                            </Routes>
                          </ProtectedRoute>
                        } />

                        {/* Super Admin routes */}
                        <Route path="/admin/*" element={
                          <ProtectedRoute requiredRole="super_admin">
                            <Routes>
                              <Route path="dashboard" element={<SuperAdminDashboard />} />
                              <Route path="super-admin-dashboard" element={<SuperAdminDashboard />} />
                              <Route path="users" element={<UserManagement />} />
                              <Route path="user-management" element={<UserManagement />} />
                              <Route path="system-health" element={<SystemHealth />} />
                              <Route path="audit-trail" element={<AuditTrail />} />
                              <Route path="security-logs" element={<SecurityLogs />} />
                              <Route path="settings" element={<SystemSettings />} />
                              <Route path="system-settings" element={<SystemSettings />} />
                              <Route path="waiting-list" element={<WaitingListManagement />} />
                            </Routes>
                          </ProtectedRoute>
                        } />

                        {/* 404 route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      </Suspense>
                    </div>
                  </EnhancedSecurityProvider>
                </AuthProvider>
            </TooltipProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
