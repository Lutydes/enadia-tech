'use client';

// Phase system removed - EnadIA TECH has all features unlocked
export const PHASE_COLORS: Record<number, string> = {
  1: '#00f0ff',
};

export const PHASE_NAMES: Record<number, string> = {
  1: 'TECH',
};

export interface PhaseConfig {
  phase: number;
  name: string;
  features: string[];
  active: boolean;
}

export function usePhaseAccess() {
  return {
    currentPhase: { phase: 1, name: 'TECH', features: [], active: true },
    loading: false,
    hasFeature: () => true,
    isViewEnabled: () => true,
    getMinPhaseForView: () => null,
    getMinPhaseForFeature: () => 1,
  };
}
