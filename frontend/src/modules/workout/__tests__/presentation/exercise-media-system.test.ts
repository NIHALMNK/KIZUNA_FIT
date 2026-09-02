import { describe, it, expect, vi } from 'vitest';
import { exerciseApi } from '../../infrastructure/api/exerciseApi';
import { httpClient } from '../../../../infrastructure/api/HttpClient';
import {
  extractYouTubeVideoId,
  isValidYouTubeUrl,
  getYouTubeEmbedUrl,
} from '../../domain/utils/youtube.utils';

describe('Frontend Exercise Media API & Adaptation Tests', () => {
  it('1. exerciseApi.uploadMedia sends FormData with multipart headers', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue({
      url: 'https://res.cloudinary.com/kizunafit/exercises/bench.jpg',
      resourceType: 'image',
      mimeType: 'image/jpeg',
      sizeBytes: 1024,
    } as any);

    const mockFile = new File(['content'], 'bench.jpg', { type: 'image/jpeg' });
    const res = await exerciseApi.uploadMedia(mockFile);

    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(postSpy).toHaveBeenCalledWith(
      '/exercises/media/upload',
      expect.any(FormData),
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    );
    expect(res.url).toBe('https://res.cloudinary.com/kizunafit/exercises/bench.jpg');
    expect(res.resourceType).toBe('image');
  });

  it('2. exerciseApi.deleteMedia calls DELETE /exercises/media with target fileUrl', async () => {
    const deleteSpy = vi.spyOn(httpClient, 'delete').mockResolvedValue({ success: true } as any);

    await exerciseApi.deleteMedia('https://res.cloudinary.com/kizunafit/exercises/old.jpg');

    expect(deleteSpy).toHaveBeenCalledWith('/exercises/media', {
      data: { fileUrl: 'https://res.cloudinary.com/kizunafit/exercises/old.jpg' },
    });
  });

  it('3. exerciseApi.create preserves complete media payload', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue({
      id: 'ex_100',
      name: 'Romanian Deadlift',
      media: {
        thumbnailUrl: 'https://res.cloudinary.com/kizunafit/exercises/rdl_thumb.jpg',
        imageUrls: ['https://res.cloudinary.com/kizunafit/exercises/rdl_1.jpg'],
        videoUrl: 'https://res.cloudinary.com/kizunafit/exercises/rdl.mp4',
      },
    } as any);

    const res = await exerciseApi.create({
      name: 'Romanian Deadlift',
      media: {
        thumbnailUrl: 'https://res.cloudinary.com/kizunafit/exercises/rdl_thumb.jpg',
        imageUrls: ['https://res.cloudinary.com/kizunafit/exercises/rdl_1.jpg'],
        videoUrl: 'https://res.cloudinary.com/kizunafit/exercises/rdl.mp4',
      },
    });

    expect(postSpy).toHaveBeenCalledWith(
      '/exercises',
      expect.objectContaining({
        media: expect.objectContaining({
          thumbnailUrl: 'https://res.cloudinary.com/kizunafit/exercises/rdl_thumb.jpg',
        }),
      }),
    );
    expect(res.media.thumbnailUrl).toBe(
      'https://res.cloudinary.com/kizunafit/exercises/rdl_thumb.jpg',
    );
  });

  it('4. exerciseApi.update transmits media replacement changes', async () => {
    const patchSpy = vi.spyOn(httpClient, 'patch').mockResolvedValue({
      id: 'ex_100',
      name: 'Romanian Deadlift',
      media: {
        thumbnailUrl: 'https://res.cloudinary.com/kizunafit/exercises/rdl_thumb_v2.jpg',
        imageUrls: [],
        videoUrl: null,
      },
    } as any);

    const res = await exerciseApi.update('ex_100', {
      media: {
        thumbnailUrl: 'https://res.cloudinary.com/kizunafit/exercises/rdl_thumb_v2.jpg',
        imageUrls: [],
        videoUrl: null,
      },
    });

    expect(patchSpy).toHaveBeenCalledWith(
      '/exercises/ex_100',
      expect.objectContaining({
        media: expect.objectContaining({
          thumbnailUrl: 'https://res.cloudinary.com/kizunafit/exercises/rdl_thumb_v2.jpg',
        }),
      }),
    );
    expect(res.media.thumbnailUrl).toBe(
      'https://res.cloudinary.com/kizunafit/exercises/rdl_thumb_v2.jpg',
    );
  });

  describe('YouTube URL Validation & Embed Utilities', () => {
    it('5. Correctly validates and extracts video ID from standard watch URL', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      expect(isValidYouTubeUrl(url)).toBe(true);
      expect(extractYouTubeVideoId(url)).toBe('dQw4w9WgXcQ');
      expect(getYouTubeEmbedUrl(url)).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
    });

    it('6. Correctly validates and extracts video ID from shortened youtu.be URL', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ?si=abcdef123';
      expect(isValidYouTubeUrl(url)).toBe(true);
      expect(extractYouTubeVideoId(url)).toBe('dQw4w9WgXcQ');
      expect(getYouTubeEmbedUrl(url)).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
    });

    it('7. Correctly validates and extracts video ID from YouTube shorts URL', () => {
      const url = 'https://www.youtube.com/shorts/dQw4w9WgXcQ';
      expect(isValidYouTubeUrl(url)).toBe(true);
      expect(extractYouTubeVideoId(url)).toBe('dQw4w9WgXcQ');
      expect(getYouTubeEmbedUrl(url)).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
    });

    it('8. Rejects invalid or non-YouTube URLs', () => {
      expect(isValidYouTubeUrl('https://vimeo.com/123456')).toBe(false);
      expect(isValidYouTubeUrl('https://example.com/video.mp4')).toBe(false);
      expect(isValidYouTubeUrl('not_a_valid_url')).toBe(false);
      expect(isValidYouTubeUrl('https://youtube.com/invalid_path')).toBe(false);
    });

    it('9. Allows empty, undefined, or null URLs (optional field)', () => {
      expect(isValidYouTubeUrl('')).toBe(true);
      expect(isValidYouTubeUrl(null)).toBe(true);
      expect(isValidYouTubeUrl(undefined)).toBe(true);
      expect(getYouTubeEmbedUrl('')).toBeNull();
      expect(getYouTubeEmbedUrl(null)).toBeNull();
    });
  });
});
