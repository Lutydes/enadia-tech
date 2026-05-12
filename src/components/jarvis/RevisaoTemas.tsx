'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, ChevronDown, BookOpen, X, Hash, Zap } from 'lucide-react';
import { enadeTopics, EnadeTopic } from '@/lib/enade-topics';
import {
  MACROAREAS,
  getMicroareaStats,
  type MicroareaInfo,
} from '@/lib/enade-full-bank';
import { useAppStore } from '@/store/app-store';
// Phase system removed - all features unlocked

interface ApiMicroarea {
  id: string;
  name: string;
  code: string;
  macroarea: string;
  description: string;
  color: string;
  _count: {
    elements: number;
    questions: number;
  };
}

interface ApiElement {
  id: string;
  code: string;
  name: string;
  description: string;
  skillLevel: string;
}

interface MicroareaPerformance {
  total: number;
  correct: number;
  hitRate: number;
}

function TopicIcon({ name, color }: { name: string; color: string }) {
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center"
      style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
    >
      <BookOpen size={18} style={{ color }} />
    </div>
  );
}

function PerformanceBar({ hitRate, total }: { hitRate: number; total: number }) {
  if (total === 0) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full w-0 rounded-full" />
        </div>
        <span className="text-[10px] font-mono text-slate-600">sem dados</span>
      </div>
    );
  }

  const barColor = hitRate >= 70 ? '#10b981' : hitRate >= 50 ? '#f59e0b' : '#ef4444';
  const textColor = hitRate >= 70 ? 'text-emerald-400' : hitRate >= 50 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${hitRate}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: barColor }}
        />
      </div>
      <span className={`text-[10px] font-bold font-mono ${textColor}`}>{hitRate}%</span>
    </div>
  );
}

export function RevisaoTemas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [apiMicroareas, setApiMicroareas] = useState<ApiMicroarea[]>([]);
  const [apiElements, setApiElements] = useState<Record<string, ApiElement[]>>({});
  const [microareaPerformance, setMicroareaPerformance] = useState<Record<string, MicroareaPerformance>>({});
  const [apiLoading, setApiLoading] = useState(true);

  const setCurrentView = useAppStore((s) => s.setCurrentView);
  const setChatPreFilledQuestion = useAppStore((s) => s.setChatPreFilledQuestion);
  const token = useAppStore((s) => s.token);
  // Phase system removed - all features unlocked

  // Fetch microareas from API
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch microareas (public endpoint, no auth needed)
        const [maRes, elementsRes] = await Promise.all([
          fetch('/api/microareas'),
          fetch('/api/elements'),
        ]);

        if (maRes.ok) {
          const maData = await maRes.json();
          setApiMicroareas(maData.microareas || []);
        }

        if (elementsRes.ok) {
          const elData = await elementsRes.json();
          // Group elements by microarea ID
          const elementMap: Record<string, ApiElement[]> = {};
          for (const el of (elData.elements || [])) {
            if (!elementMap[el.microareaId]) elementMap[el.microareaId] = [];
            elementMap[el.microareaId].push(el);
          }
          setApiElements(elementMap);
        }

        // Fetch performance data from dashboard stats
        if (token) {
          const statsRes = await fetch('/api/dashboard/stats', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            const perfMap: Record<string, MicroareaPerformance> = {};
            for (const ma of (statsData.byMicroarea || [])) {
              perfMap[ma.microareaId] = {
                total: ma.total,
                correct: ma.correct,
                hitRate: ma.hitRate,
              };
            }
            setMicroareaPerformance(perfMap);
          }
        }
      } catch {
        // Fallback to local data
      }
      setApiLoading(false);
    }
    loadData();
  }, [token]);

  // Build a map from API microarea IDs to performance
  const getPerformance = (microareaId: string): MicroareaPerformance => {
    return microareaPerformance[microareaId] || { total: 0, correct: 0, hitRate: 0 };
  };

  // Get microarea stats from the full bank (for local question data)
  const localMicroareaStats = useMemo(() => getMicroareaStats(), []);

  const topicToMicroarea = useMemo(() => {
    const map = new Map<string, typeof localMicroareaStats[0]>();
    for (const stat of localMicroareaStats) {
      map.set(stat.name, stat);
    }
    return map;
  }, [localMicroareaStats]);

  // Build API microarea name to ID mapping
  const apiNameToId = useMemo(() => {
    const map = new Map<string, string>();
    for (const ma of apiMicroareas) {
      map.set(ma.name, ma.id);
    }
    return map;
  }, [apiMicroareas]);

  // Build API microarea name to data mapping
  const apiNameToData = useMemo(() => {
    const map = new Map<string, ApiMicroarea>();
    for (const ma of apiMicroareas) {
      map.set(ma.name, ma);
    }
    return map;
  }, [apiMicroareas]);

  const filteredTopics = enadeTopics.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subtopics.some(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Filter microareas by search
  const filteredApiMicroareas = apiMicroareas.filter(
    (ma) =>
      ma.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ma.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apiElements[ma.id] || []).some(
        (el) => el.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const studyWithEnadIA = (topic: EnadeTopic) => {
    setChatPreFilledQuestion(
      `Olá EnadIA! Gostaria de revisar o tema "${topic.name}". Por favor, me dê uma explicação completa sobre os principais conceitos, com exemplos práticos e, se possível, algumas questões no estilo ENADE para eu praticar.`
    );
    setCurrentView('chat');
  };

  const studySubtopicWithEnadIA = (topic: EnadeTopic, subtopicName: string) => {
    setChatPreFilledQuestion(
      `Olá EnadIA! Quero estudar sobre "${subtopicName}" dentro de "${topic.name}". Pode me explicar os conceitos principais, dar exemplos e me mostrar como isso cai no ENADE?`
    );
    setCurrentView('chat');
  };

  const studyMicroareaWithEnadIA = (microarea: ApiMicroarea) => {
    const elements = apiElements[microarea.id] || [];
    const elementNames = elements.slice(0, 5).map(e => e.name).join(', ');
    setChatPreFilledQuestion(
      `Olá EnadIA! Quero revisar a microárea "${microarea.name}" (${microarea.macroarea}). Os elementos que preciso estudar incluem: ${elementNames}. Por favor, me dê uma explicação completa com exemplos práticos e questões no estilo ENADE.`
    );
    setCurrentView('chat');
  };

  const studyLocalMicroareaWithEnadIA = (microarea: typeof localMicroareaStats[0]) => {
    const elementList = microarea.elements.slice(0, 5).join(', ');
    setChatPreFilledQuestion(
      `Olá EnadIA! Quero revisar a microárea "${microarea.name}" (${microarea.macroarea}). Os elementos que preciso estudar incluem: ${elementList}. Por favor, me dê uma explicação completa com exemplos práticos e questões no estilo ENADE.`
    );
    setCurrentView('chat');
  };

  // Group API microareas by macroarea
  const apiGroupedByMacroarea = useMemo(() => {
    const groups: Record<string, ApiMicroarea[]> = {};
    for (const ma of filteredApiMicroareas) {
      if (!groups[ma.macroarea]) groups[ma.macroarea] = [];
      groups[ma.macroarea].push(ma);
    }
    return groups;
  }, [filteredApiMicroareas]);

  const totalQuestions = apiMicroareas.reduce((sum, ma) => sum + ma._count.questions, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-[#1e293b] bg-[#0d1321]/50 backdrop-blur-sm">
        <h2 className="text-lg font-semibold jarvis-gradient">Revisão por Tema</h2>
        <p className="text-xs text-slate-500 mt-1">
          Explore as microáreas do ENADE e estude com a EnadIA ·{' '}
          <span className="text-cyan-500 font-mono">
            {apiMicroareas.length} microáreas
            {totalQuestions > 0 ? ` • ${totalQuestions} questões` : ''}
          </span>{' '}
          disponíveis
        </p>

        {/* Search */}
        <div className="relative mt-4">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar tema, microárea ou elemento..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#1e293b] border border-[#1e293b] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* API Microareas grouped by Macroarea */}
          {!apiLoading && Object.entries(apiGroupedByMacroarea).length > 0 && (
            <>
              {Object.entries(apiGroupedByMacroarea).map(([macroareaName, microareas]) => (
                <div key={macroareaName}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
                      {macroareaName}
                    </h3>
                    <span className="text-[10px] text-slate-600">
                      {microareas.length} microáreas
                    </span>
                  </div>

                  <div className="space-y-2 ml-2">
                    {microareas.map((microarea) => {
                      const isExpanded = expandedTopic === `api-${microarea.id}`;
                      const perf = getPerformance(microarea.id);
                      const elements = apiElements[microarea.id] || [];

                      return (
                        <motion.div
                          key={microarea.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="jarvis-card overflow-hidden"
                        >
                          {/* Microarea header */}
                          <button
                            onClick={() =>
                              setExpandedTopic(
                                isExpanded ? null : `api-${microarea.id}`
                              )
                            }
                            className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.02] transition-colors"
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{
                                backgroundColor: `${microarea.color}15`,
                                border: `1px solid ${microarea.color}30`,
                              }}
                            >
                              <BookOpen size={14} style={{ color: microarea.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-slate-200">
                                {microarea.name}
                              </h4>
                              <div className="flex gap-2 mt-1 flex-wrap">
                                <span
                                  className="text-[10px] px-2 py-0.5 rounded-full"
                                  style={{
                                    backgroundColor: `${microarea.color}15`,
                                    color: microarea.color,
                                    border: `1px solid ${microarea.color}30`,
                                  }}
                                >
                                  {microarea._count.questions} questões
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1e293b] text-slate-500">
                                  {microarea._count.elements} elementos
                                </span>
                                {perf.total > 0 && (
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                    perf.hitRate >= 70
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                      : perf.hitRate >= 50
                                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                  }`}>
                                    {perf.hitRate}% acerto
                                  </span>
                                )}
                              </div>
                              {/* B. Performance overlay bar */}
                              <div className="mt-2">
                                <PerformanceBar hitRate={perf.hitRate} total={perf.total} />
                              </div>
                            </div>
                            {isExpanded ? (
                              <ChevronDown
                                size={16}
                                className="text-slate-500 flex-shrink-0"
                              />
                            ) : (
                              <ChevronRight
                                size={16}
                                className="text-slate-500 flex-shrink-0"
                              />
                            )}
                          </button>

                          {/* Expanded: Elements list */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 pb-4 border-t border-[#1e293b] pt-3 space-y-3">
                                  {/* Description */}
                                  {microarea.description && (
                                    <p className="text-xs text-slate-400 italic">
                                      {microarea.description}
                                    </p>
                                  )}

                                  {/* Elements grid from API */}
                                  {elements.length > 0 && (
                                    <div>
                                      <h5 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Hash size={10} /> Elementos cobertos ({elements.length})
                                      </h5>
                                      <div className="flex flex-wrap gap-1.5">
                                        {elements.map((el) => (
                                          <span
                                            key={el.id}
                                            className="text-[11px] px-2.5 py-1 rounded-lg bg-[#0a0e17] border border-[#1e293b] text-slate-400"
                                          >
                                            {el.name}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* C. Estudar com EnadIA button */}
                                  <motion.button
                                    onClick={() => studyMicroareaWithEnadIA(microarea)}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2"
                                    style={{
                                      backgroundColor: `${microarea.color}10`,
                                      border: `1px solid ${microarea.color}30`,
                                      color: microarea.color,
                                    }}
                                  >
                                    <Zap size={14} />
                                    Estudar {microarea.name} com EnadIA
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Fallback: Local microareas from full bank (when API is not available) */}
          {apiLoading && (
            <div className="text-center py-8">
              <div className="w-6 h-6 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Carregando microáreas...</p>
            </div>
          )}

          {/* Local microareas from full bank */}
          {MACROAREAS.filter((macro) =>
            macro.microareas.some(
              (t) => topicToMicroarea.get(t)?.questionCount || 0 > 0
            )
          ).map((macro) => (
            <div key={`local-${macro.name}`}>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: macro.color }}
                />
                <h3
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: macro.color }}
                >
                  {macro.name}
                </h3>
                <span className="text-[10px] text-slate-600">
                  {macro.microareas
                    .reduce(
                      (sum, t) => sum + (topicToMicroarea.get(t)?.questionCount || 0),
                      0
                    )
                    .toLocaleString()}{' '}
                  questões
                </span>
              </div>

              <div className="space-y-2 ml-2">
                {macro.microareas
                  .filter(
                    (t) => (topicToMicroarea.get(t)?.questionCount || 0) > 0
                  )
                  .map((microareaName) => {
                    const stat = topicToMicroarea.get(microareaName)!;
                    const isExpanded = expandedTopic === `micro-${microareaName}`;
                    // Try to find API performance data
                    const apiMaId = apiNameToId.get(microareaName);
                    const perf = apiMaId ? getPerformance(apiMaId) : { total: 0, correct: 0, hitRate: 0 };

                    return (
                      <motion.div
                        key={microareaName}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="jarvis-card overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setExpandedTopic(
                              isExpanded ? null : `micro-${microareaName}`
                            )
                          }
                          className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.02] transition-colors"
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor: `${macro.color}15`,
                              border: `1px solid ${macro.color}30`,
                            }}
                          >
                            <BookOpen size={14} style={{ color: macro.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-slate-200">
                              {microareaName}
                            </h4>
                            <div className="flex gap-2 mt-1 flex-wrap">
                              <span
                                className="text-[10px] px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: `${macro.color}15`,
                                  color: macro.color,
                                  border: `1px solid ${macro.color}30`,
                                }}
                              >
                                {stat.questionCount} questões
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1e293b] text-slate-500">
                                {stat.elements.length} elementos
                              </span>
                              {perf.total > 0 && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                  perf.hitRate >= 70
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : perf.hitRate >= 50
                                      ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                  {perf.hitRate}% acerto
                                </span>
                              )}
                            </div>
                            {/* Performance overlay */}
                            <div className="mt-2">
                              <PerformanceBar hitRate={perf.hitRate} total={perf.total} />
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronDown size={16} className="text-slate-500 flex-shrink-0" />
                          ) : (
                            <ChevronRight size={16} className="text-slate-500 flex-shrink-0" />
                          )}
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 border-t border-[#1e293b] pt-3 space-y-3">
                                {/* API elements if available */}
                                {apiMaId && apiElements[apiMaId]?.length > 0 && (
                                  <div>
                                    <h5 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                      <Hash size={10} /> Elementos cobrados ({apiElements[apiMaId].length})
                                    </h5>
                                    <div className="flex flex-wrap gap-1.5">
                                      {apiElements[apiMaId].map((el) => (
                                        <span
                                          key={el.id}
                                          className="text-[11px] px-2.5 py-1 rounded-lg bg-[#0a0e17] border border-[#1e293b] text-slate-400"
                                        >
                                          {el.name}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Local elements as fallback */}
                                {(!apiMaId || !apiElements[apiMaId]?.length) && (
                                  <div>
                                    <h5 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                      <Hash size={10} /> Elementos cobertos
                                    </h5>
                                    <div className="flex flex-wrap gap-1.5">
                                      {stat.elements.map((el) => (
                                        <span
                                          key={el}
                                          className="text-[11px] px-2.5 py-1 rounded-lg bg-[#0a0e17] border border-[#1e293b] text-slate-400"
                                        >
                                          {el}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Study button */}
                                <motion.button
                                  onClick={() => studyLocalMicroareaWithEnadIA(stat)}
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  className="w-full py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2"
                                  style={{
                                    backgroundColor: `${macro.color}10`,
                                    border: `1px solid ${macro.color}30`,
                                    color: macro.color,
                                  }}
                                >
                                  <Zap size={14} />
                                  Estudar {microareaName} com EnadIA
                                </motion.button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          ))}

          {/* Divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px bg-[#1e293b]" />
            <span className="text-[10px] text-slate-600 uppercase tracking-widest">
              Guias de estudo complementares
            </span>
            <div className="flex-1 h-px bg-[#1e293b]" />
          </div>

          {/* Original topic cards */}
          {filteredTopics.length === 0 && searchTerm ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Nenhum tema encontrado.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTopics.map((topic) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="jarvis-card overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedTopic(expandedTopic === topic.id ? null : topic.id)
                    }
                    className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <TopicIcon name={topic.name} color={topic.color} />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-200">{topic.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {topic.description}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${topic.color}15`,
                            color: topic.color,
                            border: `1px solid ${topic.color}30`,
                          }}
                        >
                          {topic.subtopics.length} subtemas
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1e293b] text-slate-500">
                          {topic.keyPoints.length} pontos-chave
                        </span>
                        {topicToMicroarea.get(topic.name) && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                            {topicToMicroarea.get(topic.name)!.questionCount} questões
                          </span>
                        )}
                      </div>
                    </div>
                    {expandedTopic === topic.id ? (
                      <ChevronDown size={16} className="text-slate-500 flex-shrink-0" />
                    ) : (
                      <ChevronRight size={16} className="text-slate-500 flex-shrink-0" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedTopic === topic.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-[#1e293b] pt-3 space-y-3">
                          <div>
                            <h5 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                              Pontos-chave
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                              {topic.keyPoints.map((point, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2 text-xs text-slate-400"
                                >
                                  <span
                                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                    style={{ backgroundColor: topic.color }}
                                  />
                                  {point}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                              Subtemas
                            </h5>
                            <div className="space-y-2">
                              {topic.subtopics.map((sub, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 rounded-lg bg-[#0a0e17] border border-[#1e293b]"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <h6 className="text-sm font-medium text-slate-300">{sub.name}</h6>
                                    <button
                                      onClick={() => studySubtopicWithEnadIA(topic, sub.name)}
                                      className="text-[10px] text-cyan-400/60 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                                    >
                                      Estudar <ChevronRight size={10} />
                                    </button>
                                  </div>
                                  <p className="text-xs text-slate-500 mb-2">{sub.description}</p>
                                  <div className="space-y-1">
                                    {sub.tips.map((tip, tidx) => (
                                      <div
                                        key={tidx}
                                        className="text-[11px] text-slate-500 flex items-start gap-1.5"
                                      >
                                        <span className="text-cyan-500/50">•</span>
                                        {tip}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <motion.button
                            onClick={() => studyWithEnadIA(topic)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
                            style={{
                              backgroundColor: `${topic.color}10`,
                              border: `1px solid ${topic.color}30`,
                              color: topic.color,
                            }}
                          >
                            <BookOpen size={16} />
                            Estudar {topic.name} com EnadIA
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
