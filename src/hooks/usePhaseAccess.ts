'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/app-store';

export interface PhaseConfig {
  phase: number;
  name: string;
  features: string[];
  active: boolean;
}

export const PHASE_FEATURES: Record<number, string[]> = {
  1: ['chat', 'diagnóstico', 'revisão_básica'],
  2: ['chat', 'diagnóstico', 'revisão_básica', 'simulados_microarea', 'dicas', 'relatório_individual', 'ranking'],
  3: ['chat', 'diagnóstico', 'revisão_básica', 'simulados_microarea', 'dicas', 'relatório_individual', 'simulados_completos', 'enade_simulado', 'relatório_coletivo', 'ranking'],
  4: ['chat', 'diagnóstico', 'revisão_básica', 'simulados_microarea', 'dicas', 'relatório_individual', 'simulados_completos', 'enade_simulado', 'relatório_coletivo', 'simulados_cronometrados', 'relatório_final', 'ranking'],
};

export const PHASE_COLORS: Record<number, string> = {
  1: '#3b82f6', // blue
  2: '#f59e0b', // yellow
  3: '#10b981', // green
  4: '#ef4444', // red
};

export const PHASE_NAMES: Record<number, string> = {
  1: 'Diagnóstico',
  2: 'Prática Direcionada',
  3: 'Simulados Completos',
  4: 'Preparação Final',
};

/** Maps features to view/tab names */
const FEATURE_VIEW_MAP: Record<string, string> = {
  'chat': 'chat',
  'diagnóstico': 'simulado',
  'revisão_básica': 'revisao',
  'simulados_microarea': 'simulado',
  'dicas': 'dicas',
  'relatório_individual': 'dashboard',
  'ranking': 'ranking',
  'simulados_completos': 'simulado',
  'enade_simulado': 'simulado',
  'relatório_coletivo': 'dashboard',
  'simulados_cronometrados': 'simulado',
  'relatório_final': 'dashboard',
};

export function usePhaseAccess() {
  const { token } = useAppStore();
  const [currentPhase, setCurrentPhase] = useState<PhaseConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPhase() {
      try {
        const res = await fetch('/api/phases', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          // API returns { phase: ... } for current active phase
          const active = data.phase || data.phases?.find((p: PhaseConfig) => p.active);
          if (active) {
            setCurrentPhase({
              phase: active.phase,
              name: active.name,
              features: active.features ? JSON.parse(typeof active.features === 'string' ? active.features : JSON.stringify(active.features)) : PHASE_FEATURES[active.phase] || [],
              active: true,
            });
          }
        }
      } catch {
        // Silently fail - phase system will be disabled
      }
      setLoading(false);
    }
    loadPhase();
  }, [token]);

  const hasFeature = (feature: string): boolean => {
    if (!currentPhase) return true; // If no phase system, allow all
    return (PHASE_FEATURES[currentPhase.phase] || []).includes(feature);
  };

  const isViewEnabled = (viewName: string): boolean => {
    const featureMap: Record<string, string[]> = {
      'chat': ['chat'],
      'simulado': ['diagnóstico', 'simulados_microarea', 'simulados_completos', 'enade_simulado', 'simulados_cronometrados'],
      'revisao': ['revisão_básica'],
      'dashboard': ['relatório_individual', 'relatório_coletivo', 'relatório_final'],
      'dicas': ['dicas'],
      'ranking': ['ranking'],
    };
    const requiredFeatures = featureMap[viewName] || [];
    return requiredFeatures.some(f => hasFeature(f));
  };

  const getMinPhaseForView = (viewName: string): number | null => {
    const featureMap: Record<string, string[]> = {
      'chat': ['chat'],
      'simulado': ['diagnóstico', 'simulados_microarea', 'simulados_completos', 'enade_simulado', 'simulados_cronometrados'],
      'revisao': ['revisão_básica'],
      'dashboard': ['relatório_individual', 'relatório_coletivo', 'relatório_final'],
      'dicas': ['dicas'],
      'ranking': ['ranking'],
    };
    const requiredFeatures = featureMap[viewName] || [];
    for (let p = 1; p <= 4; p++) {
      if ((PHASE_FEATURES[p] || []).some(f => requiredFeatures.includes(f))) {
        return p;
      }
    }
    return null;
  };

  const getMinPhaseForFeature = (feature: string): number => {
    for (let p = 1; p <= 4; p++) {
      if ((PHASE_FEATURES[p] || []).includes(feature)) {
        return p;
      }
    }
    return 1;
  };

  return {
    currentPhase,
    loading,
    hasFeature,
    isViewEnabled,
    getMinPhaseForView,
    getMinPhaseForFeature,
  };
}
