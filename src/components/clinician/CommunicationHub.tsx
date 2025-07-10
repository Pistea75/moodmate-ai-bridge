
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Send, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MessageList } from './communication/MessageList';
import { ComposeMessage } from './communication/ComposeMessage';
import { ContactsList } from './communication/ContactsList';

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

      const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

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

  const handleMessagePatient = (patientId: string) => {
    setSelectedPatient(patientId);
    // Switch to compose tab
    const composeTab = document.querySelector('[data-value="compose"]') as HTMLElement;
    composeTab?.click();
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
              <MessageList messages={messages} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compose">
          <Card>
            <CardHeader>
              <CardTitle>Send Message</CardTitle>
            </CardHeader>
            <CardContent>
              <ComposeMessage
                patients={patients}
                selectedPatient={selectedPatient}
                setSelectedPatient={setSelectedPatient}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                onSendMessage={sendMessage}
                loading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Patient Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactsList patients={patients} onMessagePatient={handleMessagePatient} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
