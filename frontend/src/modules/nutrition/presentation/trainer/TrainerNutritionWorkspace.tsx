'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCoachingRelationships } from '../../../coaching/application/queries/useCoachingRelationships';
import { CoachingRelationshipListItem } from '../../../coaching/domain/types/coaching.types';
import { TrainerNutritionClientsList } from './TrainerNutritionClientsList';
import { TrainerClientNutritionWorkspace } from './TrainerClientNutritionWorkspace';
import { NutritionPlanBuilder } from './NutritionPlanBuilder';
import { NutritionPlanVersionModal } from './NutritionPlanVersionModal';
import { NutritionPlan, CreateNutritionPlanVersionDTO } from '../../domain/types/nutrition.types';
import { useCreateNutritionPlanVersion } from '../../application/mutations/useNutritionPlanMutations';
import { Button } from '../../../../shared/components/ui/Button';
import { ArrowLeft, Apple } from 'lucide-react';

export const TrainerNutritionWorkspace: React.FC = () => {
  const searchParams = useSearchParams();
  const relationshipIdParam = searchParams.get('coachingRelationshipId') || '';

  const [viewMode, setViewMode] = useState<'clients' | 'workspace' | 'builder'>('clients');
  const [selectedRelationship, setSelectedRelationship] =
    useState<CoachingRelationshipListItem | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<NutritionPlan | null>(null);
  /**
   * basePlanForVersion is set when the builder should call the version-fork
   * endpoint instead of the initial-create endpoint.
   *
   * CASE A — No history: undefined → builder calls POST /nutrition-plans
   * CASE B — Active plan, trainer forks: activePlan → builder calls POST /nutrition-plans/:id/version
   * CASE C — History only, no active plan: highestVersionPlan → builder calls POST /nutrition-plans/:id/version
   */
  const [basePlanForVersion, setBasePlanForVersion] = useState<NutritionPlan | null>(null);
  const [versionModalPlan, setVersionModalPlan] = useState<NutritionPlan | null>(null);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  const { data: coachingData } = useCoachingRelationships({ limit: 100 });
  const relationships = coachingData?.relationships || [];

  const createVersionMutation = useCreateNutritionPlanVersion();

  // If URL contains coachingRelationshipId, locate relationship and open workspace
  useEffect(() => {
    if (relationshipIdParam && relationships.length > 0) {
      const match = relationships.find((r) => r.relationshipId === relationshipIdParam);
      if (match) {
        setSelectedRelationship(match);
        setViewMode('workspace');
      }
    }
  }, [relationshipIdParam, relationships]);

  const handleSelectClientWorkspace = (relationship: CoachingRelationshipListItem) => {
    setSelectedRelationship(relationship);
    setSelectedPlan(null);
    setBasePlanForVersion(null);
    setViewMode('workspace');
  };

  // Roster → initial create (no history)
  const handleCreatePlanForClient = (relationship: CoachingRelationshipListItem) => {
    setSelectedRelationship(relationship);
    setSelectedPlan(null);
    setBasePlanForVersion(null); // CASE A: no history
    setViewMode('builder');
  };

  // Roster → view (history exists) → opens client Nutrition Workspace
  const handleViewPlanForClient = (
    relationship: CoachingRelationshipListItem,
    plan?: NutritionPlan,
  ) => {
    setSelectedRelationship(relationship);
    setSelectedPlan(null);
    setBasePlanForVersion(null);
    setViewMode('workspace');
  };

  // Workspace → edit (active plan exists) → CASE B
  const handleEditPlan = (activePlan: NutritionPlan) => {
    setSelectedPlan(null); // not editing the active plan directly
    setBasePlanForVersion(activePlan); // fork from active plan
    setViewMode('builder');
  };

  // Workspace → create new version (history only, no active plan) → CASE C
  const handleCreateNewVersion = (highestVersionPlan: NutritionPlan) => {
    setSelectedPlan(null);
    setBasePlanForVersion(highestVersionPlan); // fork from highest version
    setViewMode('builder');
  };

  // Workspace initial create (no history)
  const handleWorkspaceCreatePlan = () => {
    setSelectedPlan(null);
    setBasePlanForVersion(null); // CASE A
    setViewMode('builder');
  };

  const handleViewPlan = (plan: NutritionPlan) => {
    setSelectedPlan(plan);
    setBasePlanForVersion(null);
    setViewMode('builder');
  };

  const handleEditPlanForClient = (
    relationship: CoachingRelationshipListItem,
    plan: NutritionPlan,
  ) => {
    setSelectedRelationship(relationship);
    setSelectedPlan(plan);
    setBasePlanForVersion(null);
    setViewMode('builder');
  };

  const handleOpenVersionModal = (plan: NutritionPlan) => {
    setVersionModalPlan(plan);
    setIsVersionModalOpen(true);
  };

  const handleVersionSubmit = async (payload: CreateNutritionPlanVersionDTO) => {
    if (!versionModalPlan) return;
    const newDraft = await createVersionMutation.mutateAsync({
      planId: versionModalPlan.id,
      payload,
    });
    setIsVersionModalOpen(false);
    setSelectedPlan(newDraft);
    setBasePlanForVersion(null);
    setViewMode('builder');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Global Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/trainer/coaching">
            <Button
              variant="outline"
              size="sm"
              className="border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] font-bold rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Client Roster
            </Button>
          </Link>

          {viewMode !== 'clients' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedRelationship(null);
                setSelectedPlan(null);
                setBasePlanForVersion(null);
                setViewMode('clients');
              }}
              className="text-xs font-bold text-[var(--color-primary)] hover:underline"
            >
              All Clients
            </Button>
          )}
        </div>
      </div>

      {/* Main Content View */}
      {viewMode === 'builder' ? (
        <NutritionPlanBuilder
          coachingRelationshipId={
            selectedPlan?.coachingRelationshipId ||
            basePlanForVersion?.coachingRelationshipId ||
            selectedRelationship?.relationshipId ||
            'cr_default'
          }
          existingPlan={selectedPlan}
          basePlanForVersion={basePlanForVersion}
          onBack={() => {
            if (selectedRelationship) {
              setViewMode('workspace');
            } else {
              setViewMode('clients');
            }
          }}
          onSaved={(saved) => {
            setSelectedPlan(saved);
            setBasePlanForVersion(null);
            if (selectedRelationship) {
              setViewMode('workspace');
            }
          }}
          onCreateVersion={handleOpenVersionModal}
        />
      ) : viewMode === 'workspace' && selectedRelationship ? (
        <TrainerClientNutritionWorkspace
          relationship={selectedRelationship}
          onBack={() => {
            setSelectedRelationship(null);
            setViewMode('clients');
          }}
          onCreatePlan={handleWorkspaceCreatePlan}
          onEditPlan={handleEditPlan}
          onCreateNewVersion={handleCreateNewVersion}
          onViewPlan={handleViewPlan}
        />
      ) : (
        <TrainerNutritionClientsList
          onSelectClientWorkspace={handleSelectClientWorkspace}
          onCreatePlanForClient={handleCreatePlanForClient}
          onEditPlanForClient={handleEditPlanForClient}
          onViewPlanForClient={handleViewPlanForClient}
        />
      )}

      {/* Version Creation Modal */}
      <NutritionPlanVersionModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        basePlan={versionModalPlan}
        onSubmit={handleVersionSubmit}
        isLoading={createVersionMutation.isPending}
      />
    </div>
  );
};
