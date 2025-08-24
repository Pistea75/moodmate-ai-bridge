import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Users, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

interface PointsData {
  total_points: number;
  points_from_sessions: number;
  points_from_workshops: number;
  points_redeemed: number;
}

export function PsychologistPointsDashboard() {
  const { user } = useAuth();
  const [pointsData, setPointsData] = useState<PointsData>({
    total_points: 0,
    points_from_sessions: 0,
    points_from_workshops: 0,
    points_redeemed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPointsData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('psychologist_points')
          .select('*')
          .eq('psychologist_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          setPointsData(data);
        }
      } catch (error) {
        console.error('Error fetching points data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPointsData();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const availablePoints = pointsData.total_points - pointsData.points_redeemed;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Points Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{pointsData.total_points}</div>
              <div className="text-sm text-gray-600">Total Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{availablePoints}</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{pointsData.points_from_sessions}</div>
              <div className="text-sm text-gray-600">From Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{pointsData.points_from_workshops}</div>
              <div className="text-sm text-gray-600">From Workshops</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to next reward</span>
              <span>{availablePoints % 100}/100 points</span>
            </div>
            <Progress value={(availablePoints % 100)} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Points Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-600" />
              Session Ratings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">5-star ratings</span>
                <Badge variant="secondary">+10 points each</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">4-star ratings</span>
                <Badge variant="secondary">+5 points each</Badge>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Points are awarded automatically after each session rating of 4+ stars
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Workshop Hosting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Host monthly workshop</span>
                <Badge variant="secondary">+50 points</Badge>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Earn points by hosting educational workshops for the community
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Available Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <div className="font-semibold">Continuing Education</div>
              <div className="text-sm text-gray-600 mt-1">100 points</div>
              <div className="text-xs text-gray-500 mt-2">Access to premium courses</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="font-semibold">Subscription Discount</div>
              <div className="text-sm text-gray-600 mt-1">200 points</div>
              <div className="text-xs text-gray-500 mt-2">20% off next month</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="font-semibold">Profile Boost</div>
              <div className="text-sm text-gray-600 mt-1">150 points</div>
              <div className="text-xs text-gray-500 mt-2">Featured placement for 30 days</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}