
import React, { useState } from 'react';
import { useAuthFlow } from '@/hooks/useAuthFlow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

export function TestSignup() {
  const [email, setEmail] = useState('mbeathyate2@gmail.com');
  const [password, setPassword] = useState('12345678');
  const { signUp, isLoading } = useAuthFlow();

  const handleTestSignup = async () => {
    const metadata = {
      full_name: 'Test Patient',
      role: 'patient',
      language: 'en'
    };

    try {
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
      >
        {isLoading ? "Signing Up..." : "Test Signup"}
      </Button>
    </div>
  );
}
