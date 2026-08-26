export interface IWebhookIdempotencyPort {
  /**
   * Attempts to atomically record an event as processed.
   * Returns true if acquisition succeeded (first time processing).
   * Returns false if event was already processed (duplicate/concurrent attempt).
   */
  acquire(eventId: string, eventType: string): Promise<boolean>;

  /**
   * Releases an acquired idempotency lock in case processing failed with an error,
   * allowing future valid retries.
   */
  release(eventId: string): Promise<void>;
}
