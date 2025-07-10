
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MainNav } from '@/components/MainNav';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/providers/ThemeProvider';
import './App.css';

// Import pages
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import SignupPatient from '@/pages/SignupPatient';
import SignupClinician from '@/pages/SignupClinician';
import Index from '@/pages/Index';
import Features from '@/pages/Features';
import Pricing from '@/pages/Pricing';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import FAQ from '@/pages/FAQ';
import HelpCenter from '@/pages/HelpCenter';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Security from '@/pages/Security';
import NotFound from '@/pages/NotFound';

// Patient pages
import PatientDashboard from '@/pages/patient/PatientDashboard';
import PatientChat from '@/pages/patient/PatientChat';
import PatientTasks from '@/pages/patient/PatientTasks';
import PatientSessions from '@/pages/patient/PatientSessions';
import PatientInsights from '@/pages/patient/PatientInsights';
import PatientSettings from '@/pages/patient/PatientSettings';
import PatientProfile from '@/pages/patient/PatientProfile';

// Clinician pages
import ClinicianDashboard from '@/pages/clinician/ClinicianDashboard';
import ClinicianProfile from '@/pages/clinician/ClinicianProfile';
import Patients from '@/pages/clinician/Patients';
import PatientDetail from '@/pages/clinician/PatientDetail';
import Sessions from '@/pages/clinician/Sessions';
import Tasks from '@/pages/clinician/Tasks';
import Analytics from '@/pages/clinician/Analytics';
import RiskManagement from '@/pages/clinician/RiskManagement';
import Reports from '@/pages/clinician/Reports';
import TrainAI from '@/pages/clinician/TrainAI';
import ClinicianSettings from '@/pages/clinician/ClinicianSettings';
import Communications from '@/pages/clinician/Communications';
import Reminders from '@/pages/clinician/Reminders';
import TreatmentPlans from '@/pages/clinician/TreatmentPlans';
import ResourceLibrary from '@/pages/clinician/ResourceLibrary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <MainNav />
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/landing" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup/patient" element={<SignupPatient />} />
                  <Route path="/signup/clinician" element={<SignupClinician />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/help" element={<HelpCenter />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/security" element={<Security />} />

                  {/* Patient routes */}
                  <Route path="/patient/dashboard" element={
                    <ProtectedRoute requiredRole="patient">
                      <PatientDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/patient/chat" element={
                    <ProtectedRoute requiredRole="patient">
                      <PatientChat />
                    </ProtectedRoute>
                  } />
                  <Route path="/patient/tasks" element={
                    <ProtectedRoute requiredRole="patient">
                      <PatientTasks />
                    </ProtectedRoute>
                  } />
                  <Route path="/patient/sessions" element={
                    <ProtectedRoute requiredRole="patient">
                      <PatientSessions />
                    </ProtectedRoute>
                  } />
                  <Route path="/patient/insights" element={
                    <ProtectedRoute requiredRole="patient">
                      <PatientInsights />
                    </ProtectedRoute>
                  } />
                  <Route path="/patient/settings" element={
                    <ProtectedRoute requiredRole="patient">
                      <PatientSettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/patient/profile" element={
                    <ProtectedRoute requiredRole="patient">
                      <PatientProfile />
                    </ProtectedRoute>
                  } />

                  {/* Clinician routes */}
                  <Route path="/clinician/dashboard" element={
                    <ProtectedRoute requiredRole="clinician">
                      <ClinicianDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/clinician/profile" element={
                    <ProtectedRoute requiredRole="clinician">
                      <ClinicianProfile />
                    </ProtectedRoute>
                  } />
                  <Route path="/clinician/patients" element={
                    <ProtectedRoute requiredRole="clinician">
                      <Patients />
                    </ProtectedRoute>
                  } />
                  <Route path="/clinician/patients/:patientId" element={
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
                  <Route path="/clinician/settings" element={
                    <ProtectedRoute requiredRole="clinician">
                      <ClinicianSettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/clinician/communications" element={
                    <ProtectedRoute requiredRole="clinician">
                      <Communications />
                    </ProtectedRoute>
                  } />
                  <Route path="/clinician/reminders" element={
                    <ProtectedRoute requiredRole="clinician">
                      <Reminders />
                    </ProtectedRoute>
                  } />
                  <Route path="/clinician/treatment-plans" element={
                    <ProtectedRoute requiredRole="clinician">
                      <TreatmentPlans />
                    </ProtectedRoute>
                  } />
                  <Route path="/clinician/resources" element={
                    <ProtectedRoute requiredRole="clinician">
                      <ResourceLibrary />
                    </ProtectedRoute>
                  } />

                  {/* Catch all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </div>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
