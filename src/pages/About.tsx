import { PublicNav } from '../components/PublicNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Users, Target, Award, Heart, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-primary/5">
      <PublicNav />
      
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Brain className="w-4 h-4 mr-2" />
            About MoodMate
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Transforming Mental Healthcare Through AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're building the future of mental health support by combining cutting-edge AI technology 
            with compassionate human care to create better outcomes for patients and clinicians.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Mental health challenges affect millions of people worldwide, yet access to quality care remains limited. 
              We believe that everyone deserves compassionate, personalized mental health support that's available 
              when they need it most.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              MoodMate bridges the gap between patients and clinicians by providing AI-powered insights, 
              24/7 support, and data-driven treatment recommendations that enhance the therapeutic relationship 
              and improve outcomes.
            </p>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-8 backdrop-blur-sm">
              <div className="text-center">
                <Heart className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Compassionate Care</h3>
                <p className="text-muted-foreground">
                  Our AI is trained to provide empathetic, understanding responses that complement human therapeutic approaches.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t py-8 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-sm text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} MoodMate. All rights reserved.
        </div>
      </footer>
    </div>
  );
}