'use client';

import React, { useRef, useState } from 'react';
import {
  useUploadExerciseMedia,
  useDeleteExerciseMedia,
} from '../../application/mutations/useWorkoutMutations';
import {
  Upload,
  X,
  Film,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import { isValidYouTubeUrl, getYouTubeEmbedUrl } from '../../domain/utils/youtube.utils';

interface ExerciseMediaUploaderProps {
  thumbnailUrl: string | null;
  onThumbnailChange: (url: string | null) => void;
  imageUrls: string[];
  onImageUrlsChange: (urls: string[]) => void;
  videoUrl: string | null;
  onVideoChange: (url: string | null) => void;
}

const MAX_IMAGE_SIZE_MB = 10;

export const ExerciseMediaUploader: React.FC<ExerciseMediaUploaderProps> = ({
  thumbnailUrl,
  onThumbnailChange,
  imageUrls,
  onImageUrlsChange,
  videoUrl,
  onVideoChange,
}) => {
  const uploadMediaMutation = useUploadExerciseMedia();
  const deleteMediaMutation = useDeleteExerciseMedia();

  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewLightboxUrl, setPreviewLightboxUrl] = useState<string | null>(null);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // --- Thumbnail Handlers ---
  const handleThumbnailSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Thumbnail must be an image file (JPEG, PNG, WebP, GIF).');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setUploadError(`Thumbnail exceeds ${MAX_IMAGE_SIZE_MB}MB size limit.`);
      return;
    }

    setUploadError(null);
    setIsUploadingThumbnail(true);
    try {
      const oldUrl = thumbnailUrl;
      const res = await uploadMediaMutation.mutateAsync(file);
      onThumbnailChange(res.url);
      if (oldUrl && oldUrl !== res.url) {
        deleteMediaMutation.mutate(oldUrl);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload thumbnail image.');
    } finally {
      setIsUploadingThumbnail(false);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    }
  };

  const handleRemoveThumbnail = () => {
    if (thumbnailUrl) {
      deleteMediaMutation.mutate(thumbnailUrl);
    }
    onThumbnailChange(null);
  };

  // --- Image Gallery Handlers ---
  const handleImagesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    setIsUploadingImage(true);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          setUploadError(`File '${file.name}' is not a valid image format.`);
          continue;
        }
        if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
          setUploadError(`File '${file.name}' exceeds ${MAX_IMAGE_SIZE_MB}MB size limit.`);
          continue;
        }

        const res = await uploadMediaMutation.mutateAsync(file);
        newUrls.push(res.url);
      }

      if (newUrls.length > 0) {
        onImageUrlsChange([...imageUrls, ...newUrls]);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload exercise images.');
    } finally {
      setIsUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const targetUrl = imageUrls[index];
    if (targetUrl) {
      deleteMediaMutation.mutate(targetUrl);
    }
    onImageUrlsChange(imageUrls.filter((_, i) => i !== index));
  };

  // --- YouTube Video Handler ---
  const handleYouTubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onVideoChange(val ? val.trim() : null);
  };

  const isInvalidYouTube = !!videoUrl && videoUrl.trim() !== '' && !isValidYouTubeUrl(videoUrl);
  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div className="space-y-6">
      {/* Upload Error Banner */}
      {uploadError && (
        <div className="flex items-center gap-2 p-3 text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input
        ref={thumbnailInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleThumbnailSelect}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleImagesSelect}
        className="hidden"
      />

      {/* 1. THUMBNAIL SECTION */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-[var(--color-heading)] flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            Thumbnail Image (Cover)
          </label>
          {thumbnailUrl && !isUploadingThumbnail && (
            <button
              type="button"
              onClick={() => thumbnailInputRef.current?.click()}
              className="text-[11px] text-[var(--color-primary)] hover:underline flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              Replace Thumbnail
            </button>
          )}
        </div>

        {thumbnailUrl ? (
          <div className="relative group w-full h-36 rounded-xl border border-[var(--color-border)] overflow-hidden bg-black/20 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnailUrl}
              alt="Exercise Thumbnail"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewLightboxUrl(thumbnailUrl)}
                className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
                title="Preview full size"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRemoveThumbnail}
                className="p-1.5 rounded-lg bg-rose-600/80 text-white hover:bg-rose-600 transition-colors"
                title="Remove thumbnail"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={isUploadingThumbnail}
            onClick={() => thumbnailInputRef.current?.click()}
            className="w-full h-28 border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)]/60 rounded-xl flex flex-col items-center justify-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-all cursor-pointer"
          >
            {isUploadingThumbnail ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
                <span className="text-xs font-medium">Uploading cover thumbnail...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <div className="text-center">
                  <span className="text-xs font-semibold block">Click to upload thumbnail</span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    JPEG, PNG, WebP up to 10MB
                  </span>
                </div>
              </>
            )}
          </button>
        )}
      </div>

      {/* 2. EXERCISE GALLERY IMAGES SECTION */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-[var(--color-heading)] flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            Exercise Image Gallery ({imageUrls.length})
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploadingImage}
            onClick={() => imageInputRef.current?.click()}
            className="h-7 px-2 text-[11px] font-semibold flex items-center gap-1"
          >
            {isUploadingImage ? (
              <Loader2 className="w-3 h-3 animate-spin text-[var(--color-primary)]" />
            ) : (
              <Upload className="w-3 h-3" />
            )}
            + Add Images
          </Button>
        </div>

        {imageUrls.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {imageUrls.map((url, idx) => (
              <div
                key={url + idx}
                className="relative group aspect-square rounded-xl border border-[var(--color-border)] overflow-hidden bg-black/20"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Exercise step ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewLightboxUrl(url)}
                    className="p-1 rounded-md bg-black/60 text-white hover:bg-black/80"
                    title="View"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="p-1 rounded-md bg-rose-600/80 text-white hover:bg-rose-600"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 border border-dashed border-[var(--color-border)] rounded-xl text-center text-xs text-[var(--color-text-muted)] bg-[var(--color-surface)]">
            No gallery images added yet. Click &ldquo;+ Add Images&rdquo; to attach step photos.
          </div>
        )}
      </div>

      {/* 3. DEMONSTRATION VIDEO SECTION (YOUTUBE URL INPUT & EMBED PREVIEW) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[var(--color-heading)] flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            Demonstration Video
          </label>
          {videoUrl && (
            <button
              type="button"
              onClick={() => onVideoChange(null)}
              className="text-[11px] text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-rose-500/10 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear Video
            </button>
          )}
        </div>

        <div>
          <Input
            value={videoUrl || ''}
            onChange={handleYouTubeUrlChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className={`rounded-xl text-xs font-mono ${isInvalidYouTube ? 'border-rose-500 focus:ring-rose-500' : ''}`}
          />
          <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5">
            Paste a YouTube demonstration video URL (e.g. watch, shorts, or youtu.be links)
          </p>
        </div>

        {isInvalidYouTube && (
          <div className="flex items-center gap-1.5 p-2.5 text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              Please enter a valid YouTube video URL (e.g., https://www.youtube.com/watch?v=...,
              https://youtu.be/..., or https://www.youtube.com/shorts/...).
            </span>
          </div>
        )}

        {/* Live YouTube Embed Preview */}
        {youtubeEmbedUrl && (
          <div className="rounded-xl overflow-hidden border border-[var(--color-border)] bg-black mt-3">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--color-surface-alt)] border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)]">
              <span className="flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-emerald-500" />
                YouTube Video Preview
              </span>
            </div>
            <div className="relative aspect-video w-full">
              <iframe
                src={youtubeEmbedUrl}
                title="YouTube exercise demonstration preview"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal for Full-Size Image Preview */}
      {previewLightboxUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setPreviewLightboxUrl(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] bg-transparent flex flex-col items-center">
            <button
              onClick={() => setPreviewLightboxUrl(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300 font-bold"
            >
              <X className="w-6 h-6" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewLightboxUrl}
              alt="Full size preview"
              className="max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
};
