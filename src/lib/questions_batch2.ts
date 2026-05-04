export interface EnadeQuestion {
  id: string;
  topic: string;
  macroarea: string;
  element: string;
  difficulty: 'fácil' | 'médio' | 'difícil';
  statement: string;
  alternatives: { letter: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

export const questionsBatch2: EnadeQuestion[] = [
  // =====================================================
  // MICROAREA 6: BANCO DE DADOS (9 questões)
  // Elementos: Modelo relacional, Álgebra relacional, SQL,
  //   Normalização, Chaves, Transações e ACID, Índices,
  //   Modelo ER, NoSQL, Stored procedures e triggers
  // =====================================================

  // --- Modelo relacional (fácil) ---
  {
    id: "bd_modelo_rel_001",
    topic: "Banco de Dados",
    macroarea: "Desenvolvimento",
    element: "Modelo relacional",
    difficulty: "fácil" as const,
    statement:
      "Uma empresa de logística precisa modelar seu banco de dados relacional. O analista identificou as entidades Funcionário (matricula, nome, cargo) e Departamento (codigo, nome, localizacao), onde cada funcionário trabalha em exatamente um departamento. Qual das alternativas representa corretamente o esquema relacional resultante?",
    alternatives: [
      { letter: "A", text: "Funcionário(matricula, nome, cargo, codigo_departamento) e Departamento(codigo, nome, localizacao, matricula_funcionario)" },
      { letter: "B", text: "Funcionário(matricula, nome, cargo, codigo_departamento) e Departamento(codigo, nome, localizacao), sendo codigo_departamento chave estrangeira em Funcionário referenciando Departamento." },
      { letter: "C", text: "Uma única tabela FuncionarioDepartamento(matricula, nome, cargo, codigo, nome_dep, localizacao) para evitar joins." },
      { letter: "D", text: "Funcionário(matricula, nome, cargo) e Departamento(codigo, nome, localizacao), sem nenhuma chave estrangeira, pois os dados são independentes." },
      { letter: "E", text: "Funcionário(matricula, nome, cargo, codigo) e Departamento(codigo, nome, localizacao), sendo codigo chave primária em ambas as tabelas." },
    ],
    correctAnswer: "B",
    explanation:
      "O relacionamento 1:N entre Departamento e Funcionário é implementado adicionando a chave primária do lado '1' (Departamento) como chave estrangeira no lado 'N' (Funcionário). Assim, codigo_departamento em Funcionário referencia codigo em Departamento, mantendo a integridade referencial.",
  },

  // --- Álgebra relacional (difícil) ---
  {
    id: "bd_algebra_rel_001",
    topic: "Banco de Dados",
    macroarea: "Desenvolvimento",
    element: "Álgebra relacional",
    difficulty: "difícil" as const,
    statement:
      "Considere as relações R(A, B) e S(B, C). A expressão de álgebra relacional π_{A}(R ⨝_{R.B = S.B} σ_{C > 10}(S)) retorna quais dados?",
    alternatives: [
      { letter: "A", text: "Todos os valores de A de R que estão relacionados com tuplas de S onde C > 10, considerando apenas as tuplas com correspondência no join." },
      { letter: "B", text: "Todos os valores de A e C onde B é igual em ambas as relações e C > 10." },
      { letter: "C", text: "O produto cartesiano de R e S filtrado por C > 10, projetando apenas A." },
      { letter: "D", text: "A diferença entre R e S, retornando apenas valores de A ausentes em S." },
      { letter: "E", text: "A união de R e S, filtrada por C > 10 e projetada em A." },
    ],
    correctAnswer: "A",
    explanation:
      "A expressão segue a ordem de avaliação: (1) σ_{C>10}(S) seleciona tuplas de S onde C > 10; (2) O join natural ⨝ combina com R onde R.B = S.B (apenas tuplas com correspondência); (3) π_{A} projeta apenas a coluna A do resultado. É equivalente ao SQL: SELECT DISTINCT R.A FROM R INNER JOIN S ON R.B = S.B WHERE S.C > 10.",
  },

  // --- SQL (médio) ---
  {
    id: "bd_sql_001",
    topic: "Banco de Dados",
    macroarea: "Desenvolvimento",
    element: "SQL",
    difficulty: "médio" as const,
    statement:
      "Uma escola precisa listar o nome de todos os professores que ministram aulas em pelo menos duas disciplinas diferentes. O esquema é: Professor(id_prof, nome) e Aula(id_aula, id_prof, id_disciplina). Qual consulta SQL retorna corretamente esse resultado?",
    alternatives: [
      { letter: "A", text: "SELECT nome FROM Professor p WHERE COUNT(SELECT id_disciplina FROM Aula WHERE id_prof = p.id_prof) >= 2;" },
      { letter: "B", text: "SELECT p.nome FROM Professor p INNER JOIN Aula a ON p.id_prof = a.id_prof GROUP BY p.id_prof, p.nome HAVING COUNT(DISTINCT a.id_disciplina) >= 2;" },
      { letter: "C", text: "SELECT nome FROM Professor WHERE id_prof IN (SELECT id_prof FROM Aula GROUP BY id_disciplina HAVING COUNT(*) >= 2);" },
      { letter: "D", text: "SELECT p.nome FROM Professor p, Aula a WHERE p.id_prof = a.id_prof AND COUNT(a.id_disciplina) >= 2;" },
      { letter: "E", text: "SELECT DISTINCT p.nome FROM Professor p JOIN Aula a ON p.id_prof = a.id_prof WHERE a.id_disciplina > 1;" },
    ],
    correctAnswer: "B",
    explanation:
      "A alternativa B utiliza GROUP BY para agrupar as aulas por professor e HAVING COUNT(DISTINCT a.id_disciplina) >= 2 para filtrar apenas os professores com pelo menos duas disciplinas distintas. O DISTINCT dentro do COUNT garante que disciplinas repetidas não sejam contadas múltiplas vezes. A alternativa A tem sintaxe inválida; C agrupa por disciplina em vez de professor; D usa COUNT sem GROUP BY; E verifica apenas id_disciplina > 1, o que não conta o número de disciplinas.",
  },

  // --- Normalização (médio) ---
  {
    id: "bd_norm_001",
    topic: "Banco de Dados",
    macroarea: "Desenvolvimento",
    element: "Normalização",
    difficulty: "médio" as const,
    statement:
      "Uma tabela Venda possui os atributos (num_venda, data_venda, cpf_cliente, nome_cliente, cidade_cliente, cod_produto, descricao_produto, quantidade, preco_unitario, valor_total). Sabe-se que a chave primária é composta por (num_venda, cod_produto). Sobre as formas normais dessa tabela, é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "A tabela está na 2NF, pois todos os atributos não-chave dependem da chave primária composta." },
      { letter: "B", text: "A tabela viola a 2NF, pois existem dependências parciais: nome_cliente depende apenas de cpf_cliente, e descricao_produto depende apenas de cod_produto." },
      { letter: "C", text: "A tabela viola apenas a 3NF, pois cidade_cliente depende transitivamente de num_venda." },
      { letter: "D", text: "A tabela está na 1NF apenas, pois existe um grupo repetitivo nos campos de produto." },
      { letter: "E", text: "A tabela está na BCNF, pois toda dependência funcional tem uma superchave como determinante." },
    ],
    correctAnswer: "B",
    explanation:
      "Com a chave primária composta (num_venda, cod_produto), existem dependências parciais: nome_cliente → cpf_cliente (depende apenas parcialmente, de cpf_cliente que é parte de uma dependência funcional com num_venda); descricao_produto → cod_produto (depende apenas de cod_produto). Essas dependências parciais violam a 2NF. Para normalizar, seriam necessárias tabelas separadas: Cliente(cpf, nome, cidade), Produto(cod, descricao, preco), Venda(num, data, cpf_cliente), ItemVenda(num_venda, cod_produto, quantidade).",
  },

  // --- Chaves (fácil) ---
  {
    id: "bd_chaves_001",
    topic: "Banco de Dados",
    macroarea: "Desenvolvimento",
    element: "Chaves",
    difficulty: "fácil" as const,
    statement:
      "Em um sistema de matrícula acadêmica, a tabela Aluno possui os campos (matricula, cpf, nome, email, data_nascimento). Sabe-se que a matricula é única para cada aluno e o cpf também é único. Sobre o conceito de chaves nesse contexto, é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "Tanto matricula quanto cpf são chaves primárias, pois ambas são únicas." },
      { letter: "B", text: "Apenas matricula pode ser chave primária; cpf é um candidato a chave primária, mas deve ser escolhida apenas uma." },
      { letter: "C", text: "Uma chave primária deve ser sempre composta por mais de um atributo para garantir unicidade." },
      { letter: "D", text: "cpf não pode ser candidato a chave primária porque não é um campo numérico sequencial." },
      { letter: "E", text: "A chave primária é obrigatoriamente o campo nome, pois é o mais descritivo." },
    ],
    correctAnswer: "B",
    explanation:
      "Tanto matricula quanto cpf são chaves candidatas, pois cada uma identifica unicamente uma tupla. No entanto, apenas uma é escolhida como chave primária. A escolha depende de critérios práticos: matricula geralmente é preferida por ser mais curta, imutável e não sensível (em comparação com cpf, que é dado pessoal sensível sujeito à LGPD).",
  },

  // --- Transações e ACID (médio) ---
  {
    id: "bd_transacoes_001",
    topic: "Banco de Dados",
    macroarea: "Desenvolvimento",
    element: "Transações e ACID",
    difficulty: "médio" as const,
    statement:
      "Um sistema bancário realiza transferências entre contas. A transação T1 transfere R$ 1.000,00 da conta A para a conta B. Simultaneamente, a transação T2 consulta o saldo total das contas A e B. Em qual nível de isolamento do SQL é possível que T2 observe um saldo total inconsistente (dinheiro desaparecido temporariamente)?",
    alternatives: [
      { letter: "A", text: "Serializable — pois nesse nível as transações são executadas de forma sequencial, garantindo consistência." },
      { letter: "B", text: "Read Committed — pois nesse nível T2 pode ler apenas dados já confirmados, evitando leituras sujas." },
      { letter: "C", text: "Read Uncommitted — pois nesse nível T2 pode ler a conta A após o débito mas antes do crédito na conta B, observando um valor total inconsistente (leitura suja e não repetível)." },
      { letter: "D", text: "Repeatable Read — pois nesse nível T2 sempre verá os mesmos dados durante sua execução." },
      { letter: "E", text: "Nenhum nível de isolamento permite essa situação, pois o banco de dados sempre garante consistência." },
    ],
    correctAnswer: "C",
    explanation:
      "No nível Read Uncommitted, a transação T2 pode ler dados não confirmados (dirty read). Se T1 debitou de A mas ainda não creditou em B, T2 veria o saldo de A reduzido e B inalterado, resultando em um total inconsistente. Nos níveis superiores: Read Committed evita dirty reads; Repeatable Read evita non-repeatable reads; Serializable evita phantom reads, sendo o nível mais restritivo.",
  },

  // --- Índices (médio) ---
  {
    id: "bd_indices_001",
    topic: "Banco de Dados",
    macroarea: "Desenvolvimento",
    element: "Índices",
    difficulty: "médio" as const,
    statement:
      "Um desenvolvedor precisa otimizar uma tabela Pedidos com 5 milhões de registros. As consultas mais frequentes são: (1) busca por numero_pedido (exato), (2) busca por data_pedido em faixas (entre duas datas), (3) busca por cpf_cliente combinada com status. Sobre a estratégia de criação de índices, qual alternativa é mais adequada?",
    alternatives: [
      { letter: "A", text: "Criar um único índice composto (numero_pedido, data_pedido, cpf_cliente, status), pois índices compostos cobrem todas as consultas." },
      { letter: "B", text: "Criar um índice B-tree em numero_pedido (para busca exata), um índice B-tree em data_pedido (para range queries) e um índice composto (cpf_cliente, status) seguindo o princípio da mais esquerda." },
      { letter: "C", text: "Criar índices hash em todas as colunas, pois são mais rápidos que B-tree para qualquer tipo de consulta." },
      { letter: "D", text: "Não criar nenhum índice, pois 5 milhões de registros é um volume pequeno e o SGBD fará table scan efficiently." },
      { letter: "E", text: "Criar índice apenas em cpf_cliente, pois é a coluna mais seletiva da tabela." },
    ],
    correctAnswer: "B",
    explanation:
      "A estratégia ideal envolve: (1) índice B-tree em numero_pedido (chave primária, busca pontual O(log n)); (2) índice B-tree em data_pedido para range queries (B-tree suporta BETWEEN, <, >); (3) índice composto (cpf_cliente, status) — o princípio da mais esquerda permite consultas por cpf_cliente sozinho ou cpf_cliente + status. Índices hash são ruins para range queries. Um único índice composto não é eficiente se as consultas iniciam por colunas diferentes.",
  },

  // --- Modelo ER (difícil) ---
  {
    id: "bd_modelo_er_001",
    topic: "Banco de Dados",
    macroarea: "Desenvolvimento",
    element: "Modelo ER",
    difficulty: "difícil" as const,
    statement:
      "No modelo Entidade-Relacionamento de um hospital, tem-se as entidades Médico (CRM, nome, especialidade) e Paciente (CPF, nome, data_nasc) com um relacionamento Consulta. Cada consulta é realizada por exatamente um médico para exatamente um paciente em uma data específica, e um paciente pode ter múltiplas consultas com o mesmo médico em datas diferentes. Qual é a cardinalidade correta do relacionamento e sua implementação relacional?",
    alternatives: [
      { letter: "A", text: "Cardinalidade 1:1 entre Médico e Paciente. Implementação com adição de CRM como chave estrangeira na tabela Paciente." },
      { letter: "B", text: "Cardinalidade N:M entre Médico e Paciente. Implementação com tabela associativa Consulta contendo CRM, CPF e data_consulta, sendo (CRM, CPF, data_consulta) a chave primária composta." },
      { letter: "C", text: "Cardinalidade 1:N de Médico para Paciente. Implementação com CPF do paciente na tabela Médico." },
      { letter: "D", text: "Cardinalidade N:1 de Médico para Paciente. Implementação com CRM na tabela Paciente." },
      { letter: "E", text: "Cardinalidade N:M entre Médico e Paciente. Implementação com tabela associativa Consulta contendo apenas CRM e CPF como chave primária composta." },
    ],
    correctAnswer: "B",
    explanation:
      "O relacionamento é N:M porque um médico pode atender múltiplos pacientes e um paciente pode consultar múltiplos médicos. A tabela associativa (Consulta) precisa armazenar além das chaves estrangeiras (CRM, CPF) o atributo data_consulta, pois o mesmo par médico-paciente pode ter múltiplas consultas em datas diferentes. A chave primária composta (CRM, CPF, data_consulta) garante unicidade de cada consulta.",
  },

  // --- NoSQL (médio) ---
  {
    id: "bd_nosql_001",
    topic: "Banco de Dados",
    macroarea: "Desenvolvimento",
    element: "NoSQL",
    difficulty: "médio" as const,
    statement:
      "Uma startup de redes sociais precisa armazenar perfis de usuários com campos variáveis (alguns usuários têm telefone, outros têm Instagram, outros têm linkedin). O sistema exige alta disponibilidade e escalabilidade horizontal para milhões de usuários. Qual tipo de banco de dados NoSQL é mais adequado para esse cenário?",
    alternatives: [
      { letter: "A", text: "Banco de dados orientado a grafos (ex: Neo4j), pois são ideais para armazenar perfis com relacionamentos complexos." },
      { letter: "B", text: "Banco de dados orientado a colunas (ex: Cassandra), pois são otimizados para consultas analíticas em grandes volumes." },
      { letter: "C", text: "Banco de dados de documentos (ex: MongoDB), pois permite esquemas flexíveis com documentos JSON/BSON de estrutura variável, suporta escalabilidade horizontal e alta disponibilidade." },
      { letter: "D", text: "Banco de dados chave-valor (ex: Redis), pois oferece a maior velocidade para leitura e escrita de perfis completos." },
      { letter: "E", text: "Um banco relacional com tabelas dinâmicas, pois a consistência ACID é sempre obrigatória." },
    ],
    correctAnswer: "C",
    explanation:
      "Bancos de documentos como MongoDB são ideais para esse cenário porque: (1) esquemas flexíveis permitem documentos com campos diferentes sem necessidade de ALTER TABLE; (2) suportam escalabilidade horizontal via sharding; (3) oferecem alta disponibilidade com replica sets; (4) o formato JSON/BSON mapeia naturalmente para dados de perfil. Grafos seriam ideais para relações complexas; colunas para análise de big data; chave-valor para cache/sessões.",
  },

  // --- Stored procedures e triggers (fácil) ---
  {
    id: "bd_sp_triggers_001",
    topic: "Banco de Dados",
    macroarea: "Desenvolvimento",
    element: "Stored procedures e triggers",
    difficulty: "fácil" as const,
    statement:
      "Uma loja virtual precisa garantir que, sempre que o estoque de um produto for atualizado para um valor abaixo do mínimo configurado, o sistema envie automaticamente um alerta ao setor de compras. Qual mecanismo de banco de dados é mais apropriado para implementar essa regra de negócio?",
    alternatives: [
      { letter: "A", text: "Uma view que filtra produtos com estoque abaixo do mínimo, verificada periodicamente pela aplicação." },
      { letter: "B", text: "Uma stored procedure que é chamada manualmente pelo operador após cada atualização de estoque." },
      { letter: "C", text: "Um trigger AFTER UPDATE na tabela de produtos que, ao detectar que o novo estoque é inferior ao mínimo, insere um registro em uma tabela de alertas ou notifica o setor." },
      { letter: "D", text: "Uma constraint CHECK que impede a atualização do estoque quando o valor for abaixo do mínimo." },
      { letter: "E", text: "Um índice parcial que monitora automaticamente mudanças nos valores de estoque." },
    ],
    correctAnswer: "C",
    explanation:
      "Triggers são procedimentos armazenados que são executados automaticamente em resposta a eventos (INSERT, UPDATE, DELETE) em uma tabela. Um trigger AFTER UPDATE na tabela de produtos pode verificar se o novo valor de estoque < estoque_mínimo e, caso verdadeiro, gerar um alerta. Isso garante que a regra seja aplicada sempre, independentemente de qual aplicação ou usuário atualizar o estoque. Uma constraint CHECK bloquearia a atualização em vez de gerar o alerta.",
  },

  // =====================================================
  // MICROAREA 7: ENGENHARIA DE SOFTWARE (9 questões)
  // Elementos: Modelos de processo, Métodos ágeis, Requisitos,
  //   Casos de uso, Testes, Métricas, Manutenção e refatoração,
  //   Qualidade ISO/IEC 25010, DevOps e CI/CD, Controle de versão
  // =====================================================

  // --- Modelos de processo (médio) ---
  {
    id: "es_modelos_proc_001",
    topic: "Engenharia de Software",
    macroarea: "Desenvolvimento",
    element: "Modelos de processo",
    difficulty: "médio" as const,
    statement:
      "Uma empresa de desenvolvimento de software para aviação precisa criar um sistema crítico de controle de voo em que os requisitos são bem definidos, estáveis e a falha pode causar perda de vidas. Qual modelo de processo de software é mais adequado para esse projeto?",
    alternatives: [
      { letter: "A", text: "Modelo Ágil (Scrum), pois permite entregas rápidas e adaptabilidade a mudanças frequentes nos requisitos." },
      { letter: "B", text: "Modelo em Cascata (Waterfall), pois permite planejamento rigoroso, documentação completa, validação formal em cada fase e é adequado para projetos com requisitos estáveis e críticos à segurança." },
      { letter: "C", text: "Modelo Prototipação, pois permite criar protótipos rápidos para validar ideias com os pilotos." },
      { letter: "D", text: "Modelo Espiral, pois combina iterações com análise de riscos, sendo o mais seguro para projetos críticos." },
      { letter: "E", text: "Modelo Incremental, pois permite entregar partes funcionais do sistema de voo gradualmente." },
    ],
    correctAnswer: "B",
    explanation:
      "O modelo em Cascata é adequado para sistemas críticos (safety-critical) com requisitos estáveis e bem definidos porque: (1) cada fase possui gate reviews rigorosos; (2) a documentação completa é essencial para certificação (ex: padrões DO-178C para aviação); (3) a validação e verificação formais em cada fase reduzem riscos. Modelos ágeis são menos adequados quando requisitos não mudam e a documentação formal é obrigatória.",
  },

  // --- Métodos ágeis (fácil) ---
  {
    id: "es_metodos_ageis_001",
    topic: "Engenharia de Software",
    macroarea: "Desenvolvimento",
    element: "Métodos ágeis",
    difficulty: "fácil" as const,
    statement:
      "Uma equipe de desenvolvimento decidiu adotar o framework Scrum. No planejamento da Sprint, o Product Owner apresentou o Product Backlog priorizado. A equipe selecionou os itens que poderiam ser completados na Sprint de 2 semanas. Qual é o nome do artefato que contém os itens selecionados para a Sprint, juntamente com o plano para entregá-los?",
    alternatives: [
      { letter: "A", text: "Product Backlog" },
      { letter: "B", text: "Sprint Backlog" },
      { letter: "C", text: "Release Backlog" },
      { letter: "D", text: "Burndown Chart" },
      { letter: "E", text: "Impediment Log" },
    ],
    correctAnswer: "B",
    explanation:
      "O Sprint Backlog é o conjunto de itens do Product Backlog selecionados para a Sprint, além do plano para entregar o Incremento do produto e realizar o trabalho necessário. É de propriedade exclusiva dos Developers (time de desenvolvimento). O Product Backlog é a lista completa e priorizada de tudo que é necessário no produto, de propriedade do Product Owner.",
  },

  // --- Requisitos (médio) ---
  {
    id: "es_requisitos_001",
    topic: "Engenharia de Software",
    macroarea: "Desenvolvimento",
    element: "Requisitos",
    difficulty: "médio" as const,
    statement:
      "Analise os seguintes requisitos para um sistema de e-commerce:\nR1: O sistema deve permitir que o cliente adicione produtos ao carrinho.\nR2: O sistema deve carregar a página inicial em menos de 3 segundos.\nR3: O sistema deve calcular automaticamente o frete com base no CEP de destino.\nR4: O sistema deve suportar até 10.000 usuários simultâneos sem degradação perceptível de performance.\nQuais são, respectivamente, exemplos de requisitos funcionais e não funcionais?",
    alternatives: [
      { letter: "A", text: "Funcionais: R1, R2, R3, R4. Não funcionais: nenhum." },
      { letter: "B", text: "Funcionais: R1, R3. Não funcionais: R2, R4." },
      { letter: "C", text: "Funcionais: R1, R2, R4. Não funcionais: R3." },
      { letter: "D", text: "Funcionais: R2, R3. Não funcionais: R1, R4." },
      { letter: "E", text: "Funcionais: R1. Não funcionais: R2, R3, R4." },
    ],
    correctAnswer: "B",
    explanation:
      "Requisitos funcionais (R1, R3) descrevem o que o sistema deve fazer — comportamentos específicos: adicionar ao carrinho e calcular frete. Requisitos não funcionais (R2, R4) descrevem propriedades de qualidade do sistema: R2 é requisito de performance (tempo de resposta); R4 é requisito de escalabilidade/carga. Requisitos não funcionais incluem performance, segurança, usabilidade, confiabilidade, escalabilidade, etc.",
  },

  // --- Casos de uso (médio) ---
  {
    id: "es_casos_uso_001",
    topic: "Engenharia de Software",
    macroarea: "Desenvolvimento",
    element: "Casos de uso",
    difficulty: "médio" as const,
    statement:
      "Em um sistema de biblioteca, foi identificado o caso de uso 'Emprestar Livro'. O bibliotecário verifica a disponibilidade do livro, confere se o usuário não possui multas pendentes e registra o empréstimo. Em determinadas situações, o sistema precisa notificar o usuário quando um livro reservado fica disponível. Qual é a relação UML correta entre 'Emprestar Livro' e 'Notificar Disponibilidade'?",
    alternatives: [
      { letter: "A", text: "«include» — 'Emprestar Livro' inclui obrigatoriamente 'Notificar Disponibilidade' em todas as suas execuções." },
      { letter: "B", text: "«extend» — 'Notificar Disponibilidade' pode estender opcionalmente o fluxo de 'Emprestar Livro' quando um livro reservado é devolvido e fica disponível." },
      { letter: "C", text: "«generalization» — 'Notificar Disponibilidade' é uma especialização de 'Emprestar Livro'." },
      { letter: "D", text: "Associação direta — ambas são casos de uso independentes sem relação UML." },
      { letter: "E", text: "«extend» — 'Emprestar Livro' estende opcionalmente 'Notificar Disponibilidade'." },
    ],
    correctAnswer: "B",
    explanation:
      "A relação «extend» é usada quando um caso de uso opcionalmente estende o comportamento de outro em condições específicas. 'Notificar Disponibilidade' não é parte obrigatória de 'Emprestar Livro' — é acionada apenas quando um livro reservado é devolvido (condição específica). Já «include» seria usado para comportamentos obrigatórios (ex: 'Autenticar Usuário' incluído em vários casos de uso). A direção correta é: 'Notificar Disponibilidade' «extend»→ 'Emprestar Livro'.",
  },

  // --- Testes (difícil) ---
  {
    id: "es_testes_001",
    topic: "Engenharia de Software",
    macroarea: "Desenvolvimento",
    element: "Testes",
    difficulty: "difícil" as const,
    statement:
      "Uma função de software recebe a idade de um cliente e o tipo de cliente ('normal' ou 'vip') para calcular desconto em uma loja. O desconto é: 0% para menores de 18; 10% para 18-59 normal, 15% para 18-59 vip; 20% para 60+ normal, 30% para 60+ vip. Utilizando a técnica de testes de caixa preta por análise de valor limite, quantos casos de teste são necessários para cobrir todas as classes de equivalência e valores limite?",
    alternatives: [
      { letter: "A", text: "4 casos de teste, um para cada faixa etária." },
      { letter: "B", text: "8 casos de teste, cobrindo os limites de cada faixa etária para os dois tipos de cliente." },
      { letter: "C", text: "6 casos de teste, cobrindo as classes de equivalência de idade e tipo de cliente." },
      { letter: "D", text: "12 casos de teste, dois por faixa etária vezes dois tipos." },
      { letter: "E", text: "10 casos de teste, combinando todos os valores limite possíveis." },
    ],
    correctAnswer: "B",
    explanation:
      "As classes de equivalência para idade são: [<18], [18-59], [60+]. Para valor limite, testamos nos limites 17/18 e 59/60, mais um valor representativo de cada classe. Com 2 tipos de cliente (normal, vip), temos: (17, normal), (18, normal), (59, normal), (60, normal), (17, vip), (18, vip), (59, vip), (60, vip) = 8 casos de teste. Isso cobre as fronteiras onde o comportamento muda.",
  },

  // --- Métricas (médio) ---
  {
    id: "es_metricas_001",
    topic: "Engenharia de Software",
    macroarea: "Desenvolvimento",
    element: "Métricas",
    difficulty: "médio" as const,
    statement:
      "Um gerente de projeto precisa avaliar a complexidade de um módulo de software. O módulo contém um método com a seguinte estrutura lógica: um if-else (2 caminhos), um switch-case com 4 casos (4 caminhos), um laço while e um laço for aninhado dentro do while. Utilizando a complexidade ciclomática de McCabe (V(G) = E - N + 2), qual é o valor aproximado da complexidade desse método?",
    alternatives: [
      { letter: "A", text: "5" },
      { letter: "B", text: "7" },
      { letter: "C", text: "9" },
      { letter: "D", text: "11" },
      { letter: "E", text: "3" },
    ],
    correctAnswer: "B",
    explanation:
      "A complexidade ciclomática de McCabe pode ser calculada como V(G) = 1 + número de decisões. Decisões no código: if-else = 1 decisão, switch-case com 4 casos = 3 decisões (n-1 casos adicionais), while = 1 decisão, for aninhado = 1 decisão. Total = 1 + 3 + 1 + 1 = 6 decisões. V(G) = 1 + 6 = 7. Cada estrutura de decisão (if, case, while, for) contribui com +1 ao número de caminhos independentes no fluxo de controle.",
  },

  // --- Manutenção e refatoração (fácil) ---
  {
    id: "es_manutencao_001",
    topic: "Engenharia de Software",
    macroarea: "Desenvolvimento",
    element: "Manutenção e refatoração",
    difficulty: "fácil" as const,
    statement:
      "Uma equipe de manutenção recebeu a tarefa de atualizar o sistema de folha de pagamento de uma empresa para refletir a nova tabela do INSS vigente a partir de 2024. Esse tipo de manutenção é classificado como:",
    alternatives: [
      { letter: "A", text: "Manutenção corretiva — pois corrige um erro na tabela de cálculo do INSS." },
      { letter: "B", text: "Manutenção adaptativa — pois modifica o software para adequá-lo a mudanças no ambiente externo (nova legislação)." },
      { letter: "C", text: "Manutenção perfectiva — pois melhora o desempenho do sistema de folha de pagamento." },
      { letter: "D", text: "Manutenção preventiva — pois previne problemas futuros com a tabela do INSS." },
      { letter: "E", text: "Refatoração — pois reestrutura o código sem alterar seu comportamento funcional." },
    ],
    correctAnswer: "B",
    explanation:
      "Tipos de manutenção de software (IEEE/ISO): Corretiva corrige defeitos; Adaptativa ajusta o software a mudanças no ambiente externo (nova legislação, novo SO, novo hardware); Perfectiva melhora características de qualidade (performance, usabilidade); Preventiva previne problemas futuros (refatoração). A mudança na tabela do INSS é uma alteração no ambiente externo (legislação), classificando-a como manutenção adaptativa.",
  },

  // --- Qualidade ISO/IEC 25010 (médio) ---
  {
    id: "es_qualidade_iso_001",
    topic: "Engenharia de Software",
    macroarea: "Desenvolvimento",
    element: "Qualidade ISO/IEC 25010",
    difficulty: "médio" as const,
    statement:
      "Uma organização está avaliando a qualidade de seu sistema de telemedicina conforme a norma ISO/IEC 25010 (SQuaRE). A equipe identificou que o sistema deve: (i) funcionar 99,9% do tempo; (ii) ser fácil de aprender por médicos idosos; (iii) proteger dados de pacientes contra acessos não autorizados; (iv) permitir integração com diferentes prontuários eletrônicos. Esses requisitos correspondem, respectivamente, a quais características de qualidade da ISO/IEC 25010?",
    alternatives: [
      { letter: "A", text: "Eficiência, Usabilidade, Segurança, Interoperabilidade" },
      { letter: "B", text: "Confiabilidade, Usabilidade, Confidencialidade (Segurança), Compatibilidade" },
      { letter: "C", text: "Disponibilidade, Acessibilidade, Integridade, Portabilidade" },
      { letter: "D", text: "Maturidade, Apreensibilidade, Autenticidade, Modularidade" },
      { letter: "E", text: "Tolerância a falhas, Operabilidade, Não-repúdio, Adaptabilidade" },
    ],
    correctAnswer: "B",
    explanation:
      "A ISO/IEC 25010 define 8 características de qualidade: (i) 99,9% de tempo funcionando → Confiabilidade (subcaracterística Disponibilidade); (ii) fácil de aprender → Usabilidade (subcaracterística Apreensibilidade); (iii) proteger dados contra acessos não autorizados → Segurança (subcaracterística Confidencialidade); (iv) integração com diferentes sistemas → Compatibilidade (subcaracterísticas Coexistência e Interoperabilidade).",
  },

  // --- DevOps e CI/CD (médio) ---
  {
    id: "es_devops_001",
    topic: "Engenharia de Software",
    macroarea: "Desenvolvimento",
    element: "DevOps e CI/CD",
    difficulty: "médio" as const,
    statement:
      "Uma empresa adotou a prática de CI/CD (Continuous Integration/Continuous Deployment). Toda vez que um desenvolvedor envia um commit para o branch principal, o sistema automaticamente compila o código, executa testes unitários e de integração, gera o build e o publica em um ambiente de staging. Se todos os testes passarem, o deployment para produção é automático. Qual afirmativa sobre essa configuração está correta?",
    alternatives: [
      { letter: "A", text: "Essa configuração implementa Continuous Delivery mas não Continuous Deployment, pois staging não é produção." },
      { letter: "B", text: "Essa configuração implementa Continuous Deployment completo, pois todo commit que passa nos testes é automaticamente publicado em produção sem intervenção humana." },
      { letter: "C", text: "Essa configuração não é CI/CD pois falta um passo de validação manual obrigatória." },
      { letter: "D", text: "O CI não está configurado corretamente pois deve executar apenas testes unitários, nunca testes de integração." },
      { letter: "E", text: "Continuous Integration requer que pelo menos 3 desenvolvedores façam commit simultaneamente para ser ativado." },
    ],
    correctAnswer: "B",
    explanation:
      "Continuous Deployment (CD) vai um passo além do Continuous Delivery: após o build passar em todos os testes automatizados, o deployment em produção é totalmente automático, sem aprovação manual. No Continuous Delivery, o artefato fica pronto para deploy mas requer aprovação humana. A configuração descrita (commit → build → testes → deploy automático em produção) corresponde a CI/CD completo com Continuous Deployment.",
  },

  // --- Controle de versão (médio) ---
  {
    id: "es_controle_versao_001",
    topic: "Engenharia de Software",
    macroarea: "Desenvolvimento",
    element: "Controle de versão",
    difficulty: "médio" as const,
    statement:
      "Uma equipe utiliza Git para controle de versão. Dois desenvolvedores, Alice e Bob, estão trabalhando no mesmo branch 'main'. Alice fez um commit local com alterações no arquivo 'servico.py'. Antes que Alice fizesse push, Bob já havia feito push de alterações no mesmo arquivo. Quando Alice tenta fazer push, recebe um erro de 'rejected push'. Qual sequência de comandos Git resolve essa situação de forma segura?",
    alternatives: [
      { letter: "A", text: "git push --force para sobrescrever as alterações de Bob com as de Alice." },
      { letter: "B", text: "git pull --rebase origin main para buscar as alterações de Bob e reaplicar as de Alice sobre elas, resolvendo conflitos se necessário, seguido de git push." },
      { letter: "C", text: "git reset --hard origin/main para descartar as alterações de Alice e depois git pull." },
      { letter: "D", text: "git merge origin/main para fazer merge local, seguido de git push sem resolver conflitos." },
      { letter: "E", text: "git checkout -b nova-branch para criar uma branch separada e não lidar com conflitos." },
    ],
    correctAnswer: "B",
    explanation:
      "O git pull --rebase busca as alterações remotas (git fetch) e reaplica os commits locais de Alice sobre o histórico atualizado (git rebase). Isso mantém um histórico linear mais limpo. Se houver conflitos, o Git pausa o rebase para que Alice resolva manualmente. Após resolução: git rebase --continue e git push. O push --force (A) sobrescreve o histórico de Bob, podendo perder alterações. O reset --hard (C) descarta as alterações de Alice.",
  },

  // =====================================================
  // MICROAREA 8: SISTEMAS OPERACIONAIS (9 questões)
  // Elementos: Processos e threads, Escalonamento, Deadlock,
  //   Gerência de memória, Memória virtual, Sistemas de arquivos,
  //   I/O e dispositivos, Sincronização, Virtualização, Sistemas embarcados
  // =====================================================

  // --- Processos e threads (médio) ---
  {
    id: "so_proc_threads_001",
    topic: "Sistemas Operacionais",
    macroarea: "Desenvolvimento",
    element: "Processos e threads",
    difficulty: "médio" as const,
    statement:
      "Um servidor web utiliza threads para atender requisições HTTP concorrentes. Cada requisição cria uma nova thread que processa a solicitação independentemente. Sobre o modelo de threads (1:1, N:1, M:N), é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "No modelo 1:1 (kernel-level), cada thread do usuário corresponde a uma thread do kernel, permitindo paralelismo verdadeiro em multiprocessadores, mas a criação e troca de contexto são mais custosas." },
      { letter: "B", text: "No modelo N:1 (user-level), as threads são gerenciadas pelo SO, oferecendo o melhor paralelismo e menor custo de criação." },
      { letter: "C", text: "No modelo M:N, todas as threads são gerenciadas exclusivamente pelo kernel, sem biblioteca de threads no espaço do usuário." },
      { letter: "D", text: "O modelo 1:1 é sempre inferior ao N:1 em todos os cenários, pois consome mais recursos do kernel." },
      { letter: "E", text: "Threads no modelo N:1 permitem paralelismo em multiprocessadores pois cada thread é mapeada para um core diferente." },
    ],
    correctAnswer: "A",
    explanation:
      "Modelos de threads: (1) 1:1: cada thread usuário = thread kernel → paralelismo real em SMP, mas criação/troca de contexto custosas (ex: Linux pthreads); (2) N:1: múltiplas threads usuário = 1 thread kernel → rápido e leve, mas sem paralelismo real (bloqueio de uma bloqueia todas); (3) M:N: M threads usuário mapeadas para N threads kernel → balance entre flexibilidade e paralelismo (ex: Go goroutines).",
  },

  // --- Escalonamento (médio) ---
  {
    id: "so_escalonamento_001",
    topic: "Sistemas Operacionais",
    macroarea: "Desenvolvimento",
    element: "Escalonamento",
    difficulty: "médio" as const,
    statement:
      "Um sistema operacional utiliza o algoritmo Round Robin com quantum de 4 unidades de tempo. Quatro processos (P1, P2, P3, P4) chegam no instante 0 com tempos de burst de 8, 4, 9 e 5 unidades, respectivamente. Desprezando o overhead de troca de contexto, qual é o tempo médio de turnaround?",
    alternatives: [
      { letter: "A", text: "18,0 unidades de tempo" },
      { letter: "B", text: "18,75 unidades de tempo" },
      { letter: "C", text: "22,0 unidades de tempo" },
      { letter: "D", text: "26,5 unidades de tempo" },
      { letter: "E", text: "15,25 unidades de tempo" },
    ],
    correctAnswer: "B",
    explanation:
      "Execução Round Robin (quantum=4, sem overhead):\nRound 1: P1(0-3, restam 4), P2(4-7, restam 0 → completa), P3(8-11, restam 5), P4(12-15, restam 1)\nRound 2: P1(16-19, restam 0 → completa), P3(20-23, restam 1), P4(24, restam 0 → completa)\nRound 3: P3(25, restam 0 → completa)\n\nTurnaround (conclusão - chegada): P1=19, P2=7, P3=25, P4=24\nMédia = (19+7+25+24)/4 = 75/4 = 18,75",
  },

  // --- Deadlock (fácil) ---
  {
    id: "so_deadlock_001",
    topic: "Sistemas Operacionais",
    macroarea: "Desenvolvimento",
    element: "Deadlock",
    difficulty: "fácil" as const,
    statement:
      "Um sistema possui 3 processos (P1, P2, P3) e 3 recursos do mesmo tipo (R1, R2, R3). No instante atual: P1 segura R1 e solicita R2; P2 segura R2 e solicita R3; P3 segura R3 e solicita R1. Sobre essa situação, é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "Não há deadlock, pois cada processo segura exatamente um recurso e o sistema pode prosseguir." },
      { letter: "B", text: "Há deadlock, pois as quatro condições de Coffman estão satisfeitas: exclusão mútua, posse e espera, não preemptibilidade e espera circular." },
      { letter: "C", text: "Há deadlock, mas apenas três condições de Coffman estão satisfeitas." },
      { letter: "D", text: "Não há deadlock, pois o sistema pode fazer preempção dos recursos e redistribuí-los." },
      { letter: "E", text: "Há starvation, mas não deadlock, pois os processos podem eventualmente obter os recursos." },
    ],
    correctAnswer: "B",
    explanation:
      "Todas as quatro condições de Coffman para deadlock estão presentes: (1) Exclusão mútua — cada recurso é usado por apenas um processo por vez; (2) Posse e espera — P1 segura R1 enquanto espera R2, P2 segura R2 esperando R3, P3 segura R3 esperando R1; (3) Não preemptibilidade — recursos não podem ser tomados à força; (4) Espera circular — P1→P2→P3→P1 formam um ciclo. Esse é o exemplo clássico de deadlock circular.",
  },

  // --- Gerência de memória (médio) ---
  {
    id: "so_memoria_001",
    topic: "Sistemas Operacionais",
    macroarea: "Desenvolvimento",
    element: "Gerência de memória",
    difficulty: "médio" as const,
    statement:
      "Um sistema operacional com memória física de 256 MB utiliza paginação com páginas de 4 KB. O espaço de endereçamento lógico de um processo é de 64 MB. Quantas entradas são necessárias na tabela de páginas desse processo e qual é o número total de páginas no espaço de endereçamento lógico?",
    alternatives: [
      { letter: "A", text: "16.384 entradas na tabela de páginas e 65.536 páginas lógicas." },
      { letter: "B", text: "65.536 entradas na tabela de páginas e 16.384 páginas lógicas." },
      { letter: "C", text: "16.384 entradas na tabela de páginas e 16.384 páginas lógicas." },
      { letter: "D", text: "65.536 entradas na tabela de páginas e 65.536 páginas lógicas." },
      { letter: "E", text: "8.192 entradas na tabela de páginas e 32.768 páginas lógicas." },
    ],
    correctAnswer: "A",
    explanation:
      "Com páginas de 4 KB (4 × 1024 = 4096 bytes), um espaço de endereçamento de 64 MB (64 × 1024 × 1024 = 67.108.864 bytes) resulta em 67.108.864 / 4096 = 16.384 páginas lógicas. A tabela de páginas possui uma entrada por página lógica, logo 16.384 entradas. A memória física de 256 MB suporta 65.536 páginas físicas, mas isso não afeta o tamanho da tabela de páginas do processo.",
  },

  // --- Memória virtual (difícil) ---
  {
    id: "so_mem_virtual_001",
    topic: "Sistemas Operacionais",
    macroarea: "Desenvolvimento",
    element: "Memória virtual",
    difficulty: "difícil" as const,
    statement:
      "Um sistema utiliza memória virtual com paginação por demanda. Um processo referencia as páginas 0, 1, 2, 3, 2, 4, 2, 1, 5, 0, 1, 2, 3, 2 nessa ordem. A memória física possui 3 frames inicialmente vazios. Utilizando o algoritmo de substituição LRU (Least Recently Used), quantas faltas de página (page faults) ocorrerão?",
    alternatives: [
      { letter: "A", text: "8 faltas de página" },
      { letter: "B", text: "10 faltas de página" },
      { letter: "C", text: "9 faltas de página" },
      { letter: "D", text: "7 faltas de página" },
      { letter: "E", text: "11 faltas de página" },
    ],
    correctAnswer: "B",
    explanation:
      "Simulação LRU com 3 frames (LRU = página usada há mais tempo):\n0: falta [0] → 1\n1: falta [0,1] → 2\n2: falta [0,1,2] → 3\n3: falta (substitui 0) [3,1,2] → 4\n2: hit [3,1,2]\n4: falta (substitui 1) [3,4,2] → 5\n2: hit [3,4,2]\n1: falta (substitui 3) [1,4,2] → 6\n5: falta (substitui 4) [1,5,2] → 7\n0: falta (substitui 1) [0,5,2] → 8\n1: falta (substitui 5) [0,1,2] → 9\n2: hit [0,1,2]\n3: falta (substitui 0) [3,1,2] → 10\n2: hit [3,1,2]\n\nTotal: 10 faltas de página.",
  },

  // --- Sistemas de arquivos (médio) ---
  {
    id: "so_arquivos_001",
    topic: "Sistemas Operacionais",
    macroarea: "Desenvolvimento",
    element: "Sistemas de arquivos",
    difficulty: "médio" as const,
    statement:
      "Sobre os métodos de alocação de espaço em disco em sistemas de arquivos, é correto afirmar que a alocação indexada:",
    alternatives: [
      { letter: "A", text: "Armazena os ponteiros diretamente nos blocos de dados, permitindo acesso sequencial rápido mas com fragmentação externa severa." },
      { letter: "B", text: "Utiliza uma tabela de blocos livres (FAT - File Allocation Table) que armazena o ponteiro para o próximo bloco de cada arquivo, causando fragmentação interna." },
      { letter: "C", text: "Possui um bloco de índice que contém ponteiros para todos os blocos de dados do arquivo, permitindo acesso direto (random access) sem fragmentação externa, porém o tamanho máximo do arquivo é limitado pelo tamanho do bloco de índice." },
      { letter: "D", text: "Não suporta acesso direto, sendo indicada apenas para arquivos de acesso sequencial como logs." },
      { letter: "E", text: "É idêntica à alocação contígua, mas utiliza ponteiros em vez de blocos adjacentes." },
    ],
    correctAnswer: "C",
    explanation:
      "Na alocação indexada, cada arquivo possui um bloco de índice (index block) contendo ponteiros para todos os blocos de dados. Vantagens: acesso direto O(1) a qualquer bloco, sem fragmentação externa. Desvantagens: o tamanho do índice limita o tamanho do arquivo (resolvido com esquema de índice indireto, como no UNIX inode: ponteiros diretos, simples indireto, duplo indireto, triplo indireto). A alocação encadeada (linked) usa ponteiros nos blocos; a FAT é uma variação da encadeada.",
  },

  // --- I/O e dispositivos (fácil) ---
  {
    id: "so_io_001",
    topic: "Sistemas Operacionais",
    macroarea: "Desenvolvimento",
    element: "I/O e dispositivos",
    difficulty: "fácil" as const,
    statement:
      "Sobre as técnicas de E/S (I/O) em sistemas operacionais, qual alternativa descreve corretamente a diferença entre E/S programada (polling) e E/S orientada a interrupção?",
    alternatives: [
      { letter: "A", text: "Na E/S programada, o dispositivo notifica a CPU quando os dados estão prontos; na E/S por interrupção, a CPU verifica continuamente o status do dispositivo." },
      { letter: "B", text: "Na E/S programada, a CPU verifica repetidamente (polling) o status do dispositivo, desperdiçando ciclos; na E/S por interrupção, o dispositivo envia um sinal à CPU quando está pronto, liberando a CPU para outras tarefas." },
      { letter: "C", text: "Ambas as técnicas são equivalentes em termos de utilização de CPU e não há diferença prática entre elas." },
      { letter: "D", text: "A E/S por interrupção é mais lenta que a E/S programada pois o overhead de tratamento da interrupção é maior que o polling contínuo." },
      { letter: "E", text: "A E/S programada utiliza DMA para transferência de dados, enquanto a E/S por interrupção transfere dados byte a byte pela CPU." },
    ],
    correctAnswer: "B",
    explanation:
      "E/S programada (polling): a CPU entra em loop verificando o status do dispositivo, consumindo ciclos de CPU mesmo quando o dispositivo não está pronto — ineficiente para dispositivos lentos. E/S orientada a interrupção: a CPU inicia a operação e executa outras tarefas; o dispositivo emite uma interrupção quando os dados estão prontos — mais eficiente, pois a CPU não fica ociosa esperando. DMA (Direct Memory Access) é uma terceira técnica onde um controlador DMA transfere dados diretamente entre dispositivo e memória, sem intervenção da CPU.",
  },

  // --- Sincronização (difícil) ---
  {
    id: "so_sincronizacao_001",
    topic: "Sistemas Operacionais",
    macroarea: "Desenvolvimento",
    element: "Sincronização",
    difficulty: "difícil" as const,
    statement:
      "Um estacionamento possui N vagas. Um semáforo é utilizado para controlar o acesso: motoristas decrementam o semáforo ao entrar e incrementam ao sair. Inicialmente, o semáforo tem valor N. Se N = 5 e chegam 8 motoristas simultaneamente, qual será o estado dos motoristas e do semáforo?",
    alternatives: [
      { letter: "A", text: "Os 8 motoristas entram normalmente e o semáforo fica com valor -3." },
      { letter: "B", text: "5 motoristas entram (semáforo = 0), e os outros 3 ficam bloqueados esperando até que alguém saia do estacionamento (o semáforo incrementa e desbloqueia um motorista por vez)." },
      { letter: "C", text: "5 motoristas entram (semáforo = 0), e os outros 3 recebem uma mensagem de erro e desistem." },
      { letter: "D", text: "Todos os 8 motoristas ficam bloqueados porque o semáforo chegou a zero." },
      { letter: "E", text: "Apenas 1 motorista entra por vez, e os outros ficam em uma fila de prioridade." },
    ],
    correctAnswer: "B",
    explanation:
      "O semáforo inicial vale N=5 (representa 5 vagas). Cada operação down/wait decrementa o semáforo: os 5 primeiros motoristas decrementam para 0 e entram. Os próximos 3 motoristas tentam decrementar mas o semáforo está em 0, então são bloqueados. Quando um motorista sai, executa up/signal, incrementando o semáforo para 1 e desbloqueando um dos motoristas esperantes. Este é o padrão clássico de uso de semáforos como contadores de recursos.",
  },

  // --- Virtualização (médio) ---
  {
    id: "so_virtualizacao_001",
    topic: "Sistemas Operacionais",
    macroarea: "Desenvolvimento",
    element: "Virtualização",
    difficulty: "médio" as const,
    statement:
      "Sobre virtualização de sistemas operacionais, é correto afirmar que a paravirtualização difere da virtualização total (full virtualization) porque:",
    alternatives: [
      { letter: "A", text: "A paravirtualização não requer um hypervisor, executando diretamente sobre o hardware." },
      { letter: "B", text: "Na paravirtualização, o sistema operacional convidado é modificado para saber que está sendo virtualizado, fazendo chamadas diretas ao hypervisor (hypercalls) em vez de usar instruções privilegiadas, resultando em melhor desempenho." },
      { letter: "C", text: "A paravirtualização só funciona com sistemas operacionais da mesma família (ex: apenas Linux)." },
      { letter: "D", text: "A virtualização total oferece melhor desempenho que a paravirtualização pois não requer modificações no SO convidado." },
      { letter: "E", text: "Na paravirtualização, o hypervisor é instalado dentro do sistema operacional convidado." },
    ],
    correctAnswer: "B",
    explanation:
      "Full virtualization: o hypervisor emula completamente o hardware, permitindo SOs não modificados, mas com overhead de tradução de instruções privilegiadas (trap-and-emulate). Paravirtualização (ex: Xen): o SO convidado é modificado para substituir instruções privilegiadas por hypercalls (chamadas diretas ao hypervisor), reduzindo significativamente o overhead. A desvantagem é que o SO precisa ser modificado. Hardware assistido (VT-x/AMD-V) elimina grande parte dessa diferença.",
  },

  // --- Sistemas embarcados (fácil) ---
  {
    id: "so_embarcados_001",
    topic: "Sistemas Operacionais",
    macroarea: "Desenvolvimento",
    element: "Sistemas embarcados",
    difficulty: "fácil" as const,
    statement:
      "Sistemas operacionais de tempo real (RTOS) são amplamente utilizados em sistemas embarcados. Sobre as características de um RTOS hard real-time, é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "Um RTOS hard real-time garante que todas as tarefas serão concluídas dentro de seus prazos (deadlines) estritos; o descumprimento de um deadline pode causar falha catastrófica no sistema." },
      { letter: "B", text: "RTOS prioriza a vazão (throughput) total do sistema em detrimento do tempo de resposta individual das tarefas." },
      { letter: "C", text: "Um RTOS não suporta preemptibilidade, pois isso poderia causar inversão de prioridade." },
      { letter: "D", text: "RTOS só é utilizado em sistemas com mais de 1 GB de RAM, pois requer grande quantidade de memória." },
      { letter: "E", text: "Em um RTOS, o tempo de resposta é garantido estatisticamente, não de forma determinística." },
    ],
    correctAnswer: "A",
    explanation:
      "Sistemas hard real-time exigem que deadlines sejam sempre cumpridos — falhas podem ser catastróficas (ex: airbags, marcapassos, controle industrial). Características dos RTOS: executabilidade determinística, latência conhecida e limitada, preemptibilidade, mecanismos anti-inversão de prioridade (ex: herança de prioridade), footprints de memória pequenos. Soft real-time aceita degradação gradual quando deadlines são perdidos (ex: streaming de vídeo).",
  },

  // =====================================================
  // MICROAREA 9: REDES (9 questões)
  // Elementos: Modelo OSI vs TCP/IP, Endereçamento IP, Roteamento,
  //   Protocolos de aplicação, Camada de transporte, Sockets,
  //   Firewall e NAT, Redes sem fio, SDN, Latência e largura de banda
  // =====================================================

  // --- Modelo OSI vs TCP/IP (fácil) ---
  {
    id: "red_osi_tcpip_001",
    topic: "Redes",
    macroarea: "Desenvolvimento",
    element: "Modelo OSI vs TCP/IP",
    difficulty: "fácil" as const,
    statement:
      "Um administrador de redes precisa configurar um switch gerenciável e um roteador em uma rede corporativa. No contexto dos modelos de referência, o switch opera primariamente em qual camada e o roteador em qual camada?",
    alternatives: [
      { letter: "A", text: "Switch na camada de Rede e Roteador na camada de Transporte." },
      { letter: "B", text: "Switch na camada de Enlace de Dados (2) e Roteador na camada de Rede (3) do modelo OSI." },
      { letter: "C", text: "Switch na camada Física (1) e Roteador na camada de Enlace de Dados (2)." },
      { letter: "D", text: "Ambos operam na camada de Aplicação (7), pois são dispositivos de rede de alto nível." },
      { letter: "E", text: "Switch na camada de Sessão (5) e Roteador na camada de Apresentação (6)." },
    ],
    correctAnswer: "B",
    explanation:
      "Dispositivos de rede e camadas OSI: (1) Hub/Repetidor → Física (1); (2) Switch (L2) → Enlace de Dados (2), encaminha quadros com base em endereços MAC; (3) Roteador → Rede (3), encaminha pacotes com base em endereços IP; (4) Switch L3/Gateway → camadas 2 e 3. O modelo TCP/IP condensa as 7 camadas OSI em 4: Acesso à Rede (1+2), Internet (3), Transporte (4), Aplicação (5+6+7).",
  },

  // --- Endereçamento IP (médio) ---
  {
    id: "red_ip_001",
    topic: "Redes",
    macroarea: "Desenvolvimento",
    element: "Endereçamento IP",
    difficulty: "médio" as const,
    statement:
      "Um administrador recebeu o bloco de endereços IP 200.200.200.0/28. Quantos endereços IP válidos (utilizáveis por hosts) existem nessa sub-rede e qual é o endereço de broadcast?",
    alternatives: [
      { letter: "A", text: "16 endereços válidos e broadcast 200.200.200.255." },
      { letter: "B", text: "14 endereços válidos e broadcast 200.200.200.15." },
      { letter: "C", text: "30 endereços válidos e broadcast 200.200.200.31." },
      { letter: "D", text: "14 endereços válidos e broadcast 200.200.200.30." },
      { letter: "E", text: "12 endereços válidos e broadcast 200.200.200.16." },
    ],
    correctAnswer: "B",
    explanation:
      "Com máscara /28, temos 32-28=4 bits para hosts: 2^4 = 16 endereços totais. Descontando o endereço de rede (primeiro) e broadcast (último), restam 14 endereços válidos. Endereço de rede: 200.200.200.0; primeiro host: 200.200.200.1; último host: 200.200.200.14; broadcast: 200.200.200.15. A máscara em decimal é 255.255.255.240.",
  },

  // --- Roteamento (difícil) ---
  {
    id: "red_roteamento_001",
    topic: "Redes",
    macroarea: "Desenvolvimento",
    element: "Roteamento",
    difficulty: "difícil" as const,
    statement:
      "Sobre protocolos de roteamento, considere as afirmativas:\nI. OSPF é um protocolo de roteamento por vetor de distância que utiliza o algoritmo de Bellman-Ford.\nII. BGP é o protocolo de roteamento principal da Internet, classificado como path-vector.\nIII. RIP limita o número de saltos (hops) a 15, tratando 16 como inalcançável.\nIV. OSPF utiliza o algoritmo de Dijkstra (Shortest Path First) e mantém uma topologia completa da rede.\nQuais afirmativas estão corretas?",
    alternatives: [
      { letter: "A", text: "Apenas I e II" },
      { letter: "B", text: "Apenas II e III" },
      { letter: "C", text: "Apenas II, III e IV" },
      { letter: "D", text: "Apenas I, III e IV" },
      { letter: "E", text: "I, II, III e IV" },
    ],
    correctAnswer: "C",
    explanation:
      "I está INCORRETA: OSPF é link-state (estado de enlace), não distance-vector. Usa Dijkstra.\nII está CORRETA: BGP (Border Gateway Protocol) é path-vector, usado para roteamento entre sistemas autônomos (AS) na Internet.\nIII está CORRETA: RIP v2 limita a 15 hops (métrica). 16 = infinito (inalcançável).\nIV está CORRETA: OSPF constrói uma representação completa da topologia (LSDB) e usa Dijkstra para calcular as melhores rotas.",
  },

  // --- Protocolos de aplicação (médio) ---
  {
    id: "red_protocolos_aplic_001",
    topic: "Redes",
    macroarea: "Desenvolvimento",
    element: "Protocolos de aplicação",
    difficulty: "médio" as const,
    statement:
      "Um desenvolvedor está implementando um sistema de chat em tempo real e precisa escolher o protocolo mais adequado para a comunicação entre o navegador web e o servidor. Sobre os protocolos de aplicação, qual alternativa é correta?",
    alternatives: [
      { letter: "A", text: "HTTP é o mais adequado, pois permite comunicação bidirecional em tempo real através de keep-alive connections." },
      { letter: "B", text: "WebSocket é o mais adequado, pois estabelece uma conexão bidirecional persistente (full-duplex) sobre TCP, permitindo comunicação em tempo real com baixa latência sem overhead de requisições HTTP." },
      { letter: "C", text: "FTP é o mais adequado pois foi projetado para transferência contínua de dados." },
      { letter: "D", text: "SMTP é o mais adequado pois suporta comunicação bidirecional entre servidor e cliente." },
      { letter: "E", text: "DNS é o mais adequado pois possui baixa latência por padrão e suporta múltiplos registros de tipo SRV." },
    ],
    correctAnswer: "B",
    explanation:
      "WebSocket (RFC 6455) fornece um canal de comunicação full-duplex sobre uma única conexão TCP, ideal para chat em tempo real, jogos, notificações push. Diferente do HTTP (request-response), WebSocket permite que servidor e cliente enviem mensagens a qualquer momento. O handshake inicial é feito via HTTP (upgrade request). HTTP/2 Server-Sent Events (SSE) só suporta comunicação unidirecional (servidor→cliente).",
  },

  // --- Camada de transporte (médio) ---
  {
    id: "red_transporte_001",
    topic: "Redes",
    macroarea: "Desenvolvimento",
    element: "Camada de transporte",
    difficulty: "médio" as const,
    statement:
      "Uma aplicação de streaming de vídeo ao vivo precisa enviar dados em tempo real onde a velocidade é mais importante que a integridade absoluta dos dados (perda de alguns quadros é tolerável). Qual protocolo de transporte é mais adequado e por quê?",
    alternatives: [
      { letter: "A", text: "TCP, pois garante entrega confiável e ordenada dos pacotes, essencial para vídeo." },
      { letter: "B", text: "UDP, pois é mais rápido, não possui overhead de handshake, controle de fluxo e retransmissão, permitindo menor latência, sendo adequado para aplicações tolerantes a perdas." },
      { letter: "C", text: "SCTP, pois combina características de TCP e UDP, sendo obrigatório para streaming." },
      { letter: "D", text: "ICMP, pois foi projetado para transmissão de dados multimídia." },
      { letter: "E", text: "HTTP, pois suporta streaming nativo através da versão 3.0." },
    ],
    correctAnswer: "B",
    explanation:
      "UDP é preferido para streaming de vídeo ao vivo porque: (1) sem handshake (connectionless), menor latência inicial; (2) sem controle de congestionamento e retransmissão, pacotes atrasados são descartados em vez de esperados; (3) menor overhead de cabeçalho (8 bytes vs 20+ do TCP). Protocolos como RTP (Real-time Transport Protocol) operam sobre UDP. TCP causaria buffering e atraso ao retransmitir pacotes perdidos, prejudicando a experiência em tempo real.",
  },

  // --- Sockets (médio) ---
  {
    id: "red_sockets_001",
    topic: "Redes",
    macroarea: "Desenvolvimento",
    element: "Sockets",
    difficulty: "médio" as const,
    statement:
      "Um programador está desenvolvendo um servidor TCP em Python. A sequência correta de chamadas de socket para que o servidor aceite conexões de clientes é:",
    alternatives: [
      { letter: "A", text: "socket() → connect() → send() → recv() → close()" },
      { letter: "B", text: "socket() → bind() → listen() → accept() → recv()/send() → close()" },
      { letter: "C", text: "socket() → bind() → accept() → listen() → send()/recv() → close()" },
      { letter: "D", text: "socket() → listen() → bind() → connect() → recv()/send() → close()" },
      { letter: "E", text: "socket() → recv() → bind() → listen() → accept() → close()" },
    ],
    correctAnswer: "B",
    explanation:
      "Lado do servidor TCP: (1) socket() cria o endpoint; (2) bind() associa o socket a um endereço IP e porta; (3) listen() coloca o socket em modo passivo (aguardando conexões); (4) accept() bloqueia até que um cliente se conecte, retornando um novo socket para a conexão; (5) recv()/send() para trocar dados; (6) close() encerra. O lado do cliente usa: socket() → connect() → send()/recv() → close().",
  },

  // --- Firewall e NAT (médio) ---
  {
    id: "red_firewall_nat_001",
    topic: "Redes",
    macroarea: "Desenvolvimento",
    element: "Firewall e NAT",
    difficulty: "médio" as const,
    statement:
      "Uma empresa possui uma rede interna com endereços privados 192.168.1.0/24 e precisa que todos os computadores acessem a Internet usando um único endereço IP público. Sobre o NAT (Network Address Translation), é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "O NAT estático mapeia cada endereço IP privado para um endereço IP público diferente, sendo necessário ter tantos IPs públicos quanto hosts internos." },
      { letter: "B", text: "O NAT dinâmico (PAT - Port Address Translation) mapeia múltiplos endereços IP privados para um único endereço IP público usando portas diferentes, permitindo que milhares de conexões internas compartilhem um IP público." },
      { letter: "C", text: "O NAT não modifica os endereços IP dos pacotes, apenas criptografa o conteúdo para segurança." },
      { letter: "D", text: "O NAT é um protocolo da camada de aplicação que opera em conjunto com HTTP." },
      { letter: "E", text: "O NAT funciona apenas com protocolo UDP, não suportando TCP." },
    ],
    correctAnswer: "B",
    explanation:
      "NAT/PAT (Port Address Translation, ou NAT overload) mapeia múltiplos IPs privados para um IP público, diferenciando as conexões pelo número de porta (ex: 192.168.1.10:5000 → 203.0.113.5:10001, 192.168.1.11:5000 → 203.0.113.5:10002). O NAT estático mapeia 1:1 (um IP privado para um IP público fixo). NAT opera na camada de rede (3) modificando endereços IP e portas nos cabeçalhos. Funciona tanto com TCP quanto UDP.",
  },

  // --- Redes sem fio (fácil) ---
  {
    id: "red_sem_fio_001",
    topic: "Redes",
    macroarea: "Desenvolvimento",
    element: "Redes sem fio",
    difficulty: "fácil" as const,
    statement:
      "Sobre o padrão IEEE 802.11 (Wi-Fi) e suas variantes, é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "O 802.11ac (Wi-Fi 5) opera exclusivamente na frequência de 5 GHz e oferece velocidades de até 6,9 Gbps." },
      { letter: "B", text: "O 802.11ax (Wi-Fi 6) introduziu OFDMA e MU-MIMO, operando em 2,4 GHz e 5 GHz, oferecendo maior eficiência em ambientes com muitos dispositivos." },
      { letter: "C", text: "O padrão 802.11b foi o primeiro a utilizar a banda de 5 GHz, sendo mais rápido que o 802.11g." },
      { letter: "D", text: "Todos os padrões 802.11 operam exclusivamente em 2,4 GHz sem exceção." },
      { letter: "E", text: "O Wi-Fi 6E foi o primeiro padrão a suportar criptografia WPA3." },
    ],
    correctAnswer: "B",
    explanation:
      "802.11ax (Wi-Fi 6) introduziu OFDMA (Orthogonal Frequency-Division Multiple Access) para transmissão a múltiplos usuários simultaneamente, MU-MIMO aprimorado (uplink + downlink), e Target Wake Time para economia de energia em IoT. Opera em 2,4 e 5 GHz. Comparação: 802.11b (2,4 GHz, 11 Mbps) → 802.11g (2,4 GHz, 54 Mbps) → 802.11n/Wi-Fi 4 (2,4/5 GHz, 600 Mbps) → 802.11ac/Wi-Fi 5 (5 GHz, 6,9 Gbps) → 802.11ax/Wi-Fi 6 (2,4/5 GHz, 9,6 Gbps).",
  },

  // --- SDN (difícil) ---
  {
    id: "red_sdn_001",
    topic: "Redes",
    macroarea: "Desenvolvimento",
    element: "SDN",
    difficulty: "difícil" as const,
    statement:
      "Sobre Redes Definidas por Software (SDN - Software Defined Networking), é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "No modelo SDN, o plano de dados e o plano de controle são estritamente acoplados em cada dispositivo de rede, como nas redes tradicionais." },
      { letter: "B", text: "O SDN separa o plano de controle (centralizado em um controlador SDN) do plano de dados (nos switches/roteadores), permitindo programação centralizada e dinâmica da rede através de APIs como OpenFlow." },
      { letter: "C", text: "SDN é uma tecnologia proprietária da Cisco e não possui padrões abertos." },
      { letter: "D", text: "O OpenFlow é um protocolo da camada de aplicação para troca de mensagens de e-mail em redes SDN." },
      { letter: "E", text: "Em SDN, os switches tomam todas as decisões de roteamento de forma independente, sem comunicação com o controlador." },
    ],
    correctAnswer: "B",
    explanation:
      "O paradigma SDN se baseia em três pilares: (1) Separação dos planos de controle e dados; (2) Centralização do controle em um controlador SDN; (3) Programabilidade da rede via APIs abertas. O controlador tem uma visão global da rede e instala regras nos switches via protocolo OpenFlow. Benefícios: automação, maior agilidade, programação de políticas centralizada, virtualização de redes (NFV). O OpenFlow é um protocolo de comunicação entre controlador e switches de dados.",
  },

  // --- Latência e largura de banda (médio) ---
  {
    id: "red_latencia_bw_001",
    topic: "Redes",
    macroarea: "Desenvolvimento",
    element: "Latência e largura de banda",
    difficulty: "médio" as const,
    statement:
      "Uma empresa precisa transferir um arquivo de 100 MB entre duas filiais conectadas por um link de 10 Mbps. A latência de propagação ida e volta (RTT) é de 80 ms. Utilizando TCP com janela de congestionamento suficientemente grande, qual é o tempo total aproximado de transferência, considerando apenas o tempo de transmissão e ignorando overheads de protocolo?",
    alternatives: [
      { letter: "A", text: "Aproximadamente 8,0 segundos." },
      { letter: "B", text: "Aproximadamente 80,08 segundos." },
      { letter: "C", text: "Aproximadamente 10,0 segundos." },
      { letter: "D", text: "Aproximadamente 1,25 segundos." },
      { letter: "E", text: "Aproximadamente 82,5 segundos." },
    ],
    correctAnswer: "B",
    explanation:
      "Tempo de transmissão = tamanho do arquivo / largura de banda = 100 MB × 8 bits/byte / 10 Mbps = 800 Mb / 10 Mbps = 80 segundos. O RTT de 80 ms (0,08 s) adiciona um overhead mínimo comparado aos 80 segundos de transmissão. Tempo total ≈ 80 + 0,08 ≈ 80,08 segundos. Com janela TCP grande, o throughput se aproxima da largura do link, logo a alternativa B (80,08 s) é a correta.",
  },

  // =====================================================
  // MICROAREA 10: SISTEMAS DISTRIBUÍDOS (9 questões)
  // Elementos: Comunicação entre processos, Teorema CAP,
  //   Replicação, Tolerância a falhas, Microsserviços,
  //   Computação em nuvem, Contêineres, MapReduce,
  //   Sistemas P2P, Relógios lógicos
  // =====================================================

  // --- Comunicação entre processos (médio) ---
  {
    id: "sd_comunicacao_001",
    topic: "Sistemas Distribuídos",
    macroarea: "Desenvolvimento",
    element: "Comunicação entre processos",
    difficulty: "médio" as const,
    statement:
      "Em sistemas distribuídos, uma aplicação precisa que um processo em um servidor invoque uma função em outro servidor como se fosse uma chamada local. Qual mecanismo é mais adequado para essa situação?",
    alternatives: [
      { letter: "A", text: "RMI (Remote Method Invocation) ou RPC (Remote Procedure Call), que abstraem a comunicação em rede permitindo que um processo chame procedimentos em processos remotos como se fossem chamadas locais, ocultando marshalling/unmarshalling e protocolos de transporte." },
      { letter: "B", text: "Shared memory (memória compartilhada), pois é o mecanismo mais rápido para comunicação entre processos em máquinas diferentes." },
      { letter: "C", text: "Message queuing (filas de mensagens), pois garante chamadas síncronas sem latência." },
      { letter: "D", text: "Pipes nomeados, pois são ideais para comunicação entre processos em máquinas separadas." },
      { letter: "E", text: "Sinais (signals) do sistema operacional, pois oferecem comunicação direta e síncrona entre processos remotos." },
    ],
    correctAnswer: "A",
    explanation:
      "RPC/RMI abstraem a comunicação remota: o cliente chama um procedimento como se fosse local; os stubs (client e server) cuidam da serialização (marshalling) dos parâmetros, transmissão pela rede, desserialização (unmarshalling) no servidor, execução e retorno. Isso oculta complexidades de rede, protocolos e representação de dados. Shared memory só funciona em processos na mesma máquina. Message queuing é assíncrono. Pipes são IPC local.",
  },

  // --- Teorema CAP (médio) ---
  {
    id: "sd_cap_001",
    topic: "Sistemas Distribuídos",
    macroarea: "Desenvolvimento",
    element: "Teorema CAP",
    difficulty: "médio" as const,
    statement:
      "Uma startup está projetando um sistema de armazenamento distribuído para um aplicativo de redes sociais. O sistema precisa estar sempre disponível (mesmo durante falhas de rede) e tolerar partições de rede. Com base no Teorema CAP, qual propriedade esse sistema provavelmente terá que relaxar?",
    alternatives: [
      { letter: "A", text: "Partição Tolerance — pois é a propriedade menos importante em sistemas distribuídos." },
      { letter: "B", text: "Consistência — pois em redes distribuídas reais, partições são inevitáveis, e ao escolher AP (Availability + Partition Tolerance), o sistema oferece consistência eventual em vez de consistência forte." },
      { letter: "C", text: "Availability — pois é mais fácil de implementar que consistência." },
      { letter: "D", text: "Nenhuma propriedade precisa ser relaxada, pois o Teorema CAP permite que as três sejam satisfeitas simultaneamente." },
      { letter: "E", text: "O Teorema CAP só se aplica a bancos de dados relacionais, não a sistemas NoSQL." },
    ],
    correctAnswer: "B",
    explanation:
      "O Teorema CAP (Brewer, 2000) afirma que um sistema distribuído pode garantir no máximo 2 de 3 propriedades: Consistency (todas as réplicas veem os mesmos dados), Availability (toda requisição recebe resposta) e Partition Tolerance (funciona apesar de partições de rede). Em ambientes reais de rede, partições são inevitáveis, então P é obrigatório. A escolha é CP (consistência forte, ex: HBase, MongoDB) ou AP (alta disponibilidade, consistência eventual, ex: Cassandra, DynamoDB).",
  },

  // --- Replicação (difícil) ---
  {
    id: "sd_replicacao_001",
    topic: "Sistemas Distribuídos",
    macroarea: "Desenvolvimento",
    element: "Replicação",
    difficulty: "difícil" as const,
    statement:
      "Um sistema de e-commerce replica dados de catálogo de produtos em 5 servidores. Quando um produto é atualizado, a consistência eventual pode causar que clientes vejam versões diferentes do preço por alguns segundos. Sobre os modelos de replicação, é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "Na replicação síncrona (consistência forte), cada escrita aguarda a confirmação de todas as réplicas antes de responder ao cliente, garantindo leituras consistentes mas aumentando a latência de escrita." },
      { letter: "B", text: "Na replicação assíncrona, as réplicas sempre refletem imediatamente as escritas mais recentes, sem nenhum atraso." },
      { letter: "C", text: "A replicação síncrona oferece menor latência que a assíncrona pois não precisa aguardar confirmações." },
      { letter: "D", text: "A consistência eventual é equivalente à consistência linearizável, ambas garantem que leituras sempre retornam o valor mais recente." },
      { letter: "E", text: "Na replicação ativa-passiva, todas as réplicas recebem escritas simultaneamente e as processam de forma independente." },
    ],
    correctAnswer: "A",
    explanation:
      "Replicação síncrona: escrita só é confirmada após todas as réplicas acknowledgerem → consistência forte, mas alta latência de escrita (limitada pela réplica mais lenta). Replicação assíncrona: escrita é confirmada após o primário persistir → baixa latência, mas réplicas podem estar desatualizadas (consistência eventual). Consistência linearizável é mais forte que eventual. Na ativa-passiva, apenas o primário recebe escritas e replica para secundários.",
  },

  // --- Tolerância a falhas (médio) ---
  {
    id: "sd_tolerancia_001",
    topic: "Sistemas Distribuídos",
    macroarea: "Desenvolvimento",
    element: "Tolerância a falhas",
    difficulty: "médio" as const,
    statement:
      "Um sistema distribuído utiliza um cluster de 5 servidores para processar requisições. O sistema é projetado para tolerar falhas de até 2 servidores simultaneamente e continuar operando corretamente. Qual mecanismo de tolerância a falhas está sendo utilizado e qual é o nome do conceito?",
    alternatives: [
      { letter: "A", text: "Checkpointing — salva o estado periodicamente e recupera em caso de falha." },
      { letter: "B", text: "Máscara de falha por redundância (fault masking by redundancy) — com 5 servidores, o sistema tolera f ≤ 2 falhas crash, pois 3 servidores corretos formam maioria (quórum de ⌊5/2⌋ + 1 = 3)." },
      { letter: "C", text: "Replicação ativa-passiva — apenas um servidor processa enquanto os outros 4 ficam em standby." },
      { letter: "D", text: "Byzantine fault tolerance — tolera até 2 servidores com comportamento arbitrário." },
      { letter: "E", text: "Fail-stop — quando um servidor falha, ele para imediatamente sem causar danos ao sistema." },
    ],
    correctAnswer: "B",
    explanation:
      "O sistema usa redundância com votação por maioria (quórum). Com 5 servidores e tolerância a 2 falhas: ⌊(5-1)/2⌋ = 2 falhas crash toleráveis. O quórum é majority = ⌊n/2⌋ + 1 = 3. Para tolerar falhas Byzantine (comportamento arbitrário/malicioso), seria necessário no mínimo 3f+1 servidores para tolerar f falhas (para f=2, precisaríamos de 7 servidores). O checkpointing é outra técnica de tolerância, mas o conceito de tolerar f falhas com quórum refere-se à redundância com votação.",
  },

  // --- Microsserviços (médio) ---
  {
    id: "sd_microservicos_001",
    topic: "Sistemas Distribuídos",
    macroarea: "Desenvolvimento",
    element: "Microsserviços",
    difficulty: "médio" as const,
    statement:
      "Uma empresa está migrando uma aplicação monolítica para arquitetura de microsserviços. A equipe identificou que a comunicação entre os microsserviços será um desafio crítico. Sobre os padrões de comunicação em microsserviços, é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "Todos os microsserviços devem se comunicar exclusivamente via chamadas síncronas REST para garantir simplicidade." },
      { letter: "B", text: "A comunicação síncrona (REST/gRPC) é adequada para requisições que exigem resposta imediata, enquanto a comunicação assíncrona (filas de mensagens como Kafka/RabbitMQ) é recomendada para desacoplar serviços e lidar com operações de longa duração." },
      { letter: "C", text: "Microsserviços devem compartilhar o mesmo banco de dados para garantir consistência e simplificar a comunicação." },
      { letter: "D", text: "O uso de um API Gateway é opcional e não traz benefícios significativos em arquiteturas de microsserviços." },
      { letter: "E", text: "Microsserviços devem ser todos desenvolvidos na mesma linguagem de programação para facilitar a comunicação." },
    ],
    correctAnswer: "B",
    explanation:
      "Padrões de comunicação em microsserviços: Síncrona (REST, gRPC) — quando o cliente precisa da resposta imediata (ex: consulta de saldo). Assíncrona (filas/eventos via Kafka, RabbitMQ, AWS SQS) — para desacoplamento temporal e operações que não precisam de resposta imediata (ex: processamento de pedido, notificação). A combinação de ambos (choreography vs orchestration) é comum. Cada microsserviço deve ter seu próprio banco de dados (database per service) para independência de deploy e escalabilidade.",
  },

  // --- Computação em nuvem (fácil) ---
  {
    id: "sd_nuvem_001",
    topic: "Sistemas Distribuídos",
    macroarea: "Desenvolvimento",
    element: "Computação em nuvem",
    difficulty: "fácil" as const,
    statement:
      "Sobre os modelos de serviço em nuvem (IaaS, PaaS, SaaS), é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "IaaS oferece apenas software pronto para uso, como e-mail e editores de texto." },
      { letter: "B", text: "PaaS fornece infraestrutura completa incluindo hardware físico em datacenters dedicados ao cliente." },
      { letter: "C", text: "SaaS fornece software pronto para uso via navegador; PaaS fornece plataforma para desenvolvimento sem gerenciar infraestrutura; IaaS fornece recursos de infraestrutura virtualizados (VMs, redes, armazenamento) com controle total do SO." },
      { letter: "D", text: "Os três modelos oferecem exatamente o mesmo nível de controle e responsabilidade para o cliente." },
      { letter: "E", text: "IaaS é o modelo com maior nível de abstração, onde o cliente não precisa gerenciar nada." },
    ],
    correctAnswer: "C",
    explanation:
      "Modelos de nuvem (NIST): IaaS (Infrastructure as a Service) — VMs, redes, armazenamento. Cliente gerencia SO, runtime, dados, apps. Ex: AWS EC2, Azure VMs. PaaS (Platform as a Service) — plataforma de desenvolvimento. Cliente gerencia apenas apps e dados. Ex: Heroku, Google App Engine. SaaS (Software as a Service) — software pronto via navegador. Cliente não gerencia nada além do uso. Ex: Gmail, Office 365, Salesforce. Quanto mais alto o nível (IaaS→PaaS→SaaS), menor o controle e maior a abstração.",
  },

  // --- Contêineres (médio) ---
  {
    id: "sd_conteineres_001",
    topic: "Sistemas Distribuídos",
    macroarea: "Desenvolvimento",
    element: "Contêineres",
    difficulty: "médio" as const,
    statement:
      "Sobre contêineres (containers) e sua relação com máquinas virtuais (VMs), é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "Contêineres e VMs são tecnicamente idênticos, a diferença é apenas o nome comercial." },
      { letter: "B", text: "Contêineres compartilham o kernel do sistema operacional hospedeiro e empacotam a aplicação com suas dependências em namespaces isolados, sendo mais leves e rápidos de iniciar que VMs, que incluem um SO convidado completo." },
      { letter: "C", text: "VMs são mais leves que contêineres pois não precisam de sistema operacional." },
      { letter: "D", text: "Contêineres oferecem maior isolamento e segurança que VMs pois utilizam hardware de virtualização." },
      { letter: "E", text: "Contêineres só podem executar aplicações escritas em linguagens compiladas como C e Go." },
    ],
    correctAnswer: "B",
    explanation:
      "Contêineres (ex: Docker) compartilham o kernel do host, utilizando namespaces (isolamento de processos, redes, filesystems) e cgroups (limites de recursos). Empacotam app + dependências. Vantagens: leves (MBs vs GBs de VM), início rápido (segundos vs minutos), alta densidade. VMs (ex: VMware, KVM) incluem hypervisor + SO convidado completo → maior isolamento, mas mais pesadas. Contêineres não oferecem isolamento de hardware como VMs (concern de segurança em multi-tenant).",
  },

  // --- MapReduce (difícil) ---
  {
    id: "sd_mapreduce_001",
    topic: "Sistemas Distribuídos",
    macroarea: "Desenvolvimento",
    element: "MapReduce",
    difficulty: "difícil" as const,
    statement:
      "Uma empresa precisa processar 5 TB de logs de servidor para contar quantas vezes cada endereço IP acessou o servidor. Utilizando o paradigma MapReduce, como seriam as fases Map e Reduce?",
    alternatives: [
      { letter: "A", text: "Map: lê cada linha e emite <IP, 1>. Reduce: para cada IP, soma todos os 1s emitidos, resultando no total de acessos por IP." },
      { letter: "B", text: "Map: lê todas as linhas e emite <total, IP>. Reduce: soma todos os IPs." },
      { letter: "C", text: "Map: emite <1, IP> invertido. Reduce: ordena os IPs por contagem." },
      { letter: "D", text: "Map: conta os IPs localmente e emite o resultado final. Reduce: não é necessária." },
      { letter: "E", text: "Map: agrupa os IPs em buckets. Reduce: concatena os buckets em um arquivo de saída." },
    ],
    correctAnswer: "A",
    explanation:
      "MapReduce para Word Count (adaptado para IP counting): Fase Map: cada mapper lê um bloco de logs, e para cada linha extrai o IP e emite o par <IP, 1>. Fase Shuffle/Sort: o framework agrupa todos os pares pela chave (IP): IP1 → [1, 1, 1], IP2 → [1, 1]. Fase Reduce: para cada IP, soma a lista de valores: IP1 → 3, IP2 → 2. Esse é o exemplo clássico de MapReduce que demonstra sua capacidade de paralelizar o processamento em grandes volumes de dados de forma escalável.",
  },

  // --- Sistemas P2P (médio) ---
  {
    id: "sd_p2p_001",
    topic: "Sistemas Distribuídos",
    macroarea: "Desenvolvimento",
    element: "Sistemas P2P",
    difficulty: "médio" as const,
    statement:
      "Sobre redes Peer-to-Peer (P2P), é correto afirmar que a principal diferença entre P2P puro (pure P2P) e P2P híbrido em relação à arquitetura cliente-servidor é:",
    alternatives: [
      { letter: "A", text: "No P2P puro, todos os nós são iguais e funcionam simultaneamente como clientes e servidores, sem um nó central; no P2P híbrido, existe um servidor central para indexação/busca, mas a transferência de dados ocorre entre os pares." },
      { letter: "B", text: "No P2P puro, existe um servidor central que armazena todos os dados; no P2P híbrido, os dados ficam apenas nos servidores." },
      { letter: "C", text: "O P2P puro é mais lento que cliente-servidor, pois não tem servidores para processar requisições." },
      { letter: "D", text: "O P2P híbrido é idêntico ao modelo cliente-servidor tradicional, sem nenhuma diferença." },
      { letter: "E", text: "Redes P2P não suportam escalabilidade, sendo limitadas a poucos nós." },
    ],
    correctAnswer: "A",
    explanation:
      "P2P puro (ex: Gnutella clássico): não há servidor central, todos os nós são peers iguais (simétricos), atuando como cliente e servidor. Descoberta é por flooding ou DHT (Distributed Hash Tables). P2P híbrido (ex: BitTorrent com tracker, Napster): servidor central para metadados/indexação/busca, mas transferência de dados entre peers. Vantagens P2P: escalabilidade (quanto mais nós, mais recursos), não há gargalo central, tolerância a falhas. Desvantagens: busca pode ser ineficiente, segurança desafiadora.",
  },

  // --- Relógios lógicos (difícil) ---
  {
    id: "sd_relogios_001",
    topic: "Sistemas Distribuídos",
    macroarea: "Desenvolvimento",
    element: "Relógios lógicos",
    difficulty: "difícil" as const,
    statement:
      "Três processos P1, P2 e P3 executam os seguintes eventos com relógios lógicos de Lamport:\nP1: a(local), b(envia msg para P2), c(recebe msg de P3), d(local)\nP2: e(local), f(recebe msg de P1), g(envia msg para P3), h(local)\nP3: i(local), j(envia msg para P1), k(recebe msg de P2), l(local)\nSe os relógios lógicos iniciais são todos 0, qual é o valor do relógio lógico de Lamport no evento k de P3?",
    alternatives: [
      { letter: "A", text: "2" },
      { letter: "B", text: "3" },
      { letter: "C", text: "4" },
      { letter: "D", text: "5" },
      { letter: "E", text: "6" },
    ],
    correctAnswer: "D",
    explanation:
      "Regra de Lamport: (1) antes de cada evento, LC = LC + 1; (2) ao enviar, inclui LC; (3) ao receber, LC = max(LC_recebido, LC_local) + 1.\n\nP1: a=1, b=2 (envia msg ts=2 para P2)\nP2: e=1, f=max(1,2)+1=3 (recebe de P1), g=4 (envia msg ts=4 para P3)\nP3: i=1, j=2 (envia msg ts=2 para P1)\n\nEvento k de P3 (recebe de P2): LC_P3=2 (após j). Msg de P2 tem ts=4.\nk = max(2, 4) + 1 = 5.",
  },
];
