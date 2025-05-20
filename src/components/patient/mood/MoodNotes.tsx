
import React from 'react';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { MoodFormValues } from './MoodFormSchema';

interface MoodNotesProps {
  form: UseFormReturn<MoodFormValues>;
}

/**
 * MoodNotes Component
 * 
 * Provides a text area for users to enter additional context about their mood.
 * This component is part of the mood logging form and handles the optional notes field.
 * 
 * @param {MoodNotesProps} props - Component props containing form control
 * @returns {JSX.Element} - Rendered form field for mood notes
 */
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
