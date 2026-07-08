import * as argon2 from 'argon2';
import { IPasswordHasher } from '../../../application/ports/IPasswordHasher';

export class Argon2PasswordHasher implements IPasswordHasher {
  private readonly hashOptions: argon2.Options = {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
    hashLength: 32
  };

  public async hash(plain: string): Promise<string> {
    try {
      return await argon2.hash(plain, this.hashOptions);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Hashing failed: ${message}`);
    }
  }

  public async compare(plain: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Verification failed: ${message}`);
    }
  }
}
