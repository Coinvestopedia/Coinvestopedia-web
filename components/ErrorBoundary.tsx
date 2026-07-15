import React, { ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error:', error, info);

    const isChunkError = 
      error.message?.includes('Failed to fetch dynamically imported module') ||
      error.message?.includes('ChunkLoadError') ||
      error.message?.includes('Failed to fetch module script') ||
      error.name === 'ChunkLoadError';

    if (isChunkError) {
      console.warn("Chunk/Dynamic Import load error detected. Automatically reloading page to fetch latest version...");
      const lastReload = window.sessionStorage.getItem('chunk-reload-time');
      const now = Date.now();
      if (!lastReload || (now - parseInt(lastReload)) > 10000) {
        window.sessionStorage.setItem('chunk-reload-time', now.toString());
        
        const url = new URL(window.location.href);
        url.searchParams.set('t', now.toString());
        window.location.href = url.toString();
      }
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-xl border border-border bg-surface text-text">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-text-muted mb-4">An unexpected error occurred. You can try reloading the app or contact support.</p>
          <div className="flex gap-3">
            <Button onClick={() => window.location.reload()}>Reload</Button>
            <Button variant="secondary" onClick={this.reset}>Dismiss</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;