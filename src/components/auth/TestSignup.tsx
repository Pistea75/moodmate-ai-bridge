
import React, { useState } from 'react';
import { useAuthFlow } from '@/hooks/useAuthFlow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function TestSignup() {
  const [email, setEmail] = useState('test-user@example.com');
  const [password, setPassword] = useState('12345678');
  const [error, setError] = useState<string | null>(null);
  const { signUp, isLoading } = useAuthFlow();

  const handleTestSignup = async () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError(null);
    const metadata = {
      full_name: 'Test User',
      role: 'patient',
      language: 'en'
    };

    try {
      console.log("Attempting test signup with:", { email, metadata });
      const success = await signUp(email, password, metadata);
      
      if (success) {
        toast({
          title: "Test Signup Successful",
          description: "Test user created successfully. Check email for verification."
        });
      }
    } catch (error: any) {
      console.error("Test signup error:", error);
      setError(error.message || "An error occurred during test signup");
      toast({
        title: "Test Signup Failed",
        description: error.message || "An error occurred during test signup",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-md bg-amber-50 border-amber-200 mb-6">
        <p className="text-sm text-amber-800 mb-2">
          <strong>Note:</strong> This component is for testing purposes only. It will create a test user with the following details:
        </p>
        <ul className="list-disc pl-5 text-sm text-amber-800">
          <li>Role: Patient</li>
          <li>Language: English</li>
        </ul>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email"
      />
      <Input 
        type="password"
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password"
        minLength={6}
      />
      <Button 
        onClick={handleTestSignup} 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Signing Up..." : "Create Test User"}
      </Button>
    </div>
  );
}
