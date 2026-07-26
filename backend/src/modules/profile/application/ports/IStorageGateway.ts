export interface UploadFileOptions {
  folder: string;
  filename?: string;
  allowedMimeTypes?: string[];
  maxSizeBytes?: number;
}

export interface IStorageGateway {
  uploadFile(fileBuffer: Buffer, mimeType: string, options: UploadFileOptions): Promise<string>;
  deleteFile(fileUrlOrPublicId: string): Promise<void>;
}
