export interface IStorageProvider {
  uploadFile(fileBuffer: Buffer, folder: string): Promise<string>;
  deleteFile(fileUrl: string): Promise<boolean>;
}
