
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProfileAvatar } from './ProfileAvatar';
import { ClinicianFields } from './ClinicianFields';
import { LanguageSelect } from './LanguageSelect';

interface ProfileFormData {
  first_name: string;
  last_name: string;
  language: string;
  specialization?: string;
  license_number?: string;
}

interface ProfileFormProps {
  initialData: ProfileFormData;
  userRole: 'patient' | 'clinician';
}

export function ProfileForm({ initialData, userRole }: ProfileFormProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(
    user?.user_metadata?.avatar_url || null
  );

  const form = useForm<ProfileFormData>({
    defaultValues: initialData,
  });

  // Update avatar URL when user metadata changes
  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      setCurrentAvatarUrl(user.user_metadata.avatar_url);
    }
  }, [user?.user_metadata?.avatar_url]);

  const handleAvatarUpdate = (url: string) => {
    setCurrentAvatarUrl(url);
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          language: data.language,
          ...(userRole === 'clinician' && {
            specialization: data.specialization,
            license_number: data.license_number,
          }),
        },
      });

      if (error) throw error;

      // Also update the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          language: data.language,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ProfileAvatar 
          avatarUrl={currentAvatarUrl} 
          userId={user?.id}
          onAvatarUpdate={handleAvatarUpdate}
        />

        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Surname</FormLabel>
              <FormControl>
                <Input {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LanguageSelect form={form} />

        {userRole === 'clinician' && <ClinicianFields form={form} />}

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
