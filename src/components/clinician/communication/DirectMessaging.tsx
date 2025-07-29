import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
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

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
}

export function DirectMessaging() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
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

  // Fetch patients
  useEffect(() => {
    fetchPatients();
  }, []);

  // Fetch messages when patient is selected
  useEffect(() => {
    if (selectedPatient) {
      fetchMessages(selectedPatient.id);
    }
  }, [selectedPatient]);

  // Add real-time subscription
  useEffect(() => {
    if (!selectedPatient || !currentUserId) return;

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
            (newMessage.sender_id === currentUserId && newMessage.recipient_id === selectedPatient.id) ||
            (newMessage.sender_id === selectedPatient.id && newMessage.recipient_id === currentUserId)
          ) {
            fetchMessages(selectedPatient.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedPatient, currentUserId]);

  const fetchPatients = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;

      // First get patient IDs from patient_clinician_links
      const { data: links, error: linksError } = await supabase
        .from('patient_clinician_links')
        .select('patient_id')
        .eq('clinician_id', user.user.id);

      if (linksError) throw linksError;

      if (!links || links.length === 0) {
        setPatients([]);
        return;
      }

      // Then get patient profiles
      const patientIds = links.map(link => link.patient_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', patientIds);

      if (profilesError) throw profilesError;

      const patientsData = profiles?.map(profile => ({
        id: profile.id,
        first_name: profile.first_name || '',
        last_name: profile.last_name || ''
      })) || [];

      setPatients(patientsData);
    } catch (error: any) {
      console.error('Error fetching patients:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load patients",
      });
    }
  };

  const fetchMessages = async (patientId: string) => {
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
        .or(`and(sender_id.eq.${user.user.id},recipient_id.eq.${patientId}),and(sender_id.eq.${patientId},recipient_id.eq.${user.user.id})`)
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
    if (!selectedPatient || !newMessage.trim() || !currentUserId) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: currentUserId,
          recipient_id: selectedPatient.id,
          content: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
      fetchMessages(selectedPatient.id);

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

  return (
    <div className="flex h-[600px] border rounded-lg">
      {/* Patients List */}
      <div className="w-1/3 border-r">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Patients</h3>
        </div>
        <ScrollArea className="h-full">
          <div className="p-2">
            {patients.map(patient => (
              <div
                key={patient.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedPatient?.id === patient.id ? 'bg-primary/10' : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedPatient(patient)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {patient.first_name?.[0]}{patient.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {patient.first_name} {patient.last_name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col">
        {selectedPatient ? (
          <>
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {selectedPatient.first_name?.[0]}{selectedPatient.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {selectedPatient.first_name} {selectedPatient.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">Patient</p>
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Select a patient to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
