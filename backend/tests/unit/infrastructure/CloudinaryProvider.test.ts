import { describe, it, expect, vi } from 'vitest';
import { CloudinaryProvider } from '../../../src/infrastructure/storage/CloudinaryProvider';
import { v2 as cloudinary } from 'cloudinary';
import { Writable } from 'stream';

describe('CloudinaryProvider Unit Tests', () => {
  it('should upload buffer using stream piping and resolve secure_url', async () => {
    const provider = new CloudinaryProvider();
    const fakeBuffer = Buffer.from('fake image content');

    vi.spyOn(cloudinary.uploader, 'upload_stream').mockImplementation((_options: any, callback: any) => {
      const mockStream = new Writable({
        write(_chunk, _encoding, next) {
          next();
        },
      });
      process.nextTick(() => {
        if (callback) {
          callback(undefined, { secure_url: 'https://res.cloudinary.com/demo/image/upload/v123/sample.jpg' });
        }
      });
      return mockStream as any;
    });

    const url = await provider.uploadFile(fakeBuffer, 'kizunafit/avatars');
    expect(url).toBe('https://res.cloudinary.com/demo/image/upload/v123/sample.jpg');
  });

  it('should reject clean error when cloudinary returns an error', async () => {
    const provider = new CloudinaryProvider();
    const fakeBuffer = Buffer.from('fake image content');

    vi.spyOn(cloudinary.uploader, 'upload_stream').mockImplementation((_options: any, callback: any) => {
      const mockStream = new Writable({
        write(_chunk, _encoding, next) {
          next();
        },
      });
      process.nextTick(() => {
        if (callback) {
          callback(new Error('Cloudinary Upload Failed'), undefined);
        }
      });
      return mockStream as any;
    });

    await expect(provider.uploadFile(fakeBuffer, 'kizunafit/avatars')).rejects.toThrow('Cloudinary Upload Failed');
  });

  it('should reject clean error when result has no secure_url', async () => {
    const provider = new CloudinaryProvider();
    const fakeBuffer = Buffer.from('fake image content');

    vi.spyOn(cloudinary.uploader, 'upload_stream').mockImplementation((_options: any, callback: any) => {
      const mockStream = new Writable({
        write(_chunk, _encoding, next) {
          next();
        },
      });
      process.nextTick(() => {
        if (callback) {
          callback(undefined, {});
        }
      });
      return mockStream as any;
    });

    await expect(provider.uploadFile(fakeBuffer, 'kizunafit/avatars')).rejects.toThrow('No secure_url returned in response');
  });
});
