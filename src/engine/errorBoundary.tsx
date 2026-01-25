// Error boundary komponent React'i jaoks
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Game error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-black text-red-600 mb-2">Midagi läks valesti</h2>
          <p className="text-slate-600 mb-4 text-center max-w-md">
            Mängus tekkis viga. Proovi lehte värskendada.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-colors"
          >
            Värskenda lehte
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
