import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./providers/ThemeProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { EnhancedSecurityProvider } from "./components/security/EnhancedSecurityProvider";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PatientDashboard from "./pages/patient/PatientDashboard";
import ClinicianDashboard from "./pages/clinician/ClinicianDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PatientProfile from "./pages/patient/PatientProfile";
import ClinicianProfile from "./pages/clinician/ClinicianProfile";
import AdminProfile from "./pages/admin/AdminProfile";
import PatientSettings from "./pages/patient/PatientSettings";
import ClinicianSettings from "./pages/clinician/ClinicianSettings";
import AdminSettings from "./pages/admin/AdminSettings";
import SystemSettings from "./pages/admin/SystemSettings";
import PatientChat from "./pages/patient/PatientChat";
import PatientMoodInsights from "./pages/patient/PatientMoodInsights";
import PatientTasks from "./pages/patient/PatientTasks";
import PatientGoals from "./pages/patient/PatientGoals";
import PatientSessions from "./pages/patient/PatientSessions";
import ClinicianPatients from "./pages/clinician/ClinicianPatients";
import ClinicianSessions from "./pages/clinician/ClinicianSessions";
import ClinicianCommunications from "./pages/clinician/ClinicianCommunications";
import ClinicianAnalytics from "./pages/clinician/ClinicianAnalytics";
import ClinicianTasks from "./pages/clinician/ClinicianTasks";
import ClinicianReports from "./pages/clinician/ClinicianReports";
import ClinicianTrainAI from "./pages/clinician/ClinicianTrainAI";
import ClinicianResourceLibrary from "./pages/clinician/ClinicianResourceLibrary";
import ClinicianReminders from "./pages/clinician/ClinicianReminders";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <EnhancedSecurityProvider>
                <LanguageProvider>
                  <TooltipProvider>
                    <div className="min-h-screen bg-background font-sans antialiased">
                      <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/sign-in" element={<SignIn />} />
                        <Route path="/sign-up" element={<SignUp />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />

                        {/* Patient Routes */}
                        <Route path="/patient/dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
                        <Route path="/patient/chat" element={<ProtectedRoute><PatientChat /></ProtectedRoute>} />
                        <Route path="/patient/mood-insights" element={<ProtectedRoute><PatientMoodInsights /></ProtectedRoute>} />
                        <Route path="/patient/tasks" element={<ProtectedRoute><PatientTasks /></ProtectedRoute>} />
                        <Route path="/patient/goals" element={<ProtectedRoute><PatientGoals /></ProtectedRoute>} />
                        <Route path="/patient/sessions" element={<ProtectedRoute><PatientSessions /></ProtectedRoute>} />
                        <Route path="/patient/profile" element={<ProtectedRoute><PatientProfile /></ProtectedRoute>} />
                        <Route path="/patient/settings" element={<ProtectedRoute><PatientSettings /></ProtectedRoute>} />

                        {/* Clinician Routes */}
                        <Route path="/clinician/dashboard" element={<ProtectedRoute><ClinicianDashboard /></ProtectedRoute>} />
                        <Route path="/clinician/patients" element={<ProtectedRoute><ClinicianPatients /></ProtectedRoute>} />
                        <Route path="/clinician/sessions" element={<ProtectedRoute><ClinicianSessions /></ProtectedRoute>} />
                        <Route path="/clinician/communications" element={<ProtectedRoute><ClinicianCommunications /></ProtectedRoute>} />
                        <Route path="/clinician/analytics" element={<ProtectedRoute><ClinicianAnalytics /></ProtectedRoute>} />
                        <Route path="/clinician/tasks" element={<ProtectedRoute><ClinicianTasks /></ProtectedRoute>} />
                        <Route path="/clinician/reports" element={<ProtectedRoute><ClinicianReports /></ProtectedRoute>} />
                        <Route path="/clinician/train-ai" element={<ProtectedRoute><ClinicianTrainAI /></ProtectedRoute>} />
                        <Route path="/clinician/resource-library" element={<ProtectedRoute><ClinicianResourceLibrary /></ProtectedRoute>} />
                        <Route path="/clinician/reminders" element={<ProtectedRoute><ClinicianReminders /></ProtectedRoute>} />
                        <Route path="/clinician/profile" element={<ProtectedRoute><ClinicianProfile /></ProtectedRoute>} />
                        <Route path="/clinician/settings" element={<ProtectedRoute><ClinicianSettings /></ProtectedRoute>} />

                        {/* Admin Routes */}
                        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                        <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
                        <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
                        <Route path="/admin/system-settings" element={<ProtectedRoute><SystemSettings /></ProtectedRoute>} />
                      </Routes>
                    </div>
                    <Toaster />
                  </TooltipProvider>
                </LanguageProvider>
              </EnhancedSecurityProvider>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
