import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, FileText, CheckSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SessionTemplate {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  session_type: string;
  default_notes: string;
  preparation_checklist: string[];
  outcome_metrics: any; // Changed from Record<string, string> to any to handle Json type
}

interface SessionTemplateSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (template: SessionTemplate) => void;
}

export function SessionTemplateSelector({
  open,
  onClose,
  onSelectTemplate
}: SessionTemplateSelectorProps) {
  const [templates, setTemplates] = useState<SessionTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchTemplates();
    }
  }, [open]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('session_templates')
        .select('*')
        .order('name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load session templates',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'initial': return 'bg-blue-100 text-blue-800';
      case 'individual': return 'bg-green-100 text-green-800';
      case 'group': return 'bg-purple-100 text-purple-800';
      case 'family': return 'bg-orange-100 text-orange-800';
      case 'crisis': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectTemplate = (template: SessionTemplate) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Select Session Template
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <Card 
                  key={template.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/20"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge className={getSessionTypeColor(template.session_type)}>
                        {template.session_type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">{template.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>{template.duration_minutes} min</span>
                      </div>
                      {template.preparation_checklist && (
                        <div className="flex items-center gap-1">
                          <CheckSquare className="h-4 w-4 text-green-600" />
                          <span>{template.preparation_checklist.length} prep items</span>
                        </div>
                      )}
                    </div>

                    {template.default_notes && (
                      <div className="bg-gray-50 p-2 rounded text-xs">
                        <strong>Default Notes:</strong> {template.default_notes.substring(0, 100)}...
                      </div>
                    )}

                    {template.preparation_checklist && template.preparation_checklist.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-gray-700">Preparation Checklist:</span>
                        <ul className="text-xs text-gray-600 space-y-0.5">
                          {template.preparation_checklist.slice(0, 2).map((item, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              {item}
                            </li>
                          ))}
                          {template.preparation_checklist.length > 2 && (
                            <li className="text-gray-500">+{template.preparation_checklist.length - 2} more</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && templates.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Found</h3>
              <p className="text-gray-600">You haven't created any session templates yet.</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}