import { IWorkoutStorageGateway } from '../../ports/workout-storage.gateway.interface';
import { ValidationError } from '../../../../../shared/exceptions/AppError';

export interface UploadExerciseMediaDto {
  fileBuffer: Buffer;
  mimeType: string;
  sizeBytes: number;
}

export interface UploadExerciseMediaResponseDto {
  url: string;
  resourceType: 'image' | 'video';
  mimeType: string;
  sizeBytes: number;
}

const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_MIME_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export class UploadExerciseMediaUseCase {
  constructor(private readonly workoutStorageGateway: IWorkoutStorageGateway) {}

  async execute(dto: UploadExerciseMediaDto): Promise<UploadExerciseMediaResponseDto> {
    if (!dto.fileBuffer || dto.fileBuffer.length === 0) {
      throw new ValidationError('Uploaded file buffer is empty.');
    }

    const mime = dto.mimeType.toLowerCase();
    const isImage = ALLOWED_IMAGE_MIME_TYPES.includes(mime);
    const isVideo = ALLOWED_VIDEO_MIME_TYPES.includes(mime);

    if (!isImage && !isVideo) {
      throw new ValidationError(
        `Unsupported media type: '${dto.mimeType}'. Allowed formats: JPEG, PNG, WebP, GIF, MP4, QuickTime, WebM.`,
      );
    }

    if (isImage && dto.sizeBytes > MAX_IMAGE_SIZE_BYTES) {
      throw new ValidationError(
        `Image size exceeds 10MB limit (size: ${(dto.sizeBytes / (1024 * 1024)).toFixed(1)}MB).`,
      );
    }

    if (isVideo && dto.sizeBytes > MAX_VIDEO_SIZE_BYTES) {
      throw new ValidationError(
        `Video size exceeds 50MB limit (size: ${(dto.sizeBytes / (1024 * 1024)).toFixed(1)}MB).`,
      );
    }

    const resourceType = isVideo ? 'video' : 'image';
    const url = await this.workoutStorageGateway.uploadFile(dto.fileBuffer, dto.mimeType, {
      folder: 'exercises',
      resourceType,
    });

    return {
      url,
      resourceType,
      mimeType: dto.mimeType,
      sizeBytes: dto.sizeBytes,
    };
  }
}
