import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './components/ThemeToggle';
import { ErrorBoundary } from './components/ErrorBoundary';
import PublicHomePage from './pages/PublicHomePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ClinicianDashboard from './pages/clinician/ClinicianDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ClinicianLayout from './layouts/ClinicianLayout';
import PatientLayout from './layouts/PatientLayout';
import UserProfilePage from './pages/UserProfilePage';
import SessionNotesPage from './pages/clinician/SessionNotesPage';
import PatientManagementPage from './pages/clinician/PatientManagementPage';
import MoodLogsPage from './pages/patient/MoodLogsPage';
import AIChatPage from './pages/patient/AIChatPage';
import ReportsPage from './pages/clinician/ReportsPage';
import CreateUser from './pages/admin/CreateUser';
import EditUser from './pages/admin/EditUser';
import UserManagement from './pages/admin/UserManagement';
import SystemOverview from './pages/admin/SystemOverview';
import SystemSettings from './pages/admin/SystemSettings';
import DatabaseManagement from './pages/admin/DatabaseManagement';
import SecurityLogs from './pages/admin/SecurityLogs';
import SystemHealth from './pages/admin/SystemHealth';
import AuditTrail from './pages/admin/AuditTrail';
import RiskManagement from './pages/admin/RiskManagement';
import SystemMaintenance from './pages/admin/SystemMaintenance';
import SuperAdminPanel from './pages/admin/SuperAdminPanel';

function App() {
  return (
    <BrowserRouter>
      <QueryClient>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
              <div className="flex flex-col min-h-screen">
                <ErrorBoundary>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<PublicHomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegistrationPage />} />
                    
                    {/* User Profile */}
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <ClinicianLayout>
                          <UserProfilePage />
                        </ClinicianLayout>
                      </ProtectedRoute>
                    } />

                    {/* Clinician Routes */}
                    <Route path="/clinician/dashboard" element={
                      <ProtectedRoute>
                        <ClinicianLayout>
                          <ClinicianDashboard />
                        </ClinicianLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/clinician/patient-management" element={
                      <ProtectedRoute>
                        <ClinicianLayout>
                          <PatientManagementPage />
                        </ClinicianLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/clinician/session-notes/:patientId" element={
                      <ProtectedRoute>
                        <ClinicianLayout>
                          <SessionNotesPage />
                        </ClinicianLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/clinician/reports" element={
                      <ProtectedRoute>
                        <ClinicianLayout>
                          <ReportsPage />
                        </ClinicianLayout>
                      </ProtectedRoute>
                    } />

                    {/* Patient Routes */}
                    <Route path="/patient/dashboard" element={
                      <ProtectedRoute>
                        <PatientLayout>
                          <PatientDashboard />
                        </PatientLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/patient/mood-logs" element={
                      <ProtectedRoute>
                        <PatientLayout>
                          <MoodLogsPage />
                        </PatientLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/patient/ai-chat" element={
                      <ProtectedRoute>
                        <PatientLayout>
                          <AIChatPage />
                        </PatientLayout>
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/create-user" element={
                      <ProtectedRoute>
                        <ClinicianLayout>
                          <CreateUser />
                        </ClinicianLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/user/:userId" element={
                      <ProtectedRoute>
                        <ClinicianLayout>
                          <EditUser />
                        </ClinicianLayout>
                      </ProtectedRoute>
                    } />
                    
                    {/* Super Admin Routes */}
                    <Route path="/admin/super-admin-dashboard" element={
                      <ProtectedRoute>
                        <ClinicianLayout>
                          <SystemOverview />
                        </ClinicianLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/user-management" element={
                      <ProtectedRoute>
                        <ClinicianLayout>
                          <UserManagement />
                        </ClinicianLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/super-admin-panel" element={
                      <ProtectedRoute>
                        <ClinicianLayout>
                          <SuperAdminPanel />
                        </ClinicianLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/system-settings" element={
                      <ProtectedRoute>
                        <ClinicianLayout>
                          <SystemSettings />
                        </ClinicianLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/database" element={
                      <ProtectedRoute>
                        <ClinicianLayout>
                          <DatabaseManagement />
                        </ClinicianLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/security-logs" element={
                      <ProtectedRoute>
                        <ClinicianLayout>
                          <SecurityLogs />
                        </ClinicianLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/system-health" element={
                      <ProtectedRoute>
                        <ClinicianLayout>
                          <SystemHealth />
                        </ClinicianLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/audit-trail" element={
                      <ProtectedRoute>
                        <ClinicianLayout>
                          <AuditTrail />
                        </ClinicianLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/risk-management" element={
                      <ProtectedRoute>
                        <ClinicianLayout>
                          <RiskManagement />
                        </ClinicianLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/maintenance" element={
                      <ProtectedRoute>
                        <ClinicianLayout>
                          <SystemMaintenance />
                        </ClinicianLayout>
                      </ProtectedRoute>
                    } />
                  </Routes>
                </ErrorBoundary>
              </div>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </QueryClient>
    </BrowserRouter>
  );
}

export default App;
