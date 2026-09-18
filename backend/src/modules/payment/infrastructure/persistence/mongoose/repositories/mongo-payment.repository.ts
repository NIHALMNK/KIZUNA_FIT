import { FilterQuery } from 'mongoose';
import { Payment } from '../../../../domain/aggregates/payment.aggregate';
import { IPaymentRepository } from '../../../../domain/repositories/payment.repository';
import { PaymentModel } from '../schemas/payment.schema';
import { IPaymentDocument } from '../documents/payment.document';
import { PaymentPersistenceMapper } from '../mappers/payment-persistence.mapper';
import { DomainEventDispatcher } from '../../../../../../shared/events/domain-event-dispatcher';
import { ConcurrencyConflictException } from '../../../../domain/exceptions/payment-domain.exceptions';

function isMongoDuplicateKeyError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  const err = error as { code?: number; codeName?: string };
  return err.code === 11000 || err.codeName === 'DuplicateKey';
}

export class MongoPaymentRepository implements IPaymentRepository {
  constructor(private readonly domainEventDispatcher?: DomainEventDispatcher) {}

  public async save(payment: Payment): Promise<void> {
    const rawData = PaymentPersistenceMapper.toPersistence(payment);

    try {
      const currentVersion = payment.version;
      const nextVersion = currentVersion + 1;

      // Optimistic concurrency control check: match by _id and version (__v)
      const existingDoc = await PaymentModel.findById(rawData._id);

      if (!existingDoc) {
        await PaymentModel.create({ ...rawData, __v: 0 });
      } else {
        const updateResult = await PaymentModel.updateOne(
          { _id: rawData._id, __v: currentVersion },
          { $set: { ...rawData, __v: nextVersion } },
        );

        if (updateResult.matchedCount === 0) {
          throw new ConcurrencyConflictException(payment.paymentId);
        }

        payment.incrementVersion();
      }
    } catch (error: unknown) {
      if (error instanceof ConcurrencyConflictException) {
        throw error;
      }
      if (isMongoDuplicateKeyError(error)) {
        throw new Error(
          `A payment record already exists for offer '${payment.offerId}' or provider reference.`,
        );
      }
      throw error;
    }

    if (this.domainEventDispatcher && payment.domainEvents.length > 0) {
      await this.domainEventDispatcher.dispatchAll(payment.domainEvents);
      payment.clearEvents();
    }
  }

  public async findById(paymentId: string): Promise<Payment | null> {
    if (!paymentId || paymentId.trim() === '') {
      return null;
    }

    const doc = await PaymentModel.findById(paymentId.trim());
    return doc ? PaymentPersistenceMapper.toDomain(doc) : null;
  }

  public async findByOfferId(offerId: string): Promise<Payment | null> {
    if (!offerId || offerId.trim() === '') {
      return null;
    }

    const doc = await PaymentModel.findOne({ offerId: offerId.trim() });
    return doc ? PaymentPersistenceMapper.toDomain(doc) : null;
  }

  public async findByProviderOrderId(providerOrderId: string): Promise<Payment | null> {
    if (!providerOrderId || providerOrderId.trim() === '') {
      return null;
    }

    const doc = await PaymentModel.findOne({ providerOrderId: providerOrderId.trim() });
    return doc ? PaymentPersistenceMapper.toDomain(doc) : null;
  }

  public async findByProviderPaymentId(providerPaymentId: string): Promise<Payment | null> {
    if (!providerPaymentId || providerPaymentId.trim() === '') {
      return null;
    }

    const doc = await PaymentModel.findOne({ providerPaymentId: providerPaymentId.trim() });
    return doc ? PaymentPersistenceMapper.toDomain(doc) : null;
  }

  public async listByClientId(
    clientId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<Payment[]> {
    if (!clientId || clientId.trim() === '') {
      return [];
    }

    const docs = await PaymentModel.find({ clientId: clientId.trim() })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    return docs.map((doc) => PaymentPersistenceMapper.toDomain(doc));
  }

  public async listByTrainerId(
    trainerId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<Payment[]> {
    if (!trainerId || trainerId.trim() === '') {
      return [];
    }

    const docs = await PaymentModel.find({ trainerId: trainerId.trim() })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    return docs.map((doc) => PaymentPersistenceMapper.toDomain(doc));
  }

  public async listAll(limit: number = 50, offset: number = 0): Promise<Payment[]> {
    const docs = await PaymentModel.find().sort({ createdAt: -1 }).skip(offset).limit(limit);

    return docs.map((doc) => PaymentPersistenceMapper.toDomain(doc));
  }

  public async existsForOffer(offerId: string): Promise<boolean> {
    if (!offerId || offerId.trim() === '') {
      return false;
    }

    const count = await PaymentModel.countDocuments({ offerId: offerId.trim() });
    return count > 0;
  }
}
