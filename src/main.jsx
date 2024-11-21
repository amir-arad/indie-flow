import './index.css';
import RCVLFApp from './components/main';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from "@/components/ui/toaster";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RCVLFApp />
    <Toaster />
  </React.StrictMode>
);