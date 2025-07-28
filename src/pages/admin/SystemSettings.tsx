
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, Shield, Bell, Database, Mail, Lock, Save, RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description: string;
  category: string;
  updated_at: string;
}

export default function SystemSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isSuperAdmin, loading: superAdminLoading } = useSuperAdmin();
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!superAdminLoading && !isSuperAdmin) {
      toast.error('Access denied. Super admin privileges required.');
      navigate('/');
      return;
    }
    
    if (isSuperAdmin) {
      fetchSettings();
    }
  }, [user, isSuperAdmin, superAdminLoading, navigate]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // Since system_settings table doesn't exist yet, we'll show placeholder settings
      const placeholderSettings = [
        {
          id: '1',
          setting_key: 'maintenance_mode',
          setting_value: false,
          description: 'Enable maintenance mode to prevent user access',
          category: 'system',
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          setting_key: 'email_notifications',
          setting_value: true,
          description: 'Enable email notifications for system events',
          category: 'notifications',
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          setting_key: 'max_session_duration',
          setting_value: 60,
          description: 'Maximum session duration in minutes',
          category: 'security',
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          setting_key: 'backup_frequency',
          setting_value: 'daily',
          description: 'Database backup frequency',
          category: 'database',
          updated_at: new Date().toISOString()
        }
      ];
      
      setSettings(placeholderSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (settingKey: string, newValue: any) => {
    try {
      setSaving(true);
      // This would update the actual database when implemented
      setSettings(prev => prev.map(setting => 
        setting.setting_key === settingKey 
          ? { ...setting, setting_value: newValue, updated_at: new Date().toISOString() }
          : setting
      ));
      
      toast.success('Setting updated successfully');
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update setting');
    } finally {
      setSaving(false);
    }
  };

  const getSettingsByCategory = (category: string) => {
    return settings.filter(setting => setting.category === category);
  };

  if (superAdminLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Settings className="h-8 w-8 text-blue-600" />
              System Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Configure system-wide settings and preferences</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={fetchSettings} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Badge variant="outline" className="px-3 py-1 border-blue-200 text-blue-800 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700">
              SUPER ADMIN
            </Badge>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="system" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
          </TabsList>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {getSettingsByCategory('system').map((setting) => (
                  <div key={setting.setting_key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium text-gray-900 dark:text-white">
                        {setting.setting_key.replace(/_/g, ' ').toUpperCase()}
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        {typeof setting.setting_value}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{setting.description}</p>
                    
                    {typeof setting.setting_value === 'boolean' ? (
                      <Switch
                        checked={setting.setting_value}
                        onCheckedChange={(checked) => updateSetting(setting.setting_key, checked)}
                        disabled={saving}
                      />
                    ) : (
                      <Input
                        value={setting.setting_value}
                        onChange={(e) => updateSetting(setting.setting_key, e.target.value)}
                        disabled={saving}
                      />
                    )}
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Last updated: {new Date(setting.updated_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-amber-600" />
                  Security Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {getSettingsByCategory('security').map((setting) => (
                  <div key={setting.setting_key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium text-gray-900 dark:text-white">
                        {setting.setting_key.replace(/_/g, ' ').toUpperCase()}
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        {typeof setting.setting_value}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{setting.description}</p>
                    
                    <Input
                      value={setting.setting_value}
                      onChange={(e) => updateSetting(setting.setting_key, e.target.value)}
                      disabled={saving}
                    />
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Last updated: {new Date(setting.updated_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Bell className="h-5 w-5 text-green-600" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {getSettingsByCategory('notifications').map((setting) => (
                  <div key={setting.setting_key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium text-gray-900 dark:text-white">
                        {setting.setting_key.replace(/_/g, ' ').toUpperCase()}
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        {typeof setting.setting_value}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{setting.description}</p>
                    
                    <Switch
                      checked={setting.setting_value}
                      onCheckedChange={(checked) => updateSetting(setting.setting_key, checked)}
                      disabled={saving}
                    />
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Last updated: {new Date(setting.updated_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Settings */}
          <TabsContent value="database" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Database className="h-5 w-5 text-purple-600" />
                  Database Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {getSettingsByCategory('database').map((setting) => (
                  <div key={setting.setting_key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium text-gray-900 dark:text-white">
                        {setting.setting_key.replace(/_/g, ' ').toUpperCase()}
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        {typeof setting.setting_value}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{setting.description}</p>
                    
                    <Input
                      value={setting.setting_value}
                      onChange={(e) => updateSetting(setting.setting_key, e.target.value)}
                      disabled={saving}
                    />
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Last updated: {new Date(setting.updated_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
