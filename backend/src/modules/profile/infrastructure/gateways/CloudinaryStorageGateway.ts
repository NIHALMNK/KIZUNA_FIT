import { IStorageGateway, UploadFileOptions } from '../../application/ports/IStorageGateway';
import { CloudinaryProvider } from '../../../../infrastructure/storage/CloudinaryProvider';

export class CloudinaryStorageGateway implements IStorageGateway {
  constructor(private readonly cloudinaryProvider: CloudinaryProvider) {}

  public async uploadFile(
    fileBuffer: Buffer,
    _mimeType: string,
    options: UploadFileOptions,
  ): Promise<string> {
    const folderPath = `kizunafit/${options.folder}`;
    return this.cloudinaryProvider.uploadFile(fileBuffer, folderPath);
  }

  public async deleteFile(fileUrlOrPublicId: string): Promise<void> {
    await this.cloudinaryProvider.deleteFile(fileUrlOrPublicId);
  }
}
