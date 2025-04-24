
import { useState } from 'react';
import { Check, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function ReferralCodeInput() {
  const [referralCode, setReferralCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralCode || !user) return;

    setIsLoading(true);
    try {
      // Check if referral code exists in any clinician profile
      const { data: clinician, error: clinicianError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('role', 'clinician')
        .eq('referral_code', referralCode.toUpperCase())
        .single();

      if (clinicianError || !clinician) {
        toast({
          title: "Invalid referral code",
          description: "Please check the code and try again",
          variant: "destructive",
        });
        return;
      }

      // Create relationship
      const { error: relationshipError } = await supabase
        .from('patient_clinician_relationships')
        .insert([
          { patient_id: user.id, clinician_id: clinician.id }
        ]);

      if (relationshipError) {
        if (relationshipError.code === '23505') { // Unique violation
          toast({
            title: "Already connected",
            description: "You're already connected to this clinician",
            variant: "destructive",
          });
          return;
        }
        throw relationshipError;
      }

      // Update auth metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { referral_code: referralCode.toUpperCase() }
      });

      if (updateError) throw updateError;

      setIsConnected(true);
      toast({
        title: "Connected successfully!",
        description: `You've been connected to ${clinician.first_name} ${clinician.last_name}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to connect with clinician",
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
        disabled={isConnected}
      />
      <Button 
        type="submit" 
        disabled={isLoading || !referralCode || isConnected}
        className="min-w-[100px]"
      >
        {isConnected ? (
          <Check className="h-4 w-4 mr-2" />
        ) : (
          <UserPlus className="h-4 w-4 mr-2" />
        )}
        {isConnected ? "Connected" : "Connect"}
      </Button>
    </form>
  );
}
