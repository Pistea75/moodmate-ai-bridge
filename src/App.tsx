
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Features from './pages/Features';
import About from './pages/About';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import HelpCenter from './pages/HelpCenter';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Security from './pages/Security';
import Login from './pages/Login';
import SignupPatient from './pages/SignupPatient';
import SignupClinician from './pages/SignupClinician';
import NotFound from './pages/NotFound';
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientChat from './pages/patient/PatientChat';
import PatientTasks from './pages/patient/PatientTasks';
import PatientSessions from './pages/patient/PatientSessions';
import PatientInsights from './pages/patient/PatientInsights';
import PatientSettings from './pages/patient/PatientSettings';
import PatientProfile from './pages/patient/PatientProfile';
import ClinicianDashboard from './pages/clinician/ClinicianDashboard';
import Patients from './pages/clinician/Patients';
import PatientDetail from './pages/clinician/PatientDetail';
import ClinicianSessions from './pages/clinician/Sessions';
import ClinicianTasks from './pages/clinician/Tasks';
import ClinicianReports from './pages/clinician/Reports';
import ClinicianSettings from './pages/clinician/ClinicianSettings';
import ClinicianProfile from './pages/clinician/ClinicianProfile';
import TrainAI from './pages/clinician/TrainAI';
import { Toaster } from './components/ui/toaster';
import TestPage from './pages/TestPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/security" element={<Security />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup/patient" element={<SignupPatient />} />
          <Route path="/signup/clinician" element={<SignupClinician />} />
          
          <Route path="/patient/dashboard" element={<ProtectedRoute requiredRole="patient"><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/chat" element={<ProtectedRoute requiredRole="patient"><PatientChat /></ProtectedRoute>} />
          <Route path="/patient/tasks" element={<ProtectedRoute requiredRole="patient"><PatientTasks /></ProtectedRoute>} />
          <Route path="/patient/sessions" element={<ProtectedRoute requiredRole="patient"><PatientSessions /></ProtectedRoute>} />
          <Route path="/patient/insights" element={<ProtectedRoute requiredRole="patient"><PatientInsights /></ProtectedRoute>} />
          <Route path="/patient/settings" element={<ProtectedRoute requiredRole="patient"><PatientSettings /></ProtectedRoute>} />
          <Route path="/patient/profile" element={<ProtectedRoute requiredRole="patient"><PatientProfile /></ProtectedRoute>} />
          
          <Route path="/clinician/dashboard" element={<ProtectedRoute requiredRole="clinician"><ClinicianDashboard /></ProtectedRoute>} />
          <Route path="/clinician/patients" element={<ProtectedRoute requiredRole="clinician"><Patients /></ProtectedRoute>} />
          <Route path="/clinician/patients/:patientId" element={<ProtectedRoute requiredRole="clinician"><PatientDetail /></ProtectedRoute>} />
          <Route path="/clinician/sessions" element={<ProtectedRoute requiredRole="clinician"><ClinicianSessions /></ProtectedRoute>} />
          <Route path="/clinician/tasks" element={<ProtectedRoute requiredRole="clinician"><ClinicianTasks /></ProtectedRoute>} />
          <Route path="/clinician/reports" element={<ProtectedRoute requiredRole="clinician"><ClinicianReports /></ProtectedRoute>} />
          <Route path="/clinician/settings" element={<ProtectedRoute requiredRole="clinician"><ClinicianSettings /></ProtectedRoute>} />
          <Route path="/clinician/profile" element={<ProtectedRoute requiredRole="clinician"><ClinicianProfile /></ProtectedRoute>} />
          <Route path="/clinician/train-ai" element={<ProtectedRoute requiredRole="clinician"><TrainAI /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
