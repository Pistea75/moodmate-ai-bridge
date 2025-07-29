
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, Download, ExternalLink, Plus, Filter } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'worksheet' | 'assessment';
  category: string;
  description: string;
  url?: string;
  downloadUrl?: string;
  tags: string[];
  createdAt: string;
}

export function ResourceLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Sample resources - replace with actual data
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Cognitive Behavioral Therapy Techniques',
      type: 'article',
      category: 'CBT',
      description: 'Comprehensive guide to CBT techniques for anxiety and depression',
      url: 'https://example.com/cbt-guide',
      tags: ['CBT', 'anxiety', 'depression'],
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Mindfulness Meditation Worksheet',
      type: 'worksheet',
      category: 'Mindfulness',
      description: 'Patient worksheet for guided mindfulness practice',
      downloadUrl: 'https://example.com/mindfulness-worksheet.pdf',
      tags: ['mindfulness', 'meditation', 'worksheet'],
      createdAt: '2024-01-10'
    }
  ];

  const categories = ['all', 'CBT', 'Mindfulness', 'DBT', 'Assessment'];
  const types = ['all', 'article', 'video', 'worksheet', 'assessment'];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <BookOpen className="h-4 w-4" />;
      case 'video': return <ExternalLink className="h-4 w-4" />;
      case 'worksheet': return <Download className="h-4 w-4" />;
      case 'assessment': return <Filter className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'article': return 'bg-blue-100 text-blue-700';
      case 'video': return 'bg-purple-100 text-purple-700';
      case 'worksheet': return 'bg-green-100 text-green-700';
      case 'assessment': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-primary" />
            Resource Library
          </h2>
          <p className="text-muted-foreground">Clinical resources and educational materials</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-10 px-3 border border-input rounded-md bg-background"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full h-10 px-3 border border-input rounded-md bg-background"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No resources found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredResources.map(resource => (
            <Card key={resource.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(resource.type)}
                    <Badge className={getTypeBadgeColor(resource.type)}>
                      {resource.type}
                    </Badge>
                  </div>
                  <Badge variant="outline">{resource.category}</Badge>
                </div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {resource.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {resource.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  {resource.url && (
                    <Button size="sm" variant="outline" className="flex-1">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  )}
                  {resource.downloadUrl && (
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
