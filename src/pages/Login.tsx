import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useAuthFlow } from '../hooks/useAuthFlow';
import MainLayout from '../layouts/MainLayout';
import { AlertCircle, Loader2, Wifi, WifiOff, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchUserProfile } from '@/utils/supabase/profile';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showSuccess, setShowSuccess] = useState(false);
  const { user, authError } = useAuth();
  const { t, i18n } = useTranslation();
  const { isLoading, error, signIn, clearError } = useAuthFlow();
  
  // Monitor connection status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  useEffect(() => {
  const loadProfile = async () => {
    try {
      if (user) {
        setShowSuccess(true);
        const profile = await fetchUserProfile();
        console.log('✅ Profile loaded:', profile);
        // Optional: Store in context or redirect based on role
      }
    } catch (error) {
      console.error('❌ Failed to fetch user profile:', error);
    }
  };

  loadProfile();
}, [user]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isOnline) {
      return;
    }
    
    const success = await signIn(email, password);
    if (success) {
      setShowSuccess(true);
    }
  };

  const displayError = error || authError;
  
  // Helper function to get error message
  const getErrorMessage = (error: typeof displayError): string => {
    if (!error) return '';
    if (typeof error === 'string') return error;
    return error.message || 'An unexpected error occurred';
  };

  // Show success state
  if (showSuccess && user) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-88px)] flex items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Login Successful!</h2>
              <p className="text-muted-foreground mb-4">
                Welcome back! Redirecting you to your dashboard...
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-88px)] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">{t('auth.welcome')}</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to your MoodMate account
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            {!isOnline && (
              <Alert variant="destructive" className="mb-6">
                <WifiOff className="h-4 w-4" />
                <AlertDescription>
                  You're offline. Please check your internet connection.
                </AlertDescription>
              </Alert>
            )}
            
            {displayError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Login Failed</strong>
                  <br />
                  {getErrorMessage(displayError)}
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} onChange={clearError}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    {t('auth.email')}
                  </label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                    placeholder="you@example.com"
                    disabled={isLoading || !isOnline}
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium">
                      {t('auth.password')}
                    </label>
                    <Link to="/forgot-password" className="text-xs text-mood-purple hover:underline">
                      {t('auth.forgotPassword')}
                    </Link>
                  </div>
                  <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full"
                    placeholder="••••••••"
                    disabled={isLoading || !isOnline}
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading || !isOnline}
                  className="w-full bg-mood-purple hover:bg-mood-purple-secondary"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('common.loading')}
                    </>
                  ) : (
                    t('auth.signIn')
                  )}
                </Button>
              </div>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account yet?{' '}
                <Link to="/" className="text-mood-purple hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center">
                  <span className="text-sm text-muted-foreground mr-3">{t('common.language')}:</span>
                  <select 
                    className="bg-white border px-2 py-1 rounded-md text-sm"
                    value={i18n.language}
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  {isOnline ? (
                    <><Wifi className="h-4 w-4 mr-1 text-green-500" />Online</>
                  ) : (
                    <><WifiOff className="h-4 w-4 mr-1 text-red-500" />Offline</>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
