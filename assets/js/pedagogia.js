/* =========================================================
   Teste de Pedagogia · Tania Vital
   O teste devolve um resultado de verdade para quem responde.
   Nenhuma resposta reprova a pessoa, e todo caminho leva a algum lugar.
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1 · Constantes
     --------------------------------------------------------- */

  var TELEFONE = "5567999021267";
  var PERGUNTAS = ["em", "q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"];

  var ROTULOS = {
    em: "Ensino Médio",
    q1: "A sala de aula",
    q2: "A parte de bastidor",
    q3: "Ritmo do resultado",
    q4: "Estágio obrigatório",
    q5: "Tempo por semana",
    q6: "Como funciona melhor",
    q7: "Sobre dinheiro",
    q8: "Daqui a cinco anos"
  };

  /* ---------------------------------------------------------
     2 · Pontuação
     Vocação mede o encaixe com o trabalho. Máximo 11.
     Viabilidade mede a chance de concluir o curso. Máximo 9.
     --------------------------------------------------------- */

  var VOCACAO = {
    q1: { momento: 3, dificeis: 3, encarar: 2, conhecer: 2, "nao-vejo": 0 },
    q2: { organizar: 2, "numa-boa": 2, ensinar: 2, pesaria: 1 },
    q3: { move: 3, paciencia: 3, ansiosa: 2, rapido: 1 },
    q8: { turma: 3, gestao: 3, pessoas: 2, descobrindo: 1 }
  };

  var VIABILIDADE = {
    q4: { "ja-sei": 3, planejar: 2, opcoes: 1, dificil: 0 },
    q5: { dez: 3, cinco: 3, constante: 2, montar: 1 },
    q6: { sozinha: 3, prazo: 3, acompanha: 2, recomeco: 2 }
  };

  /* ---------------------------------------------------------
     3 · O que dizer de volta
     Cada frase fala da situação da pessoa, nunca de um defeito dela.
     --------------------------------------------------------- */

  var FORCAS = {
    q1: {
      momento: "Você quer entrar justamente pelo momento em que a criança entende. É o motivo mais forte que existe.",
      dificeis: "Você já sabe que vão existir dias difíceis e mesmo assim quer. Isso é maturidade, não ingenuidade.",
      encarar: "Você reconheceu o que te preocupa e mesmo assim quer encarar. Isso tem nome, e o nome é coragem.",
      conhecer: "Você prefere entender antes de decidir. É exatamente assim que se escolhe uma profissão."
    },
    q2: {
      organizar: "Você gosta de organizar, e boa parte do trabalho de um pedagogo é isso.",
      "numa-boa": "Você encara a parte burocrática numa boa, e isso resolve metade dos perrengues da profissão.",
      ensinar: "Você prefere mil vezes ensinar a preencher papel. Bem-vinda ao clube, é assim com quase todo bom professor."
    },
    q3: {
      move: "Conquista lenta é o que te move. Educação é feita exatamente disso.",
      paciencia: "Você tem paciência, e ela é a matéria-prima da profissão.",
      ansiosa: "Você se conhece bem: ansiosa, mas capaz de esperar quando vale a pena."
    },
    q4: {
      "ja-sei": "Você já sabe como vai resolver o estágio, e isso elimina o maior motivo de desistência do curso.",
      planejar: "Você sabe que dá pra ajeitar o estágio planejando antes. É assim que a maioria faz."
    },
    q5: {
      dez: "Você tem tempo de sobra para acompanhar o ritmo com folga.",
      cinco: "De 5 a 8 horas por semana é exatamente a média de quem se forma.",
      constante: "Você tem pouco tempo, mas é constante. Constância ganha de volume, sempre."
    },
    q6: {
      sozinha: "Você se organiza sozinha, que é o que o estudo a distância mais exige.",
      prazo: "Você funciona bem com prazo e meta clara, e o curso te dá os dois.",
      acompanha: "Você rende mais com alguém acompanhando de perto. No curso a tutoria da UniBF responde suas dúvidas pelo portal do aluno, e quando alguma coisa não anda você me chama que eu destravo.",
      recomeco: "Você já parou coisas quando a vida apertou e quer fazer diferente agora. Quem chega falando isso costuma terminar, porque entrou sabendo."
    },
    q7: {
      cabe: "Você já pesquisou o retorno e ele cabe no seu plano. Decisão feita com o pé no chão.",
      diploma: "O seu foco agora é o diploma. Justo, porque é ele que abre todo o resto."
    },
    q8: {
      turma: "Você já consegue se ver com a sua turma daqui a cinco anos.",
      gestao: "Você se vê na educação além da sala, e Pedagogia é justamente o curso que abre coordenação e gestão.",
      pessoas: "Você quer trabalhar com gente e com aprendizagem, e esse é o coração da Pedagogia."
    }
  };

  var PONTOS = {
    q2: {
      pesaria: "A parte de registro e planejamento pesaria pra você. Não impede nada, mas é bom entrar sabendo que ela aparece todo dia."
    },
    q3: {
      rapido: "Você gosta de ver resultado rápido, e educação não entrega isso. Vale conversarmos sobre onde o retorno apareceria mais cedo pra você."
    },
    q4: {
      opcoes: "O estágio ainda está em aberto. Quem orienta cada passo dele é a tutoria da UniBF, pelo portal do aluno. Me chama antes que eu te explico como funciona, pra você decidir sabendo.",
      dificil: "O estágio seria apertado na sua rotina de hoje. Não é impeditivo, mas é a parte que você precisa entender antes de decidir. Me chama que eu te explico como ele funciona."
    },
    q5: {
      montar: "Você ainda vai montar a sua rotina de estudo. Vale começar por aí, porque é o que mais decide quem termina o curso e quem para no meio."
    }
  };

  var DESENCAIXE = {
    q1: {
      "nao-vejo": "Você mesma disse que não se vê numa sala com crianças, e Pedagogia leva pra lá, inclusive no estágio obrigatório."
    }
  };

  // Para quem ainda está conhecendo. Aqui nada é obstáculo, é só o que falta descobrir.
  var EXPLORAR = {
    q1: {
      conhecer: "Você nunca viu uma sala de aula por dentro, e é difícil escolher no escuro. Isso se resolve rápido, eu te conto como é o dia a dia de verdade."
    },
    q8: {
      descobrindo: "Você ainda não sabe onde quer estar daqui a cinco anos, e tudo bem. A gente pode olhar dois ou três caminhos juntas antes de você decidir qualquer coisa."
    }
  };

  var ELOGIO_HONESTIDADE = "Você respondeu com honestidade em vez de marcar o que soaria bonito. Isso já diz muito sobre você.";

  // Só cabem quatro forças na tela, então as que mais tranquilizam vêm primeiro.
  // A q6 fala do apoio que ela vai ter, e é justamente a que não pode ficar de fora.
  var ORDEM_FORCAS = ["q1", "q6", "q8", "q3", "q4", "q5", "q2", "q7"];

  var VEREDITOS = {
    sim: {
      titulo: "Pedagogia é o seu caminho.",
      lead: "Eu não digo isso por educação. Digo porque as suas respostas se encaixam de um jeito que eu reconheço bem: é o mesmo perfil de gente que eu vi entrar insegura e sair com o diploma na mão.",
      tituloForcas: "O que joga a seu favor",
      tituloPontos: "O que vale conversar antes de começar",
      tituloFala: "Quer conversar sobre isso comigo?",
      grana: true
    },
    junto: {
      titulo: "Pedagogia combina com você, e tem um ponto pra gente conversar antes.",
      lead: "O que mais importa já está no lugar. Ficou uma coisa em aberto, e é bem melhor você olhar pra ela agora do que no meio do curso. Me chama que a gente conversa sobre isso antes de você decidir.",
      tituloForcas: "O que já está no lugar",
      tituloPontos: "O que vale conversar antes de começar",
      tituloFala: "Vamos conversar sobre esse ponto?",
      grana: true
    },
    gestao: {
      titulo: "Pedagogia serve pro que você quer, com um aviso sincero.",
      lead: "Você não se vê dando aula, mas se vê na educação coordenando. Pedagogia é sim o curso que abre esse caminho. O aviso é que a formação passa pela sala de aula, inclusive no estágio obrigatório. Sabendo disso, faz sentido pra você.",
      tituloForcas: "O que joga a seu favor",
      tituloPontos: "O que você precisa saber antes",
      tituloFala: "Quer conversar sobre isso comigo?",
      grana: true
    },
    explorando: {
      titulo: "Você ainda está conhecendo, e esse é o melhor momento pra conversar.",
      lead: "Você respondeu com honestidade que ainda está descobrindo, e eu prefiro mil vezes isso do que uma certeza inventada. Com o que eu tenho aqui não dá pra cravar um sim nem um não, e seria desonesto tentar. Mas dá pra descobrir junto, e é mais rápido do que você imagina.",
      tituloForcas: "O que eu já consigo ver em você",
      tituloPontos: "O que ainda falta você saber",
      tituloFala: "Vamos descobrir juntas?",
      grana: true
    },
    outro: {
      titulo: "Tem um caminho melhor pra você, e eu vou te mostrar.",
      lead: "Isso não é um não. É que eu prefiro te indicar o certo do que te vender o disponível. Pelo que você respondeu, existe curso que combina mais com você do que Pedagogia, e eu quero te mostrar quais.",
      tituloForcas: "O que eu percebi de você",
      tituloPontos: "Por que eu acho que não é Pedagogia",
      tituloFala: "Quer ver o que combina mais com você?",
      grana: false
    }
  };

  var MENSAGENS = {
    sim: "Fiz o teste de Pedagogia na sua página e o resultado foi que Pedagogia é o meu caminho. Quero conversar sobre isso.",
    junto: "Fiz o teste de Pedagogia na sua página. O resultado foi que combina comigo, mas tem um ponto pra conversar antes. Queria falar sobre isso com você.",
    gestao: "Fiz o teste de Pedagogia na sua página. O resultado foi que Pedagogia serve pro que eu quero, com um aviso. Quero entender melhor.",
    explorando: "Fiz o teste de Pedagogia na sua página. Ainda estou conhecendo o curso e o resultado disse pra eu conversar com você antes de decidir.",
    outro: "Fiz o teste de Pedagogia na sua página e o resultado foi que talvez Pedagogia não seja o melhor pra mim. Quero ver o que combina mais."
  };

  /* ---------------------------------------------------------
     4 · Elementos
     --------------------------------------------------------- */

  var form = document.getElementById("formTeste");
  if (!form) return;

  var passos = Array.prototype.slice.call(form.querySelectorAll(".step"));
  var atual = 0;

  var btnSeguir = document.getElementById("btnSeguir");
  var btnVoltar = document.getElementById("btnVoltar");
  var btnVer = document.getElementById("btnVer");
  var rotuloPasso = document.getElementById("stepLabel");
  var barra = document.getElementById("barFill");
  var erro = document.getElementById("erro");

  var painelResultado = document.getElementById("resultado");
  var painelBloqueio = document.getElementById("bloqueio");
  var campoNome = document.getElementById("campoNome");
  var campoCidade = document.getElementById("campoCidade");
  var botaoWhats = document.getElementById("btnWhats");

  var vereditoAtual = "sim";

  /* ---------------------------------------------------------
     5 · Utilidades
     --------------------------------------------------------- */

  function marcada(nome) {
    return form.querySelector('[name="' + nome + '"]:checked');
  }

  function valor(nome) {
    var campo = marcada(nome);
    return campo ? campo.value : "";
  }

  function textoDaEscolha(nome) {
    var campo = marcada(nome);
    if (!campo) return "";
    var rotulo = campo.parentNode.querySelector("span");
    return rotulo ? rotulo.textContent.trim() : campo.value;
  }

  function respostas() {
    var mapa = {};
    PERGUNTAS.forEach(function (nome) { mapa[nome] = valor(nome); });
    return mapa;
  }

  function somar(tabela, mapa) {
    return Object.keys(tabela).reduce(function (total, nome) {
      var faixa = tabela[nome];
      var escolha = mapa[nome];
      return total + (Object.prototype.hasOwnProperty.call(faixa, escolha) ? faixa[escolha] : 0);
    }, 0);
  }

  function colher(banco, mapa, ordem) {
    var chaves = ordem || Object.keys(banco);
    var achados = [];
    chaves.forEach(function (nome) {
      var faixa = banco[nome];
      var frase = faixa && faixa[mapa[nome]];
      if (frase) achados.push(frase);
    });
    return achados;
  }

  function preencherLista(alvo, frases) {
    alvo.textContent = "";
    frases.forEach(function (frase) {
      var item = document.createElement("li");
      item.textContent = frase;
      alvo.appendChild(item);
    });
  }

  /* ---------------------------------------------------------
     6 · Navegação
     --------------------------------------------------------- */

  function pintar() {
    passos.forEach(function (passo, indice) {
      passo.classList.toggle("is-active", indice === atual);
    });
    rotuloPasso.textContent = "Pergunta " + (atual + 1) + " de " + passos.length;
    barra.style.width = (((atual + 1) / passos.length) * 100) + "%";
    btnVoltar.hidden = atual === 0;
    btnSeguir.hidden = atual === passos.length - 1;
    btnVer.hidden = atual !== passos.length - 1;
    erro.textContent = "";
  }

  function validar() {
    var nome = PERGUNTAS[atual];
    if (marcada(nome)) return true;
    erro.textContent = "Escolha a opção que mais parece com você para continuar.";
    return false;
  }

  function irPara(indice) {
    atual = indice;
    pintar();
    var topo = form.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: topo, behavior: "smooth" });
  }

  btnSeguir.addEventListener("click", function () {
    if (!validar()) return;

    // Sem Ensino Médio concluído o teste para aqui, com um caminho no lugar de uma porta fechada.
    if (atual === 0 && valor("em") === "nao") {
      mostrarBloqueio();
      return;
    }

    irPara(atual + 1);
  });

  btnVoltar.addEventListener("click", function () {
    if (atual > 0) irPara(atual - 1);
  });

  // Avanço por toque: escolher uma opção já leva para a próxima pergunta.
  form.addEventListener("change", function (evento) {
    if (evento.target.type !== "radio") return;
    erro.textContent = "";
    if (atual === passos.length - 1) return;

    window.setTimeout(function () {
      if (!marcada(PERGUNTAS[atual])) return;
      if (atual === 0 && valor("em") === "nao") { mostrarBloqueio(); return; }
      irPara(atual + 1);
    }, 260);
  });

  /* ---------------------------------------------------------
     7 · Veredito
     --------------------------------------------------------- */

  function decidir(mapa) {
    var vocacao = somar(VOCACAO, mapa);
    var viabilidade = somar(VIABILIDADE, mapa);
    var naSala = mapa.q1 !== "nao-vejo";
    var conhecendo = mapa.q1 === "conhecer" || mapa.q8 === "descobrindo";

    // O único desencaixe real é não se ver na sala de aula.
    // Quem se vê lá nunca recebe um não, recebe um caminho.
    if (!naSala) return mapa.q8 === "gestao" ? "gestao" : "outro";
    if (conhecendo && vocacao <= 7) return "explorando";
    if (viabilidade <= 5 || colher(PONTOS, mapa).length > 0) return "junto";
    return "sim";
  }

  /* ---------------------------------------------------------
     8 · Mensagem do WhatsApp
     --------------------------------------------------------- */

  function montarMensagem() {
    var linhas = ["Olá Tania! " + MENSAGENS[vereditoAtual], ""];

    var nome = campoNome.value.trim();
    var cidade = campoCidade.value.trim();
    if (nome) linhas.push("Meu nome: " + nome);
    if (cidade) linhas.push("Minha cidade: " + cidade);
    if (nome || cidade) linhas.push("");

    linhas.push("Minhas respostas:");
    PERGUNTAS.forEach(function (chave) {
      var escolha = textoDaEscolha(chave);
      if (escolha) linhas.push("• " + ROTULOS[chave] + ": " + escolha);
    });

    return linhas.join("\n");
  }

  function atualizarWhats() {
    botaoWhats.href = "https://wa.me/" + TELEFONE + "?text=" + encodeURIComponent(montarMensagem());
  }

  campoNome.addEventListener("input", atualizarWhats);
  campoCidade.addEventListener("input", atualizarWhats);

  /* ---------------------------------------------------------
     9 · Mostrar o resultado
     --------------------------------------------------------- */

  function revelar(painel) {
    form.hidden = true;
    painel.hidden = false;
    painel.focus({ preventScroll: true });
    var topo = painel.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: topo, behavior: "smooth" });
  }

  function mostrarBloqueio() {
    painelResultado.hidden = true;
    revelar(painelBloqueio);
  }

  function mostrarResultado() {
    var mapa = respostas();
    vereditoAtual = decidir(mapa);

    var texto = VEREDITOS[vereditoAtual];
    var forcas = colher(FORCAS, mapa, ORDEM_FORCAS);
    var pontos = colher(PONTOS, mapa);

    if (vereditoAtual === "explorando") {
      // Quem está conhecendo não recebe obstáculo, recebe o que ainda falta descobrir.
      pontos = colher(EXPLORAR, mapa);
    } else if (vereditoAtual === "outro" || vereditoAtual === "gestao") {
      pontos = colher(DESENCAIXE, mapa).concat(pontos);
    }

    // Ninguém sai daqui lendo uma lista de defeitos: no máximo três pontos.
    pontos = pontos.slice(0, 3);

    if (forcas.length < 2) forcas.unshift(ELOGIO_HONESTIDADE);
    forcas = forcas.slice(0, 4);

    document.getElementById("resTitulo").textContent = texto.titulo;
    document.getElementById("resLead").textContent = texto.lead;
    document.getElementById("resForcas").querySelector("h3").textContent = texto.tituloForcas;
    document.getElementById("tituloPontos").textContent = texto.tituloPontos;
    document.getElementById("tituloFala").textContent = texto.tituloFala;

    preencherLista(document.getElementById("listaForcas"), forcas);
    preencherLista(document.getElementById("listaPontos"), pontos);

    document.getElementById("resForcas").hidden = forcas.length === 0;
    document.getElementById("resPontos").hidden = pontos.length === 0;
    painelResultado.querySelector(".res__grana").hidden = !texto.grana;

    atualizarWhats();
    painelBloqueio.hidden = true;
    revelar(painelResultado);
  }

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    if (!validar()) return;
    mostrarResultado();
  });

  /* ---------------------------------------------------------
     10 · Refazer
     --------------------------------------------------------- */

  function refazer() {
    form.reset();
    painelResultado.hidden = true;
    painelBloqueio.hidden = true;
    form.hidden = false;
    irPara(0);
  }

  document.getElementById("btnRefazer").addEventListener("click", refazer);
  document.getElementById("btnRefazer2").addEventListener("click", refazer);

  /* ---------------------------------------------------------
     11 · Abertura no topo
     O navegador devolve a pessoa onde ela parou na visita anterior,
     e a pagina abria no meio. Com ancora na URL o salto continua.
     --------------------------------------------------------- */

  (function () {
    var mexeu = false;
    function marcar() { mexeu = true; }

    function aoTopo() {
      if (location.hash || mexeu) return;
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      } catch (e) {
        window.scrollTo(0, 0);
      }
    }

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    var opcoes = { passive: true, once: true };
    window.addEventListener("wheel", marcar, opcoes);
    window.addEventListener("touchstart", marcar, opcoes);
    window.addEventListener("keydown", marcar, { once: true });
    aoTopo();
    window.addEventListener("load", aoTopo);
  })();

  /* ---------------------------------------------------------
     12 · Arranque
     --------------------------------------------------------- */

  pintar();
})();
