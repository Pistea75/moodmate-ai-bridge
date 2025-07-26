
import { PublicNav } from '@/components/PublicNav';
import { ModernFooter } from '@/components/landing/ModernFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 text-white font-semibold mb-8">
            <Shield className="h-4 w-4" />
            Privacy & Security
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Your privacy is
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              our priority
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We take your mental health data seriously. Learn how we protect your information 
            and respect your privacy every step of the way.
          </p>
        </div>
      </section>

      {/* Privacy Overview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-slate-900">Privacy at a Glance</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Understanding how we collect, use, and protect your data is important to us. 
              Here's what you need to know.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">End-to-End Encryption</h3>
                <p className="text-slate-600">All your conversations and data are encrypted using military-grade security protocols.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">HIPAA Compliant</h3>
                <p className="text-slate-600">We meet and exceed healthcare privacy standards to protect your sensitive information.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">Your Control</h3>
                <p className="text-slate-600">You decide what data to share and can delete your information at any time.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Privacy Policy */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-slate-900">Privacy Policy Details</h2>
            
            <div className="space-y-12">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Database className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-slate-900">Data Collection</h3>
                      <p className="text-slate-600 mb-4 leading-relaxed">
                        We collect only the information necessary to provide our services, including personal 
                        information you provide and data generated through your use of the platform. This includes:
                      </p>
                      <ul className="space-y-2 text-slate-600">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Account information (name, email, password)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Health information you choose to share
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Interaction data with our platform
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Device and usage information
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-slate-900">Data Protection</h3>
                      <p className="text-slate-600 mb-4 leading-relaxed">
                        All data is encrypted and stored securely. We follow HIPAA guidelines and implement 
                        industry-standard security measures to protect your information. Our security measures include:
                      </p>
                      <ul className="space-y-2 text-slate-600">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          End-to-end encryption for sensitive data
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Regular security audits and penetration testing
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Access controls and authentication protocols
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Continuous monitoring for unauthorized access
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <UserCheck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-slate-900">Your Rights</h3>
                      <p className="text-slate-600 mb-4 leading-relaxed">
                        You have the right to access, modify, or delete your personal information at any time 
                        through your account settings. Additionally, you can:
                      </p>
                      <ul className="space-y-2 text-slate-600">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Request a copy of all your data
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Opt out of certain data collection practices
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Request complete deletion of your account and associated data
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Lodge a complaint with relevant data protection authorities
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-slate-900">Cookies and Tracking</h3>
                      <p className="text-slate-600 leading-relaxed">
                        We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
                        and personalize content. You can manage cookie preferences through your browser settings at any time. 
                        We use essential cookies for security and functionality, and optional cookies for analytics and personalization.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-slate-900">Updates to This Policy</h3>
                      <p className="text-slate-600 leading-relaxed">
                        We may update this privacy policy periodically to reflect changes in our practices or for legal, 
                        operational, or regulatory reasons. We will notify you of significant changes through the platform 
                        or via email. Continued use of our services after updates indicates acceptance of the revised policy.
                      </p>
                      <div className="mt-6 p-4 bg-slate-100 rounded-lg">
                        <p className="text-slate-700 font-medium">
                          Last updated: {new Date().toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
}
