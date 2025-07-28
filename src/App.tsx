
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './providers/ThemeProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import ClinicianLayout from './layouts/ClinicianLayout';
import PatientLayout from './layouts/PatientLayout';

// Import existing pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import ClinicianDashboard from './pages/clinician/ClinicianDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';

// Import admin pages
import SystemOverview from './pages/admin/SystemOverview';
import UserManagement from './pages/admin/UserManagement';
import SuperAdminPanel from './pages/admin/SuperAdminPanel';
import SystemSettings from './pages/admin/SystemSettings';
import DatabaseManagement from './pages/admin/DatabaseManagement';
import SecurityLogs from './pages/admin/SecurityLogs';
import SystemHealth from './pages/admin/SystemHealth';
import AuditTrail from './pages/admin/AuditTrail';
import RiskManagement from './pages/admin/RiskManagement';
import SystemMaintenance from './pages/admin/SystemMaintenance';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
              <div className="flex flex-col min-h-screen">
                <ErrorBoundary>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    
                    {/* Clinician Routes */}
                    <Route path="/clinician/dashboard" element={
                      <ProtectedRoute>
                        <ClinicianLayout>
                          <ClinicianDashboard />
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
                    
                    {/* Admin Routes */}
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
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
