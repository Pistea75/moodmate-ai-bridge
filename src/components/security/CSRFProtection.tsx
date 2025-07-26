
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { csrfManager } from '@/utils/enhancedSecurityUtils';

interface CSRFContextType {
  token: string | null;
  refreshToken: () => Promise<void>;
  validateToken: (token: string) => Promise<boolean>;
}

const CSRFContext = createContext<CSRFContextType | undefined>(undefined);

interface CSRFProviderProps {
  children: ReactNode;
}

export function CSRFProvider({ children }: CSRFProviderProps) {
  const [token, setToken] = useState<string | null>(null);

  const refreshToken = async () => {
    const newToken = await csrfManager.generateToken();
    setToken(newToken);
  };

  const validateToken = async (tokenToValidate: string) => {
    return await csrfManager.validateToken(tokenToValidate);
  };

  useEffect(() => {
    refreshToken();
  }, []);

  return (
    <CSRFContext.Provider value={{ token, refreshToken, validateToken }}>
      {children}
    </CSRFContext.Provider>
  );
}

export function useCSRF() {
  const context = useContext(CSRFContext);
  if (context === undefined) {
    throw new Error('useCSRF must be used within a CSRFProvider');
  }
  return context;
}

interface CSRFInputProps {
  name?: string;
}

export function CSRFInput({ name = 'csrf_token' }: CSRFInputProps) {
  const { token } = useCSRF();
  
  if (!token) return null;
  
  return <input type="hidden" name={name} value={token} />;
}
