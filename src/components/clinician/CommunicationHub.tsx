
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DirectMessaging } from './communication/DirectMessaging';
import { NotificationsPanel } from './NotificationsPanel';

export function CommunicationHub() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Direct Messages</h1>
        <p className="text-muted-foreground">
          Stay connected with your patients and manage notifications
        </p>
      </div>

      <Tabs defaultValue="messages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="messages">Direct Messages</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages">
          <DirectMessaging />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
