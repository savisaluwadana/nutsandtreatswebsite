import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  document.body.innerHTML = '<div style="color: red; padding: 20px;">Error: Root element not found</div>';
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error('Error rendering app:', error);
    rootElement.innerHTML = `
      <div style="color: red; padding: 20px; font-family: Arial, sans-serif;">
        <h2>Application Error</h2>
        <p>There was an error loading the application.</p>
        <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
        <p>Please check the browser console for more details.</p>
      </div>
    `;
  }
}
