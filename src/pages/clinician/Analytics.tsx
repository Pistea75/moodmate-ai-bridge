
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { AdvancedAnalytics } from '@/components/clinician/AdvancedAnalytics';
import { NavigationTest } from '@/components/clinician/NavigationTest';
import { SystemCheck } from '@/components/clinician/SystemCheck';

export default function Analytics() {
  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics & System Tests</h1>
          <p className="text-gray-600 mt-1">
            View detailed analytics and run system diagnostics
          </p>
        </div>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="navigation">Navigation Test</TabsTrigger>
            <TabsTrigger value="system">System Check</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <AdvancedAnalytics />
          </TabsContent>

          <TabsContent value="navigation" className="space-y-6">
            <NavigationTest />
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <SystemCheck />
          </TabsContent>
        </Tabs>
      </div>
    </ClinicianLayout>
  );
}
