/* =========================================================
   Pedagogia combina com voce? · Tania Vital

   A pergunta do teste mudou. Antes era "voce serve para Pedagogia",
   que media aptidao e, somando seis perguntas que abriam com uma
   dificuldade, deixava a pessoa com medo de ser professora. Agora e
   "onde dentro da Pedagogia voce se encaixa": ninguem e reprovado,
   todo resultado e um lugar, e a sala de aula aparece como uma porta
   entre seis, nao como destino unico.

   As seis perguntas apresentam cenas de trabalho reais. Nenhuma
   apresenta problema. Cada alternativa vale 1 ponto para um caminho.

   O bloco de organizacao nao pontua: informa a conversa da Tania sem
   virar veredito. O estagio aparece la como a parte mais importante
   do curso, e quem se organiza para faze-lo e o aluno.

   Todo curso citado existe no catalogo da UniBF.
   ========================================================= */

/* ---------------------------------------------------------
   1 · Os seis caminhos que o curso abre
   --------------------------------------------------------- */

const CAMINHOS = {
  SALA:    "sala de aula",
  GESTAO:  "coordenação e gestão",
  EMPRESA: "pedagogia empresarial",
  DIGITAL: "educação digital",
  APOIO:   "apoio e inclusão",
  SOCIAL:  "projetos sociais"
};

/* ---------------------------------------------------------
   2 · As perguntas que contam
   A ordem das alternativas e sempre a mesma, de proposito: a pessoa
   ve as seis possibilidades seis vezes, e so isso ja ensina que
   Pedagogia nao e so dar aula.
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
    texto: "Quatro segundas-feiras diferentes. Qual delas você gostaria de viver?",
    opcoes: [
      { t: "Recebendo as crianças na porta da sala, uma por uma", c: "SALA" },
      { t: "Reunida com a equipe da escola, ajustando o plano do bimestre", c: "GESTAO" },
      { t: "Numa empresa, treinando quem acabou de ser contratado", c: "EMPRESA" },
      { t: "Montando um curso online que centenas de pessoas vão fazer", c: "DIGITAL" },
      { t: "Sentada com uma criança que não está acompanhando a turma", c: "APOIO" },
      { t: "Num projeto do bairro, com jovens que largaram a escola", c: "SOCIAL" }
    ]
  },
  {
    id: "q2",
    texto: "O que você gostaria de ouvir de alguém, daqui a alguns anos?",
    opcoes: [
      { t: "“Você foi a primeira professora que me fez gostar de ler.”", c: "SALA" },
      { t: "“Depois que você chegou, a escola virou outra.”", c: "GESTAO" },
      { t: "“Aquele treinamento mudou o jeito que eu trabalho.”", c: "EMPRESA" },
      { t: "“Fiz seu curso lá de casa e mudou minha vida.”", c: "DIGITAL" },
      { t: "“Você percebeu no meu filho o que ninguém tinha percebido.”", c: "APOIO" },
      { t: "“Você não desistiu da gente quando todo mundo desistiu.”", c: "SOCIAL" }
    ]
  },
  {
    id: "q3",
    texto: "Você prefere trabalhar...",
    opcoes: [
      { t: "Com um grupo fixo, que você acompanha o ano inteiro", c: "SALA" },
      { t: "Com a equipe toda, cuidando do conjunto", c: "GESTAO" },
      { t: "Com turmas diferentes a cada projeto", c: "EMPRESA" },
      { t: "Com gente que você talvez nunca encontre pessoalmente", c: "DIGITAL" },
      { t: "Uma pessoa de cada vez, com atenção inteira", c: "APOIO" },
      { t: "Com quem o sistema deixou de fora", c: "SOCIAL" }
    ]
  },
  {
    id: "q4",
    texto: "Qual desses problemas você gostaria de resolver?",
    opcoes: [
      { t: "Uma criança que ainda não aprendeu a ler", c: "SALA" },
      { t: "Uma escola desorganizada, com equipe desmotivada", c: "GESTAO" },
      { t: "Uma empresa onde ninguém entende o sistema novo", c: "EMPRESA" },
      { t: "Um conteúdo difícil que precisa ficar fácil na tela", c: "DIGITAL" },
      { t: "Um aluno que aprende diferente e ninguém sabe como ajudar", c: "APOIO" },
      { t: "Um bairro onde os jovens não veem futuro em estudar", c: "SOCIAL" }
    ]
  },
  {
    id: "q5",
    texto: "Onde você se imagina trabalhando?",
    opcoes: [
      { t: "Numa sala de aula, com a minha turma", c: "SALA" },
      { t: "Na coordenação, na secretaria, na direção", c: "GESTAO" },
      { t: "No RH ou na área de treinamento de uma empresa", c: "EMPRESA" },
      { t: "Em casa ou num escritório, produzindo material e cursos", c: "DIGITAL" },
      { t: "Numa sala de apoio, atendendo individualmente", c: "APOIO" },
      { t: "Numa ONG, num projeto social, na comunidade", c: "SOCIAL" }
    ]
  },
  {
    id: "q6",
    texto: "O que mais te atrai na educação?",
    opcoes: [
      { t: "Ver alguém aprender na minha frente", c: "SALA" },
      { t: "Fazer as coisas funcionarem para todo mundo", c: "GESTAO" },
      { t: "Levar aprendizagem para onde ela não costuma chegar", c: "EMPRESA" },
      { t: "Alcançar muita gente ao mesmo tempo", c: "DIGITAL" },
      { t: "Entender por que alguém não está conseguindo", c: "APOIO" },
      { t: "Usar a educação para mudar uma realidade", c: "SOCIAL" }
    ]
  },
  {
    id: "q7",
    fecho: true,
    texto: "Depois de ver esses caminhos, o que você sente?",
    opcoes: [
      { t: "Um deles me chamou muito a atenção" },
      { t: "Gostei de mais de um, quero entender melhor" },
      { t: "Achei interessante, mas não é o que eu procuro agora", saida: true },
      { t: "Sinceramente, nenhum deles é o que eu quero", saida: true }
    ]
  }
];

/* ---------------------------------------------------------
   3 · Bloco que nao pontua
   Serve para a Tania abrir a conversa sabendo o momento da pessoa.
   O estagio entra aqui pelo que ele e, nao como obstaculo.
   --------------------------------------------------------- */

const ORGANIZACAO = [
  {
    id: "o1",
    texto: "O estágio é a parte mais importante do curso.",
    ajuda: "É onde você vive a sala de aula de verdade, antes de assumir uma. Acontece dentro de escola, em horário de aula, e é você quem se organiza para fazer.",
    opcoes: [
      { t: "Já sei como vou me organizar" },
      { t: "Vou precisar planejar com antecedência, mas dá" },
      { t: "Ainda não tinha pensado nessa parte" }
    ]
  },
  {
    id: "o2",
    texto: "Quanto tempo por semana você consegue reservar para estudar?",
    ajuda: "Sendo realista. Não precisa ser muito, precisa ser constante.",
    opcoes: [
      { t: "10 horas ou mais" },
      { t: "Umas 5 a 8 horas" },
      { t: "Menos que isso, mas sou constante" },
      { t: "Ainda preciso montar essa rotina" }
    ]
  },
  {
    id: "o3",
    texto: "Você já trabalha com educação?",
    opcoes: [
      { t: "Sim, dentro de escola" },
      { t: "Sim, mas em outra função" },
      { t: "Não, para mim seria uma mudança de área" }
    ]
  }
];

/* ---------------------------------------------------------
   4 · Os seis resultados
   Nenhum e uma reprovacao. Todos comecam por Pedagogia, e todos
   apontam um segundo curso que existe no catalogo dela.
   --------------------------------------------------------- */

const RESULTADOS = {
  SALA: {
    titulo: "Você é de sala de aula, e isso não é pouco",
    lead: "Você quer estar com a turma, ver a criança aprender na sua frente e acompanhar isso o ano inteiro. É o coração da profissão, e é de onde sai todo o resto.",
    dia: "Você recebe a turma, conduz as atividades, percebe quem está indo bem e quem precisa de mais. Planeja antes e registra depois.",
    onde: ["Educação Infantil", "Anos iniciais do Ensino Fundamental", "Rede pública ou escola particular"],
    base: "É exatamente para isso que o curso forma: alfabetização, desenvolvimento infantil, planejamento de aula e avaliação.",
    comece: "Pedagogia",
    some: [
      { curso: "Letras – Libras", por: "para atender também alunos surdos e ampliar onde você pode trabalhar" }
    ]
  },
  GESTAO: {
    titulo: "Você enxerga a escola inteira, não só uma sala",
    lead: "Seu olho vai para o conjunto: a equipe, o plano, o que está desencontrado. Coordenação e gestão são exatamente isso, e falta gente boa nesse lugar.",
    dia: "Você organiza o trabalho pedagógico, acompanha os professores, ajusta o plano do bimestre, conversa com as famílias e resolve o que trava.",
    onde: ["Coordenação pedagógica", "Supervisão escolar", "Direção", "Secretaria de Educação"],
    base: "Gestão escolar faz parte da formação em Pedagogia. É o curso que dá acesso a esses cargos.",
    comece: "Pedagogia",
    some: [
      { curso: "Processos Escolares", por: "para dominar a rotina administrativa da escola" },
      { curso: "Gestão Pública", por: "se o seu caminho for a rede municipal ou estadual" }
    ]
  },
  EMPRESA: {
    titulo: "Você é da educação que acontece fora da escola",
    lead: "Você quer levar aprendizagem para onde ela não costuma chegar. Empresa que contrata gente nova toda semana, equipe que precisa aprender um sistema, time que não conversa entre si. Isso tem nome e tem mercado: chama-se pedagogia empresarial.",
    dia: "Você desenha treinamentos, conduz as sessões e acompanha se aquilo pegou. Trabalha com adultos, em horário comercial, sem turma fixa.",
    onde: ["Departamento de RH", "Consultorias de treinamento", "Empresas médias e grandes", "Por conta própria"],
    base: "Pedagogia é o curso que ensina como o adulto aprende, como montar um programa e como avaliar se funcionou. É a base que o RH normalmente não tem.",
    comece: "Pedagogia",
    some: [
      { curso: "Gestão de Recursos Humanos", por: "para entender a empresa por dentro" },
      { curso: "Coaching e Desenvolvimento Humano", por: "para o trabalho de desenvolvimento individual" }
    ]
  },
  DIGITAL: {
    titulo: "Você quer alcançar muita gente de uma vez",
    lead: "Uma aula chega a trinta pessoas. Um curso online chega a milhares. É essa escala que te interessa, e a ideia de transformar conteúdo difícil em algo que se entende na tela.",
    dia: "Você planeja o curso, escreve os roteiros, organiza os módulos, pensa nas atividades e refaz o que não ficou claro.",
    onde: ["Plataformas de curso online", "Escolas com ensino híbrido", "Editoras e material didático", "Empresas de treinamento"],
    base: "Pedagogia ensina a sequência do aprendizado, o que vem antes e o que vem depois. É o que separa um curso que funciona de um monte de vídeo solto.",
    comece: "Pedagogia",
    some: [
      { curso: "Design Educacional", por: "que é exatamente a profissão de montar cursos" }
    ]
  },
  APOIO: {
    titulo: "Você repara em quem está ficando para trás",
    lead: "Enquanto a turma anda, você olha para quem parou. Querer entender por que uma pessoa não está conseguindo é o começo de um trabalho inteiro, e é dos mais procurados hoje.",
    dia: "Você observa como aquele aluno aprende, monta um plano individual, orienta a família e o professor, e acompanha a evolução de perto.",
    onde: ["Sala de recursos", "Apoio escolar", "Atendimento individual", "Escolas com educação inclusiva"],
    base: "Pedagogia dá a base de desenvolvimento e aprendizagem, que é o pré-requisito para se especializar nessa área depois.",
    comece: "Pedagogia",
    some: [
      { curso: "Psicopedagogia", por: "que é a formação específica para dificuldades de aprendizagem" },
      { curso: "Letras – Libras", por: "se o seu interesse for inclusão" }
    ]
  },
  SOCIAL: {
    titulo: "Você quer a educação como ferramenta de mudança",
    lead: "Você pensa em quem o sistema deixou de fora. Educação, para você, é meio e não fim, e existe um campo inteiro de trabalho com essa cara.",
    dia: "Você desenha e toca projetos educativos, trabalha com jovens e adultos, articula com a comunidade e acompanha o que mudou de verdade.",
    onde: ["ONGs e fundações", "Projetos sociais", "Programas de EJA", "Secretarias e políticas públicas"],
    base: "Pedagogia forma para educar em qualquer contexto, não só dentro da escola. É o que dá técnica e legitimidade ao trabalho social.",
    comece: "Pedagogia",
    some: [
      { curso: "Coaching e Desenvolvimento Humano", por: "para o trabalho direto com pessoas" },
      { curso: "Ciências Sociais", por: "para entender a fundo o contexto em que você vai atuar" }
    ]
  }
};


/* ---------------------------------------------------------
   6 · Quando Pedagogia nao e o caminho

   So a pergunta declarada leva aqui. A deteccao silenciosa por pontuacao
   baixa foi testada e descartada: com 2 pontos no topo existem duas
   causas opostas, quem nao se interessou por nada e quem se interessou
   por varios caminhos, e dizer "nao e o seu caminho" para a segunda
   seria pior que o defeito original. O topo baixo agora vira um aviso
   de interesse espalhado, dentro do proprio resultado.

   A saida nao pode ser um beco. Quem descarta Pedagogia com honestidade
   e exatamente o publico do teste de perfil, e continua sendo lead.
   --------------------------------------------------------- */

const SEM_CAMINHO = {
  titulo: "Então Pedagogia não é o seu caminho, e que bom que você descobriu agora",
  lead: "Descobrir isso em seis perguntas é muito melhor do que descobrir no terceiro semestre. E isso não fecha nada: só quer dizer que o seu curso é outro.",
  pontos: [
    "São 89 graduações no catálogo da UniBF: tecnólogos a partir de 1 ano e 8 meses, licenciaturas de 4 anos e bacharelados de 3 a 5 anos.",
    "Tem gente que chega aqui pensando em Pedagogia e sai para Administração, Design, Tecnologia ou Saúde.",
    "O próximo passo é descobrir com o que você combina, e para isso eu tenho um teste próprio."
  ],
  botao: "Fazer o teste de perfil profissional",
  destino: "perfil.html?origem=pedagogia",
  zap: "Ou me chama no WhatsApp que a gente conversa direto."
};

/* Abaixo disso o teste avisa que o interesse ficou espalhado, em vez de
   fingir uma certeza que a pontuacao nao sustenta. */
const LIMITE_ESPALHADO = 2;

const AVISO_ESPALHADO = "Seus pontos ficaram bem distribuídos: vários caminhos te chamaram atenção, e nenhum se destacou muito. Isso é comum e não é indecisão. Este aqui foi o que apareceu um pouco mais.";

/* ---------------------------------------------------------
   5 · Blocos fixos
   --------------------------------------------------------- */

const DINHEIRO = {
  titulo: "Um número para você se situar",
  base: "Na rede municipal de Campo Grande, um professor começando, com jornada de 20 horas semanais, ganha em média R$ 4.500. É a referência pública, a mais fácil de comparar, e são 20 horas, o que deixa espaço para uma segunda escola ou aula particular.",
  nota: "Em escola particular e em empresa não existe um valor de referência: varia muito e cada contratação tem a sua própria negociação."
};

const FECHAMENTO = {
  frase: "Este resultado não fecha nenhuma porta. Ele te mostra por onde a sua começa.",
  cta: "Quer conversar sobre esse caminho comigo?"
};
