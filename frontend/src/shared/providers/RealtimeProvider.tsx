'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../modules/identity/application/store/authStore';
import { tokenStorage } from '../../infrastructure/storage/TokenStorage';
import { socketClientService } from '../../infrastructure/realtime/SocketClientService';
import {
  RealtimeConnectionState,
  RealtimeEventHandler,
} from '../../infrastructure/realtime/realtime.types';
import { RealtimeQueryBridge } from '../infrastructure/realtime/realtimeQueryBridge';

interface RealtimeContextValue {
  connectionState: RealtimeConnectionState;
  subscribe: <T = unknown>(eventType: string, handler: RealtimeEventHandler<T>) => () => void;
  unsubscribe: <T = unknown>(eventType: string, handler: RealtimeEventHandler<T>) => void;
  queryBridge: RealtimeQueryBridge | null;
}

const RealtimeContext = createContext<RealtimeContextValue>({
  connectionState: 'DISCONNECTED',
  subscribe: () => () => {},
  unsubscribe: () => {},
  queryBridge: null,
});

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { status } = useAuthStore();
  const queryClient = useQueryClient();
  const [connectionState, setConnectionState] = useState<RealtimeConnectionState>(
    socketClientService.getState(),
  );

  const queryBridge = useMemo(() => new RealtimeQueryBridge(queryClient), [queryClient]);

  // Subscribe to SocketClientService connection state changes
  useEffect(() => {
    const unsubscribeState = socketClientService.onStateChange((newState) => {
      setConnectionState(newState);

      // On reconnection after disconnect, catch up missed events via global query invalidation
      if (newState === 'CONNECTED') {
        queryBridge.handleReconnect();
      }
    });

    return () => {
      unsubscribeState();
    };
  }, [queryBridge]);

  // Manage connection lifecycle based on authentication status
  useEffect(() => {
    if (status === 'authenticated') {
      const token = tokenStorage.getAccessToken();
      if (token) {
        socketClientService.connect(token);
      }
    } else if (status === 'unauthenticated') {
      socketClientService.disconnect();
    }
  }, [status]);

  // Register platform Marketplace realtime query invalidation rules
  useEffect(() => {
    if (!queryBridge) return;

    const unCreated = queryBridge.registerRule('marketplace:request:created', () => [
      ['trainer-requests-pending'],
      ['trainer-requests'],
    ]);

    const unAccepted = queryBridge.registerRule('marketplace:request:accepted', () => [
      ['trainer-requests'],
      ['trainer-requests-pending'],
      ['trainer-requests-history'],
    ]);

    const unRejected = queryBridge.registerRule('marketplace:request:rejected', () => [
      ['trainer-requests'],
      ['trainer-requests-pending'],
      ['trainer-requests-history'],
    ]);

    const unWithdrawn = queryBridge.registerRule('marketplace:request:withdrawn', () => [
      ['trainer-requests'],
      ['trainer-requests-pending'],
      ['trainer-requests-history'],
    ]);

    const unClosed = queryBridge.registerRule('marketplace:request:closed', () => [
      ['trainer-requests'],
      ['trainer-requests-history'],
    ]);

    return () => {
      unCreated();
      unAccepted();
      unRejected();
      unWithdrawn();
      unClosed();
    };
  }, [queryBridge]);

  const value = useMemo<RealtimeContextValue>(
    () => ({
      connectionState,
      subscribe: (eventType, handler) => socketClientService.subscribe(eventType, handler),
      unsubscribe: (eventType, handler) => socketClientService.unsubscribe(eventType, handler),
      queryBridge,
    }),
    [connectionState, queryBridge],
  );

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export function useRealtime() {
  return useContext(RealtimeContext);
}
