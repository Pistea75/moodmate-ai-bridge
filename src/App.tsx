import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
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
        
        {/* Patient routes */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/chat" element={<PatientChat />} />
        <Route path="/patient/tasks" element={<PatientTasks />} />
        <Route path="/patient/sessions" element={<PatientSessions />} />
        <Route path="/patient/insights" element={<PatientInsights />} />
        <Route path="/patient/settings" element={<PatientSettings />} />
        <Route path="/patient/profile" element={<PatientProfile />} />
        
        {/* Clinician routes */}
        <Route path="/clinician/dashboard" element={<ClinicianDashboard />} />
        <Route path="/clinician/patients" element={<Patients />} />
        <Route path="/clinician/sessions" element={<ClinicianSessions />} />
        <Route path="/clinician/tasks" element={<ClinicianTasks />} />
        <Route path="/clinician/reports" element={<ClinicianReports />} />
        <Route path="/clinician/settings" element={<ClinicianSettings />} />
        <Route path="/clinician/profile" element={<ClinicianProfile />} />
        <Route path="/clinician/train-ai" element={<TrainAI />} />
        
        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
