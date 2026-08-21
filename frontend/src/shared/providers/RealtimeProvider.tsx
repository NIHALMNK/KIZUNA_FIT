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

    const unCreated = queryBridge.registerRule('marketplace:request:created', (event) => [
      ['trainer-requests-pending'],
      ['trainer-requests'],
      ['trainer-request-detail', (event.payload as any)?.requestId || ''],
    ]);

    const unAccepted = queryBridge.registerRule('marketplace:request:accepted', (event) => [
      ['trainer-requests'],
      ['trainer-requests-pending'],
      ['trainer-requests-history'],
      ['trainer-request-detail', (event.payload as any)?.requestId || ''],
    ]);

    const unRejected = queryBridge.registerRule('marketplace:request:rejected', (event) => [
      ['trainer-requests'],
      ['trainer-requests-pending'],
      ['trainer-requests-history'],
      ['trainer-request-detail', (event.payload as any)?.requestId || ''],
    ]);

    const unWithdrawn = queryBridge.registerRule('marketplace:request:withdrawn', (event) => [
      ['trainer-requests'],
      ['trainer-requests-pending'],
      ['trainer-requests-history'],
      ['trainer-request-detail', (event.payload as any)?.requestId || ''],
    ]);

    const unClosed = queryBridge.registerRule('marketplace:request:closed', (event) => [
      ['trainer-requests'],
      ['trainer-requests-pending'],
      ['trainer-requests-history'],
      ['consultations'],
      ['trainer-request-detail', (event.payload as any)?.requestId || ''],
    ]);

    const unTrainerAvailability = queryBridge.registerRule(
      'profile:trainer:availability-changed',
      (event) => [
        ['searchTrainers'],
        ['publicTrainerProfile', (event.payload as any)?.trainerUserId || ''],
        ['publicTrainerProfile', (event.payload as any)?.trainerProfileId || ''],
        ['trainerAvailability'],
        ['trainerProfile'],
      ],
    );

    const unTrainerUpdated = queryBridge.registerRule('profile:trainer:updated', (event) => [
      ['searchTrainers'],
      ['publicTrainerProfile', (event.payload as Record<string, unknown>)?.trainerUserId || ''],
      ['publicTrainerProfile', (event.payload as Record<string, unknown>)?.trainerProfileId || ''],
      ['publicTrainerProfile', event.entityId || ''],
      ['publicTrainerProfile'],
    ]);

    const unConsultationCreated = queryBridge.registerRule('consultation:created', (event) => [
      ['consultations'],
      ['client-dashboard', 'upcoming-consultations'],
      ['consultations', 'detail', (event.payload as Record<string, unknown>)?.consultationId || ''],
    ]);

    const unConsultationScheduled = queryBridge.registerRule('consultation:scheduled', (event) => [
      ['consultations'],
      ['client-dashboard', 'upcoming-consultations'],
      ['consultations', 'detail', (event.payload as Record<string, unknown>)?.consultationId || ''],
    ]);

    const unConsultationCancelled = queryBridge.registerRule('consultation:cancelled', (event) => [
      ['consultations'],
      ['client-dashboard', 'upcoming-consultations'],
      ['consultations', 'detail', (event.payload as Record<string, unknown>)?.consultationId || ''],
    ]);

    const unConsultationCompleted = queryBridge.registerRule('consultation:completed', (event) => [
      ['consultations'],
      ['client-dashboard', 'upcoming-consultations'],
      ['consultations', 'detail', (event.payload as Record<string, unknown>)?.consultationId || ''],
    ]);

    const unConsultationNoShow = queryBridge.registerRule('consultation:no-show', (event) => [
      ['consultations'],
      ['client-dashboard', 'upcoming-consultations'],
      ['consultations', 'detail', (event.payload as Record<string, unknown>)?.consultationId || ''],
    ]);

    const unOfferCreated = queryBridge.registerRule('offer:created', (event) => [
      ['offers'],
      ['offers', 'sent'],
      ['client-dashboard', 'pending-offers'],
      ['offers', 'detail', (event.payload as Record<string, unknown>)?.offerId || ''],
    ]);

    const unOfferSent = queryBridge.registerRule('offer:sent', (event) => [
      ['offers'],
      ['offers', 'sent'],
      ['offers', 'received'],
      ['client-dashboard', 'pending-offers'],
      ['offers', 'detail', (event.payload as Record<string, unknown>)?.offerId || ''],
    ]);

    const unOfferAccepted = queryBridge.registerRule('offer:accepted', (event) => [
      ['offers'],
      ['offers', 'sent'],
      ['offers', 'received'],
      ['client-dashboard', 'pending-offers'],
      ['offers', 'detail', (event.payload as Record<string, unknown>)?.offerId || ''],
    ]);

    const unOfferDeclined = queryBridge.registerRule('offer:declined', (event) => [
      ['offers'],
      ['offers', 'sent'],
      ['offers', 'received'],
      ['client-dashboard', 'pending-offers'],
      ['offers', 'detail', (event.payload as Record<string, unknown>)?.offerId || ''],
    ]);

    const unOfferExpired = queryBridge.registerRule('offer:expired', (event) => [
      ['offers'],
      ['offers', 'sent'],
      ['offers', 'received'],
      ['client-dashboard', 'pending-offers'],
      ['offers', 'detail', (event.payload as Record<string, unknown>)?.offerId || ''],
    ]);

    return () => {
      unCreated();
      unAccepted();
      unRejected();
      unWithdrawn();
      unClosed();
      unTrainerAvailability();
      unTrainerUpdated();
      unConsultationCreated();
      unConsultationScheduled();
      unConsultationCancelled();
      unConsultationCompleted();
      unConsultationNoShow();
      unOfferCreated();
      unOfferSent();
      unOfferAccepted();
      unOfferDeclined();
      unOfferExpired();
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
