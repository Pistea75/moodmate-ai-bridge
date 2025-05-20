
import React from 'react';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { MoodFormValues } from './MoodFormSchema';

interface MoodNotesProps {
  form: UseFormReturn<MoodFormValues>;
}

export const MoodNotes = ({ form }: MoodNotesProps) => {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <Label className="block text-gray-700 font-medium">Notes (optional)</Label>
          <FormControl>
            <Textarea
              placeholder="Describe how you're feeling..."
              {...field}
              className="mt-2"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
