/* Catálogo real de cursos UniBF, fornecido pela cliente. */
const COURSE_CATEGORIES = [
  {
    id: "bacharelado-3",
    label: "Bacharelado",
    duration: "3 anos",
    tag: "BAC · 3A",
    courses: [
      "Administração",
      "Ciência da Computação",
      "Ciência Política",
      "Ciências Contábeis",
      "Ciências Econômicas",
      "Ciências da Comunicação e Inteligência Digital",
      "Ciências da Inteligência Artificial",
      "Estudos Teóricos Psicanalíticos e Sociais",
      "Gerontologia",
      "Jornalismo",
      "Psicopedagogia",
      "Publicidade e Propaganda",
      "Relações Internacionais",
      "Relações Públicas",
      "Teologia"
    ]
  },
  {
    id: "bacharelado-4",
    label: "Bacharelado",
    duration: "4 anos",
    tag: "BAC · 4A",
    courses: [
      "Biomedicina",
      "Educação Física",
      "Farmácia",
      "Fisioterapia",
      "Nutrição",
      "Engenharia de Software"
    ]
  },
  {
    id: "bacharelado-5",
    label: "Bacharelado",
    duration: "5 anos",
    tag: "BAC · 5A",
    courses: [
      "Engenharia Ambiental e Sanitária",
      "Engenharia Civil",
      "Engenharia de Produção"
    ]
  },
  {
    id: "licenciatura-4",
    label: "Licenciatura",
    duration: "4 anos",
    tag: "LIC · 4A",
    courses: [
      "Artes Visuais",
      "Ciências Biológicas",
      "Ciências da Religião",
      "Ciências Sociais",
      "Computação e Informática",
      "Educação Física",
      "Filosofia",
      "Física",
      "Geografia",
      "História",
      "Letras – Português",
      "Letras – Inglês",
      "Letras – Libras",
      "Matemática",
      "Química",
      "Pedagogia"
    ]
  },
  {
    id: "tecnologo-1-8",
    label: "Tecnólogo",
    duration: "1 ano e 8 meses",
    tag: "TEC · 1A8M",
    courses: [
      "Análise e Desenvolvimento de Sistemas",
      "Banco de Dados",
      "Comércio Exterior",
      "Comunicação Institucional",
      "Coaching e Desenvolvimento Humano",
      "Design de Animação",
      "Design de Interiores",
      "Design de Produto",
      "Gastronomia",
      "Gestão Comercial",
      "Gestão da Qualidade na Saúde",
      "Gestão da Tecnologia da Informação",
      "Gestão de Cooperativas",
      "Gestão de Eventos",
      "Gestão de Negócios Imobiliários",
      "Gestão de Recursos Humanos",
      "Gestão de Segurança Privada",
      "Gestão de Serviços Jurídicos e Notariais",
      "Gestão Desportiva e de Lazer",
      "Gestão Financeira",
      "Gestão Portuária",
      "Gestão Pública",
      "Internet das Coisas",
      "Inteligência Artificial e Negócios",
      "Influenciador Digital",
      "Investigação e Perícia Judicial",
      "Jogos Digitais",
      "Logística",
      "Marketing",
      "Marketing Digital",
      "Mídias Sociais Digitais",
      "Processos Gerenciais",
      "Redes de Computadores",
      "Secretariado",
      "Segurança Cibernética",
      "Segurança da Informação",
      "Segurança do Trabalho",
      "Segurança no Trânsito",
      "Segurança Pública",
      "Serviços Penais",
      "Sistemas para Internet"
    ]
  },
  {
    id: "tecnologo-2-8",
    label: "Tecnólogo",
    duration: "2 anos e 8 meses",
    tag: "TEC · 2A8M",
    courses: [
      "Gestão Ambiental",
      "Gestão Hospitalar",
      "Radiologia",
      "Saneamento Ambiental",
      "Gestão da Produção Industrial",
      "Gestão do Agronegócio",
      "Design Educacional",
      "Estética e Cosmética",
      "Processos Escolares"
    ]
  },
  {
    id: "segunda-graduacao",
    label: "Segunda Graduação",
    duration: "a partir de 1 ano",
    tag: "2ª GRAD",
    note: "Para quem já tem diploma: aproveitamento de disciplinas já cursadas em praticamente todo o catálogo abaixo, com conclusão a partir de 1 ano.",
    courses: null /* preenchido em runtime: reúne o catálogo completo */
  }
];

// A Segunda Graduação da UniBF dá acesso acelerado a praticamente todo o catálogo de Bacharelado/Licenciatura/Tecnólogo (confirmado em unibf.com.br/segunda-graduacao).
COURSE_CATEGORIES.find(c => c.id === "segunda-graduacao").courses = Array.from(
  new Set(
    COURSE_CATEGORIES.filter(c => c.id !== "segunda-graduacao").flatMap(c => c.courses)
  )
);
