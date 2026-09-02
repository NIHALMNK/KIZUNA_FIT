export interface WorkoutUploadFileOptions {
  folder?: string;
  allowedMimeTypes?: string[];
  maxSizeBytes?: number;
  resourceType?: 'image' | 'video' | 'auto';
}

export interface IWorkoutStorageGateway {
  uploadFile(
    fileBuffer: Buffer,
    mimeType: string,
    options?: WorkoutUploadFileOptions,
  ): Promise<string>;
  deleteFile(fileUrlOrPublicId: string): Promise<void>;
}
