import { PaymentResponseDTO } from './payment-response.dto';

export interface ListPaymentsQueryDTO {
  userId: string;
  role: 'CLIENT' | 'TRAINER' | 'ADMIN';
  limit?: number;
  offset?: number;
}

export interface ListPaymentsResponseDTO {
  payments: PaymentResponseDTO[];
  total: number;
  limit: number;
  offset: number;
}
