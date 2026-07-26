import React from 'react';

interface ProfileCompletionCardProps {
  completed: boolean;
  role?: 'CLIENT' | 'TRAINER';
}

export const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({ completed, role = 'CLIENT' }) => {
  const percentage = completed ? 100 : 40;
  const barColor = role === 'TRAINER' ? 'bg-emerald-500' : 'bg-blue-500';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Profile Status</span>
        <span
          className={`px-2 py-0.5 text-xs font-bold rounded ${
            completed ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
          }`}
        >
          {completed ? 'Complete' : 'Incomplete'}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all duration-300 ${barColor}`} style={{ width: `${percentage}%` }}></div>
      </div>
      <p className="text-[11px] text-gray-500 mt-2">
        {completed
          ? 'Your profile contains all required details and is active.'
          : 'Complete your profile information to unlock full features and matching.'}
      </p>
    </div>
  );
};
