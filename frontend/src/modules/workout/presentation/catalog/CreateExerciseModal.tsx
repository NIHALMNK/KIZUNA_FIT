'use client';

import React, { useState } from 'react';
import {
  DifficultyLevel,
  EquipmentType,
  Exercise,
  ExerciseStatus,
  PrimaryMuscleGroup,
} from '../../domain/types/workout.types';
import { useCreateExercise } from '../../application/mutations/useWorkoutMutations';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import { ExerciseMediaUploader } from './ExerciseMediaUploader';
import { isValidYouTubeUrl } from '../../domain/utils/youtube.utils';
import { Dumbbell, Plus, Trash2, X, Sparkles, Layers, Image as ImageIcon } from 'lucide-react';

interface CreateExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (exercise: Exercise) => void;
}

export const CreateExerciseModal: React.FC<CreateExerciseModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Strength');
  const [primaryMuscleGroup, setPrimaryMuscleGroup] = useState<PrimaryMuscleGroup>(
    PrimaryMuscleGroup.CHEST,
  );
  const [secondaryMuscleGroups, setSecondaryMuscleGroups] = useState<PrimaryMuscleGroup[]>([]);
  const [equipment, setEquipment] = useState<EquipmentType>(EquipmentType.BARBELL);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.INTERMEDIATE);
  const [caloriesPerMinute, setCaloriesPerMinute] = useState<number>(6);
  const [instructions, setInstructions] = useState<string[]>([
    'Assume the starting position with proper alignment.',
    'Execute the movement through full range of motion with controlled tempo.',
    'Return to starting position under control and repeat.',
  ]);

  // Media state
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'details' | 'media'>('details');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const createExerciseMutation = useCreateExercise();

  if (!isOpen) return null;

  const toggleSecondaryMuscle = (muscle: PrimaryMuscleGroup) => {
    if (secondaryMuscleGroups.includes(muscle)) {
      setSecondaryMuscleGroups(secondaryMuscleGroups.filter((m) => m !== muscle));
    } else {
      setSecondaryMuscleGroups([...secondaryMuscleGroups, muscle]);
    }
  };

  const handleAddInstructionStep = () => {
    setInstructions((prev) => [...prev, '']);
  };

  const handleUpdateInstruction = (index: number, val: string) => {
    setInstructions((prev) => {
      const updated = [...prev];
      updated[index] = val;
      return updated;
    });
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Exercise name is required.');
      setActiveTab('details');
      return;
    }

    if (videoUrl && videoUrl.trim() !== '' && !isValidYouTubeUrl(videoUrl)) {
      setErrorMsg(
        'Please enter a valid YouTube video URL (e.g., https://www.youtube.com/watch?v=..., https://youtu.be/..., or https://www.youtube.com/shorts/...).',
      );
      setActiveTab('media');
      return;
    }

    setErrorMsg(null);
    try {
      const formattedInstructions = instructions
        .filter((ins) => ins.trim().length > 0)
        .map((instruction, idx) => ({ step: idx + 1, instruction }));

      const res = await createExerciseMutation.mutateAsync({
        name: name.trim(),
        category: category.trim() || 'Strength',
        primaryMuscleGroup,
        secondaryMuscleGroups,
        equipment,
        difficulty,
        instructions: formattedInstructions,
        media: {
          thumbnailUrl,
          imageUrls,
          videoUrl,
          images: imageUrls,
        },
        caloriesPerMinute: Number(caloriesPerMinute) || 5,
        status: ExerciseStatus.ACTIVE,
      });

      if (onCreated) onCreated(res);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create exercise in catalog.');
    }
  };

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
              <h2 className="text-xl font-bold text-[var(--color-heading)]">Add Custom Exercise</h2>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Create a verified exercise entry with media and execution steps
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-heading)] hover:bg-[var(--color-surface-alt)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[var(--color-border)] px-6 bg-[var(--color-surface-alt)]/40">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'details'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-heading)]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            1. Exercise Details & Steps
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'media'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-heading)]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            2. Media & Demo Video
            {(thumbnailUrl || imageUrls.length > 0 || videoUrl) && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 text-xs font-semibold rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
              {errorMsg}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[var(--color-text-secondary)] block mb-1.5">
                  Exercise Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Romanian Deadlift"
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[var(--color-text-secondary)] block mb-1.5">
                    Category
                  </label>
                  <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Legs, Push, Pull"
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--color-text-secondary)] block mb-1.5">
                    Primary Muscle Group
                  </label>
                  <select
                    value={primaryMuscleGroup}
                    onChange={(e) => setPrimaryMuscleGroup(e.target.value as PrimaryMuscleGroup)}
                    className="w-full h-10 px-3 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    {Object.values(PrimaryMuscleGroup).map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Secondary Muscle Groups */}
              <div>
                <label className="text-xs font-bold text-[var(--color-text-secondary)] block mb-1.5">
                  Secondary Muscle Groups (Optional)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {Object.values(PrimaryMuscleGroup)
                    .filter((m) => m !== primaryMuscleGroup)
                    .map((muscle) => {
                      const isSelected = secondaryMuscleGroups.includes(muscle);
                      return (
                        <button
                          key={muscle}
                          type="button"
                          onClick={() => toggleSecondaryMuscle(muscle)}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                            isSelected
                              ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                              : 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary)]/40'
                          }`}
                        >
                          {muscle}
                        </button>
                      );
                    })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-[var(--color-text-secondary)] block mb-1.5">
                    Equipment
                  </label>
                  <select
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value as EquipmentType)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    {Object.values(EquipmentType).map((eq) => (
                      <option key={eq} value={eq}>
                        {eq}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--color-text-secondary)] block mb-1.5">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    {Object.values(DifficultyLevel).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--color-text-secondary)] block mb-1.5">
                    Cal / Min
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={caloriesPerMinute}
                    onChange={(e) => setCaloriesPerMinute(parseFloat(e.target.value) || 5)}
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* Execution Steps */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[var(--color-text-secondary)]">
                    Execution Instructions
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAddInstructionStep}
                    className="h-7 px-2 text-xs font-bold text-[var(--color-primary)] flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Step
                  </Button>
                </div>

                <div className="space-y-2">
                  {instructions.map((stepText, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <Input
                        value={stepText}
                        onChange={(e) => handleUpdateInstruction(idx, e.target.value)}
                        placeholder={`Step ${idx + 1} instruction...`}
                        className="h-9 text-xs rounded-xl flex-1"
                      />
                      {instructions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveInstruction(idx)}
                          className="p-2 text-[var(--color-text-muted)] hover:text-rose-500 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div>
              <ExerciseMediaUploader
                thumbnailUrl={thumbnailUrl}
                onThumbnailChange={setThumbnailUrl}
                imageUrls={imageUrls}
                onImageUrlsChange={setImageUrls}
                videoUrl={videoUrl}
                onVideoChange={setVideoUrl}
              />
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
            <div className="text-xs text-[var(--color-text-muted)]">
              {activeTab === 'details' ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('media')}
                  className="text-[var(--color-primary)] hover:underline font-medium"
                >
                  Next: Add Media &rarr;
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className="text-[var(--color-text-secondary)] hover:underline font-medium"
                >
                  &larr; Back to Details
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={createExerciseMutation.isPending}
                className="rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                {createExerciseMutation.isPending ? 'Saving...' : 'Save Exercise'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
