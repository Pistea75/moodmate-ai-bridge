import { useEffect } from 'react';
import { generateCSPNonce } from '@/utils/enhancedSecurityUtils';

export function SecurityHeaders() {
  useEffect(() => {
    // Generate CSP nonce for inline scripts if needed
    const nonce = generateCSPNonce();
    
    // Check if we're in development (Lovable preview)
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname.includes('lovable.dev');
    
    // Set security-related meta tags
    const metaTags = [
      {
        name: 'X-Content-Type-Options',
        content: 'nosniff'
      },
      // Don't set X-Frame-Options in development for Lovable iframe
      ...(isDevelopment ? [] : [{
        name: 'X-Frame-Options',
        content: 'DENY'
      }]),
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
      },
      // Add HSTS only in production
      ...(isDevelopment ? [] : [{
        name: 'Strict-Transport-Security',
        content: 'max-age=63072000; includeSubDomains; preload'
      }])
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

    // Set improved CSP via meta tag (backup for when headers aren't available)
    // Note: frame-ancestors directive is not supported in meta tags, use X-Frame-Options instead
    const cspContent = [
      "default-src 'self'",
      "script-src 'self' 'nonce-" + nonce + "' https://cdn.jsdelivr.net" + (isDevelopment ? " 'unsafe-eval'" : ""),
      "style-src 'self' 'nonce-" + nonce + "' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://otrhbyzjrhsqrltdedon.supabase.co wss://otrhbyzjrhsqrltdedon.supabase.co https://api.openai.com",
      "object-src 'none'",
      "base-uri 'self'"
    ].filter(Boolean).join('; ');

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