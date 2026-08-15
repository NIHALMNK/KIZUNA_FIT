export interface SwitchTrainerDTO {
  clientId: string;
  reason?: string;
}

export interface SwitchTrainerResponseDTO {
  success: boolean;
  message: string;
  cancelledPipelineId: string;
}
