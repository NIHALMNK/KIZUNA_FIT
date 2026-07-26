import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { IStorageProvider } from '../../shared/contracts/IStorageProvider';
import { env } from '../../config/env.config';

export class CloudinaryProvider implements IStorageProvider {
  constructor() {
    if (env.CLOUDINARY_CLOUD_NAME) {
      cloudinary.config({
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET,
      });
    }
  }

  async uploadFile(fileBuffer: Buffer, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error: Error | undefined, result: unknown) => {
          if (error) {
            return reject(error);
          }
          const secureUrl = (result as Record<string, unknown> | undefined)?.secure_url;
          if (typeof secureUrl !== 'string') {
            return reject(new Error('Cloudinary upload failed: No secure_url returned in response'));
          }
          resolve(secureUrl);
        },
      );

      Readable.from(fileBuffer).pipe(uploadStream);
    });
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    const publicId = this.extractPublicId(fileUrl);
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  }

  private extractPublicId(url: string): string {
    const split = url.split('/');
    const fileWithExtension = split[split.length - 1];
    return fileWithExtension.split('.')[0];
  }
}
