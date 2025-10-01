
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      "f3cc6bef-d0f6-437b-94c2-1f2a3b9cdc41.lovableproject.com", 
      "localhost"
    ],
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true, // Generate source maps for production debugging
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('react-router-dom')) {
              return 'vendor-router';
            }
            // Supabase in separate chunk
            if (id.includes('@supabase/supabase-js')) {
              return 'vendor-supabase';
            }
            // React Query in separate chunk
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-query';
            }
            // i18n libraries
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'vendor-i18n';
            }
            // All Radix UI components together
            if (id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            // Lucide icons
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // Charts library
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            // Other utilities
            if (id.includes('date-fns') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'vendor-utils';
            }
            // All other node_modules
            return 'vendor-other';
          }
          
          // Split by feature area for better code splitting
          if (id.includes('/src/pages/patient/')) {
            return 'pages-patient';
          }
          if (id.includes('/src/pages/clinician/')) {
            return 'pages-clinician';
          }
          if (id.includes('/src/pages/admin/')) {
            return 'pages-admin';
          }
          if (id.includes('/src/components/patient/')) {
            return 'components-patient';
          }
          if (id.includes('/src/components/clinician/')) {
            return 'components-clinician';
          }
          if (id.includes('/src/components/admin/')) {
            return 'components-admin';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
}));
