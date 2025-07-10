
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Target, Calendar, User, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TreatmentPlan {
  id: string;
  patient_name: string;
  goals: string[];
  status: 'active' | 'completed' | 'paused';
  progress: number;
  created_at: string;
  target_date: string;
}

export function TreatmentPlans() {
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTreatmentPlans();
  }, []);

  const fetchTreatmentPlans = async () => {
    try {
      // Mock data for now - would fetch from database
      const mockPlans: TreatmentPlan[] = [
        {
          id: '1',
          patient_name: 'Sarah Johnson',
          goals: ['Reduce anxiety symptoms', 'Improve sleep quality', 'Develop coping strategies'],
          status: 'active',
          progress: 65,
          created_at: '2024-01-15',
          target_date: '2024-06-15'
        },
        {
          id: '2',
          patient_name: 'Mike Chen',
          goals: ['Address depression', 'Increase social activities', 'Build self-esteem'],
          status: 'active',
          progress: 40,
          created_at: '2024-02-01',
          target_date: '2024-08-01'
        }
      ];

      setPlans(mockPlans);
    } catch (error) {
      console.error('Error fetching treatment plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const activePlans = plans.filter(p => p.status === 'active');
  const completedPlans = plans.filter(p => p.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-7 w-7 text-blue-600" />
            Treatment Plans
          </h2>
          <p className="text-muted-foreground">Manage patient treatment goals and progress</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Active Plans</span>
            </div>
            <p className="text-2xl font-bold mt-2">{activePlans.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">Completed</span>
            </div>
            <p className="text-2xl font-bold mt-2">{completedPlans.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Avg Progress</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {activePlans.length > 0 
                ? Math.round(activePlans.reduce((acc, p) => acc + p.progress, 0) / activePlans.length)
                : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Plans</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activePlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {plan.patient_name}
                    </CardTitle>
                    <Badge variant="secondary" className={getStatusColor(plan.status)}>
                      {plan.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Treatment Goals</h4>
                    <ul className="space-y-1">
                      {plan.goals.map((goal, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <Target className="h-3 w-3" />
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{plan.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${plan.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Started: {new Date(plan.created_at).toLocaleDateString()}</span>
                    <span>Target: {new Date(plan.target_date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                    <Button variant="outline" size="sm">
                      Update Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="text-center py-8 text-muted-foreground">
            No completed treatment plans yet.
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Anxiety Treatment', 'Depression Recovery', 'Trauma Therapy', 'Addiction Recovery'].map((template, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-2">{template}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Standard treatment plan template for {template.toLowerCase()}
                  </p>
                  <Button size="sm" variant="outline">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
