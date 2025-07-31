import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, User, ArrowRight, Shield, Heart } from 'lucide-react';
import { PublicNav } from '@/components/PublicNav';

export default function SignupChoice() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <PublicNav />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choose Your Journey
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Select how you want to use MoodMate to get started with the right experience for you.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Patient Card */}
            <Card className="relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  I'm Seeking Support
                </CardTitle>
                <CardDescription className="text-slate-300 text-lg">
                  Start your mental health journey with AI-powered support and professional guidance
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-4">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-slate-200">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>24/7 AI companion support</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-200">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Mood tracking and insights</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-200">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Professional therapy sessions</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-200">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Personal wellness goals</span>
                  </div>
                </div>
                
                <Link to="/signup/patient" className="block">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg group/btn">
                    <span className="flex items-center justify-center gap-2">
                      Start Free Trial
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
                
                <p className="text-center text-sm text-slate-400">
                  No credit card required • 14-day free trial
                </p>
              </CardContent>
            </Card>

            {/* Clinician Card */}
            <Card className="relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  I'm a Clinician
                </CardTitle>
                <CardDescription className="text-slate-300 text-lg">
                  Enhance your practice with AI-powered insights and streamlined patient management
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-4">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-slate-200">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>AI-powered patient insights</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-200">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Session management tools</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-200">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Progress tracking & analytics</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-200">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>HIPAA-compliant platform</span>
                  </div>
                </div>
                
                <Link to="/signup/clinician" className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg group/btn">
                    <span className="flex items-center justify-center gap-2">
                      Start Professional Trial
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
                
                <p className="text-center text-sm text-slate-400">
                  30-day professional trial • Setup support included
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <p className="text-slate-400 mb-4">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                Sign in here
              </Link>
            </p>
            <p className="text-sm text-slate-500">
              By continuing, you agree to our{' '}
              <Link to="/terms" className="text-purple-400 hover:text-purple-300">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-purple-400 hover:text-purple-300">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}