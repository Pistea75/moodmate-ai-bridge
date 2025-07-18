
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, TrendingUp, Brain, Send, Smile, Frown, Meh } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const sampleMoodData = [
  { date: 'Mon', mood: 7 },
  { date: 'Tue', mood: 6 },
  { date: 'Wed', mood: 8 },
  { date: 'Thu', mood: 5 },
  { date: 'Fri', mood: 9 },
  { date: 'Sat', mood: 7 },
  { date: 'Sun', mood: 8 },
];

const sampleChatMessages = [
  { role: 'user', message: "I'm feeling anxious about my presentation tomorrow." },
  { role: 'ai', message: "I understand that presentations can feel overwhelming. Let's work through this together. What specifically about the presentation is making you feel anxious?" },
  { role: 'user', message: "I'm worried I'll forget what to say or mess up." },
  { role: 'ai', message: "Those are very common concerns. Here are some techniques that can help: 1) Practice deep breathing exercises, 2) Prepare key talking points, 3) Remember that your audience wants you to succeed. Would you like to try a quick breathing exercise together?" },
];

export function DemoSection() {
  const [activeDemo, setActiveDemo] = useState<'chat' | 'mood'>('chat');
  const [currentMood, setCurrentMood] = useState(7);

  return (
    <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
            Experience <span className="text-purple-600">MoodMate</span> in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how our AI-powered platform helps you track your mental health and provides personalized support
          </p>
        </div>

        {/* Demo Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 rounded-full p-1 flex">
            <Button
              variant={activeDemo === 'chat' ? 'default' : 'ghost'}
              onClick={() => setActiveDemo('chat')}
              className={`rounded-full px-6 py-2 font-semibold ${
                activeDemo === 'chat' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              AI Chat Demo
            </Button>
            <Button
              variant={activeDemo === 'mood' ? 'default' : 'ghost'}
              onClick={() => setActiveDemo('mood')}
              className={`rounded-full px-6 py-2 font-semibold ${
                activeDemo === 'mood' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Mood Tracking Demo
            </Button>
          </div>
        </div>

        {/* Demo Content */}
        <div className="max-w-4xl mx-auto">
          {activeDemo === 'chat' && (
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Mental Health Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {sampleChatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-full">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent outline-none text-gray-700"
                    disabled
                  />
                  <Button size="sm" className="rounded-full bg-purple-600 hover:bg-purple-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeDemo === 'mood' && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Mood Logger */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-600">
                    <Smile className="h-5 w-5" />
                    Log Your Mood
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      How are you feeling today? ({currentMood}/10)
                    </label>
                    <div className="flex items-center space-x-2">
                      <Frown className="h-5 w-5 text-red-500" />
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={currentMood}
                        onChange={(e) => setCurrentMood(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <Smile className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-center mt-2">
                      {currentMood <= 3 && <span className="text-red-500 font-medium">Not Great</span>}
                      {currentMood > 3 && currentMood <= 6 && <span className="text-yellow-500 font-medium">Okay</span>}
                      {currentMood > 6 && currentMood <= 8 && <span className="text-blue-500 font-medium">Good</span>}
                      {currentMood > 8 && <span className="text-green-500 font-medium">Excellent</span>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What triggered this mood?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Work', 'Family', 'Health', 'Social', 'Weather'].map((trigger) => (
                        <Button
                          key={trigger}
                          variant="outline"
                          size="sm"
                          className="rounded-full text-xs"
                        >
                          {trigger}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Log Mood Entry
                  </Button>
                </CardContent>
              </Card>

              {/* Mood Chart */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-600">
                    <TrendingUp className="h-5 w-5" />
                    Your Mood Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sampleMoodData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#6b7280"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#6b7280"
                          fontSize={12}
                          domain={[1, 10]}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="mood"
                          stroke="#7c3aed"
                          strokeWidth={3}
                          dot={{ fill: '#7c3aed', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#7c3aed', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-700">
                      <strong>AI Insight:</strong> Your mood has been trending upward this week! 
                      Keep up the positive momentum.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">Ready to start your mental health journey?</p>
          <Button 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Get Started Free
          </Button>
        </div>
      </div>
    </section>
  );
}
