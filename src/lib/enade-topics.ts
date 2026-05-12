export interface EnadeTopic {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  keyPoints: string[];
  subtopics: { name: string; description: string; tips: string[] }[];
}

export const enadeTopics: EnadeTopic[] = [
  {
    id: 'aed',
    name: 'Algoritmos e Estruturas de Dados',
    icon: 'BinaryTree',
    color: '#00f0ff',
    description: 'Fundamentos de algoritmos, complexidade, estruturas de dados clássicas e técnicas de resolução de problemas computacionais.',
    keyPoints: [
      'Complexidade de tempo e espaço (Notação Big-O)',
      'Ordenação: Bubble, Insertion, Selection, Merge, Quick, Heap Sort',
      'Busca: Linear, Binária, em Grafos (BFS, DFS)',
      'Listas: Encadeadas, Pilhas, Filas, Deques',
      'Árvores: BST, AVL, Rubro-Negra, B, B+',
      'Grafos: Representação, Dijkstra, Kruskal, Prim',
      'Tabelas Hash: Funções, Colisões, Endereçamento',
      'Programação Dinâmica e Divisão e Conquista',
      'Recursão e Backtracking',
    ],
    subtopics: [
      {
        name: 'Análise de Complexidade',
        description: 'Avaliação do desempenho de algoritmos usando notação assintótica.',
        tips: [
          'Domine as notações O, Ω e Θ',
          'Saiba identificar o pior, melhor e caso médio',
          'Pratique análise de loops aninhados e recursões',
          'Lembre: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2^n)',
        ],
      },
      {
        name: 'Estruturas de Dados Lineares',
        description: 'Listas, pilhas, filas e suas variações.',
        tips: [
          'Entenda quando usar cada estrutura (LIFO vs FIFO)',
          'Listas encadeadas: O(1) para inserção/remoção no início',
          'Pilhas: úteis para recursão, expressões e backtracking',
          'Filas: importantes para BFS e escalonamento',
        ],
      },
      {
        name: 'Árvores e Grafos',
        description: 'Estruturas hierárquicas e redes de conexões.',
        tips: [
          'BST: inorder traversal produz lista ordenada',
          'Árvores balanceadas garantem O(log n)',
          'BFS usa fila, DFS usa pilha (ou recursão)',
          'Dijkstra não funciona com pesos negativos',
        ],
      },
      {
        name: 'Programação Dinâmica',
        description: 'Técnica de otimização que resolve subproblemas sobrepostos.',
        tips: [
          'Identifique subproblemas sobrepostos',
          'Defina a relação de recorrência',
          'Top-down (memoização) vs Bottom-up (tabulação)',
          'Problemas clássicos: Fibonacci, Mochila, LCS, LCS',
        ],
      },
    ],
  },
  {
    id: 'bd',
    name: 'Banco de Dados',
    icon: 'Database',
    color: '#3b82f6',
    description: 'Modelagem, projeto e gerenciamento de bancos de dados relacionais e NoSQL, linguagem SQL e otimização de consultas.',
    keyPoints: [
      'Modelo Entidade-Relacionamento (ER)',
      'Formas Normais (1NF, 2NF, 3NF, BCNF)',
      'SQL: SELECT, JOIN, GROUP BY, subqueries',
      'Transações e propriedades ACID',
      'Índices e otimização de consultas',
      'Controle de concorrência e locks',
      'Bancos NoSQL: Documento, Chave-Valor, Colunar, Grafo',
      'Trigger, Stored Procedures, Views',
    ],
    subtopics: [
      {
        name: 'SQL Avançado',
        description: 'Consultas complexas com joins, subqueries e funções de agregação.',
        tips: [
          'Domine os tipos de JOIN: INNER, LEFT, RIGHT, FULL',
          'GROUP BY + HAVING para filtrar grupos',
          'Subqueries vs JOINs: saiba quando usar cada um',
          'Funções de janela (window functions) são frequentes',
        ],
      },
      {
        name: 'Normalização',
        description: 'Processo de organização dos dados para minimizar redundância.',
        tips: [
          '1NF: valores atômicos (sem listas em campos)',
          '2NF: sem dependências parciais da chave',
          '3NF: sem dependências transitivas',
          'BCNF: para cada FD X→A, X é superchave',
        ],
      },
      {
        name: 'Transações e Concorrência',
        description: 'Garantia de consistência em acessos concorrentes.',
        tips: [
          'ACID: Atomicidade, Consistência, Isolamento, Durabilidade',
          'Níveis de isolamento: Read Uncommitted, Read Committed, Repeatable Read, Serializable',
          'Deadlock: prevenção, detecção e recuperação',
          'Anomalias: dirty read, non-repeatable read, phantom read',
        ],
      },
    ],
  },
  {
    id: 'poo',
    name: 'Programação Orientada a Objetos',
    icon: 'Code2',
    color: '#8b5cf6',
    description: 'Paradigma de programação baseado em objetos, classes, herança, polimorfismo e princípios de design.',
    keyPoints: [
      'Pilares: Encapsulamento, Herança, Polimorfismo, Abstração',
      'Classes abstratas vs Interfaces',
      'Sobrecarga (overload) vs Sobrescrita (override)',
      'Princípios SOLID',
      'Padrões de Projeto: GoF (23 padrões)',
      'Composição vs Herança',
      'Generics e Tipos Parametrizados',
    ],
    subtopics: [
      {
        name: 'Princípios SOLID',
        description: 'Cinco princípios de design para código maintenível e extensível.',
        tips: [
          'S - Single Responsibility: Uma classe, uma responsabilidade',
          'O - Open/Closed: Aberto para extensão, fechado para modificação',
          'L - Liskov Substitution: Subtipos devem ser substituíveis',
          'I - Interface Segregation: Interfaces específicas, não generalistas',
          'D - Dependency Inversion: Dependa de abstrações, não de implementações',
        ],
      },
      {
        name: 'Padrões de Projeto',
        description: 'Soluções reutilizáveis para problemas recorrentes.',
        tips: [
          'Criacionais: Singleton, Factory Method, Abstract Factory, Builder, Prototype',
          'Estruturais: Adapter, Decorator, Facade, Composite, Proxy',
          'Comportamentais: Observer, Strategy, Command, Iterator, State',
          'Conheça o contexto de aplicação de cada padrão',
        ],
      },
      {
        name: 'Herança e Polimorfismo',
        description: 'Mecanismos de reutilização e flexibilidade do código.',
        tips: [
          'Polimorfismo estático: sobrecarga de métodos (compile-time)',
          'Polimorfismo dinâmico: sobrescrita (runtime)',
          'Upcasting e Downcasting',
          'Binding early vs late binding',
          'Cuidado com herança profunda (preferir composição)',
        ],
      },
    ],
  },
  {
    id: 'redes',
    name: 'Redes de Computadores',
    icon: 'Globe',
    color: '#10b981',
    description: 'Modelos de referência, protocolos, endereçamento, roteamento e segurança de redes.',
    keyPoints: [
      'Modelo OSI (7 camadas) e TCP/IP (4 camadas)',
      'Endereçamento IP (IPv4 e IPv6)',
      'Sub-redes e máscaras (CIDR)',
      'Protocolos: HTTP, DNS, DHCP, TCP, UDP, IP',
      'Roteamento: algoritmos e protocolos',
      'VLANs, NAT, Firewalls',
      'HTTPS e TLS/SSL',
      'Segurança: ataques comuns e defesas',
    ],
    subtopics: [
      {
        name: 'Modelo OSI e TCP/IP',
        description: 'Arquiteturas de referência para comunicação em rede.',
        tips: [
          'OSI: Física, Enlace, Rede, Transporte, Sessão, Apresentação, Aplicação',
          'TCP/IP: Acesso à Rede, Internet, Transporte, Aplicação',
          'Mnemônico OSI: "De Fora Para Dentro" (Física→Aplicação)',
          'Cada camada tem protocolos específicos e funções bem definidas',
        ],
      },
      {
        name: 'Endereçamento e Sub-redes',
        description: 'IP addressing, subnetting e roteamento.',
        tips: [
          'IPv4: 32 bits, IPv6: 128 bits',
          'Classes de endereços: A, B, C, D, E',
          'Subnetting: 2^n sub-redes, 2^(32-n) - 2 hosts',
          'CIDR: notação /n (ex: /24 = 255.255.255.0)',
        ],
      },
    ],
  },
  {
    id: 'so',
    name: 'Sistemas Operacionais',
    icon: 'Monitor',
    color: '#f59e0b',
    description: 'Gerenciamento de processos, memória, sistemas de arquivos e mecanismos de sincronização.',
    keyPoints: [
      'Processos: estados, PCB, criação e terminação',
      'Threads: modelo, concorrência e paralelismo',
      'Escalonamento: FCFS, SJF, Round Robin, Prioridade',
      'Sincronização: mutex, semáforos, monitores',
      'Deadlocks: condições, prevenção e detecção',
      'Gerenciamento de memória: paginação, segmentação, virtual',
      'Sistemas de arquivos: organização e alocação',
    ],
    subtopics: [
      {
        name: 'Escalonamento de Processos',
        description: 'Algoritmos para alocação de CPU.',
        tips: [
          'FCFS: simples mas pode causar convoy effect',
          'SJF: ótimo teoricamente, impraticável (não preemptivo)',
          'SRTF: versão preemptiva do SJF',
          'Round Robin: justo, quantum define fatia de tempo',
          'Prioridade: pode causar starvation (solução: aging)',
        ],
      },
      {
        name: 'Gerenciamento de Memória',
        description: 'Técnicas de alocação e organização da memória.',
        tips: [
          'Paginação: blocos fixos, sem fragmentação externa',
          'Segmentação: blocos variáveis, sem fragmentação interna',
          'Memória virtual: usa disco como extensão da RAM',
          'TLB: cache de traduções de endereços',
          'Algoritmos de substituição: LRU, FIFO, Ótimo',
        ],
      },
    ],
  },
  {
    id: 'es',
    name: 'Engenharia de Software',
    icon: 'Settings',
    color: '#ef4444',
    description: 'Processos de desenvolvimento, metodologias, requisitos, testes e qualidade de software.',
    keyPoints: [
      'Modelos de processo: Cascata, Iterativo, Ágil, Espiral',
      'Scrum: papéis, artefatos e cerimônias',
      'Análise de requisitos: funcionais e não funcionais',
      'UML: diagramas de casos de uso, classes, sequência',
      'Padrões arquiteturais: MVC, Camadas, Microserviços',
      'Testes: unitário, integração, sistema, aceitação',
      'Métricas de qualidade: LOC, complexidade ciclomática',
    ],
    subtopics: [
      {
        name: 'Metodologias Ágeis',
        description: 'Frameworks ágeis para desenvolvimento de software.',
        tips: [
          'Manifesto Ágil: 4 valores e 12 princípios',
          'Scrum: Sprint, Daily, Review, Retrospective',
          'Kanban: fluxo contínuo, limites WIP',
          'User Stories: "Como [papel], quero [ação], para [valor]"',
          'Velocity, Burndown e Burnup charts',
        ],
      },
      {
        name: 'Testes de Software',
        description: 'Técnicas e níveis de teste.',
        tips: [
          'Pirâmide de testes: muitos unitários, poucos E2E',
          'TDD: Vermelho → Verde → Refatorar',
          'Coverage: line, branch, path coverage',
          'Caixa preta: equivalência, valor limite, tabelas de decisão',
          'Caixa branca: statement, branch, condition coverage',
        ],
      },
    ],
  },
  {
    id: 'ac',
    name: 'Arquitetura de Computadores',
    icon: 'Cpu',
    color: '#ec4899',
    description: 'Organização e funcionamento dos componentes de hardware, hierarquia de memória e arquiteturas de processadores.',
    keyPoints: [
      'Arquitetura Von Neumann vs Harvard',
      'Pipeline: estágios, hazards, stalls',
      'Hierarquia de memória: registradores, cache, RAM, disco',
      'Cache: mapeamento direto, associativo, set-associative',
      'RISC vs CISC',
      'Representação de dados: complemento de 2, IEEE 754',
      'Barramentos e E/S',
    ],
    subtopics: [
      {
        name: 'Pipeline e Paralelismo',
        description: 'Técnicas para aumentar o desempenho do processador.',
        tips: [
          'Estágios típicos: IF, ID, EX, MEM, WB',
          'Hazards: dados, controle, estruturais',
          'Forwarding/Bypassing resolve hazards de dados',
          'Branch prediction reduz stalls por desvios',
          'ILP: paralelismo ao nível de instruções',
        ],
      },
      {
        name: 'Hierarquia de Memória',
        description: 'Níveis de memória com diferentes velocidades e custos.',
        tips: [
          'Registradores > L1 > L2 > L3 > RAM > Disco',
          'Princípio de localidade: temporal e espacial',
          'Hit rate e Miss rate',
          'Write-through vs Write-back',
          'Cache associativa: mais carrega, melhor hit rate',
        ],
      },
    ],
  },
  {
    id: 'seg',
    name: 'Segurança da Informação',
    icon: 'Shield',
    color: '#14b8a6',
    description: 'Princípios de segurança, criptografia, autenticação e proteção contra ataques.',
    keyPoints: [
      'Triângulo CID: Confidencialidade, Integridade, Disponibilidade',
      'Criptografia: simétrica (AES) vs assimétrica (RSA)',
      'Hash: MD5, SHA, funções de hash seguras',
      'Autenticação: senha, biometria, MFA, OAuth',
      'Ataques: SQL Injection, XSS, CSRF, DDoS, phishing',
      'Firewalls, IDS/IPS, VPNs',
      'Certificados digitais e PKI',
    ],
    subtopics: [
      {
        name: 'Criptografia',
        description: 'Técnicas de cifra e decifra de informações.',
        tips: [
          'Simétrica: AES (256 bits recomendado), DES obsoleto',
          'Assimétrica: RSA, ECC, Diffie-Hellman',
          'Chave pública cifra, chave privada decifra',
          'HTTPS: TLS handshake, certificados X.509',
          'Hash: irreversível, para verificação de integridade',
        ],
      },
    ],
  },
  {
    id: 'comp',
    name: 'Compiladores',
    icon: 'FileCode',
    color: '#f97316',
    description: 'Teoria da computação, análise léxica, sintática e semântica, geração e otimização de código.',
    keyPoints: [
      'Fases: léxica, sintática, semântica, geração de código',
      'Autômatos finitos e expressões regulares',
      'Gramáticas livres de contexto e parsers',
      'LL(1), LR(0), SLR(1), LALR(1), CLR(1)',
      'Árvore sintática abstrata (AST)',
      'Tabela de símbolos e verificação de tipos',
      'Geração de código intermediário e otimização',
    ],
    subtopics: [
      {
        name: 'Análise Léxica e Sintática',
        description: 'Primeiras fases do compilador.',
        tips: [
          'Léxica: expressões regulares → autômatos finitos',
          'Sintática: gramáticas livres de contexto → parsers',
          'Tokens: tipo + lexema + atributos',
          'LL(1): top-down, recursão à esquerda, fatoração',
          'LR: bottom-up, shift-reduce, mais poderoso',
        ],
      },
    ],
  },
  {
    id: 'dist',
    name: 'Sistemas Distribuídos',
    icon: 'Network',
    color: '#a855f7',
    description: 'Arquiteturas, algoritmos e protocolos para sistemas distribuídos.',
    keyPoints: [
      'Teorema CAP: Consistência, Disponibilidade, Partição',
      'Replicação e consistência (eventual, forte)',
      'Protocolos de consenso: Paxos, Raft',
      'RPC e comunicação entre processos',
      'Clocks: lógicos (Lamport) e vetoriais',
      'Tolerância a falhas: byzantine, crash',
      'Microsserviços e orquestração',
    ],
    subtopics: [
      {
        name: 'Teorema CAP',
        description: 'Limitações teóricas de sistemas distribuídos.',
        tips: [
          'C: Consistência (todas as réplicas iguais)',
          'A: Availability (toda requisição recebe resposta)',
          'P: Partition tolerance (funciona apesar de falhas de rede)',
          'Na prática: P é obrigatório → escolha CP ou AP',
          'CP: HBase | AP: Cassandra, DynamoDB',
        ],
      },
    ],
  },
  {
    id: 'ia',
    name: 'Inteligência Artificial',
    icon: 'Brain',
    color: '#6366f1',
    description: 'Fundamentos de IA, aprendizado de máquina, redes neurais e aplicações.',
    keyPoints: [
      'Tipos de aprendizado: supervisionado, não supervisionado, por reforço',
      'Árvores de decisão, SVM, KNN, Naive Bayes',
      'Redes neurais: perceptron, MLP, CNN, RNN',
      'Deep Learning e frameworks',
      'Avaliação: acurácia, precisão, recall, F1-score',
      'Overfitting, underfitting, validação cruzada',
      'Ética e viés em IA',
    ],
    subtopics: [
      {
        name: 'Aprendizado de Máquina',
        description: 'Algoritmos e técnicas fundamentais.',
        tips: [
          'Supervisionado: classificação e regressão',
          'Não supervisionado: clustering e redução de dimensionalidade',
          'Por reforço: agente, ambiente, recompensa',
          'Overfitting: regularização, mais dados, dropout',
          'Validação cruzada K-fold para avaliação',
        ],
      },
    ],
  },
];
