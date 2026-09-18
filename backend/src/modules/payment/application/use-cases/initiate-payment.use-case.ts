import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { ICoachingOfferRepository } from '../../../offer/domain/repositories/coaching-offer.repository';
import { CoachingOfferStatus } from '../../../offer/domain/enums/coaching-offer-status.enum';
import { IPaymentGatewayPort } from '../ports/payment-gateway.port';
import {
  InitiatePaymentCommandDTO,
  InitiatePaymentResponseDTO,
} from '../dtos/initiate-payment.dto';
import { Payment } from '../../domain/aggregates/payment.aggregate';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { PaymentPricing } from '../../domain/value-objects/payment-pricing.value-object';
import { PaymentDTOMapper } from '../mappers/payment-dto.mapper';
import {
  OfferNotFoundException,
  OfferNotAcceptedException,
  UnauthorizedPaymentException,
  PaymentAlreadyExistsException,
} from '../exceptions/payment-application.exceptions';

export class InitiatePaymentUseCase {
  constructor(
    private readonly paymentRepo: IPaymentRepository,
    private readonly offerRepo: ICoachingOfferRepository,
    private readonly paymentGateway: IPaymentGatewayPort,
  ) {}

  public async execute(
    dto: InitiatePaymentCommandDTO,
  ): Promise<Result<InitiatePaymentResponseDTO>> {
    try {
      // 1. Verify Offer exists
      const offer = await this.offerRepo.findById(dto.offerId);
      if (!offer) {
        throw new OfferNotFoundException(dto.offerId);
      }

      // 2. Verify Authenticated Client owns the offer
      if (offer.clientId !== dto.clientId) {
        throw new UnauthorizedPaymentException(dto.clientId, dto.offerId);
      }

      // 3. Verify Offer status is ACCEPTED
      if (offer.status !== CoachingOfferStatus.ACCEPTED) {
        throw new OfferNotAcceptedException(offer.offerId, offer.status);
      }

      // 4. Verify Payment does not already exist in a terminal state
      const existingPayment = await this.paymentRepo.findByOfferId(offer.offerId);
      if (existingPayment) {
        if (existingPayment.status === PaymentStatus.SUCCESS) {
          throw new PaymentAlreadyExistsException(
            `A payment record already exists and has succeeded for offer ${offer.offerId}`,
          );
        }

        if (existingPayment.status === PaymentStatus.REFUNDED) {
          throw new PaymentAlreadyExistsException(
            `A payment record already exists and has been refunded for offer ${offer.offerId}`,
          );
        }

        // If existing payment is CREATED or PROCESSING with an existing order, reuse it idempotently
        if (
          (existingPayment.status === PaymentStatus.CREATED ||
            existingPayment.status === PaymentStatus.PROCESSING) &&
          existingPayment.providerOrderId
        ) {
          const keyId = this.paymentGateway.getKeyId
            ? this.paymentGateway.getKeyId()
            : process.env.RAZORPAY_KEY_ID || '';

          return Result.ok(
            PaymentDTOMapper.toInitiateResponseDTO(
              existingPayment,
              existingPayment.providerOrderId,
              keyId,
            ),
          );
        }

        // If existing payment was FAILED or missing providerOrderId, generate a new order on existing payment
        const gatewayOrder = await this.paymentGateway.createOrder({
          paymentId: existingPayment.paymentId,
          amount: existingPayment.pricing.totalAmount,
          currency: existingPayment.pricing.currency,
          metadata: {
            offerId: offer.offerId,
            clientId: offer.clientId,
            trainerId: offer.trainerId,
            acquisitionPipelineId: offer.acquisitionPipelineId,
          },
        });

        existingPayment.startProcessing(gatewayOrder.providerOrderId);
        await this.paymentRepo.save(existingPayment);

        return Result.ok(
          PaymentDTOMapper.toInitiateResponseDTO(
            existingPayment,
            gatewayOrder.providerOrderId,
            gatewayOrder.keyId,
          ),
        );
      }

      // 5. Derive authoritative financial snapshot strictly from accepted Offer
      const offerPricing = offer.pricingSnapshot.toPrimitives();
      const pricingResult = PaymentPricing.create({
        trainerFee: offerPricing.trainerFee,
        platformFee: offerPricing.platformFee,
        totalAmount: offerPricing.totalAmount,
        currency: offerPricing.currency,
      });

      if (pricingResult.isFailure || !pricingResult.getValue()) {
        return Result.fail(
          pricingResult.error || 'Failed to construct PaymentPricing from Offer snapshot.',
        );
      }

      // 6. Instantiate Payment Aggregate
      const paymentResult = Payment.create({
        offerId: offer.offerId,
        acquisitionPipelineId: offer.acquisitionPipelineId,
        clientId: offer.clientId,
        trainerId: offer.trainerId,
        pricing: pricingResult.getValue()!,
      });

      if (paymentResult.isFailure || !paymentResult.getValue()) {
        return Result.fail(paymentResult.error || 'Failed to create Payment aggregate.');
      }

      const payment = paymentResult.getValue()!;

      // 7. Request Order from Payment Gateway Port
      let gatewayOrder;
      try {
        gatewayOrder = await this.paymentGateway.createOrder({
          paymentId: payment.paymentId,
          amount: payment.pricing.totalAmount,
          currency: payment.pricing.currency,
          metadata: {
            offerId: offer.offerId,
            clientId: offer.clientId,
            trainerId: offer.trainerId,
            acquisitionPipelineId: offer.acquisitionPipelineId,
          },
        });
      } catch (gatewayErr: unknown) {
        const failureMessage =
          gatewayErr instanceof Error
            ? gatewayErr.message
            : 'Payment gateway order creation failed';
        payment.markFailed(failureMessage);
        await this.paymentRepo.save(payment);
        return Result.fail(`Failed to initiate payment with gateway: ${failureMessage}`);
      }

      // 8. Transition Payment state to PROCESSING
      payment.startProcessing(gatewayOrder.providerOrderId);

      // 9. Persist Payment (repository handles domain event dispatching)
      await this.paymentRepo.save(payment);

      return Result.ok(
        PaymentDTOMapper.toInitiateResponseDTO(
          payment,
          gatewayOrder.providerOrderId,
          gatewayOrder.keyId,
        ),
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Result.fail(error.message);
      }
      return Result.fail('An unexpected error occurred during payment initiation.');
    }
  }
}
