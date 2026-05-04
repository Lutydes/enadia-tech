'use client';

import { motion } from 'framer-motion';
import {
  Lightbulb,
  Clock,
  Target,
  Brain,
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Zap,
  Timer,
  ListChecks,
  GraduationCap,
  HelpCircle,
  Shield,
} from 'lucide-react';

interface Tip {
  title: string;
  description: string;
  icon: React.ReactNode;
  tips: string[];
}

const tips: Tip[] = [
  {
    title: 'Formato do ENADE',
    description: 'Entenda como o exame é estruturado e como funciona a pontuação.',
    icon: <ListChecks size={20} className="text-cyan-400" />,
    tips: [
      'O ENADE possui 40 questões de múltipla escolha (A a E) para o componente específico de Computação',
      'Há 10 questões de formação geral comuns a todas as áreas',
      'Cada questão tem peso de 1 a 5, dependendo do número de acertos em todo o Brasil',
      'O conceito ENADE (1 a 5) é calculado com base no grupo de estudantes, não individualmente',
      'Presença é obrigatória — faltar pode impactar negativamente seu currículo e o conceito da instituição',
      'O tempo de prova é de 4 horas — gerencie bem!',
    ],
  },
  {
    title: 'Estratégia de Prova',
    description: 'Técnicas para maximizar sua pontuação no dia do exame.',
    icon: <Target size={20} className="text-emerald-400" />,
    tips: [
      'Leia o enunciado completo antes de analisar as alternativas',
      'Elimine primeiro as alternativas que tem certeza que estão erradas',
      'Marque as questões difíceis e volte depois — não perca tempo',
      'Confira se marcou a alternativa correta no cartão de respostas',
      'Não mude resposta no último minuto, a não ser que tenha certeza',
      'Cuidado com palavras-chave como "sempre", "nunca", "apenas" — geralmente tornam a alternativa incorreta',
    ],
  },
  {
    title: 'Gestão de Tempo',
    description: 'Como otimizar as 4 horas de prova.',
    icon: <Timer size={20} className="text-yellow-400" />,
    tips: [
      'Reserve os primeiros 10 minutos para ler todas as questões e identificar as fáceis',
      'Dedique no máximo 4-5 minutos por questão no componente específico',
      'Deixe as questões discursivas (se houver) para o final',
      'Faça uma pausa mental de 30 segundos a cada hora',
      'Nos últimos 30 minutos, volte apenas para as questões não respondidas',
      'Alimente-se bem antes da prova e leve água — desidratação afeta a cognição',
    ],
  },
  {
    title: 'Algoritmos e Estruturas de Dados',
    description: 'Dicas para o tema mais cobrado no ENADE de Computação.',
    icon: <Brain size={20} className="text-purple-400" />,
    tips: [
      'Domine a análise de complexidade Big-O — cai em praticamente toda prova',
      'Saiba quando usar cada estrutura de dados (quando usar árvore vs lista vs hash)',
      'Pratique execução manual de algoritmos: ordenação, busca, percurso em grafos',
      'Entenda a diferença entre pior caso, melhor caso e caso médio',
      'Programação Dinâmica é frequente — pratique com problemas clássicos',
      'Cuidado com questões de análise de código que pedem a saída de um programa',
    ],
  },
  {
    title: 'Banco de Dados',
    description: 'O que estudar para arrasar em questões de BD.',
    icon: <BookOpen size={20} className="text-blue-400" />,
    tips: [
      'SQL é obrigatório: domine JOINs, subqueries, GROUP BY, HAVING',
      'Normalização cai muito — saiba identificar 1NF, 2NF, 3NF',
      'Entenda ACID e os níveis de isolamento de transações',
      'Modelo ER para modelo relacional: como implementar relacionamentos N:M',
      'Índices: entenda quando e por que usar, e o impacto em operações de escrita',
      'NoSQL está cada vez mais presente — conheça os tipos e quando usar',
    ],
  },
  {
    title: 'Erros Comuns',
    description: 'Evite os erros que mais fazem estudantes perderem pontos.',
    icon: <AlertTriangle size={20} className="text-red-400" />,
    tips: [
      'Não confunda herança com interface — questões de POO exploram essa diferença',
      'Em redes, não confunda endereçamento físico (MAC) com lógico (IP)',
      'Não assuma que todos os problemas podem ser resolvidos em tempo polinomial',
      'Em questões de SO, não esqueça que threads do mesmo processo compartilham espaço de endereçamento',
      'Não confunda deadlock com starvation — são conceitos diferentes',
      'Cuidado com questões "incremetais" — às vezes uma alternativa está quase correta',
    ],
  },
  {
    title: 'Preparação Mental',
    description: 'Como se preparar psicologicamente para o ENADE.',
    icon: <GraduationCap size={20} className="text-pink-400" />,
    tips: [
      'Comece a estudar pelo menos 2-3 meses antes do exame',
      'Crie um cronograma e distribua os temas ao longo das semanas',
      'Faça simulados cronometrados para simular as condições reais',
      'Revise seus erros — aprender com os erros é mais eficaz que estudar apenas acertos',
      'Descanse na noite anterior — céreço descansado performa muito melhor',
      'Lembre-se: o ENADE avalia competências, não decoreba. Entenda os conceitos!',
    ],
  },
  {
    title: 'Recursos de Estudo',
    description: 'Materiais e ferramentas complementares.',
    icon: <Zap size={20} className="text-orange-400" />,
    tips: [
      'Provas anteriores do ENADE estão disponíveis no site do INEP — faça todas!',
      'Livros de referência: Cormen (Algoritmos), Silberschatz (SO), Tanenbaum (Redes)',
      'Plataformas online: Beecrowd (URI), LeetCode, HackerRank para prática',
      'Vídeos no YouTube: procure canais especializados em ENADE Computação',
      'Resumos e mapas mentais ajudam na revisão rápida antes da prova',
      'Estude em grupo — explicar conceitos para colegas consolida o aprendizado',
    ],
  },
];

const colorMap: Record<string, string> = {
  '0': '#00f0ff',
  '1': '#10b981',
  '2': '#f59e0b',
  '3': '#8b5cf6',
  '4': '#3b82f6',
  '5': '#ef4444',
  '6': '#ec4899',
  '7': '#f97316',
};

export function DicasEnade() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-[#1e293b] bg-[#0d1321]/50 backdrop-blur-sm">
        <h2 className="text-lg font-semibold jarvis-gradient">Dicas para o ENADE</h2>
        <p className="text-xs text-slate-500 mt-1">Estratégias e orientações para sua aprovação</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Top banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="jarvis-card p-6 mb-6 flex items-start gap-4"
          >
            <div className="flex-shrink-0 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <Lightbulb size={24} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-200 mb-1">
                Dica da EnadIA
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                O segredo para ir bem no ENADE é <strong className="text-cyan-400">entender conceitos</strong>, não decorar.
                O exame avalia sua capacidade de resolver problemas e aplicar conhecimentos em situações práticas.
                Use os simulados deste app para identificar seus pontos fracos e foque neles!
              </p>
            </div>
          </motion.div>

          {/* Tips grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((tip, idx) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="jarvis-card p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0">{tip.icon}</div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{tip.title}</h4>
                    <p className="text-[10px] text-slate-500">{tip.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {tip.tips.map((t, tidx) => (
                    <div key={tidx} className="flex items-start gap-2">
                      <CheckCircle
                        size={12}
                        className="flex-shrink-0 mt-1 text-cyan-500/50"
                      />
                      <span className="text-xs text-slate-400 leading-relaxed">{t}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="jarvis-card p-6 mt-6 text-center"
          >
            <Shield size={24} className="mx-auto text-cyan-400 mb-3" />
            <h3 className="text-base font-semibold text-slate-200 mb-2">
              Lembre-se
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              O ENADE é uma oportunidade de mostrar todo seu conhecimento. Estude com consistência,
              pratique bastante e confie em sua preparação. Você consegue! 💪
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
