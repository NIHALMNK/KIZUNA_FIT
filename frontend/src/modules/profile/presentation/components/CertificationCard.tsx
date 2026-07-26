import React from 'react';
import { TrainerCertification } from '../../domain/types/profile.types';
import { CertificationStatus } from '../../domain/enums/profile.enums';

interface CertificationCardProps {
  certification: TrainerCertification;
  onEdit?: (cert: TrainerCertification) => void;
  onDelete?: (id: string) => void;
}

export const CertificationCard: React.FC<CertificationCardProps> = ({ certification, onEdit, onDelete }) => {
  const getStatusBadge = (status: CertificationStatus) => {
    switch (status) {
      case CertificationStatus.APPROVED:
        return 'bg-green-100 text-green-800 border-green-200';
      case CertificationStatus.REJECTED:
        return 'bg-red-100 text-red-800 border-red-200';
      case CertificationStatus.PENDING:
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const isEditable = certification.status !== CertificationStatus.APPROVED;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-bold text-gray-900">{certification.title}</h4>
          <span className={`px-2 py-0.5 text-[10px] font-semibold border rounded ${getStatusBadge(certification.status)}`}>
            {certification.status}
          </span>
        </div>
        <p className="text-xs text-gray-600 font-medium">{certification.organization}</p>
        <div className="flex items-center gap-4 text-[11px] text-gray-500 mt-2">
          <span>Issued: {new Date(certification.issuedAt).toLocaleDateString()}</span>
          {certification.expiresAt && <span>Expires: {new Date(certification.expiresAt).toLocaleDateString()}</span>}
        </div>
        {certification.status === CertificationStatus.REJECTED && certification.rejectionReason && (
          <p className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
            Rejection Reason: {certification.rejectionReason}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {certification.certificateUrl && (
          <a
            href={certification.certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
          >
            View Document
          </a>
        )}
        {isEditable && onEdit && (
          <button
            onClick={() => onEdit(certification)}
            className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(certification.certificationId)}
            className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded border border-red-200"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
