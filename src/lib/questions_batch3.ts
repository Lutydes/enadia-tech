// ENADE-style questions for Computer Science - Batch 3 (Microareas 11-15)
// Microarea 11: Criptografia | Microarea 12: Inteligência Artificial
// Microarea 13: Ciência de Dados | Microarea 14: Ética Profissional | Microarea 15: Legislação

interface EnadeQuestionBatch3 {
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

export const questionsBatch3: EnadeQuestionBatch3[] = [
  // =============================================================================
  // MICROAREA 11: CRIPTOGRAFIA (9 questions)
  // Elements: Criptografia simétrica, Criptografia assimétrica, Funções hash,
  //           Assinatura digital, Certificados e PKI, SSL/TLS, Esteganografia,
  //           Criptoanálise, Gestão de chaves, LGPD e privacidade
  // =============================================================================

  // --- Criptografia Simétrica ---
  {
    id: "cripto_simetrica_001",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "Criptografia simétrica",
    difficulty: "fácil" as const,
    statement:
      "Um analista de segurança de uma empresa está avaliando algoritmos de criptografia simétrica para proteger a comunicação entre dois servidores internos. Considerando os algoritmos AES-128, AES-256, 3DES e Blowfish, qual alternativa apresenta a afirmação correta?",
    alternatives: [
      {
        letter: "A",
        text: "O 3DES é mais seguro que o AES-256, pois utiliza três camadas de criptografia DES, totalizando uma chave efetiva de 192 bits.",
      },
      {
        letter: "B",
        text: "O AES-256 é recomendado pela NIST para proteção de dados de alto sigilo e utiliza chaves de 256 bits, sendo significativamente mais seguro que o 3DES.",
      },
      {
        letter: "C",
        text: "O Blowfish é o algoritmo padrão atual para comunicação governamental, pois não possui limitações no tamanho da chave.",
      },
      {
        letter: "D",
        text: "Na criptografia simétrica, a chave de cifragem e a chave de decifragem são diferentes, por isso o nome 'simétrica'.",
      },
      {
        letter: "E",
        text: "O AES opera com blocos de tamanho variável, adaptando-se automaticamente ao tamanho da mensagem sem necessidade de padding.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "O AES (Advanced Encryption Standard) é o algoritmo simétrico recomendado pela NIST desde 2001. O AES-256 utiliza chaves de 256 bits e é aprovado para proteção de dados de alto sigilo pelo governo dos EUA. O 3DES, embora utilize três cifras DES em sequência, possui bloco de 64 bits (vulnerável ao ataque sweet32) e é consideravelmente mais lento que o AES. Na criptografia simétrica, a mesma chave é usada para cifrar e decifrar, sendo o grande desafio a distribuição segura dessa chave.",
  },
  {
    id: "cripto_simetrica_002",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "Criptografia simétrica",
    difficulty: "médio" as const,
    statement:
      "Uma aplicação bancária precisa criptografar mensagens de comprimento variável utilizando o algoritmo AES em modo CBC (Cipher Block Chaining). Sobre o funcionamento desse modo de operação, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "No modo CBC, cada bloco é cifrado de forma independente, sem depender dos blocos anteriores, o que permite processamento paralelo na cifragem.",
      },
      {
        letter: "B",
        text: "No modo CBC, cada bloco de texto cifrado é obtido pela operação XOR entre o bloco de texto claro e o bloco cifrado anterior, sendo o primeiro bloco combinado com um vetor de inicialização (IV).",
      },
      {
        letter: "C",
        text: "O modo CBC dispensa o uso de vetor de inicialização (IV), pois a dependência entre blocos adjacentes garante segurança suficiente.",
      },
      {
        letter: "D",
        text: "No modo CBC, o IV deve ser mantido em segredo e reutilizado para todas as mensagens cifradas com a mesma chave.",
      },
      {
        letter: "E",
        text: "O modo CBC é vulnerável a ataques de replay apenas quando utilizado com AES-128, sendo seguro com AES-256.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "No modo CBC, o processo de cifragem funciona da seguinte forma: C_i = E_K(P_i XOR C_{i-1}), onde C_0 é o IV (Initialization Vector). Isso significa que cada bloco cifrado depende de todos os blocos anteriores, propagando erros e dificultando ataques. O IV deve ser aleatório e único para cada mensagem (não precisa ser secreto em CBC, mas nunca deve ser reutilizado). O ECB (Electronic Codebook) é o modo que cifra blocos independentemente e não deve ser usado.",
  },

  // --- Criptografia Assimétrica ---
  {
    id: "cripto_assimetrica_001",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "Criptografia assimétrica",
    difficulty: "médio" as const,
    statement:
      "Uma startup de fintech precisa implementar um sistema em que os clientes possam enviar dados confidenciais para o servidor, e o servidor também precise enviar respostas assinadas digitalmente. Utilizando criptografia assimétrica com o par de chaves RSA, qual combinação de operações garante tanto a confidencialidade quanto a autenticidade?",
    alternatives: [
      {
        letter: "A",
        text: "O cliente cifra com sua chave privada e o servidor decifra com a chave pública do cliente; o servidor assina com sua chave pública.",
      },
      {
        letter: "B",
        text: "O cliente cifra com a chave pública do servidor (confidencialidade) e o servidor decifra com sua chave privada; o servidor assina a resposta com sua chave privada e o cliente verifica com a chave pública do servidor (autenticidade).",
      },
      {
        letter: "C",
        text: "O cliente cifra com a chave privada do servidor e o servidor decifra com sua própria chave privada; o servidor assina com a chave pública do cliente.",
      },
      {
        letter: "D",
        text: "Tanto o cliente quanto o servidor utilizam apenas chaves públicas para todas as operações de cifragem e assinatura.",
      },
      {
        letter: "E",
        text: "O cliente cifra com a chave privada do servidor para confidencialidade e o servidor assina com a chave pública do cliente para autenticidade.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "Na criptografia assimétrica (RSA), a regra fundamental é: o que é cifrado com uma chave só pode ser decifrado com a chave correspondente do par. Para confidencialidade: cifra-se com a chave pública do destinatário (somente ele com sua chave privada pode decifrar). Para autenticidade (assinatura digital): assina-se com a chave privada do remetente (qualquer um com a chave pública pode verificar). A alternativa B descreve corretamente ambos os fluxos.",
  },
  {
    id: "cripto_assimetrica_002",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "Criptografia assimétrica",
    difficulty: "difícil" as const,
    statement:
      "Um sistema utiliza o algoritmo RSA com chave de 2048 bits para criptografia assimétrica. Sabe-se que a segurança do RSA se baseia na dificuldade computacional de fatorar o produto de dois números primos grandes. Considerando os avanços em computação quântica, especificamente o algoritmo de Shor, qual afirmação é correta?",
    alternatives: [
      {
        letter: "A",
        text: "O algoritmo de Shor pode fatorar números primos grandes em tempo polinomial, tornando o RSA inseguro quando computadores quânticos suficientemente potentes estiverem disponíveis.",
      },
      {
        letter: "B",
        text: "O algoritmo de Shor afeta apenas a criptografia simétrica, não impactando a segurança do RSA ou de outros algoritmos assimétricos.",
      },
      {
        letter: "C",
        text: "O RSA com chaves de 4096 bits é completamente imune ao algoritmo de Shor, mesmo com computadores quânticos de grande escala.",
      },
      {
        letter: "D",
        text: "O algoritmo de Shor opera em tempo exponencial, portanto computadores quânticos não oferecem vantagem significativa na fatoração de inteiros.",
      },
      {
        letter: "E",
        text: "A simples duplicação do tamanho da chave RSA para 4096 bits resolve completamente a ameaça da computação quântica, sem necessidade de algoritmos pós-quânticos.",
      },
    ],
    correctAnswer: "A",
    explanation:
      "O algoritmo de Shor (1994) é um algoritmo quântico capaz de fatorar inteiros em tempo polinomial O((log n)³), o que quebra a premissa de segurança do RSA. Atualmente, computadores quânticos não possuem qubits suficientes e estáveis para ameaçar o RSA-2048 na prática, mas a comunidade criptográfica já pesquisa algoritmos pós-quânticos (lattice-based, hash-based, code-based) como substitutos. Algoritmos de criptografia simétrica são ameaçados pelo algoritmo de Grover (não Shor), que oferece apenas aceleração quadrática.",
  },

  // --- Funções Hash ---
  {
    id: "cripto_hash_001",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "Funções hash",
    difficulty: "fácil" as const,
    statement:
      "Uma empresa desenvolvedora de software precisa armazenar as senhas dos usuários de forma segura em seu banco de dados. Um analista de segurança propôs o uso de funções hash para esse fim. Sobre as propriedades e o uso adequado de funções hash para armazenamento de senhas, qual alternativa é correta?",
    alternatives: [
      {
        letter: "A",
        text: "Funções hash são ideais para armazenamento de senhas porque são reversíveis, permitindo que o sistema recupere a senha original quando necessário.",
      },
      {
        letter: "B",
        text: "O uso de funções hash como MD5 ou SHA-1 com um salt (valor aleatório) por usuário é a prática recomendada atualmente para armazenamento de senhas.",
      },
      {
        letter: "C",
        text: "Funções hash criptográficas são funções unidirecionais que produzem um valor fixo (digest) a partir de uma entrada de qualquer tamanho, e o uso de funções lentas e com salt (como bcrypt ou Argon2) é recomendado para senhas.",
      },
      {
        letter: "D",
        text: "A função SHA-256 é recomendada para senhas, mas nunca deve ser combinada com salt, pois isso compromete a segurança do hash.",
      },
      {
        letter: "E",
        text: "O armazenamento de senhas em texto claro é aceitável quando o banco de dados é protegido por firewall, dispensando o uso de funções hash.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "Funções hash criptográficas são unidirecionais: dado h(m), é computacionalmente inviável recuperar m. Para armazenamento de senhas, recomenda-se: (1) usar funções hash projetadas para senhas (bcrypt, Argon2, scrypt), que são intencionalmente lentas para dificultar ataques de força bruta; (2) usar salt aleatório por usuário para evitar ataques com rainbow tables. MD5 e SHA-1 são considerados quebrados para fins de segurança. SHA-256 é seguro, mas rápido demais para senhas.",
  },
  {
    id: "cripto_hash_002",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "Funções hash",
    difficulty: "médio" as const,
    statement:
      "Ao analisar as propriedades de segurança de funções hash criptográficas, um pesquisador enumerou três propriedades fundamentais: resistência à preimagem, resistência à segunda preimagem e resistência a colisão. Considere as seguintes afirmações:\n\nI. A resistência à preimagem garante que, dado um hash h, seja computacionalmente inviável encontrar qualquer mensagem m tal que hash(m) = h.\nII. A resistência à segunda preimagem garante que, dada uma mensagem m₁, seja inviável encontrar m₂ ≠ m₁ tal que hash(m₁) = hash(m₂).\nIII. A resistência a colisão é uma propriedade mais forte que a resistência à segunda preimagem, pois exige que seja inviável encontrar qualquer par (m₁, m₂) com m₁ ≠ m₂ que produza o mesmo hash.\n\nQuais estão corretas?",
    alternatives: [
      { letter: "A", text: "Apenas I." },
      { letter: "B", text: "Apenas I e II." },
      { letter: "C", text: "Apenas II e III." },
      { letter: "D", text: "I, II e III." },
      { letter: "E", text: "Nenhuma." },
    ],
    correctAnswer: "D",
    explanation:
      "As três afirmações estão corretas. A hierarquia de força é: resistência a colisão > resistência à segunda preimagem > resistência à preimagem. Isto é, se uma função é resistente a colisões, ela necessariamente é resistente à segunda preimagem e à preimagem. Devido ao paradoxo do aniversário, uma função com n-bits de saída oferece apenas 2^(n/2) de segurança contra colisão, mas 2^n contra preimagem e segunda preimagem. Por isso, o SHA-256 oferece 128 bits de segurança contra colisão.",
  },

  // --- Assinatura Digital ---
  {
    id: "cripto_assinatura_001",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "Assinatura digital",
    difficulty: "médio" as const,
    statement:
      "Um advogado precisa enviar um contrato digital assinado para um cliente, garantindo a autenticidade, a integridade e o não repúdio do documento. Utilizando o padrão PKCS#7 de assinatura digital com RSA, qual é a ordem correta das operações realizadas pelo advogado ao assinar o documento?",
    alternatives: [
      {
        letter: "A",
        text: "Cifrar o documento com a chave privada do advogado e enviar o resultado para que o cliente decifre com a chave pública do advogado.",
      },
      {
        letter: "B",
        text: "Calcular o hash do documento e, em seguida, cifrar esse hash com a chave privada do advogado, anexando o resultado ao documento original.",
      },
      {
        letter: "C",
        text: "Calcular o hash do documento e cifrar o documento inteiro com a chave pública do cliente, sem necessidade de chave privada.",
      },
      {
        letter: "D",
        text: "Cifrar o documento com a chave pública do cliente e, em seguida, cifrar novamente com a chave privada do advogado.",
      },
      {
        letter: "E",
        text: "Enviar o documento em texto claro junto com a chave pública do advogado para que o cliente verifique a autenticidade.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "A assinatura digital funciona em três passos: (1) calcula-se o hash (resumo) do documento; (2) o hash é cifrado com a chave privada do remetente, gerando a assinatura; (3) a assinatura é anexada ao documento. O destinatário verifica: calcula o hash do documento recebido, decifra a assinatura com a chave pública do remetente e compara os dois hashes. Se forem iguais, o documento é autêntico e íntegro. Cifrar o documento inteiro com a chave privada seria ineficiente para documentos grandes.",
  },
  {
    id: "cripto_assinatura_002",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "Assinatura digital",
    difficulty: "difícil" as const,
    statement:
      "Em um sistema de votação eletrônica, cada eleitor assina digitalmente seu voto utilizando o algoritmo ECDSA (Elliptic Curve Digital Signature Algorithm). Comparando o ECDSA com o RSA para assinatura digital, qual afirmação é correta?",
    alternatives: [
      {
        letter: "A",
        text: "O ECDSA requer chaves significativamente maiores que o RSA para atingir o mesmo nível de segurança, sendo por isso menos eficiente.",
      },
      {
        letter: "B",
        text: "O ECDSA opera sobre curvas elípticas e, com uma chave de 256 bits, oferece nível de segurança comparável ao RSA com chave de 3072 bits, sendo mais eficiente em termos computacionais e de tamanho de assinatura.",
      },
      {
        letter: "C",
        text: "O ECDSA não pode ser utilizado para assinatura digital de documentos, sendo restrito a protocolos de troca de chaves como ECDH.",
      },
      {
        letter: "D",
        text: "O RSA é sempre superior ao ECDSA para assinatura digital, pois oferece tanto confidencialidade quanto assinatura em uma única operação.",
      },
      {
        letter: "E",
        text: "O ECDSA utiliza operações de fatoração de números primos, assim como o RSA, diferenciando-se apenas na representação das chaves.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "O ECDSA baseia-se na dificuldade do Problema do Logaritmo Discreto em Curvas Elípticas (ECDLP). Sua principal vantagem sobre o RSA é a eficiência: uma chave ECDSA de 256 bits equivale em segurança a uma chave RSA de ~3072 bits. Isso resulta em assinaturas menores, operações mais rápidas e menor consumo de banda e armazenamento. Por isso, ECDSA é amplamente utilizado em criptomoedas (Bitcoin, Ethereum), TLS e certificados digitais.",
  },

  // --- SSL/TLS ---
  {
    id: "cripto_ssl_tls_001",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "SSL/TLS",
    difficulty: "médio" as const,
    statement:
      "Ao acessar o site de um banco, um usuário observa que o navegador exibe um cadeado e o endereço começa com 'https://'. O protocolo TLS (Transport Layer Security) 1.3 é utilizado para proteger a comunicação. Sobre o handshake TLS 1.3, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "O TLS 1.3 requer duas vias completas (four-way handshake) para estabelecer a sessão, como nas versões anteriores do TLS.",
      },
      {
        letter: "B",
        text: "O TLS 1.3 elimina o suporte a cifras simétricas, utilizando exclusivamente criptografia assimétrica em todas as fases da comunicação.",
      },
      {
        letter: "C",
        text: "O TLS 1.3 foi projetado para ser mais rápido e seguro, consolidando o handshake em uma única viagem (1-RTT) e removendo suporte a algoritmos e modos considerados inseguros, como RC4, DES e CBC estático.",
      },
      {
        letter: "D",
        text: "O TLS 1.3 mantém compatibilidade total com o SSL 3.0, permitindo fallback automático para clientes legados.",
      },
      {
        letter: "E",
        text: "No TLS 1.3, o certificado digital é opcional, pois a autenticação é realizada exclusivamente por chaves pré-compartilhadas (PSK).",
      },
    ],
    correctAnswer: "C",
    explanation:
      "O TLS 1.3 (RFC 8446) é uma grande simplificação e melhoria em relação ao TLS 1.2. Principais mudanças: (1) handshake em 1-RTT (com opção de 0-RTT para sessões retomadas); (2) remoção de algoritmos inseguros (RC4, DES, 3DES, CBC estático, MD5, SHA-224); (3) suporte apenas a AES-GCM, ChaCha20-Poly1305 como cifras AEAD; (4) obrigação de cifras forward-secret (DHE ou ECDHE); (5) eliminação de negociação de versão legada. SSL 3.0 foi completamente descontinuado e não é suportado.",
  },

  // --- Esteganografia ---
  {
    id: "cripto_estego_001",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "Esteganografia",
    difficulty: "médio" as const,
    statement:
      "Uma organização utiliza a técnica de esteganografia em imagens para comunicar-se com seus agentes de campo. Sobre a diferença fundamental entre esteganografia e criptografia, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "Esteganografia e criptografia são sinônimos, ambas utilizando algoritmos matemáticos para tornar dados incompreensíveis.",
      },
      {
        letter: "B",
        text: "A criptografia oculta o significado da mensagem, enquanto a esteganografia oculta a existência da mensagem, embutindo-a em um objeto de mídia aparentemente inofensivo.",
      },
      {
        letter: "C",
        text: "A esteganografia é superior à criptografia porque não necessita de chave secreta para proteger a informação.",
      },
      {
        letter: "D",
        text: "A criptografia altera o tamanho do arquivo original de forma perceptível, enquanto a esteganografia mantém o tamanho exato sem qualquer alteração.",
      },
      {
        letter: "E",
        text: "A esteganografia só pode ser aplicada a arquivos de texto, enquanto a criptografia se aplica a qualquer tipo de arquivo digital.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "A esteganografia (do grego 'escrita coberta') visa ocultar a existência da mensagem dentro de um portador (imagem, áudio, vídeo, texto). A criptografia (do grego 'escrita secreta') torna a mensagem incompreensível, mas não oculta sua existência. Técnicas comuns de esteganografia em imagens incluem LSB (modificação dos bits menos significativos dos pixels), spread spectrum e inserção em domínios de frequência. Na prática, esteganografia e criptografia são frequentemente combinadas: a mensagem é primeiro cifrada e depois embutida por esteganografia.",
  },

  // --- Criptoanálise ---
  {
    id: "cripto_criptoanalise_001",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "Criptoanálise",
    difficulty: "difícil" as const,
    statement:
      "Um analista de segurança está estudando técnicas de criptoanálise e se depara com o ataque conhecido como 'meet-in-the-middle'. Esse ataque é particularmente relevante para qual dos cenários a seguir?",
    alternatives: [
      {
        letter: "A",
        text: "Ataques a funções hash SHA-256 por meio de tabelas arco-íris (rainbow tables) pré-computadas.",
      },
      {
        letter: "B",
        text: "Ataques ao cifrador 3DES (Triple DES), reduzindo a segurança efetiva de 168 bits para aproximadamente 112 bits, em vez dos 2^168 teóricos.",
      },
      {
        letter: "C",
        text: "Ataques ao protocolo TLS por interceptação do handshake e modificação dos parâmetros de cifra.",
      },
      {
        letter: "D",
        text: "Ataques ao AES-256 explorando vulnerabilidades no modo de operação ECB.",
      },
      {
        letter: "E",
        text: "Ataques de força bruta a senhas armazenadas com bcrypt usando aceleração por GPU.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "O ataque meet-in-the-middle é uma técnica criptoanalítica que reduz significativamente a complexidade de ataques a cifradores compostos (como o 3DES). No 3DES com duas chaves (K1, K2): E(K1, D(K2, E(K1, m))). Em vez de testar todas as 2^168 combinações de (K1, K2), o atacante cifra o texto claro com todas as 2^56 chaves K1 possíveis e decifra o texto cifrado com todas as 2^56 chaves K2 possíveis, buscando uma coincidência no meio. A complexidade cai de 2^168 para 2^56 × 2 = 2^57 operações com 2^56 de armazenamento, reduzindo a segurança efetiva para ~112 bits.",
  },

  // --- Gestão de Chaves ---
  {
    id: "cripto_gestao_chaves_001",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "Gestão de chaves",
    difficulty: "médio" as const,
    statement:
      "Uma corporação com 500 funcionários precisa implementar um sistema de criptografia em que cada par de funcionários possa se comunicar de forma segura utilizando criptografia simétrica. Se fosse necessário gerar uma chave secreta exclusiva para cada par de funcionários, quantas chaves seriam necessárias no total?",
    alternatives: [
      { letter: "A", text: "500 chaves (uma por funcionário)." },
      { letter: "B", text: "1.000 chaves (duas por funcionário)." },
      { letter: "C", text: "124.750 chaves (combinação de 500, 2 a 2)." },
      { letter: "D", text: "250.000 chaves (500 × 500)." },
      { letter: "E", text: "249.500 chaves (500² - 500)." },
    ],
    correctAnswer: "C",
    explanation:
      "O problema do escalonamento de chaves simétricas é descrito pela fórmula C(n,2) = n(n-1)/2. Para 500 funcionários: 500 × 499 / 2 = 124.750 chaves. Esse é o principal motivo pelo qual a criptografia assimétrica é preferida em ambientes com muitos usuários: na assimétrica, cada usuário possui apenas um par de chaves (pública + privada), totalizando 1.000 chaves para 500 usuários. O problema da distribuição de chaves simétricas é um dos fatores que motivou o desenvolvimento da criptografia de chave pública por Diffie e Hellman em 1976.",
  },

  // =============================================================================
  // MICROAREA 12: INTELIGÊNCIA ARTIFICIAL (9 questions)
  // Elements: Busca, Aprendizado de máquina, Redes neurais, Overfitting e underfitting,
  //           Regressão e classificação, NLP, Visão computacional, Ética em IA,
  //           Agentes inteligentes, Métricas de avaliação
  // =============================================================================

  // --- Busca ---
  {
    id: "ia_busca_001",
    topic: "Inteligência Artificial",
    macroarea: "Segurança/IA",
    element: "Busca",
    difficulty: "médio" as const,
    statement:
      "Um sistema de navegação GPS precisa encontrar o menor caminho entre duas cidades em um mapa rodoviário. O grafo representa cidades como vértices e estradas como arestas com pesos correspondentes às distâncias. Utilizando o algoritmo A* (A-estrela) com uma heurística admissível, qual afirmação é correta?",
    alternatives: [
      {
        letter: "A",
        text: "O algoritmo A* sempre encontra o caminho mais curto, mesmo quando a heurística superestima o custo real até o destino.",
      },
      {
        letter: "B",
        text: "O algoritmo A* com heurística admissível (nunca superestima o custo) é completo e ótimo, encontrando sempre o menor caminho quando utilizado em grafos com custos positivos.",
      },
      {
        letter: "C",
        text: "O A* é equivalente à busca em largura (BFS) quando a heurística é nula (h=0), perdendo a garantia de optimalidade.",
      },
      {
        letter: "D",
        text: "O A* sempre expande menos nós que o algoritmo de Dijkstra, independentemente da qualidade da heurística.",
      },
      {
        letter: "E",
        text: "O A* não funciona em grafos com pesos, sendo restrito a grafos não ponderados.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "O algoritmo A* combina o custo acumulado g(n) com a heurística h(n) para avaliar nós: f(n) = g(n) + h(n). Com uma heurística admissível (nunca superestima), A* é completo (encontra solução se existir) e ótimo (encontra o menor caminho) em grafos com custos positivos. Quando h(n) = 0, A* se reduz a Dijkstra. Quanto mais informativa (mais próxima do custo real) for a heurística, mais eficiente será a busca. Heurísticas que superestimam podem comprometer a optimalidade.",
  },

  // --- Aprendizado de Máquina ---
  {
    id: "ia_ml_001",
    topic: "Inteligência Artificial",
    macroarea: "Segurança/IA",
    element: "Aprendizado de máquina",
    difficulty: "fácil" as const,
    statement:
      "Uma equipe de data science precisa classificar e-mails como 'spam' ou 'não spam' com base no conteúdo textual. O conjunto de dados contém 10.000 e-mails rotulados manualmente. Qual tipo de aprendizado de máquina é mais adequado para esse problema?",
    alternatives: [
      {
        letter: "A",
        text: "Aprendizado não supervisionado, pois o sistema precisa descobrir padrões nos e-mails sem conhecimento prévio sobre quais são spam.",
      },
      {
        letter: "B",
        text: "Aprendizado por reforço, pois o sistema deve aprender através de tentativa e erro, recebendo recompensas ao classificar corretamente.",
      },
      {
        letter: "C",
        text: "Aprendizado supervisionado, pois os dados de treinamento possuem rótulos (labels) que indicam a classe correta de cada e-mail.",
      },
      {
        letter: "D",
        text: "Aprendizado semi-supervisionado, pois a presença de rótulos torna o problema impossível de resolver com aprendizado supervisionado.",
      },
      {
        letter: "E",
        text: "Aprendizado por transferência, pois é necessário transferir conhecimento entre diferentes domínios de classificação.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "No aprendizado supervisionado, o modelo é treinado com dados rotulados, ou seja, cada exemplo possui uma entrada (conteúdo do e-mail) e uma saída esperada (spam/não spam). Algoritmos como Naive Bayes, SVM, Árvore de Decisão e Random Forest são adequados para esse tipo de problema de classificação binária. O aprendizado não supervisionado não utiliza rótulos (ex: clustering), e o aprendizado por reforço aprende através de interação com um ambiente (ex: jogos, robótica).",
  },

  // --- Redes Neurais ---
  {
    id: "ia_rn_001",
    topic: "Inteligência Artificial",
    macroarea: "Segurança/IA",
    element: "Redes neurais",
    difficulty: "médio" as const,
    statement:
      "Uma empresa está desenvolvendo uma rede neural artificial para reconhecimento de imagens. A rede possui as seguintes camadas: uma camada de entrada com 784 neurônios (imagens 28×28 pixels), duas camadas ocultas com 128 e 64 neurônios respectivamente (ambas com ativação ReLU), e uma camada de saída com 10 neurônios (classificação de dígitos 0-9) com ativação softmax. Sobre essa arquitetura, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "A ativação softmax na camada de saída é inadequada para problemas de classificação multiclasse, devendo ser substituída por sigmoid.",
      },
      {
        letter: "B",
        text: "A função de ativação ReLU introduz linearidade na rede, tornando-a incapaz de aprender padrões complexos nos dados.",
      },
      {
        letter: "C",
        text: "A camada de saída com 10 neurônios e ativação softmax produz uma distribuição de probabilidade sobre as 10 classes, sendo a classe prevista aquela com maior probabilidade de saída.",
      },
      {
        letter: "D",
        text: "Essa rede é classificada como rede neural convolucional (CNN), pois possui múltiplas camadas ocultas.",
      },
      {
        letter: "E",
        text: "O número total de neurônios da rede é 784 + 128 + 64 + 10 = 986, e esse é o número total de parâmetros treináveis.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "A ativação softmax converte os valores de saída em uma distribuição de probabilidade (valores entre 0 e 1 que somam 1). Cada neurônio de saída representa a probabilidade da imagem pertencer a uma classe. A classe prevista é argmax da saída softmax. A ReLU (f(x) = max(0, x)) introduz não linearidade, essencial para aprender padrões complexos. Essa rede é uma MLP (Multilayer Perceptron), não uma CNN. O número de parâmetros é muito maior que o número de neurônios, pois cada conexão entre camadas possui um peso (pesos + biases).",
  },
  {
    id: "ia_rn_002",
    topic: "Inteligência Artificial",
    macroarea: "Segurança/IA",
    element: "Redes neurais",
    difficulty: "difícil" as const,
    statement:
      "Uma equipe de pesquisa está implementando uma rede neural convolucional (CNN) para detecção de câncer de pele em imagens dermatológicas. A arquitetura inclui camadas convolucionais, camadas de pooling e camadas fully connected. Sobre o funcionamento das camadas convolucionais, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "A convolução é uma operação que aplica um filtro (kernel) deslizante sobre a imagem, gerando mapas de características que detectam padrões locais como bordas, texturas e formas.",
      },
      {
        letter: "B",
        text: "Cada camada convolucional reduz obrigatoriamente as dimensões espaciais da imagem pela metade, independentemente do tamanho do kernel e do padding.",
      },
      {
        letter: "C",
        text: "O stride (passo) do kernel deve ser sempre maior que o tamanho do kernel para evitar sobreposição nas regiões de convolução.",
      },
      {
        letter: "D",
        text: "Camadas convolucionais não possuem parâmetros treináveis, pois os filtros são definidos manualmente pelo projetista da rede.",
      },
      {
        letter: "E",
        text: "O padding 'valid' adiciona zeros ao redor da imagem para manter o tamanho da saída igual ao da entrada.",
      },
    ],
    correctAnswer: "A",
    explanation:
      "Na convolução, um filtro (kernel) de dimensões menores (ex: 3×3) desliza sobre a imagem e computa a soma ponderada dos valores na região coberta, gerando um mapa de ativação. Os pesos do kernel são aprendidos durante o treinamento (são parâmetros treináveis). O tamanho da saída depende do padding: 'same' mantém o tamanho (com padding), 'valid' reduz (sem padding). O stride controla o deslocamento do kernel. Camadas de pooling (como max pooling) são responsáveis por reduzir as dimensões espaciais e controlar overfitting.",
  },

  // --- Overfitting e Underfitting ---
  {
    id: "ia_overfitting_001",
    topic: "Inteligência Artificial",
    macroarea: "Segurança/IA",
    element: "Overfitting e underfitting",
    difficulty: "médio" as const,
    statement:
      "Um cientista de dados treinou três modelos diferentes para prever o preço de imóveis e obteve os seguintes resultados de erro quadrático médio (MSE):\n\n- Modelo A: Treino MSE = 5.000, Teste MSE = 48.000\n- Modelo B: Treino MSE = 35.000, Teste MSE = 38.000\n- Modelo C: Treino MSE = 32.000, Teste MSE = 33.000\n\nAnalisando esses resultados, qual conclusão é mais adequada?",
    alternatives: [
      {
        letter: "A",
        text: "O Modelo A é o melhor, pois apresenta o menor erro no conjunto de treino, demonstrando alta capacidade de aprendizado.",
      },
      {
        letter: "B",
        text: "O Modelo B sofre de underfitting, pois o erro de treino é próximo do erro de teste e ambos são relativamente altos.",
      },
      {
        letter: "C",
        text: "O Modelo A apresenta overfitting (erro de treino muito baixo, erro de teste muito alto), o Modelo C apresenta o melhor balanceamento (erros similares e menores no teste), e o Modelo B está em uma situação intermediária.",
      },
      {
        letter: "D",
        text: "Os três modelos estão perfeitamente ajustados, pois apresentam erros diferentes no treino e no teste.",
      },
      {
        letter: "E",
        text: "O Modelo C sofre de overfitting severo, pois os erros de treino e teste são quase iguais.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "A análise do gap entre treino e teste é fundamental: (1) Overfitting: erro de treino muito menor que erro de teste (Modelo A: gap enorme de 43.000); (2) Underfitting: erros de treino e teste ambos altos (Modelo B); (3) Bom ajuste: erros de treino e teste similares e relativamente baixos (Modelo C). O Modelo A memorizou os dados de treino mas não generaliza. O Modelo C é o mais adequado, com boa generalização e menor erro de teste.",
  },

  // --- Regressão e Classificação ---
  {
    id: "ia_regressao_classif_001",
    topic: "Inteligência Artificial",
    macroarea: "Segurança/IA",
    element: "Regressão e classificação",
    difficulty: "fácil" as const,
    statement:
      "Uma empresa de saúde está desenvolvendo modelos de machine learning para dois problemas distintos: (I) prever a expectativa de vida de um paciente com base em seus exames, e (II) diagnosticar se um paciente tem diabetes ou não com base no nível de glicose. Sobre os tipos de aprendizado adequados para cada problema, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "Ambos os problemas são de regressão, pois envolvem variáveis numéricas contínuas.",
      },
      {
        letter: "B",
        text: "Ambos os problemas são de classificação, pois ambos envolvem categorização de pacientes.",
      },
      {
        letter: "C",
        text: "O problema (I) é de regressão (variável alvo contínua - expectativa de vida) e o problema (II) é de classificação (variável alvo categórica - tem ou não diabetes).",
      },
      {
        letter: "D",
        text: "O problema (I) é de classificação multiclasse e o problema (II) é de regressão logística, que é um tipo de regressão.",
      },
      {
        letter: "E",
        text: "Nenhum dos problemas pode ser resolvido por aprendizado supervisionado, pois dados de saúde exigem aprendizado não supervisionado por questões de privacidade.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "A distinção fundamental é o tipo da variável alvo: (1) Regressão: variável alvo contínua (ex: preço, temperatura, expectativa de vida). Algoritmos: regressão linear, regressão polinomial, SVR. (2) Classificação: variável alvo categórica (ex: sim/não, classes). Algoritmos: regressão logística (apesar do nome, é classificação), árvores de decisão, SVM, KNN. A regressão logística é um algoritmo de classificação que modela a probabilidade de pertencer a uma classe.",
  },

  // --- NLP ---
  {
    id: "ia_nlp_001",
    topic: "Inteligência Artificial",
    macroarea: "Segurança/IA",
    element: "NLP",
    difficulty: "difícil" as const,
    statement:
      "Uma empresa está desenvolvendo um chatbot para atendimento ao cliente utilizando técnicas de Processamento de Linguagem Natural (NLP). A equipe está avaliando diferentes abordagens para representar o significado das palavras (word embeddings). Sobre as técnicas de representação vetorial de palavras, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "O modelo Word2Vec utiliza uma matriz de coocorrência global para gerar embeddings, sendo equivalente ao modelo GloVe em sua abordagem.",
      },
      {
        letter: "B",
        text: "Os embeddings gerados por modelos como Word2Vec e GloVe capturam relações semânticas entre palavras, permitindo que operações aritméticas nos vetores expressem analogias (ex: rei - homem + mulher ≈ rainha).",
      },
      {
        letter: "C",
        text: "Word embeddings são limitados a representar apenas palavras individuais, sendo impossível gerar representações para frases ou documentos inteiros.",
      },
      {
        letter: "D",
        text: "O bag-of-words é superior aos word embeddings porque preserva a ordem das palavras no texto.",
      },
      {
        letter: "E",
        text: "A técnica TF-IDF produz embeddings densos de baixa dimensionalidade comparáveis aos gerados por modelos neurais.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "Word embeddings (Word2Vec, GloVe, FastText) mapeiam palavras para vetores densos em um espaço contínuo onde palavras semanticamente similares ficam próximas. A propriedade mais notável é que relações semânticas são capturadas como vetores: vetor('rei') - vetor('homem') + vetor('mulher') ≈ vetor('rainha'). Word2Vec usa contextos locais (CBOW ou Skip-gram), GloVe usa coocorrência global. Para frases/documentos, existem técnicas como sentence-BERT, Doc2Vec e médias de embeddings. Bag-of-words perde ordem e esparsidade, e TF-IDF não produz embeddings densos neurais.",
  },

  // --- Visão Computacional ---
  {
    id: "ia_visao_001",
    topic: "Inteligência Artificial",
    macroarea: "Segurança/IA",
    element: "Visão computacional",
    difficulty: "médio" as const,
    statement:
      "Um sistema de segurança perimetral utiliza câmeras para detectar a presença de intrusos em tempo real. O sistema emprega um modelo YOLO (You Only Look Once) para detecção de objetos. Sobre as características do YOLO em comparação com abordagens baseadas em regiões propostas (como R-CNN), qual afirmação é correta?",
    alternatives: [
      {
        letter: "A",
        text: "O YOLO é mais lento que o R-CNN porque processa cada região proposta individualmente em múltiplos estágios.",
      },
      {
        letter: "B",
        text: "O YOLO divide a imagem em uma grade e realiza previsões simultâneas de bounding boxes e classes em uma única passagem pela rede, sendo significativamente mais rápido que métodos baseados em regiões propostas.",
      },
      {
        letter: "C",
        text: "O YOLO não é capaz de detectar múltiplos objetos em uma mesma imagem, limitando-se a um objeto por frame.",
      },
      {
        letter: "D",
        text: "O YOLO aplica segmentação semântica como saída, gerando máscaras pixel a pixel para cada objeto detectado.",
      },
      {
        letter: "E",
        text: "O YOLO requer pré-processamento manual de seleção de regiões de interesse antes da inferência.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "O YOLO é uma família de modelos de detecção de objetos em tempo real. Sua inovação principal é tratar a detecção como um problema de regressão: divide a imagem em uma grade S×S e, em cada célula, prevê simultaneamente B bounding boxes (coordenadas, confiança) e C probabilidades de classe. Tudo isso em uma única passagem pela rede (single-stage detector). Isso o torna muito mais rápido que detectores de dois estágios (R-CNN, Faster R-CNN), que primeiro geram propostas de regiões e depois classificam cada uma. YOLO pode detectar múltiplos objetos simultaneamente.",
  },

  // --- Métricas de Avaliação ---
  {
    id: "ia_metricas_001",
    topic: "Inteligência Artificial",
    macroarea: "Segurança/IA",
    element: "Métricas de avaliação",
    difficulty: "médio" as const,
    statement:
      "Um hospital desenvolveu um modelo de machine learning para detectar câncer de mama em mamografias. O conjunto de teste possui 1.000 exames, dos quais 50 são casos positivos (com câncer) e 950 são negativos (sem câncer). O modelo identificou corretamente 40 casos positivos e 900 negativos. Com base nesses dados, o F1-score do modelo é aproximadamente:",
    alternatives: [
      { letter: "A", text: "0,40 (40%)" },
      { letter: "B", text: "0,53 (53%)" },
      { letter: "C", text: "0,80 (80%)" },
      { letter: "D", text: "0,89 (89%)" },
      { letter: "E", text: "0,94 (94%)" },
    ],
    correctAnswer: "B",
    explanation:
      "Calculando a matriz de confusão: Verdadeiros Positivos (VP) = 40, Falsos Positivos (FP) = 50 (950-900), Falsos Negativos (FN) = 10 (50-40), Verdadeiros Negativos (VN) = 900. Precisão = VP/(VP+FP) = 40/50 = 0,80. Recall (Sensibilidade) = VP/(VP+FN) = 40/50 = 0,80. F1-score = 2 × (Precisão × Recall)/(Precisão + Recall) = 2 × (0,80 × 0,80)/(0,80 + 0,80) = 2 × 0,64/1,60 = 0,80. Na verdade, os FPs são 1000-900-40=60, pois 900 corretos + 40 VP = 940, restando 60 negativos mal classificados. Precisão = 40/100 = 0,40. Recall = 40/50 = 0,80. F1 = 2(0,40×0,80)/(0,40+0,80) = 2×0,32/1,20 ≈ 0,53.",
  },

  // =============================================================================
  // MICROAREA 13: CIÊNCIA DE DADOS (9 questions)
  // Elements: Ciclo de vida do dado, Pré-processamento e limpeza,
  //           Análise exploratória EDA, Visualização de dados,
  //           Estatística descritiva e inferencial, Correlação e regressão,
  //           Big Data 5 Vs, Ferramentas, Pipelines de dados,
  //           Storytelling com dados
  // =============================================================================

  // --- Pré-processamento e Limpeza ---
  {
    id: "cd_preprocessamento_001",
    topic: "Ciência de Dados",
    macroarea: "Segurança/IA",
    element: "Pré-processamento e limpeza",
    difficulty: "médio" as const,
    statement:
      "Um cientista de dados está analisando um conjunto de dados de vendas com 10.000 registros. Ao verificar a qualidade dos dados, encontrou os seguintes problemas: 3% de valores ausentes na coluna 'preço', outliers extremos na coluna 'quantidade' e dados duplicados. Sobre as técnicas adequadas para tratamento desses problemas, qual alternativa é correta?",
    alternatives: [
      {
        letter: "A",
        text: "Valores ausentes devem ser sempre removidos (lista de exclusão), pois qualquer técnica de imputação introduz viés nos resultados.",
      },
      {
        letter: "B",
        text: "A remoção de outliers é sempre recomendada, pois dados discrepantes são erros de medição que prejudicam a análise.",
      },
      {
        letter: "C",
        text: "A imputação pela média é a técnica mais adequada para todas as situações de valores ausentes, independentemente da distribuição dos dados e do mecanismo de ausência.",
      },
      {
        letter: "D",
        text: "O tratamento adequado depende da análise de cada problema: valores ausentes podem ser tratados com imputação (média, mediana, KNN) ou remoção conforme o mecanismo (MCAR, MAR, MNAR); outliers exigem investigação antes da remoção; e duplicatas devem ser identificadas e tratadas conforme a causa (erro vs. registro legítimo).",
      },
      {
        letter: "E",
        text: "Dados duplicados nunca devem ser removidos, pois podem representar transações legítimas que ocorreram no mesmo instante.",
      },
    ],
    correctAnswer: "D",
    explanation:
      "O pré-processamento exige análise caso a caso: (1) Valores ausentes: a decisão entre remover ou imputar depende do mecanismo — MCAR (completamente aleatório) permite remoção segura; MAR (aleatório condicional) permite imputação; MNAR (não aleatório) requer cautela. Técnicas incluem imputação por média/mediana/moda, KNN, MICE. (2) Outliers: devem ser investigados antes da remoção — podem ser erros OU informações valiosas. (3) Duplicatas: verificam-se se são erros ou registros reais antes de remover.",
  },

  // --- Análise Exploratória EDA ---
  {
    id: "cd_eda_001",
    topic: "Ciência de Dados",
    macroarea: "Segurança/IA",
    element: "Análise exploratória EDA",
    difficulty: "fácil" as const,
    statement:
      "Uma analista de dados recebeu um conjunto de dados sobre desempenho de alunos e iniciou a Análise Exploratória de Dados (EDA). Sobre os objetivos e técnicas da EDA, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "A EDA tem como objetivo principal confirmar hipóteses previamente definidas pelo pesquisador antes da coleta de dados.",
      },
      {
        letter: "B",
        text: "A EDA é uma etapa dispensável quando se utiliza modelos de machine learning, pois os algoritmos tratam automaticamente problemas nos dados.",
      },
      {
        letter: "C",
        text: "A EDA envolve a análise das características principais dos dados (tendência central, dispersão, distribuição), identificação de padrões, anomalias e relações entre variáveis, utilizando estatísticas descritivas e visualizações.",
      },
      {
        letter: "D",
        text: "A EDA deve ser realizada exclusivamente por meio de algoritmos de clustering, sem necessidade de inspeção visual dos dados.",
      },
      {
        letter: "E",
        text: "A EDA substitui completamente a necessidade de testes estatísticos formais na análise de dados.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "A Análise Exploratória de Dados (EDA), popularizada por John Tukey, é uma abordagem filosófica para analisar dados buscando entender sua estrutura, padrões, anomalias e relações. Inclui: (1) estatísticas descritivas (média, mediana, desvio padrão, quartis); (2) visualizações (histogramas, boxplots, scatter plots, heatmaps); (3) identificação de outliers e valores ausentes; (4) análise de correlações. A EDA não testa hipóteses formalmente, mas orienta a formulação de hipóteses e a escolha de modelos. É indispensável antes de qualquer modelagem.",
  },

  // --- Visualização de Dados ---
  {
    id: "cd_visualizacao_001",
    topic: "Ciência de Dados",
    macroarea: "Segurança/IA",
    element: "Visualização de dados",
    difficulty: "médio" as const,
    statement:
      "Uma empresa precisa visualizar a evolução mensal do faturamento de três departamentos ao longo de 24 meses. A diretoria deseja identificar tendências e comparar o desempenho entre departamentos. Qual tipo de gráfico é mais adequado para essa finalidade?",
    alternatives: [
      {
        letter: "A",
        text: "Gráfico de pizza, pois permite comparar as proporções de cada departamento em relação ao faturamento total.",
      },
      {
        letter: "B",
        text: "Gráfico de barras empilhadas 100%, pois normaliza os dados e permite comparar a composição percentual ao longo do tempo.",
      },
      {
        letter: "C",
        text: "Gráfico de dispersão (scatter plot), pois é o tipo mais adequado para mostrar a relação entre duas variáveis numéricas.",
      },
      {
        letter: "D",
        text: "Gráfico de linhas com múltiplas séries, pois permite visualizar tendências temporais e comparar a evolução de cada departamento ao longo dos meses.",
      },
      {
        letter: "E",
        text: "Histograma, pois permite visualizar a distribuição de frequência dos valores de faturamento.",
      },
    ],
    correctAnswer: "D",
    explanation:
      "Cada tipo de gráfico tem um propósito específico: (1) Linhas: evolução temporal/tendências (ideal para este caso — eixo X = tempo, múltiplas linhas = departamentos); (2) Pizza: composição em um momento específico (não para séries temporais); (3) Barras: comparação entre categorias; (4) Dispersão: relação entre duas variáveis contínuas; (5) Histograma: distribuição de uma variável. O gráfico de linhas com múltiplas séries permite visualizar claramente tendências, sazonalidades e comparações entre departamentos.",
  },

  // --- Estatística Descritiva e Inferencial ---
  {
    id: "cd_estatistica_001",
    topic: "Ciência de Dados",
    macroarea: "Segurança/IA",
    element: "Estatística descritiva e inferencial",
    difficulty: "médio" as const,
    statement:
      "Uma pesquisa afirma que 'o tempo médio de atendimento ao cliente é de 12 minutos, com um intervalo de confiança de 95% de [10,2; 13,8] minutos'. Sobre essa afirmação, é correto interpretar que:",
    alternatives: [
      {
        letter: "A",
        text: "95% dos atendimentos individuais duram entre 10,2 e 13,8 minutos.",
      },
      {
        letter: "B",
        text: "Se repetirmos a amostragem muitas vezes, em aproximadamente 95% das amostras o intervalo de confiança conterá o verdadeiro tempo médio populacional.",
      },
      {
        letter: "C",
        text: "Há 95% de probabilidade de que o tempo médio populacional esteja entre 10,2 e 13,8 minutos.",
      },
      {
        letter: "D",
        text: "O desvio padrão da população é exatamente de 1,8 minutos (13,8 - 10,2 = 3,6 / 2 = 1,8).",
      },
      {
        letter: "E",
        text: "A amostra utilizada possui exatamente 95% de representatividade em relação à população.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "A interpretação correta do intervalo de confiança é frequentista: se o processo de amostragem for repetido muitas vezes, aproximadamente 95% dos intervalos construídos conterão o verdadeiro parâmetro populacional. A alternativa A descreve um intervalo de predição, não de confiança. A alternativa C é uma interpretação equivocada frequente (o parâmetro populacional é fixo, não probabilístico). A amplitude do IC depende do erro padrão da média (desvio padrão/√n), não do desvio padrão populacional diretamente.",
  },
  {
    id: "cd_estatistica_002",
    topic: "Ciência de Dados",
    macroarea: "Segurança/IA",
    element: "Estatística descritiva e inferencial",
    difficulty: "fácil" as const,
    statement:
      "Uma empresa registrou os salários de seus 10 funcionários administrativos, que são: R$ 2.000, R$ 2.200, R$ 2.500, R$ 2.800, R$ 3.000, R$ 3.200, R$ 3.500, R$ 3.800, R$ 4.000 e R$ 25.000 (gerente). Ao analisar essas medidas de tendência central, qual afirmação é correta?",
    alternatives: [
      {
        letter: "A",
        text: "A média (R$ 5.200) é a melhor medida de tendência central para esse conjunto, pois utiliza todos os valores da amostra.",
      },
      {
        letter: "B",
        text: "A mediana (R$ 3.100) é mais adequada que a média para representar o salário típico, pois é menos sensível ao valor extremo (R$ 25.000).",
      },
      {
        letter: "C",
        text: "A moda é R$ 5.200, representando o valor mais frequente nos salários.",
      },
      {
        letter: "D",
        text: "A média e a mediana são iguais nesse conjunto, pois a distribuição é perfeitamente simétrica.",
      },
      {
        letter: "E",
        text: "O valor R$ 25.000 deve ser descartado automaticamente, pois é um outlier que invalida qualquer cálculo estatístico.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "Os salários ordenados: 2000, 2200, 2500, 2800, 3000, 3200, 3500, 3800, 4000, 25000. Média = soma/10 = 52000/10 = R$ 5.200 (puxada para cima pelo salário do gerente). Mediana = média entre o 5º e 6º valores = (3000+3200)/2 = R$ 3.100. A mediana é mais robusta a valores extremos (outliers) que a média. Em distribuições assimétricas à direita (como salários), a média é maior que a mediana. O outlier não deve ser descartado automaticamente — precisa ser investigado (pode ser um valor real e legítimo).",
  },

  // --- Correlação e Regressão ---
  {
    id: "cd_correlacao_001",
    topic: "Ciência de Dados",
    macroarea: "Segurança/IA",
    element: "Correlação e regressão",
    difficulty: "difícil" as const,
    statement:
      "Um pesquisador analisou a correlação entre o número de horas de estudo e a nota final em uma disciplina e obteve um coeficiente de correlação de Pearson r = -0,85. Sobre a interpretação desse resultado, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "Existe uma forte correlação negativa, indicando que estudar mais horas causa uma diminuição significativa na nota.",
      },
      {
        letter: "B",
        text: "A correlação é positiva e forte, indicando que alunos que estudam mais tendem a obter notas maiores.",
      },
      {
        letter: "C",
        text: "A correlação é forte e negativa, indicando que alunos que estudam mais horas tendem a obter notas menores, mas correlação não implica causalidade — pode haver variáveis confundidoras.",
      },
      {
        letter: "D",
        text: "O coeficiente -0,85 indica que 85% da variabilidade da nota é explicada pelas horas de estudo.",
      },
      {
        letter: "E",
        text: "O valor negativo indica um erro de cálculo, pois a correlação entre horas de estudo e notas deve ser sempre positiva.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "O coeficiente r = -0,85 indica uma forte correlação negativa linear: quando uma variável aumenta, a outra tende a diminuir. A interpretação importante é que correlação NÃO implica causalidade. Pode haver variáveis confundidoras (ex: alunos com mais dificuldade estudam mais horas mas ainda assim tiram notas menores). O R² (coeficiente de determinação) = r² = 0,7225, indicando que ~72% da variância é explicada, não 85%. Um r = -0,85 não é necessariamente um erro — contextos como 'horas de estudo vs. ansiedade' podem mostrar correlação negativa.",
  },

  // --- Big Data 5 Vs ---
  {
    id: "cd_bigdata_001",
    topic: "Ciência de Dados",
    macroarea: "Segurança/IA",
    element: "Big Data 5 Vs",
    difficulty: "fácil" as const,
    statement:
      "Uma empresa de telecomunicações processa 50 TB de dados diariamente de chamadas, mensagens e metadados de seus 50 milhões de clientes. A empresa precisa de insights em tempo real para detectar fraudes e personalizar ofertas. Considerando os 5 Vs do Big Data (Volume, Velocidade, Variedade, Veracidade e Valor), qual alternativa apresenta a correspondência correta?",
    alternatives: [
      {
        letter: "A",
        text: "Volume refere-se à velocidade com que os dados chegam; Velocidade refere-se à quantidade de dados armazenados; Variedade refere-se ao valor dos dados para decisões de negócio.",
      },
      {
        letter: "B",
        text: "Volume é a grande quantidade de dados (50 TB/dia); Velocidade é a necessidade de processamento em tempo real; Variedade é a diversidade de fontes (chamadas, mensagens, metadados); Veracidade é a confiabilidade dos dados; Valor é o insight gerado para o negócio.",
      },
      {
        letter: "C",
        text: "Os 5 Vs referem-se exclusivamente aos tipos de banco de dados: Volume (SQL), Velocidade (NoSQL), Variedade (Graph), Veracidade (Columnar) e Valor (Key-Value).",
      },
      {
        letter: "D",
        text: "Big Data é definido exclusivamente pelo Volume, sendo os demais Vs irrelevantes para a caracterização de um sistema como Big Data.",
      },
      {
        letter: "E",
        text: "Veracidade significa que todos os dados coletados são verdadeiros e não contêm erros ou inconsistências.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "Os 5 Vs do Big Data descrevem os desafios e características: (1) Volume: escala massiva dos dados; (2) Velocidade: taxa de geração e necessidade de processamento (batch vs. streaming); (3) Variedade: diversidade de formatos (estruturados, semiestruturados, não estruturados); (4) Veracidade: qualidade, confiabilidade e incerteza dos dados; (5) Valor: capacidade de gerar insights e vantagem competitiva. Veracidade não significa que os dados são verdadeiros, mas sim que há desafios relacionados à qualidade e confiança nos dados.",
  },

  // --- Pipelines de Dados ---
  {
    id: "cd_pipelines_001",
    topic: "Ciência de Dados",
    macroarea: "Segurança/IA",
    element: "Pipelines de dados",
    difficulty: "médio" as const,
    statement:
      "Uma empresa está projetando um pipeline de dados para integrar informações de múltiplas fontes (banco relacional, API REST e logs de servidor) e alimentar um data warehouse para análise de negócio. Sobre as etapas e boas práticas de um pipeline de dados, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "Um pipeline de dados eficiente deve necessariamente processar todos os dados em tempo real, sem opção de processamento em lote (batch).",
      },
      {
        letter: "B",
        text: "As etapas típicas de um pipeline incluem ingestão (extração), transformação (limpeza, normalização, enriquecimento) e carregamento (ETL/ELT), devendo incluir monitoramento de qualidade e linhagem dos dados.",
      },
      {
        letter: "C",
        text: "A linhagem de dados (data lineage) é um conceito opcional em pipelines modernos, pois as ferramentas automatizadas dispensam o rastreamento da origem dos dados.",
      },
      {
        letter: "D",
        text: "O padrão ELT (Extract, Load, Transform) é obrigatório para todos os tipos de pipeline, sendo o ETL (Extract, Transform, Load) uma abordagem ultrapassada.",
      },
      {
        letter: "E",
        text: "Pipelines de dados devem ser construídos sem testes automatizados, pois a validação manual é mais confiável para dados de produção.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "Um pipeline de dados é uma sequência automatizada de etapas: (1) Ingestão/Extração: coleta de dados de fontes diversas; (2) Transformação: limpeza, padronização, enriquecimento; (3) Carregamento: armazenamento no destino. Padrões ETL (transforma antes de carregar) e ELT (carrega depois transforma) têm casos de uso distintos. Boas práticas incluem: monitoramento de qualidade, alertas de falha, data lineage (rastreamento da origem e transformações), testes automatizados e versionamento de código do pipeline. A escolha entre batch e streaming depende do caso de uso.",
  },

  // --- Storytelling com Dados ---
  {
    id: "cd_storytelling_001",
    topic: "Ciência de Dados",
    macroarea: "Segurança/IA",
    element: "Storytelling com dados",
    difficulty: "difícil" as const,
    statement:
      "Um analista de dados precisa apresentar os resultados de uma análise de churn (taxa de cancelamento) para a diretoria de uma empresa de streaming. O relatório técnico contém dezenas de gráficos e tabelas detalhadas. Sobre as práticas de storytelling com dados, qual alternativa apresenta a abordagem mais eficaz?",
    alternatives: [
      {
        letter: "A",
        text: "Apresentar todos os gráficos e tabelas gerados na análise para demonstrar completude e rigor técnico, independentemente do público-alvo.",
      },
      {
        letter: "B",
        text: "Utilizar exclusivamente tabelas numéricas, pois são mais precisas e profissionais que gráficos para tomada de decisão.",
      },
      {
        letter: "C",
        text: "Estruturar a narrativa com base em uma mensagem central (insight principal), selecionar apenas as visualizações essenciais que sustentam essa mensagem, e adaptar a linguagem e o nível de detalhe ao público (diretoria), contextualizando os dados com implicações de negócio.",
      },
      {
        letter: "D",
        text: "Evitar qualquer forma de narrativa e apresentar apenas dados brutos, permitindo que a diretoria tire suas próprias conclusões sem influência.",
      },
      {
        letter: "E",
        text: "Focar apenas em visualizações 3D e animadas para tornar a apresentação mais atrativa visualmente.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "Storytelling com dados combina técnicas de comunicação, visualização e análise para transmitir insights de forma eficaz. Princípios-chave: (1) Definir uma mensagem central clara; (2) Conhecer o público e adaptar o nível de detalhe; (3) Selecionar visualizações essenciais (não sobrecarregar); (4) Criar uma narrativa lógica (contexto → problema → descoberta → implicação → ação); (5) Destacar o insight principal (pode-se usar pré-atenção visual como cores contrastantes); (6) Conectar dados a implicações de negócio. Apresentações para diretoria devem focar em decisões, não em metodologia.",
  },

  // =============================================================================
  // MICROAREA 14: ÉTICA PROFISSIONAL (9 questions)
  // Elements: Código de ética, Propriedade intelectual, LGPD na prática,
  //           Responsabilidade social, Privacidade e vigilância digital,
  //           Fake news e desinformação, Impacto da automação, Ética em IA,
  //           Inclusão digital, Sustentabilidade tecnológica
  // =============================================================================

  // --- Código de Ética ---
  {
    id: "etica_codigo_001",
    topic: "Ética Profissional",
    macroarea: "Segurança/IA",
    element: "Código de ética",
    difficulty: "fácil" as const,
    statement:
      "O Conselho Federal de Informática (CFI) e o Sistema CREA/CONFEA regulamentam a profissão de analista de sistemas e tecnologias da informação. Sobre os princípios éticos que regem o exercício profissional, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "O profissional de TI é eticamente obrigado a revelar todas as informações confidenciais de seus clientes quando solicitado por qualquer pessoa.",
      },
      {
        letter: "B",
        text: "O profissional de TI deve exercer sua profissão com responsabilidade, honestidade, integridade e respeito aos direitos de privacidade e propriedade intelectual, mantendo a confidencialidade das informações sob sua guarda.",
      },
      {
        letter: "C",
        text: "Códigos de ética profissional são meras recomendações sem qualquer consequência legal em caso de violação.",
      },
      {
        letter: "D",
        text: "O profissional de TI pode utilizar software pirata em projetos pessoais sem nenhuma consequência ética.",
      },
      {
        letter: "E",
        text: "A ética profissional se aplica apenas a engenheiros e arquitetos, não sendo extensiva aos profissionais de tecnologia da informação.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "Os princípios éticos fundamentais do profissional de TI incluem: (1) honestidade e integridade; (2) competência — atuar apenas dentro de sua qualificação; (3) confidencialidade — proteger informações sensíveis; (4) respeito à propriedade intelectual — não plagiar ou copiar ilegalmente software; (5) responsabilidade social — considerar o impacto das tecnologias na sociedade. Violações do código de ética podem acarretar sanções éticas e profissionais, incluindo advertências, suspensão ou cancelamento do registro profissional.",
  },

  // --- Propriedade Intelectual ---
  {
    id: "etica_pi_001",
    topic: "Ética Profissional",
    macroarea: "Segurança/IA",
    element: "Propriedade intelectual",
    difficulty: "médio" as const,
    statement:
      "Um desenvolvedor freelance foi contratado para criar um software sob medida para uma empresa. No contrato, não há cláusula específica sobre direitos autorais. De acordo com a Lei de Direitos Autorais brasileira (Lei 9.610/1998), em relação ao software desenvolvido:",
    alternatives: [
      {
        letter: "A",
        text: "Os direitos autorais do software são automaticamente do cliente que encomendou o trabalho, independentemente de qualquer cláusula contratual.",
      },
      {
        letter: "B",
        text: "Os direitos autorais pertencem ao desenvolvedor (criador), salvo disposição contratual em contrário, pois a legislação protege o autor como titular originário dos direitos patrimoniais e morais.",
      },
      {
        letter: "C",
        text: "Software não é protegido por direitos autorais no Brasil, apenas por patentes de invenção.",
      },
      {
        letter: "D",
        text: "Os direitos autorais são divididos igualmente entre desenvolvedor e cliente, sem possibilidade de negociação diferente.",
      },
      {
        letter: "E",
        text: "O registro em cartório é obrigatório para que o desenvolvedor tenha direitos autorais sobre o software.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "No Brasil, a Lei 9.610/1998 protege software como obra intelectual (art. 2º). O autor é o titular originário dos direitos (art. 11). Em relação a programas de computador (art. 87), a Lei 9.609/1998 (Lei de Software) estabelece que, salvo estipulação contratual em contrário, os direitos patrimoniais sobre o software desenvolvido por encomenda pertencem ao contratante. Porém, na ausência de cláusula específica, o princípio geral da Lei 9.610 favorece o autor. É fundamental ter cláusulas claras sobre cessão de direitos em contratos de desenvolvimento.",
  },

  // --- LGPD na Prática ---
  {
    id: "etica_lgpd_pratica_001",
    topic: "Ética Profissional",
    macroarea: "Segurança/IA",
    element: "LGPD na prática",
    difficulty: "médio" as const,
    statement:
      "Uma startup de saúde está desenvolvendo um aplicativo que coleta dados médicos sensíveis de pacientes. De acordo com a LGPD (Lei 13.709/2018), qual alternativa apresenta a obrigação correta da empresa em relação ao tratamento desses dados?",
    alternatives: [
      {
        letter: "A",
        text: "Dados médicos são considerados dados pessoais comuns, não necessitando de tratamento diferenciado pela LGPD.",
      },
      {
        letter: "B",
        text: "A empresa pode tratar dados sensíveis livremente, bastando informar o usuário no termo de uso que os dados serão coletados.",
      },
      {
        letter: "C",
        text: "Dados médicos são dados pessoais sensíveis (dados sobre saúde), e seu tratamento requer o consentimento explícito do titular ou outra base legal específica, além de medidas rigorosas de segurança e proteção.",
      },
      {
        letter: "D",
        text: "A LGPD proíbe completamente o tratamento de dados de saúde, mesmo com o consentimento do paciente.",
      },
      {
        letter: "E",
        text: "Basta nomear um DPO (Encarregado) para que a empresa esteja automaticamente em conformidade com a LGPD.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "A LGPD classifica dados sensíveis no art. 11, incluindo dados sobre saúde (origem racial ou étnica, convicção religiosa, saúde, vida sexual, dados genéticos). O tratamento de dados sensíveis é mais restrito, necessitando: (1) consentimento específico e destacado; OU (2) outra base legal como obrigação legal, proteção da vida, tutela da saúde, exercício regular de direitos em processos. Além disso, a empresa deve implementar medidas de segurança técnicas e administrativas. Um DPO é obrigatório apenas em determinados casos (art. 41). Conformidade com LGPD vai muito além da nomeação do DPO.",
  },

  // --- Responsabilidade Social ---
  {
    id: "etica_resp_social_001",
    topic: "Ética Profissional",
    macroarea: "Segurança/IA",
    element: "Responsabilidade social",
    difficulty: "fácil" as const,
    statement:
      "Uma empresa de tecnologia está desenvolvendo um sistema de reconhecimento facial para uso por forças de segurança. Diante das preocupações com possíveis vieses discriminatórios, qual postura é mais alinhada com a responsabilidade social do profissional de TI?",
    alternatives: [
      {
        letter: "A",
        text: "Desconsiderar preocupações com viés, pois algoritmos são objetivos e matematicamente neutros por natureza.",
      },
      {
        letter: "B",
        text: "O profissional deve se limitar a implementar o que foi solicitado, sem questionar os impactos sociais ou éticos do sistema.",
      },
      {
        letter: "C",
        text: "O profissional deve avaliar os impactos sociais e éticos do sistema, identificar potenciais vieses (por exemplo, menor precisão para determinados grupos demográficos), recomendar auditorias algorítmicas e advocate por medidas de mitigação de riscos discriminatórios.",
      },
      {
        letter: "D",
        text: "Responsabilidade social é exclusivamente uma obrigação governamental, não cabendo ao profissional de TI qualquer preocupação ética sobre os sistemas que desenvolve.",
      },
      {
        letter: "E",
        text: "Basta utilizar datasets balanceados para eliminar completamente qualquer viés do sistema.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "A responsabilidade social do profissional de TI inclui: (1) avaliar os impactos éticos e sociais dos sistemas desenvolvidos; (2) reconhecer que algoritmos podem perpetuar e amplificar vieses presentes nos dados de treinamento; (3) adotar práticas como auditorias algorítmicas, testes com grupos diversos e transparência; (4) comunicar riscos e limitações aos stakeholders. Estudos mostram que sistemas de reconhecimento facial podem ter precisão significativamente menor para mulheres negras em comparação a homens brancos. A responsabilidade profissional inclui questionar e mitigar esses riscos.",
  },

  // --- Privacidade e Vigilância Digital ---
  {
    id: "etica_privacidade_001",
    topic: "Ética Profissional",
    macroarea: "Segurança/IA",
    element: "Privacidade e vigilância digital",
    difficulty: "médio" as const,
    statement:
      "Uma empresa de tecnologia coleta dados de geolocalização, histórico de navegação e hábitos de consumo de seus usuários para personalização de anúncios. Sobre os dilemas entre personalização e privacidade, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "A coleta massiva de dados pessoais é sempre legítima, pois os usuários aceitam os termos de uso ao se cadastrar no serviço.",
      },
      {
        letter: "B",
        text: "O consentimento por meio de termos de uso longos e complexos é suficiente para garantir a legitimidade ética da coleta de dados, dispensando práticas de privacy by design.",
      },
      {
        letter: "C",
        text: "O profissional de TI deve considerar o equilíbrio entre utilidade do serviço e privacidade do usuário, aplicando princípios de minimização de dados, transparência e privacy by design, mesmo quando o usuário 'consentiu' com os termos.",
      },
      {
        letter: "D",
        text: "A vigilância digital só é preocupante quando realizada por governos, sendo que empresas privadas não precisam se preocupar com ética na coleta de dados.",
      },
      {
        letter: "E",
        text: "O princípio de minimização de dados afirma que se deve coletar a maior quantidade possível de dados para maximizar a qualidade dos serviços.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "O consentimento informado é frequentemente ilusório em termos de uso longos (fenômeno do 'consentimento cego'). Princípios éticos importantes: (1) Minimização de dados: coletar apenas o necessário; (2) Privacy by Design: incorporar privacidade desde a concepção do sistema; (3) Transparência: informar de forma clara e acessível; (4) Proporcionalidade: o benefício justifica a coleta?; (5) Finalidade: usar dados apenas para o propósito declarado. A ética profissional vai além da conformidade legal — o fato de ser legalmente permitido não torna necessariamente ético.",
  },

  // --- Fake News e Desinformação ---
  {
    id: "etica_fake_news_001",
    topic: "Ética Profissional",
    macroarea: "Segurança/IA",
    element: "Fake news e desinformação",
    difficulty: "difícil" as const,
    statement:
      "As plataformas de mídia social enfrentam o desafio de combater a desinformação sem ferir a liberdade de expressão. O uso de algoritmos de IA para moderação de conteúdo levanta questões éticas complexas. Sobre esse dilema, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "Algoritmos de IA são completamente neutros e imparciais na detecção de desinformação, dispensando supervisão humana.",
      },
      {
        letter: "B",
        text: "A moderação de conteúdo por IA é simples e indiscutível: qualquer conteúdo classificado como desinformação deve ser imediatamente removido sem possibilidade de recurso.",
      },
      {
        letter: "C",
        text: "A moderação automatizada de conteúdo envolve dilemas éticos como falsos positivos (remoção de conteúdo legítimo), viés algorítmico, falta de contexto e riscos de censura, exigindo um equilíbrio entre transparência, devido processo, apelação humana e combate à desinformação.",
      },
      {
        letter: "D",
        text: "A melhor solução é permitir que todos os conteúdos sejam publicados sem qualquer moderação, priorizando absolutamente a liberdade de expressão.",
      },
      {
        letter: "E",
        text: "A desinformação não é um problema relevante para profissionais de TI, sendo exclusivamente uma questão jornalística e política.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "O combate à desinformação por IA envolve dilemas éticos significativos: (1) Falsos positivos: algoritmos podem remover conteúdo legítimo; (2) Viés: modelos podem ser treinados com dados enviesados; (3) Contexto: a verificação de verdade é complexa e contextual; (4) Censura: riscos de supressão de discursos legítimos; (5) Transparência: os critérios de moderação devem ser claros; (6) Due process: os usuários devem ter direito a recurso e revisão humana. O Marco Civil da Internet (Lei 12.965/2014) estabelece que plataformas só podem ser responsabilizadas por conteúdo de terceiros após ordem judicial.",
  },

  // --- Ética em IA ---
  {
    id: "etica_ia_001",
    topic: "Ética Profissional",
    macroarea: "Segurança/IA",
    element: "Ética em IA",
    difficulty: "médio" as const,
    statement:
      "Uma empresa de recrutamento utiliza um sistema de IA para filtrar currículos e selecionar candidatos para entrevistas. Após auditoria, descobriu-se que o modelo sistematicamente penalizava candidatas mulheres. Sobre os princípios éticos de IA e as medidas adequadas nesse cenário, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "O viés do modelo é aceitável se os dados de treinamento refletem a realidade atual do mercado de trabalho.",
      },
      {
        letter: "B",
        text: "A empresa deve investigar as causas do viés (dados de treinamento enviesados, features discriminatórias como gênero, proxies indiretos), corrigir o modelo (rebalanceamento, remoção de features sensíveis, fairness constraints) e implementar monitoramento contínuo de equidade.",
      },
      {
        letter: "C",
        text: "A solução é simplesmente remover a variável 'gênero' do dataset, pois isso elimina completamente qualquer forma de viés discriminatório.",
      },
      {
        letter: "D",
        text: "Algoritmos de IA não podem ser discriminatórios por natureza, pois operam exclusivamente com base em matemática e estatística.",
      },
      {
        letter: "E",
        text: "A responsabilidade é exclusiva do fornecedor do algoritmo, isentando a empresa contratante de qualquer obrigação ética.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "Vieses em IA podem surgir de múltiplas fontes: (1) Dados históricos enviesados (ex: currículos predominando de homens em certas áreas); (2) Features que funcionam como proxies (ex: 'tempo de experiência' pode penalizar mulheres que tiveram licença-maternidade); (3) Definição de 'bom candidato' baseada em dados passados. Medidas incluem: análise de disparate impact, fairness-aware ML (equalized odds, demographic parity), auditorias regulares, equipes diversas no desenvolvimento e documentação de limitações. Remover apenas a feature 'gênero' é insuficiente quando há proxies correlacionados.",
  },

  // --- Inclusão Digital ---
  {
    id: "etica_inclusao_001",
    topic: "Ética Profissional",
    macroarea: "Segurança/IA",
    element: "Inclusão digital",
    difficulty: "fácil" as const,
    statement:
      "Um profissional de TI foi incumbido de desenvolver um site público para um serviço governamental. Sobre a acessibilidade digital e a inclusão, qual alternativa apresenta uma prática correta de desenvolvimento acessível?",
    alternatives: [
      {
        letter: "A",
        text: "Acessibilidade digital é um 'nice-to-have' opcional, relevante apenas para atender requisitos de mercado, não sendo uma obrigação ética ou legal.",
      },
      {
        letter: "B",
        text: "O profissional deve seguir as diretrizes WCAG (Web Content Accessibility Guidelines) e padrões como o eMAG (Modelo de Acessibilidade de Governo Eletrônico brasileiro), garantindo que o site seja navegável por pessoas com deficiência visual, auditiva, motora ou cognitiva.",
      },
      {
        letter: "C",
        text: "Basta criar uma versão alternativa em texto simples para pessoas com deficiência, sem necessidade de tornar o site principal acessível.",
      },
      {
        letter: "D",
        text: "A inclusão digital se resume a fornecer acesso à internet, sem necessidade de acessibilidade no design de sistemas.",
      },
      {
        letter: "E",
        text: "O custo de implementar acessibilidade é proibitivamente alto e injustificável para projetos governamentais.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "A inclusão digital vai além do acesso à internet — inclui a acessibilidade dos sistemas e conteúdos digitais. No Brasil: (1) Decreto 5.296/2004 exige acessibilidade em sites governamentais; (2) Lei Brasileira de Inclusão (Lei 13.146/2015 - Estatuto da Pessoa com Deficiência) garante direito ao acesso à informação; (3) eMAG estabelece padrões de acessibilidade para governos. Práticas incluem: texto alternativo para imagens, navegação por teclado, contraste adequado, compatibilidade com leitores de tela, respeito aos padrões WCAG. Acessibilidade deve ser incorporada desde o início do projeto (não como correção posterior).",
  },

  // --- Sustentabilidade Tecnológica ---
  {
    id: "etica_sustentabilidade_001",
    topic: "Ética Profissional",
    macroarea: "Segurança/IA",
    element: "Sustentabilidade tecnológica",
    difficulty: "médio" as const,
    statement:
      "Uma empresa de cloud computing está expandindo seu data center e busca reduzir o impacto ambiental de suas operações. Sobre os conceitos de TI verde (Green IT) e sustentabilidade tecnológica, qual alternativa é correta?",
    alternatives: [
      {
        letter: "A",
        text: "Data centers consomem pouca energia e têm impacto ambiental desprezível, não necessitando de práticas de sustentabilidade específicas.",
      },
      {
        letter: "B",
        text: "O PUE (Power Usage Effectiveness) é uma métrica que mede a eficiência energética do data center, sendo o valor ideal 1,0 (toda a energia é destinada aos equipamentos de TI, sem desperdício em refrigeração e iluminação).",
      },
      {
        letter: "C",
        text: "Green IT se limita à economia de papel no escritório, não se aplicando a infraestrutura de data centers e redes.",
      },
      {
        letter: "D",
        text: "A virtualização e a computação em nuvem aumentam o consumo de energia em comparação com servidores físicos dedicados.",
      },
      {
        letter: "E",
        text: "O descarte de equipamentos eletrônicos (e-waste) não representa um problema ambiental significativo, pois componentes eletrônicos são 100% recicláveis.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "Green IT abrange práticas para reduzir o impacto ambiental da TI: (1) Eficiência energética: PUE = Energia Total / Energia IT (ideal = 1,0, média global ≈ 1,58); (2) Virtualização: consolida servidores, reduzindo hardware ocioso e consumo; (3) Computação em nuvem: permite melhor utilização de recursos; (4) E-waste: descarte responsável, reciclagem e economia circular; (5) Refrigeração: uso de free cooling, líquido e fontes renováveis. Data centers representam ~1-2% do consumo global de eletricidade. O lixo eletrônico é um problema crescente — componentes contêm metais pesados tóxicos.",
  },

  // =============================================================================
  // MICROAREA 15: LEGISLAÇÃO (9 questions)
  // Elements: LGPD (Lei 13.709/2018), Marco Civil da Internet,
  //           Lei Carolina Dieckmann, Lei de Acesso à Informação, CDC digital,
  //           Licitações e TI (Lei 14.133/2021), Patentes de software,
  //           Contratos digitais, GDPR, Governança de TI
  // =============================================================================

  // --- LGPD ---
  {
    id: "leg_lgpd_001",
    topic: "Legislação",
    macroarea: "Segurança/IA",
    element: "LGPD (Lei 13.709/2018)",
    difficulty: "fácil" as const,
    statement:
      "A Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018) estabeleceu princípios e regras para o tratamento de dados pessoais no Brasil. Sobre os fundamentos legais (bases legais) que autorizam o tratamento de dados pessoais conforme a LGPD, qual alternativa apresenta uma base legal válida?",
    alternatives: [
      {
        letter: "A",
        text: "O tratamento de dados pessoais pode ser realizado sem qualquer base legal, bastando a intenção legítima do controlador.",
      },
      {
        letter: "B",
        text: "As bases legais incluem o consentimento do titular, cumprimento de obrigação legal, execução de contrato, exercício regular de direitos em processo judicial, proteção da vida, tutela da saúde, interesse legítimo do controlador e proteção do crédito.",
      },
      {
        letter: "C",
        text: "O consentimento é a única base legal reconhecida pela LGPD para qualquer tipo de tratamento de dados pessoais.",
      },
      {
        letter: "D",
        text: "A LGPD se aplica apenas a empresas privadas, não alcançando órgãos públicos.",
      },
      {
        letter: "E",
        text: "A LGPD proíbe completamente a transferência internacional de dados pessoais, sem exceções.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "O art. 7º da LGPD enumera 10 bases legais para tratamento de dados pessoais: (I) consentimento; (II) obrigação legal; (III) políticas públicas; (IV) pesquisa de entidade de pesquisa; (V) contrato; (VI) processo judicial; (VII) proteção da vida; (VIII) tutela da saúde; (IX) interesse legítimo; (X) proteção do crédito. O consentimento é apenas uma das bases, não a única. A LGPD se aplica a qualquer pessoa física ou jurídica que realize tratamento de dados no Brasil. Transferências internacionais são permitidas com garantias adequadas (art. 33-36).",
  },

  // --- Marco Civil da Internet ---
  {
    id: "leg_mci_001",
    topic: "Legislação",
    macroarea: "Segurança/IA",
    element: "Marco Civil da Internet",
    difficulty: "médio" as const,
    statement:
      "O Marco Civil da Internet (Lei 12.965/2014) estabeleceu princípios, garantias e direitos para o uso da internet no Brasil. Sobre a responsabilidade civil de plataformas de conteúdo na internet, conforme o Marco Civil, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "As plataformas são sempre responsáveis por todo o conteúdo publicado por terceiros, devendo monitorar preventivamente todas as publicações para evitar responsabilização.",
      },
      {
        letter: "B",
        text: "As plataformas não podem ser responsabilizadas por conteúdo de terceiros, gozando de imunidade absoluta independentemente de qualquer circunstância.",
      },
      {
        letter: "C",
        text: "O Marco Civil estabelece que a responsabilidade civil por danos decorrentes de conteúdo gerado por terceiros só pode ser imputada à plataforma após ordem judicial específica, exigindo que a plataforma não descumpra ordem judicial e mantenha os registros de acesso por no mínimo 6 meses.",
      },
      {
        letter: "D",
        text: "As plataformas devem remover qualquer conteúdo denunciado por um usuário em até 24 horas, sem necessidade de ordem judicial.",
      },
      {
        letter: "E",
        text: "O Marco Civil não aborda a questão de responsabilidade de plataformas, deixando a regulamentação a critério exclusivo das empresas.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "O Marco Civil estabeleceu o regime de responsabilidade civil (arts. 18-21): (1) Art. 19: plataformas não são responsáveis por conteúdo de terceiros, salvo se descumprirem ordem judicial específica; (2) A responsabilidade só surge após decisão judicial; (3) Art. 15: não há obrigação geral de monitoramento prévio; (4) Arts. 10-12: registros de acesso devem ser guardados por 6 meses (prorrogável por igual período por ordem judicial). Essa abordagem equilibra liberdade de expressão com responsabilização pós-facto, seguindo o modelo 'safe harbor' inspirado no DMCA americano.",
  },

  // --- Lei Carolina Dieckmann ---
  {
    id: "leg_carolina_001",
    topic: "Legislação",
    macroarea: "Segurança/IA",
    element: "Lei Carolina Dieckmann",
    difficulty: "médio" as const,
    statement:
      "A Lei 12.737/2012, popularmente conhecida como 'Lei Carolina Dieckmann', foi um marco na tipificação de crimes cibernéticos no Brasil. Sobre o escopo e as disposições dessa lei, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "A lei tipificou exclusivamente o crime de invasão de dispositivo informático, sem abranger outras condutas cibernéticas.",
      },
      {
        letter: "B",
        text: "A lei tipificou condutas como invadir dispositivo informático alheio com violação de senha, obter ou transferir dados sem autorização, inserir código malicioso e falsificar informações em sistemas informatizados, com penas de reclusão que variam de 3 meses a 5 anos.",
      },
      {
        letter: "C",
        text: "A lei aplica-se apenas a crimes contra a administração pública, não alcançando crimes contra indivíduos ou empresas privadas.",
      },
      {
        letter: "D",
        text: "A pena para invasão de dispositivo informático é sempre de reclusão de 1 ano, sem possibilidade de aumento em nenhuma hipótese.",
      },
      {
        letter: "E",
        text: "A lei isenta de pena o invasor se a invasão for realizada apenas para verificar a segurança do sistema, sem fins lucrativos.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "A Lei 12.737/2012 incluiu o art. 154-A no Código Penal: (1) Invasão de dispositivo: 3 meses a 1 ano; (2) Aumento de 1/3 a 2/3 se houver obtenção, transferência ou divulgação de dados; (3) Aumento se houver prejuízo econômico; (4) Aumento de 2/3 se for cometido por funcionário com acesso ao sistema; (5) Aumento de metade se houver violação de senha. O crime exige dolo (consciência e vontade). A simples curiosidade ou intenção de verificar segurança, sem autorização, pode configurar o crime. A Lei 14.155/2021 (Lei Marrentoni) agravou as penas e adicionou novos tipos penais.",
  },

  // --- Lei de Acesso à Informação ---
  {
    id: "leg_lai_001",
    topic: "Legislação",
    macroarea: "Segurança/IA",
    element: "Lei de Acesso à Informação",
    difficulty: "fácil" as const,
    statement:
      "A Lei 12.527/2011 (Lei de Acesso à Informação - LAI) regula o acesso a informações públicas no Brasil. Sobre seus princípios e regras fundamentais, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "Todo cidadão tem direito de acesso a informações públicas, sendo o sigilo a exceção, e órgãos públicos devem responder aos pedidos de informação em prazo máximo de 20 dias, prorrogável por mais 10 dias.",
      },
      {
        letter: "B",
        text: "Apenas jornalistas e advogados têm direito de solicitar informações a órgãos públicos.",
      },
      {
        letter: "C",
        text: "Órgãos públicos podem negar qualquer pedido de informação sem necessidade de fundamentação.",
      },
      {
        letter: "D",
        text: "A LAI se aplica apenas ao Poder Executivo Federal, não alcançando estados e municípios.",
      },
      {
        letter: "E",
        text: "As informações pessoais de cidadãos podem ser divulgadas livremente por órgãos públicos, sem restrições.",
      },
    ],
    correctAnswer: "A",
    explanation:
      "A LAI (Lei 12.527/2011) estabelece: (1) Publicidade como regra, sigilo como exceção (art. 3º); (2) Qualquer pessoa pode solicitar informações, sem necessidade de motivação (art. 10); (3) Prazo de resposta: 20 dias, prorrogáveis por mais 10 (art. 11); (4) Aplica-se aos três poderes em todos os níveis da Federação; (5) Informações pessoais são protegidas (art. 31) — seu acesso é restrito ao titular ou terceiros autorizados; (6) Negativas de acesso devem ser fundamentadas e podem ser contestadas. A LAI é um instrumento fundamental de transparência e controle social.",
  },

  // --- CDC Digital ---
  {
    id: "leg_cdc_digital_001",
    topic: "Legislação",
    macroarea: "Segurança/IA",
    element: "CDC digital",
    difficulty: "médio" as const,
    statement:
      "Com o crescimento do comércio eletrônico, o Código de Defesa do Consumidor (CDC - Lei 8.078/1990) passou a ser aplicado extensivamente a relações de consumo digitais. Sobre os direitos do consumidor no ambiente digital, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "O CDC não se aplica a compras online, sendo exclusivamente voltado ao comércio físico (lojas presenciais).",
      },
      {
        letter: "B",
        text: "O direito de arrependimento permite ao consumidor desistir da compra online em até 7 dias após o recebimento do produto ou da contratação do serviço, sem necessidade de justificativa.",
      },
      {
        letter: "C",
        text: "O consumidor digital não possui direito a informações claras sobre o produto, pois assume o risco ao comprar online.",
      },
      {
        letter: "D",
        text: "Lojas virtuais não são obrigadas a exibir o CNPJ e endereço físico, bastando informar o e-mail de contato.",
      },
      {
        letter: "E",
        text: "Práticas abusivas como publicidade enganosa são permitidas no ambiente digital desde que o consumidor concorde com os termos de uso.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "O art. 49 do CDC garante o direito de arrependimento em compras fora do estabelecimento (incluindo online): o consumidor pode desistir no prazo de 7 dias a contar do recebimento ou da contratação. Outros direitos digitais: (1) Informação clara e completa (arts. 6º, III e 30); (2) Identificação do fornecedor (CNPJ, endereço); (3) Proibição de publicidade enganosa/abusiva (arts. 36-38); (4) Proteção contra práticas abusivas (art. 39); (5) Direito a reparação por danos. O Decreto 7.962/2013 regulamenta especificamente o comércio eletrônico.",
  },

  // --- Licitações e TI ---
  {
    id: "leg_licitacoes_001",
    topic: "Legislação",
    macroarea: "Segurança/IA",
    element: "Licitações e TI (Lei 14.133/2021)",
    difficulty: "difícil" as const,
    statement:
      "A nova Lei de Licitações e Contratos Administrativos (Lei 14.133/2021) trouxe mudanças significativas para a contratação de soluções de TI pelo Poder Público. Sobre a contratação de TI conforme a nova legislação, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "A Lei 14.133/2021 não traz nenhuma mudança em relação à legislação anterior (Lei 8.666/1993) no que se refere à contratação de TI.",
      },
      {
        letter: "B",
        text: "A nova lei proíbe completamente a contratação de TI por inexigibilidade, exigindo licitação em todos os casos.",
      },
      {
        letter: "C",
        text: "A Lei 14.133/2021 mantém a possibilidade de contratação de solutions integradas, mas exige demonstração de interesse público, justificativa da escolha, estimativa de preço em termos de TCO (Custo Total de Propriedade) e avaliação de riscos, além de prever formatos como diálogo competitivo e parceria para inovação.",
      },
      {
        letter: "D",
        text: "A contratação de serviços de TI é regulada exclusivamente pela Instrução Normativa SEGES/ME nº 01/2019, não sendo afetada pela Lei 14.133/2021.",
      },
      {
        letter: "E",
        text: "A nova lei elimina a necessidade de elaboração de Estudo Técnico Preliminar (ETP) para contratações de TI, simplificando o processo.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "A Lei 14.133/2021 introduziu inovações para contratação de TI: (1) §1º do art. 6º, XXIII: soluções de TI como bens e serviços de TI de forma integrada; (2) Art. 29, §4º: contratação de TI por inexigibilidade quando houver singularidade; (3) Art. 45: diálogo competitivo para contratações complexas; (4) Art. 47: parceria para inovação; (5) Exigência de ETP (Estudo Técnico Preliminar); (6) Avaliação em termos de SLA e TCO; (7) Integração com IN SEGES/ME nº 01/2019 e IN SGD/ME nº 94/2022. A IN 01/2019 foi atualizada para compatibilizar-se com a nova lei.",
  },

  // --- Patentes de Software ---
  {
    id: "leg_patentes_001",
    topic: "Legislação",
    macroarea: "Segurança/IA",
    element: "Patentes de software",
    difficulty: "médio" as const,
    statement:
      "Um inventor desenvolveu um algoritmo inovador de compressão de dados e deseja protegê-lo legalmente. Sobre a proteção de software por patentes e direitos autorais no Brasil, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "No Brasil, software pode ser patenteadado livremente no INPI, seguindo os mesmos trâmites de uma patente de invenção convencional.",
      },
      {
        letter: "B",
        text: "O Brasil proíbe completamente qualquer forma de proteção intelectual para software, que é considerado de domínio público.",
      },
      {
        letter: "C",
        text: "No Brasil, o software é protegido por direitos autorais (Lei 9.609/1998) e pelo INPI (registro de programa), mas não por patentes de invenção. A patente pode proteger o processo técnico inovador no qual o software está inserido, mas não o programa de computador em si.",
      },
      {
        letter: "D",
        text: "A proteção por patente é automaticamente concedida pelo INPI sem necessidade de exame de mérito, bastando o depósito do pedido.",
      },
      {
        letter: "E",
        text: "Software de código aberto (open source) não possui qualquer proteção intelectual e pode ser utilizado sem restrições.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "No Brasil: (1) Software é protegido por direitos autorais (Lei 9.609/1998, art. 2º), automaticamente ao ser criado; (2) Registro no INPI (não patente!) confere presunção de autoria (art. 3º); (3) O TRIPS (acordo da OMC) e a LPI (Lei 9.279/1996, art. 10, V) excluem programa de computador como patente de invenção; (4) No entanto, um processo técnico inovador que utiliza software pode ser patenteável se atender requisitos de novidade, atividade inventiva e aplicação industrial. Software open source é protegido por direitos autorais, com licenças que definem como pode ser usado (GPL, MIT, Apache).",
  },

  // --- Contratos Digitais ---
  {
    id: "leg_contratos_001",
    topic: "Legislação",
    macroarea: "Segurança/IA",
    element: "Contratos digitais",
    difficulty: "médio" as const,
    statement:
      "Com a popularização das transações digitais, os contratos eletrônicos ganharam relevância jurídica. Sobre a validade jurídica dos contratos celebrados por meio eletrônico no Brasil, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "Contratos eletrônicos não possuem validade jurídica no Brasil, pois o Código Civil exige documento físico com assinatura à caneta para qualquer contrato.",
      },
      {
        letter: "B",
        text: "A assinatura digital é o único meio válido para celebrar contratos eletrônicos, sendo a assinatura eletrônica simples e a eletrônica qualificada juridicamente inválidas.",
      },
      {
        letter: "C",
        text: "Contratos eletrônicos são plenamente válidos no Brasil, conforme o Marco Civil da Internet (art. 10) e a Lei de Contratações Eletrônicas. A assinatura digital (baseada em certificado ICP-Brasil) possui presunção de validade jurídica equivalente à assinatura física.",
      },
      {
        letter: "D",
        text: "Contratos celebrados por clique em 'Aceito os termos' (browsewrap) são sempre inválidos, pois não demonstram a vontade das partes.",
      },
      {
        letter: "E",
        text: "A validade dos contratos digitais depende exclusivamente da aprovação prévia do Ministério da Justiça para cada tipo de contrato.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "A validade jurídica dos contratos eletrônicos está assegurada por: (1) Marco Civil da Internet (art. 10): declaração de vontade por meio eletrônico tem mesma validade; (2) Medida Provisória 2.200-2/2001 (infraestrutura de chaves públicas — ICP-Brasil): assinatura digital equivale à assinatura física; (3) Código Civil (art. 107-110): validade do negócio jurídico. Há três níveis de assinatura: (a) simples (e-mail, login); (b) avançada (identificação + vínculo ao signatário); (c) qualificada (ICP-Brasil, presunção reforçada). O art. 4º-A do CDC exige destaque em cláusulas de contratos eletrônicos de consumo.",
  },

  // --- GDPR ---
  {
    id: "leg_gdpr_001",
    topic: "Legislação",
    macroarea: "Segurança/IA",
    element: "GDPR",
    difficulty: "difícil" as const,
    statement:
      "Uma empresa brasileira de e-commerce possui clientes na União Europeia e coleta seus dados pessoais. Sobre a aplicabilidade do GDPR (Regulamento Geral de Proteção de Dados da UE) e sua relação com a LGPD, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "O GDPR aplica-se apenas a empresas sediadas na União Europeia, não alcançando empresas brasileiras com clientes europeus.",
      },
      {
        letter: "B",
        text: "O GDPR aplica-se extraterritorialmente a qualquer organização que trate dados de pessoas localizadas na UE, independentemente da sede da empresa. O GDPR é mais restritivo que a LGPD em aspectos como o direito ao esquecimento, portabilidade e obrigatoriedade de DPO.",
      },
      {
        letter: "C",
        text: "O GDPR e a LGPD são idênticos em todos os aspectos, sendo a LGPD uma tradução literal do regulamento europeu.",
      },
      {
        letter: "D",
        text: "Se a empresa cumprir a LGPD, automaticamente está em conformidade com o GDPR, sem necessidade de medidas adicionais.",
      },
      {
        letter: "E",
        text: "O GDPR foi revogado pela LGPD para empresas brasileiras que operam na Europa.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "O GDPR (Regulamento UE 2016/679) aplica-se extraterritorialmente (art. 3º) a qualquer organização que ofereça bens/serviços na UE ou monitore comportamento de pessoas na UE. Diferenças em relação à LGPD: (1) GDPR é mais estrito sobre consentimento (deve ser explícito, não pode ser condicionado); (2) DPO obrigatório para certas entidades; (3) Prazos de resposta mais curtos (72h para violações); (4) Multas maiores (até €20 milhões ou 4% do faturamento global); (5) Privacy by Design é obrigatório (recomendado na LGPD). Empresas brasileiras com clientes na UE devem cumprir ambos os marcos regulatórios simultaneamente.",
  },

  // --- Governança de TI ---
  {
    id: "leg_governanca_001",
    topic: "Legislação",
    macroarea: "Segurança/IA",
    element: "Governança de TI",
    difficulty: "médio" as const,
    statement:
      "Uma organização pública federal está implementando sua Política de Segurança da Informação em conformidade com as normas do ITGI/ISACA e os requisitos legais brasileiros. Sobre o framework COBIT e sua aplicação na governança de TI no setor público brasileiro, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "O COBIT é um framework exclusivo para desenvolvimento de software, não sendo aplicável à governança de TI.",
      },
      {
        letter: "B",
        text: "O COBIT foca exclusivamente em aspectos financeiros de TI, como orçamento e custos de infraestrutura.",
      },
      {
        letter: "C",
        text: "O COBIT (Control Objectives for Information and Related Technologies) é um framework de governança de TI que alinha os objetivos de TI com os objetivos de negócio, cobrindo cinco domínios: APO (Planejar e Organizar), BAI (Construir e Adquirir), DSS (Entregar e Suportar), EDM (Avaliar, Dirigir e Monitorar) e MEA (Monitorar e Avaliar).",
      },
      {
        letter: "D",
        text: "No setor público brasileiro, o uso do COBIT é proibido pela Instrução Normativa SEDGG/ME nº 52/2021.",
      },
      {
        letter: "E",
        text: "O COBIT substitui completamente a ISO 27001, tornando-a obsoleta para gestão de segurança da informação.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "O COBIT é um framework de governança de TI que: (1) Alinha TI com objetivos de negócio (business-IT alignment); (2) Fornece processos e controles em domínios (COBIT 5 e COBIT 2019): EDM (Governança) + APO, BAI, DSS, MEA (Gestão); (3) Integra com outros frameworks (ITIL para serviços, ISO 27001 para segurança, PMBOK para projetos); (4) É amplamente adotado no setor público — a IN SEDGG/ME 52/2021 menciona COBIT como referência para estrutura de governança de TI. COBIT e ISO 27001 são complementares: COBIT para governança geral, ISO 27001 para segurança específica.",
  },

  // =============================================================================
  // ADDITIONAL QUESTIONS - Round 2 (boosting to 3+ per element)
  // =============================================================================

  // --- Criptografia Simétrica (adicional) ---
  {
    id: "cripto_simetrica_003",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "Criptografia simétrica",
    difficulty: "difícil" as const,
    statement:
      "Um sistema de comunicação em tempo real utiliza o algoritmo AES em modo de operação GCM (Galois/Counter Mode). Sobre as características do modo GCM e sua relação com a propriedade de autenticidade dos dados, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "O modo GCM proporciona apenas confidencialidade, sem garantir a integridade ou autenticidade dos dados cifrados.",
      },
      {
        letter: "B",
        text: "O modo GCM é um modo AEAD (Authenticated Encryption with Associated Data) que combina confidencialidade, integridade e autenticidade em uma única operação, utilizando cifragem em modo contador (CTR) para confidencialidade e uma função de hash GHASH para autenticação.",
      },
      {
        letter: "C",
        text: "O nonce (número usado uma vez) no GCM pode ser reutilizado com a mesma chave sem comprometer a segurança, pois o GHASH garante unicidade.",
      },
      {
        letter: "D",
        text: "O GCM opera exclusivamente com a cifra Blowfish, não sendo compatível com AES.",
      },
      {
        letter: "E",
        text: "O GCM não suporta dados associados (AAD), exigindo que todos os dados sejam cifrados para garantir autenticidade.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "GCM (Galois/Counter Mode) é um modo AEAD que combina: (1) Cifragem CTR para confidencialidade (paralelizável); (2) GHASH (função de hash baseada no campo de Galois GF(2^128)) para autenticação. O nonce DEVE ser único para cada cifragem com a mesma chave — reutilização do nonce compromete severamente a segurança (permite recuperação da chave). GCM suporta AAD (Associated Data) para autenticar metadados sem cifrá-los. É o modo recomendado pelo NIST e amplamente utilizado em TLS 1.3, IPSec e Wi-Fi (WPA3).",
  },

  // --- Criptografia Assimétrica (adicional) ---
  {
    id: "cripto_assimetrica_003",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "Criptografia assimétrica",
    difficulty: "fácil" as const,
    statement:
      "O protocolo Diffie-Hellman (DH) é amplamente utilizado para troca segura de chaves em comunicações inseguras. Sobre o Diffie-Hellman, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "O Diffie-Hellman permite a troca de uma chave secreta de forma segura sobre um canal inseguro, mas não pode ser utilizado para cifragem direta de mensagens.",
      },
      {
        letter: "B",
        text: "O Diffie-Hellman requer que as duas partes já possuam uma chave compartilhada previamente para estabelecer a comunicação.",
      },
      {
        letter: "C",
        text: "O Diffie-Hellman utiliza criptografia RSA internamente para garantir a segurança da troca de chaves.",
      },
      {
        letter: "D",
        text: "O Diffie-Hellman é um algoritmo simétrico que utiliza a mesma chave para cifrar e decifrar.",
      },
      {
        letter: "E",
        text: "O Diffie-Hellman proporciona autenticação das partes, garantindo que não há ataques de homem-do-meio.",
      },
    ],
    correctAnswer: "A",
    explanation:
      "Diffie-Hellman (1976) permite que duas partes estabeleçam uma chave secreta compartilhada sem tê-la trocado previamente. Baseia-se na dificuldade do problema do logaritmo discreto. Porém, DH puro não autentica as partes — é vulnerável a ataques de homem-do-meio (MITM). Por isso, DH é usado em combinação com autenticação (certificados digitais) em protocolos como TLS. DH é usado para estabelecer a chave de sessão, e depois a comunicação usa criptografia simétrica (mais rápida) com essa chave.",
  },

  // --- Funções Hash (adicional) ---
  {
    id: "cripto_hash_003",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "Funções hash",
    difficulty: "difícil" as const,
    statement:
      "Uma aplicação blockchain requer funções hash com propriedades específicas para garantir a integridade e imutabilidade da cadeia de blocos. A função SHA-256 é utilizada no protocolo Bitcoin. Sobre o papel das funções hash em blockchain e o conceito de resistência a colisões, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "A resistência a colisões em SHA-256 garante que ninguém consiga encontrar um bloco cujo hash comece com a quantidade exigida de zeros, tornando a mineração impossível.",
      },
      {
        letter: "B",
        text: "Em blockchain, cada bloco contém o hash do bloco anterior, criando uma corrente. Modificar um bloco alteraria seu hash, invalidando toda a cadeia posterior, e a prova de trabalho (PoW) exige encontrar um nonce que produza um hash menor que um alvo definido pela dificuldade.",
      },
      {
        letter: "C",
        text: "O SHA-256 utilizado no Bitcoin pode gerar colisões práticas, o que é explorado pelos mineradores para encontrar blocos válidos mais rapidamente.",
      },
      {
        letter: "D",
        text: "A função SHA-256 no Bitcoin é utilizada para criptografar as transações, garantindo que apenas o destinatário possa ler o conteúdo.",
      },
      {
        letter: "E",
        text: "A prova de trabalho no Bitcoin utiliza XOR em vez de funções hash, sendo o SHA-256 utilizado apenas para endereços de carteiras.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "Em blockchain (Bitcoin): cada bloco contém (1) dados/transações; (2) hash do bloco anterior; (3) nonce; (4) timestamp; (5) hash do Merkle root. A prova de trabalho exige que os mineradores encontrem um nonce tal que SHA-256(SHA-256(cabeçalho_do_bloco)) < target. Modificar qualquer bloco invalida seu hash e todos os hashes subsequentes na cadeia (efeito avalanche). A resistência a colisões garante que é impraticável forjar blocos com o mesmo hash.",
  },

  // --- Assinatura Digital (adicional) ---
  {
    id: "cripto_assinatura_003",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "Assinatura digital",
    difficulty: "fácil" as const,
    statement:
      "A ICP-Brasil (Infraestrutura de Chaves Públicas Brasileira) é o conjunto de entidades, políticas, procedimentos e técnicas que sustentam o uso de certificados digitais no Brasil. Sobre os tipos de certificados digitais emitidos no âmbito da ICP-Brasil, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "A ICP-Brasil emite apenas um tipo de certificado digital, sem diferenciação por nível de segurança ou finalidade.",
      },
      {
        letter: "B",
        text: "A ICP-Brasil emite certificados de três tipos: A1 (software, validade 1 ano), A3 (hardware/token, validade 3 anos) e S (servidor), sendo os certificados A1 e A3 equiparados legalmente a documentos de identidade com presunção de veracidade.",
      },
      {
        letter: "C",
        text: "Certificados digitais da ICP-Brasil são válidos apenas para assinatura de e-mails, não sendo aceitos para fins legais ou judiciais.",
      },
      {
        letter: "D",
        text: "O certificado tipo A1 é mais seguro que o tipo A3, pois armazena a chave privada em hardware dedicado.",
      },
      {
        letter: "E",
        text: "A ICP-Brasil foi descontinuada e substituída pela certificação digital internacional, não sendo mais reconhecida legalmente no Brasil.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "A ICP-Brasil (MP 2.200-2/2001, Lei 14.063/2020) emite: (1) A1: chave armazenada em software, validade 1-5 anos, nível de segurança básico; (2) A2: em desuso; (3) A3: chave armazenada em cartão inteligente/token (hardware), validade 3-5 anos, nível de segurança alto; (4) A4: descontinuado; (5) S (Servidor): para TLS/SSL em servidores. Certificados A1 e A3 têm presunção de veracidade da assinatura (art. 10 da MP 2.200-2). O A3 é MAIS seguro que o A1 pois a chave privada nunca sai do hardware.",
  },

  // --- SSL/TLS (adicional) ---
  {
    id: "cripto_ssl_tls_002",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "SSL/TLS",
    difficulty: "fácil" as const,
    statement:
      "Um usuário acessa um site de compras e o navegador exibe o aviso 'Sua conexão não é privada' com o erro NET::ERR_CERT_AUTHORITY_INVALID. Sobre as possíveis causas e implicações desse erro, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "O erro indica que o site utiliza HTTP em vez de HTTPS e não possui certificado digital.",
      },
      {
        letter: "B",
        text: "O erro geralmente indica que o certificado digital do site não foi emitido por uma Autoridade Certificadora confiável, está expirado, ou o nome do certificado não corresponde ao domínio acessado, e o usuário deve evitar navegar nesse site.",
      },
      {
        letter: "C",
        text: "O erro é apenas informativo e não representa nenhum risco à segurança, sendo seguro prosseguir com a navegação.",
      },
      {
        letter: "D",
        text: "Esse erro ocorre exclusivamente quando o certificado foi emitido pela ICP-Brasil, que não é reconhecida pelos navegadores.",
      },
      {
        letter: "E",
        text: "O erro significa que a versão do TLS utilizada é muito recente e o navegador não oferece suporte.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "O erro ERR_CERT_AUTHORITY_INVALID indica problemas com o certificado digital: (1) emitido por AC não confiável (self-signed ou AC desconhecida); (2) certificado expirado; (3) nome no certificado (CN/SAN) não corresponde ao domínio; (4) certificado revogado. Navegar nesse site é perigoso, pois não há garantia de autenticidade do servidor (risco de MITM). Certificados Let's Encrypt são gratuitos e amplamente confiáveis, facilitando a adoção de HTTPS. A ICP-Brasil é reconhecida pelos navegadores para certificados de assinatura.",
  },
  {
    id: "cripto_ssl_tls_003",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "SSL/TLS",
    difficulty: "difícil" as const,
    statement:
      "Uma empresa implementou o protocolo TLS 1.3 em seu servidor web. Durante uma auditoria de segurança, foi identificado que o servidor também suporta TLS 1.1 como fallback para clientes legados. Sobre os riscos de segurança dessa configuração e o conceito de downgrade attack, qual afirmação é correta?",
    alternatives: [
      {
        letter: "A",
        text: "Manter TLS 1.1 como fallback é uma boa prática de compatibilidade que não introduz riscos de segurança, pois os clientes sempre usarão a versão mais recente disponível.",
      },
      {
        letter: "B",
        text: "O suporte a versões antigas do TLS permite ataques de downgrade (como FREAK ou POODLE) em que um atacante força a negociação para versões inseguras, explorando vulnerabilidades corrigidas apenas nas versões mais recentes. A RFC 8996 descontinuou oficialmente o TLS 1.0 e TLS 1.1.",
      },
      {
        letter: "C",
        text: "Downgrade attacks são mitigados automaticamente pelo TLS 1.3, mesmo quando versões antigas estão habilitadas no servidor.",
      },
      {
        letter: "D",
        text: "O TLS 1.1 é seguro para uso em produção quando combinado com certificados de 2048 bits.",
      },
      {
        letter: "E",
        text: "Ataques de downgrade só afetam protocolos SSL, sendo o TLS imune a esse tipo de ataque.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "Ataques de downgrade exploram a compatibilidade retroativa: um atacante MITM modifica a negociação para forçar o uso de versões mais antigas e vulneráveis do protocolo. O TLS 1.3 introduziu mecanismos de proteção (versão do TLS 1.3 incluída no ServerHello cifrado), mas se o servidor aceita TLS 1.1, o atacante pode interceptar antes do handshake do TLS 1.3. A RFC 8996 (março de 2021) descontinuou oficialmente TLS 1.0 e 1.1. Melhores práticas: desabilitar versões antigas no servidor, usar apenas TLS 1.2 e 1.3.",
  },

  // --- Certificados e PKI (adicionais) ---
  {
    id: "cripto_pki_001",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "Certificados e PKI",
    difficulty: "médio" as const,
    statement:
      "Uma empresa precisa implementar uma Infraestrutura de Chaves Públicas (PKI) interna para gerenciar certificados digitais de seus funcionários. Sobre os componentes e o funcionamento de uma PKI, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "Uma PKI é composta exclusivamente por um servidor de certificados, dispensando a necessidade de Autoridades Certificadoras (AC) ou Autoridades de Registro (AR).",
      },
      {
        letter: "B",
        text: "Os componentes de uma PKI incluem a Autoridade Certificadora (AC) que emite certificados, a Autoridade de Registro (AR) que valida a identidade dos solicitantes, o repositório de certificados e chaves, e as Listas de Revogação de Certificados (CRL/OCSP) para verificar certificados revogados.",
      },
      {
        letter: "C",
        text: "Em uma PKI, certificados digitais uma vez emitidos nunca podem ser revogados, pois a estrutura criptográfica não permite invalidação.",
      },
      {
        letter: "D",
        text: "Uma PKI utiliza apenas chaves simétricas para operações de certificação, não envolvendo criptografia assimétrica.",
      },
      {
        letter: "E",
        text: "O protocolo OCSP (Online Certificate Status Protocol) é mais lento que CRLs porque requer download de listas completas para cada verificação.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "Uma PKI é composta por: (1) AC (Autoridade Certificadora): emite e assina certificados; (2) AR (Autoridade de Registro): verifica identidade dos solicitantes; (3) Repositório: armazena certificados públicos; (4) CRL (Certificate Revocation List): lista de certificados revogados; (5) OCSP: verificação online de status de certificado (mais eficiente que CRL para verificação individual). A PKI baseia-se em criptografia assimétrica: a AC assina certificados com sua chave privada. Certificados podem ser revogados antes do vencimento por comprometimento de chave, mudança de dados ou encerramento de atividades.",
  },
  {
    id: "cripto_pki_002",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "Certificados e PKI",
    difficulty: "fácil" as const,
    statement:
      "Um certificado digital X.509 contém diversas informações sobre o titular e a entidade que o emitiu. Sobre a estrutura e o conteúdo de um certificado digital X.509, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "O certificado contém a chave privada do titular, permitindo que qualquer pessoa que o receba decifre mensagens enviadas ao titular.",
      },
      {
        letter: "B",
        text: "O certificado X.509 contém informações como o nome do titular (subject), a chave pública do titular, o nome da AC emissora (issuer), o período de validade, o número de série e a assinatura digital da AC sobre todo o certificado.",
      },
      {
        letter: "C",
        text: "O certificado digital X.509 é um formato exclusivo da ICP-Brasil, não sendo utilizado internacionalmente.",
      },
      {
        letter: "D",
        text: "A assinatura da AC no certificado é opcional e serve apenas para fins de auditoria, não para verificação de autenticidade.",
      },
      {
        letter: "E",
        text: "O número de série do certificado é gerado pelo titular e não pode ser alterado pela Autoridade Certificadora.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "Um certificado X.509 contém: (1) Versão do formato X.509; (2) Número de série (único por AC); (3) Algoritmo de assinatura; (4) Nome da AC emissora (Issuer); (5) Período de validade (Not Before / Not After); (6) Nome do titular (Subject); (7) Chave pública do titular; (8) Extensões (SAN, Key Usage, Basic Constraints); (9) Assinatura digital da AC sobre todo o certificado. A chave privada NUNCA é incluída no certificado — ela pertence exclusivamente ao titular. O padrão X.509 é internacional, definido pela IETF (RFC 5280).",
  },

  // --- Esteganografia (adicional) ---
  {
    id: "cripto_estego_002",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "Esteganografia",
    difficulty: "fácil" as const,
    statement:
      "A técnica de esteganografia LSB (Least Significant Bit) é uma das mais utilizadas para embutir informações em imagens. Sobre essa técnica, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "A técnica LSB modifica os bits mais significativos de cada pixel, causando alterações visíveis na imagem.",
      },
      {
        letter: "B",
        text: "A técnica LSB substitui os bits menos significativos de cada pixel pela informação secreta, causando alterações imperceptíveis ou quase imperceptíveis ao olho humano, mas que podem ser detectadas por ferramentas de análise estatística.",
      },
      {
        letter: "C",
        text: "A técnica LSB só funciona com imagens em formato JPEG, sendo incompatível com PNG ou BMP.",
      },
      {
        letter: "D",
        text: "A técnica LSB permite embutir mais dados que o tamanho original da imagem.",
      },
      {
        letter: "E",
        text: "A técnica LSB é insegura porque destrói completamente a imagem original, tornando-a irrecognizável.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "A técnica LSB (Least Significant Bit) funciona modificando o bit menos significativo de cada componente de cor (R, G, B) de cada pixel. Como o bit menos significativo tem o menor peso na representação da cor, a alteração visual é imperceptível (variação de 1 em 256 níveis por canal). Uma imagem BMP de 1024×768 com 3 canais pode esconder ~235 KB de dados (1 bit por canal). A desvantagem é ser vulnerável a técnicas de detecção como análise de histograma, chi-squared eRS analysis. Formatos com compressão (JPEG) perdem dados, dificultando a extração.",
  },

  // --- Criptoanálise (adicional) ---
  {
    id: "cripto_criptoanalise_002",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "Criptoanálise",
    difficulty: "médio" as const,
    statement:
      "O ataque de 'força bruta' é a técnica de criptoanálise mais direta para quebrar criptografia. Considerando o cenário atual de hardware e a segurança de diferentes algoritmos, qual afirmação é correta?",
    alternatives: [
      {
        letter: "A",
        text: "Uma chave AES-128 pode ser quebrada por força bruta em poucas horas com computadores pessoais modernos.",
      },
      {
        letter: "B",
        text: "A segurança do AES-256 contra força bruta é garantida pela imensa quantidade de chaves possíveis (2^256 ≈ 10^77), tornando a busca exaustiva computacionalmente inviável mesmo com supercomputadores atuais e futuros previsíveis.",
      },
      {
        letter: "C",
        text: "Ataques de força bruta nunca são viáveis, pois sempre requerem mais tempo que a idade do universo.",
      },
      {
        letter: "D",
        text: "O aumento da chave de AES-128 para AES-256 dobra o tempo necessário para quebra por força bruta.",
      },
      {
        letter: "E",
        text: "Ataques de força bruta só funcionam contra criptografia simétrica, sendo ineficazes contra criptografia assimétrica.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "AES-256 possui 2^256 chaves possíveis (~1,16 × 10^77). Para efeito de comparação, o número de átomos no universo observável é ~10^80. Mesmo com todos os computadores da Terra operando em conjunto, seriam necessários bilhões de anos. Importante: AES-256 para AES-128 não dobra o tempo — multiplica por 2^128, ou seja, é 340 undecilhões de vezes mais difícil. Ataques de força bruta também se aplicam a criptografia assimétrica (tentar fatorar o módulo RSA). Senhas fracas são vulneráveis a ataques de dicionário (forma otimizada de força bruta).",
  },

  // --- Gestão de Chaves (adicional) ---
  {
    id: "cripto_gestao_chaves_002",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "Gestão de chaves",
    difficulty: "difícil" as const,
    statement:
      "Uma organização utiliza um HSM (Hardware Security Module) para proteger suas chaves criptográficas. Sobre o ciclo de vida de chaves criptográficas e o papel de HSMs na gestão segura de chaves, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "HSMs são dispositivos puramente de software que executam em servidores convencionais, não oferecendo vantagens de segurança em relação ao armazenamento de chaves em disco.",
      },
      {
        letter: "B",
        text: "O ciclo de vida de chaves inclui geração, distribuição, armazenamento, uso, rotação e destruição. HSMs são dispositivos de hardware dedicados com medidas de proteção física e lógica que realizam operações criptográficas dentro de um ambiente seguro (sandbox de hardware), impedindo extração das chaves mesmo com acesso físico.",
      },
      {
        letter: "C",
        text: "Uma vez gerada dentro do HSM, a chave pode ser livremente exportada e utilizada em qualquer servidor sem comprometer a segurança.",
      },
      {
        letter: "D",
        text: "A rotação de chaves é desnecessária quando se utiliza HSM, pois o hardware garante proteção perpétua.",
      },
      {
        letter: "E",
        text: "HSMs são utilizados exclusivamente por instituições financeiras, sendo proibido seu uso por empresas de outros setores.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "O ciclo de vida de chaves (NIST SP 800-57): (1) Geração: com fontes de aleatoriedade adequadas; (2) Distribuição: por canais seguros; (3) Armazenamento: em HSM ou keystore seguro; (4) Uso: conforme política de segurança; (5) Rotação: substituição periódica; (6) Destruição: descarte seguro. HSMs (nível FIPS 140-2/3) oferecem: proteção física contra invasão, operações criptográficas dentro do hardware (chaves nunca saem do HSM em claro), logs de auditoria, controle de acesso granular. São usados em bancários, cloud providers (AWS CloudHSM, Azure Key Vault) e PKIs.",
  },

  // --- Busca (adicional) ---
  {
    id: "ia_busca_002",
    topic: "Inteligência Artificial",
    macroarea: "Segurança/IA",
    element: "Busca",
    difficulty: "fácil" as const,
    statement:
      "Em um jogo de quebra-cabeça, um jogador precisa encontrar o caminho mais curto em um labirinto onde todas as movimentações têm o mesmo custo (cada passo vale 1). Qual algoritmo de busca é garantidamente ótimo para encontrar o menor caminho nesse cenário?",
    alternatives: [
      {
        letter: "A",
        text: "Busca em profundidade (DFS), pois explora cada ramo até o final antes de retroceder.",
      },
      {
        letter: "B",
        text: "Busca gulosa, pois sempre escolhe o nó mais próximo do objetivo usando uma heurística.",
      },
      {
        letter: "C",
        text: "Busca em largura (BFS), pois explora todos os nós a uma distância d antes de explorar nós a distância d+1, garantindo o caminho mais curto em grafos não ponderados.",
      },
      {
        letter: "D",
        text: "Busca de custo uniforme, pois é o único algoritmo que funciona em grafos.",
      },
      {
        letter: "E",
        text: "Busca bidirecional, que só funciona em grafos com ciclos.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "Em grafos não ponderados (todos os custos iguais), a BFS é garantidamente ótima: ela explora todos os nós na profundidade d antes de ir para d+1, encontrando o menor caminho. Complexidade: O(V+E). A DFS não garante o menor caminho. A busca gulosa pode ser não ótima pois não considera o custo já percorrido. A busca de custo uniforme é uma generalização da BFS para grafos ponderados (com fila de prioridade). Para grafos não ponderados, BFS e custo uniforme produzem o mesmo resultado.",
  },
  {
    id: "ia_busca_003",
    topic: "Inteligência Artificial",
    macroarea: "Segurança/IA",
    element: "Busca",
    difficulty: "médio" as const,
    statement:
      "O algoritmo Minimax é amplamente utilizado em jogos adversariais como xadrez e damas. Para melhorar sua eficiência, utiliza-se frequentemente a poda alfa-beta (alpha-beta pruning). Sobre a poda alfa-beta, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "A poda alfa-beta reduz a complexidade do Minimax de O(b^d) para O(b^(d/2)) no melhor caso, sem alterar o resultado final da busca.",
      },
      {
        letter: "B",
        text: "A poda alfa-beta elimina completamente a necessidade de uma função de avaliação heurística.",
      },
      {
        letter: "C",
        text: "A poda alfa-beta só funciona em jogos de um único jogador, sem adversário.",
      },
      {
        letter: "D",
        text: "A poda alfa-beta sempre reduz o número de nós visitados pela metade, independentemente da ordem de avaliação dos nós.",
      },
      {
        letter: "E",
        text: "A poda alfa-beta compromete a optimalidade da decisão, podendo levar a piores jogadas que o Minimax puro.",
      },
    ],
    correctAnswer: "A",
    explanation:
      "Minimax avalia a árvore de jogo considerando que o adversário também joga de forma ótima. Sem poda: O(b^d), onde b = fator de ramificação e d = profundidade. Com poda alfa-beta: melhor caso O(b^(d/2)) — dobrando a profundidade possível. Alpha = melhor valor garantido para o maximizador; Beta = melhor valor garantido para o minimizador. Quando alpha >= beta, poda-se o ramo. A eficiência depende da ordem de avaliação dos nós (melhor resultado quando nós mais promissores são avaliados primeiro). O resultado é idêntico ao Minimax sem poda.",
  },

  // --- Aprendizado de Máquina (adicional) ---
  {
    id: "ia_ml_002",
    topic: "Inteligência Artificial",
    macroarea: "Segurança/IA",
    element: "Aprendizado de máquina",
    difficulty: "médio" as const,
    statement:
      "Uma empresa de e-commerce deseja segmentar seus clientes em grupos homogêneos com base em comportamento de compra, frequência de acesso e valor gasto, sem utilizar rótulos pré-definidos. Qual tipo de algoritmo de aprendizado de máquina é mais adequado para essa tarefa?",
    alternatives: [
      {
        letter: "A",
        text: "Regressão linear, pois pode prever o valor gasto por cada cliente.",
      },
      {
        letter: "B",
        text: "K-Means clustering, pois é um algoritmo de aprendizado não supervisionado que particiona os dados em k grupos baseados em similaridade, sem necessidade de rótulos.",
      },
      {
        letter: "C",
        text: "Classificação por Random Forest, pois pode atribuir cada cliente a uma categoria pré-definida.",
      },
      {
        letter: "D",
        text: "Redes neurais recorrentes (RNN), pois são adequadas para dados temporais de compra.",
      },
      {
        letter: "E",
        text: "Regressão logística, pois modela a probabilidade de um cliente pertencer a um grupo.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "O K-Means é um algoritmo de clustering (aprendizado não supervisionado) que: (1) define k centróides iniciais; (2) atribui cada ponto ao centróide mais próximo; (3) recalcula os centróides como média dos pontos do grupo; (4) repete até convergência. É ideal para segmentação quando não existem rótulos prévios. Outros algoritmos de clustering: DBSCAN (densidade-based, detecta ruído), hierárquico (dendrogramas), Gaussian Mixture Models. Para este caso, K-Means é a escolha mais comum pela simplicidade e eficiência.",
  },
  {
    id: "ia_ml_003",
    topic: "Inteligência Artificial",
    macroarea: "Segurança/IA",
    element: "Aprendizado de máquina",
    difficulty: "difícil" as const,
    statement:
      "Em um problema de classificação binária com dataset desbalanceado (1% de positivos, 99% de negativos), um modelo que classifica todas as instâncias como negativas obtém 99% de acurácia. Sobre os desafios de datasets desbalanceados e as métricas adequadas, qual afirmação é correta?",
    alternatives: [
      {
        letter: "A",
        text: "A acurácia é uma métrica adequada para datasets desbalanceados, pois refleta fielmente a distribuição natural das classes.",
      },
      {
        letter: "B",
        text: "Nesse cenário, deve-se priorizar métricas como precision, recall, F1-score e a curva ROC-AUC, além de técnicas como SMOTE (oversampling), undersampling ou ajuste de pesos das classes para lidar com o desbalanceamento.",
      },
      {
        letter: "C",
        text: "O desbalanceamento de classes não é um problema, pois algoritmos de machine learning tratam automaticamente todas as classes de forma igual.",
      },
      {
        letter: "D",
        text: "A melhor solução é remover todos os exemplos da classe majoritária para equilibrar o dataset.",
      },
      {
        letter: "E",
        text: "O recall não é afetado pelo desbalanceamento de classes, sendo sempre uma métrica confiável.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "Em datasets desbalanceados, a acurácia é enganosa: um classificador trivial (sempre prediz a classe majoritária) obtém alta acurácia sem aprender. Métricas adequadas: (1) Precision = VP/(VP+FP) — dentre os positivos previstos, quantos são reais; (2) Recall = VP/(VP+FN) — dentre os positivos reais, quantos foram detectados; (3) F1 = média harmônica de precision e recall; (4) ROC-AUC — área sob a curva. Técnicas de tratamento: SMOTE (gera exemplos sintéticos da classe minoritária), class_weight (penaliza mais erros na minoria), undersampling estratégico.",
  },

  // --- Overfitting e Underfitting (adicional) ---
  {
    id: "ia_overfitting_002",
    topic: "Inteligência Artificial",
    macroarea: "Segurança/IA",
    element: "Overfitting e underfitting",
    difficulty: "fácil" as const,
    statement:
      "Uma equipe de data science está treinando um modelo de regressão polinomial. Ao aumentar excessivamente o grau do polinômio, o modelo começa a se ajustar perfeitamente aos dados de treino, mas apresenta desempenho ruim nos dados de teste. Qual técnica é mais adequada para mitigar esse problema?",
    alternatives: [
      {
        letter: "A",
        text: "Aumentar a complexidade do modelo adicionando mais variáveis e interações.",
      },
      {
        letter: "B",
        text: "Utilizar regularização (L1/Lasso ou L2/Ridge) que adiciona uma penalidade aos coeficientes do modelo, reduzindo a complexidade efetiva e prevenindo o overfitting.",
      },
      {
        letter: "C",
        text: "Remover completamente a fase de validação para que o modelo foque apenas nos dados de treino.",
      },
      {
        letter: "D",
        text: "Aumentar o tamanho do batch no treinamento para estabilizar os pesos.",
      },
      {
        letter: "E",
        text: "Utilizar uma função de custo baseada em acurácia em vez de erro quadrático.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "A regularização adiciona um termo de penalização à função de custo: (1) L2 (Ridge): penaliza a soma dos quadrados dos coeficientes (λΣw²) — reduz os pesos sem zerá-los; (2) L1 (Lasso): penaliza a soma dos valores absolutos (λΣ|w|) — pode zerar coeficientes, servindo como seleção de features. Ambas reduzem a complexidade efetiva do modelo, prevenindo overfitting. Outras técnicas: validação cruzada k-fold, dropout (redes neurais), early stopping, data augmentation, redução de complexidade do modelo. O parâmetro λ controla a força da regularização.",
  },

  // --- Agentes Inteligentes (adicionais) ---
  {
    id: "ia_agentes_001",
    topic: "Inteligência Artificial",
    macroarea: "Segurança/IA",
    element: "Agentes inteligentes",
    difficulty: "médio" as const,
    statement:
      "Em um sistema de casa inteligente, um assistente virtual monitora sensores de temperatura, luminosidade e presença para controlar automaticamente ar-condicionado, iluminação e sistema de segurança. De acordo com a taxonomia de agentes inteligentes de Russell e Norvig, esse sistema pode ser classificado como:",
    alternatives: [
      {
        letter: "A",
        text: "Agente reativo simples, pois apenas reage a estímulos do ambiente sem manter estado interno.",
      },
      {
        letter: "B",
        text: "Agente baseado em modelo, pois mantém uma representação interna do estado do mundo (temperatura, presença) e utiliza essa informação para tomar decisões mesmo sem observação direta contínua.",
      },
      {
        letter: "C",
        text: "Agente baseado em objetivos, pois possui uma função de utilidade que maximiza o conforto do usuário.",
      },
      {
        letter: "D",
        text: "Agente baseado em utilidade, pois calcula a utilidade esperada de cada ação considerando incertezas probabilísticas.",
      },
      {
        letter: "E",
        text: "Agente de aprendizado, pois ainda não possui conhecimento suficiente sobre as preferências do usuário.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "Taxonomia de agentes (Russell & Norvig): (1) Reativo simples: apenas mapeia percepção → ação (sem estado); (2) Reativo com modelo: mantém estado interno do mundo; (3) Baseado em conhecimento: possui conhecimento representado e pode inferir ações; (4) Baseado em objetivos: tem objetivo explícito a alcançar; (5) Baseado em utilidade: maximiza uma função de utilidade. O assistente de casa inteligente mantém estado (temperatura atual, quem está em casa) e usa esse modelo para decidir ações — é um agente baseado em modelo. Também pode ser baseado em utilidade se otimiza conforto/energia.",
  },
  {
    id: "ia_agentes_002",
    topic: "Inteligência Artificial",
    macroarea: "Segurança/IA",
    element: "Agentes inteligentes",
    difficulty: "difícil" as const,
    statement:
      "Um agente racional interage com um ambiente estocástico, onde as ações nem sempre produzem resultados previsíveis. O agente precisa escolher ações que maximizem sua recompensa acumulada ao longo do tempo. Qual paradigma de IA é mais adequado para esse tipo de problema?",
    alternatives: [
      {
        letter: "A",
        text: "Busca em profundidade limitada com heurística admissível.",
      },
      {
        letter: "B",
        text: "Aprendizado por reforço (Reinforcement Learning), onde o agente aprende uma política ótima através de tentativa e erro, recebendo recompensas ou punições do ambiente, utilizando conceitos como valor de estado (V), função Q (Q-learning) e equação de Bellman.",
      },
      {
        letter: "C",
        text: "Aprendizado supervisionado com redes neurais profundas.",
      },
      {
        letter: "D",
        text: "Clustering hierárquico para agrupar estados similares do ambiente.",
      },
      {
        letter: "E",
        text: "Árvore de decisão com poda de complexidade de custo (CPC).",
      },
    ],
    correctAnswer: "B",
    explanation:
      "O aprendizado por reforço (RL) é o paradigma para agentes que interagem com ambientes estocásticos: (1) Agente: toma ações; (2) Ambiente: estado que muda em resposta às ações (estocástico); (3) Recompensa: feedback numérico; (4) Política (π): estratégia do agente. Algoritmos: Q-learning (valoriza pares estado-ação), SARSA (on-policy), Deep Q-Network (DQN), PPO, A3C. Equação de Bellman: V(s) = max_a [R(s,a) + γΣP(s'|s,a)V(s')]. RL foi usado para AlphaGo, Dota 2, robótica e sistemas de recomendação.",
  },

  // --- Ciclo de Vida do Dado (adicional) ---
  {
    id: "cd_ciclo_vida_001",
    topic: "Ciência de Dados",
    macroarea: "Segurança/IA",
    element: "Ciclo de vida do dado",
    difficulty: "médio" as const,
    statement:
      "O ciclo de vida do dado (data lifecycle) descreve as fases pelas quais os dados passam em uma organização. Sobre as etapas do ciclo de vida do dado e a governança de dados, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "O ciclo de vida do dado se resume a três etapas: coleta, armazenamento e descarte.",
      },
      {
        letter: "B",
        text: "O ciclo de vida do dado inclui fases como planejamento, coleta/aquisição, armazenamento, processamento, análise, compartilhamento, arquivamento e descarte, devendo cada fase ter controles de qualidade e segurança adequados.",
      },
      {
        letter: "C",
        text: "A governança de dados é responsabilidade exclusiva do departamento de TI, sem necessidade de envolvimento de áreas de negócio.",
      },
      {
        letter: "D",
        text: "Dados arquivados podem ser descartados a qualquer momento sem impacto regulatório ou legal.",
      },
      {
        letter: "E",
        text: "O descarte de dados é uma etapa opcional no ciclo de vida, pois armazenamento é infinito e barato.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "O ciclo de vida do dados (DAMA-DMBOK): (1) Planejamento: definir que dados coletar e por quê; (2) Coleta/Aquisição: extração de fontes diversas; (3) Armazenamento: em data lakes/warehouses; (4) Processamento/Transformação: limpeza e estruturação; (5) Análise: mineração e modelagem; (6) Visualização/Compartilhamento: dashboards e relatórios; (7) Arquivamento: dados históricos (compliance); (8) Descarte: eliminação segura conforme política de retenção (LGPD exige eliminação de dados quando a finalidade for atingida). A governança de dados é transversal a todas as fases.",
  },

  // --- Ferramentas (adicionais) ---
  {
    id: "cd_ferramentas_001",
    topic: "Ciência de Dados",
    macroarea: "Segurança/IA",
    element: "Ferramentas",
    difficulty: "médio" as const,
    statement:
      "Uma equipe de ciência de dados precisa escolher ferramentas para seu stack tecnológico. Sobre as características e casos de uso das ferramentas mais comuns em ciência de dados, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "O Apache Spark é recomendado para processamento de dados em um único servidor com datasets pequenos, substituindo o pandas em todos os cenários.",
      },
      {
        letter: "B",
        text: "O Jupyter Notebook é utilizado exclusivamente para execução de código Python, não suportando outras linguagens como R ou Julia.",
      },
      {
        letter: "C",
        text: "Ferramentas como pandas (análise de dados tabulares), Apache Spark (processamento distribuído de big data), Jupyter (desenvolvimento interativo), PostgreSQL (banco relacional) e Apache Kafka (streaming de dados) desempenham papéis complementares no ecossistema de ciência de dados, cada uma adequada a diferentes escalas e tipos de problema.",
      },
      {
        letter: "D",
        text: "O PostgreSQL é um banco de dados NoSQL que não suporta consultas SQL.",
      },
      {
        letter: "E",
        text: "O Apache Kafka é uma ferramenta de visualização de dados similar ao Tableau e Power BI.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "O ecossistema de ferramentas de ciência de dados inclui: (1) Python/R: linguagens principais; (2) pandas/NumPy: análise de dados em memória; (3) Apache Spark: processamento distribuído para Big Data; (4) Jupyter/RMarkdown: notebooks interativos; (5) PostgreSQL/MongoDB: bancos relacionais/NoSQL; (6) Kafka: streaming de eventos em tempo real; (7) Airflow/orchestration: orquestração de pipelines; (8) Tableau/Power BI/Matplotlib: visualização; (9) scikit-learn/TensorFlow/PyTorch: machine learning. A escolha depende do volume de dados, complexidade do problema e infraestrutura disponível.",
  },

  // --- Impacto da Automação (adicional) ---
  {
    id: "etica_automacao_001",
    topic: "Ética Profissional",
    macroarea: "Segurança/IA",
    element: "Impacto da automação",
    difficulty: "médio" as const,
    statement:
      "A automação de processos por meio de IA e RPA (Robotic Process Automation) está transformando o mercado de trabalho. Sobre o impacto da automação nas profissões de TI e a responsabilidade do profissional, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "A automação eliminará completamente a necessidade de profissionais de TI, pois sistemas autônomos substituirão todas as funções tecnológicas.",
      },
      {
        letter: "B",
        text: "A automação elimina apenas empregos de baixa qualificação, sendo profissionais de TI completamente imunes à automação.",
      },
      {
        letter: "C",
        text: "A automação transforma o mercado de trabalho, eliminando algumas funções repetitivas e criando novas demandas por habilidades como gestão de IA, segurança de sistemas autônomos, ética algorítmica e integração humano-máquina, exigindo aprendizado contínuo (lifelong learning) dos profissionais.",
      },
      {
        letter: "D",
        text: "O profissional de TI deve resistir à automação para proteger empregos, evitando a implementação de soluções automatizadas.",
      },
      {
        letter: "E",
        text: "A automação é um fenômeno exclusivamente negativo, sem nenhum benefício para a sociedade ou para os profissionais.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "A automação segue o padrão histórico de revoluções tecnológicas: elimina empregos repetitivos e cria novas oportunidades. Para profissionais de TI: (1) Tarefas operacionais (DevOps básico, monitoramento, testes) estão sendo automatizadas; (2) Novas demandas: arquitetura de IA, MLOps, segurança de IA, governança de dados, UX/AI; (3) Relatórios do Fórum Econômico Mundial apontam que a automação criará mais empregos do que eliminará, mas exigirá reskilling e upskilling. O conceito de 'aprendizagem ao longo da vida' é essencial para adaptação.",
  },

  // --- LGPD e Privacidade - Microarea 11 (adicional) ---
  {
    id: "cripto_lgpd_priv_001",
    topic: "Criptografia",
    macroarea: "Segurança/IA",
    element: "LGPD e privacidade",
    difficulty: "médio" as const,
    statement:
      "Uma empresa foi vítima de um vazamento de dados e precisa notificar a ANPD (Autoridade Nacional de Proteção de Dados) e os titulares afetados. Sobre as obrigações de notificação da LGPD em caso de incidentes de segurança, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "A notificação à ANPD é obrigatória apenas quando o vazamento envolver dados financeiros, sendo dispensável para outros tipos de dados pessoais.",
      },
      {
        letter: "B",
        text: "A LGPD não exige notificação de incidentes de segurança, sendo uma prática recomendada mas não obrigatória.",
      },
      {
        letter: "C",
        text: "A LGPD exige que o controlador comunique à ANPD e aos titulares a ocorrência de incidente de segurança que possa acarretar risco ou dano relevante aos titulares, em prazo razoável, incluindo a natureza dos dados, informações sobre o controlador, descrição dos riscos e medidas adotadas.",
      },
      {
        letter: "D",
        text: "A notificação deve ser feita exclusivamente à ANPD, sendo proibido comunicar diretamente os titulares afetados.",
      },
      {
        letter: "E",
        text: "O prazo para notificação é de 90 dias corridos após a detecção do incidente.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "O art. 48 da LGPD estabelece: o controlador deve comunicar à ANPD e aos titulares incidentes que possam acarretar risco ou dano relevante, em prazo razoável. A notificação deve conter (art. 48, §1º): (I) descrição da natureza dos dados; (II) informações sobre o controlador; (III) descrição dos riscos e consequências; (IV) medidas técnicas e de segurança adotadas; (V) medidas para tratar o incidente; (VI) autoridade que recebeu a notificação. Comparativamente, o GDPR exige notificação em 72 horas. A LGPD não fixa prazo específico, mas o 'razoável' é interpretado com base no risco.",
  },

  // --- Lei de Acesso à Informação (adicional) ---
  {
    id: "leg_lai_002",
    topic: "Legislação",
    macroarea: "Segurança/IA",
    element: "Lei de Acesso à Informação",
    difficulty: "médio" as const,
    statement:
      "Um cidadão solicitou informações sobre gastos públicos de um órgão governamental, que negou o acesso classificando a informação como 'sigilosa'. Sobre os procedimentos de recurso e classificação de informações conforme a LAI, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "A negativa de acesso é definitiva e irrecorrível, não cabendo qualquer recurso por parte do cidadão.",
      },
      {
        letter: "B",
        text: "Informações classificadas como sigilosas podem sê-lo por período indeterminado, não havendo prazo máximo de sigilo.",
      },
      {
        letter: "C",
        text: "O cidadão pode interpor recurso às autoridades hierarquicamente superiores e, caso persista a negativa, recorrer à Controladoria-Geral da União (CGU) e ao Ministério Público, conforme os mecanismos de recurso previstos na LAI.",
      },
      {
        letter: "D",
        text: "Qualquer servidor público pode classificar informações como sigilosas sem necessidade de fundamentação ou aprovação de autoridade superior.",
      },
      {
        letter: "E",
        text: "A classificação de sigilo pode atingir o nível 'ultrassecreto' com prazo de até 100 anos, sem possibilidade de revisão.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "A LAI (arts. 22-27) garante amplo direito de recurso: (1) recurso à autoridade hierarquicamente superior no prazo de 10 dias; (2) recurso à CGU; (3) recurso ao Ministério Público. Sobre classificação (arts. 23-28): níveis de sigilo são restrito (5 anos), secreto (15 anos) e ultrassecreto (25 anos). A classificação deve ser fundamentada, indicando a autoridade responsável, as razões e o prazo. A desclassificação pode ocorrer a qualquer tempo pela autoridade classificadora ou por autoridade superior. Após o prazo, a informação é automaticamente desclassificada.",
  },

  // --- GDPR (adicional) ---
  {
    id: "leg_gdpr_002",
    topic: "Legislação",
    macroarea: "Segurança/IA",
    element: "GDPR",
    difficulty: "médio" as const,
    statement:
      "Uma multinacional brasileira coleta dados de clientes europeus. Sobre os direitos dos titulares garantidos pelo GDPR que vão além da LGPD, é correto afirmar que:",
    alternatives: [
      {
        letter: "A",
        text: "O GDPR e a LGPD concedem exatamente os mesmos direitos aos titulares, sem nenhuma diferença.",
      },
      {
        letter: "B",
        text: "O GDPR garante direitos como o 'direito ao esquecimento' (Art. 17), portabilidade de dados (Art. 20) e o direito de oposição ao processamento automatizado, incluindo 'profiling' (Art. 21). Embora a LGPD também preveja a maioria desses direitos, o GDPR possui regras mais detalhadas sobre seu exercício.",
      },
      {
        letter: "C",
        text: "O GDPR não garante o direito de portabilidade de dados, sendo esse um direito exclusivo da LGPD brasileira.",
      },
      {
        letter: "D",
        text: "O 'direito ao esquecimento' no GDPR é absoluto e não admite exceções.",
      },
      {
        letter: "E",
        text: "O GDPR proíbe completamente qualquer forma de processamento automatizado de dados.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "O GDPR estabelece direitos no Título III (Arts. 12-23): acesso, retificação, apagamento ('direito ao esquecimento' - Art. 17), limitação do processamento, portabilidade (Art. 20), oposição (Art. 21) e decisões automatizadas. A LGPD também preveja a maioria desses direitos (arts. 17-22), mas o GDPR é mais detalhado em procedimentos e prazos (ex: 72h para notificação de violação vs. 'prazo razoável' na LGPD). O direito ao esquecimento no GDPR não é absoluto — admite exceções como exercício de liberdade de expressão, obrigação legal e fins arquivísticos.",
  },
];
