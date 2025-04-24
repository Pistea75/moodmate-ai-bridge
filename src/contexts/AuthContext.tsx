import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

type UserRole = 'patient' | 'clinician';

interface UserData {
  firstName?: string;
  lastName?: string;
  language?: string;
  role?: UserRole;
  [key: string]: any;
}

type AuthContextType = {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  signUp: (email: string, password: string, userData: UserData) => Promise<void>;
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

  const signUp = async (email: string, password: string, userData: UserData) => {
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
      
      await Promise.all([
        supabase.from('profiles').delete().eq('id', user.id),
        supabase.from('mood_entries').delete().eq('user_id', user.id),
        supabase.from('chat_reports').delete().eq('user_id', user.id),
        supabase.from('session_audio_uploads').delete().eq('user_id', user.id)
      ]);
      
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) {
        console.error("Error deleting user through admin API:", error);
        
        const { error: deleteError } = await supabase.functions.invoke('delete-user', {
          body: { userId: user.id },
        });
        
        if (deleteError) {
          console.error("Error in delete-user function:", deleteError);
          
          await supabase.auth.signOut();
          throw new Error("Could not fully delete account. Please contact support.");
        }
      } else {
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
