import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  sender_name: string;
  sender_role: string;
}

interface Clinician {
  id: string;
  first_name: string;
  last_name: string;
}

export function PatientDirectMessaging() {
  const [clinician, setClinician] = useState<Clinician | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  // Fetch clinician
  useEffect(() => {
    fetchClinician();
  }, []);

  // Fetch messages when clinician is found
  useEffect(() => {
    if (clinician) {
      fetchMessages(clinician.id);
    }
  }, [clinician]);

  // Add real-time subscription
  useEffect(() => {
    if (!clinician || !currentUserId) return;

    const channel = supabase
      .channel('direct-messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
        },
        (payload) => {
          const newMessage = payload.new;
          // Only update if this message involves the current conversation
          if (
            (newMessage.sender_id === currentUserId && newMessage.recipient_id === clinician.id) ||
            (newMessage.sender_id === clinician.id && newMessage.recipient_id === currentUserId)
          ) {
            fetchMessages(clinician.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clinician, currentUserId]);

  const fetchClinician = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;

      // First get clinician ID from patient_clinician_links
      const { data: link, error: linksError } = await supabase
        .from('patient_clinician_links')
        .select('clinician_id')
        .eq('patient_id', user.user.id)
        .maybeSingle();

      if (linksError) throw linksError;

      if (!link?.clinician_id) {
        setClinician(null);
        return;
      }

      // Then get clinician profile
      const clinicianId = link.clinician_id;
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('id', clinicianId)
        .single();

      if (profileError) throw profileError;

      if (profile) {
        setClinician({
          id: profile.id,
          first_name: profile.first_name || '',
          last_name: profile.last_name || ''
        });
      }
    } catch (error: any) {
      console.error('Error fetching clinician:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load clinician information",
      });
    }
  };

  const fetchMessages = async (clinicianId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;

      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          id,
          sender_id,
          recipient_id,
          content,
          created_at
        `)
        .or(`and(sender_id.eq.${user.user.id},recipient_id.eq.${clinicianId}),and(sender_id.eq.${clinicianId},recipient_id.eq.${user.user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get sender names for each message
      const messagesWithNames = await Promise.all(
        (data || []).map(async (msg) => {
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('first_name, last_name, role')
            .eq('id', msg.sender_id)
            .single();

          return {
            id: msg.id,
            sender_id: msg.sender_id,
            recipient_id: msg.recipient_id,
            content: msg.content,
            created_at: msg.created_at,
            sender_name: senderProfile 
              ? `${senderProfile.first_name || ''} ${senderProfile.last_name || ''}`.trim()
              : 'Unknown',
            sender_role: senderProfile?.role || 'unknown'
          };
        })
      );

      setMessages(messagesWithNames);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load messages",
      });
    }
  };

  const sendMessage = async () => {
    if (!clinician || !newMessage.trim() || !currentUserId) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: currentUserId,
          recipient_id: clinician.id,
          content: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
      fetchMessages(clinician.id);

      toast({
        title: "Message sent",
        description: "Your message has been delivered",
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!clinician) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No clinician assigned yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {clinician.first_name?.[0]}{clinician.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">
              {clinician.first_name} {clinician.last_name}
            </h3>
            <p className="text-sm text-muted-foreground">Your Clinician</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map(message => {
            const isOwn = message.sender_id === currentUserId;
            
            return (
              <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-lg ${
                  isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[60px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button onClick={sendMessage} disabled={loading || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
