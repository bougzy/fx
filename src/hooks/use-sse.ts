'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSSEOptions {
  url: string;
  onMessage?: (data: unknown) => void;
  onError?: (error: Event) => void;
  reconnectDelay?: number;
}

export function useSSE({ url, onMessage, onError, reconnectDelay = 3000 }: UseSSEOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<unknown>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout>(null);

  const connect = useCallback(() => {
    if (eventSourceRef.current) eventSourceRef.current.close();

    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onopen = () => setIsConnected(true);
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastEvent(data);
        onMessage?.(data);
      } catch {
        setLastEvent(event.data);
        onMessage?.(event.data);
      }
    };
    es.onerror = (event) => {
      setIsConnected(false);
      onError?.(event);
      es.close();
      reconnectTimerRef.current = setTimeout(connect, reconnectDelay);
    };
  }, [url, onMessage, onError, reconnectDelay]);

  useEffect(() => {
    connect();
    return () => {
      eventSourceRef.current?.close();
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    };
  }, [connect]);

  return { isConnected, lastEvent };
}
