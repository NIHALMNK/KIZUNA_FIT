import mongoose, { ClientSession } from 'mongoose';
import { IUnitOfWork } from '../../../../modules/identity/application/ports/IUnitOfWork';

export class MongooseUnitOfWork implements IUnitOfWork {
  private _session: ClientSession | null = null;

  get session(): unknown {
    return this._session;
  }

  public async start(): Promise<void> {
    if (this._session) {
      throw new Error('Transaction already in progress.');
    }

    this._session = await mongoose.startSession();
    this._session.startTransaction();
  }

  public async commit(): Promise<void> {
    if (!this._session) {
      throw new Error('No transaction in progress to commit.');
    }

    try {
      await this._session.commitTransaction();
    } finally {
      await this._session.endSession();
      this._session = null;
    }
  }

  public async rollback(): Promise<void> {
    if (!this._session) {
      throw new Error('No transaction in progress to rollback.');
    }

    try {
      await this._session.abortTransaction();
    } finally {
      await this._session.endSession();
      this._session = null;
    }
  }
}
