
import { PublicNav } from '@/components/PublicNav';
import { ModernFooter } from '@/components/landing/ModernFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Eye, Database, Users, FileText, Sparkles } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-900">
      <PublicNav />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 text-white font-semibold mb-8">
            <Shield className="h-4 w-4" />
            Privacy & Security
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Your privacy is our
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              top priority
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We understand the sensitive nature of mental health data. That's why we've built 
            MoodMate with privacy-first principles and industry-leading security measures.
          </p>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-24 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-white">Our Privacy Principles</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              These core principles guide everything we do with your personal and health information.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 bg-slate-700/50 backdrop-blur-md border border-slate-600/50 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Data Protection</h3>
                <p className="text-slate-300">Your data is encrypted end-to-end and stored on HIPAA-compliant servers with multiple layers of security.</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-slate-700/50 backdrop-blur-md border border-slate-600/50 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Transparency</h3>
                <p className="text-slate-300">We're completely transparent about what data we collect, how we use it, and who has access to it.</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-slate-700/50 backdrop-blur-md border border-slate-600/50 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">User Control</h3>
                <p className="text-slate-300">You have complete control over your data - view, edit, export, or delete it anytime you want.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Policy Details */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-white">Privacy Policy</h2>
              <p className="text-xl text-slate-300">Last updated: January 2024</p>
            </div>

            <div className="space-y-12">
              <Card className="border-0 bg-slate-800/50 backdrop-blur-md border border-slate-600/50">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Database className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-white">Information We Collect</h3>
                      <div className="space-y-4 text-slate-300">
                        <p>
                          We collect information you provide directly to us, such as when you create an account, 
                          use our services, or communicate with us. This includes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Account information (name, email, password)</li>
                          <li>Health and wellness data you choose to share</li>
                          <li>Communication data from your interactions with our AI and therapists</li>
                          <li>Usage data to improve our services</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-slate-800/50 backdrop-blur-md border border-slate-600/50">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-white">How We Use Your Information</h3>
                      <div className="space-y-4 text-slate-300">
                        <p>
                          We use your information solely to provide and improve our mental health services:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Provide personalized AI support and insights</li>
                          <li>Connect you with qualified mental health professionals</li>
                          <li>Track your progress and wellness journey</li>
                          <li>Ensure the safety and security of our platform</li>
                          <li>Comply with legal and regulatory requirements</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-slate-800/50 backdrop-blur-md border border-slate-600/50">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-white">Information Sharing</h3>
                      <div className="space-y-4 text-slate-300">
                        <p>
                          We do not sell, trade, or otherwise transfer your personal information to third parties. 
                          We only share information in these limited circumstances:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>With your assigned mental health professionals (with your consent)</li>
                          <li>When required by law or to protect safety</li>
                          <li>With service providers who help us operate our platform (under strict agreements)</li>
                          <li>In aggregated, anonymized form for research purposes</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-slate-800/50 backdrop-blur-md border border-slate-600/50">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-white">Your Rights</h3>
                      <div className="space-y-4 text-slate-300">
                        <p>
                          You have complete control over your personal information:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Access and review all data we have about you</li>
                          <li>Correct or update your information at any time</li>
                          <li>Export your data in a standard format</li>
                          <li>Delete your account and all associated data</li>
                          <li>Opt out of non-essential communications</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-16 p-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4 text-white">Questions About Privacy?</h3>
                <p className="text-slate-300 mb-6">
                  Our privacy team is here to help you understand how we protect your information.
                </p>
                <a 
                  href="mailto:privacy@moodmate.com" 
                  className="inline-flex items-center gap-2 bg-white text-purple-600 font-semibold px-6 py-3 rounded-full hover:bg-slate-100 transition-colors"
                >
                  Contact Privacy Team
                  <FileText className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
}
