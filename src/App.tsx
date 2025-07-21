
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import ClinicianDashboard from "./pages/clinician/ClinicianDashboard";
import Patients from "./pages/clinician/Patients";
import TrainAI from "./pages/clinician/TrainAI";
import Tasks from "./pages/clinician/Tasks";
import Sessions from "./pages/clinician/Sessions";
import Reports from "./pages/clinician/Reports";
import ClinicianProfile from "./pages/clinician/ClinicianProfile";
import ClinicianSettings from "./pages/clinician/ClinicianSettings";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster"
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientChat from "./pages/patient/PatientChat";
import PatientTasks from "./pages/patient/PatientTasks";
import PatientSessions from "./pages/patient/PatientSessions";
import PatientProfile from "./pages/patient/PatientProfile";
import PatientSettings from "./pages/patient/PatientSettings";
import PatientGoals from './pages/patient/Goals';
import PatientMood from './pages/patient/PatientMood';
import PatientInsights from './pages/patient/PatientInsights';
import SignupClinician from './pages/SignupClinician';
import SignupPatient from './pages/SignupPatient';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Index from './pages/Index';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import HelpCenter from './pages/HelpCenter';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Security from './pages/Security';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <ErrorBoundary>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup/clinician" element={<SignupClinician />} />
              <Route path="/signup/patient" element={<SignupPatient />} />
              <Route path="/signup" element={<SignupPatient />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Clinician Routes */}
              <Route path="/clinician/dashboard" element={
                <ProtectedRoute>
                  <ClinicianDashboard />
                </ProtectedRoute>
              } />
              <Route path="/clinician/patients" element={
                <ProtectedRoute>
                  <Patients />
                </ProtectedRoute>
              } />
              <Route path="/clinician/train-ai" element={
                <ProtectedRoute>
                  <TrainAI />
                </ProtectedRoute>
              } />
              <Route path="/clinician/tasks" element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              } />
              <Route path="/clinician/sessions" element={
                <ProtectedRoute>
                  <Sessions />
                </ProtectedRoute>
              } />
              <Route path="/clinician/reports" element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } />
              <Route path="/clinician/profile" element={
                <ProtectedRoute>
                  <ClinicianProfile />
                </ProtectedRoute>
              } />
              <Route path="/clinician/settings" element={
                <ProtectedRoute>
                  <ClinicianSettings />
                </ProtectedRoute>
              } />
              
              {/* Patient Routes */}
              <Route path="/patient/dashboard" element={
                <ProtectedRoute>
                  <PatientDashboard />
                </ProtectedRoute>
              } />
              <Route path="/patient/chat" element={
                <ProtectedRoute>
                  <PatientChat />
                </ProtectedRoute>
              } />
              <Route path="/patient/tasks" element={
                <ProtectedRoute>
                  <PatientTasks />
                </ProtectedRoute>
              } />
              <Route path="/patient/goals" element={
                <ProtectedRoute>
                  <PatientGoals />
                </ProtectedRoute>
              } />
              <Route path="/patient/sessions" element={
                <ProtectedRoute>
                  <PatientSessions />
                </ProtectedRoute>
              } />
              <Route path="/patient/profile" element={
                <ProtectedRoute>
                  <PatientProfile />
                </ProtectedRoute>
              } />
              <Route path="/patient/settings" element={
                <ProtectedRoute>
                  <PatientSettings />
                </ProtectedRoute>
              } />
              <Route path="/patient/mood" element={
                <ProtectedRoute>
                  <PatientMood />
                </ProtectedRoute>
              } />
              <Route path="/patient/insights" element={
                <ProtectedRoute>
                  <PatientInsights />
                </ProtectedRoute>
              } />

              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/security" element={<Security />} />
              
              {/* Super Admin Routes */}
              <Route path="/admin" element={<SuperAdminDashboard />} />
            </Routes>
          </div>
          </ErrorBoundary>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
