import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showcaseSchema, ShowcaseFormValues } from '../validation/trainerProfile.schema';
import { TrainerShowcase } from '../../domain/types/profile.types';
import { SHOWCASE_TYPE_OPTIONS } from '../constants/profile.constants';

interface ShowcaseFormProps {
  initialValues?: TrainerShowcase | null;
  onSubmit: (values: ShowcaseFormValues & { file?: File }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ShowcaseForm: React.FC<ShowcaseFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShowcaseFormValues>({
    resolver: zodResolver(showcaseSchema),
    defaultValues: {
      type: initialValues?.type || (SHOWCASE_TYPE_OPTIONS[0].value as any),
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      issuedBy: initialValues?.issuedBy || '',
      achievedAt: initialValues?.achievedAt ? new Date(initialValues.achievedAt).toISOString().split('T')[0] : '',
      mediaUrl: initialValues?.mediaUrl || '',
    },
  });

  const handleFormSubmit = async (values: ShowcaseFormValues) => {
    await onSubmit({
      ...values,
      file: selectedFile || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Showcase Type *</label>
        <select
          {...register('type')}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
        >
          {SHOWCASE_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Item Title *</label>
        <input
          type="text"
          {...register('title')}
          placeholder="e.g. 100kg Deadlift PB Video / Best Trainer 2024"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
        />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          rows={3}
          {...register('description')}
          placeholder="Detailed description of the achievement or showcase item..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
        />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Issuer / Authority (Optional)</label>
          <input
            type="text"
            {...register('issuedBy')}
            placeholder="e.g. International Fitness Fed"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Achievement Date (Optional)</label>
          <input
            type="date"
            {...register('achievedAt')}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Media File Upload (Optional)</label>
        <input
          type="file"
          accept="image/*,video/*,.pdf"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setSelectedFile(e.target.files[0]);
            }
          }}
          className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">External Media URL (Optional fallback)</label>
        <input
          type="url"
          {...register('mediaUrl')}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
        />
        {errors.mediaUrl && <p className="mt-1 text-xs text-red-600">{errors.mediaUrl.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialValues ? 'Update Showcase Item' : 'Add Showcase Item'}
        </button>
      </div>
    </form>
  );
};
