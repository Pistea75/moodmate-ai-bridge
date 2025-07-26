
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "Clinical Psychologist",
    avatar: "SC",
    content: "MoodMate has transformed my practice. The AI insights help me understand my patients' patterns between sessions, leading to more effective treatment plans.",
    rating: 5,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    name: "Marcus Rodriguez",
    role: "Patient",
    avatar: "MR",
    content: "Having 24/7 support has been life-changing. The AI companion feels like having a therapist in my pocket, available whenever I need guidance.",
    rating: 5,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    name: "Dr. Emily Watson",
    role: "Psychiatrist",
    avatar: "EW",
    content: "The real-time mood tracking and analytics give me unprecedented insight into my patients' mental health patterns. It's revolutionizing how we provide care.",
    rating: 5,
    gradient: "from-green-500 to-emerald-500"
  },
  {
    name: "Lisa Thompson",
    role: "Patient",
    avatar: "LT",
    content: "The platform helped me identify triggers I never noticed before. My therapist and I can now work together more effectively on my treatment plan.",
    rating: 5,
    gradient: "from-orange-500 to-red-500"
  },
  {
    name: "Dr. James Kim",
    role: "Mental Health Director",
    avatar: "JK",
    content: "We've seen a 40% improvement in patient engagement since implementing MoodMate. The technology truly enhances the therapeutic relationship.",
    rating: 5,
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    name: "Rachel Green",
    role: "Patient",
    avatar: "RG",
    content: "The crisis support feature literally saved my life. Having immediate access to help during my darkest moment made all the difference.",
    rating: 5,
    gradient: "from-pink-500 to-rose-500"
  }
];

export function ModernTestimonials() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Trusted by thousands of
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              patients & professionals
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            See how MoodMate is transforming mental healthcare for both patients and clinicians
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-500 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg mr-4`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-slate-300">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <div className="relative">
                  <Quote className="h-6 w-6 text-purple-400 mb-3" />
                  <p className="text-slate-200 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">98%</div>
            <p className="text-slate-400">Satisfaction Rate</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">50K+</div>
            <p className="text-slate-400">Active Users</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">1M+</div>
            <p className="text-slate-400">AI Conversations</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">24/7</div>
            <p className="text-slate-400">Support Available</p>
          </div>
        </div>
      </div>
    </section>
  );
}
