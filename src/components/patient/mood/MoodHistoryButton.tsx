
import React from 'react';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * MoodHistoryButton Component
 * 
 * Provides a button that navigates to the mood insights page
 * where users can view their mood history and trends.
 * 
 * @returns {JSX.Element} - Rendered button component
 */
export const MoodHistoryButton = () => {
  const navigate = useNavigate();

  const handleViewHistory = () => {
    navigate('/patient/insights');
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleViewHistory}
      className="flex items-center gap-1"
    >
      <History className="h-4 w-4" />
      <span>View History</span>
    </Button>
  );
};
