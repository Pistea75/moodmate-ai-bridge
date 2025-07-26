
import { PublicNav } from '@/components/PublicNav';
import { ModernFooter } from '@/components/landing/ModernFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  BookOpen, 
  MessageCircle, 
  Settings, 
  Shield, 
  Smartphone, 
  Users,
  HelpCircle,
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react';

const categories = [
  {
    icon: BookOpen,
    title: "Getting Started",
    description: "Everything you need to begin your mental health journey",
    articles: [
      "Creating your account",
      "Setting up your profile", 
      "Understanding the dashboard",
      "Your first AI conversation",
      "Connecting with therapists"
    ],
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: MessageCircle,
    title: "Using the AI Companion",
    description: "Learn how to get the most from your AI mental health companion",
    articles: [
      "Starting conversations",
      "Mood tracking features",
      "Understanding AI responses",
      "Privacy in AI chats",
      "Crisis support activation"
    ],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Settings,
    title: "Account & Settings",
    description: "Manage your account, preferences, and subscription",
    articles: [
      "Profile customization",
      "Privacy settings",
      "Notification preferences",
      "Subscription management",
      "Account deletion"
    ],
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "Understanding how we protect your sensitive information",
    articles: [
      "Data encryption",
      "HIPAA compliance",
      "Privacy controls",
      "Data export options",
      "Security best practices"
    ],
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Smartphone,
    title: "Mobile App",
    description: "Get help with the MoodMate mobile application",
    articles: [
      "Download and install",
      "Mobile-specific features",
      "Sync between devices",
      "Push notifications",
      "Offline capabilities"
    ],
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: Users,
    title: "For Therapists",
    description: "Resources for mental health professionals using MoodMate",
    articles: [
      "Clinician dashboard",
      "Patient management",
      "Session scheduling",
      "Progress monitoring",
      "Integration tools"
    ],
    color: "from-pink-500 to-rose-500"
  }
];

const popularArticles = [
  "How to track your mood effectively",
  "Understanding your mental health data",
  "What to do in a crisis",
  "Connecting with the right therapist",
  "Managing privacy settings"
];

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-slate-900">
      <PublicNav />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 text-white font-semibold mb-8">
            <HelpCircle className="h-4 w-4" />
            Help Center
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            How can we
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              help you?
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Find answers to your questions, learn how to use MoodMate effectively, 
            and get the support you need for your mental health journey.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input 
                className="pl-12 pr-4 py-4 text-lg bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-slate-300" 
                placeholder="Search for articles, guides, or topics..."
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">Popular Articles</h2>
            <p className="text-slate-300">Quick answers to the most common questions</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-3">
              {popularArticles.map((article, index) => (
                <Card key={index} className="border-0 bg-slate-700/50 backdrop-blur-md border border-slate-600/50 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-200 font-medium">{article}</span>
                      <ArrowRight className="h-5 w-5 text-slate-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-white">Browse Help Topics</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Find detailed guides and tutorials organized by topic to help you make the most of MoodMate.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {categories.map((category, index) => (
              <Card key={index} className="group border-0 bg-slate-800/50 backdrop-blur-md border border-slate-600/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{category.title}</h3>
                  <p className="text-slate-300 mb-6 leading-relaxed">{category.description}</p>
                  <ul className="space-y-3">
                    {category.articles.map((article, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-slate-300 hover:text-purple-400 transition-colors cursor-pointer">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                        <span>{article}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="ghost" className="w-full mt-6 text-purple-400 hover:bg-purple-500/10">
                    View All Articles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-24 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-white">Still Need Help?</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you every step of the way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 bg-slate-700/50 backdrop-blur-md border border-slate-600/50 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Email Support</h3>
                <p className="text-slate-300 mb-6">
                  Send us a detailed message and we'll get back to you within 24 hours with a comprehensive answer.
                </p>
                <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full">
                  Contact via Email
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 bg-slate-700/50 backdrop-blur-md border border-slate-600/50 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Live Support</h3>
                <p className="text-slate-300 mb-6">
                  Talk directly to our support team for immediate assistance with urgent questions or issues.
                </p>
                <Button className="bg-green-600 text-white hover:bg-green-700 w-full">
                  Call Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
}
