import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  Activity,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export interface PatientFilters {
  search: string;
  status: string;
  riskLevel: string;
  lastActiveFilter: string;
  moodScoreRange: string;
  onboardingStatus: string;
}

interface PatientFiltersProps {
  filters: PatientFilters;
  onFiltersChange: (filters: PatientFilters) => void;
  onReset: () => void;
  patientCount: number;
  filteredCount: number;
}

export function PatientFilters({ 
  filters, 
  onFiltersChange, 
  onReset, 
  patientCount, 
  filteredCount 
}: PatientFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof PatientFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== '' && value !== 'all'
    ).length;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Patient Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount} active</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {filteredCount} of {patientCount} patients
            </span>
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm">
                  {isExpanded ? 'Hide' : 'Show'} Filters
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Quick Search - Always Visible */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients by name or email..."
              className="pl-9"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
            {filters.search && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => updateFilter('search', '')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-4">
            {/* Status and Risk Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status-filter" className="flex items-center gap-2 mb-2">
                  <UserCheck className="h-4 w-4" />
                  Patient Status
                </Label>
                <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="at_risk">At Risk</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="risk-filter" className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  Risk Level
                </Label>
                <Select value={filters.riskLevel} onValueChange={(value) => updateFilter('riskLevel', value)}>
                  <SelectTrigger id="risk-filter">
                    <SelectValue placeholder="All risk levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All risk levels</SelectItem>
                    <SelectItem value="LOW">Low Risk</SelectItem>
                    <SelectItem value="MODERATE">Moderate Risk</SelectItem>
                    <SelectItem value="HIGH">High Risk</SelectItem>
                    <SelectItem value="CRITICAL">Critical Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Activity and Mood Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="activity-filter" className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4" />
                  Last Active
                </Label>
                <Select value={filters.lastActiveFilter} onValueChange={(value) => updateFilter('lastActiveFilter', value)}>
                  <SelectTrigger id="activity-filter">
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This week</SelectItem>
                    <SelectItem value="month">This month</SelectItem>
                    <SelectItem value="inactive">Inactive (30+ days)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="mood-filter" className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4" />
                  Last Mood Score
                </Label>
                <Select value={filters.moodScoreRange} onValueChange={(value) => updateFilter('moodScoreRange', value)}>
                  <SelectTrigger id="mood-filter">
                    <SelectValue placeholder="Any score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any score</SelectItem>
                    <SelectItem value="low">Low (1-3)</SelectItem>
                    <SelectItem value="moderate">Moderate (4-6)</SelectItem>
                    <SelectItem value="high">High (7-10)</SelectItem>
                    <SelectItem value="no_data">No mood data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Onboarding Status */}
            <div>
              <Label htmlFor="onboarding-filter" className="flex items-center gap-2 mb-2">
                <UserCheck className="h-4 w-4" />
                Onboarding Status
              </Label>
              <Select value={filters.onboardingStatus} onValueChange={(value) => updateFilter('onboardingStatus', value)}>
                <SelectTrigger id="onboarding-filter">
                  <SelectValue placeholder="All patients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All patients</SelectItem>
                  <SelectItem value="completed">Onboarding completed</SelectItem>
                  <SelectItem value="incomplete">Onboarding incomplete</SelectItem>
                  <SelectItem value="not_started">Not started</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reset Button */}
            {activeFiltersCount > 0 && (
              <div className="pt-2 border-t">
                <Button 
                  variant="outline" 
                  onClick={onReset}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}