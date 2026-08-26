export interface InvoiceResponseDTO {
  invoiceId: string;
  paymentId: string;
  invoiceNumber: string;
  clientId: string;
  trainerId: string;
  trainerFee: number;
  platformFee: number;
  totalAmount: number;
  currency: string;
  issuedAt: string;
  pdfUrl?: string | null;
  status: string;
}
