
import { differenceInDays, parseISO } from 'date-fns';

export interface RiskFactors {
  moodTrend: number;
  sessionAttendance: number;
  taskCompletion: number;
  communicationFrequency: number;
  lastMoodScore: number;
  triggerFrequency: number;
}

export interface RiskAssessment {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: RiskFactors;
  recommendations: string[];
  lastUpdated: string;
}

export function calculateRiskScore(
  moodEntries: any[],
  sessions: any[],
  tasks: any[],
  chatLogs: any[]
): RiskAssessment {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  // Calculate mood trend (30% weight)
  const recentMoods = moodEntries.filter(entry => 
    new Date(entry.created_at) >= oneWeekAgo
  );
  const olderMoods = moodEntries.filter(entry => 
    new Date(entry.created_at) >= twoWeeksAgo && new Date(entry.created_at) < oneWeekAgo
  );
  
  const recentAvg = recentMoods.length > 0 
    ? recentMoods.reduce((sum, entry) => sum + entry.mood_score, 0) / recentMoods.length 
    : 5;
  const olderAvg = olderMoods.length > 0 
    ? olderMoods.reduce((sum, entry) => sum + entry.mood_score, 0) / olderMoods.length 
    : 5;
  
  const moodTrend = ((recentAvg - olderAvg) / 10) * 100; // -100 to +100

  // Calculate session attendance (20% weight)
  const scheduledSessions = sessions.filter(session => 
    new Date(session.scheduled_time) >= oneWeekAgo
  );
  const attendedSessions = scheduledSessions.filter(session => 
    session.status === 'completed'
  );
  const sessionAttendance = scheduledSessions.length > 0 
    ? (attendedSessions.length / scheduledSessions.length) * 100 
    : 100;

  // Calculate task completion (20% weight)
  const recentTasks = tasks.filter(task => 
    task.due_date && new Date(task.due_date) >= oneWeekAgo
  );
  const completedTasks = recentTasks.filter(task => task.completed);
  const taskCompletion = recentTasks.length > 0 
    ? (completedTasks.length / recentTasks.length) * 100 
    : 100;

  // Calculate communication frequency (15% weight)
  const recentChats = chatLogs.filter(log => 
    new Date(log.created_at) >= oneWeekAgo
  );
  const communicationFrequency = Math.min(recentChats.length / 7 * 10, 100); // Cap at 100

  // Get last mood score (10% weight)
  const lastMoodScore = moodEntries.length > 0 
    ? moodEntries[moodEntries.length - 1].mood_score * 10 
    : 50;

  // Calculate trigger frequency (5% weight)
  const triggersCount = recentMoods.reduce((count, entry) => 
    count + (entry.triggers?.length || 0), 0
  );
  const triggerFrequency = Math.max(100 - (triggersCount * 10), 0);

  const factors: RiskFactors = {
    moodTrend,
    sessionAttendance,
    taskCompletion,
    communicationFrequency,
    lastMoodScore,
    triggerFrequency
  };

  // Calculate weighted risk score
  const riskScore = Math.max(0, Math.min(100,
    (moodTrend * 0.3) +
    (sessionAttendance * 0.2) +
    (taskCompletion * 0.2) +
    (communicationFrequency * 0.15) +
    (lastMoodScore * 0.1) +
    (triggerFrequency * 0.05)
  ));

  // Determine risk level
  let level: RiskAssessment['level'];
  if (riskScore >= 80) level = 'low';
  else if (riskScore >= 60) level = 'medium';
  else if (riskScore >= 40) level = 'high';
  else level = 'critical';

  // Generate recommendations
  const recommendations: string[] = [];
  if (moodTrend < -20) recommendations.push('Monitor mood trend closely - significant decline detected');
  if (sessionAttendance < 70) recommendations.push('Address session attendance issues');
  if (taskCompletion < 50) recommendations.push('Review and adjust task difficulty/relevance');
  if (communicationFrequency < 30) recommendations.push('Encourage more frequent check-ins');
  if (lastMoodScore < 30) recommendations.push('Consider immediate intervention for low mood');
  if (triggerFrequency < 50) recommendations.push('Address recurring triggers with coping strategies');

  if (recommendations.length === 0) {
    recommendations.push('Patient showing positive progress - continue current care plan');
  }

  return {
    score: Math.round(riskScore),
    level,
    factors,
    recommendations,
    lastUpdated: now.toISOString()
  };
}

export function getRiskColor(level: RiskAssessment['level']): string {
  switch (level) {
    case 'low': return 'text-green-600 bg-green-50 border-green-200';
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'critical': return 'text-red-600 bg-red-50 border-red-200';
  }
}
