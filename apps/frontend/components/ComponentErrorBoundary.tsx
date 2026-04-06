"use client";

import React, { ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary";

interface ComponentErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  onReset?: () => void;
}

export function ComponentErrorBoundary({
  children,
  fallback,
  onReset,
}: ComponentErrorBoundaryProps) {
  return (
    <ErrorBoundary fallback={fallback} onReset={onReset}>
      {children}
    </ErrorBoundary>
  );
}
