/* =========================================================
   Teste de Afinidade Profissional · Tania Vital
   As perguntas, a matriz e os resultados vivem em perfil-data.js.
   Aqui fica só a mecânica: montar, navegar, pontuar e mostrar.
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1 · Constantes e elementos
     --------------------------------------------------------- */

  var TELEFONE = "5567999021267";
  var DIMS = ["R", "I", "A", "S", "E", "C"];
  var LARGURA_DO_EMPATE = 12;   // 1o e 3o colados: perfil amplo
  var DOMINIO_CLARO = 30;       // 1o muito à frente do 2o: perfil único

  var form = document.getElementById("formPerfil");
  if (!form || typeof PERGUNTAS === "undefined") return;

  var caixaPassos = document.getElementById("passos");
  var btnSeguir = document.getElementById("btnSeguir");
  var btnVoltar = document.getElementById("btnVoltar");
  var btnVer = document.getElementById("btnVer");
  var rotuloPasso = document.getElementById("stepLabel");
  var barra = document.getElementById("barFill");
  var erro = document.getElementById("erro");

  var painelResultado = document.getElementById("resultado");
  var painelBloqueio = document.getElementById("bloqueio");

  var atual = 0;
  var vereditoAtual = null;

  /* ---------------------------------------------------------
     2 · Teto de cada dimensão
     As seis não aparecem o mesmo número de vezes no questionário.
     Sem normalizar, "organização" valeria 37% mais que "mão na
     massa" só por estar em mais perguntas.
     --------------------------------------------------------- */

  var TETO = (function () {
    var teto = {};
    DIMS.forEach(function (d) { teto[d] = 0; });
    PERGUNTAS.forEach(function (q) {
      if (q.filtro) return;
      DIMS.forEach(function (d) {
        var maior = 0;
        q.opcoes.forEach(function (o) {
          if (o.p && o.p[d] > maior) maior = o.p[d];
        });
        teto[d] += maior;
      });
    });
    return teto;
  })();

  /* ---------------------------------------------------------
     3 · Montagem das perguntas
     --------------------------------------------------------- */

  function montar() {
    PERGUNTAS.forEach(function (q, i) {
      var campo = document.createElement("fieldset");
      campo.className = "step";
      campo.dataset.id = q.id;

      var titulo = document.createElement("legend");
      titulo.textContent = q.texto;
      campo.appendChild(titulo);

      var caixa = document.createElement("div");
      caixa.className = "opts";

      q.opcoes.forEach(function (o, j) {
        var rotulo = document.createElement("label");
        var entrada = document.createElement("input");
        entrada.type = "radio";
        entrada.name = q.id;
        entrada.value = String(j);
        var texto = document.createElement("span");
        texto.textContent = o.t;
        rotulo.appendChild(entrada);
        rotulo.appendChild(texto);
        caixa.appendChild(rotulo);
      });

      campo.appendChild(caixa);
      if (i === 0) campo.classList.add("is-active");
      caixaPassos.appendChild(campo);
    });
    form.hidden = false;
  }

  var passos = [];

  /* ---------------------------------------------------------
     4 · Navegação
     --------------------------------------------------------- */

  function marcada(nome) {
    return form.querySelector('[name="' + nome + '"]:checked');
  }

  function valor(nome) {
    var c = marcada(nome);
    return c ? c.value : null;
  }

  function pintar() {
    passos.forEach(function (p, i) { p.classList.toggle("is-active", i === atual); });
    rotuloPasso.textContent = "Pergunta " + (atual + 1) + " de " + passos.length;
    barra.style.width = (((atual + 1) / passos.length) * 100) + "%";
    btnVoltar.hidden = atual === 0;
    btnSeguir.hidden = atual === passos.length - 1;
    btnVer.hidden = atual !== passos.length - 1;
    erro.textContent = "";
  }

  function validar() {
    if (marcada(PERGUNTAS[atual].id)) return true;
    erro.textContent = "Escolha a opção que mais parece com você para continuar.";
    return false;
  }

  function irPara(i) {
    atual = i;
    pintar();
    var topo = form.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: topo, behavior: "smooth" });
  }

  function semEnsinoMedio() {
    return PERGUNTAS[0].filtro && valor(PERGUNTAS[0].id) === "2";
  }

  btnSeguir.addEventListener("click", function () {
    if (!validar()) return;
    if (atual === 0 && semEnsinoMedio()) { mostrarBloqueio(); return; }
    irPara(atual + 1);
  });

  btnVoltar.addEventListener("click", function () {
    if (atual > 0) irPara(atual - 1);
  });

  // escolher já leva para a próxima, que é o que faz o teste ser rápido no polegar
  form.addEventListener("change", function (ev) {
    if (ev.target.type !== "radio") return;
    erro.textContent = "";
    if (atual === passos.length - 1) return;
    window.setTimeout(function () {
      if (!marcada(PERGUNTAS[atual].id)) return;
      if (atual === 0 && semEnsinoMedio()) { mostrarBloqueio(); return; }
      irPara(atual + 1);
    }, 240);
  });

  /* ---------------------------------------------------------
     5 · Pontuação
     --------------------------------------------------------- */

  function pontuar() {
    var bruto = {};
    DIMS.forEach(function (d) { bruto[d] = 0; });

    PERGUNTAS.forEach(function (q) {
      if (q.filtro) return;
      var i = valor(q.id);
      if (i === null) return;
      var pesos = q.opcoes[+i].p || {};
      Object.keys(pesos).forEach(function (d) { bruto[d] += pesos[d]; });
    });

    var pct = {};
    DIMS.forEach(function (d) {
      pct[d] = TETO[d] ? Math.round((bruto[d] / TETO[d]) * 100) : 0;
    });
    return pct;
  }

  function decidir(pct) {
    var ordem = DIMS.slice().sort(function (a, b) { return pct[b] - pct[a]; });

    // interesses espalhados: não force um pico que não existe
    if (pct[ordem[0]] - pct[ordem[2]] < LARGURA_DO_EMPATE) {
      return { chave: "AMPLO", ordem: ordem };
    }

    // um interesse muito à frente: o segundo vira ruído e não deve
    // dar nome ao resultado, então respondemos pelo primeiro sozinho
    if (pct[ordem[0]] - pct[ordem[1]] > DOMINIO_CLARO) {
      return { chave: "SO_" + ordem[0], ordem: ordem };
    }

    var chave = [ordem[0], ordem[1]].sort().join("");
    return { chave: RESULTADOS[chave] ? chave : "AMPLO", ordem: ordem };
  }

  /* ---------------------------------------------------------
     6 · Desenho do resultado
     --------------------------------------------------------- */

  function encherLista(alvo, itens) {
    alvo.textContent = "";
    itens.forEach(function (t) {
      var li = document.createElement("li");
      li.textContent = t;
      alvo.appendChild(li);
    });
  }

  function encherEtiquetas(alvo, itens) {
    alvo.textContent = "";
    itens.forEach(function (t) {
      var s = document.createElement("span");
      s.textContent = t;
      alvo.appendChild(s);
    });
  }

  function desenharBarras(pct, ordem) {
    var alvo = document.getElementById("listaForcas");
    alvo.textContent = "";
    ordem.forEach(function (d, i) {
      var li = document.createElement("li");
      if (i > 1) li.className = "fraca";

      var nome = document.createElement("b");
      nome.textContent = DIMENSOES[d].nome;
      var num = document.createElement("i");
      num.textContent = pct[d] + "%";

      var trilho = document.createElement("div");
      trilho.className = "trilho";
      var preenche = document.createElement("span");
      trilho.appendChild(preenche);

      li.appendChild(nome);
      li.appendChild(num);
      li.appendChild(trilho);
      alvo.appendChild(li);

      // largura aplicada depois do desenho para a barra animar
      window.setTimeout(function () { preenche.style.width = pct[d] + "%"; }, 60 + i * 70);
    });
  }

  /* ---------------------------------------------------------
     7 · Mensagem do WhatsApp
     --------------------------------------------------------- */

  function origem() {
    var cru = new URLSearchParams(location.search).get("origem");
    if (!cru) return "Fiz o teste de perfil na sua página";
    var limpo = cru.replace(/[^a-zA-Z0-9\- ]/g, "").slice(0, 40).toLowerCase();
    if (!limpo) return "Fiz o teste de perfil na sua página";
    return "Vim do " + limpo.replace(/-/g, " ") + " e fiz o teste de perfil";
  }

  function montarMensagem(res, pct, ordem) {
    var linhas = [
      "Olá Tania! " + origem() + ".",
      "",
      "Meu resultado: " + res.titulo,
      "",
      "Onde meus interesses se concentram:"
    ];
    ordem.slice(0, 3).forEach(function (d) {
      linhas.push("• " + DIMENSOES[d].nome + ": " + pct[d] + "%");
    });
    linhas.push("");
    linhas.push("Cursos que apareceram para mim: " + res.alta.join(", ") + ".");
    linhas.push("");
    linhas.push("Queria conversar sobre isso.");
    return linhas.join("\n");
  }

  /* ---------------------------------------------------------
     8 · Mostrar
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
    var pct = pontuar();
    var d = decidir(pct);
    var res = RESULTADOS[d.chave];
    vereditoAtual = res;

    document.getElementById("resTitulo").textContent = res.titulo;
    document.getElementById("resLead").textContent = res.lead;
    document.getElementById("resFrase").textContent = RODAPE.frase;

    desenharBarras(pct, d.ordem);
    encherEtiquetas(document.getElementById("listaAreas"), res.areas);
    encherLista(document.getElementById("listaAlta"), res.alta);
    encherLista(document.getElementById("listaBoa"), res.boa);
    encherLista(document.getElementById("listaAtencao"), RODAPE.atencao);

    encherLista(
      document.getElementById("listaRealizacao"),
      d.ordem.slice(0, 3).map(function (x) { return REALIZACAO[x]; })
    );
    encherEtiquetas(
      document.getElementById("listaAmbientes"),
      d.ordem.slice(0, 2).map(function (x) { return AMBIENTES[x]; })
    );

    var link = "https://wa.me/" + TELEFONE + "?text=" +
               encodeURIComponent(montarMensagem(res, pct, d.ordem));
    document.getElementById("btnWhats").href = link;
    document.getElementById("btnWhatsCedo").href = link;

    painelBloqueio.hidden = true;
    revelar(painelResultado);
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (!validar()) return;
    mostrarResultado();
  });

  /* ---------------------------------------------------------
     9 · Refazer e seguir mesmo assim
     --------------------------------------------------------- */

  document.getElementById("btnRefazer").addEventListener("click", function () {
    form.reset();
    painelResultado.hidden = true;
    painelBloqueio.hidden = true;
    form.hidden = false;
    irPara(0);
  });

  document.getElementById("btnSeguirMesmo").addEventListener("click", function () {
    painelBloqueio.hidden = true;
    form.hidden = false;
    irPara(1);
  });

  /* ---------------------------------------------------------
     10 · Abertura no topo, e a volta pela seta do navegador
     --------------------------------------------------------- */

  (function () {
    var CHAVE = "scrollY:" + location.pathname;
    var mexeu = false;
    function marcar() { mexeu = true; }
    function salvar() {
      try { sessionStorage.setItem(CHAVE, String(Math.round(window.scrollY))); } catch (e) {}
    }
    function lerSalvo() {
      try { return parseInt(sessionStorage.getItem(CHAVE) || "0", 10) || 0; } catch (e) { return 0; }
    }
    function veioDoVoltar() {
      var nav = performance.getEntriesByType("navigation")[0];
      return !!nav && nav.type === "back_forward";
    }
    function irAte(y) {
      try { window.scrollTo({ top: y, left: 0, behavior: "instant" }); }
      catch (e) { window.scrollTo(0, y); }
    }
    function posicionar() {
      if (location.hash || mexeu) return;
      irAte(veioDoVoltar() ? lerSalvo() : 0);
    }

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    var op = { passive: true, once: true };
    window.addEventListener("wheel", marcar, op);
    window.addEventListener("touchstart", marcar, op);
    window.addEventListener("keydown", marcar, { once: true });
    posicionar();
    window.addEventListener("load", posicionar);
    window.addEventListener("pageshow", function (ev) {
      if (!ev.persisted) return;
      var y = lerSalvo();
      if (y) irAte(y);
    });
    window.addEventListener("pagehide", salvar);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") salvar();
    });
  })();

  /* ---------------------------------------------------------
     11 · Arranque
     --------------------------------------------------------- */

  montar();
  passos = Array.prototype.slice.call(form.querySelectorAll(".step"));
  pintar();
})();
