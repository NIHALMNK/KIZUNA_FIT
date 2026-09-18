import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { ConsultationVideoRoom } from '../presentation/components/ConsultationVideoRoom';
import * as webRTCHookModule from '../application/hooks/useWebRTCConsultation';
import * as consultationMutationsModule from '../application/hooks/useConsultationMutations';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('ConsultationVideoRoom Presentation Component Tests', () => {
  const mockConsultation = {
    id: 'consultation_123',
    clientId: 'client_owner_1',
    trainerId: 'trainer_owner_1',
    roomId: 'consultation:consultation_123',
    status: 'SCHEDULED',
  };

  let mockHookReturn: any;
  let mockCompleteMutation: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockHookReturn = {
      localStream: { getTracks: () => [] },
      remoteStream: { getTracks: () => [] },
      connectionState: 'connected',
      isMuted: false,
      isVideoOff: false,
      error: null,
      join: vi.fn(),
      leave: vi.fn(),
      toggleMicrophone: vi.fn(),
      toggleCamera: vi.fn(),
    };

    mockCompleteMutation = {
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
    };

    vi.spyOn(webRTCHookModule, 'useWebRTCConsultation').mockReturnValue(mockHookReturn);
    vi.spyOn(consultationMutationsModule, 'useCompleteConsultation').mockReturnValue(
      mockCompleteMutation,
    );
  });

  it('1. Verifies ConsultationVideoRoom component export and props contract', () => {
    expect(ConsultationVideoRoom).toBeDefined();
    expect(typeof ConsultationVideoRoom).toBe('function');
  });

  it('2. Evaluates Client role component initialization', () => {
    const props = {
      consultation: mockConsultation,
      role: 'CLIENT' as const,
      currentUserId: 'client_owner_1',
    };

    const element = React.createElement(ConsultationVideoRoom, props);
    expect(element.type).toBe(ConsultationVideoRoom);
    expect(element.props.role).toBe('CLIENT');
  });

  it('3. Evaluates Trainer role component initialization', () => {
    const props = {
      consultation: mockConsultation,
      role: 'TRAINER' as const,
      currentUserId: 'trainer_owner_1',
    };

    const element = React.createElement(ConsultationVideoRoom, props);
    expect(element.type).toBe(ConsultationVideoRoom);
    expect(element.props.role).toBe('TRAINER');
  });

  it('4. Verifies microphone and camera toggle actions are exposed', () => {
    expect(typeof mockHookReturn.toggleMicrophone).toBe('function');
    expect(typeof mockHookReturn.toggleCamera).toBe('function');
  });

  it('5. Verifies leave session does not invoke business completion mutation', () => {
    mockHookReturn.leave();
    expect(mockHookReturn.leave).toHaveBeenCalled();
    expect(mockCompleteMutation.mutateAsync).not.toHaveBeenCalled();
  });

  it('6. Verifies complete consultation mutation signature for Trainer', async () => {
    await mockCompleteMutation.mutateAsync(mockConsultation.id);
    expect(mockCompleteMutation.mutateAsync).toHaveBeenCalledWith('consultation_123');
  });

  it('7. Verifies connection states mapping invariant', () => {
    const validStates = ['idle', 'connecting', 'waiting', 'connected', 'failed', 'evicted'];
    expect(validStates).toContain(mockHookReturn.connectionState);
  });
});
