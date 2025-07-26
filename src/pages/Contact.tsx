
import { PublicNav } from '@/components/PublicNav';
import { ModernFooter } from '@/components/landing/ModernFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Headphones,
  Send,
  Sparkles
} from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-900">
      <PublicNav />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 text-white font-semibold mb-8">
            <MessageCircle className="h-4 w-4" />
            Get in Touch
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            We're here to
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              support you
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Have questions about MoodMate? Need help getting started? Our team is ready to assist you 
            on your mental health journey.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-24 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-white">Get In Touch</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Choose the best way to reach us. We're committed to responding quickly and thoroughly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <Card className="text-center border-0 bg-slate-700/50 backdrop-blur-md border border-slate-600/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Email Support</h3>
                <p className="text-slate-300 mb-4">Send us a detailed message and we'll get back to you within 24 hours.</p>
                <a href="mailto:support@moodmate.com" className="text-purple-400 font-semibold hover:underline">
                  support@moodmate.com
                </a>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-slate-700/50 backdrop-blur-md border border-slate-600/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Phone Support</h3>
                <p className="text-slate-300 mb-4">Call us for immediate assistance with urgent questions or technical issues.</p>
                <a href="tel:+1-800-MOODMATE" className="text-purple-400 font-semibold hover:underline">
                  1-800-MOODMATE
                </a>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-slate-700/50 backdrop-blur-md border border-slate-600/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Headphones className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Live Chat</h3>
                <p className="text-slate-300 mb-4">Start a real-time conversation with our support team during business hours.</p>
                <Button className="bg-purple-600 text-white hover:bg-purple-700">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 bg-slate-700/50 backdrop-blur-md border border-slate-600/50 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-white text-center">Send Us a Message</h3>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                      <Input placeholder="Enter your first name" className="w-full bg-slate-600/50 border-slate-500 text-white placeholder:text-slate-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                      <Input placeholder="Enter your last name" className="w-full bg-slate-600/50 border-slate-500 text-white placeholder:text-slate-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <Input type="email" placeholder="Enter your email address" className="w-full bg-slate-600/50 border-slate-500 text-white placeholder:text-slate-400" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                    <Input placeholder="What can we help you with?" className="w-full bg-slate-600/50 border-slate-500 text-white placeholder:text-slate-400" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                    <Textarea 
                      placeholder="Tell us more about your question or how we can help..."
                      className="w-full h-32 bg-slate-600/50 border-slate-500 text-white placeholder:text-slate-400"
                    />
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 py-3 font-semibold rounded-lg">
                    Send Message
                    <Send className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="text-center border-0 bg-slate-800/50 backdrop-blur-md border border-slate-600/50 shadow-lg">
              <CardContent className="p-6">
                <MapPin className="h-8 w-8 text-purple-400 mx-auto mb-4" />
                <h4 className="font-bold text-white mb-2">Address</h4>
                <p className="text-slate-300 text-sm">
                  123 Mental Health Blvd<br />
                  San Francisco, CA 94102
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-slate-800/50 backdrop-blur-md border border-slate-600/50 shadow-lg">
              <CardContent className="p-6">
                <Clock className="h-8 w-8 text-purple-400 mx-auto mb-4" />
                <h4 className="font-bold text-white mb-2">Business Hours</h4>
                <p className="text-slate-300 text-sm">
                  Monday - Friday<br />
                  9:00 AM - 6:00 PM PST
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-slate-800/50 backdrop-blur-md border border-slate-600/50 shadow-lg">
              <CardContent className="p-6">
                <Phone className="h-8 w-8 text-purple-400 mx-auto mb-4" />
                <h4 className="font-bold text-white mb-2">Crisis Support</h4>
                <p className="text-slate-300 text-sm">
                  24/7 Emergency Line<br />
                  1-800-CRISIS-1
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-slate-800/50 backdrop-blur-md border border-slate-600/50 shadow-lg">
              <CardContent className="p-6">
                <Mail className="h-8 w-8 text-purple-400 mx-auto mb-4" />
                <h4 className="font-bold text-white mb-2">General Info</h4>
                <p className="text-slate-300 text-sm">
                  info@moodmate.com<br />
                  Response within 24hrs
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
}
