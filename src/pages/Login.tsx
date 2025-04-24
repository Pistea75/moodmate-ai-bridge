import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAuthFlow } from '../hooks/useAuthFlow';
import MainLayout from '../layouts/MainLayout';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isLoading, error, signIn, clearError } = useAuthFlow();
  
  useEffect(() => {
    if (user) {
      if (user.user_metadata?.role === 'clinician') {
        navigate('/clinician/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };
  
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-88px)] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to your MoodMate account
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} onChange={clearError}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-xs text-mood-purple hover:underline">
                      Forgot password?
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
                    disabled={isLoading}
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-mood-purple hover:bg-mood-purple-secondary"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account yet?{' '}
                <Link to="/" className="text-mood-purple hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t text-center">
              <div className="inline-flex items-center">
                <span className="text-sm text-muted-foreground mr-3">Language:</span>
                <select className="bg-white border px-2 py-1 rounded-md text-sm">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
