import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DemoModal } from './DemoModal';
export function HeroSection() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  return <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4">
      <div className="container mx-auto flex flex-col md:flex-row gap-8 md:gap-16 items-center">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            Transform Mental Healthcare with <span className="text-mood-purple">AI-Powered Support</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            MoodMate revolutionizes therapy by combining professional care with AI assistance, 
            providing continuous support and insights for better mental health outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/signup/patient" className="px-6 py-3 bg-mood-purple hover:bg-mood-purple/90 text-white font-medium rounded-full text-center">
              Start Your Journey
            </Link>
            <Link to="/signup/clinician" className="px-6 py-3 bg-white border border-mood-purple text-mood-purple hover:bg-mood-purple/10 font-medium rounded-full text-center">
              Join as Clinician
            </Link>
            <button onClick={() => setIsDemoModalOpen(true)} className="px-6 py-3 bg-mood-neutral-light text-mood-purple hover:bg-mood-purple/10 font-medium rounded-full text-center border border-mood-purple/30">
              Try Demo
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center">
          <div className="relative">
            
            
            <img alt="MoodMate Platform" className="relative z-10 rounded-2xl shadow-lg w-full max-w-lg" src="/lovable-uploads/f49385ce-797f-420f-913f-d89d2b9b664a.jpg" />
          </div>
        </div>
      </div>
      
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </section>;
}