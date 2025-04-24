
import React, { useState } from 'react';
import { useAuthFlow } from '@/hooks/useAuthFlow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

export function TestSignup() {
  const [email, setEmail] = useState('test-user@example.com');
  const [password, setPassword] = useState('12345678');
  const { signUp, isLoading } = useAuthFlow();

  const handleTestSignup = async () => {
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
          description: "Test user created successfully"
        });
      }
    } catch (error: any) {
      console.error("Test signup error:", error);
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
