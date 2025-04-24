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
import ClinicianSessions from './pages/clinician/Sessions';
import ClinicianTasks from './pages/clinician/Tasks';
import ClinicianReports from './pages/clinician/Reports';
import ClinicianSettings from './pages/clinician/ClinicianSettings';
import ClinicianProfile from './pages/clinician/ClinicianProfile';
import TrainAI from './pages/clinician/TrainAI';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
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
          
          {/* Protected patient routes */}
          <Route path="/patient/dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/chat" element={<ProtectedRoute><PatientChat /></ProtectedRoute>} />
          <Route path="/patient/tasks" element={<ProtectedRoute><PatientTasks /></ProtectedRoute>} />
          <Route path="/patient/sessions" element={<ProtectedRoute><PatientSessions /></ProtectedRoute>} />
          <Route path="/patient/insights" element={<ProtectedRoute><PatientInsights /></ProtectedRoute>} />
          <Route path="/patient/settings" element={<ProtectedRoute><PatientSettings /></ProtectedRoute>} />
          <Route path="/patient/profile" element={<ProtectedRoute><PatientProfile /></ProtectedRoute>} />
          
          {/* Protected clinician routes */}
          <Route path="/clinician/dashboard" element={<ProtectedRoute><ClinicianDashboard /></ProtectedRoute>} />
          <Route path="/clinician/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
          <Route path="/clinician/sessions" element={<ProtectedRoute><ClinicianSessions /></ProtectedRoute>} />
          <Route path="/clinician/tasks" element={<ProtectedRoute><ClinicianTasks /></ProtectedRoute>} />
          <Route path="/clinician/reports" element={<ProtectedRoute><ClinicianReports /></ProtectedRoute>} />
          <Route path="/clinician/settings" element={<ProtectedRoute><ClinicianSettings /></ProtectedRoute>} />
          <Route path="/clinician/profile" element={<ProtectedRoute><ClinicianProfile /></ProtectedRoute>} />
          <Route path="/clinician/train-ai" element={<ProtectedRoute><TrainAI /></ProtectedRoute>} />
          
          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
