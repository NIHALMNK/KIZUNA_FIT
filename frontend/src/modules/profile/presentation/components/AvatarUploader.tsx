import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface AvatarUploaderProps {
  currentAvatarUrl?: string | null;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
  isLoading?: boolean;
  role?: 'CLIENT' | 'TRAINER';
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatarUrl,
  onUpload,
  onDelete,
  isLoading = false,
  role = 'CLIENT',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const handleUpload = async () => {
    if (selectedFile) {
      await onUpload(selectedFile);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleClearSelection = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const displayAvatar = previewUrl || currentAvatarUrl;
  const primaryBtnStyle =
    role === 'TRAINER'
      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
      : 'bg-blue-600 hover:bg-blue-700 text-white';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Profile Photo</h3>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt="Avatar Preview"
              className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 font-medium text-sm">
              No Photo
            </div>
          )}
        </div>

        <div className="flex-1 w-full">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-xs text-gray-600 font-medium">
              {isDragActive ? 'Drop image here...' : 'Drag & drop photo here, or click to browse'}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">JPEG, PNG, WEBP up to 5MB</p>
          </div>

          {selectedFile && (
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={handleUpload}
                disabled={isLoading}
                className={`px-3 py-1.5 text-xs font-medium rounded ${primaryBtnStyle} disabled:opacity-50`}
              >
                {isLoading ? 'Uploading...' : 'Save Upload'}
              </button>
              <button
                onClick={handleClearSelection}
                disabled={isLoading}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Cancel
              </button>
            </div>
          )}

          {!selectedFile && currentAvatarUrl && (
            <div className="mt-3">
              <button
                onClick={onDelete}
                disabled={isLoading}
                className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded disabled:opacity-50"
              >
                {isLoading ? 'Removing...' : 'Remove Photo'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
