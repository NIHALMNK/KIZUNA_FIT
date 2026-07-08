export interface IUnitOfWork {
  readonly session: unknown; // Opaque type, typically ClientSession from Mongoose
  start(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
