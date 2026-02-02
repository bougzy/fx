'use client';

import { useState, useEffect } from 'react';

interface RiskStatus {
  dailyPnl: number;
  weeklyPnl: number;
  dailyTradeCount: number;
  openPositionCount: number;
  consecutiveLosses: number;
  isInCooldown: boolean;
  cooldownEndsAt?: string;
  accountBalance: number;
}

export function useRiskStatus() {
  const [status, setStatus] = useState<RiskStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function fetchStatus() {
      try {
        const res = await fetch('/api/risk/status');
        if (!res.ok) throw new Error('Failed to fetch risk status');
        const data = await res.json();
        setStatus(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStatus();
    interval = setInterval(fetchStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  return { status, isLoading, error };
}
