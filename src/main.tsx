
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { SecurityHeaders } from '@/components/security/SecurityHeaders'

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

createRoot(rootElement).render(
  <ErrorBoundary>
    <SecurityHeaders />
    <App />
  </ErrorBoundary>
);
