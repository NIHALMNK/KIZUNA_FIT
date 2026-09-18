'use client';

import React, { useState } from 'react';
import { Exercise, ExerciseOrigin } from '../../domain/types/workout.types';
import { Button } from '../../../../shared/components/ui/Button';
import { useAuthStore } from '../../../identity/application/store/authStore';
import { useReportExercise } from '../../application/mutations/useWorkoutMutations';
import {
  X,
  Dumbbell,
  Flame,
  Info,
  Sparkles,
  UserCheck,
  Film,
  Image as ImageIcon,
  Edit,
  Eye,
  Check,
  Flag,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { getYouTubeEmbedUrl } from '../../domain/utils/youtube.utils';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (exercise: Exercise) => void;
  onEdit?: (exercise: Exercise) => void;
  isSelectable?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  isOpen,
  onClose,
  onSelect,
  onEdit,
  isSelectable = false,
  isLoading = false,
  isError = false,
  errorMessage,
}) => {
  const { user: authUser } = useAuthStore();
  const reportExerciseMutation = useReportExercise();

  const [activeMediaTab, setActiveMediaTab] = useState<'all' | 'video' | 'gallery'>('all');
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // Reporting State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Inaccurate technique instructions');
  const [reportDetails, setReportDetails] = useState('');
  const [reportStatus, setReportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [reportErrorMessage, setReportErrorMessage] = useState('');

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center text-center space-y-4">
          <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
          <p className="text-sm font-semibold text-[var(--color-text-secondary)]">
            Loading exercise details...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !exercise) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
              <AlertCircle className="w-5 h-5" />
              Failed to load exercise
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-heading)] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            {errorMessage || 'Unable to retrieve exercise metadata from catalog. Please try again.'}
          </p>
          <Button variant="outline" size="sm" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    );
  }

  const isTrainer = authUser?.role === 'TRAINER';
  const isAdmin = authUser?.role === 'ADMIN';
  const isOwner = isTrainer && authUser && exercise.createdByTrainerId === authUser.id;
  const canEdit = (isOwner || isAdmin) && authUser?.role !== 'CLIENT';
  const canReport = authUser && !isOwner && !isAdmin && isTrainer;
  const isTrainerOrigin =
    exercise.origin === ExerciseOrigin.TRAINER || !!exercise.createdByTrainerId;

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;

    setReportStatus('idle');
    try {
      await reportExerciseMutation.mutateAsync({
        exerciseId: exercise.id,
        data: {
          reason: reportReason.trim(),
          details: reportDetails.trim() || undefined,
        },
      });
      setReportStatus('success');
      setTimeout(() => {
        setIsReportModalOpen(false);
        setReportStatus('idle');
        setReportDetails('');
      }, 1500);
    } catch (err: any) {
      setReportStatus('error');
      setReportErrorMessage(err.message || 'Failed to submit report.');
    }
  };

  const media = exercise.media || {};
  const hasThumbnail = !!media.thumbnailUrl;
  const galleryImages = media.imageUrls || media.images || [];
  const hasImages = galleryImages.length > 0;
  const hasVideo = !!media.videoUrl && media.videoUrl.trim() !== '';
  const youtubeEmbedUrl = getYouTubeEmbedUrl(media.videoUrl);
  const hasAnyMedia = hasThumbnail || hasImages || hasVideo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)] flex items-center justify-center">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[var(--color-heading)]">{exercise.name}</h2>
                {isTrainerOrigin ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    <UserCheck className="w-3 h-3" />
                    {isOwner ? 'Created by you' : exercise.creatorName || 'Created by Trainer'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[var(--color-primary-subtle)] text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                    <Sparkles className="w-3 h-3" />
                    KIZUNAFIT / Platform
                  </span>
                )}
              </div>
              <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">
                {exercise.category} • {exercise.difficulty}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-heading)] hover:bg-[var(--color-surface-alt)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)]">
              <span className="text-[11px] text-[var(--color-text-muted)] uppercase font-semibold">
                Target Muscle
              </span>
              <p className="text-sm font-bold text-[var(--color-heading)] mt-0.5">
                {exercise.primaryMuscleGroup}
              </p>
            </div>
            <div className="p-3 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)]">
              <span className="text-[11px] text-[var(--color-text-muted)] uppercase font-semibold">
                Equipment
              </span>
              <p className="text-sm font-bold text-[var(--color-heading)] mt-0.5">
                {exercise.equipment}
              </p>
            </div>
            <div className="p-3 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)]">
              <span className="text-[11px] text-[var(--color-text-muted)] uppercase font-semibold">
                Difficulty
              </span>
              <p className="text-sm font-bold text-[var(--color-heading)] mt-0.5">
                {exercise.difficulty}
              </p>
            </div>
            <div className="p-3 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)] flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500 shrink-0" />
              <div>
                <span className="text-[11px] text-[var(--color-text-muted)] uppercase font-semibold">
                  Cal/Min
                </span>
                <p className="text-sm font-bold text-[var(--color-heading)] mt-0.5">
                  {exercise.caloriesPerMinute} kcal
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Muscles */}
          {exercise.secondaryMuscleGroups && exercise.secondaryMuscleGroups.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                Secondary Muscles Involved
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {exercise.secondaryMuscleGroups.map((muscle) => (
                  <span
                    key={muscle}
                    className="px-2.5 py-1 text-xs rounded-lg bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-[var(--color-text-secondary)] font-medium"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* MEDIA SECTION */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[var(--color-primary)]" />
                Exercise Media
              </h4>
              {hasAnyMedia && (hasVideo || hasImages) && (
                <div className="flex gap-1 p-0.5 rounded-lg bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-[11px]">
                  <button
                    onClick={() => setActiveMediaTab('all')}
                    className={`px-2 py-0.5 rounded-md font-semibold ${
                      activeMediaTab === 'all'
                        ? 'bg-[var(--color-surface)] shadow-xs text-[var(--color-primary)]'
                        : 'text-[var(--color-text-secondary)]'
                    }`}
                  >
                    All
                  </button>
                  {hasVideo && (
                    <button
                      onClick={() => setActiveMediaTab('video')}
                      className={`px-2 py-0.5 rounded-md font-semibold ${
                        activeMediaTab === 'video'
                          ? 'bg-[var(--color-surface)] shadow-xs text-[var(--color-primary)]'
                          : 'text-[var(--color-text-secondary)]'
                      }`}
                    >
                      Video
                    </button>
                  )}
                  {hasImages && (
                    <button
                      onClick={() => setActiveMediaTab('gallery')}
                      className={`px-2 py-0.5 rounded-md font-semibold ${
                        activeMediaTab === 'gallery'
                          ? 'bg-[var(--color-surface)] shadow-xs text-[var(--color-primary)]'
                          : 'text-[var(--color-text-secondary)]'
                      }`}
                    >
                      Gallery ({galleryImages.length})
                    </button>
                  )}
                </div>
              )}
            </div>

            {hasAnyMedia ? (
              <div className="space-y-4">
                {/* Demonstration Video Player (YouTube iframe embed or HTML5 fallback) */}
                {(activeMediaTab === 'all' || activeMediaTab === 'video') && hasVideo && (
                  <div className="rounded-xl overflow-hidden border border-[var(--color-border)] bg-black">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-surface-alt)] border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)]">
                      <Film className="w-3.5 h-3.5 text-emerald-500" />
                      Demonstration Video
                    </div>
                    {youtubeEmbedUrl ? (
                      <div className="relative aspect-video w-full">
                        <iframe
                          src={youtubeEmbedUrl}
                          title={`${exercise.name} demonstration video`}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <video
                        src={media.videoUrl!}
                        controls
                        className="w-full max-h-64 object-contain bg-black"
                      />
                    )}
                  </div>
                )}

                {/* Thumbnail Cover Preview (if in 'all' view) */}
                {activeMediaTab === 'all' && hasThumbnail && !hasVideo && (
                  <div className="w-full h-52 rounded-xl overflow-hidden bg-black/20 border border-[var(--color-border)] relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={media.thumbnailUrl!}
                      alt={exercise.name}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setLightboxUrl(media.thumbnailUrl!)}
                    />
                    <button
                      onClick={() => setLightboxUrl(media.thumbnailUrl!)}
                      className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Full
                    </button>
                  </div>
                )}

                {/* Gallery Images */}
                {(activeMediaTab === 'all' || activeMediaTab === 'gallery') && hasImages && (
                  <div>
                    {hasVideo && (
                      <h5 className="text-[11px] font-bold text-[var(--color-text-muted)] mb-2">
                        Step Images
                      </h5>
                    )}
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {galleryImages.map((imgUrl, i) => (
                        <div
                          key={imgUrl + i}
                          onClick={() => setLightboxUrl(imgUrl)}
                          className="relative aspect-square rounded-xl overflow-hidden border border-[var(--color-border)] bg-black/20 cursor-pointer group hover:scale-[1.02] transition-transform"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgUrl}
                            alt={`Step ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Eye className="w-4 h-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 border border-dashed border-[var(--color-border)] rounded-xl text-center bg-[var(--color-surface-alt)]/30">
                <ImageIcon className="w-8 h-8 mx-auto text-[var(--color-text-muted)]/50 mb-1.5" />
                <p className="text-xs font-semibold text-[var(--color-text-muted)]">
                  No media added
                </p>
                <p className="text-[11px] text-[var(--color-text-muted)]/70">
                  This exercise currently does not have thumbnail photos, gallery images, or
                  demonstration videos.
                </p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div>
            <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[var(--color-primary)]" />
              Execution Steps
            </h4>
            {exercise.instructions && exercise.instructions.length > 0 ? (
              <div className="space-y-2.5">
                {exercise.instructions.map((ins) => (
                  <div
                    key={ins.step}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)]"
                  >
                    <div className="w-6 h-6 rounded-full bg-[var(--color-primary-subtle)] text-[var(--color-primary)] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {ins.step}
                    </div>
                    <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
                      {ins.instruction}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--color-text-muted)] italic">
                No explicit instructions provided.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[var(--color-border)] bg-[var(--color-surface-alt)]/30">
          <div className="flex items-center gap-2">
            {canEdit && onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onEdit(exercise);
                }}
                className="rounded-xl font-bold flex items-center gap-1.5 text-xs text-amber-600 border-amber-500/30 hover:bg-amber-500/10"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit Exercise
              </Button>
            )}

            {canReport && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReportModalOpen(true)}
                className="rounded-xl text-xs text-[var(--color-text-muted)] hover:text-rose-500 hover:bg-rose-500/10 flex items-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" />
                Report
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl">
              Close
            </Button>
            {isSelectable && onSelect && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onSelect(exercise);
                  onClose();
                }}
                className="rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" />
                Select Exercise
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal Dialog */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <h3 className="text-base font-bold text-[var(--color-heading)] flex items-center gap-2">
                <Flag className="w-4 h-4 text-rose-500" />
                Report Exercise
              </h3>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-heading)] hover:bg-[var(--color-surface-alt)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportStatus === 'success' ? (
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-in zoom-in" />
                <h4 className="font-bold text-sm text-[var(--color-heading)]">Report Submitted</h4>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Thank you. This report has been queued for moderation review.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3.5">
                {reportStatus === 'error' && (
                  <div className="flex items-center gap-2 p-3 text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{reportErrorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-[var(--color-heading)] block mb-1">
                    Reason for report
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text-primary)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    <option value="Inaccurate technique instructions">
                      Inaccurate technique instructions
                    </option>
                    <option value="Dangerous or unsafe execution">
                      Dangerous or unsafe execution
                    </option>
                    <option value="Inappropriate or non-exercise media">
                      Inappropriate or non-exercise media
                    </option>
                    <option value="Spam or duplicated exercise">Spam or duplicated exercise</option>
                    <option value="Copyright violation">Copyright violation</option>
                    <option value="Other">Other reason</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--color-heading)] block mb-1">
                    Additional details (optional)
                  </label>
                  <textarea
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Describe specific issues with this exercise..."
                    rows={3}
                    className="w-full p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text-primary)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsReportModalOpen(false)}
                    className="rounded-xl text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={reportExerciseMutation.isPending}
                    className="rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    {reportExerciseMutation.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      'Submit Report'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Lightbox for large preview */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] bg-transparent flex flex-col items-center">
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300 font-bold"
            >
              <X className="w-6 h-6" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxUrl}
              alt="Full size exercise asset"
              className="max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
};
