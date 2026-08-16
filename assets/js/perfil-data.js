/* =========================================================
   Teste de Afinidade Profissional · Tania Vital
   Base: modelo RIASEC (John Holland), seis interesses.
   Os rotulos tecnicos nunca aparecem nas perguntas.

   Pontuacao: cada alternativa carrega 1 a 3 pontos em uma ou duas
   dimensoes. As dimensoes NAO aparecem o mesmo numero de vezes no
   questionario, entao o total bruto e injusto: quem responde sempre
   "a opcao organizada" teto mais alto que quem responde sempre "a
   opcao pratica". Por isso o calculo normaliza cada dimensao pelo
   maximo que ela pode alcancar, e compara percentuais.

   Todo curso citado existe no catalogo da UniBF vendido pela Tania.
   Nenhum resultado nomeia Direito, Psicologia, Enfermagem ou
   Arquitetura, que ela nao atende.
   ========================================================= */

/* ---------------------------------------------------------
   1 · As seis dimensoes, em nome humano
   --------------------------------------------------------- */

const DIMENSOES = {
  R: { nome: "mão na massa", frase: "resolver coisas concretas, no mundo físico" },
  I: { nome: "investigação", frase: "entender como as coisas funcionam" },
  A: { nome: "criação", frase: "dar forma a algo que ainda não existe" },
  S: { nome: "pessoas", frase: "ensinar, cuidar e desenvolver gente" },
  E: { nome: "iniciativa", frase: "liderar, negociar e fazer acontecer" },
  C: { nome: "organização", frase: "trazer ordem, método e confiança" }
};

/* ---------------------------------------------------------
   2 · Perguntas e matriz de pontuação
   `p` é o peso por dimensão. Nenhuma alternativa é a certa.
   --------------------------------------------------------- */

const PERGUNTAS = [
  {
    id: "em",
    filtro: true,
    texto: "Antes de tudo: você já concluiu o Ensino Médio?",
    opcoes: [
      { v: "sim", t: "Sim, já concluí" },
      { v: "concluindo", t: "Estou concluindo agora" },
      { v: "nao", t: "Ainda não" }
    ]
  },
  {
    id: "q1",
    texto: "Fim de semana livre, sem compromisso nenhum. O que te dá mais vontade?",
    opcoes: [
      { t: "Mexer com as mãos: consertar, montar, plantar, cozinhar", p: { R: 2, A: 1 } },
      { t: "Entender como alguma coisa funciona, ler, pesquisar", p: { I: 2 } },
      { t: "Criar algo: escrever, desenhar, fotografar, decorar", p: { A: 2 } },
      { t: "Estar com gente, conversar, ajudar alguém", p: { S: 2 } },
      { t: "Colocar a casa e as contas em ordem", p: { C: 2 } }
    ]
  },
  {
    id: "q2",
    texto: "Num trabalho em grupo, sem ninguém mandando, você acaba fazendo o quê?",
    opcoes: [
      { t: "Organizando e dividindo as tarefas", p: { E: 2, C: 1 } },
      { t: "Cuidando para ninguém ficar perdido", p: { S: 2 } },
      { t: "Pesquisando o que falta e trazendo a informação", p: { I: 2 } },
      { t: "Cuidando do texto, do visual, da apresentação", p: { A: 2 } },
      { t: "Botando a mão na massa na parte prática", p: { R: 2 } }
    ]
  },
  {
    id: "q3",
    texto: "Alguém te procura com um problema. Qual é a sua primeira reação?",
    opcoes: [
      { t: "Escutar até entender como a pessoa está", p: { S: 2 } },
      { t: "Separar o problema em partes para achar a causa", p: { I: 2 } },
      { t: "Pensar numa saída diferente, que ninguém tentou", p: { A: 2 } },
      { t: "Ver quem pode ajudar e juntar as pessoas", p: { E: 2, S: 1 } },
      { t: "Fazer uma lista do que precisa ser feito, em ordem", p: { C: 2 } }
    ]
  },
  {
    id: "q4",
    texto: "Qual dessas tarefas você faria sem reclamar?",
    opcoes: [
      { t: "Conferir uma planilha até achar o erro", p: { C: 2, I: 1 } },
      { t: "Montar um móvel seguindo o manual", p: { R: 2 } },
      { t: "Explicar de novo, com calma, para quem não entendeu", p: { S: 2 } },
      { t: "Convencer alguém a topar uma ideia sua", p: { E: 2 } },
      { t: "Escrever um texto do zero", p: { A: 2 } }
    ]
  },
  {
    id: "q5",
    texto: "Um dia bom de trabalho, para você, termina com o quê?",
    opcoes: [
      { t: "Alguma coisa pronta, que dá para ver e tocar", p: { R: 2 } },
      { t: "Uma resposta que você não tinha de manhã", p: { I: 2 } },
      { t: "Algo criado que não existia antes", p: { A: 2 } },
      { t: "Alguém melhor do que chegou", p: { S: 2 } },
      { t: "Tudo em ordem, nada pendente", p: { C: 2 } }
    ]
  },
  {
    id: "q6",
    texto: "Você se sentiria mais confortável num trabalho onde...",
    opcoes: [
      { t: "Cada dia é diferente e imprevisível", p: { E: 2, A: 1 } },
      { t: "Existe rotina clara e você sabe o que esperar", p: { C: 2 } },
      { t: "Você trabalha bastante sozinha, no seu ritmo", p: { I: 2 } },
      { t: "Você está o tempo todo perto de gente", p: { S: 2 } },
      { t: "Você se move, sai, não fica parada numa cadeira", p: { R: 2 } }
    ]
  },
  {
    id: "q7",
    texto: "Que tipo de elogio te deixa mais satisfeita?",
    opcoes: [
      { t: "“Você resolveu o que ninguém conseguia.”", p: { I: 2 } },
      { t: "“Você enxerga as coisas de um jeito diferente.”", p: { A: 2 } },
      { t: "“Com você a gente se sente acolhida.”", p: { S: 2 } },
      { t: "“Você faz as coisas acontecerem.”", p: { E: 2 } },
      { t: "“Pode confiar, você não deixa nada passar.”", p: { C: 2 } }
    ]
  },
  {
    id: "q8",
    texto: "Chega na sua frente uma tabela cheia de números.",
    opcoes: [
      { t: "Gosto, vou entender o que ela está dizendo", p: { C: 2 } },
      { t: "Procuro o padrão, o que está escondido ali", p: { I: 2 } },
      { t: "Vejo logo o que dá para decidir com aquilo", p: { E: 2 } },
      { t: "Prefiro que alguém me conte o resumo", p: { A: 1, S: 1 } }
    ]
  },
  {
    id: "q9",
    texto: "Se você tivesse que aprender uma coisa nova neste mês, escolheria...",
    opcoes: [
      { t: "Um programa novo, algo de computador", p: { I: 2, C: 1 } },
      { t: "Um trabalho manual, algo feito com as mãos", p: { R: 2 } },
      { t: "Uma forma de se expressar: escrever, desenhar, tocar", p: { A: 2 } },
      { t: "Falar melhor em público", p: { E: 2, S: 1 } },
      { t: "Organizar melhor a sua vida e o seu dinheiro", p: { C: 2 } }
    ]
  },
  {
    id: "q10",
    texto: "O que mais te incomodaria num trabalho?",
    opcoes: [
      { t: "Fazer sempre exatamente a mesma coisa", p: { A: 2, E: 1 } },
      { t: "Não ter regra clara, cada dia uma versão", p: { C: 2 } },
      { t: "Ficar longe das pessoas", p: { S: 2 } },
      { t: "Não entender o porquê do que estou fazendo", p: { I: 2 } },
      { t: "Ficar sentada o dia inteiro", p: { R: 2 } }
    ]
  },
  {
    id: "q11",
    peso: "projeção de cenário, a que mais discrimina",
    texto: "Imagine que você já se formou e está feliz no que faz. Onde você está?",
    opcoes: [
      { t: "Numa sala, ensinando ou orientando alguém", p: { S: 3 } },
      { t: "Num escritório, cuidando de números e processos", p: { C: 3 } },
      { t: "Na rua, em obra, em campo, com equipamento", p: { R: 3 } },
      { t: "No seu próprio negócio, decidindo os rumos", p: { E: 3 } },
      { t: "Criando alguma coisa, no seu canto", p: { A: 3 } },
      { t: "Analisando, pesquisando, testando", p: { I: 3 } }
    ]
  },
  {
    id: "q12",
    texto: "Quando precisa decidir algo importante, você...",
    opcoes: [
      { t: "Pesquiso tudo que consigo antes", p: { I: 2 } },
      { t: "Pergunto para as pessoas em quem confio", p: { S: 2 } },
      { t: "Decido rápido e ajusto no caminho", p: { E: 2 } },
      { t: "Faço uma lista de prós e contras", p: { C: 2 } },
      { t: "Vou pela intuição", p: { A: 2 } }
    ]
  },
  {
    id: "q13",
    texto: "E o que mais pesaria na hora de escolher uma profissão?",
    opcoes: [
      { t: "Poder ajudar gente de verdade", p: { S: 2 } },
      { t: "Ter estabilidade e saber o que esperar", p: { C: 2 } },
      { t: "Poder crescer e ganhar bem", p: { E: 2 } },
      { t: "Fazer algo que tenha a minha cara", p: { A: 2 } },
      { t: "Trabalhar com algo concreto e útil", p: { R: 2 } },
      { t: "Nunca parar de aprender", p: { I: 2 } }
    ]
  }
];

/* ---------------------------------------------------------
   3 · Os quinze pares, mais o perfil amplo
   Chave = as duas dimensoes mais fortes, em ordem alfabetica.
   Cursos conferidos um a um contra o catalogo da pagina.
   --------------------------------------------------------- */

const RESULTADOS = {
  AC: {
    titulo: "Você cria, mas gosta que fique bem-feito",
    lead: "Criatividade com acabamento. Você inventa e ainda entrega organizado, o que é raro e vale muito no mercado.",
    areas: ["Criatividade e Design", "Comunicação e Marketing"],
    alta: ["Design de Animação", "Design Educacional", "Comunicação Institucional"],
    boa: ["Design de Produto", "Publicidade e Propaganda", "Secretariado"]
  },
  AE: {
    titulo: "Você cria e sabe fazer a ideia chegar nas pessoas",
    lead: "Não basta criar, você quer que aquilo circule e dê resultado. É o perfil de quem vive de comunicação.",
    areas: ["Comunicação e Marketing", "Criatividade e Design"],
    alta: ["Marketing Digital", "Publicidade e Propaganda", "Mídias Sociais Digitais"],
    boa: ["Influenciador Digital", "Gestão de Eventos", "Ciências da Comunicação e Inteligência Digital"]
  },
  AI: {
    titulo: "Você inventa a partir do que descobre",
    lead: "Curiosidade e criação andam juntas em você. Gosta de entender a fundo e depois transformar aquilo em algo novo.",
    areas: ["Criatividade e Design", "Tecnologia e Dados", "Ciências Humanas"],
    alta: ["Jogos Digitais", "Ciências da Inteligência Artificial", "Filosofia"],
    boa: ["História", "Design de Produto", "Artes Visuais"]
  },
  AR: {
    titulo: "Você cria coisas que existem de verdade",
    lead: "Sua criatividade não para no papel, ela vira objeto, espaço, prato, coisa que se toca.",
    areas: ["Criatividade e Design", "Engenharia e Áreas Técnicas"],
    alta: ["Design de Produto", "Design de Interiores", "Gastronomia"],
    boa: ["Artes Visuais", "Design de Animação"]
  },
  AS: {
    titulo: "Você comunica e aproxima",
    lead: "Tem sensibilidade para as palavras e para as pessoas. Consegue explicar de um jeito que faz sentido para quem ouve.",
    areas: ["Comunicação e Marketing", "Educação e Desenvolvimento Humano"],
    alta: ["Jornalismo", "Letras – Português", "Design Educacional"],
    boa: ["Letras – Libras", "Comunicação Institucional", "Relações Públicas"]
  },
  CE: {
    titulo: "Você faz o negócio girar",
    lead: "Junta a visão de quem decide com a disciplina de quem controla. É a combinação que sustenta empresa.",
    areas: ["Gestão e Negócios"],
    alta: ["Administração", "Processos Gerenciais", "Gestão Financeira"],
    boa: ["Comércio Exterior", "Logística", "Gestão Comercial"]
  },
  CI: {
    titulo: "Você organiza o que é complexo",
    lead: "Onde os outros veem bagunça, você vê estrutura. É o perfil que a área de dados e sistemas mais procura.",
    areas: ["Tecnologia e Dados", "Gestão e Negócios"],
    alta: ["Análise e Desenvolvimento de Sistemas", "Banco de Dados", "Ciências Contábeis"],
    boa: ["Segurança da Informação", "Segurança Cibernética", "Ciências Econômicas"]
  },
  CR: {
    titulo: "Você faz funcionar, com método",
    lead: "Prática e processo. Você gosta de trabalho concreto, mas quer regra clara e nada improvisado.",
    areas: ["Engenharia e Áreas Técnicas", "Segurança, Perícia e Serviços Jurídicos"],
    alta: ["Segurança do Trabalho", "Gestão da Produção Industrial", "Logística"],
    boa: ["Gestão de Segurança Privada", "Segurança no Trânsito", "Gestão Ambiental"]
  },
  CS: {
    titulo: "Você sustenta o dia a dia das pessoas",
    lead: "Cuidar e organizar, juntos. É quem faz escola, clínica e instituição funcionarem sem ninguém perceber o esforço.",
    areas: ["Educação e Desenvolvimento Humano", "Saúde e Bem-estar"],
    alta: ["Pedagogia", "Processos Escolares", "Gestão Hospitalar"],
    boa: ["Gerontologia", "Gestão da Qualidade na Saúde", "Secretariado"]
  },
  EI: {
    titulo: "Você transforma análise em decisão",
    lead: "Estuda antes, decide depois, mas decide. Não fica na teoria nem age no escuro.",
    areas: ["Gestão e Negócios", "Tecnologia e Dados"],
    alta: ["Ciências Econômicas", "Inteligência Artificial e Negócios", "Administração"],
    boa: ["Relações Internacionais", "Ciência Política", "Gestão Pública"]
  },
  ER: {
    titulo: "Você toca a operação",
    lead: "Gosta de coisa acontecendo e de estar no meio dela. Produção, campo, obra, com você no comando.",
    areas: ["Engenharia e Áreas Técnicas", "Gestão e Negócios", "Meio Ambiente e Agro"],
    alta: ["Engenharia de Produção", "Gestão do Agronegócio", "Gestão da Produção Industrial"],
    boa: ["Logística", "Gestão de Cooperativas", "Gestão Portuária"]
  },
  ES: {
    titulo: "Você lidera cuidando",
    lead: "Puxa o grupo sem passar por cima de ninguém. É o perfil que as empresas procuram para cuidar de gente.",
    areas: ["Gestão e Negócios", "Educação e Desenvolvimento Humano"],
    alta: ["Gestão de Recursos Humanos", "Coaching e Desenvolvimento Humano", "Relações Públicas"],
    boa: ["Gestão de Cooperativas", "Gestão Desportiva e de Lazer", "Gestão de Eventos"]
  },
  IR: {
    titulo: "Você resolve com as mãos e com a cabeça",
    lead: "Quer entender o mecanismo e também colocar a mão nele. É exatamente o que técnica e engenharia pedem.",
    areas: ["Engenharia e Áreas Técnicas", "Tecnologia e Dados", "Saúde e Bem-estar"],
    alta: ["Engenharia Civil", "Redes de Computadores", "Radiologia"],
    boa: ["Engenharia Ambiental e Sanitária", "Saneamento Ambiental", "Internet das Coisas"]
  },
  IS: {
    titulo: "Você entende gente",
    lead: "Interesse pelas pessoas com vontade de compreender de verdade, não só de acolher. É o começo de toda boa prática.",
    areas: ["Educação e Desenvolvimento Humano", "Saúde e Bem-estar", "Ciências Humanas"],
    alta: ["Psicopedagogia", "Estudos Teóricos Psicanalíticos e Sociais", "Nutrição"],
    boa: ["Ciências Sociais", "Gerontologia", "Fisioterapia"]
  },
  RS: {
    titulo: "Você cuida na prática",
    lead: "Cuidar, para você, é fazer: movimento, corpo, presença. Trabalho de gabinete não te serve.",
    areas: ["Saúde e Bem-estar", "Educação e Desenvolvimento Humano"],
    alta: ["Educação Física", "Fisioterapia", "Estética e Cosmética"],
    boa: ["Nutrição", "Segurança Pública", "Gestão Desportiva e de Lazer"]
  },
  /* Perfil unico: quando um interesse domina e o segundo e ruido.
     Sem isto, alguem com 100% em "pessoas" e 9% em "iniciativa"
     receberia um resultado de par, escrito por causa dos 9%. */
  SO_R: {
    titulo: "Você é de fazer, não de falar sobre fazer",
    lead: "Seu interesse por trabalho concreto aparece com força e sozinho. Você quer resultado que dá para ver, tocar e conferir no fim do dia.",
    areas: ["Engenharia e Áreas Técnicas", "Meio Ambiente e Agro"],
    alta: ["Engenharia Civil", "Gastronomia", "Gestão da Produção Industrial"],
    boa: ["Segurança do Trabalho", "Radiologia", "Gestão do Agronegócio"]
  },
  SO_I: {
    titulo: "Você precisa entender antes de aceitar",
    lead: "Curiosidade é o seu traço mais forte, e com folga. Você não sossega enquanto não entende o mecanismo por trás das coisas.",
    areas: ["Tecnologia e Dados", "Ciências Humanas", "Saúde e Bem-estar"],
    alta: ["Ciência da Computação", "Biomedicina", "Análise e Desenvolvimento de Sistemas"],
    boa: ["Ciências Biológicas", "Física", "Investigação e Perícia Judicial"]
  },
  SO_A: {
    titulo: "Você precisa criar, e isso não desliga",
    lead: "Criação aparece muito acima do resto. Trabalho que não deixe você inventar nada vai te sufocar em poucos meses.",
    areas: ["Criatividade e Design", "Comunicação e Marketing"],
    alta: ["Artes Visuais", "Design de Animação", "Design de Produto"],
    boa: ["Jornalismo", "Design de Interiores", "Publicidade e Propaganda"]
  },
  SO_S: {
    titulo: "Gente é o seu assunto",
    lead: "Pessoas aparecem muito à frente de tudo. Não é só gostar de conviver: é querer que o outro saia melhor do que chegou.",
    areas: ["Educação e Desenvolvimento Humano", "Saúde e Bem-estar"],
    alta: ["Pedagogia", "Psicopedagogia", "Gerontologia"],
    boa: ["Educação Física", "Letras – Libras", "Coaching e Desenvolvimento Humano"]
  },
  SO_E: {
    titulo: "Você não espera, você move",
    lead: "Iniciativa domina o seu perfil. Você prefere decidir e corrigir no caminho a ficar esperando as condições ficarem perfeitas.",
    areas: ["Gestão e Negócios"],
    alta: ["Administração", "Gestão Comercial", "Marketing"],
    boa: ["Gestão de Negócios Imobiliários", "Comércio Exterior", "Gestão de Eventos"]
  },
  SO_C: {
    titulo: "Você é a pessoa em quem todo mundo confia",
    lead: "Organização aparece bem acima do resto. É o perfil de quem segura a estrutura e faz o combinado acontecer sem drama.",
    areas: ["Gestão e Negócios", "Tecnologia e Dados"],
    alta: ["Ciências Contábeis", "Gestão Financeira", "Logística"],
    boa: ["Secretariado", "Banco de Dados", "Gestão Pública"]
  },

  AMPLO: {
    titulo: "Seus interesses são largos, e isso não é indecisão",
    lead: "Você pontuou parecido em várias frentes. Significa que gosto não vai ser o seu critério de desempate: rotina, tempo de curso e mercado vão pesar mais.",
    areas: ["Depende do que você priorizar agora"],
    alta: ["Administração", "Pedagogia", "Análise e Desenvolvimento de Sistemas"],
    boa: ["Gestão de Recursos Humanos", "Marketing", "Processos Gerenciais"],
    conversar: true
  }
};

/* ---------------------------------------------------------
   4 · Blocos fixos do resultado
   --------------------------------------------------------- */

const REALIZACAO = {
  R: "vê a coisa pronta na sua frente, feita por você",
  I: "entende algo que estava confuso de manhã",
  A: "cria alguma coisa que não existia antes",
  S: "percebe que ajudou alguém a evoluir",
  E: "faz uma ideia sair do papel e virar movimento",
  C: "olha para tudo em ordem e sabe que nada vai falhar"
};

const AMBIENTES = {
  R: "oficina, obra, campo, cozinha, laboratório",
  I: "laboratório, área técnica, setor de análise",
  A: "estúdio, agência, redação, ateliê",
  S: "escola, clínica, projeto social, atendimento",
  E: "comércio, negócio próprio, área comercial",
  C: "escritório, setor administrativo, financeiro"
};

const RODAPE = {
  atencao: [
    "Como é a rotina real da profissão, não só a ideia dela",
    "Quanto se ganha na sua cidade, no começo",
    "Quanto tempo dura a formação e se cabe na sua vida",
    "Se tem estágio obrigatório e como você encaixaria",
    "Se o mercado da sua região contrata nessa área"
  ],
  frase: "Seu resultado não define o seu futuro. Ele mostra caminhos que merecem ser explorados.",
  cta: "Quer que eu te ajude a escolher?"
};
