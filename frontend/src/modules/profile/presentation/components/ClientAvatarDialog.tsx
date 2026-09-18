'use client';

import React, { useState } from 'react';
import { Dialog } from '../../../../shared/components/ui/Dialog';
import { Button } from '../../../../shared/components/ui/Button';
import { toast } from 'sonner';

interface ClientAvatarDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
  currentAvatarUrl?: string | null;
  isUploading?: boolean;
  isDeleting?: boolean;
}

export const ClientAvatarDialog: React.FC<ClientAvatarDialogProps> = ({
  isOpen,
  onClose,
  onUpload,
  onDelete,
  currentAvatarUrl,
  isUploading = false,
  isDeleting = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;
    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
      setPreviewUrl(null);
      onClose();
    } catch {
      // Toast handles error
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await onDelete();
      setSelectedFile(null);
      setPreviewUrl(null);
      onClose();
    } catch {
      // Toast handles error
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Manage Profile Photo">
      <div className="space-y-6 pt-2">
        {/* Current / Preview Image */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--color-border)] bg-[var(--color-surface-alt)] flex items-center justify-center">
            {previewUrl || currentAvatarUrl ? (
              <img
                src={previewUrl || currentAvatarUrl!}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-[var(--color-text-secondary)]">KF</span>
            )}
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">JPG, PNG, or WEBP (Max 5MB)</p>
        </div>

        {/* File Input */}
        <div>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            className="block w-full text-xs text-[var(--color-text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[var(--color-surface-alt)] file:text-[var(--color-primary)] hover:file:bg-[var(--color-border)] cursor-pointer"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
          {currentAvatarUrl ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDeleteSubmit}
              isLoading={isDeleting}
              className="border-red-200 text-red-600 hover:bg-red-50 text-xs rounded-xl font-semibold"
            >
              Remove Photo
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-[var(--color-border)] text-xs rounded-xl font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={!selectedFile}
              isLoading={isUploading}
              onClick={handleUploadSubmit}
              className="bg-[var(--color-primary)] text-white text-xs rounded-xl font-bold"
            >
              Upload Photo
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
