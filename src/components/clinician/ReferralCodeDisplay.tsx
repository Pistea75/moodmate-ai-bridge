
import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function ReferralCodeDisplay() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.user_metadata?.referral_code) {
      setReferralCode(user.user_metadata.referral_code);
    }
  }, [user]);

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

  const handleGenerateNewCode = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { referral_code: null }
      });

      if (error) throw error;

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
      setIsLoading(false);
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
            {referralCode || "Generating..."}
          </code>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleCopyCode}
            disabled={!referralCode}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={handleGenerateNewCode}
          disabled={isLoading || !referralCode}
        >
          Generate New Code
        </Button>

        <p className="text-sm text-muted-foreground">
          Note: Generating a new code will invalidate the previous one
        </p>
      </div>
    </Card>
  );
}
