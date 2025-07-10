
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Heart, 
  Brain, 
  Users, 
  Target, 
  Book, 
  Activity, 
  Lightbulb 
} from 'lucide-react';

interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDuration: string;
  icon: any;
  defaultInstructions: string;
}

interface TaskTemplateSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (template: TaskTemplate) => void;
}

const taskTemplates: TaskTemplate[] = [
  {
    id: 'mood-tracking',
    name: 'Daily Mood Tracking',
    description: 'Regular mood monitoring and journaling exercise',
    category: 'Assessment',
    priority: 'medium',
    estimatedDuration: '10 minutes',
    icon: Heart,
    defaultInstructions: 'Track your mood daily using the mood scale from 1-10. Include notes about triggers, activities, and overall feelings.'
  },
  {
    id: 'breathing-exercise',
    name: 'Breathing Exercise',
    description: 'Guided breathing techniques for anxiety management',
    category: 'Coping Skills',
    priority: 'high',
    estimatedDuration: '15 minutes',
    icon: Activity,
    defaultInstructions: 'Practice deep breathing: Inhale for 4 counts, hold for 4, exhale for 6. Repeat for 10-15 minutes.'
  },
  {
    id: 'thought-record',
    name: 'Thought Record',
    description: 'CBT thought challenging and restructuring exercise',
    category: 'CBT',
    priority: 'high',
    estimatedDuration: '20 minutes',
    icon: Brain,
    defaultInstructions: 'Identify negative thoughts, examine evidence for/against, and develop balanced alternative thoughts.'
  },
  {
    id: 'gratitude-journal',
    name: 'Gratitude Journal',
    description: 'Daily gratitude practice to improve positive thinking',
    category: 'Mindfulness',
    priority: 'low',
    estimatedDuration: '10 minutes',
    icon: FileText,
    defaultInstructions: 'Write down 3 things you are grateful for today. Include why each item is meaningful to you.'
  },
  {
    id: 'social-interaction',
    name: 'Social Interaction Goal',
    description: 'Practice social skills and connection building',
    category: 'Social Skills',
    priority: 'medium',
    estimatedDuration: '30 minutes',
    icon: Users,
    defaultInstructions: 'Engage in one meaningful social interaction today. This could be calling a friend, joining a group activity, or having a conversation with a neighbor.'
  },
  {
    id: 'goal-setting',
    name: 'Weekly Goal Setting',
    description: 'Set and track progress toward personal goals',
    category: 'Goal Setting',
    priority: 'medium',
    estimatedDuration: '25 minutes',
    icon: Target,
    defaultInstructions: 'Set 2-3 specific, achievable goals for the week. Break them down into daily action steps.'
  },
  {
    id: 'reading-assignment',
    name: 'Therapeutic Reading',
    description: 'Assigned reading from self-help or therapeutic materials',
    category: 'Education',
    priority: 'low',
    estimatedDuration: '45 minutes',
    icon: Book,
    defaultInstructions: 'Read the assigned chapter/article and write a brief summary of key insights and how they apply to your situation.'
  },
  {
    id: 'mindfulness-meditation',
    name: 'Mindfulness Meditation',
    description: 'Guided meditation practice for present-moment awareness',
    category: 'Mindfulness',
    priority: 'medium',
    estimatedDuration: '20 minutes',
    icon: Lightbulb,
    defaultInstructions: 'Practice mindfulness meditation for 15-20 minutes. Focus on your breath and observe thoughts without judgment.'
  }
];

export function TaskTemplateSelector({ open, onClose, onSelectTemplate }: TaskTemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(new Set(taskTemplates.map(t => t.category)));

  const filteredTemplates = selectedCategory === 'all' 
    ? taskTemplates 
    : taskTemplates.filter(t => t.category === selectedCategory);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Task Templates</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <p className="text-sm text-gray-600">{template.estimatedDuration}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                        <Badge className={`text-xs ${getPriorityColor(template.priority)}`}>
                          {template.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-3">
                      {template.description}
                    </p>
                    <p className="text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded">
                      {template.defaultInstructions}
                    </p>
                    <Button
                      onClick={() => onSelectTemplate(template)}
                      className="w-full"
                      size="sm"
                    >
                      Use This Template
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No templates found for the selected category.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
