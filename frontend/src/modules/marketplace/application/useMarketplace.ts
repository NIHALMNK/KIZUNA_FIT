import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceApi } from '../infrastructure/api/marketplaceApi';
import {
  CreateTrainerRequestPayload,
  RejectTrainerRequestPayload,
  TrainerRequestsQueryParams,
} from '../domain/types';
import { toast } from 'sonner';

export const MARKETPLACE_QUERY_KEYS = {
  allRequests: (params?: TrainerRequestsQueryParams) => ['trainer-requests', params] as const,
  pendingRequests: (params?: TrainerRequestsQueryParams) =>
    ['trainer-requests-pending', params] as const,
  historyRequests: (params?: TrainerRequestsQueryParams) =>
    ['trainer-requests-history', params] as const,
  requestDetail: (id: string) => ['trainer-request-detail', id] as const,
};

export function useGetTrainerRequests(params?: TrainerRequestsQueryParams) {
  return useQuery({
    queryKey: MARKETPLACE_QUERY_KEYS.allRequests(params),
    queryFn: () => marketplaceApi.listRequests(params),
  });
}

export function useGetPendingTrainerRequests(params?: TrainerRequestsQueryParams) {
  return useQuery({
    queryKey: MARKETPLACE_QUERY_KEYS.pendingRequests(params),
    queryFn: () => marketplaceApi.getPendingRequests(params),
  });
}

export function useGetTrainerRequestHistory(params?: TrainerRequestsQueryParams) {
  return useQuery({
    queryKey: MARKETPLACE_QUERY_KEYS.historyRequests(params),
    queryFn: () => marketplaceApi.getRequestHistory(params),
  });
}

export function useGetTrainerRequestDetail(requestId?: string) {
  return useQuery({
    queryKey: MARKETPLACE_QUERY_KEYS.requestDetail(requestId || ''),
    queryFn: () => marketplaceApi.getRequestById(requestId!),
    enabled: !!requestId,
  });
}

export function useCreateTrainerRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTrainerRequestPayload) => marketplaceApi.createRequest(payload),
    onSuccess: () => {
      toast.success('Coaching request submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['trainer-requests'] });
      queryClient.invalidateQueries({ queryKey: ['trainer-requests-pending'] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message || err?.message || 'Failed to submit trainer request.';
      toast.error(msg);
    },
  });
}

export function useAcceptTrainerRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => marketplaceApi.acceptRequest(requestId),
    onSuccess: (_data, requestId) => {
      toast.success('Trainer request accepted!');
      queryClient.invalidateQueries({ queryKey: ['trainer-requests'] });
      queryClient.invalidateQueries({ queryKey: ['trainer-requests-pending'] });
      queryClient.invalidateQueries({ queryKey: ['trainer-requests-history'] });
      if (requestId) {
        queryClient.invalidateQueries({
          queryKey: MARKETPLACE_QUERY_KEYS.requestDetail(requestId),
        });
      }
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message || err?.message || 'Failed to accept trainer request.';
      toast.error(msg);
    },
  });
}

export function useRejectTrainerRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      payload,
    }: {
      requestId: string;
      payload?: RejectTrainerRequestPayload;
    }) => marketplaceApi.rejectRequest(requestId, payload),
    onSuccess: (_data, variables) => {
      const requestId = variables?.requestId;
      toast.success('Trainer request rejected.');
      queryClient.invalidateQueries({ queryKey: ['trainer-requests'] });
      queryClient.invalidateQueries({ queryKey: ['trainer-requests-pending'] });
      queryClient.invalidateQueries({ queryKey: ['trainer-requests-history'] });
      if (requestId) {
        queryClient.invalidateQueries({
          queryKey: MARKETPLACE_QUERY_KEYS.requestDetail(requestId),
        });
      }
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message || err?.message || 'Failed to reject trainer request.';
      toast.error(msg);
    },
  });
}

export function useWithdrawTrainerRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => marketplaceApi.withdrawRequest(requestId),
    onSuccess: (_data, requestId) => {
      toast.success('Trainer request withdrawn successfully.');
      queryClient.invalidateQueries({ queryKey: ['trainer-requests'] });
      queryClient.invalidateQueries({ queryKey: ['trainer-requests-pending'] });
      queryClient.invalidateQueries({ queryKey: ['trainer-requests-history'] });
      if (requestId) {
        queryClient.invalidateQueries({
          queryKey: MARKETPLACE_QUERY_KEYS.requestDetail(requestId),
        });
      }
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message || err?.message || 'Failed to withdraw trainer request.';
      toast.error(msg);
    },
  });
}

export function useSwitchTrainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload?: { reason?: string }) => marketplaceApi.switchTrainer(payload),
    onSuccess: () => {
      toast.success('Pre-coaching trainer switch completed.');
      queryClient.invalidateQueries({ queryKey: ['trainer-requests'] });
      queryClient.invalidateQueries({ queryKey: ['trainer-requests-pending'] });
      queryClient.invalidateQueries({ queryKey: ['trainer-requests-history'] });
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
      queryClient.invalidateQueries({ queryKey: ['client-dashboard'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to switch trainer.';
      toast.error(msg);
    },
  });
}
