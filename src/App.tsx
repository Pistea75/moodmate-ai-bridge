import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignupPatient from "./pages/SignupPatient";
import SignupClinician from "./pages/SignupClinician";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientChat from "./pages/patient/PatientChat";
import PatientMoodInsights from "./pages/patient/PatientMoodInsights";
import PatientTasks from "./pages/patient/PatientTasks";
import PatientGoals from "./pages/patient/PatientGoals";
import PatientSessions from "./pages/patient/PatientSessions";
import PatientInsights from "./pages/patient/PatientInsights";
import PatientSettings from "./pages/patient/PatientSettings";
import PatientProfile from "./pages/patient/PatientProfile";
import PatientMessages from "./pages/patient/PatientMessages";
import ClinicianDashboard from "./pages/clinician/ClinicianDashboard";
import ClinicianPatients from "./pages/clinician/ClinicianPatients";
import ClinicianSessions from "./pages/clinician/ClinicianSessions";
import ClinicianTasks from "./pages/clinician/ClinicianTasks";
import ClinicianReports from "./pages/clinician/ClinicianReports";
import ClinicianTrainAI from "./pages/clinician/ClinicianTrainAI";
import ClinicianAnalytics from "./pages/clinician/ClinicianAnalytics";
import ClinicianSettings from "./pages/clinician/ClinicianSettings";
import Communications from "./pages/clinician/Communications";
import ClinicianCommunications from "./pages/clinician/ClinicianCommunications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup/patient" element={<SignupPatient />} />
            <Route path="/signup/clinician" element={<SignupClinician />} />
            
            {/* Patient Routes */}
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/chat" element={<PatientChat />} />
            <Route path="/patient/messages" element={<PatientMessages />} />
            <Route path="/patient/mood-insights" element={<PatientMoodInsights />} />
            <Route path="/patient/tasks" element={<PatientTasks />} />
            <Route path="/patient/goals" element={<PatientGoals />} />
            <Route path="/patient/sessions" element={<PatientSessions />} />
            <Route path="/patient/insights" element={<PatientInsights />} />
            <Route path="/patient/settings" element={<PatientSettings />} />
            <Route path="/patient/profile" element={<PatientProfile />} />
            
            {/* Clinician Routes */}
            <Route path="/clinician/dashboard" element={<ClinicianDashboard />} />
            <Route path="/clinician/patients" element={<ClinicianPatients />} />
            <Route path="/clinician/sessions" element={<ClinicianSessions />} />
            <Route path="/clinician/tasks" element={<ClinicianTasks />} />
            <Route path="/clinician/reports" element={<ClinicianReports />} />
            <Route path="/clinician/train-ai" element={<ClinicianTrainAI />} />
            <Route path="/clinician/analytics" element={<ClinicianAnalytics />} />
            <Route path="/clinician/settings" element={<ClinicianSettings />} />
            <Route path="/clinician/communications" element={<Communications />} />
            <Route path="/clinician/communications" element={<ClinicianCommunications />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
