import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function TestPatientSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateTestPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate test credentials if empty
      const testEmail = email || `test.patient.${Date.now()}@example.com`;
      const testPassword = password || 'Test123!';
      const testFirstName = firstName || 'Test';
      const testLastName = lastName || 'Patient';

      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            first_name: testFirstName,
            last_name: testLastName,
            role: 'patient'
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile with patient role
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              first_name: testFirstName,
              last_name: testLastName,
              role: 'patient',
              email: testEmail
            }
          ]);

        if (profileError) throw profileError;

        toast.success(`Test patient created: ${testEmail} / ${testPassword}`);
        
        // Reset form
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
      }
    } catch (error: any) {
      console.error('Error creating test patient:', error);
      toast.error(error.message || 'Failed to create test patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Test Patient Account</CardTitle>
        <CardDescription>
          Create a test patient account to test marketplace functionality
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateTestPatient} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="First Name (optional)"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              placeholder="Last Name (optional)"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <Input
            type="email"
            placeholder="Email (auto-generated if empty)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password (Test123! if empty)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Test Patient'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}