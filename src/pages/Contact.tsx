
import MainLayout from '../layouts/MainLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function Contact() {
  return (
    <MainLayout>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        <Card className="max-w-2xl mx-auto p-6">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input type="email" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <Textarea placeholder="How can we help you?" className="min-h-[150px]" />
            </div>
            <Button className="w-full">Send Message</Button>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}
