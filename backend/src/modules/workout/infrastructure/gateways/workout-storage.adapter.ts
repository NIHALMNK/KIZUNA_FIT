import {
  IWorkoutStorageGateway,
  WorkoutUploadFileOptions,
} from '../../application/ports/workout-storage.gateway.interface';
import { CloudinaryProvider } from '../../../../infrastructure/storage/CloudinaryProvider';

export class WorkoutStorageAdapter implements IWorkoutStorageGateway {
  constructor(private readonly cloudinaryProvider: CloudinaryProvider) {}

  public async uploadFile(
    fileBuffer: Buffer,
    _mimeType: string,
    options?: WorkoutUploadFileOptions,
  ): Promise<string> {
    const folderPath = options?.folder ? `kizunafit/${options.folder}` : 'kizunafit/exercises';
    return this.cloudinaryProvider.uploadFile(fileBuffer, folderPath, {
      resourceType: options?.resourceType || 'auto',
    });
  }

  public async deleteFile(fileUrlOrPublicId: string): Promise<void> {
    if (!fileUrlOrPublicId) return;
    await this.cloudinaryProvider.deleteFile(fileUrlOrPublicId);
  }
}
