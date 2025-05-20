
import React from 'react';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { MoodFormValues } from './MoodFormSchema';
import { commonTriggers } from './MoodData';

interface MoodTriggersProps {
  form: UseFormReturn<MoodFormValues>;
}

export const MoodTriggers = ({ form }: MoodTriggersProps) => {
  const toggleTrigger = (value: string) => {
    const currentTriggers = form.getValues('triggers');
    const updatedTriggers = currentTriggers.includes(value)
      ? currentTriggers.filter(t => t !== value)
      : [...currentTriggers, value];
    
    form.setValue('triggers', updatedTriggers, { shouldValidate: true });
  };

  return (
    <div className="space-y-2">
      <Label className="block text-gray-700 font-medium">Triggers</Label>
      <div className="grid grid-cols-2 gap-2 mb-2">
        {commonTriggers.map(trigger => (
          <div key={trigger.value} className="flex items-center space-x-2">
            <Checkbox 
              id={trigger.value} 
              checked={form.watch('triggers').includes(trigger.value)}
              onCheckedChange={() => toggleTrigger(trigger.value)}
            />
            <Label htmlFor={trigger.value} className="cursor-pointer">{trigger.label}</Label>
          </div>
        ))}
      </div>
      <FormField
        control={form.control}
        name="custom_trigger"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                placeholder="Other trigger (optional)"
                {...field}
                className="mt-2"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
