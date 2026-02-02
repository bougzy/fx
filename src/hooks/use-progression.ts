'use client';

import { useState, useEffect, useCallback } from 'react';

interface ProgressionStatus {
  currentStage: string;
  canAdvance: boolean;
  criteria: Record<string, { met: boolean; current: number; required: number; label: string }>;
  regressionRisk: boolean;
}

export function useProgression() {
  const [status, setStatus] = useState<ProgressionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgression = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/analytics/progression');
      if (!res.ok) throw new Error('Failed to fetch progression');
      const data = await res.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgression();
  }, [fetchProgression]);

  return { status, isLoading, error, refetch: fetchProgression };
}
