
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Download, 
  Search, 
  Filter,
  Plus,
  Heart,
  Brain,
  Users,
  Clock
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'worksheet' | 'assessment';
  category: 'anxiety' | 'depression' | 'trauma' | 'addiction' | 'general';
  description: string;
  url: string;
  duration?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Cognitive Behavioral Therapy Techniques',
    type: 'article',
    category: 'general',
    description: 'Comprehensive guide to CBT techniques for various mental health conditions',
    url: '#',
    difficulty: 'intermediate',
    tags: ['CBT', 'therapy', 'techniques']
  },
  {
    id: '2',
    title: 'Mindfulness Meditation Video Series',
    type: 'video',
    category: 'anxiety',
    description: 'Step-by-step mindfulness exercises for anxiety management',
    url: '#',
    duration: '15 min',
    difficulty: 'beginner',
    tags: ['mindfulness', 'meditation', 'anxiety']
  },
  {
    id: '3',
    title: 'Depression Assessment Worksheet',
    type: 'worksheet',
    category: 'depression',
    description: 'Standardized assessment tool for depression screening',
    url: '#',
    difficulty: 'advanced',
    tags: ['assessment', 'depression', 'screening']
  }
];

export function ResourceLibrary() {
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'worksheet': return <BookOpen className="h-4 w-4" />;
      case 'assessment': return <Brain className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'anxiety': return 'bg-orange-100 text-orange-700';
      case 'depression': return 'bg-blue-100 text-blue-700';
      case 'trauma': return 'bg-red-100 text-red-700';
      case 'addiction': return 'bg-purple-100 text-purple-700';
      case 'general': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-blue-600" />
            Resource Library
          </h2>
          <p className="text-muted-foreground">Evidence-based resources and materials</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Categories</option>
                <option value="anxiety">Anxiety</option>
                <option value="depression">Depression</option>
                <option value="trauma">Trauma</option>
                <option value="addiction">Addiction</option>
                <option value="general">General</option>
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Types</option>
                <option value="article">Articles</option>
                <option value="video">Videos</option>
                <option value="worksheet">Worksheets</option>
                <option value="assessment">Assessments</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(resource.type)}
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                </div>
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{resource.description}</p>
              
              <div className="flex flex-wrap gap-2">
                <Badge className={getCategoryColor(resource.category)}>
                  {resource.category}
                </Badge>
                <Badge className={getDifficultyColor(resource.difficulty)}>
                  {resource.difficulty}
                </Badge>
                {resource.duration && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {resource.duration}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {resource.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No resources found matching your criteria.</p>
          <p className="text-sm">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
