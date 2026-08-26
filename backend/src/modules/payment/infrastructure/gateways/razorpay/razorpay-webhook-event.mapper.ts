import { RazorpayCurrencyHelper } from './razorpay-currency.helper';

export interface NormalizedWebhookEvent {
  eventId: string;
  eventType: string;
  providerPaymentId?: string;
  providerOrderId?: string;
  paymentId?: string; // from notes/metadata
  amount?: number; // in major units (e.g. INR)
  currency?: string;
  status?: string;
  errorCode?: string;
  errorDescription?: string;
  rawPayload: Record<string, unknown>;
}

export class RazorpayWebhookEventMapper {
  public static map(payload: Record<string, unknown>): NormalizedWebhookEvent {
    const eventType = String(payload.event || '');
    const eventId = String(payload.id || payload.event_id || '');

    const payloadObj = (payload.payload as Record<string, unknown>) || {};
    const paymentPayload = payloadObj.payment as Record<string, unknown> | undefined;
    const transferPayload = payloadObj.transfer as Record<string, unknown> | undefined;

    const paymentEntity = (paymentPayload?.entity as Record<string, unknown>) || {};
    const transferEntity = (transferPayload?.entity as Record<string, unknown>) || {};

    const entity = eventType.startsWith('transfer.') ? transferEntity : paymentEntity;

    let providerPaymentId: string | undefined;
    let providerOrderId: string | undefined;

    if (eventType.startsWith('transfer.')) {
      providerPaymentId = entity.payment_id
        ? String(entity.payment_id)
        : entity.id
          ? String(entity.id)
          : undefined;
      providerOrderId = entity.order_id ? String(entity.order_id) : undefined;
    } else {
      providerPaymentId = entity.id ? String(entity.id) : undefined;
      providerOrderId = entity.order_id ? String(entity.order_id) : undefined;
    }

    const notes = (entity.notes as Record<string, string>) || {};
    const paymentId = notes.paymentId;

    const rawAmount = Number(entity.amount || 0);
    const currency = entity.currency ? String(entity.currency).toUpperCase() : undefined;
    const amount = currency ? RazorpayCurrencyHelper.toMajorUnit(rawAmount, currency) : rawAmount;

    return {
      eventId:
        eventId ||
        (providerPaymentId ? `evt_${providerPaymentId}_${eventType}` : `evt_${Date.now()}`),
      eventType,
      providerPaymentId,
      providerOrderId,
      paymentId,
      amount,
      currency,
      status: entity.status ? String(entity.status) : undefined,
      errorCode: entity.error_code ? String(entity.error_code) : undefined,
      errorDescription: entity.error_description ? String(entity.error_description) : undefined,
      rawPayload: payload,
    };
  }
}
