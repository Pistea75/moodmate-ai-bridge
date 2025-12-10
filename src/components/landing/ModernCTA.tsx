
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Users, Clock } from 'lucide-react';

export function ModernCTA() {
  return (
    <section className="py-24 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-6 py-2 text-white font-semibold mb-8">
            <Sparkles className="h-4 w-4" />
            Ready to transform your mental health?
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white leading-tight">
            Join the mental health
            <br />
            revolution today
          </h2>

          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            Don't wait another day to prioritize your mental wellbeing. 
            Start your journey with MoodMate and experience the future of mental healthcare.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link to="/signup/patient">
              <Button size="lg" className="group bg-white text-purple-600 hover:bg-slate-100 font-bold px-10 py-6 rounded-full text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                Start Free Trial
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/signup/clinician">
              <Button 
                variant="outline" 
                size="lg" 
                className="group border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold px-10 py-6 rounded-full text-xl transition-all duration-300 transform hover:scale-105"
              >
                For Clinicians
                <Users className="ml-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-white">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="font-medium">No credit card required</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Setup in 2 minutes</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="font-medium">Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
