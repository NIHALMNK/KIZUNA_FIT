import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Avatar } from '../../../../shared/components/ui/Avatar';
import { cn } from '../../../../shared/utils/cn';

export interface ClientOption {
  relationshipId: string;
  clientId: string;
  fullName: string;
  avatarUrl?: string | null;
  status: string;
}

export interface ClientSelectorProps {
  clients: ClientOption[];
  selectedRelationshipId?: string;
  onSelectClient: (relationshipId: string) => void;
  disabled?: boolean;
  className?: string;
}

function getInitials(name?: string): string {
  if (!name || !name.trim()) return 'CL';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({
  clients,
  selectedRelationshipId,
  onSelectClient,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedClient =
    clients.find((c) => c.relationshipId === selectedRelationshipId) || clients[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      const idx = clients.findIndex((c) => c.relationshipId === selectedRelationshipId);
      setFocusedIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, clients, selectedRelationshipId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || clients.length === 0) return;

    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % clients.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + clients.length) % clients.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < clients.length) {
          onSelectClient(clients[focusedIndex].relationshipId);
          setIsOpen(false);
        }
        break;
      case 'Escape':
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  if (!selectedClient && clients.length === 0) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className={cn('relative inline-block w-full sm:w-auto text-left select-none', className)}
      onKeyDown={handleKeyDown}
    >
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select Client"
        className={cn(
          'w-full sm:w-auto flex items-center justify-between gap-3 bg-[var(--color-surface-alt)] hover:bg-[var(--color-surface)] text-[var(--color-heading)] text-xs font-semibold px-3 py-2 rounded-xl border border-[var(--color-border)] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all cursor-pointer shadow-xs',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar
            src={selectedClient?.avatarUrl || undefined}
            alt={selectedClient?.fullName}
            fallback={getInitials(selectedClient?.fullName)}
            size="sm"
            className="h-8 w-8 text-xs shrink-0 border border-[var(--color-border)]"
          />
          <span className="truncate font-bold text-xs text-[var(--color-heading)] max-w-[140px] sm:max-w-[180px]">
            {selectedClient?.fullName || 'Select Client'}
          </span>
          {selectedClient?.status && (
            <span
              className={cn(
                'text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border shrink-0',
                selectedClient.status === 'ACTIVE'
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400'
                  : 'bg-slate-500/10 text-slate-500 border-slate-500/20',
              )}
            >
              ({selectedClient.status})
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-[var(--color-text-secondary)] shrink-0 transition-transform duration-200 ml-1',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-full sm:w-80 max-h-72 overflow-y-auto rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150"
        >
          {clients.map((client, index) => {
            const isSelected = client.relationshipId === selectedRelationshipId;
            const isFocused = index === focusedIndex;

            return (
              <div
                key={client.relationshipId}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onSelectClient(client.relationshipId);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setFocusedIndex(index)}
                className={cn(
                  'flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors',
                  isSelected
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold'
                    : isFocused
                      ? 'bg-[var(--color-surface-alt)] text-[var(--color-heading)]'
                      : 'text-[var(--color-heading)] hover:bg-[var(--color-surface-alt)]',
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar
                    src={client.avatarUrl || undefined}
                    alt={client.fullName}
                    fallback={getInitials(client.fullName)}
                    size="sm"
                    className="h-8 w-8 text-xs shrink-0 border border-[var(--color-border)]"
                  />
                  <div className="min-w-0 flex flex-col">
                    <span className="truncate font-bold text-xs max-w-[130px] sm:max-w-[160px]">
                      {client.fullName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={cn(
                      'text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border',
                      client.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400'
                        : 'bg-slate-500/10 text-slate-500 border-slate-500/20',
                    )}
                  >
                    ({client.status})
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
