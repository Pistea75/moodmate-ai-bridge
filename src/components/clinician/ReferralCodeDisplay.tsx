
import { useEffect, useState } from 'react';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Generate a random 6-character alphanumeric code
function generateReferralCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function ReferralCodeDisplay() {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchReferralCode();
  }, [user]);

  const fetchReferralCode = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      // First try to get the code from the profile
      const { data, error } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching referral code:', error);
        return;
      }
      
      if (data?.referral_code) {
        setReferralCode(data.referral_code);
      } else if (user.role === 'clinician') {
        // If no code exists and user is a clinician, generate one
        await generateNewCode();
      }
    } catch (error) {
      console.error('Error in fetchReferralCode:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code to clipboard",
        variant: "destructive",
      });
    }
  };

  const generateNewCode = async () => {
    if (!user?.id) return;
    
    try {
      setIsGenerating(true);
      const newCode = generateReferralCode();
      
      // Update the referral code in the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ referral_code: newCode })
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to generate new referral code",
          variant: "destructive",
        });
        console.error('Error generating new code:', error);
        return;
      }

      setReferralCode(newCode);
      toast({
        title: "Success",
        description: "New referral code generated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate new code",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Referral Code</h2>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground mb-2">
          Share this code with your patients to connect with them on MoodMate
        </p>
        
        <div className="flex items-center gap-2">
          <code className="bg-muted px-4 py-2 rounded text-lg font-mono">
            {isLoading ? "Loading..." : referralCode || "No code yet"}
          </code>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleCopyCode}
            disabled={!referralCode || isLoading}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={generateNewCode}
          disabled={isGenerating || isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? "Generating..." : "Generate New Code"}
        </Button>

        <p className="text-sm text-muted-foreground">
          Note: Generating a new code will invalidate the previous one
        </p>
      </div>
    </Card>
  );
}
