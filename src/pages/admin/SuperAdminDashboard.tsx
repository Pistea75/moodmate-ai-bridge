
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, Settings, Shield, Database, Activity, AlertTriangle, 
  Eye, Trash2, Edit, Plus, Lock, Unlock, UserCheck, UserX 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';

interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  user_role: string;
  status: string;
  created_at: string;
  last_active_at: string;
  is_super_admin: boolean;
}

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description: string;
  updated_at: string;
}

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isSuperAdmin, loading: superAdminLoading } = useSuperAdmin();
  const [users, setUsers] = useState<UserData[]>([]);
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalClinicians: 0,
    activeUsers: 0,
    newUsersToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  useEffect(() => {
    if (!superAdminLoading && !isSuperAdmin) {
      toast.error('Access denied. Super admin privileges required.');
      navigate('/');
      return;
    }
    
    if (isSuperAdmin) {
      fetchData();
    }
  }, [user, isSuperAdmin, superAdminLoading, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      setUsers(usersData || []);

      // Calculate stats
      const totalUsers = usersData?.length || 0;
      const totalPatients = usersData?.filter(u => u.role === 'patient' || u.user_role === 'patient').length || 0;
      const totalClinicians = usersData?.filter(u => u.role === 'clinician' || u.user_role === 'clinician').length || 0;
      const today = new Date().toISOString().split('T')[0];
      const newUsersToday = usersData?.filter(u => 
        u.created_at?.startsWith(today)
      ).length || 0;

      setStats({
        totalUsers,
        totalPatients,
        totalClinicians,
        activeUsers: usersData?.filter(u => u.status === 'active').length || 0,
        newUsersToday
      });

      // Fetch system settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('system_settings')
        .select('*')
        .order('setting_key');

      if (settingsError) throw settingsError;
      setSettings(settingsData || []);

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));

      toast.success(`User status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const updateSystemSetting = async (settingKey: string, newValue: any) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({ 
          setting_value: newValue,
          updated_by: user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', settingKey);

      if (error) throw error;

      setSettings(prev => prev.map(setting => 
        setting.setting_key === settingKey 
          ? { ...setting, setting_value: newValue }
          : setting
      ));

      toast.success('System setting updated');
    } catch (error) {
      console.error('Error updating system setting:', error);
      toast.error('Failed to update system setting');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });

      if (error) throw error;

      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  if (superAdminLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="h-8 w-8 text-red-600" />
              Super Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">System management with PHI protection</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="px-3 py-1">
              SUPER ADMIN ACCESS
            </Badge>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/super-admin-panel')}
            >
              PHI Access Panel
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients</CardTitle>
              <UserCheck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalPatients}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clinicians</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalClinicians}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Today</CardTitle>
              <Plus className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.newUsersToday}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
            <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((userData) => (
                        <TableRow key={userData.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {userData.first_name} {userData.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{userData.id}</div>
                            </div>
                          </TableCell>
                          <TableCell>{userData.email}</TableCell>
                          <TableCell>
                            <Badge variant={userData.role === 'clinician' ? 'default' : 'secondary'}>
                              {userData.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={userData.status === 'active' ? 'default' : 'destructive'}>
                              {userData.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(userData.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedUser(userData)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Select
                                value={userData.status}
                                onValueChange={(value) => updateUserStatus(userData.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                  <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteUser(userData.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {settings.map((setting) => (
                  <div key={setting.setting_key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">{setting.setting_key}</Label>
                      <Badge variant="outline">{typeof setting.setting_value}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{setting.description}</p>
                    
                    {typeof setting.setting_value === 'boolean' ? (
                      <Switch
                        checked={setting.setting_value}
                        onCheckedChange={(checked) => 
                          updateSystemSetting(setting.setting_key, checked)
                        }
                      />
                    ) : typeof setting.setting_value === 'object' ? (
                      <Textarea
                        value={JSON.stringify(setting.setting_value, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            updateSystemSetting(setting.setting_key, parsed);
                          } catch (error) {
                            // Invalid JSON, don't update
                          }
                        }}
                        className="font-mono text-sm"
                        rows={4}
                      />
                    ) : (
                      <Input
                        value={setting.setting_value}
                        onChange={(e) => 
                          updateSystemSetting(setting.setting_key, e.target.value)
                        }
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Activity logs will be displayed here once implemented.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
