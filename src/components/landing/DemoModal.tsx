
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function DemoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"patient" | "clinician">("patient");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1234") {
      const route = userType === "patient" ? "/patient/dashboard" : "/clinician/dashboard";
      navigate(route);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid password",
        description: "Please try again with the correct password",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Try MoodMate Demo</DialogTitle>
          <DialogDescription>
            Enter the demo password and choose your role to explore the platform.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="flex gap-4">
            <Button
              type="button"
              variant={userType === "patient" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setUserType("patient")}
            >
              Patient View
            </Button>
            <Button
              type="button"
              variant={userType === "clinician" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setUserType("clinician")}
            >
              Clinician View
            </Button>
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter demo password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full bg-mood-purple hover:bg-mood-purple/90">
            Access Demo
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
