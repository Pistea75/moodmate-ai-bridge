
import MainLayout from '../layouts/MainLayout';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function HelpCenter() {
  const categories = [
    {
      title: "Getting Started",
      articles: ["Account Setup", "Platform Overview", "First Session"]
    },
    {
      title: "Using the AI Companion",
      articles: ["Chat Features", "Voice Commands", "Personalization"]
    },
    {
      title: "Privacy & Security",
      articles: ["Data Protection", "Security Features", "Privacy Settings"]
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Help Center</h1>
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-muted-foreground" />
            <Input className="pl-10" placeholder="Search help articles..." />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.title} className="p-6">
              <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
              <ul className="space-y-2">
                {category.articles.map((article) => (
                  <li key={article}>
                    <a href="#" className="text-primary hover:underline">
                      {article}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
