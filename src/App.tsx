
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignupPatient from "./pages/SignupPatient";
import SignupClinician from "./pages/SignupClinician";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientChat from "./pages/patient/PatientChat";
import PatientMoodInsights from "./pages/patient/PatientMoodInsights";
import PatientTasks from "./pages/patient/PatientTasks";
import Goals from "./pages/patient/Goals";
import PatientSessions from "./pages/patient/PatientSessions";
import PatientInsights from "./pages/patient/PatientInsights";
import PatientSettings from "./pages/patient/PatientSettings";
import PatientProfile from "./pages/patient/PatientProfile";
import PatientMessages from "./pages/patient/PatientMessages";
import ClinicianDashboard from "./pages/clinician/ClinicianDashboard";
import Patients from "./pages/clinician/Patients";
import Sessions from "./pages/clinician/Sessions";
import Tasks from "./pages/clinician/Tasks";
import Reports from "./pages/clinician/Reports";
import TrainAI from "./pages/clinician/TrainAI";
import Analytics from "./pages/clinician/Analytics";
import ClinicianSettings from "./pages/clinician/ClinicianSettings";
import ClinicianCommunications from "./pages/clinician/ClinicianCommunications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <LanguageProvider>
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
                <Route path="/patient/goals" element={<Goals />} />
                <Route path="/patient/sessions" element={<PatientSessions />} />
                <Route path="/patient/insights" element={<PatientInsights />} />
                <Route path="/patient/settings" element={<PatientSettings />} />
                <Route path="/patient/profile" element={<PatientProfile />} />
                
                {/* Clinician Routes */}
                <Route path="/clinician/dashboard" element={<ClinicianDashboard />} />
                <Route path="/clinician/patients" element={<Patients />} />
                <Route path="/clinician/sessions" element={<Sessions />} />
                <Route path="/clinician/tasks" element={<Tasks />} />
                <Route path="/clinician/reports" element={<Reports />} />
                <Route path="/clinician/train-ai" element={<TrainAI />} />
                <Route path="/clinician/analytics" element={<Analytics />} />
                <Route path="/clinician/settings" element={<ClinicianSettings />} />
                <Route path="/clinician/communications" element={<ClinicianCommunications />} />
              </Routes>
            </LanguageProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
