// =============================================================================
// Essay (Dissertativa) question pool — shared between the quiz store (which
// must pick a stable set when a simulado starts) and the SimuladoEnade view.
// =============================================================================

export interface EssayQuestion {
  id: string;
  statement: string;
  topic: string;
  macroarea: string;
}

export const ESSAY_QUESTIONS_POOL: EssayQuestion[] = [
  {
    id: 'essay-logica',
    statement:
      'CONTEXTO: A lógica proposicional é fundamental para a especificação e verificação de sistemas de software. Um engenheiro de software precisa argumentar formalmente sobre a corretude de um algoritmo de busca.\n\nCOMANDO: Discorra sobre a importância da lógica proposicional e da lógica de predicados na verificação formal de software. Apresente ao menos dois exemplos práticos de como estas ferramentas lógicas podem ser utilizadas para garantir a corretude de algoritmos. Justifique sua resposta com conceitos técnicos adequados.',
    topic: 'Lógica Proposicional',
    macroarea: 'Fundamentos da Computação',
  },
  {
    id: 'essay-bd',
    statement:
      'CONTEXTO: Um sistema de gestão hospitalar precisa armazenar dados de pacientes, consultas, médicos e exames. O volume de dados cresce rapidamente e há necessidade de relatórios complexos e acesso rápido a informações críticas.\n\nCOMANDO: Compare os paradigmas de banco de dados relacional e NoSQL, discutindo as vantagens e desvantagens de cada abordagem para o cenário descrito. Apresente critérios técnicos para a escolha do paradigma mais adequado e proponha uma arquitetura que contemple as necessidades do sistema.',
    topic: 'Banco de Dados',
    macroarea: 'Desenvolvimento',
  },
  {
    id: 'essay-engsoft',
    statement:
      'CONTEXTO: Uma startup de fintech está desenvolvendo uma plataforma de pagamento digital que deve atender a milhões de usuários, com requisitos rigorosos de segurança, disponibilidade e conformidade regulatória (LGPD).\n\nCOMANDO: Descreva quais metodologias de desenvolvimento de software e práticas de Engenharia de Software você adotaria para este projeto. Discuta como garantir a qualidade do software, a segurança dos dados dos usuários e a conformidade com a LGPD ao longo de todo o ciclo de vida do desenvolvimento.',
    topic: 'Engenharia de Software',
    macroarea: 'Desenvolvimento',
  },
  {
    id: 'essay-ia',
    statement:
      'CONTEXTO: O uso de inteligência artificial em processos seletivos de empresas tem gerado debate sobre vieses algorítmicos e discriminação. Um sistema de triagem de currículos baseado em IA foi acusado de reproduzir vieses de gênero presentes nos dados históricos de contratação.\n\nCOMANDO: Analise os desafios éticos e técnicos relacionados ao uso de IA em processos decisórios automatizados. Discuta estratégias para mitigar vieses algorítmicos e proponha diretrizes para o desenvolvimento responsável de sistemas de IA, considerando aspectos técnicos, éticos e legais.',
    topic: 'Inteligência Artificial',
    macroarea: 'Segurança/IA',
  },
  {
    id: 'essay-redes',
    statement:
      'CONTEXTO: Uma empresa multinacional precisa conectar suas filiais em diferentes continentes, garantindo segurança na transmissão de dados sensíveis e alta disponibilidade dos serviços de comunicação interna.\n\nCOMANDO: Proponha uma arquitetura de rede que atenda aos requisitos de segurança, disponibilidade e desempenho para o cenário descrito. Discuta as tecnologias e protocolos envolvidos, incluindo VPN, firewall, balanceamento de carga e redundância. Justifique tecnicamente cada escolha.',
    topic: 'Redes',
    macroarea: 'Desenvolvimento',
  },
  {
    id: 'essay-so',
    statement:
      'CONTEXTO: Um servidor de aplicação hospeda múltiplos serviços críticos que competem por recursos de CPU, memória e I/O. Em períodos de pico, alguns serviços apresentam degradação significativa de desempenho.\n\nCOMANDO: Explique como o sistema operacional gerencia a alocação de recursos entre processos concorrentes. Discuta as estratégias de escalonamento, gerenciamento de memória e sistemas de arquivos que podem ser aplicadas para otimizar o desempenho do servidor, considerando os trade-offs envolvidos.',
    topic: 'Sistemas Operacionais',
    macroarea: 'Desenvolvimento',
  },
];

export function pickEssayQuestions(count = 2): EssayQuestion[] {
  const shuffled = [...ESSAY_QUESTIONS_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
