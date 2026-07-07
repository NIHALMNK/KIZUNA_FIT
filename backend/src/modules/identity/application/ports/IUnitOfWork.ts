export interface IUnitOfWork {
  readonly session: any; // Opaque type, typically ClientSession from Mongoose
  start(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
