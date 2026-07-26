import React from 'react';
import { TrainerShowcase } from '../../domain/types/profile.types';

interface ShowcaseCardProps {
  showcase: TrainerShowcase;
  onEdit?: (item: TrainerShowcase) => void;
  onDelete?: (id: string) => void;
}

export const ShowcaseCard: React.FC<ShowcaseCardProps> = ({ showcase, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-bold text-gray-900">{showcase.title}</h4>
          <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded">
            {showcase.type}
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">{showcase.description}</p>
        <div className="flex items-center gap-4 text-[11px] text-gray-500 mt-2">
          {showcase.issuedBy && <span>Issuer: {showcase.issuedBy}</span>}
          {showcase.achievedAt && <span>Achieved: {new Date(showcase.achievedAt).toLocaleDateString()}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showcase.mediaUrl && (
          <a
            href={showcase.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
          >
            View Media
          </a>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(showcase)}
            className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(showcase.showcaseId)}
            className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded border border-red-200"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
