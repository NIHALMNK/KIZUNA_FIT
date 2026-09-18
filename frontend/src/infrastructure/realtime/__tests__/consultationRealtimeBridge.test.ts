import { describe, it, expect, vi } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { RealtimeQueryBridge } from '../../../shared/infrastructure/realtime/realtimeQueryBridge';

function createMockQueryClient(): QueryClient {
  return {
    invalidateQueries: vi.fn(),
  } as unknown as QueryClient;
}

describe('Consultation Realtime Query Bridge Rules', () => {
  it('should register invalidation rules for consultation events and trigger query invalidation', () => {
    const mockQueryClient = createMockQueryClient();
    const bridge = new RealtimeQueryBridge(mockQueryClient);

    const upcomingConsultationKey = ['client-dashboard', 'upcoming-consultations'];

    const unCreated = bridge.registerRule('consultation:created', () => [upcomingConsultationKey]);
    const unScheduled = bridge.registerRule('consultation:scheduled', () => [
      upcomingConsultationKey,
    ]);
    const unCancelled = bridge.registerRule('consultation:cancelled', () => [
      upcomingConsultationKey,
    ]);
    const unCompleted = bridge.registerRule('consultation:completed', () => [
      upcomingConsultationKey,
    ]);
    const unNoShow = bridge.registerRule('consultation:no-show', () => [upcomingConsultationKey]);

    expect(typeof unCreated).toBe('function');
    expect(typeof unScheduled).toBe('function');
    expect(typeof unCancelled).toBe('function');
    expect(typeof unCompleted).toBe('function');
    expect(typeof unNoShow).toBe('function');

    bridge.handleReconnect();
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith();

    unCreated();
    unScheduled();
    unCancelled();
    unCompleted();
    unNoShow();
  });
});
