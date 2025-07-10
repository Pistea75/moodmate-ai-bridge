
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Send, Phone, Mail, Users, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  type: 'message' | 'reminder' | 'alert';
  status: 'sent' | 'delivered' | 'read';
  created_at: string;
  sender_name?: string;
  recipient_name?: string;
}

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
}

export function CommunicationHub() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
    fetchMessages();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;

      const { data: patientLinks } = await supabase
        .from('patient_clinician_links')
        .select('patient_id')
        .eq('clinician_id', user.user.id);

      if (patientLinks && patientLinks.length > 0) {
        const patientIds = patientLinks.map(link => link.patient_id);
        const { data: patientProfiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', patientIds);

        setPatients(patientProfiles || []);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;

      // In a real implementation, you'd have a messages table
      // For now, we'll use notifications as a proxy
      const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      // Transform notifications to messages format with proper status typing
      const messageData: Message[] = notifications?.map(notif => ({
        id: notif.id,
        sender_id: 'system',
        recipient_id: user.user.id,
        content: notif.description,
        type: notif.type as 'message' | 'reminder' | 'alert',
        status: (notif.is_read ? 'read' : 'delivered') as 'sent' | 'delivered' | 'read',
        created_at: notif.created_at,
        sender_name: 'System',
        recipient_name: 'You'
      })) || [];

      setMessages(messageData);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedPatient) return;

    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;

      const selectedPatientData = patients.find(p => p.id === selectedPatient);
      
      // In a real implementation, you'd send to a messages table
      // For now, we'll create a notification for the patient
      await supabase
        .from('notifications')
        .insert({
          user_id: selectedPatient,
          type: 'message',
          title: 'New Message from Clinician',
          description: newMessage,
          priority: 'medium',
          metadata: {
            sender_id: user.user.id,
            message_type: 'clinician_message'
          }
        });

      toast.success('Message sent successfully');
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <Bell className="h-4 w-4 text-red-500" />;
      case 'reminder':
        return <Phone className="h-4 w-4 text-blue-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-7 w-7 text-blue-600" />
            Communication Hub
          </h2>
          <p className="text-muted-foreground">Secure messaging with patients and team members</p>
        </div>
      </div>

      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="compose" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Contacts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No messages yet. Start a conversation with your patients.
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="flex items-start gap-3 p-4 border rounded-lg">
                      {getMessageIcon(message.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{message.sender_name}</span>
                          <Badge variant={message.status === 'read' ? 'secondary' : 'default'}>
                            {message.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(message.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{message.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compose">
          <Card>
            <CardHeader>
              <CardTitle>Send Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Recipient</label>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="">Select a patient...</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="mt-1"
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={sendMessage} 
                disabled={loading || !selectedPatient || !newMessage.trim()}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Patient Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {patients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {patient.first_name?.[0]}{patient.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{patient.first_name} {patient.last_name}</p>
                        <p className="text-sm text-muted-foreground">Patient</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedPatient(patient.id);
                          // Switch to compose tab
                          const composeTab = document.querySelector('[data-value="compose"]') as HTMLElement;
                          composeTab?.click();
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
