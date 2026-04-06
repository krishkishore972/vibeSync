"use client";

import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[200px] p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="font-serif text-[15px] font-medium text-red-400 mb-2">
            Something went wrong
          </h3>
          <p className="font-mono text-[11px] text-[#6B5F50] text-center mb-4 max-w-xs">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 rounded-lg bg-[#E8A030]/10 hover:bg-[#E8A030]/20 border border-[#E8A030]/30 text-[#C8892A] font-mono text-[11px] transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function RoomPageErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex flex-col items-center justify-center h-screen bg-[#0C0A08] text-[#F5EDD8]">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="font-serif text-xl font-medium text-red-400 mb-2">
            Room Error
          </h2>
          <p className="font-mono text-[13px] text-[#6B5F50] mb-6 text-center max-w-md">
            Something went wrong loading this room. Please try refreshing the
            page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-[#E8A030]/10 hover:bg-[#E8A030]/20 border border-[#E8A030]/30 text-[#C8892A] font-mono text-[12px] transition-colors cursor-pointer"
          >
            Refresh Page
          </button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
