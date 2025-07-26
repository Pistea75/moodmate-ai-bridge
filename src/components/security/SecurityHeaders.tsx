
import { useEffect } from 'react';
import { generateCSPNonce } from '@/utils/enhancedSecurityUtils';

export function SecurityHeaders() {
  useEffect(() => {
    // Generate CSP nonce for inline scripts if needed
    const nonce = generateCSPNonce();
    
    // Set security-related meta tags
    const metaTags = [
      {
        name: 'X-Content-Type-Options',
        content: 'nosniff'
      },
      {
        name: 'X-Frame-Options',
        content: 'DENY'
      },
      {
        name: 'X-XSS-Protection',
        content: '1; mode=block'
      },
      {
        name: 'Referrer-Policy',
        content: 'strict-origin-when-cross-origin'
      },
      {
        name: 'Permissions-Policy',
        content: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
      }
    ];

    // Add meta tags to head
    metaTags.forEach(({ name, content }) => {
      const existingTag = document.querySelector(`meta[name="${name}"]`);
      if (!existingTag) {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    });

    // Set CSP via meta tag (backup for when headers aren't available)
    const cspContent = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://otrhbyzjrhsqrltdedon.supabase.co wss://otrhbyzjrhsqrltdedon.supabase.co",
      "frame-ancestors 'none'"
    ].join('; ');

    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!cspMeta) {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'Content-Security-Policy');
      meta.content = cspContent;
      document.head.appendChild(meta);
    }

    return () => {
      // Cleanup is not necessary for meta tags as they persist
    };
  }, []);

  return null; // This component doesn't render anything
}
