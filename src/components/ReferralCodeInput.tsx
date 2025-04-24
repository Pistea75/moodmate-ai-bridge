
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function ReferralCodeInput() {
  const [referralCode, setReferralCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralCode) return;

    setIsLoading(true);
    try {
      // Check if referral code exists in any clinician profile
      const { data: clinician } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'clinician')
        .eq('name', referralCode.toUpperCase())
        .single();

      if (!clinician) {
        toast({
          title: "Invalid referral code",
          description: "Please check the code and try again",
          variant: "destructive",
        });
        return;
      }

      // Update patient's record with the referral
      const { error: updateError } = await supabase
        .from('users')
        .update({ name: referralCode.toUpperCase() })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      toast({
        title: "Connected successfully!",
        description: "You've been connected to your clinician",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect with clinician",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={referralCode}
        onChange={(e) => setReferralCode(e.target.value)}
        placeholder="Enter referral code"
        maxLength={6}
        className="uppercase"
      />
      <Button type="submit" disabled={isLoading || !referralCode}>
        Connect
      </Button>
    </form>
  );
}
