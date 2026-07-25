import { IClock } from '../../../application/ports/IClock';

export class SystemClock implements IClock {
  public now(): Date {
    return new Date();
  }
}
