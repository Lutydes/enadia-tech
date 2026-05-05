'use client';

// Phase system removed - EnadIA TECH has all features unlocked
export function usePhaseAccess() {
  return {
    hasFeature: () => true,
    isViewEnabled: () => true,
  };
}
