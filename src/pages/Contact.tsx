
import { PublicNav } from '../components/PublicNav';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Check, MessageSquare, Users } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send the form data to a server here
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000); // Reset after 3 seconds
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="flex-1">
        <div className="bg-gradient-to-b from-mood-purple/10 to-transparent py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Contact Us</h1>
            <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold">Get in Touch</h2>
              <p className="text-muted-foreground">
                Fill out the form and our team will get back to you within 24 hours.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-10 w-10 rounded-full bg-mood-purple/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-5 w-5 text-mood-purple" />
                  </div>
                  <div>
                    <h3 className="font-medium">Support</h3>
                    <p className="text-muted-foreground">support@moodmate.com</p>
                    <p className="text-muted-foreground">Available 24/7</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-10 w-10 rounded-full bg-mood-purple/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-mood-purple" />
                  </div>
                  <div>
                    <h3 className="font-medium">Partnerships</h3>
                    <p className="text-muted-foreground">partners@moodmate.com</p>
                    <p className="text-muted-foreground">Mon-Fri, 9AM-5PM EST</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Card className="p-6 shadow-md">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject</label>
                    <Input placeholder="How can we help?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <Textarea placeholder="Your message" className="min-h-[150px]" />
                  </div>
                  <Button type="submit" className="w-full bg-mood-purple hover:bg-mood-purple/90">
                    {isSubmitted ? (
                      <span className="flex items-center gap-2">
                        <Check className="h-4 w-4" /> Message Sent
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-sm text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} MoodMate. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
