import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

type UserRole = 'patient' | 'clinician';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  signUp: (email: string, password: string, userData: object) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const role = session.user.user_metadata?.role as UserRole;
          setUserRole(role);
          
          if (event === 'SIGNED_IN') {
            toast({
              title: "Welcome",
              description: "You are now signed in.",
            });
            
            if (role === 'clinician') {
              navigate('/clinician/dashboard');
            } else {
              navigate('/patient/dashboard');
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUserRole(null);
          toast({
            title: "Signed out",
            description: "You have been signed out successfully.",
          });
          navigate('/login');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const role = session.user.user_metadata?.role as UserRole;
        setUserRole(role);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signUp = async (email: string, password: string, userData: object) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          "full name": userData.firstName && userData.lastName 
            ? `${userData.firstName} ${userData.lastName}` 
            : 'Unknown User',
          language: userData.language || 'en',
          role: userData.role || 'patient'
        }
      }
    });
    
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      if (!user) throw new Error("No user is currently logged in");
      
      // 1. First delete user data from related tables to avoid foreign key constraints
      await Promise.all([
        supabase.from('profiles').delete().eq('id', user.id),
        supabase.from('mood_entries').delete().eq('user_id', user.id),
        supabase.from('chat_reports').delete().eq('user_id', user.id),
        supabase.from('session_audio_uploads').delete().eq('user_id', user.id)
      ]);
      
      // 2. Call the Supabase Auth API to delete the user
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) {
        console.error("Error deleting user through admin API:", error);
        
        // 3. If admin API fails (expected in client context), use the alternative approach
        // Send a request to delete user's own account (supported in client context)
        const { error: deleteError } = await supabase.functions.invoke('delete-user', {
          body: { userId: user.id },
        });
        
        if (deleteError) {
          console.error("Error in delete-user function:", deleteError);
          
          // 4. As a last resort, still sign them out even if deletion failed
          await supabase.auth.signOut();
          throw new Error("Could not fully delete account. Please contact support.");
        }
      } else {
        // If admin deletion worked, still sign out to clear local state
        await supabase.auth.signOut();
      }
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      userRole,
      signUp, 
      signIn, 
      signOut,
      deleteAccount,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
