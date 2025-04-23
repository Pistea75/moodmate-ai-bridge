
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

export default function Landing() {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-88px)] flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full py-10 md:py-20 px-4">
          <div className="container mx-auto flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                Bridge the gap between <span className="text-mood-purple">therapy sessions</span>
              </h1>
              <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl">
                MoodMate uses AI to provide personalized mental health support, 
                mood tracking, and therapy management for patients and clinicians.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/signup/patient" 
                  className="px-6 py-3 bg-mood-purple hover:bg-mood-purple-secondary text-white font-medium rounded-full text-center"
                >
                  I'm a Patient
                </Link>
                <Link 
                  to="/signup/clinician" 
                  className="px-6 py-3 bg-white border border-mood-purple text-mood-purple hover:bg-mood-purple-light font-medium rounded-full text-center"
                >
                  I'm a Clinician
                </Link>
              </div>
              <div className="mt-6">
                <p className="text-sm text-muted-foreground">
                  Already have an account? <Link to="/login" className="text-mood-purple hover:underline">Log in</Link>
                </p>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-mood-purple-light rounded-full opacity-60 animate-pulse" />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-mood-purple-light rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
                <img 
                  src="https://placehold.co/600x400/E5DEFF/9b87f5?text=MoodMate" 
                  alt="MoodMate App" 
                  className="relative z-10 rounded-2xl shadow-lg w-full max-w-md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full bg-muted/30 py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How MoodMate Helps</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="h-12 w-12 flex items-center justify-center bg-mood-purple/10 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9b87f5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">AI Companion</h3>
                <p className="text-muted-foreground">
                  A personalized AI that offers daily check-ins, journaling prompts, and support between sessions.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="h-12 w-12 flex items-center justify-center bg-mood-purple/10 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9b87f5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12h20"></path>
                    <path d="M12 2v20"></path>
                    <path d="m4.93 4.93 14.14 14.14"></path>
                    <path d="m19.07 4.93-14.14 14.14"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Mood Tracking</h3>
                <p className="text-muted-foreground">
                  Track emotional patterns with intuitive visualizations that help identify triggers and progress.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="h-12 w-12 flex items-center justify-center bg-mood-purple/10 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9b87f5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Session Management</h3>
                <p className="text-muted-foreground">
                  Schedule and manage therapy sessions with secure video integration and session notes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* For Clinicians Section */}
        <section className="w-full py-16 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
              <div className="flex-1 order-2 md:order-1">
                <h2 className="text-3xl font-bold mb-4">For Clinicians</h2>
                <p className="mb-4 text-muted-foreground">
                  MoodMate provides powerful tools for clinicians to monitor patient progress, assign therapeutic tasks, and generate AI-enhanced reports.
                </p>
                <ul className="space-y-3">
                  {[
                    'Monitor patient mood patterns over time',
                    'Create and assign therapeutic tasks',
                    'Generate AI-powered session summaries',
                    'Conduct secure virtual sessions',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-mood-purple-light flex items-center justify-center text-mood-purple font-medium">
                        ✓
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link 
                    to="/signup/clinician" 
                    className="px-6 py-3 bg-mood-purple hover:bg-mood-purple-secondary text-white font-medium rounded-full inline-block"
                  >
                    Join as a Clinician
                  </Link>
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2">
                <img 
                  src="https://placehold.co/600x400/E5DEFF/9b87f5?text=Clinician+Dashboard" 
                  alt="Clinician Dashboard" 
                  className="rounded-xl shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Language Selector */}
        <section className="w-full py-8 px-4 border-t">
          <div className="container mx-auto text-center">
            <div className="inline-flex items-center">
              <span className="text-sm text-muted-foreground mr-3">Choose language:</span>
              <select className="bg-white border px-3 py-1 rounded-md text-sm">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
