'use client';

import React, { useState } from 'react';
import {
  DifficultyLevel,
  EquipmentType,
  Exercise,
  ExerciseOrigin,
  ExerciseStatus,
  PrimaryMuscleGroup,
} from '../../domain/types/workout.types';
import { useExercises } from '../../application/queries/useExercises';
import { useAuthStore } from '../../../identity/application/store/authStore';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { CreateExerciseModal } from './CreateExerciseModal';
import { EditExerciseModal } from './EditExerciseModal';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import { Search, Dumbbell, Plus, X, Eye, Sparkles, UserCheck, Edit } from 'lucide-react';

interface ExerciseCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

export const ExerciseCatalogModal: React.FC<ExerciseCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectExercise,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMyExercises, setIsMyExercises] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState<string>('');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { user: authUser } = useAuthStore();

  const { data, isLoading } = useExercises({
    status: ExerciseStatus.ACTIVE,
    search: searchQuery || undefined,
    query: searchQuery || undefined,
    mine: isMyExercises ? true : undefined,
    primaryMuscleGroup: (selectedMuscle as PrimaryMuscleGroup) || undefined,
    equipment: (selectedEquipment as EquipmentType) || undefined,
    difficulty: (selectedDifficulty as DifficultyLevel) || undefined,
  });

  if (!isOpen) return null;

  const exercises = data?.exercises || [];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-4xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)] flex items-center justify-center">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--color-heading)]">Exercise Library</h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Browse and prescribe verified exercises into your training routine
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCreateOpen(true)}
                className="rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Create Exercise
              </Button>
              <button
                onClick={onClose}
                className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-heading)] hover:bg-[var(--color-surface-alt)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scope & Filter Bar */}
          <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]/40 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <Input
                  placeholder="Search exercises by name, category, or target muscles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 rounded-xl bg-[var(--color-surface)] border-[var(--color-border)]"
                />
              </div>

              {/* Scope Switcher: All Library vs My Exercises */}
              <div className="flex items-center p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shrink-0">
                <button
                  type="button"
                  onClick={() => setIsMyExercises(false)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    !isMyExercises
                      ? 'bg-[var(--color-primary)] text-white shadow-xs'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-heading)]'
                  }`}
                >
                  All Library
                </button>
                <button
                  type="button"
                  onClick={() => setIsMyExercises(true)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    isMyExercises
                      ? 'bg-[var(--color-primary)] text-white shadow-xs'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-heading)]'
                  }`}
                >
                  My Exercises
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedMuscle}
                onChange={(e) => setSelectedMuscle(e.target.value)}
                className="h-8 px-2.5 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] font-medium focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              >
                <option value="">All Muscles</option>
                {Object.values(PrimaryMuscleGroup).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="h-8 px-2.5 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] font-medium focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              >
                <option value="">All Equipment</option>
                {Object.values(EquipmentType).map((eq) => (
                  <option key={eq} value={eq}>
                    {eq}
                  </option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="h-8 px-2.5 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] font-medium focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              >
                <option value="">All Difficulties</option>
                {Object.values(DifficultyLevel).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              {(searchQuery ||
                selectedMuscle ||
                selectedEquipment ||
                selectedDifficulty ||
                isMyExercises) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setIsMyExercises(false);
                    setSelectedMuscle('');
                    setSelectedEquipment('');
                    setSelectedDifficulty('');
                  }}
                  className="h-8 px-2 text-xs text-[var(--color-primary)] font-bold hover:underline"
                >
                  Reset Filters
                </Button>
              )}
            </div>
          </div>

          {/* Exercise Grid */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="h-32 rounded-xl bg-[var(--color-surface-alt)] animate-pulse"
                  />
                ))}
              </div>
            ) : exercises.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Dumbbell className="w-10 h-10 text-[var(--color-text-muted)] mb-3" />
                <h3 className="text-sm font-bold text-[var(--color-heading)]">
                  No exercises found
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1 mb-4">
                  {isMyExercises
                    ? "You haven't created any custom exercises yet."
                    : 'Try adjusting your search query or add a custom exercise'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateOpen(true)}
                  className="rounded-xl font-bold border-[var(--color-primary)] text-[var(--color-primary)]"
                >
                  Create New Exercise
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {exercises.map((exercise) => {
                  const isOwner = authUser && exercise.createdByTrainerId === authUser.id;
                  const isTrainerOrigin =
                    exercise.origin === ExerciseOrigin.TRAINER || !!exercise.createdByTrainerId;
                  const hasThumb = !!exercise.media?.thumbnailUrl;

                  return (
                    <div
                      key={exercise.id}
                      className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden"
                    >
                      <div>
                        {hasThumb && (
                          <div className="w-full h-24 mb-3 rounded-lg overflow-hidden bg-black/10 border border-[var(--color-border)] relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={exercise.media!.thumbnailUrl!}
                              alt={exercise.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}

                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h4 className="font-bold text-sm text-[var(--color-heading)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                            {exercise.name}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] font-semibold border border-[var(--color-border)] shrink-0">
                            {exercise.difficulty}
                          </span>
                        </div>

                        {/* Creator attribution pill */}
                        <div className="mb-2">
                          {isTrainerOrigin ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20">
                              <UserCheck className="w-3 h-3" />
                              {isOwner ? 'Created by you' : 'Created by Trainer'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[var(--color-primary-subtle)] text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                              <Sparkles className="w-3 h-3" />
                              KIZUNAFIT / Platform
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--color-text-muted)] mb-3">
                          <span className="text-[var(--color-text-secondary)] font-medium">
                            {exercise.primaryMuscleGroup}
                          </span>
                          <span>•</span>
                          <span>{exercise.equipment}</span>
                          <span>•</span>
                          <span>{exercise.caloriesPerMinute} kcal/min</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]/60 gap-1.5">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPreviewExercise(exercise)}
                            className="h-8 px-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-heading)] flex items-center gap-1 rounded-lg"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Details
                          </Button>
                          {isOwner && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingExercise(exercise)}
                              className="h-8 px-2 text-xs font-semibold text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 flex items-center gap-1 rounded-lg"
                              title="Edit exercise"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            onSelectExercise(exercise);
                            onClose();
                          }}
                          className="h-8 px-3 text-xs font-bold rounded-lg flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Select
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <ExerciseDetailModal
        exercise={previewExercise}
        isOpen={!!previewExercise}
        onClose={() => setPreviewExercise(null)}
        onSelect={onSelectExercise}
        onEdit={(ex) => setEditingExercise(ex)}
        isSelectable
      />

      <CreateExerciseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={(newEx) => {
          setPreviewExercise(newEx);
        }}
      />

      <EditExerciseModal
        exercise={editingExercise}
        isOpen={!!editingExercise}
        onClose={() => setEditingExercise(null)}
        onUpdated={(updatedEx) => {
          setPreviewExercise(updatedEx);
        }}
      />
    </>
  );
};
