import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─── MICROAREA DEFINITIONS ────────────────────────────

interface SubtopicDef {
  name: string;
  skills: { ident: string; comp: string; apl: string };
}

interface MicroareaDef {
  code: string;
  name: string;
  macroarea: string;
  color: string;
  description: string;
  order: number;
  subtopics: SubtopicDef[];
}

const MICROAREAS: MicroareaDef[] = [
  {
    code: 'LOG',
    name: 'Lógica Proposicional',
    macroarea: 'Fundamentos',
    color: '#3b82f6',
    description: 'Estudo de proposições, conectivos lógicos, tabelas-verdade, equivalências e argumentos.',
    order: 1,
    subtopics: [
      {
        name: 'Conectivos lógicos (conjunção, disjunção, negação, condicional, bicondicional)',
        skills: {
          ident: 'Identificar os conectivos lógicos e seus símbolos em proposições compostas',
          comp: 'Compreender o significado e a tabela-verdade de cada conectivo lógico',
          apl: 'Aplicar conectivos para construir e analisar proposições lógicas complexas',
        },
      },
      {
        name: 'Tabelas-verdade',
        skills: {
          ident: 'Identificar a estrutura de tabelas-verdade para proposições compostas',
          comp: 'Compreender a construção passo a passo de tabelas-verdade com múltiplas proposições',
          apl: 'Aplicar tabelas-verdade para determinar o valor lógico de expressões complexas',
        },
      },
      {
        name: 'Equivalências lógicas e Leis de De Morgan',
        skills: {
          ident: 'Identificar as principais equivalências lógicas e as Leis de De Morgan',
          comp: 'Compreender a demonstração e aplicação das Leis de De Morgan e equivalências fundamentais',
          apl: 'Aplicar equivalências lógicas para simplificar expressões proposicionais',
        },
      },
      {
        name: 'Tautologia, contradição e contingência',
        skills: {
          ident: 'Identificar tautologias, contradições e contingências em proposições',
          comp: 'Compreender as diferenças entre tautologia, contradição e contingência',
          apl: 'Aplicar técnicas para classificar proposições compostas',
        },
      },
      {
        name: 'Negação de proposições compostas',
        skills: {
          ident: 'Identificar a negação correta de proposições compostas usando Leis de De Morgan',
          comp: 'Compreender como negar proposições com conectivos múltiplos',
          apl: 'Aplicar regras de negação para transformar expressões lógicas',
        },
      },
      {
        name: 'Argumentos e silogismos',
        skills: {
          ident: 'Identificar a estrutura de argumentos lógicos e silogismos',
          comp: 'Compreender a validade de argumentos usando tabelas-verdade e regras de inferência',
          apl: 'Aplicar técnicas de verificação para determinar a validade de argumentos',
        },
      },
      {
        name: 'Regras de inferência',
        skills: {
          ident: 'Identificar as principais regras de inferência (Modus Ponens, Modus Tollens, Silogismo Hipotético)',
          comp: 'Compreender o funcionamento e aplicabilidade de cada regra de inferência',
          apl: 'Aplicar regras de inferência para construir demonstrações lógicas',
        },
      },
      {
        name: 'Dedução natural',
        skills: {
          ident: 'Identificar os passos e regras da dedução natural',
          comp: 'Compreender o método de dedução natural para demonstrações formais',
          apl: 'Aplicar dedução natural para demonstrar a validade de argumentos',
        },
      },
      {
        name: 'Quantificadores (universal, existencial)',
        skills: {
          ident: 'Identificar os quantificadores universal (∀) e existencial (∃) em predicados',
          comp: 'Compreender a semântica dos quantificadores e suas negações',
          apl: 'Aplicar quantificadores para formalizar enunciados matemáticos e computacionais',
        },
      },
      {
        name: 'Álgebra proposicional',
        skills: {
          ident: 'Identificar operações e propriedades da álgebra proposicional',
          comp: 'Compreender as leis associativas, comutativas, distributivas na lógica proposicional',
          apl: 'Aplicar propriedades algébricas para simplificar e transformar expressões lógicas',
        },
      },
    ],
  },
  {
    code: 'MAT',
    name: 'Matemática Discreta',
    macroarea: 'Fundamentos',
    color: '#8b5cf6',
    description: 'Conjuntos, relações, funções, análise combinatória, grafos e indução matemática.',
    order: 2,
    subtopics: [
      {
        name: 'Conjuntos e operações (união, interseção, diferença)',
        skills: {
          ident: 'Identificar as operações fundamentais entre conjuntos',
          comp: 'Compreender as propriedades das operações com conjuntos',
          apl: 'Aplicar operações de conjuntos para resolver problemas de contagem e classificação',
        },
      },
      {
        name: 'Relações (reflexiva, simétrica, transitiva, equivalência)',
        skills: {
          ident: 'Identificar os tipos de relações binárias e suas propriedades',
          comp: 'Compreender relações de equivalência e ordem parcial',
          apl: 'Aplicar conceitos de relações em modelagem de problemas computacionais',
        },
      },
      {
        name: 'Funções (injetora, sobrejetora, bijetora, composição)',
        skills: {
          ident: 'Identificar os tipos de funções e suas propriedades',
          comp: 'Compreender composição de funções e funções inversas',
          apl: 'Aplicar conceitos de funções em análise de algoritmos e complexidade',
        },
      },
      {
        name: 'Análise combinatória',
        skills: {
          ident: 'Identificar os princípios fundamentais da análise combinatória',
          comp: 'Compreender os conceitos de arranjo, combinação e permutação',
          apl: 'Aplicar técnicas combinatórias para resolver problemas de contagem',
        },
      },
      {
        name: 'Princípio fundamental da contagem',
        skills: {
          ident: 'Identificar situações que requerem o princípio fundamental da contagem',
          comp: 'Compreender a regra do produto e da soma em problemas de contagem',
          apl: 'Aplicar o princípio fundamental para resolver problemas combinatórios complexos',
        },
      },
      {
        name: 'Permutações e combinações',
        skills: {
          ident: 'Identificar quando usar permutações e quando usar combinações',
          comp: 'Compreender as fórmulas e propriedades de permutações e combinações',
          apl: 'Aplicar permutações e combinações em problemas de probabilidade e algoritmos',
        },
      },
      {
        name: 'Binômio de Newton',
        skills: {
          ident: 'Identificar o Binômio de Newton e seus coeficientes',
          comp: 'Compreender a relação entre o binômio e o triângulo de Pascal',
          apl: 'Aplicar o Binômio de Newton em expansões e problemas combinatórios',
        },
      },
      {
        name: 'Teoria básica de grafos',
        skills: {
          ident: 'Identificar os conceitos fundamentais de grafos (vértices, arestas, grau)',
          comp: 'Compreender tipos de grafos (direcionados, não direcionados, ponderados)',
          apl: 'Aplicar grafos para modelar problemas computacionais e de redes',
        },
      },
      {
        name: 'Árvores e florestas',
        skills: {
          ident: 'Identificar árvores e suas propriedades fundamentais',
          comp: 'Compreender árvores geradoras, árvores binárias e de busca',
          apl: 'Aplicar conceitos de árvores em estruturas de dados e algoritmos',
        },
      },
      {
        name: 'Indução matemática',
        skills: {
          ident: 'Identificar o princípio da indução matemática',
          comp: 'Compreender os passos da demonstração por indução (base, hipótese, passo indutivo)',
          apl: 'Aplicar indução matemática para demonstrar propriedades e correção de algoritmos',
        },
      },
    ],
  },
  {
    code: 'AUT',
    name: 'Autômatos e Linguagens Formais',
    macroarea: 'Teoria',
    color: '#a855f7',
    description: 'Autômatos finitos, expressões regulares, gramáticas, máquina de Turing e decidibilidade.',
    order: 3,
    subtopics: [
      {
        name: 'Autômatos finitos determinísticos (AFD)',
        skills: {
          ident: 'Identificar os componentes de um AFD (estados, alfabeto, transições, inicial, finais)',
          comp: 'Compreender o funcionamento e reconhecimento de palavras por AFD',
          apl: 'Aplicar AFD para modelar e resolver problemas de reconhecimento de padrões',
        },
      },
      {
        name: 'Autômatos finitos não determinísticos (AFN)',
        skills: {
          ident: 'Identificar as diferenças entre AFN e AFD',
          comp: 'Compreender o conceito de não-determinismo em autômatos',
          apl: 'Aplicar AFN para construir reconhecedores mais simples para linguagens regulares',
        },
      },
      {
        name: 'Conversão AFN para AFD',
        skills: {
          ident: 'Identificar o algoritmo de construção de subconjuntos',
          comp: 'Compreender como converter AFN (incluindo com transições-ε) em AFD equivalente',
          apl: 'Aplicar o algoritmo de conversão para obter AFD equivalentes a AFN dados',
        },
      },
      {
        name: 'Minimização de AFD',
        skills: {
          ident: 'Identificar quando um AFD pode ser minimizado',
          comp: 'Compreender o algoritmo de minimização de estados equivalentes',
          apl: 'Aplicar a minimização para obter o AFD com menor número de estados',
        },
      },
      {
        name: 'Expressões regulares',
        skills: {
          ident: 'Identificar a sintaxe e operadores de expressões regulares',
          comp: 'Compreender a equivalência entre expressões regulares e autômatos finitos',
          apl: 'Aplicar expressões regulares para definir e reconhecer padrões em textos',
        },
      },
      {
        name: 'Gramáticas regulares e livres de contexto',
        skills: {
          ident: 'Identificar os componentes de gramáticas formais e seus tipos',
          comp: 'Compreender a hierarquia de Chomsky e as classes de gramáticas',
          apl: 'Aplicar gramáticas para definir a sintaxe de linguagens de programação',
        },
      },
      {
        name: 'Autômatos de pilha',
        skills: {
          ident: 'Identificar os componentes e funcionamento de autômatos de pilha',
          comp: 'Compreender a relação entre autômatos de pilha e linguagens livres de contexto',
          apl: 'Aplicar autômatos de pilha para reconhecer linguagens com balanceamento',
        },
      },
      {
        name: 'Máquina de Turing',
        skills: {
          ident: 'Identificar os componentes e funcionamento de uma Máquina de Turing',
          comp: 'Compreender a capacidade computacional da Máquina de Turing',
          apl: 'Aplicar Máquinas de Turing para modelar algoritmos e problemas decidíveis',
        },
      },
      {
        name: 'Hierarquia de Chomsky',
        skills: {
          ident: 'Identificar os quatro níveis da hierarquia de Chomsky',
          comp: 'Compreender a relação entre tipos de gramáticas, linguagens e autômatos',
          apl: 'Aplicar a hierarquia para classificar linguagens e problemas computacionais',
        },
      },
      {
        name: 'Problemas decidíveis e indecidíveis',
        skills: {
          ident: 'Identificar a diferença entre problemas decidíveis e indecidíveis',
          comp: 'Compreender o problema da parada e teoremas de indecidibilidade',
          apl: 'Aplicar técnicas de redução para demonstrar indecidibilidade de problemas',
        },
      },
    ],
  },
  {
    code: 'ALG',
    name: 'Algoritmos e Estruturas de Dados',
    macroarea: 'Algoritmos',
    color: '#f59e0b',
    description: 'Análise de complexidade, busca, ordenação, estruturas lineares, árvores, grafos e programação dinâmica.',
    order: 4,
    subtopics: [
      {
        name: 'Análise de complexidade (Big-O, Big-Theta, Big-Omega)',
        skills: {
          ident: 'Identificar as notações assintóticas e suas diferenças',
          comp: 'Compreender como analisar a complexidade temporal e espacial de algoritmos',
          apl: 'Aplicar análise de complexidade para comparar e escolher algoritmos eficientes',
        },
      },
      {
        name: 'Recursão e recursividade',
        skills: {
          ident: 'Identificar definições recursivas e casos base',
          comp: 'Compreender o mecanismo de recursão, pilha de chamadas e relações de recorrência',
          apl: 'Aplicar recursão para resolver problemas como torre de Hanói, Fibonacci e permutações',
        },
      },
      {
        name: 'Algoritmos de busca (linear, binária, hashing)',
        skills: {
          ident: 'Identificar os principais algoritmos de busca e seus requisitos',
          comp: 'Compreender as diferenças de complexidade entre busca linear, binária e hashing',
          apl: 'Aplicar algoritmos de busca adequados a cada cenário e estrutura de dados',
        },
      },
      {
        name: 'Ordenação (bubble, insertion, selection, merge, quick, heap)',
        skills: {
          ident: 'Identificar os principais algoritmos de ordenação e suas características',
          comp: 'Compreender a complexidade, estabilidade e casos de uso de cada algoritmo',
          apl: 'Aplicar o algoritmo de ordenação mais adequado para cada situação',
        },
      },
      {
        name: 'Listas encadeadas (simples, dupla, circular)',
        skills: {
          ident: 'Identificar os tipos de listas encadeadas e suas operações básicas',
          comp: 'Compreender as vantagens e desvantagens em relação a arranjos',
          apl: 'Aplicar listas encadeadas para implementar estruturas dinâmicas eficientes',
        },
      },
      {
        name: 'Pilhas e filas',
        skills: {
          ident: 'Identificar as operações e propriedades de pilhas (LIFO) e filas (FIFO)',
          comp: 'Compreender as aplicações de pilhas e filas em algoritmos e sistemas',
          apl: 'Aplicar pilhas e filas para resolver problemas como avaliação de expressões e BFS',
        },
      },
      {
        name: 'Árvores (binária, BST, AVL, B)',
        skills: {
          ident: 'Identificar os tipos de árvores e suas propriedades fundamentais',
          comp: 'Compreender as operações de inserção, remoção e busca em cada tipo de árvore',
          apl: 'Aplicar árvores para implementar estruturas eficientes de busca e indexação',
        },
      },
      {
        name: 'Grafos (representação, BFS, DFS, Dijkstra)',
        skills: {
          ident: 'Identificar as formas de representação de grafos e algoritmos fundamentais',
          comp: 'Compreender BFS, DFS, Dijkstra e seus casos de aplicação',
          apl: 'Aplicar algoritmos de grafos para resolver problemas de caminho, conectividade e fluxo',
        },
      },
      {
        name: 'Programação dinâmica',
        skills: {
          ident: 'Identificar problemas que podem ser resolvidos com programação dinâmica',
          comp: 'Compreender os conceitos de sobreposição de subproblemas e subestrutura ótima',
          apl: 'Aplicar programação dinâmica para resolver problemas como mochila, LCS e caminhos mínimos',
        },
      },
      {
        name: 'Algoritmos gulosos',
        skills: {
          ident: 'Identificar problemas onde a estratégia gulosa é aplicável',
          comp: 'Compreender o conceito de escolha gulosa e prova de otimalidade',
          apl: 'Aplicar algoritmos gulosos em problemas como troco de moedas, MST e escalonamento',
        },
      },
    ],
  },
  {
    code: 'POO',
    name: 'Programação Orientada a Objetos',
    macroarea: 'Paradigmas',
    color: '#ec4899',
    description: 'Classes, herança, polimorfismo, encapsulamento, padrões de projeto e princípios SOLID.',
    order: 5,
    subtopics: [
      {
        name: 'Classes e objetos',
        skills: {
          ident: 'Identificar os conceitos de classe, objeto, atributo e método',
          comp: 'Compreender a diferença entre classe e instância, e o ciclo de vida dos objetos',
          apl: 'Aplicar classes e objetos para modelar entidades do domínio de um problema',
        },
      },
      {
        name: 'Herança e polimorfismo',
        skills: {
          ident: 'Identificar os mecanismos de herança e polimorfismo em POO',
          comp: 'Compreender herança simples, múltipla, sobreposição e sobrecarga de métodos',
          apl: 'Aplicar herança e polimorfismo para criar hierarquias flexíveis e extensíveis',
        },
      },
      {
        name: 'Encapsulamento e abstração',
        skills: {
          ident: 'Identificar os princípios de encapsulamento e abstração',
          comp: 'Compreender modificadores de acesso e sua importância no design de classes',
          apl: 'Aplicar encapsulamento para proteger dados e criar interfaces limpas',
        },
      },
      {
        name: 'Interfaces e classes abstratas',
        skills: {
          ident: 'Identificar as diferenças entre interfaces e classes abstratas',
          comp: 'Compreender quando usar cada um e seus benefícios no design de software',
          apl: 'Aplicar interfaces e classes abstratas para definir contratos e promover desacoplamento',
        },
      },
      {
        name: 'Padrões de projeto (GoF)',
        skills: {
          ident: 'Identificar os principais padrões de projeto GoF (criacionais, estruturais, comportamentais)',
          comp: 'Compreender a motivação, estrutura e aplicação de padrões como Singleton, Factory, Observer',
          apl: 'Aplicar padrões de projeto para resolver problemas recorrentes de design',
        },
      },
      {
        name: 'Princípios SOLID',
        skills: {
          ident: 'Identificar os cinco princípios SOLID e suas definições',
          comp: 'Compreender como cada princípio contribui para um design flexível e maintenível',
          apl: 'Aplicar princípios SOLID para refatorar e melhorar o design de classes',
        },
      },
      {
        name: 'UML (diagramas de classe, sequência)',
        skills: {
          ident: 'Identificar os principais diagramas UML e seus elementos',
          comp: 'Compreender a notação UML para diagramas de classe e de sequência',
          apl: 'Aplicar UML para documentar e comunicar o design de sistemas orientados a objetos',
        },
      },
      {
        name: 'Tratamento de exceções',
        skills: {
          ident: 'Identificar os mecanismos de tratamento de exceções (try, catch, finally, throw)',
          comp: 'Compreender a hierarquia de exceções e as melhores práticas de tratamento',
          apl: 'Aplicar tratamento de exceções para criar aplicações robustas e resilientes',
        },
      },
      {
        name: 'Generics e coleções',
        skills: {
          ident: 'Identificar o conceito de generics e as principais coleções (List, Set, Map)',
          comp: 'Compreender os benefícios de generics para reutilização e segurança de tipos',
          apl: 'Aplicar generics e coleções para implementar estruturas de dados tipadas e flexíveis',
        },
      },
      {
        name: 'Padrões arquiteturais (MVC, MVVM)',
        skills: {
          ident: 'Identificar os padrões arquiteturais MVC, MVP, MVVM e suas variações',
          comp: 'Compreender as responsabilidades de cada camada e o fluxo de dados',
          apl: 'Aplicar padrões arquiteturais para organizar a estrutura de aplicações',
        },
      },
    ],
  },
  {
    code: 'BD',
    name: 'Banco de Dados',
    macroarea: 'Desenvolvimento',
    color: '#10b981',
    description: 'Modelo relacional, SQL, normalização, transações, índices e NoSQL.',
    order: 6,
    subtopics: [
      {
        name: 'Modelo relacional e álgebra relacional',
        skills: {
          ident: 'Identificar os conceitos do modelo relacional (relação, tupla, atributo, chave)',
          comp: 'Compreender as operações da álgebra relacional (seleção, projeção, junção)',
          apl: 'Aplicar o modelo relacional para projetar esquemas de banco de dados',
        },
      },
      {
        name: 'SQL (DDL, DML, DQL)',
        skills: {
          ident: 'Identificar os comandos SQL das categorias DDL, DML e DQL',
          comp: 'Compreender a sintaxe e semântica dos comandos SELECT, INSERT, UPDATE, DELETE, CREATE',
          apl: 'Aplicar SQL para criar, manipular e consultar dados em banco de dados relacional',
        },
      },
      {
        name: 'Normalização (1FN, 2FN, 3FN, FNBC)',
        skills: {
          ident: 'Identificar as formas normais e as anomalias que cada uma elimina',
          comp: 'Compreender dependências funcionais e o processo de normalização passo a passo',
          apl: 'Aplicar normalização para projetar esquemas livres de redundância e anomalias',
        },
      },
      {
        name: 'Integridade referencial',
        skills: {
          ident: 'Identificar os conceitos de integridade referencial e chaves estrangeiras',
          comp: 'Compreender as ações ON DELETE e ON UPDATE (CASCADE, RESTRICT, SET NULL)',
          apl: 'Aplicar integridade referencial para manter a consistência dos dados',
        },
      },
      {
        name: 'Transações e propriedades ACID',
        skills: {
          ident: 'Identificar as propriedades ACID (Atomicidade, Consistência, Isolamento, Durabilidade)',
          comp: 'Compreender o conceito de transação e os problemas de concorrência',
          apl: 'Aplicar transações para garantir a consistência e integridade das operações',
        },
      },
      {
        name: 'Índices e otimização de consultas',
        skills: {
          ident: 'Identificar os tipos de índices e quando criá-los',
          comp: 'Compreender como os índices melhoram a performance de consultas',
          apl: 'Aplicar estratégias de indexação e otimização para melhorar a performance do banco',
        },
      },
      {
        name: 'JOINs (inner, outer, cross)',
        skills: {
          ident: 'Identificar os tipos de JOIN e suas diferenças (INNER, LEFT, RIGHT, FULL, CROSS)',
          comp: 'Compreender como cada JOIN combina dados de tabelas diferentes',
          apl: 'Aplicar JOINs para consultar dados relacionados em múltiplas tabelas',
        },
      },
      {
        name: 'Views e subconsultas',
        skills: {
          ident: 'Identificar o conceito de views (visões) e subconsultas no SQL',
          comp: 'Compreender as vantagens de views para segurança e simplificação de consultas',
          apl: 'Aplicar views e subconsultas para criar abstrações e consultas complexas',
        },
      },
      {
        name: 'Procedimentos armazenados e funções',
        skills: {
          ident: 'Identificar procedimentos armazenados e funções em banco de dados',
          comp: 'Compreender as vantagens e desvantagens de lógica no banco de dados',
          apl: 'Aplicar procedimentos armazenados para encapsular lógica de negócio no banco',
        },
      },
      {
        name: 'NoSQL e modelos de dados alternativos',
        skills: {
          ident: 'Identificar os principais tipos de bancos NoSQL (documento, chave-valor, coluna, grafo)',
          comp: 'Compreender as diferenças entre modelo relacional e NoSQL',
          apl: 'Aplicar bancos NoSQL em cenários onde o modelo relacional não é adequado',
        },
      },
    ],
  },
  {
    code: 'ES',
    name: 'Engenharia de Software',
    macroarea: 'Desenvolvimento',
    color: '#14b8a6',
    description: 'Ciclo de vida, metodologias ágeis, requisitos, UML, testes, versionamento e DevOps.',
    order: 7,
    subtopics: [
      {
        name: 'Ciclo de vida do software',
        skills: {
          ident: 'Identificar as fases do ciclo de vida do software (requisitos, design, implementação, teste, manutenção)',
          comp: 'Compreender os modelos de ciclo de vida (cascata, iterativo, incremental, espiral)',
          apl: 'Aplicar o modelo adequado de ciclo de vida para cada tipo de projeto',
        },
      },
      {
        name: 'Metodologias ágeis (Scrum, Kanban, XP)',
        skills: {
          ident: 'Identificar os principais frameworks ágeis e seus elementos (Scrum, Kanban, XP)',
          comp: 'Compreender os valores e princípios do Manifesto Ágil e práticas de cada framework',
          apl: 'Aplicar metodologias ágeis para gerenciar projetos de software de forma adaptativa',
        },
      },
      {
        name: 'Levantamento e análise de requisitos',
        skills: {
          ident: 'Identificar as técnicas de levantamento de requisitos (entrevistas, questionários, observação)',
          comp: 'Compreender a classificação de requisitos funcionais e não funcionais',
          apl: 'Aplicar técnicas de elicitação para documentar requisitos completos e consistentes',
        },
      },
      {
        name: 'Modelagem UML (casos de uso, atividades)',
        skills: {
          ident: 'Identificar os diagramas UML para modelagem de requisitos e processos',
          comp: 'Compreender a notação de diagramas de casos de uso e de atividades',
          apl: 'Aplicar UML para modelar requisitos e fluxos de processos de software',
        },
      },
      {
        name: 'Testes de software (unitário, integração, sistema, aceitação)',
        skills: {
          ident: 'Identificar os níveis e tipos de testes de software',
          comp: 'Compreender a pirâmide de testes e as técnicas de caixa-preta e caixa-branca',
          apl: 'Aplicar estratégias de teste para garantir a qualidade do software',
        },
      },
      {
        name: 'Versionamento (Git, fluxos de trabalho)',
        skills: {
          ident: 'Identificar os conceitos de controle de versão e os comandos fundamentais do Git',
          comp: 'Compreender os fluxos de trabalho (Git Flow, GitHub Flow, trunk-based)',
          apl: 'Aplicar Git e fluxos de trabalho para gerenciar o版本amento de código em equipe',
        },
      },
      {
        name: 'CI/CD e DevOps',
        skills: {
          ident: 'Identificar os conceitos de Integração Contínua e Entrega Contínua',
          comp: 'Compreender as práticas, ferramentas e pipeline de CI/CD',
          apl: 'Aplicar práticas de DevOps para automatizar build, teste e deploy de software',
        },
      },
      {
        name: 'Qualidade de software e métricas',
        skills: {
          ident: 'Identificar os atributos de qualidade de software e métricas de produto e processo',
          comp: 'Compreender modelos de qualidade (ISO/IEC 25010) e métricas como LOC, complexidade ciclomática',
          apl: 'Aplicar métricas de qualidade para avaliar e melhorar o processo de desenvolvimento',
        },
      },
      {
        name: 'Documentação de software',
        skills: {
          ident: 'Identificar os tipos de documentação técnica e de usuário',
          comp: 'Compreender as boas práticas de documentação e ferramentas disponíveis',
          apl: 'Aplicar técnicas de documentação para criar manuais claros e úteis',
        },
      },
      {
        name: 'Gestão de projetos de software',
        skills: {
          ident: 'Identificar as áreas de conhecimento da gestão de projetos (PMBOK)',
          comp: 'Compreender técnicas de planejamento, execução e controle de projetos',
          apl: 'Aplicar ferramentas de gestão para acompanhar cronograma, custo e riscos',
        },
      },
    ],
  },
  {
    code: 'SO',
    name: 'Sistemas Operacionais',
    macroarea: 'Desenvolvimento',
    color: '#06b6d4',
    description: 'Processos, escalonamento, sincronização, memória, sistemas de arquivos e segurança.',
    order: 8,
    subtopics: [
      {
        name: 'Processos e threads',
        skills: {
          ident: 'Identificar os conceitos de processo, thread e suas diferenças',
          comp: 'Compreender os estados de um processo e o contexto de execução',
          apl: 'Aplicar conceitos de processos e threads para programação concorrente',
        },
      },
      {
        name: 'Escalonamento de processos (FCFS, SJF, Round Robin, prioridade)',
        skills: {
          ident: 'Identificar os algoritmos de escalonamento e suas características',
          comp: 'Compreender os critérios de avaliação (tempo de espera, turnaround, resposta)',
          apl: 'Aplicar algoritmos de escalonamento para resolver problemas de concorrência de processos',
        },
      },
      {
        name: 'Sincronização (mutex, semáforos, monitores)',
        skills: {
          ident: 'Identificar os mecanismos de sincronização e os problemas de concorrência',
          comp: 'Compreender as soluções para exclusão mútua, condição de corrida e deadlock',
          apl: 'Aplicar mutex, semáforos e monitores para implementar sincronização em programas concorrentes',
        },
      },
      {
        name: 'Deadlock (prevenção, detecção, recuperação)',
        skills: {
          ident: 'Identificar as condições necessárias para deadlock (Muller, posse e espera, etc.)',
          comp: 'Compreender as estratégias de prevenção, detecção e recuperação de deadlocks',
          apl: 'Aplicar o algoritmo do banqueiro e grafos de espera para gerenciar deadlocks',
        },
      },
      {
        name: 'Gerenciamento de memória (partição, paginação, segmentação)',
        skills: {
          ident: 'Identificar as técnicas de gerenciamento de memória e suas diferenças',
          comp: 'Compreender paginação, segmentação e tabelas de páginas multinível',
          apl: 'Aplicar conceitos de gerenciamento de memória para analisar o desempenho do sistema',
        },
      },
      {
        name: 'Memória virtual e swapping',
        skills: {
          ident: 'Identificar o conceito de memória virtual e o mecanismo de swapping',
          comp: 'Compreender paginação por demanda e algoritmos de substituição de páginas',
          apl: 'Aplicar algoritmos de substituição (FIFO, LRU, Ótimo) para resolver problemas de falha de página',
        },
      },
      {
        name: 'Sistemas de arquivos',
        skills: {
          ident: 'Identificar os componentes de um sistema de arquivos e os métodos de alocação',
          comp: 'Compreender diretórios, metadados, alocação contígua, encadeada e indexada',
          apl: 'Aplicar conceitos de sistemas de arquivos para otimizar o armazenamento de dados',
        },
      },
      {
        name: 'Gerenciamento de I/O',
        skills: {
          ident: 'Identificar os mecanismos de entrada e saída e suas características',
          comp: 'Compreender I/O programado, interrupções e DMA',
          apl: 'Aplicar técnicas de gerenciamento de I/O para otimizar a comunicação com dispositivos',
        },
      },
      {
        name: 'Segurança de sistemas operacionais',
        skills: {
          ident: 'Identificar as ameaças à segurança e mecanismos de proteção',
          comp: 'Compreender controle de acesso, permissões, criptografia e firewalls no nível do SO',
          apl: 'Aplicar técnicas de segurança para proteger sistemas operacionais contra ameaças',
        },
      },
      {
        name: 'Sistemas operacionais comerciais (Linux, Windows)',
        skills: {
          ident: 'Identificar as características dos principais sistemas operacionais comerciais',
          comp: 'Compreender a arquitetura, componentes e diferenças entre Linux e Windows',
          apl: 'Aplicar conhecimentos do SO para administração e troubleshooting de sistemas',
        },
      },
    ],
  },
  {
    code: 'RED',
    name: 'Redes de Computadores',
    macroarea: 'Desenvolvimento',
    color: '#0ea5e9',
    description: 'Modelo OSI, TCP/IP, protocolos, endereçamento IP, roteamento e segurança de redes.',
    order: 9,
    subtopics: [
      {
        name: 'Modelo OSI e TCP/IP',
        skills: {
          ident: 'Identificar as camadas do modelo OSI e TCP/IP e suas funções',
          comp: 'Compreender as diferenças entre os modelos e o papel de cada camada',
          apl: 'Aplicar o modelo de camadas para analisar e resolver problemas de rede',
        },
      },
      {
        name: 'Protocolos de enlace e rede',
        skills: {
          ident: 'Identificar os protocolos das camadas de enlace e rede (Ethernet, IP, ARP, ICMP)',
          comp: 'Compreender o funcionamento de frame Ethernet, endereçamento MAC e ARP',
          apl: 'Aplicar conhecimentos de protocolos para configurar e diagnosticar redes locais',
        },
      },
      {
        name: 'Protocolos de transporte (TCP, UDP)',
        skills: {
          ident: 'Identificar os protocolos TCP e UDP e suas diferenças',
          comp: 'Compreender controle de congestionamento, janela deslizante e multiplexação',
          apl: 'Aplicar TCP e UDP adequadamente conforme os requisitos da aplicação',
        },
      },
      {
        name: 'Protocolos de aplicação (HTTP, DNS, SMTP, FTP, DHCP)',
        skills: {
          ident: 'Identificar os principais protocolos da camada de aplicação e suas funções',
          comp: 'Compreender o formato das mensagens e o funcionamento de cada protocolo',
          apl: 'Aplicar protocolos de aplicação para desenvolver e usar serviços de rede',
        },
      },
      {
        name: 'Endereçamento IP (IPv4, IPv6)',
        skills: {
          ident: 'Identificar o formato de endereços IPv4 e IPv6 e suas diferenças',
          comp: 'Compreender classes de endereços, endereços privados e transição IPv4-IPv6',
          apl: 'Aplicar endereçamento IP para planejar e configurar redes',
        },
      },
      {
        name: 'Sub-redes e mascaramento',
        skills: {
          ident: 'Identificar o conceito de sub-rede e máscara de sub-rede',
          comp: 'Compreender VLSM e CIDR para divisão eficiente de redes',
          apl: 'Aplicar técnicas de sub-redes para projetar esquemas de endereçamento eficientes',
        },
      },
      {
        name: 'Roteamento e protocolos de roteamento',
        skills: {
          ident: 'Identificar os conceitos de roteamento e os principais protocolos (RIP, OSPF, BGP)',
          comp: 'Compreender roteamento estático vs dinâmico e algoritmos de menor caminho',
          apl: 'Aplicar protocolos de roteamento para configurar redes com múltiplos roteadores',
        },
      },
      {
        name: 'Switching e VLANs',
        skills: {
          ident: 'Identificar o funcionamento de switches e o conceito de VLANs',
          comp: 'Compreender os benefícios de VLANs para segmentação e segurança de redes',
          apl: 'Aplicar VLANs para segmentar redes e melhorar a segurança e performance',
        },
      },
      {
        name: 'Firewalls e segurança de redes',
        skills: {
          ident: 'Identificar os tipos de firewalls e técnicas de segurança de redes',
          comp: 'Compreender regras de filtragem, NAT, VPN e detecção de intrusão',
          apl: 'Aplicar firewalls e técnicas de segurança para proteger redes',
        },
      },
      {
        name: 'Redes sem fio e mobilidade',
        skills: {
          ident: 'Identificar os padrões de redes sem fio (Wi-Fi) e suas características',
          comp: 'Compreender os protocolos 802.11, segurança WPA/WPA2 e mobilidade IP',
          apl: 'Aplicar conhecimentos de redes sem fio para projetar e configurar redes WLAN',
        },
      },
    ],
  },
  {
    code: 'SD',
    name: 'Sistemas Distribuídos',
    macroarea: 'Desenvolvimento',
    color: '#22d3ee',
    description: 'Arquiteturas distribuídas, comunicação, consistência, replicação e computação em nuvem.',
    order: 10,
    subtopics: [
      {
        name: 'Arquiteturas de sistemas distribuídos',
        skills: {
          ident: 'Identificar os modelos de arquiteturas distribuídas (cliente-servidor, P2P, microservices)',
          comp: 'Compreender as características, vantagens e desafios dos sistemas distribuídos',
          apl: 'Aplicar modelos de arquitetura para projetar sistemas distribuídos escaláveis',
        },
      },
      {
        name: 'Comunicação (RPC, mensageria, sockets)',
        skills: {
          ident: 'Identificar os mecanismos de comunicação em sistemas distribuídos',
          comp: 'Compreender RPC, mensageria assíncrona e comunicação por sockets',
          apl: 'Aplicar técnicas de comunicação para implementar serviços distribuídos',
        },
      },
      {
        name: 'Sincronização e consistência',
        skills: {
          ident: 'Identificar os desafios de sincronização em sistemas distribuídos',
          comp: 'Compreender relógios lógicos (Lamport, vetorial) e ordenação de eventos',
          apl: 'Aplicar técnicas de sincronização para garantir consistência em sistemas distribuídos',
        },
      },
      {
        name: 'Replicação e tolerância a falhas',
        skills: {
          ident: 'Identificar as técnicas de replicação de dados e serviços',
          comp: 'Compreender modelos de consistência e protocolos de tolerância a falhas',
          apl: 'Aplicar replicação para aumentar disponibilidade e tolerância a falhas',
        },
      },
      {
        name: 'Teorema CAP e consistência eventual',
        skills: {
          ident: 'Identificar o teorema CAP e seus três aspectos (Consistência, Disponibilidade, Partição)',
          comp: 'Compreender os trade-offs e a consistência eventual em sistemas distribuídos',
          apl: 'Aplicar o teorema CAP para tomar decisões de design em sistemas distribuídos',
        },
      },
      {
        name: 'Transações distribuídas (2PC, 3PC)',
        skills: {
          ident: 'Identificar os protocolos de commit em duas e três fases (2PC, 3PC)',
          comp: 'Compreender os problemas de transações distribuídas e as soluções propostas',
          apl: 'Aplicar protocolos de transação para garantir atomicidade em operações distribuídas',
        },
      },
      {
        name: 'Microserviços e arquiteturas',
        skills: {
          ident: 'Identificar o padrão de microserviços e seus princípios',
          comp: 'Compreender as diferenças entre monolítico e microsserviços, API Gateway, service mesh',
          apl: 'Aplicar arquitetura de microserviços para construir sistemas escaláveis e modulares',
        },
      },
      {
        name: 'Balanceamento de carga',
        skills: {
          ident: 'Identificar as técnicas de balanceamento de carga',
          comp: 'Compreender algoritmos (round-robin, least connections, hash) e suas aplicações',
          apl: 'Aplicar balanceamento de carga para distribuir requisições em servidores',
        },
      },
      {
        name: 'Computação em nuvem',
        skills: {
          ident: 'Identificar os modelos de serviço em nuvem (IaaS, PaaS, SaaS)',
          comp: 'Compreender os conceitos de virtualização, containers e orquestração',
          apl: 'Aplicar serviços de nuvem para implantar e escalar aplicações',
        },
      },
      {
        name: 'Sistemas de arquivos distribuídos',
        skills: {
          ident: 'Identificar as características de sistemas de arquivos distribuídos (NFS, HDFS)',
          comp: 'Compreender os desafios de consistência, disponibilidade e performance em arquivos distribuídos',
          apl: 'Aplicar sistemas de arquivos distribuídos para armazenar e processar grandes volumes de dados',
        },
      },
    ],
  },
  {
    code: 'CRI',
    name: 'Criptografia',
    macroarea: 'Segurança/IA',
    color: '#ef4444',
    description: 'Criptografia simétrica, assimétrica, hash, assinatura digital, certificados e SSL/TLS.',
    order: 11,
    subtopics: [
      {
        name: 'Criptografia simétrica (AES, DES, 3DES)',
        skills: {
          ident: 'Identificar os algoritmos de criptografia simétrica e seus modos de operação',
          comp: 'Compreender os princípios de cifra de bloco e de fluxo',
          apl: 'Aplicar algoritmos simétricos para proteger dados com chaves compartilhadas',
        },
      },
      {
        name: 'Criptografia assimétrica (RSA, ECC)',
        skills: {
          ident: 'Identificar os algoritmos de criptografia assimétrica e seus fundamentos matemáticos',
          comp: 'Compreender o par de chaves (pública/privada) e a troca de mensagens',
          apl: 'Aplicar criptografia assimétrica para autenticação e troca segura de chaves',
        },
      },
      {
        name: 'Funções hash (MD5, SHA, bcrypt)',
        skills: {
          ident: 'Identificar as propriedades das funções hash (determinismo, resistência a colisão)',
          comp: 'Compreender as diferenças entre MD5, SHA-1, SHA-256, bcrypt e seus casos de uso',
          apl: 'Aplicar funções hash para integridade de dados e armazenamento seguro de senhas',
        },
      },
      {
        name: 'Assinatura digital',
        skills: {
          ident: 'Identificar o conceito e os componentes da assinatura digital',
          comp: 'Compreender como a assinatura digital garante autenticidade, integridade e não-repúdio',
          apl: 'Aplicar assinatura digital para autenticar documentos e transações',
        },
      },
      {
        name: 'Certificados digitais e PKI',
        skills: {
          ident: 'Identificar os componentes de uma infraestrutura de chaves públicas (PKI)',
          comp: 'Compreender o papel de autoridades certificadoras (CA) e cadeias de certificados',
          apl: 'Aplicar PKI para estabelecer confiança em comunicações digitais',
        },
      },
      {
        name: 'Protocolos SSL/TLS',
        skills: {
          ident: 'Identificar as versões e componentes do protocolo SSL/TLS',
          comp: 'Compreender o handshake TLS, cipher suites e negociação de chaves',
          apl: 'Aplicar SSL/TLS para proteger comunicações web (HTTPS)',
        },
      },
      {
        name: 'Troca de chaves (Diffie-Hellman)',
        skills: {
          ident: 'Identificar o protocolo Diffie-Hellman e seu propósito',
          comp: 'Compreender como o Diffie-Hellman permite troca segura de chaves sobre canal inseguro',
          apl: 'Aplicar Diffie-Hellman para estabelecer chaves de sessão em protocolos de comunicação',
        },
      },
      {
        name: 'Criptoanálise',
        skills: {
          ident: 'Identificar as técnicas de criptoanálise e tipos de ataques',
          comp: 'Compreender ataques de força bruta, texto cifrado conhecido, texto claro escolhido',
          apl: 'Aplicar conhecimentos de criptoanálise para avaliar a segurança de sistemas criptográficos',
        },
      },
      {
        name: 'Aplicações de criptografia',
        skills: {
          ident: 'Identificar as aplicações práticas da criptografia no dia a dia',
          comp: 'Compreender como a criptografia é usada em e-mail, VPN, blockchain e pagamentos',
          apl: 'Aplicar criptografia adequadamente em diferentes cenários de segurança',
        },
      },
      {
        name: 'Segurança em aplicações web',
        skills: {
          ident: 'Identificar as vulnerabilidades comuns em aplicações web (OWASP Top 10)',
          comp: 'Compreender ataques como XSS, CSRF, SQL Injection e como preveni-los',
          apl: 'Aplicar práticas de segurança no desenvolvimento de aplicações web',
        },
      },
    ],
  },
  {
    code: 'IA',
    name: 'Inteligência Artificial',
    macroarea: 'Segurança/IA',
    color: '#f97316',
    description: 'Busca, aprendizado de máquina, redes neurais, NLP, visão computacional e ética em IA.',
    order: 12,
    subtopics: [
      {
        name: 'Busca em espaço de estados',
        skills: {
          ident: 'Identificar os algoritmos de busca em espaço de estados (busca cega, heurística)',
          comp: 'Compreender busca em largura, profundidade, A*, minimax e poda alfa-beta',
          apl: 'Aplicar algoritmos de busca para resolver problemas de planejamento e jogos',
        },
      },
      {
        name: 'Aprendizado de máquina (supervisionado, não supervisionado)',
        skills: {
          ident: 'Identificar os paradigmas de aprendizado de máquina (supervisionado, não supervisionado, por reforço)',
          comp: 'Compreender os principais algoritmos e suas aplicações',
          apl: 'Aplicar técnicas de ML para classificação, regressão e agrupamento de dados',
        },
      },
      {
        name: 'Redes neurais artificiais',
        skills: {
          ident: 'Identificar os componentes de uma rede neural (neurônio, camadas, funções de ativação)',
          comp: 'Compreender o processo de treinamento, backpropagation e ajuste de pesos',
          apl: 'Aplicar redes neurais para resolver problemas de classificação e regressão',
        },
      },
      {
        name: 'Deep learning',
        skills: {
          ident: 'Identificar as arquiteturas de deep learning (CNN, RNN, Transformer)',
          comp: 'Compreender o treinamento de redes profundas e os desafios computacionais',
          apl: 'Aplicar arquiteturas de deep learning para problemas complexos de IA',
        },
      },
      {
        name: 'Processamento de linguagem natural (NLP)',
        skills: {
          ident: 'Identificar as técnicas e tarefas fundamentais de NLP (tokenização, POS, NER)',
          comp: 'Compreender modelos de linguagem, word embeddings e transformers para NLP',
          apl: 'Aplicar técnicas de NLP para análise de sentimento, tradução e chatbots',
        },
      },
      {
        name: 'Visão computacional',
        skills: {
          ident: 'Identificar as tarefas de visão computacional (classificação, detecção, segmentação)',
          comp: 'Compreender as técnicas de processamento de imagens e CNNs para visão',
          apl: 'Aplicar visão computacional para reconhecimento facial, detecção de objetos e OCR',
        },
      },
      {
        name: 'Sistemas especialistas',
        skills: {
          ident: 'Identificar os componentes de um sistema especialista (base de conhecimento, motor de inferência)',
          comp: 'Compreender as regras de produção e encadeamento para frente e para trás',
          apl: 'Aplicar sistemas especialistas para domínios com conhecimento especializado',
        },
      },
      {
        name: 'Árvores de decisão e ensemble',
        skills: {
          ident: 'Identificar os conceitos de árvores de decisão e métodos ensemble (Random Forest, Gradient Boosting)',
          comp: 'Compreender como árvores de decisão são construídas e como ensembles melhoram a performance',
          apl: 'Aplicar árvores de decisão e ensembles para problemas de classificação e regressão',
        },
      },
      {
        name: 'Agrupamento (clustering)',
        skills: {
          ident: 'Identificar os algoritmos de clustering (K-Means, DBSCAN, hierarchical)',
          comp: 'Compreender as métricas de avaliação e a escolha do número de clusters',
          apl: 'Aplicar clustering para segmentação de dados e descoberta de padrões',
        },
      },
      {
        name: 'Ética em IA',
        skills: {
          ident: 'Identificar os principais dilemas éticos na inteligência artificial',
          comp: 'Compreender viés, fairness, privacidade, explicabilidade e responsabilidade em IA',
          apl: 'Aplicar princípios éticos no desenvolvimento e implantação de sistemas de IA',
        },
      },
    ],
  },
  {
    code: 'CD',
    name: 'Ciência de Dados',
    macroarea: 'Segurança/IA',
    color: '#eab308',
    description: 'Estatística, probabilidade, visualização, big data, regressão e análise exploratória.',
    order: 13,
    subtopics: [
      {
        name: 'Estatística descritiva (média, mediana, moda, desvio padrão)',
        skills: {
          ident: 'Identificar as medidas de tendência central e dispersão',
          comp: 'Compreender a interpretação e aplicação de cada medida estatística',
          apl: 'Aplicar estatística descritiva para resumir e analisar conjuntos de dados',
        },
      },
      {
        name: 'Probabilidade',
        skills: {
          ident: 'Identificar os conceitos fundamentais de probabilidade',
          comp: 'Compreender probabilidade condicional, independência, distribuições e Teorema de Bayes',
          apl: 'Aplicar probabilidade para modelar incertezas e tomar decisões baseadas em dados',
        },
      },
      {
        name: 'Visualização de dados',
        skills: {
          ident: 'Identificar os tipos de gráficos e suas aplicações (barras, linhas, dispersão, heatmap)',
          comp: 'Compreender os princípios de visualização eficaz e storytelling com dados',
          apl: 'Aplicar ferramentas de visualização para comunicar insights de dados',
        },
      },
      {
        name: 'Big Data e tecnologias',
        skills: {
          ident: 'Identificar os conceitos e desafios do Big Data (volume, velocidade, variedade)',
          comp: 'Compreender as tecnologias do ecossistema Hadoop, Spark e processamento de fluxo',
          apl: 'Aplicar tecnologias de Big Data para processar e analisar grandes volumes de dados',
        },
      },
      {
        name: 'Data mining e descoberta de conhecimento',
        skills: {
          ident: 'Identificar as etapas do processo de KDD (Knowledge Discovery in Databases)',
          comp: 'Compreender as técnicas de data mining e suas aplicações',
          apl: 'Aplicar data mining para descobrir padrões e conhecimentos em grandes conjuntos de dados',
        },
      },
      {
        name: 'Regressão linear e logística',
        skills: {
          ident: 'Identificar os modelos de regressão linear e logística e suas diferenças',
          comp: 'Compreender os métodos de ajuste, avaliação (R², RMSE) e interpretação dos coeficientes',
          apl: 'Aplicar regressão para prever valores contínuos e classificar dados',
        },
      },
      {
        name: 'Análise exploratória de dados',
        skills: {
          ident: 'Identificar as etapas e técnicas da análise exploratória de dados (EDA)',
          comp: 'Compreender como detectar outliers, valores ausentes e padrões nos dados',
          apl: 'Aplicar EDA para entender a estrutura e qualidade dos dados antes da modelagem',
        },
      },
      {
        name: 'Limpeza e preparação de dados',
        skills: {
          ident: 'Identificar os problemas comuns em dados (ausentes, duplicados, inconsistentes)',
          comp: 'Compreender as técnicas de limpeza, transformação e feature engineering',
          apl: 'Aplicar técnicas de preparação de dados para criar datasets de qualidade para modelagem',
        },
      },
      {
        name: 'Ferramentas (Python, R, Pandas, NumPy)',
        skills: {
          ident: 'Identificar as principais ferramentas e bibliotecas para ciência de dados',
          comp: 'Compreender as capacidades de Python, R, Pandas, NumPy, Matplotlib e Scikit-learn',
          apl: 'Aplicar ferramentas de ciência de dados para implementar pipelines de análise',
        },
      },
      {
        name: 'Storytelling com dados',
        skills: {
          ident: 'Identificar as técnicas de storytelling para apresentar insights de dados',
          comp: 'Compreender como estruturar narrativas convincentes com bases em dados',
          apl: 'Aplicar storytelling com dados para comunicar resultados para audiências não técnicas',
        },
      },
    ],
  },
  {
    code: 'ETI',
    name: 'Ética Profissional',
    macroarea: 'Segurança/IA',
    color: '#84cc16',
    description: 'Código de ética, privacidade, LGPD, responsabilidade social e governança de TI.',
    order: 14,
    subtopics: [
      {
        name: 'Código de ética profissional de TI',
        skills: {
          ident: 'Identificar os princípios do código de ética do profissional de TI',
          comp: 'Compreender as responsabilidades e deveres éticos do profissional de tecnologia',
          apl: 'Aplicar o código de ética em situações reais do mercado de trabalho',
        },
      },
      {
        name: 'Privacidade e proteção de dados',
        skills: {
          ident: 'Identificar os conceitos de privacidade e proteção de dados pessoais',
          comp: 'Compreender os direitos dos titulares e obrigações dos controladores de dados',
          apl: 'Aplicar práticas de proteção de dados em conformidade com a legislação',
        },
      },
      {
        name: 'LGPD',
        skills: {
          ident: 'Identificar os principais pontos da Lei Geral de Proteção de Dados (LGPD)',
          comp: 'Compreender as bases legais, direitos dos titulares e penalidades da LGPD',
          apl: 'Aplicar conformidade com a LGPD em sistemas e processos organizacionais',
        },
      },
      {
        name: 'Responsabilidade social do profissional',
        skills: {
          ident: 'Identificar o papel social do profissional de TI na sociedade',
          comp: 'Compreender o impacto das tecnologias na sociedade e a responsabilidade do desenvolvedor',
          apl: 'Aplicar princípios de responsabilidade social no desenvolvimento de software',
        },
      },
      {
        name: 'Propriedade intelectual e direitos autorais',
        skills: {
          ident: 'Identificar os conceitos de propriedade intelectual aplicados a software',
          comp: 'Compreender copyright, patentes, marcas e suas implicações no desenvolvimento de software',
          apl: 'Aplicar conhecimentos de propriedade intelectual para proteger criações e respeitar direitos',
        },
      },
      {
        name: 'Ética em inteligência artificial',
        skills: {
          ident: 'Identificar os dilemas éticos específicos da inteligência artificial',
          comp: 'Compreender viés algorítmico, transparência, responsabilidade e impacto social da IA',
          apl: 'Aplicar princípios éticos no desenvolvimento de sistemas de IA',
        },
      },
      {
        name: 'Responsabilidade civil e criminal em TI',
        skills: {
          ident: 'Identificar os tipos de responsabilidade (civil e criminal) no uso de tecnologia',
          comp: 'Compreender as consequências legais de crimes informáticos e falhas de segurança',
          apl: 'Aplicar conhecimento legal para prevenir e mitigar riscos jurídicos em TI',
        },
      },
      {
        name: 'Conflitos de interesse',
        skills: {
          ident: 'Identificar situações de conflito de interesse no ambiente profissional de TI',
          comp: 'Compreender como gerenciar e resolver conflitos de interesse de forma ética',
          apl: 'Aplicar estratégias para evitar conflitos de interesse em projetos e carreiras de TI',
        },
      },
      {
        name: 'Sustentabilidade em TI',
        skills: {
          ident: 'Identificar os impactos ambientais da tecnologia e práticas de TI verde',
          comp: 'Compreender o conceito de TI sustentável e computação verde',
          apl: 'Aplicar práticas sustentáveis no desenvolvimento e uso de tecnologia',
        },
      },
      {
        name: 'Governança de TI',
        skills: {
          ident: 'Identificar os frameworks de governança de TI (COBIT, ITIL)',
          comp: 'Compreender os princípios e processos de governança corporativa de TI',
          apl: 'Aplicar frameworks de governança para alinhar TI com os objetivos de negócio',
        },
      },
    ],
  },
  {
    code: 'LEG',
    name: 'Legislação',
    macroarea: 'Segurança/IA',
    color: '#22c55e',
    description: 'Marco Civil da Internet, LGPD, crimes cibernéticos, contratos e compliance.',
    order: 15,
    subtopics: [
      {
        name: 'Marco Civil da Internet',
        skills: {
          ident: 'Identificar os princípios e garantias do Marco Civil da Internet (Lei 12.965/2014)',
          comp: 'Compreender os direitos e deveres dos usuários e provedores de internet',
          apl: 'Aplicar o Marco Civil para orientar práticas de desenvolvimento e uso da internet',
        },
      },
      {
        name: 'LGPD detalhada',
        skills: {
          ident: 'Identificar os artigos e aspectos operacionais da LGPD (Lei 13.709/2018)',
          comp: 'Compreender as sanções administrativas, o papel do ANPD e os procedimentos de conformidade',
          apl: 'Aplicar a LGPD em projetos de software para garantir proteção de dados pessoais',
        },
      },
      {
        name: 'Lei de Software (Lei 9.609/98)',
        skills: {
          ident: 'Identificar os dispositivos da Lei de Software e seus impactos na indústria',
          comp: 'Compreender os direitos sobre software, registro e comercialização',
          apl: 'Aplicar a legislação para regular a criação e distribuição de software',
        },
      },
      {
        name: 'Direitos autorais e propriedade intelectual',
        skills: {
          ident: 'Identificar as leis de direitos autorais aplicáveis a software e conteúdo digital',
          comp: 'Compreender a Lei 9.610/98 e as licenças de software (open source, proprietário)',
          apl: 'Aplicar a legislação de direitos autorais para proteger e licenciar criações',
        },
      },
      {
        name: 'Crimes cibernéticos (Lei 12.737/2012)',
        skills: {
          ident: 'Identificar os crimes cibernéticos definidos na legislação brasileira',
          comp: 'Compreender as penas e os tipos penais relacionados a invasão de dispositivo e dados',
          apl: 'Aplicar conhecimento sobre crimes cibernéticos para prevenir infrações e proteger sistemas',
        },
      },
      {
        name: 'Contratos de TI e licitações',
        skills: {
          ident: 'Identificar os tipos de contratos de TI e o regime de licitações para tecnologia',
          comp: 'Compreender a Lei 8.666/93, Nova Lei de Licitações e contratos de prestação de serviços de TI',
          apl: 'Aplicar legislação de contratos e licitações em projetos de TI no setor público',
        },
      },
      {
        name: 'Normas ISO/IEC relevantes',
        skills: {
          ident: 'Identificar as normas ISO/IEC relevantes para TI (27001, 27002, 20000, 12207)',
          comp: 'Compreender o escopo e os requisitos de cada norma aplicável',
          apl: 'Aplicar normas ISO/IEC para implementar gestão de segurança e qualidade em TI',
        },
      },
      {
        name: 'Regulamentação de dados pessoais',
        skills: {
          ident: 'Identificar a regulamentação complementar sobre dados pessoais no Brasil',
          comp: 'Compreender o papel do ANPD, resoluções e orientações sobre tratamento de dados',
          apl: 'Aplicar regulamentações para garantir conformidade total com a legislação de dados',
        },
      },
      {
        name: 'Compliance e auditoria',
        skills: {
          ident: 'Identificar os conceitos de compliance e auditoria em TI',
          comp: 'Compreender os processos de auditoria de sistemas e conformidade regulatória',
          apl: 'Aplicar práticas de compliance para garantir conformidade legal e regulatória',
        },
      },
      {
        name: 'Legislação internacional (GDPR)',
        skills: {
          ident: 'Identificar os principais pontos do GDPR europeu e sua relação com a LGPD',
          comp: 'Compreender as diferenças e semelhanças entre GDPR e LGPD',
          apl: 'Aplicar conhecimento do GDPR para sistemas que tratam dados de cidadãos europeus',
        },
      },
    ],
  },
];

// ─── SEED FUNCTION ────────────────────────────────────

async function main() {
  console.log('🌱 Starting seed...\n');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.studentResponse.deleteMany();
  await prisma.simuladoConfig.deleteMany();
  await prisma.questionTag.deleteMany();
  await prisma.alternative.deleteMany();
  await prisma.studentResponse.deleteMany();
  await prisma.question.deleteMany();
  await prisma.element.deleteMany();
  await prisma.microarea.deleteMany();
  await prisma.phaseConfig.deleteMany();
  await prisma.systemConfig.deleteMany();
  await prisma.user.deleteMany();

  // ─── Phase Configs ───
  console.log('📋 Creating phase configs...');
  await prisma.phaseConfig.createMany({
    data: [
      {
        phase: 1,
        name: 'Diagnóstico',
        description: 'Fase de diagnóstico dos conhecimentos dos alunos. Foco em identificar pontos fortes e fracos.',
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-04-30'),
        features: JSON.stringify(['chat', 'diagnóstico simulado', 'revisão básica']),
        active: true,
      },
      {
        phase: 2,
        name: 'Reforço',
        description: 'Fase de reforço nas áreas identificadas com dificuldade. Estudo direcionado por microárea.',
        startDate: new Date('2026-05-01'),
        endDate: new Date('2026-06-30'),
        features: JSON.stringify(['chat', 'diagnóstico simulado', 'revisão básica', 'simulados por microarea', 'dicas', 'relatório individual']),
        active: false,
      },
      {
        phase: 3,
        name: 'Simulados',
        description: 'Fase de simulados completos e ENADE simulado. Treinamento intensivo para o exame.',
        startDate: new Date('2026-07-01'),
        endDate: new Date('2026-09-30'),
        features: JSON.stringify(['chat', 'diagnóstico simulado', 'revisão básica', 'simulados por microarea', 'dicas', 'relatório individual', 'simulados completos', 'ENADE simulado', 'relatório coletivo']),
        active: false,
      },
      {
        phase: 4,
        name: 'Final',
        description: 'Fase final com todos os recursos disponíveis. Simulados cronometrados e revisão geral.',
        startDate: new Date('2026-10-01'),
        endDate: new Date('2026-11-30'),
        features: JSON.stringify(['chat', 'diagnóstico simulado', 'revisão básica', 'simulados por microarea', 'dicas', 'relatório individual', 'simulados completos', 'ENADE simulado', 'relatório coletivo', 'simulados cronometrados', 'relatório final']),
        active: false,
      },
    ],
  });

  // ─── System Config ───
  console.log('⚙️ Creating system configs...');
  await prisma.systemConfig.createMany({
    data: [
      { key: 'current_phase', value: '1' },
      { key: 'min_questions_simulado', value: '5' },
      { key: 'max_questions_simulado', value: '40' },
      { key: 'default_time_limit', value: '120' },
      { key: 'passing_score', value: '60' },
      { key: 'enable_chat', value: 'true' },
      { key: 'enable_simulado', value: 'true' },
      { key: 'academic_year', value: '2026' },
      { key: 'enade_exam_date', value: '2026-11-22' },
      { key: 'maintenance_mode', value: 'false' },
    ],
  });

  // ─── Default Users ───
  console.log('👤 Creating default users...');
  const masterPassword = await bcrypt.hash('master123', 12);
  const professorPassword = await bcrypt.hash('professor123', 12);
  const alunoPassword = await bcrypt.hash('aluno123', 12);

  await prisma.user.createMany({
    data: [
      {
        email: 'master@unifecaf.br',
        name: 'Coordenação ENADE',
        password: masterPassword,
        role: 'MASTER',
        ra: 'MASTER001',
      },
      {
        email: 'professor@unifecaf.br',
        name: 'Professor Exemplo',
        password: professorPassword,
        role: 'PROFESSOR',
        ra: 'PROF001',
      },
      {
        email: 'aluno@unifecaf.br',
        name: 'Aluno Exemplo',
        password: alunoPassword,
        role: 'ALUNO',
        ra: '2026001',
      },
    ],
  });

  // ─── Microareas & Elements ───
  console.log('📚 Creating microareas and elements...');
  let totalElements = 0;

  for (const microarea of MICROAREAS) {
    const ma = await prisma.microarea.create({
      data: {
        name: microarea.name,
        code: microarea.code,
        macroarea: microarea.macroarea,
        description: microarea.description,
        color: microarea.color,
        order: microarea.order,
      },
    });

    let elemIndex = 1;
    for (const subtopic of microarea.subtopics) {
      // identificação
      await prisma.element.create({
        data: {
          code: `${microarea.code}-E${String(elemIndex).padStart(2, '0')}`,
          name: `${subtopic.name} — Identificação`,
          description: subtopic.skills.ident,
          skillLevel: 'identificação',
          microareaId: ma.id,
          order: elemIndex,
        },
      });
      elemIndex++;

      // compreensão
      await prisma.element.create({
        data: {
          code: `${microarea.code}-E${String(elemIndex).padStart(2, '0')}`,
          name: `${subtopic.name} — Compreensão`,
          description: subtopic.skills.comp,
          skillLevel: 'compreensão',
          microareaId: ma.id,
          order: elemIndex,
        },
      });
      elemIndex++;

      // aplicação
      await prisma.element.create({
        data: {
          code: `${microarea.code}-E${String(elemIndex).padStart(2, '0')}`,
          name: `${subtopic.name} — Aplicação`,
          description: subtopic.skills.apl,
          skillLevel: 'aplicação',
          microareaId: ma.id,
          order: elemIndex,
        },
      });
      elemIndex++;

      totalElements += 3;
    }

    console.log(`  ✅ ${microarea.code}: ${microarea.name} — ${(elemIndex - 1)} elements`);
  }

  // ─── Summary ───
  const userCount = await prisma.user.count();
  const microareaCount = await prisma.microarea.count();
  const elementCount = await prisma.element.count();
  const phaseCount = await prisma.phaseConfig.count();
  const configCount = await prisma.systemConfig.count();

  console.log('\n═══════════════════════════════════════');
  console.log('  SEED COMPLETE');
  console.log('═══════════════════════════════════════');
  console.log(`  👤 Users:         ${userCount}`);
  console.log(`  📋 Phases:        ${phaseCount}`);
  console.log(`  ⚙️ System Config: ${configCount}`);
  console.log(`  📚 Microareas:    ${microareaCount}`);
  console.log(`  📖 Elements:      ${elementCount}`);
  console.log('═══════════════════════════════════════\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
