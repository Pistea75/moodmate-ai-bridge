import { useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logEnhancedSecurityEvent } from '@/utils/enhancedSecurityUtils';

interface SecurityMonitorProps {
  children: React.ReactNode;
}

export function SecurityMonitor({ children }: SecurityMonitorProps) {
  const { toast } = useToast();

  const detectSecurityThreats = useCallback(async () => {
    try {
      // Monitor for console tampering
      if (typeof console.clear !== 'function') {
        await logEnhancedSecurityEvent({
          action: 'console_tampering_detected',
          resource: 'browser_security',
          success: false,
          riskScore: 70
        });
      }

      // Monitor for developer tools
      const devtools = {
        open: false,
        orientation: null
      };

      const threshold = 160;
      setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
          if (!devtools.open) {
            devtools.open = true;
            logEnhancedSecurityEvent({
              action: 'developer_tools_detected',
              resource: 'browser_security',
              success: false,
              details: {
                window_dimensions: {
                  outer: { width: window.outerWidth, height: window.outerHeight },
                  inner: { width: window.innerWidth, height: window.innerHeight }
                }
              },
              riskScore: 30
            });
          }
        } else {
          devtools.open = false;
        }
      }, 500);

      // Monitor for script injection attempts
      const originalCreateElement = document.createElement;
      document.createElement = function(tagName: string) {
        const element = originalCreateElement.call(this, tagName);
        
        if (tagName.toLowerCase() === 'script') {
          logEnhancedSecurityEvent({
            action: 'dynamic_script_creation',
            resource: 'dom_security',
            success: false,
            details: {
              tag: tagName,
              stack: new Error().stack
            },
            riskScore: 60
          });
        }
        
        return element;
      };

      // Monitor for location changes that might indicate attacks
      let lastLocation = window.location.href;
      setInterval(() => {
        if (window.location.href !== lastLocation) {
          const suspicious = window.location.href.includes('javascript:') ||
                           window.location.href.includes('data:') ||
                           window.location.href.includes('vbscript:');
          
          if (suspicious) {
            logEnhancedSecurityEvent({
              action: 'suspicious_location_change',
              resource: 'browser_security',
              success: false,
              details: {
                previous: lastLocation,
                current: window.location.href
              },
              riskScore: 90
            });
            
            // Redirect to safe location
            window.location.href = '/';
          }
          
          lastLocation = window.location.href;
        }
      }, 1000);

    } catch (error) {
      console.error('Security monitoring error:', error);
    }
  }, []);

  const monitorNetworkRequests = useCallback(async () => {
    try {
      // Monitor fetch requests for suspicious patterns
      const originalFetch = window.fetch;
      window.fetch = async function(...args) {
        const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
        
        // Check for suspicious requests
        if (url.includes('eval(') || 
            url.includes('javascript:') || 
            url.includes('data:text/html') ||
            url.match(/[<>]/)) {
          
          await logEnhancedSecurityEvent({
            action: 'suspicious_fetch_request',
            resource: 'network_security',
            success: false,
            details: {
              url: url,
              args: JSON.stringify(args[1] || {})
            },
            riskScore: 85
          });
          
          throw new Error('Suspicious request blocked');
        }
        
        return originalFetch.apply(this, args);
      };

    } catch (error) {
      console.error('Network monitoring error:', error);
    }
  }, []);

  useEffect(() => {
    detectSecurityThreats();
    monitorNetworkRequests();

    // Monitor for clipboard access attempts
    const handleCopy = async (event: ClipboardEvent) => {
      await logEnhancedSecurityEvent({
        action: 'clipboard_access',
        resource: 'browser_security',
        success: true,
        details: { type: 'copy' }
      });
    };

    const handlePaste = async (event: ClipboardEvent) => {
      await logEnhancedSecurityEvent({
        action: 'clipboard_access',
        resource: 'browser_security',
        success: true,
        details: { type: 'paste' }
      });
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
    };
  }, [detectSecurityThreats, monitorNetworkRequests]);

  return <>{children}</>;
}