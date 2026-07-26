import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { certificationSchema, CertificationFormValues } from '../validation/trainerProfile.schema';
import { TrainerCertification } from '../../domain/types/profile.types';

interface CertificationFormProps {
  initialValues?: TrainerCertification | null;
  onSubmit: (values: CertificationFormValues & { file?: File }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CertificationForm: React.FC<CertificationFormProps> = ({
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
  } = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      title: initialValues?.title || '',
      organization: initialValues?.organization || '',
      issuedAt: initialValues?.issuedAt ? new Date(initialValues.issuedAt).toISOString().split('T')[0] : '',
      expiresAt: initialValues?.expiresAt ? new Date(initialValues.expiresAt).toISOString().split('T')[0] : '',
      certificateUrl: initialValues?.certificateUrl || '',
    },
  });

  const handleFormSubmit = async (values: CertificationFormValues) => {
    await onSubmit({
      ...values,
      file: selectedFile || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Certification Title *</label>
        <input
          type="text"
          {...register('title')}
          placeholder="e.g. NASM Certified Personal Trainer"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
        />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Issuing Organization *</label>
        <input
          type="text"
          {...register('organization')}
          placeholder="e.g. National Academy of Sports Medicine"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
        />
        {errors.organization && <p className="mt-1 text-xs text-red-600">{errors.organization.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Issued Date *</label>
          <input
            type="date"
            {...register('issuedAt')}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          />
          {errors.issuedAt && <p className="mt-1 text-xs text-red-600">{errors.issuedAt.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Expiration Date (Optional)</label>
          <input
            type="date"
            {...register('expiresAt')}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Certificate Document File (Optional)</label>
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setSelectedFile(e.target.files[0]);
            }
          }}
          className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Certificate Document URL (Optional fallback)</label>
        <input
          type="url"
          {...register('certificateUrl')}
          placeholder="https://example.com/certificate.pdf"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
        />
        {errors.certificateUrl && <p className="mt-1 text-xs text-red-600">{errors.certificateUrl.message}</p>}
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
          {isLoading ? 'Saving...' : initialValues ? 'Update Certification' : 'Add Certification'}
        </button>
      </div>
    </form>
  );
};
