// ENADE-style questions for Computer Science - Batch 1 (Microareas 1-5)
// Generated for Ciência da Computação exam preparation

export interface EnadeQuestion {
  id: string;
  topic: string;
  macroarea: string;
  element: string;
  difficulty: "fácil" | "médio" | "difícil";
  statement: string;
  alternatives: { letter: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

export const questionsBatch1: EnadeQuestion[] = [
  // =============================================================================
  // MICROAREA 1: LÓGICA PROPOSICIONAL (10 questões)
  // =============================================================================
  {
    id: "logica_conectivos_001",
    topic: "Lógica Proposicional",
    macroarea: "Fundamentos da Computação",
    element: "Conectivos lógicos",
    difficulty: "fácil" as const,
    statement:
      "Em um sistema de verificação de segurança de uma aplicação bancária, o acesso é concedido quando o usuário fornece a senha correta (P) e o dispositivo de dois fatores está ativo (Q). Considerando que o sistema utiliza o conectivo lógico AND (∧), qual das seguintes expressões representa corretamente a condição de acesso permitido?",
    alternatives: [
      { letter: "A", text: "P ∨ Q (P ou Q)" },
      { letter: "B", text: "P ∧ Q (P e Q)" },
      { letter: "C", text: "¬P → Q (se não P, então Q)" },
      { letter: "D", text: "P ⊕ Q (P ou exclusivo Q)" },
      { letter: "E", text: "Q → P (se Q, então P)" }
    ],
    correctAnswer: "B",
    explanation:
      "O conectivo lógico AND (∧, conjunção) resulta em verdadeiro apenas quando ambas as proposições são verdadeiras. No contexto, o acesso é permitido somente quando P (senha correta) E Q (dispositivo ativo) são ambos verdadeiros simultaneamente. A disjunção (A) permitiria acesso com apenas um dos dois, o ou exclusivo (D) permitiria apenas um dos dois, e as condicionais (C, E) não representam a exigência de ambos os requisitos."
  },
  {
    id: "logica_tabelaverdade_002",
    topic: "Lógica Proposicional",
    macroarea: "Fundamentos da Computação",
    element: "Tabela-verdade",
    difficulty: "médio" as const,
    statement:
      "Um engenheiro de software precisa validar uma expressão lógica utilizada em um sistema de controle de inventário. A expressão é: (P → Q) ∧ (Q → R). Para verificar se o sistema se comporta corretamente em todos os cenários possíveis, quantas linhas são necessárias na tabela-verdade dessa expressão?",
    alternatives: [
      { letter: "A", text: "4 linhas" },
      { letter: "B", text: "6 linhas" },
      { letter: "C", text: "8 linhas" },
      { letter: "D", text: "9 linhas" },
      { letter: "E", text: "12 linhas" }
    ],
    correctAnswer: "C",
    explanation:
      "A expressão possui 3 variáveis proposicionais distintas (P, Q e R). O número de linhas em uma tabela-verdade é 2^n, onde n é o número de variáveis. Portanto: 2³ = 8 linhas. Cada linha representa uma combinação possível de valores verdadeiro/falso para as três variáveis: (V,V,V), (V,V,F), (V,F,V), (V,F,F), (F,V,V), (F,V,F), (F,F,V), (F,F,F)."
  },
  {
    id: "logica_tautologia_003",
    topic: "Lógica Proposicional",
    macroarea: "Fundamentos da Computação",
    element: "Tautologia/contradição/contingência",
    difficulty: "médio" as const,
    statement:
      "Considere a proposição composta: (P → Q) ↔ (¬Q → ¬P). Classifique essa proposição quanto à sua classificação lógica e identifique qual alternativa apresenta a análise correta.",
    alternatives: [
      { letter: "A", text: "É uma contradição, pois sempre resulta em falso independentemente dos valores de P e Q." },
      { letter: "B", text: "É uma contingência, pois pode resultar em verdadeiro ou falso dependendo dos valores de P e Q." },
      { letter: "C", text: "É uma tautologia, pois é equivalente à contrapositiva da implicação, que é logicamente equivalente à implicação original." },
      { letter: "D", text: "É uma contradição, pois a contrapositiva de uma implicação sempre tem valor lógico oposto ao da implicação original." },
      { letter: "E", text: "É uma contingência, pois a bicondicional nunca pode ser satisfeita quando P e Q têm valores diferentes." }
    ],
    correctAnswer: "C",
    explanation:
      "A proposição P → Q é logicamente equivalente à sua contrapositiva ¬Q → ¬P (propriedade da contraposição). Como ambas as implicações são equivalentes, a bicondicional (↔) entre duas proposições equivalentes é sempre verdadeira, configurando uma tautologia. Verificando pela tabela-verdade: quando P=V,Q=V: (V→V)↔(F→F) = V↔V = V; quando P=V,Q=F: (V→F)↔(V→F) = F↔F = V; quando P=F,Q=V: (F→V)↔(F→V) = V↔V = V; quando P=F,Q=F: (F→F)↔(V→V) = V↔V = V. Todas as linhas resultam em verdadeiro."
  },
  {
    id: "logica_equivalencia_004",
    topic: "Lógica Proposicional",
    macroarea: "Fundamentos da Computação",
    element: "Equivalência lógica",
    difficulty: "médio" as const,
    statement:
      "Em um sistema de validação de formulários web, a regra de negócio estabelece que um campo é obrigatório apenas se o usuário não for menor de idade. Considere M = 'o usuário é menor de idade' e O = 'o campo é obrigatório'. Qual expressão é logicamente equivalente à afirmação 'se o campo é obrigatório, então o usuário não é menor de idade'?",
    alternatives: [
      { letter: "A", text: "¬O → M" },
      { letter: "B", text: "M → ¬O" },
      { letter: "C", text: "¬M ∨ ¬O" },
      { letter: "D", text: "O → ¬M" },
      { letter: "E", text: "O ∧ ¬M" }
    ],
    correctAnswer: "D",
    explanation:
      "A afirmação 'se o campo é obrigatório, então o usuário não é menor de idade' traduz-se diretamente como O → ¬M. Analisando cada alternativa: (A) 'se o campo não é obrigatório, então o usuário é menor de idade' — não é equivalente; (B) 'se o usuário é menor de idade, então o campo não é obrigatório' — esta é a contrapositiva de O → ¬M, logo é logicamente equivalente, mas a tradução direta é D; (C) ¬M ∨ ¬O — não é equivalente; (D) O → ¬M — tradução direta correta; (E) é uma conjunção, não uma condicional. Portanto, D é a representação direta correta. Importante notar que B também é logicamente equivalente (sendo a contrapositiva), mas a questão pede a tradução da afirmação dada."
  },
  {
    id: "logica_implicacao_005",
    topic: "Lógica Proposicional",
    macroarea: "Fundamentos da Computação",
    element: "Implicação lógica",
    difficulty: "difícil" as const,
    statement:
      "Em uma análise de requisitos de software, um analista identificou as seguintes premissas:\n\nP1: Se o sistema está em produção (S), então o banco de dados está sincronizado (B).\nP2: Se o banco de dados está sincronizado (B), então os backups estão atualizados (U).\nP3: Os backups não estão atualizados (¬U).\n\nUtilizando a regra da inferência por modus tollens e silogismo hipotético, qual conclusão é logicamente válida?",
    alternatives: [
      { letter: "A", text: "O sistema está em produção e os backups estão atualizados." },
      { letter: "B", text: "O banco de dados está sincronizado, mas o sistema não está em produção." },
      { letter: "C", text: "O sistema não está em produção e o banco de dados não está sincronizado." },
      { letter: "D", text: "O banco de dados está sincronizado e os backups estão atualizados." },
      { letter: "E", text: "Não é possível concluir nada, pois as premissas são contraditórias." }
    ],
    correctAnswer: "C",
    explanation:
      "Passo a passo da inferência:\n1. De P2 (B → U) e P3 (¬U), aplicando modus tollens, concluímos: ¬B (o banco de dados não está sincronizado).\n2. De P1 (S → B) e ¬B, aplicando modus tollens novamente, concluímos: ¬S (o sistema não está em produção).\n\nPortanto, ¬S ∧ ¬B: o sistema não está em produção E o banco de dados não está sincronizado. A alternativa C é a correta. Este encadeamento de modus tollens é uma técnica fundamental em verificação formal de software."
  },
  {
    id: "logica_argumento_006",
    topic: "Lógica Proposicional",
    macroarea: "Fundamentos da Computação",
    element: "Argumento válido",
    difficulty: "médio" as const,
    statement:
      "Um desenvolvedor argumenta o seguinte sobre um sistema de autenticação:\n\nPremissa 1: Se o login falha três vezes seguidas, a conta é bloqueada.\nPremissa 2: A conta do usuário foi bloqueada.\nConclusão: O login falhou três vezes seguidas.\n\nConsiderando as regras de validação de argumentos lógicos, esse argumento é válido? Justifique.",
    alternatives: [
      { letter: "A", text: "Válido, pois utiliza modus ponens, que é uma regra de inferência válida." },
      { letter: "B", text: "Válido, pois a conclusão é uma consequência possível das premissas." },
      { letter: "C", text: "Inválido, pois comete a falácia da afirmação do consequente: da verdade de P→Q e de Q, não se pode concluir P." },
      { letter: "D", text: "Inválido, pois utiliza modus tollens de forma incorreta." },
      { letter: "E", text: "Válido, pois se a conta foi bloqueada, necessariamente o login falhou três vezes." }
    ],
    correctAnswer: "C",
    explanation:
      "O argumento tem a estrutura: P → Q, Q, logo P. Esta é a falácia da afirmação do consequente (também chamada de falácia do consequente ou 'affirming the consequent'). De P → Q e Q serem verdadeiros, NÃO podemos concluir P, pois Q pode ser verdadeiro por outras razões (por exemplo, um administrador pode ter bloqueado a conta manualmente). As regras válidas são: modus ponens (P → Q, P, logo Q) e modus tollens (P → Q, ¬Q, logo ¬P). A falácia inversa seria negar o antecedente."
  },
  {
    id: "logica_formasnormais_007",
    topic: "Lógica Proposicional",
    macroarea: "Fundamentos da Computação",
    element: "Formas normais (FNC/FND)",
    difficulty: "difícil" as const,
    statement:
      "Um engenheiro de software precisa converter a expressão lógica (P → Q) ∧ (R → S) para a Forma Normal Conjuntiva (FNC) para utilizá-la em um algoritmo de verificação de satisfatibilidade (SAT solver). Qual das alternativas representa a FNC correta dessa expressão?",
    alternatives: [
      { letter: "A", text: "(P ∧ Q) ∧ (R ∧ S)" },
      { letter: "B", text: "(¬P ∨ Q) ∧ (¬R ∨ S)" },
      { letter: "C", text: "(P ∨ ¬Q) ∧ (R ∨ ¬S)" },
      { letter: "D", text: "(¬P ∧ Q) ∨ (¬R ∧ S)" },
      { letter: "E", text: "(P → Q) ∧ (R → S) já está na FNC." }
    ],
    correctAnswer: "B",
    explanation:
      "Para converter para FNC, seguiremos os seguintes passos:\n1. Eliminar a implicação: P → Q é equivalente a ¬P ∨ Q; R → S é equivalente a ¬R ∨ S.\n2. A expressão torna-se: (¬P ∨ Q) ∧ (¬R ∨ S).\n3. A FNC é uma conjunção (AND) de cláusulas, onde cada cláusula é uma disjunção (OR) de literais.\n4. Cada cláusula (¬P ∨ Q) e (¬R ∨ S) é uma disjunção de literais, e elas estão conectadas por ∧.\n\nPortanto, (¬P ∨ Q) ∧ (¬R ∨ S) já está na Forma Normal Conjuntiva. A regra geral é: P → Q ≡ ¬P ∨ Q (equivalência da implicação)."
  },
  {
    id: "logica_inferencia_008",
    topic: "Lógica Proposicional",
    macroarea: "Fundamentos da Computação",
    element: "Inferência",
    difficulty: "médio" as const,
    statement:
      "Em um sistema especialista para diagnóstico médico, foram estabelecidas as seguintes regras de inferência:\n\nRegra 1: Se o paciente tem febre alta (F), então há infecção (I).\nRegra 2: Se há infecção (I) e o paciente apresenta fadiga (D), então é necessário repouso (R).\nRegra 3: O paciente tem febre alta (F) e apresenta fadiga (D).\n\nAplicando regras de inferência, qual conclusão é logicamente obtida?",
    alternatives: [
      { letter: "A", text: "Há infecção, mas não é necessário repouso." },
      { letter: "B", text: "É necessário repouso, pois há infecção e o paciente apresenta fadiga." },
      { letter: "C", text: "O paciente não tem febre alta, pois apresenta fadiga." },
      { letter: "D", text: "Há infecção e é necessário repouso." },
      { letter: "E", text: "Apenas há infecção; não é possível concluir sobre repouso." }
    ],
    correctAnswer: "D",
    explanation:
      "Resolução passo a passo:\n1. Da Regra 3, temos F ∧ D (febre alta e fadiga), logo F é verdadeiro e D é verdadeiro.\n2. Da Regra 1 (F → I) e F (verdadeiro), por modus ponens, concluímos I (há infecção).\n3. Da Regra 2 (I ∧ D → R), com I (verdadeiro, do passo 2) e D (verdadeiro, da Regra 3), por modus ponens, concluímos R (é necessário repouso).\n\nConclusões obtidas: I (há infecção) e R (é necessário repouso), ou seja, I ∧ R."
  },
  {
    id: "logica_formasraciocinio_009",
    topic: "Lógica Proposicional",
    macroarea: "Fundamentos da Computação",
    element: "Formas de raciocínio",
    difficulty: "fácil" as const,
    statement:
      "Um programador precisa implementar uma função que retorna verdadeiro se pelo menos uma das condições A, B ou C for verdadeira. Qual conectivo lógico representa adequadamente essa lógica?",
    alternatives: [
      { letter: "A", text: "A ∧ B ∧ C (conjunção)" },
      { letter: "B", text: "A ∨ B ∨ C (disjunção)" },
      { letter: "C", text: "¬(A ∧ B ∧ C) (negação da conjunção)" },
      { letter: "D", text: "A → (B ∨ C) (condicional)" },
      { letter: "E", text: "(A ⊕ B) ⊕ C (ou exclusivo)" }
    ],
    correctAnswer: "B",
    explanation:
      "A disjunção (∨) resulta em verdadeiro quando pelo menos um dos operandos é verdadeiro. A ∨ B ∨ C é verdadeira se A for verdadeira, OU B for verdadeira, OU C for verdadeira, OU qualquer combinação delas. A conjunção (A) exige que todas sejam verdadeiras. A negação da conjunção (C) seria verdadeira quando pelo menos uma é falsa (equivalente à disjunção das negações pela Lei de De Morgan, não ao que se pede). O ou exclusivo (E) seria verdadeiro apenas quando um número ímpar de condições é verdadeiro, o que difere de 'pelo menos uma'."
  },
  {
    id: "logica_argumentoestrutura_010",
    topic: "Lógica Proposicional",
    macroarea: "Fundamentos da Computação",
    element: "Argumento válido (estrutura)",
    difficulty: "difícil" as const,
    statement:
      "Considere o seguinte argumento:\n\nPremissa 1: Se o servidor está online (O), então o banco de dados responde (R).\nPremissa 2: Se o banco de dados responde (R) e as requisições são processadas (P), então a aplicação funciona (A).\nPremissa 3: O servidor está online (O) e as requisições são processadas (P).\n\nQual é a estrutura lógica completa da conclusão válida que pode ser extraída?",
    alternatives: [
      { letter: "A", text: "A aplicação funciona (A) — inferida diretamente por modus ponens da premissa 1." },
      { letter: "B", text: "O banco de dados responde (R) — inferida por modus ponens da premissa 1, mas não é possível concluir A sem P." },
      { letter: "C", text: "O banco de dados responde (R) e a aplicação funciona (A) — inferidas por encadeamento de modus ponens." },
      { letter: "D", text: "Não é possível concluir A, pois faltam premissas para conectar R e P à conclusão." },
      { letter: "E", text: "Apenas O e P são garantidos; R e A dependem de fatores externos." }
    ],
    correctAnswer: "C",
    explanation:
      "Resolução:\n1. Da Premissa 3 (O ∧ P), temos O = verdadeiro e P = verdadeiro.\n2. Da Premissa 1 (O → R) e O (verdadeiro), por modus ponens → R (o banco de dados responde).\n3. Da Premissa 2 (R ∧ P → A), com R (verdadeiro, do passo 2) e P (verdadeiro, do passo 1), temos R ∧ P = verdadeiro.\n4. Aplicando modus ponens na Premissa 2: R ∧ P → A e R ∧ P (verdadeiro) → A (a aplicação funciona).\n\nConclusão: R ∧ A (o banco de dados responde E a aplicação funciona)."
  },

  // =============================================================================
  // MICROAREA 2: MATEMÁTICA DISCRETA (10 questões)
  // =============================================================================
  {
    id: "disc_conjuntos_001",
    topic: "Matemática Discreta",
    macroarea: "Fundamentos da Computação",
    element: "Conjuntos e operações",
    difficulty: "fácil" as const,
    statement:
      "Em um sistema de gerenciamento de usuários, o conjunto A representa os usuários com permissão de leitura e o conjunto B representa os usuários com permissão de escrita. Se A = {1, 2, 3, 4, 5} e B = {3, 4, 5, 6, 7}, qual operação de conjuntos identifica os usuários que possuem AMBAS as permissões?",
    alternatives: [
      { letter: "A", text: "A ∪ B = {1, 2, 3, 4, 5, 6, 7} — união" },
      { letter: "B", text: "A ∩ B = {3, 4, 5} — interseção" },
      { letter: "C", text: "A − B = {1, 2} — diferença" },
      { letter: "D", text: "B − A = {6, 7} — diferença" },
      { letter: "E", text: "A △ B = {1, 2, 6, 7} — diferença simétrica" }
    ],
    correctAnswer: "B",
    explanation:
      "A interseção (A ∩ B) retorna os elementos que pertencem a ambos os conjuntos simultaneamente. A = {1,2,3,4,5}, B = {3,4,5,6,7}. Os elementos comuns são {3,4,5}, que representam os usuários com permissão de leitura E escrita. A união (A) daria todos com pelo menos uma permissão. A diferença (C) daria apenas leitura sem escrita. A diferença simétrica (E) daria apenas uma das permissões, não ambas."
  },
  {
    id: "disc_relacoesfuncoes_002",
    topic: "Matemática Discreta",
    macroarea: "Fundamentos da Computação",
    element: "Relações e funções",
    difficulty: "médio" as const,
    statement:
      "Seja R uma relação binária definida sobre o conjunto A = {1, 2, 3, 4} tal que xRy se e somente se x divide y (x | y). Considerando as propriedades de relações binárias, classifique R quanto à reflexividade, simetria, antissimetria e transitividade.",
    alternatives: [
      { letter: "A", text: "Reflexiva, simétrica e transitiva." },
      { letter: "B", text: "Reflexiva, antissimétrica e transitiva, mas não simétrica." },
      { letter: "C", text: "Não reflexiva, simétrica, antissimétrica e transitiva." },
      { letter: "D", text: "Reflexiva, simétrica e antissimétrica." },
      { letter: "E", text: "Reflexiva, não antissimétrica e não transitiva." }
    ],
    correctAnswer: "B",
    explanation:
      "Analisando a relação 'divide' (|) sobre A = {1,2,3,4}:\n- Reflexiva: ∀x, x|x (todo número divide a si mesmo). Sim.\n- Simétrica: se x|y, então y|x? Não. Exemplo: 2|4, mas 4 não divide 2. Não é simétrica.\n- Antissimétrica: se x|y e y|x, então x=y? Sim, pois se x|y, x ≤ y, e se y|x, y ≤ x, logo x = y.\n- Transitiva: se x|y e y|z, então x|z? Sim, pela propriedade da divisibilidade.\n\nPortanto, R é reflexiva, antissimétrica e transitiva, configurando uma relação de ordem parcial (poset)."
  },
  {
    id: "disc_inducao_003",
    topic: "Matemática Discreta",
    macroarea: "Fundamentos da Computação",
    element: "Indução matemática",
    difficulty: "difícil" as const,
    statement:
      "Utilizando indução matemática, um estudante deseja provar que a soma dos n primeiros números ímpares positivos é igual a n², ou seja: 1 + 3 + 5 + ... + (2n − 1) = n². Na etapa indutiva, supondo que a fórmula vale para n = k, qual é a expressão correta que deve ser demonstrada para n = k + 1?",
    alternatives: [
      { letter: "A", text: "1 + 3 + 5 + ... + (2k + 1) = (k + 1)²" },
      { letter: "B", text: "1 + 3 + 5 + ... + (2k − 1) + 1 = (k + 1)²" },
      { letter: "C", text: "1 + 3 + 5 + ... + (2k + 1) = k² + 2k" },
      { letter: "D", text: "1 + 3 + 5 + ... + (2k − 1) = (k + 1)²" },
      { letter: "E", text: "1 + 3 + 5 + ... + (2k − 1) + (2k) = (k + 1)²" }
    ],
    correctAnswer: "A",
    explanation:
      "Para provar por indução que Σ(2i−1) = n² para i de 1 a n:\n\nBase: n=1: 1 = 1² ✓\n\nHipótese indutiva (HI): Σ(i=1 até k) (2i−1) = k²\n\nPasso indutivo: Para n = k+1:\n- O último termo é (2(k+1)−1) = 2k + 1\n- Precisamos mostrar: Σ(i=1 até k+1) (2i−1) = (k+1)²\n- Equivalentemente: [Σ(i=1 até k) (2i−1)] + (2k+1) = (k+1)²\n- Pela HI: k² + (2k + 1) = k² + 2k + 1 = (k+1)² ✓\n\nA expressão na alternativa A, 1 + 3 + 5 + ... + (2k+1) = (k+1)², é a formulação correta do passo indutivo."
  },
  {
    id: "disc_combinatoria_004",
    topic: "Matemática Discreta",
    macroarea: "Fundamentos da Computação",
    element: "Combinatória",
    difficulty: "médio" as const,
    statement:
      "Uma equipe de desenvolvimento precisa criar senhas de 6 caracteres para um sistema. Cada caractere pode ser uma letra maiúscula (26 opções) ou um dígito (10 opções), e a senha deve conter exatamente 4 letras e 2 dígitos. Quantas senhas diferentes podem ser criadas?",
    alternatives: [
      { letter: "A", text: "26⁴ × 10² = 45.697.600" },
      { letter: "B", text: "C(6,4) × 26⁴ × 10² × 4! × 2! = 109.674.240.000" },
      { letter: "C", text: "C(6,4) × 26⁴ × 10² = 274.185.600" },
      { letter: "D", text: "36⁶ = 2.176.782.336" },
      { letter: "E", text: "P(6,4) × 26⁴ × 10² = 2.741.856.000" }
    ],
    correctAnswer: "C",
    explanation:
      "Para criar senhas com exatamente 4 letras e 2 dígitos em 6 posições:\n1. Escolher quais 4 das 6 posições serão letras: C(6,4) = 15 maneiras.\n2. Preencher as 4 posições de letras: 26⁴ maneiras.\n3. Preencher as 2 posições de dígitos: 10² maneiras.\n\nTotal = C(6,4) × 26⁴ × 10² = 15 × 456.976 × 100 = 15 × 45.697.600 = 685.464.000.\n\nNão multiplicamos por permutações (4! × 2!) porque, ao escolher as posições com C(6,4) e preenchê-las diretamente, a ordem já está contabilizada na escolha das posições."
  },
  {
    id: "disc_grafos_005",
    topic: "Matemática Discreta",
    macroarea: "Fundamentos da Computação",
    element: "Grafos",
    difficulty: "médio" as const,
    statement:
      "Uma rede de computadores é modelada por um grafo não direcionado com 5 roteadores (vértices) e 7 conexões (arestas). Sobre as propriedades desse grafo, qual afirmativa é necessariamente verdadeira?",
    alternatives: [
      { letter: "A", text: "O grafo é necessariamente planar, pois possui poucas arestas." },
      { letter: "B", text: "O grau total de todos os vértices é igual a 14, e todos os vértices têm grau par." },
      { letter: "C", text: "A soma de todos os graus dos vértices é igual a 14, pelo Lema do Aperto de Mão." },
      { letter: "D", text: "O grafo possui exatamente 5 ciclos, pois tem 7 arestas e 5 vértices." },
      { letter: "E", text: "O grafo é necessariamente conexo, pois 7 > 5." }
    ],
    correctAnswer: "C",
    explanation:
      "Pelo Lema do Aperto de Mão (Handshaking Lemma), a soma dos graus de todos os vértices de um grafo é igual ao dobro do número de arestas: Σ graus = 2 × |E| = 2 × 7 = 14. Essa é a única afirmativa necessariamente verdadeira. (A) Um grafo com 5 vértices e 7 arestas pode ou não ser planar (K₅ tem 10 arestas e não é planar, mas isso não garante que todos os grafos com 7 arestas sejam planares). (B) Os graus podem ser ímpares. (D) Não é possível determinar o número de ciclos apenas com essas informações. (E) O grafo pode não ser conexo."
  },
  {
    id: "disc_arvores_006",
    topic: "Matemática Discreta",
    macroarea: "Fundamentos da Computação",
    element: "Árvores",
    difficulty: "fácil" as const,
    statement:
      "Em uma rede local (LAN), a topologia física é organizada como uma árvore de spanning (árvore geradora) conectando 8 computadores. Qual é o número mínimo de conexões físicas (cabos) necessárias para garantir que todos os computadores estejam conectados sem formar ciclos?",
    alternatives: [
      { letter: "A", text: "6 conexões" },
      { letter: "B", text: "7 conexões" },
      { letter: "C", text: "8 conexões" },
      { letter: "D", text: "9 conexões" },
      { letter: "E", text: "10 conexões" }
    ],
    correctAnswer: "B",
    explanation:
      "Uma árvore com n vértices possui exatamente (n − 1) arestas. Esta é uma propriedade fundamental das árvores. Com 8 computadores (vértices), a árvore geradora precisa de 8 − 1 = 7 conexões (arestas). Com menos de 7, o grafo seria desconexo (nem todos os computadores estariam conectados). Com 7, garante-se conectividade sem ciclos. Com mais de 7, formaria pelo menos um ciclo."
  },
  {
    id: "disc_teorianumeros_007",
    topic: "Matemática Discreta",
    macroarea: "Fundamentos da Computação",
    element: "Teoria dos números",
    difficulty: "médio" as const,
    statement:
      "Em um sistema criptográfico que utiliza o algoritmo RSA, é necessário calcular o máximo divisor comum (MDC) de dois números. Utilizando o algoritmo de Euclides, qual é o MDC(252, 198)?",
    alternatives: [
      { letter: "A", text: "12" },
      { letter: "B", text: "18" },
      { letter: "C", text: "6" },
      { letter: "D", text: "9" },
      { letter: "E", text: "36" }
    ],
    correctAnswer: "B",
    explanation:
      "Aplicando o Algoritmo de Euclides:\n1. 252 = 198 × 1 + 54 (resto 54)\n2. 198 = 54 × 3 + 36 (resto 36)\n3. 54 = 36 × 1 + 18 (resto 18)\n4. 36 = 18 × 2 + 0 (resto 0)\n\nQuando o resto é 0, o MDC é o último resto não nulo encontrado: MDC(252, 198) = 18.\n\nVerificação: 252 = 18 × 14 e 198 = 18 × 11. Como 14 e 11 são coprimos (MDC(14,11) = 1), 18 é efetivamente o máximo divisor comum."
  },
  {
    id: "disc_progressoes_008",
    topic: "Matemática Discreta",
    macroarea: "Fundamentos da Computação",
    element: "Progressões",
    difficulty: "fácil" as const,
    statement:
      "Um servidor de banco de dados realiza backups incrementais diários. O tamanho do primeiro backup é de 2 GB, e cada backup subsequente cresce 500 MB em relação ao anterior. Considerando essa progressão aritmética, qual será o tamanho total acumulado dos dados de backup após 10 dias?",
    alternatives: [
      { letter: "A", text: "42,5 GB" },
      { letter: "B", text: "45,0 GB" },
      { letter: "C", text: "47,5 GB" },
      { letter: "D", text: "50,0 GB" },
      { letter: "E", text: "52,5 GB" }
    ],
    correctAnswer: "A",
    explanation:
      "Trata-se de uma progressão aritmética onde:\n- a₁ = 2 GB (primeiro termo)\n- r = 0,5 GB (razão, 500 MB = 0,5 GB)\n- n = 10 (número de termos)\n\nO décimo termo: a₁₀ = a₁ + 9r = 2 + 9 × 0,5 = 2 + 4,5 = 6,5 GB\n\nSoma dos 10 termos: S₁₀ = n × (a₁ + a_n) / 2 = 10 × (2 + 6,5) / 2 = 10 × 8,5 / 2 = 10 × 4,25 = 42,5 GB"
  },
  {
    id: "disc_probabilidade_009",
    topic: "Matemática Discreta",
    macroarea: "Fundamentos da Computação",
    element: "Probabilidade discreta",
    difficulty: "médio" as const,
    statement:
      "Um sistema de detecção de intrusão (IDS) tem taxa de verdadeiros positivos de 95% e taxa de falsos positivos de 3%. Em um ambiente onde a probabilidade de um ataque real é de 1%, qual é a probabilidade de que um alerta gerado corresponda a um ataque real? (Use aproximação para duas casas decimais.)",
    alternatives: [
      { letter: "A", text: "95%" },
      { letter: "B", text: "92%" },
      { letter: "C", text: "24%" },
      { letter: "D", text: "50%" },
      { letter: "E", text: "1%" }
    ],
    correctAnswer: "C",
    explanation:
      "Aplicando o Teorema de Bayes:\n- P(Ataque) = 0,01\n- P(Não ataque) = 0,99\n- P(Alerta | Ataque) = 0,95 (verdadeiro positivo)\n- P(Alerta | Não ataque) = 0,03 (falso positivo)\n\nP(Ataque | Alerta) = [P(Alerta | Ataque) × P(Ataque)] / P(Alerta)\n\nP(Alerta) = P(Alerta | Ataque) × P(Ataque) + P(Alerta | Não ataque) × P(Não ataque)\nP(Alerta) = 0,95 × 0,01 + 0,03 × 0,99 = 0,0095 + 0,0297 = 0,0392\n\nP(Ataque | Alerta) = 0,0095 / 0,0392 ≈ 0,2423 ≈ 24%\n\nEste resultado demonstra o paradoxo da base baixa: mesmo com boa precisão, quando eventos são raros, a maioria dos alertas pode ser falsa."
  },
  {
    id: "disc_matrizes_010",
    topic: "Matemática Discreta",
    macroarea: "Fundamentos da Computação",
    element: "Matrizes",
    difficulty: "difícil" as const,
    statement:
      "Em um sistema de recomendação, a relação entre usuários e produtos é representada por uma matriz de adjacência A de dimensão 4×4, onde A[i][j] = 1 indica que o usuário i comprou o produto j. Se A² representa a matriz de compras em comum indiretas (caminhos de comprimento 2), o que A²[i][j] representa?",
    alternatives: [
      { letter: "A", text: "O número de vezes que o usuário i e o usuário j compraram o mesmo produto." },
      { letter: "B", text: "O número de produtos que foram comprados por ambos o usuário i e o usuário j." },
      { letter: "C", text: "O número total de compras realizadas pelo usuário i." },
      { letter: "D", text: "A probabilidade de o usuário i comprar o produto j." },
      { letter: "E", text: "O número de usuários que compraram o produto j." }
    ],
    correctAnswer: "B",
    explanation:
      "Na multiplicação de matrizes de adjacência, A²[i][j] = Σ(k=1 até n) A[i][k] × A[k][j]. Cada termo A[i][k] × A[k][j] = 1 quando A[i][k] = 1 E A[k][j] = 1, ou seja, quando o usuário i comprou o produto k E o usuário j também comprou o produto k.\n\nPortanto, A²[i][j] conta o número de produtos (k) que ambos os usuários i e j compraram. Isso é fundamental em sistemas de recomendação baseados em filtragem colaborativa: usuários com valores altos em A²[i][j] têm gostos similares."
  },

  // =============================================================================
  // MICROAREA 3: AUTÔMATOS E LINGUAGENS FORMAIS (10 questões)
  // =============================================================================
  {
    id: "autom_afd_001",
    topic: "Autômatos e Linguagens Formais",
    macroarea: "Teoria da Computação",
    element: "AFD",
    difficulty: "médio" as const,
    statement:
      "Um AFD (Autômato Finito Determinístico) foi projetado para reconhecer strings binárias que terminam com '01' sobre o alfabeto Σ = {0, 1}. Qual é o número mínimo de estados necessários para esse AFD?",
    alternatives: [
      { letter: "A", text: "2 estados" },
      { letter: "B", text: "3 estados" },
      { letter: "C", text: "4 estados" },
      { letter: "D", text: "5 estados" },
      { letter: "E", text: "6 estados" }
    ],
    correctAnswer: "B",
    explanation:
      "Para reconhecer strings que terminam com '01', precisamos rastrear os últimos caracteres vistos:\n- q₀: estado inicial (não vimos nada relevante)\n- q₁: vimos um '0' que pode ser o início do sufixo '01'\n- q₂: vimos '01' — estado de aceitação\n\nTransições:\n- De q₀ com '0' → q₁; com '1' → q₀\n- De q₁ com '0' → q₁ (o '0' mais recente pode iniciar um novo '01'); com '1' → q₂\n- De q₂ (aceitação) com '0' → q₁; com '1' → q₀\n\nSão necessários 3 estados. Não é possível com apenas 2, pois precisamos distinguir 3 situações: 'nada relevante', 'último foi 0' e 'termina com 01'."
  },
  {
    id: "autom_afnd_002",
    topic: "Autômatos e Linguagens Formais",
    macroarea: "Teoria da Computação",
    element: "AFND",
    difficulty: "médio" as const,
    statement:
      "Um AFND (Autômato Finito Não Determinístico) sobre Σ = {a, b} tem os estados {q₀, q₁, q₂}, sendo q₀ o estado inicial e {q₂} o conjunto de estados de aceitação. Se o AFND possui transições não determinísticas de q₀ com 'a' indo para {q₀, q₁} e de q₁ com 'b' indo para {q₂}, ao processar a string 'aab', quais caminhos possíveis são explorados?",
    alternatives: [
      { letter: "A", text: "Apenas o caminho q₀→q₁→q₂, que aceita a string." },
      { letter: "B", text: "O caminho q₀→q₀→q₁→q₂ (aceita) e q₀→q₁→q₁→q₂ (rejeita, pois q₁ com 'b' vai para q₂, mas q₁ não tem transição com 'a' no segundo passo)." },
      { letter: "C", text: "Dois caminhos: q₀→q₀→q₀ (rejeita) e q₀→q₁→q₂ (aceita)." },
      { letter: "D", text: "Apenas um caminho: q₀→q₀→q₁→q₂ (aceita)." },
      { letter: "E", text: "Três caminhos possíveis, dos quais apenas um atinge q₂." }
    ],
    correctAnswer: "B",
    explanation:
      "Processando 'aab' caractere por caractere, explorando todas as transições:\n\nPrimeiro 'a': q₀ vai para {q₀, q₁}\n- Caminho 1: em q₀\n- Caminho 2: em q₁\n\nSegundo 'a':\n- De q₀ com 'a' → {q₀, q₁}\n  - Caminho 1a: em q₀\n  - Caminho 1b: em q₁\n- De q₁ com 'a': assumindo que não há transição definida, caminho morre\n\nTerceiro caractere 'b':\n- De q₀ com 'b': assumindo que não há transição, caminho morre\n- De q₁ com 'b' → q₂ (aceitação!)\n\nCaminhos principais: q₀→q₀→q₁→q₂ (aceita). O AFND aceita se pelo menos um caminho atinge um estado de aceitação."
  },
  {
    id: "autom_expressoesregulares_003",
    topic: "Autômatos e Linguagens Formais",
    macroarea: "Teoria da Computação",
    element: "Expressões regulares",
    difficulty: "fácil" as const,
    statement:
      "Um desenvolvedor precisa criar uma expressão regular para validar senhas que contenham apenas letras minúsculas (a-z) e dígitos (0-9), com comprimento entre 6 e 10 caracteres. Qual expressão regular representa corretamente esse padrão?",
    alternatives: [
      { letter: "A", text: "[a-z0-9]{6,10}" },
      { letter: "B", text: "[a-zA-Z0-9]{6,10}" },
      { letter: "C", text: "[a-z0-9]{6}" },
      { letter: "D", text: "[a-z0-9]{10}" },
      { letter: "E", text: "^[a-z][0-9]{5,9}$" }
    ],
    correctAnswer: "A",
    explanation:
      "A expressão [a-z0-9]{6,10} define:\n- [a-z0-9]: conjunto de caracteres permitidos (letras minúsculas e dígitos)\n- {6,10}: quantificador indicando que o padrão anterior deve ocorrer entre 6 e 10 vezes\n\n(B) incluiria letras maiúsculas, o que viola o requisito. (C) exige exatamente 6 caracteres. (D) exige exatamente 10. (E) exige que o primeiro caractere seja uma letra e os demais sejam dígitos, o que é mais restritivo do que o necessário."
  },
  {
    id: "autom_linguagensregulares_004",
    topic: "Autômatos e Linguagens Formais",
    macroarea: "Teoria da Computação",
    element: "Linguagens regulares",
    difficulty: "médio" as const,
    statement:
      "Considere as seguintes linguagens sobre Σ = {0, 1}:\nL₁ = {w | w contém o substring '010'}\nL₂ = {w | o número de 0s em w é igual ao número de 1s}\n\nSobre a classificação dessas linguagens, qual afirmativa é correta?",
    alternatives: [
      { letter: "A", text: "Tanto L₁ quanto L₂ são linguagens regulares." },
      { letter: "B", text: "L₁ é regular e L₂ não é regular, pois requer contagem ilimitada." },
      { letter: "C", text: "L₁ não é regular e L₂ é regular." },
      { letter: "D", text: "L₁ é livre de contexto e L₂ é regular." },
      { letter: "E", text: "Nenhuma das duas é linguagem regular." }
    ],
    correctAnswer: "B",
    explanation:
      "L₁ = {w | w contém '010'} é regular, pois pode ser reconhecida por um AFD com 4 estados que rastreia os últimos caracteres vistos buscando o padrão '010'. Linguagens definidas pela presença de um substring finito são sempre regulares.\n\nL₂ = {w | #0s = #1s} não é regular. Pelo Lema do Bombeamento para linguagens regulares, suponha que L₂ fosse regular com comprimento de bombeamento p. A string s = 0ᵖ1ᵖ pertence a L₂. Ao bombear qualquer parte dos primeiros 0ᵖ, o número de 0s ficará diferente do número de 1s, e a string resultante não pertencerá a L₂ — contradição. L₂ requer memória ilimitada para contar, sendo livre de contexto."
  },
  {
    id: "autom_gramaticasregulares_005",
    topic: "Autômatos e Linguagens Formais",
    macroarea: "Teoria da Computação",
    element: "Gramáticas regulares",
    difficulty: "fácil" as const,
    statement:
      "Qual das seguintes gramáticas é uma gramática regular (linear à direita) que gera a linguagem {aⁿb | n ≥ 1}, ou seja, strings com um ou mais 'a's seguidos de exatamente um 'b'?",
    alternatives: [
      { letter: "A", text: "S → aS | b" },
      { letter: "B", text: "S → aS | ab" },
      { letter: "C", text: "S → Sa | b" },
      { letter: "D", text: "S → aSb | ε" },
      { letter: "E", text: "S → aA, A → aA | b" }
    ],
    correctAnswer: "B",
    explanation:
      "A gramática S → aS | ab é linear à direita:\n- S → ab (gera 'ab', n=1)\n- S → aS → aab (gera 'aab', n=2)\n- S → aS → aaS → aaab (gera 'aaab', n=3)\n- E assim por diante...\n\nEm uma gramática linear à direita, toda produção tem a forma A → aB ou A → a, onde A e B são variáveis e 'a' é um terminal. (A) geraria {aⁿbⁿ}, o que inclui strings sem 'b' (quando S → b diretamente com n=0). (C) é linear à esquerda. (D) gera {aⁿbⁿ}. (E) gera a linguagem correta mas é uma gramática linear à direita com duas variáveis — ambas B e E geram a mesma linguagem, mas B é mais direta."
  },
  {
    id: "autom_automatopilha_006",
    topic: "Autômatos e Linguagens Formais",
    macroarea: "Teoria da Computação",
    element: "Autômato de pilha",
    difficulty: "difícil" as const,
    statement:
      "Um autômato de pilha determinístico (APD) é projetado para reconhecer a linguagem L = {w ∈ {0,1}* | w = wwᴿ, onde wᴿ é o reverso de w}. Sobre esse autômato, qual afirmativa é correta?",
    alternatives: [
      { letter: "A", text: "O APD pode reconhecer L deterministicamente, empilhando a primeira metade e comparando com a segunda metade." },
      { letter: "B", text: "L não é livre de contexto, portanto não pode ser reconhecida por nenhum autômato de pilha." },
      { letter: "C", text: "L é livre de contexto e pode ser reconhecida por um APND, mas não por um APD, pois não se sabe onde termina a primeira metade da string." },
      { letter: "D", text: "Um APD pode reconhecer L usando dois marcadores de fundo de pilha." },
      { letter: "E", text: "L é uma linguagem regular, então um AFD é suficiente para reconhecê-la." }
    ],
    correctAnswer: "C",
    explanation:
      "L = {wwᴿ | w ∈ {0,1}*} é uma linguagem livre de contexto. Um APND (não determinístico) pode reconhecê-la: adivinha o ponto médio, empilha a primeira metade e desempilha comparando com a segunda metade.\n\nPorém, um APD (determinístico) NÃO pode reconhecê-la, pois não há como determinar deterministicamente onde termina w e começa wᴿ sem um marcador explícito no meio. A linguagem {wcwᴿ | c é um marcador} pode ser reconhecida deterministicamente, mas sem o marcador, não.\n\nEste é um exemplo clássico de linguagem que é livre de contexto não determinística mas não é livre de contexto determinística."
  },
  {
    id: "autom_maquinaturing_007",
    topic: "Autômatos e Linguagens Formais",
    macroarea: "Teoria da Computação",
    element: "Máquina de Turing",
    difficulty: "médio" as const,
    statement:
      "Uma Máquina de Turing (MT) precisa computar a função f(n) = n + 1, onde n é representado em unário (ex: 3 = '111'). A fita inicial contém a representação de n seguida de brancos. Qual é a descrição de alto nível do algoritmo que a MT deve executar?",
    alternatives: [
      { letter: "A", text: "Mover para a direita até encontrar um espaço em branco, escrever '1' e parar." },
      { letter: "B", text: "Apagar o primeiro '1', mover para a direita até o fim, escrever '1' e parar." },
      { letter: "C", text: "Contar todos os '1's, mover para o final e escrever a contagem mais um." },
      { letter: "D", text: "Substituir o último '1' por dois '1's e parar." },
      { letter: "E", text: "Mover para a esquerda até o início, escrever '1' e parar." }
    ],
    correctAnswer: "A",
    explanation:
      "Para computar n + 1 em unário:\n- A fita contém '111...1' (n uns) seguido de brancos (⊕)\n- A MT move a cabeça para a direita até encontrar o primeiro branco ⊕\n- Escreve '1' na posição do branco\n- Para no estado de aceitação\n\nResultado: '111...11' (n+1 uns). Essa é a computação mais simples possível. O algoritmo é:\n1. Mover para a direita (estado q₀, lendo 1 → permanecer em q₀, mover direita)\n2. Quando ler ⊕ (branco): escrever 1, mover para aceitação (estado q_accept)\n\nA complexidade é O(n) em tempo e O(1) em espaço adicional."
  },
  {
    id: "autom_linguagenslivrescontexto_008",
    topic: "Autômatos e Linguagens Formais",
    macroarea: "Teoria da Computação",
    element: "Linguagens livres de contexto",
    difficulty: "médio" as const,
    statement:
      "Considere a gramática livre de contexto G:\nS → aSb | SS | ε\n\nQual linguagem é gerada por essa gramática?",
    alternatives: [
      { letter: "A", text: "{aⁿbⁿ | n ≥ 0}" },
      { letter: "B", text: "{aⁿbⁿ | n ≥ 1}" },
      { letter: "C", text: "O conjunto de todas as strings bem formadas de parênteses usando 'a' e 'b'." },
      { letter: "D", text: "{wwᴿ | w ∈ {a,b}*}" },
      { letter: "E", text: "A linguagem de Dyck com um tipo de parênteses, usando 'a' como abre e 'b' como fecha." }
    ],
    correctAnswer: "E",
    explanation:
      "A gramática S → aSb | SS | ε é a gramática da linguagem de Dyck com um par de parênteses:\n- S → ε: string vazia (parênteses vazios)\n- S → aSb: um par de parênteses envolvendo uma string bem formada\n- S → SS: concatenação de duas strings bem formadas\n\nExemplos de derivações:\n- ε → '' (vazio)\n- aSb → ab (um par)\n- aSb → aaSbb → aabb (dois pares)\n- SS → aSbS → abS → abaSb → abab (pares lado a lado)\n\nNote que (A) {aⁿbⁿ} é um subconjunto. A gramática gera strings como 'abab' (= '( ) ( )'), que não estão em {aⁿbⁿ} mas são válidas na linguagem de Dyck."
  },
  {
    id: "autom_hierarquiachomsky_009",
    topic: "Autômatos e Linguagens Formais",
    macroarea: "Teoria da Computação",
    element: "Hierarquia de Chomsky",
    difficulty: "fácil" as const,
    statement:
      "Na Hierarquia de Chomsky, as gramáticas sensíveis ao contexto (Tipo 1) são reconhecidas por qual tipo de autômato?",
    alternatives: [
      { letter: "A", text: "Autômato Finito Determinístico (AFD)" },
      { letter: "B", text: "Autômato de Pilha (AP)" },
      { letter: "C", text: "Máquina de Turing Linearmente Limitada (MTLL)" },
      { letter: "D", text: "Máquina de Turing Não Determinística (MTND)" },
      { letter: "E", text: "Autômato de Pilha Determinístico (APD)" }
    ],
    correctAnswer: "C",
    explanation:
      "A Hierarquia de Chomsky relaciona tipos de gramáticas e autômatos:\n\n- Tipo 3 (Regulares): AFD/AFND → Regras: A → aB ou A → a\n- Tipo 2 (Livres de contexto): Autômato de Pilha → Regras: A → α\n- Tipo 1 (Sensíveis ao contexto): MT Linearmente Limitada → Regras: αAβ → αγβ (com |γ| ≥ 1)\n- Tipo 0 (Irrestritas): Máquina de Turing → Regras: α → β (sem restrição)\n\nA MT Linearmente Limitada é uma MT cuja fita é limitada ao comprimento da entrada (não pode usar mais que cn células para uma entrada de tamanho n), correspondendo ao modelo de reconhecimento das gramáticas sensíveis ao contexto."
  },
  {
    id: "autom_decidibilidade_010",
    topic: "Autômatos e Linguagens Formais",
    macroarea: "Teoria da Computação",
    element: "Decidibilidade",
    difficulty: "difícil" as const,
    statement:
      "Sobre decidibilidade na teoria da computação, considere os seguintes problemas:\nI. Dado um AFD M e uma string w, M aceita w?\nII. Dado um AP M e uma string w, M aceita w?\nIII. Dado uma MT M e uma string w, M aceita w?\n\nQual afirmativa classifica corretamente esses problemas?",
    alternatives: [
      { letter: "A", text: "I e II são decidíveis; III é indecidível." },
      { letter: "B", text: "I é decidível; II e III são indecidíveis." },
      { letter: "C", text: "Todos os três são decidíveis, pois cada autômato sempre para." },
      { letter: "D", text: "I é decidível; II e III são semi-decidíveis mas não decidíveis." },
      { letter: "E", text: "I e II são decidíveis; III é semi-decidível (recursivamente enumerável) mas não decidível." }
    ],
    correctAnswer: "E",
    explanation:
      "- Problema I (aceitação por AFD): Decidível. Um AFD sempre para para qualquer entrada. Podemos simular M em w e responder sim/não em tempo finito.\n\n- Problema II (aceitação por AP): Decidível. Um AP (não determinístico) pode ser transformado em um APD equivalente? Não necessariamente. Mas podemos converter a gramática livre de contexto equivalente e usar o algoritmo CYK O(n³) para verificar pertinência. É decidível.\n\n- Problema III (aceitação por MT): Semi-decidível (R.E.) mas NÃO decidível. Podemos simular M em w e aceitar se M aceita, mas se M não aceita, pode nunca parar (o problema da parada). Não existe algoritmo que decida se uma MT arbitrária aceita uma string."
  },

  // =============================================================================
  // MICROAREA 4: ALGORITMOS E ESTRUTURAS DE DADOS (10 questões)
  // =============================================================================
  {
    id: "algo_bigO_001",
    topic: "Algoritmos e Estruturas de Dados",
    macroarea: "Algoritmos",
    element: "Complexidade Big-O",
    difficulty: "fácil" as const,
    statement:
      "Um desenvolvedor analisou o seguinte trecho de código e precisa determinar sua complexidade de tempo:\n\n```python\nfor i in range(n):\n    for j in range(n):\n        print(i, j)\n```\n\nQual é a complexidade Big-O desse trecho?",
    alternatives: [
      { letter: "A", text: "O(n)" },
      { letter: "B", text: "O(n log n)" },
      { letter: "C", text: "O(n²)" },
      { letter: "D", text: "O(2ⁿ)" },
      { letter: "E", text: "O(log n)" }
    ],
    correctAnswer: "C",
    explanation:
      "O loop externo executa n vezes. Para cada iteração do loop externo, o loop interno executa n vezes. Portanto, o total de operações é n × n = n². A notação Big-O captura a ordem de crescimento dominante, que é O(n²) — complexidade quadrática. Este é um padrão clássico: loops aninhados onde ambos dependem de n resultam em O(n²)."
  },
  {
    id: "algo_ordenacao_002",
    topic: "Algoritmos e Estruturas de Dados",
    macroarea: "Algoritmos",
    element: "Ordenação",
    difficulty: "médio" as const,
    statement:
      "Uma aplicação precisa ordenar uma lista de 1 milhão de registros por uma chave numérica. Considerando que a aplicação possui memória limitada e os dados estão parcialmente ordenados, qual algoritmo de ordenação é mais adequado?",
    alternatives: [
      { letter: "A", text: "Bubble Sort, pois é simples de implementar e funciona bem com dados parcialmente ordenados." },
      { letter: "B", text: "Selection Sort, pois faz o mínimo de trocas possíveis." },
      { letter: "C", text: "Insertion Sort, pois aproveita a ordenação parcial, fazendo poucas comparações e trocas no melhor caso O(n)." },
      { letter: "D", text: "Merge Sort, pois tem complexidade O(n log n) em todos os casos." },
      { letter: "E", text: "Heap Sort, pois não requer memória adicional e tem complexidade O(n log n)." }
    ],
    correctAnswer: "D",
    explanation:
      "Para 1 milhão de registros, algoritmos O(n²) como Bubble, Selection e Insertion são inviáveis. Merge Sort e Heap Sort têm complexidade O(n log n) em todos os casos, tornando-os viáveis para grandes entradas. Merge Sort é estável e tem bom desempenho com memória adicional O(n). Embora Insertion Sort seja excelente para dados quase ordenados (O(n) no melhor caso), para 1 milhão de elementos, o pior caso O(n²) é arriscado. Na prática, algoritmos híbridos como Timsort (usado no Python e Java) seriam ideais: combina Merge Sort e Insertion Sort."
  },
  {
    id: "algo_busca_003",
    topic: "Algoritmos e Estruturas de Dados",
    macroarea: "Algoritmos",
    element: "Busca",
    difficulty: "fácil" as const,
    statement:
      "Em um array ordenado de 1.024 elementos inteiros, utilizando o algoritmo de busca binária, qual é o número máximo de comparações necessárias para encontrar um elemento?",
    alternatives: [
      { letter: "A", text: "8 comparações" },
      { letter: "B", text: "10 comparações" },
      { letter: "C", text: "16 comparações" },
      { letter: "D", text: "32 comparações" },
      { letter: "E", text: "1.024 comparações" }
    ],
    correctAnswer: "B",
    explanation:
      "A busca binária divide o espaço de busca pela metade a cada comparação. O número máximo de comparações é ⌈log₂(n)⌉.\n\nlog₂(1024) = 10, pois 2¹⁰ = 1024.\n\nPortanto, são necessárias no máximo 10 comparações para encontrar qualquer elemento (ou determinar que ele não existe). Para 1 milhão de elementos (~2²⁰), seriam necessárias apenas 20 comparações. Essa eficiência logarítmica torna a busca binária extremamente superior à busca linear O(n) para arrays ordenados grandes."
  },
  {
    id: "algo_recursividade_004",
    topic: "Algoritmos e Estruturas de Dados",
    macroarea: "Algoritmos",
    element: "Recursividade",
    difficulty: "médio" as const,
    statement:
      "Considere a seguinte função recursiva:\n\n```python\ndef mystery(n):\n    if n <= 1:\n        return 1\n    return n * mystery(n - 1)\n```\n\nQual é o valor de mystery(5)?",
    alternatives: [
      { letter: "A", text: "15" },
      { letter: "B", text: "25" },
      { letter: "C", text: "120" },
      { letter: "D", text: "32" },
      { letter: "E", text: "5" }
    ],
    correctAnswer: "C",
    explanation:
      "A função mystery calcula o fatorial de n:\n- mystery(5) = 5 × mystery(4)\n- mystery(4) = 4 × mystery(3)\n- mystery(3) = 3 × mystery(2)\n- mystery(2) = 2 × mystery(1)\n- mystery(1) = 1 (caso base)\n\nDesenrolando: mystery(5) = 5 × 4 × 3 × 2 × 1 = 120\n\nA função possui complexidade de tempo O(n) e complexidade de espaço O(n) devido à pilha de recursão (n chamadas recursivas empilhadas)."
  },
  {
    id: "algo_divisaoconquista_005",
    topic: "Algoritmos e Estruturas de Dados",
    macroarea: "Algoritmos",
    element: "Divisão e conquista",
    difficulty: "médio" as const,
    statement:
      "O algoritmo Merge Sort aplica a estratégia de divisão e conquista para ordenar um array. Sobre suas características, qual afirmativa é correta?",
    alternatives: [
      { letter: "A", text: "Possui complexidade O(n²) no pior caso, mas O(n log n) no melhor caso." },
      { letter: "B", text: "Possui complexidade O(n log n) em todos os casos (melhor, médio e pior), sendo um algoritmo estável, mas requer O(n) de memória adicional." },
      { letter: "C", text: "Não é estável e possui complexidade O(n log n) no caso médio." },
      { letter: "D", text: "É um algoritmo in-place que não requer memória adicional, com complexidade O(n log n)." },
      { letter: "E", text: "Funciona apenas com arrays de números inteiros." }
    ],
    correctAnswer: "B",
    explanation:
      "O Merge Sort tem as seguintes características:\n- Complexidade de tempo: O(n log n) em TODOS os casos (melhor, médio, pior). Isso ocorre porque sempre divide ao meio e sempre mescla n elementos.\n- Complexidade de espaço: O(n) — requer um array auxiliar para a operação de merge.\n- É estável: elementos iguais mantêm a ordem relativa.\n- Não é in-place (ao contrário do Heap Sort).\n\nA garantia de O(n log n) em todos os casos é a principal vantagem do Merge Sort sobre algoritmos como Quick Sort (que é O(n²) no pior caso)."
  },
  {
    id: "algo_programacaodinamica_006",
    topic: "Algoritmos e Estruturas de Dados",
    macroarea: "Algoritmos",
    element: "Programação dinâmica",
    difficulty: "difícil" as const,
    statement:
      "Um sistema precisa calcular o número mínimo de moedas necessárias para formar um valor V, dado um conjunto de moedas com denominações D = {1, 5, 10, 25}. Se V = 63, utilizando programação dinâmica, qual é o número mínimo de moedas?",
    alternatives: [
      { letter: "A", text: "5 moedas (25 + 25 + 10 + 1 + 1 + 1)" },
      { letter: "B", text: "6 moedas (25 + 25 + 10 + 1 + 1 + 1)" },
      { letter: "C", text: "7 moedas (25 + 10 + 10 + 10 + 5 + 1 + 1 + 1)" },
      { letter: "D", text: "4 moedas (25 + 25 + 10 + 3, impossível pois não há moeda de 3)" },
      { letter: "E", text: "3 moedas (25 + 25 + 13, impossível pois não há moeda de 13)" }
    ],
    correctAnswer: "B",
    explanation:
      "Aplicando programação dinâmica para o problema da troca de moedas:\n\ndp[i] = mínimo de moedas para formar o valor i\n- dp[0] = 0\n- dp[i] = min(dp[i - d] + 1) para cada d ∈ D onde d ≤ i\n\nCalculando:\n- dp[63] = min(dp[62]+1, dp[58]+1, dp[53]+1, dp[38]+1)\n\nResolução: 63 = 25 + 25 + 10 + 1 + 1 + 1 = 6 moedas\nOu: 63 = 25 + 25 + 5 + 5 + 1 + 1 + 1 = 7 moedas\nOu: 63 = 25 + 10 + 10 + 10 + 5 + 1 + 1 + 1 = 8 moedas\n\nO mínimo é 6 moedas: 25 + 25 + 10 + 1 + 1 + 1 = 63."
  },
  {
    id: "algo_algoritmosgulosos_007",
    topic: "Algoritmos e Estruturas de Dados",
    macroarea: "Algoritmos",
    element: "Algoritmos gulosos",
    difficulty: "médio" as const,
    statement:
      "O algoritmo de Dijkstra para encontrar o caminho mais curto em um grafo com pesos não negativos utiliza uma estratégia gulosa. Em cada passo, o algoritmo seleciona o vértice com qual propriedade?",
    alternatives: [
      { letter: "A", text: "O vértice com o maior grau." },
      { letter: "B", text: "O vértice com a menor distância estimada a partir da fonte, que ainda não foi processado." },
      { letter: "C", text: "O vértice mais distante da fonte para garantir que todos os caminhos intermediários já foram explorados." },
      { letter: "D", text: "O vértice com o menor número de arestas até a fonte." },
      { letter: "E", text: "Qualquer vértice não processado, pois a ordem não afeta o resultado." }
    ],
    correctAnswer: "B",
    explanation:
      "O algoritmo de Dijkstra seleciona greedy o vértice não processado com a menor distância estimada (tentativa de menor custo) a partir do vértice fonte. A propriedade fundamental é que, uma vez que um vértice é processado (removido do conjunto de prioridade), sua distância final já está determinada — nenhuma atualização futura a reduzirá.\n\nIsso só é garantido para grafos com pesos não negativos. Com pesos negativos, o algoritmo falha, sendo necessário usar o algoritmo de Bellman-Ford."
  },
  {
    id: "algo_estruturasdados_008",
    topic: "Algoritmos e Estruturas de Dados",
    macroarea: "Algoritmos",
    element: "Estruturas de dados",
    difficulty: "fácil" as const,
    statement:
      "Uma aplicação web precisa gerenciar uma fila de processamento de tarefas onde as tarefas devem ser atendidas na ordem em que chegaram (FIFO - First In, First Out). Qual estrutura de dados é mais adequada?",
    alternatives: [
      { letter: "A", text: "Pilha (Stack) — LIFO" },
      { letter: "B", text: "Fila (Queue) — FIFO" },
      { letter: "C", text: "Árvore Binária de Busca (BST)" },
      { letter: "D", text: "Tabela Hash (Hash Table)" },
      { letter: "E", text: "Lista Duplamente Encadeada com acesso aleatório" }
    ],
    correctAnswer: "B",
    explanation:
      "A estrutura Fila (Queue) implementa o princípio FIFO (First In, First Out):\n- enqueue(tarefa): adiciona ao final da fila — O(1)\n- dequeue(): remove do início da fila — O(1)\n- front/peek: consulta o próximo elemento sem remover — O(1)\n\nA Pilha (A) seria LIFO (último a entrar, primeiro a sair). A BST (C) é para busca ordenada. A Tabela Hash (D) é para acesso por chave. A Lista Encadeada (E) poderia implementar uma fila, mas a estrutura abstrata 'Fila' é a resposta conceitual correta."
  },
  {
    id: "algo_grafosalgoritmos_009",
    topic: "Algoritmos e Estruturas de Dados",
    macroarea: "Algoritmos",
    element: "Grafos (algoritmos)",
    difficulty: "difícil" as const,
    statement:
      "Sobre o algoritmo de Kruskal para encontrar a Árvore Geradora Mínima (AGM) de um grafo conectado não direcionado com pesos, qual afirmação é correta?",
    alternatives: [
      { letter: "A", text: "O algoritmo inicia a partir de um vértice e sempre escolhe a aresta de menor peso conectada à árvore em construção, como no algoritmo de Prim." },
      { letter: "B", text: "O algoritmo ordena todas as arestas por peso e, iterativamente, adiciona a aresta de menor peso que não forma um ciclo, utilizando a estrutura Union-Find para detecção de ciclos." },
      { letter: "C", text: "O algoritmo de Kruskal não funciona com grafos desconexos, apenas com grafos completos." },
      { letter: "D", text: "O algoritmo possui complexidade O(V²), sendo mais eficiente que o algoritmo de Prim para grafos densos." },
      { letter: "E", text: "O algoritmo pode produzir ciclos na árvore resultante se existirem arestas com pesos iguais." }
    ],
    correctAnswer: "B",
    explanation:
      "O algoritmo de Kruskal funciona da seguinte forma:\n1. Ordenar todas as arestas por peso (menor para maior) — O(E log E)\n2. Para cada aresta na ordem: se ela conectar dois componentes diferentes (não formar ciclo), adicioná-la à AGM\n3. Usar Union-Find para gerenciar componentes e detectar ciclos eficientemente\n\nComplexidade: O(E log E) com Union-Find com compressão de caminho e união por rank.\n\nDiferença de Prim: Prim cresce a partir de um vértice (crescimento conectado); Kruskal cresce por arestas em qualquer lugar (pode criar floresta antes de conectar). Kruskal é mais eficiente para grafos esparsos; Prim é melhor para grafos densos."
  },
  {
    id: "algo_analisecasos_010",
    topic: "Algoritmos e Estruturas de Dados",
    macroarea: "Algoritmos",
    element: "Análise de casos",
    difficulty: "médio" as const,
    statement:
      "O algoritmo Quick Sort, com a escolha do pivô como o primeiro elemento do array, possui diferentes comportamentos dependendo da disposição dos dados. Qual é a complexidade de tempo no pior caso e qual situação a provoca?",
    alternatives: [
      { letter: "A", text: "O(n) no pior caso, quando o array já está ordenado e o pivô é sempre o menor elemento." },
      { letter: "B", text: "O(n log n) no pior caso, que ocorre quando o array está em ordem aleatória." },
      { letter: "C", text: "O(n²) no pior caso, que ocorre quando o array já está ordenado (ou em ordem inversa) e o pivô é sempre o primeiro elemento, gerando partições extremamente desbalanceadas." },
      { letter: "D", text: "O(2ⁿ) no pior caso, quando todas as partições resultam em subarrays de tamanho 1." },
      { letter: "E", text: "O(n²) no pior caso, que ocorre quando o array está em ordem aleatória." }
    ],
    correctAnswer: "C",
    explanation:
      "No Quick Sort com pivô como primeiro elemento:\n- Melhor caso: O(n log n) — quando o pivô divide o array em duas metades iguais\n- Caso médio: O(n log n) — para entradas aleatórias\n- Pior caso: O(n²) — quando o pivô é sempre o menor ou maior elemento\n\nO pior caso ocorre quando o array já está ordenado (ou em ordem inversa). Se o pivô é o primeiro elemento e o array está ordenado, cada partição resulta em um subarray de tamanho n-1 e outro de tamanho 0. Isso gera n partições, com custos de n + (n-1) + (n-2) + ... + 1 = n(n+1)/2 = O(n²).\n\nSoluções: escolher pivô aleatório, mediana de três, ou usar Introsort (Quick Sort que muda para Heap Sort quando detecta degradação)."
  },

  // =============================================================================
  // MICROAREA 5: PROGRAMAÇÃO ORIENTADA A OBJETOS (10 questões)
  // =============================================================================
  {
    id: "poo_classeobjeto_001",
    topic: "Programação Orientada a Objetos",
    macroarea: "Paradigmas de Programação",
    element: "Classe e objeto",
    difficulty: "fácil" as const,
    statement:
      "Em um sistema de e-commerce, foi definida a classe 'Produto' com atributos nome, preço e quantidadeEmEstoque. Qual afirmação descreve corretamente a relação entre classe e objeto nesse contexto?",
    alternatives: [
      { letter: "A", text: "A classe é uma instância específica do objeto Produto, com valores definidos." },
      { letter: "B", text: "A classe Produto é um template (molde) que define a estrutura e comportamento, enquanto objetos como 'Notebook Gamer, R$ 5.000, 15 unidades' são instâncias concretas dessa classe." },
      { letter: "C", text: "Objetos e classes são a mesma coisa em POO, apenas com nomes diferentes." },
      { letter: "D", text: "Um objeto define as regras e a classe armazena os dados." },
      { letter: "E", text: "Cada classe pode ter apenas um objeto associado (relação um-para-um)." }
    ],
    correctAnswer: "B",
    explanation:
      "Em POO, uma CLASSE é um modelo/molde que define:\n- Atributos (dados/estado): nome, preço, quantidadeEmEstoque\n- Métodos (comportamento): calcularDesconto(), atualizarEstoque(), etc.\n\nUm OBJETO é uma instância concreta da classe, com valores específicos:\n- notebook = new Produto('Notebook Gamer', 5000, 15)\n- mouse = new Produto('Mouse Wireless', 150, 200)\n\nA classe define 'o que é' um Produto; os objetos são Produtos específicos com dados concretos. Uma classe pode gerar infinitos objetos."
  },
  {
    id: "poo_encapsulamento_002",
    topic: "Programação Orientada a Objetos",
    macroarea: "Paradigmas de Programação",
    element: "Encapsulamento",
    difficulty: "médio" as const,
    statement:
      "Considere a seguinte classe em Java:\n\n```java\npublic class ContaBancaria {\n    private double saldo;\n    \n    public void depositar(double valor) {\n        if (valor > 0) {\n            saldo += valor;\n        }\n    }\n    \n    public void sacar(double valor) {\n        if (valor > 0 && saldo >= valor) {\n            saldo -= valor;\n        }\n    }\n    \n    public double getSaldo() {\n        return saldo;\n    }\n}\n```\n\nQual princípio de POO essa implementação ilustra e qual é o seu benefício principal?",
    alternatives: [
      { letter: "A", text: "Herança — permite criar subclasses como ContaPoupança e ContaCorrente." },
      { letter: "B", text: "Encapsulamento — os dados (saldo) são protegidos por modificadores private, e o acesso é controlado por métodos públicos que validam as operações, impedindo valores inconsistentes." },
      { letter: "C", text: "Polimorfismo — os métodos podem se comportar de formas diferentes dependendo do contexto." },
      { letter: "D", text: "Abstração — oculta a complexidade do sistema bancário do usuário final." },
      { letter: "E", text: "Composição — a classe ContaBancaria é composta por outros objetos menores." }
    ],
    correctAnswer: "B",
    explanation:
      "O encapsulamento é demonstrado por:\n1. Atributo 'saldo' declarado como private — inacessível diretamente de fora da classe\n2. Métodos públicos (depositar, sacar, getSaldo) como interface controlada\n3. Validações nos métodos: depositar só aceita valores positivos; sacar verifica se há saldo suficiente\n\nBenefícios:\n- Integridade dos dados: impossível definir saldo negativo diretamente\n- Flexibilidade: a implementação interna pode mudar sem afetar quem usa a classe\n- Controle: toda modificação passa pelos métodos com validação\n\nSem encapsulamento, um código externo poderia fazer conta.saldo = -1000 diretamente."
  },
  {
    id: "poo_heranca_003",
    topic: "Programação Orientada a Objetos",
    macroarea: "Paradigmas de Programação",
    element: "Herança",
    difficulty: "médio" as const,
    statement:
      "Considere a hierarquia de classes em Java:\n\n```java\nclass Veiculo { void mover() { System.out.println('Veículo movendo'); } }\nclass Carro extends Veiculo { void mover() { System.out.println('Carro dirigindo'); } }\nclass Eletrico extends Carro { void mover() { System.out.println('Carro elétrico silencioso'); } }\n```\n\nQual é a saída do código: `Veiculo v = new Eletrico(); v.mover();`?",
    alternatives: [
      { letter: "A", text: "'Veículo movendo' — pois o tipo da variável é Veiculo." },
      { letter: "B", text: "'Carro dirigindo' — pois o tipo da variável é Veiculo mas o objeto é Carro." },
      { letter: "C", text: "'Carro elétrico silencioso' — pois o método sobrescrito é selecionado com base no tipo real do objeto (Eletrico) em tempo de execução." },
      { letter: "D", text: "Erro de compilação, pois Veiculo não pode referenciar objetos do tipo Eletrico." },
      { letter: "E", text: "Erro em tempo de execução (ClassCastException)." }
    ],
    correctAnswer: "C",
    explanation:
      "Este é um exemplo de polimorfismo por subtipagem combinado com herança:\n\n1. A variável 'v' é declarada como tipo Veiculo (superclasse)\n2. O objeto instanciado é Eletrico (subclasse mais específica)\n3. Quando v.mover() é chamado, a JVM usa dynamic dispatch (vinculação dinâmica)\n4. O método executado é o da classe real do objeto: Eletrico.mover()\n\nSaída: 'Carro elétrico silencioso'\n\nO tipo da variável (Veiculo) determina quais métodos podem ser chamados em tempo de compilação, mas o tipo real do objeto (Eletrico) determina qual implementação é executada em tempo de execução."
  },
  {
    id: "poo_polimorfismo_004",
    topic: "Programação Orientada a Objetos",
    macroarea: "Paradigmas de Programação",
    element: "Polimorfismo",
    difficulty: "difícil" as const,
    statement:
      "Sobre polimorfismo em Orientação a Objetos, considere as seguintes afirmações:\n\nI. Polimorfismo de sobrecarga (overloading) é resolvido em tempo de compilação.\nII. Polimorfismo de sobrescrita (overriding) é resolvido em tempo de execução.\nIII. Polimorfismo por subtipagem permite tratar objetos de subclasses como objetos da superclasse.\n\nQuais afirmações são corretas?",
    alternatives: [
      { letter: "A", text: "Apenas I" },
      { letter: "B", text: "Apenas II" },
      { letter: "C", text: "Apenas I e II" },
      { letter: "D", text: "Apenas II e III" },
      { letter: "E", text: "I, II e III" }
    ],
    correctAnswer: "E",
    explanation:
      "Todas as três afirmações são corretas:\n\nI. **CORRETA**: Sobrecarga (overloading) — métodos com mesmo nome e parâmetros diferentes na mesma classe. A resolução é em tempo de compilação (static/early binding). Ex: calcularArea(int r) vs calcularArea(int l, int a).\n\nII. **CORRETA**: Sobrescrita (overriding) — método na subclasse com mesma assinatura do método da superclasse. A resolução é em tempo de execução (dynamic/late binding) via virtual method table (vtable).\n\nIII. **CORRETA**: Polimorfismo por subtipagem — uma variável do tipo superclasse pode referenciar objetos de qualquer subclasse. Ex: Animal a = new Cachorro(). O compilador verifica a compatibilidade de tipos; a JVM seleciona o método correto."
  },
  {
    id: "poo_abstracao_005",
    topic: "Programação Orientada a Objetos",
    macroarea: "Paradigmas de Programação",
    element: "Abstração",
    difficulty: "fácil" as const,
    statement:
      "Em um sistema de gerenciamento de uma biblioteca digital, a classe abstrata 'Publicacao' define os métodos abstratos 'obterResumo()' e 'calcularMulta(int diasAtraso)', que devem ser implementados pelas subclasses 'Livro', 'Revista' e 'Artigo'. Qual é o propósito principal de definir uma classe abstrata nesse cenário?",
    alternatives: [
      { letter: "A", text: "Garantir que nenhum objeto do tipo Publicacao possa ser instanciado diretamente, forcing a criação de subclasses concretas com comportamentos específicos." },
      { letter: "B", text: "Permitir herança múltipla, pois classes abstratas podem ser estendidas por várias classes ao mesmo tempo." },
      { letter: "C", text: "Melhorar o desempenho do sistema, pois classes abstratas são otimizadas pelo compilador." },
      { letter: "D", text: "Eliminar a necessidade de encapsulamento, já que classes abstratas não podem ter atributos privados." },
      { letter: "E", text: "Garantir que todos os métodos sejam estáticos e pertencentes à classe, não aos objetos." }
    ],
    correctAnswer: "A",
    explanation:
      "Uma classe abstrata serve como um contrato e modelo:\n1. **Não pode ser instanciada**: new Publicacao() é um erro de compilação\n2. **Define contratos**: métodos abstratos obrigam subclasses a fornecer implementação\n3. **Código compartilhado**: pode conter métodos concretos que as subclasses herdam\n4. **Polimorfismo**: Publicacao p = new Livro() é válido\n\nNo exemplo:\n- Livro, Revista e Artigo DEVE implementar obterResumo() e calcularMulta()\n- Cada um tem sua própria lógica: multa de livro difere de multa de revista\n- O sistema pode iterar sobre uma lista de Publicacoes chamando os métodos polimórficos\n\n(B) é falsa: Java não suporta herança múltipla de classes."
  },
  {
    id: "poo_interfacevsabstrata_006",
    topic: "Programação Orientada a Objetos",
    macroarea: "Paradigmas de Programação",
    element: "Interface vs classe abstrata",
    difficulty: "médio" as const,
    statement:
      "Em Java, um desenvolvedor precisa definir um contrato para 'imprimível' que pode ser aplicado a qualquer classe (Documento, Imagem, Relatório), e outro contrato para 'veículo motorizado' que compartilha lógica comum (combustível, velocidade). Qual combinação é mais adequada?",
    alternatives: [
      { letter: "A", text: "Ambos como classes abstratas, pois são conceitos abstratos." },
      { letter: "B", text: "'Imprimível' como interface (contrato puro sem implementação) e 'VeiculoMotorizado' como classe abstrata (com lógica comum compartilhada entre subclasses)." },
      { letter: "C", text: "'Imprimível' como classe abstrata e 'VeiculoMotorizado' como interface." },
      { letter: "D", text: "Ambos como interfaces, pois não serão instanciados diretamente." },
      { letter: "E", text: "Nenhum dos dois deve ser abstrato; ambos devem ser classes concretas com métodos padrão." }
    ],
    correctAnswer: "B",
    explanation:
      "A escolha entre interface e classe abstrata segue o princípio:\n\n**Interface** (Imprimível):\n- Define um contrato SEM implementação\n- Pode ser implementada por QUALQUER classe, independentemente de sua hierarquia\n- Uma classe pode implementar MÚLTIPLAS interfaces\n- Ideal para 'capacidades' ou 'comportamentos': Serializable, Comparable, Imprimível\n\n**Classe abstrata** (VeiculoMotorizado):\n- Pode conter atributos (combustivel, velocidade) e métodos implementados\n- Define uma relação 'é um' forte (hierarquia)\n- Uma classe só pode estender UMA classe (herança simples)\n- Ideal para compartilhar código entre classes relacionadas (Carro, Moto, Caminhão)\n\nPortanto, Imprimível = interface (comportamento transversal), VeiculoMotorizado = classe abstrata (hierarquia com lógica compartilhada)."
  },
  {
    id: "poo_sobrecargasobrescrita_007",
    topic: "Programação Orientada a Objetos",
    macroarea: "Paradigmas de Programação",
    element: "Sobrecarga e sobrescrita",
    difficulty: "médio" as const,
    statement:
      "Considere o seguinte código Java:\n\n```java\nclass Calculadora {\n    public int somar(int a, int b) { return a + b; }\n    public double somar(double a, double b) { return a + b; }\n    public int somar(int a, int b, int c) { return a + b + c; }\n}\n```\n\nQual conceito de POO é demonstrado nesse código?",
    alternatives: [
      { letter: "A", text: "Sobrescrita (overriding) — métodos da subclasse redefinem métodos da superclasse." },
      { letter: "B", text: "Sobrecarga (overloading) — métodos com mesmo nome mas listas de parâmetros diferentes na mesma classe." },
      { letter: "C", text: "Polimorfismo de subtipagem — objetos de diferentes classes respondem ao mesmo método." },
      { letter: "D", text: "Encapsulamento — proteção dos dados internos da classe." },
      { letter: "E", text: "Abstração — definição de métodos sem implementação." }
    ],
    correctAnswer: "B",
    explanation:
      "A sobrecarga (overloading) é caracterizada por:\n- Mesmo nome de método (somar)\n- Lista de parâmetros DIFERENTE (tipo e/ou quantidade)\n- Mesma classe (ou subclasse)\n- Resolução em tempo de COMPILAÇÃO\n\nNo exemplo, há 3 versões de 'somar':\n1. somar(int, int) — dois inteiros\n2. somar(double, double) — dois doubles\n3. somar(int, int, int) — três inteiros\n\nO compilador decide qual versão chamar com base nos argumentos passados:\n- calculadora.somar(3, 5) → versão 1\n- calculadora.somar(3.0, 5.0) → versão 2\n- calculadora.somar(1, 2, 3) → versão 3\n\nDiferença da sobrescrita (overriding): subclasses redefinem método com MESMA assinatura."
  },
  {
    id: "poo_padroesprojeto_008",
    topic: "Programação Orientada a Objetos",
    macroarea: "Paradigmas de Programação",
    element: "Padrões de projeto",
    difficulty: "médio" as const,
    statement:
      "Uma aplicação precisa gerenciar a conexão com um banco de dados, garantindo que exista apenas uma instância da classe de conexão durante toda a execução do programa, compartilhada entre todos os módulos. Qual padrão de projeto é mais adequado para esse cenário?",
    alternatives: [
      { letter: "A", text: "Factory Method — para criar diferentes tipos de conexões de banco de dados." },
      { letter: "B", text: "Observer — para notificar módulos quando a conexão for estabelecida." },
      { letter: "C", text: "Singleton — para garantir uma única instância global da conexão com ponto de acesso controlado." },
      { letter: "D", text: "Strategy — para alternar entre diferentes estratégias de conexão." },
      { letter: "E", text: "Decorator — para adicionar funcionalidades extras à conexão." }
    ],
    correctAnswer: "C",
    explanation:
      "O padrão **Singleton** garante:\n1. Uma única instância da classe\n2. Ponto de acesso global a essa instância\n\nImplementação típica:\n```java\npublic class ConexaoBD {\n    private static ConexaoBD instancia;\n    private ConexaoBD() { /* construtor private */ }\n    public static ConexaoBD getInstancia() {\n        if (instancia == null) {\n            instancia = new ConexaoBD();\n        }\n        return instancia;\n    }\n}\n```\n\nOs outros padrões:\n- Factory Method (A): cria objetos sem especificar a classe exata\n- Observer (B): notificação um-para-muitos\n- Strategy (D): algoritmos intercambiáveis\n- Decorator (E): adiciona responsabilidades dinamicamente"
  },
  {
    id: "poo_uml_009",
    topic: "Programação Orientada a Objetos",
    macroarea: "Paradigmas de Programação",
    element: "UML",
    difficulty: "fácil" as const,
    statement:
      "Em um diagrama de classes UML, uma seta contínua com um triângulo vazado apontando de 'Gerente' para 'Funcionario' representa qual tipo de relação?",
    alternatives: [
      { letter: "A", text: "Associação — os objetos interagem mas são independentes." },
      { letter: "B", text: "Dependência — uma classe utiliza temporariamente outra." },
      { letter: "C", text: "Generalização/Especialização (herança) — Gerente é um tipo especializado de Funcionario." },
      { letter: "D", text: "Composição — Gerente é composto por Funcionario e não pode existir sem ele." },
      { letter: "E", text: "Agregação — Gerente agrega Funcionarios de forma fraca." }
    ],
    correctAnswer: "C",
    explanation:
      "No UML, os tipos de relações e suas notações:\n\n- **Generalização (Herança)**: seta contínua com triângulo vazado ▷—\n  'Gerente' ▷— 'Funcionario': Gerente herda de Funcionario (é um)\n\n- **Associação**: seta contínua simples →\n  Objects interagem mas são independentes\n\n- **Dependência**: seta tracejada com seta aberta ⟶\n  Uso temporário\n\n- **Composição**: linha contínua com losango preenchido ◆—\n  Relação forte (todo-parte); parte não existe sem o todo\n\n- **Agregação**: linha contínua com losango vazio ◇—\n  Relação fraca (todo-parte); parte pode existir independentemente\n\n- **Implementação**: seta tracejada com triângulo vazado (interface)"
  },
  {
    id: "poo_excecoes_010",
    topic: "Programação Orientada a Objetos",
    macroarea: "Paradigmas de Programação",
    element: "Tratamento de exceções",
    difficulty: "difícil" as const,
    statement:
      "Considere o seguinte código Java:\n\n```java\npublic void processarDados(String[] dados) {\n    try {\n        for (int i = 0; i <= dados.length; i++) {\n            System.out.println(dados[i]);\n        }\n    } catch (ArrayIndexOutOfBoundsException e) {\n        System.out.println('Índice inválido: ' + e.getMessage());\n    } catch (NullPointerException e) {\n        System.out.println('Array nulo!');\n    } catch (Exception e) {\n        System.out.println('Erro geral: ' + e.getMessage());\n    } finally {\n        System.out.println('Processamento finalizado');\n    }\n}\n```\n\nSe processarDados(new String[]{\"A\", \"B\"}) for chamado, qual será a saída?",
    alternatives: [
      { letter: "A", text: "'A' e 'B' apenas — nenhum erro ocorre." },
      { letter: "B", text: "'A', 'B' e 'Processamento finalizado' — o loop para corretamente em i=2 sem erro." },
      { letter: "C", text: "'A', 'B', 'Índice inválido' e 'Processamento finalizado' — o erro ocorre quando i=2, que excede o limite do array." },
      { letter: "D", text: "'Erro geral' e 'Processamento finalizado' — o catch genérico captura tudo." },
      { letter: "E", text: "'A', 'B' e o programa entra em loop infinito." }
    ],
    correctAnswer: "C",
    explanation:
      "Analisando a execução:\n\nO array dados = {'A', 'B'} tem comprimento 2 (índices válidos: 0 e 1).\n\nO loop vai de i=0 até i <= dados.length (i <= 2), ou seja, i = 0, 1, 2:\n- i=0: dados[0] = 'A' ✓ (impresso)\n- i=1: dados[1] = 'B' ✓ (impresso)\n- i=2: dados[2] → ArrayIndexOutOfBoundsException! O array tem índices 0 e 1 apenas.\n\nO catch(ArrayIndexOutOfBoundsException) captura o erro e imprime 'Índice inválido'.\nO bloco finally SEMPRE executa, imprimindo 'Processamento finalizado'.\n\nSaída completa: 'A', 'B', 'Índice inválido: ...', 'Processamento finalizado'.\n\nO erro está no loop: deveria ser i < dados.length (não i <= dados.length). O bloco finally é útil para liberar recursos independentemente de sucesso ou erro."
  }
];

// Summary statistics
export const batchStats = {
  totalQuestions: questionsBatch1.length,
  byMacroarea: {
    "Fundamentos da Computação": questionsBatch1.filter(q => q.macroarea === "Fundamentos da Computação").length,
    "Teoria da Computação": questionsBatch1.filter(q => q.macroarea === "Teoria da Computação").length,
    "Algoritmos": questionsBatch1.filter(q => q.macroarea === "Algoritmos").length,
    "Paradigmas de Programação": questionsBatch1.filter(q => q.macroarea === "Paradigmas de Programação").length,
  },
  byDifficulty: {
    fácil: questionsBatch1.filter(q => q.difficulty === "fácil").length,
    médio: questionsBatch1.filter(q => q.difficulty === "médio").length,
    difícil: questionsBatch1.filter(q => q.difficulty === "difícil").length,
  },
};
