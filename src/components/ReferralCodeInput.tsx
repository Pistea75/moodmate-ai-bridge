
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
    if (!referralCode.trim() || !user) return;

    setIsLoading(true);
    try {
      // Normalize the referral code to uppercase
      const normalizedCode = referralCode.trim().toUpperCase();
      
      // Check if referral code exists in any clinician profile
      const { data: clinician, error: clinicianError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('role', 'clinician')
        .eq('referral_code', normalizedCode)
        .single();

      if (clinicianError || !clinician) {
        toast({
          title: "Invalid referral code",
          description: "Please check the code and try again",
          variant: "destructive",
        });
        return;
      }

      // Update the user's metadata to include the clinician's information
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          referral_code: normalizedCode,
          connected_clinician_id: clinician.id,
          connected_clinician_name: `${clinician.first_name || ''} ${clinician.last_name || ''}`.trim()
        }
      });

      if (updateError) throw updateError;
      
      // Also update the user's profile in the profiles table
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ referral_code: normalizedCode })
        .eq('id', user.id);
        
      if (profileUpdateError) {
        console.error('Error updating profile with referral code:', profileUpdateError);
      }

      setIsConnected(true);
      toast({
        title: "Connected successfully!",
        description: `You've been connected to ${clinician.first_name || ''} ${clinician.last_name || ''}`.trim(),
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
        disabled={isLoading || !referralCode.trim() || isConnected}
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
