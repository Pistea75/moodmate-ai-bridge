
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'
import { ErrorBoundary } from '@/components/ErrorBoundary'

console.log('🚀 MoodMate starting...');
console.log('Environment:', import.meta.env.MODE);

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error('❌ Root element not found!');
  throw new Error("Failed to find the root element");
}

console.log('✅ Root element found, rendering app...');

createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

console.log('✅ App rendered successfully');
