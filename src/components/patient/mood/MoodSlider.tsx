
import React from 'react';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { UseFormReturn } from 'react-hook-form';
import { MoodFormValues } from './MoodFormSchema';
import { moodScoreDescriptions } from './MoodData';

interface MoodSliderProps {
  form: UseFormReturn<MoodFormValues>;
}

export const MoodSlider = ({ form }: MoodSliderProps) => {
  const currentMoodScore = form.watch('mood_score');
  const currentMoodInfo = moodScoreDescriptions[currentMoodScore - 1];
  
  return (
    <FormField
      control={form.control}
      name="mood_score"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-base font-medium">Mood Score: {field.value}</Label>
            <span className="text-sm font-semibold px-2 py-1 rounded-full bg-mood-purple text-white">
              {currentMoodInfo.label}
            </span>
          </div>
          
          <div className="mt-1 text-sm text-muted-foreground">
            {currentMoodInfo.description}
          </div>
          
          <FormControl>
            <div className="pt-2 pb-6">
              <Slider 
                value={[field.value]} 
                min={1} 
                max={10} 
                step={1} 
                onValueChange={(values) => field.onChange(values[0])} 
                className="py-4"
              />
              
              <div className="mt-2 grid grid-cols-10 text-xs text-center">
                {moodScoreDescriptions.map((desc) => (
                  <div key={desc.score} className={`${field.value === desc.score ? 'font-bold' : 'text-muted-foreground'}`}>
                    {desc.score}
                  </div>
                ))}
              </div>
              
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>Crisis</span>
                <span>Excellent</span>
              </div>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
