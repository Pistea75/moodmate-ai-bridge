
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import ClinicianDashboard from "./pages/clinician/ClinicianDashboard";
import Patients from "./pages/clinician/Patients";
import TrainAI from "./pages/clinician/TrainAI";
import Tasks from "./pages/clinician/Tasks";
import Sessions from "./pages/clinician/Sessions";
import Reports from "./pages/clinician/Reports";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster"
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientChat from "./pages/patient/PatientChat";
import PatientTasks from "./pages/patient/PatientTasks";
import PatientSessions from "./pages/patient/PatientSessions";

import PatientProfile from "./pages/patient/PatientProfile";
import PatientGoals from './pages/patient/Goals';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />

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

              {/* Default Route */}
              <Route path="/" element={
                <ProtectedRoute>
                  <PatientDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default App;
