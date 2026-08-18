/* =========================================================
   Pedagogia combina com voce? · Tania Vital
   O teste mostra onde dentro da Pedagogia a pessoa se encaixa.
   Conteudo e pontuacao vivem em pedagogia-data.js.
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1 · Abertura no topo
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
      var n = performance.getEntriesByType("navigation")[0];
      return !!n && n.type === "back_forward";
    }
    function irPara(y) {
      try { window.scrollTo({ top: y, left: 0, behavior: "instant" }); }
      catch (e) { window.scrollTo(0, y); }
    }
    function posicionar() {
      if (location.hash || mexeu) return;
      irPara(veioDoVoltar() ? lerSalvo() : 0);
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
      var y = lerSalvo(); if (y) irPara(y);
    });
    window.addEventListener("pagehide", salvar);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") salvar();
    });
  })();

  var form = document.getElementById("formTeste");
  if (!form || typeof PERGUNTAS === "undefined") return;

  /* ---------------------------------------------------------
     2 · Constantes e utilidades
     --------------------------------------------------------- */

  var TELEFONE = "5567999021267";
  var TODAS = PERGUNTAS.concat(ORGANIZACAO);

  var ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  function esc(v) { return String(v).replace(/[&<>"']/g, function (c) { return ESCAPES[c]; }); }
  function el(id) { return document.getElementById(id); }

  function origem() {
    var raw = new URLSearchParams(location.search).get("origem");
    if (!raw) return "Vim pela sua página e";
    var limpo = raw.replace(/[^a-zA-Z0-9\- ]/g, "").slice(0, 40).toLowerCase();
    if (!limpo) return "Vim pela sua página e";
    if (limpo.indexOf("folheto") === 0) return "Vim pelo folheto e";
    return "Vim do " + limpo.replace(/-/g, " ") + " e";
  }

  /* ---------------------------------------------------------
     3 · Monta as telas
     --------------------------------------------------------- */

  var caixa = el("passos");
  var atual = 0;

  TODAS.forEach(function (q, i) {
    var fs = document.createElement("fieldset");
    fs.className = "step" + (i === 0 ? " is-active" : "");
    var html = "<legend>" + esc(q.texto) + "</legend>";
    if (q.ajuda) html += '<p class="help">' + esc(q.ajuda) + "</p>";
    html += '<div class="opts">';
    q.opcoes.forEach(function (o, j) {
      html += '<label><input type="radio" name="' + q.id + '" value="' + j + '">' +
              "<span>" + esc(o.t) + "</span></label>";
    });
    fs.innerHTML = html + "</div>";
    caixa.appendChild(fs);
  });

  var passos = Array.prototype.slice.call(caixa.querySelectorAll(".step"));
  var btnSeguir = el("btnSeguir"), btnVoltar = el("btnVoltar"), btnVer = el("btnVer");
  var erro = el("erro"), rotulo = el("stepLabel"), barra = el("barFill");
  var painel = el("resultado"), bloqueio = el("bloqueio");

  function marcada(nome) { return form.querySelector('[name="' + nome + '"]:checked'); }
  function indice(nome) { var m = marcada(nome); return m ? +m.value : -1; }

  function pintar() {
    passos.forEach(function (p, i) { p.classList.toggle("is-active", i === atual); });
    rotulo.textContent = "Pergunta " + (atual + 1) + " de " + passos.length;
    barra.style.width = (((atual + 1) / passos.length) * 100) + "%";
    btnVoltar.hidden = atual === 0;
    btnSeguir.hidden = atual === passos.length - 1;
    btnVer.hidden = atual !== passos.length - 1;
    erro.textContent = "";
  }

  function irPara(i) {
    atual = i;
    pintar();
    window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  }

  function validar() {
    if (marcada(TODAS[atual].id)) return true;
    erro.textContent = "Escolha a opção que mais parece com você para continuar.";
    return false;
  }

  btnSeguir.addEventListener("click", function () {
    if (!validar()) return;
    if (atual === 0 && indice("em") === 2) { mostrarBloqueio(); return; }
    irPara(atual + 1);
  });
  btnVoltar.addEventListener("click", function () { if (atual > 0) irPara(atual - 1); });

  form.addEventListener("change", function (ev) {
    if (ev.target.type !== "radio") return;
    erro.textContent = "";
    if (atual === passos.length - 1) return;
    window.setTimeout(function () {
      if (!marcada(TODAS[atual].id)) return;
      if (atual === 0 && indice("em") === 2) { mostrarBloqueio(); return; }
      irPara(atual + 1);
    }, 240);
  });

  /* ---------------------------------------------------------
     4 · Apuracao
     Uma alternativa, um ponto para o caminho dela. Empate no topo
     nao vira problema: o segundo colocado aparece no resultado.
     --------------------------------------------------------- */

  var vencedor = "SALA", segundo = null, semCaminho = false, espalhado = false;

  /* So contam as perguntas que apontam caminho: o filtro do Ensino Medio
     e a pergunta de fecho ficam de fora. */
  function contaCaminho(q) { return !q.filtro && !q.fecho; }

  function declarouSaida() {
    var q = PERGUNTAS.filter(function (x) { return x.fecho; })[0];
    if (!q) return false;
    var i = indice(q.id);
    return i >= 0 && !!q.opcoes[i].saida;
  }

  function apurar() {
    var pontos = {};
    Object.keys(CAMINHOS).forEach(function (k) { pontos[k] = 0; });
    PERGUNTAS.filter(contaCaminho).forEach(function (q) {
      var i = indice(q.id);
      if (i >= 0) pontos[q.opcoes[i].c] += 1;
    });
    var ordem = Object.keys(pontos).sort(function (a, b) { return pontos[b] - pontos[a]; });
    vencedor = ordem[0];
    segundo = pontos[ordem[1]] > 0 && pontos[ordem[1]] >= pontos[ordem[0]] - 1 ? ordem[1] : null;

    /* So a pergunta declarada tira a pessoa do caminho. Topo baixo nao
       significa desinteresse: pode ser interesse em varios. */
    semCaminho = declarouSaida();
    espalhado = !semCaminho && pontos[vencedor] <= LIMITE_ESPALHADO;
    return pontos;
  }

  /* ---------------------------------------------------------
     5 · Mensagem do WhatsApp
     --------------------------------------------------------- */

  function mensagem() {
    var linhas = [
      "Olá Tania! " + origem() + " fiz o teste de Pedagogia.",
      ""
    ];
    if (semCaminho) {
      linhas.push("Resultado: nenhum dos caminhos da Pedagogia é o meu.");
    } else {
      linhas.push("Meu caminho: " + RESULTADOS[vencedor].titulo);
      if (segundo) linhas.push("Também apareceu: " + CAMINHOS[segundo]);
    }
    linhas.push("");

    var nome = el("campoNome").value.trim();
    if (nome) { linhas.push("Meu nome: " + nome); linhas.push(""); }

    linhas.push("Sobre o meu momento:");
    ORGANIZACAO.forEach(function (q) {
      var i = indice(q.id);
      if (i >= 0) linhas.push("• " + q.texto.replace(/\.$/, "") + ": " + q.opcoes[i].t);
    });
    linhas.push("");
    linhas.push("Queria conversar sobre isso.");
    return linhas.join("\n");
  }

  function atualizarWhats() {
    var href = "https://wa.me/" + TELEFONE + "?text=" + encodeURIComponent(mensagem());
    el("btnWhats").href = href;
    el("btnWhatsCedo").href = href;
  }
  el("campoNome").addEventListener("input", atualizarWhats);

  /* ---------------------------------------------------------
     6 · Resultado
     --------------------------------------------------------- */

  function lista(alvo, itens) {
    alvo.textContent = "";
    itens.forEach(function (t) {
      var li = document.createElement("li");
      li.textContent = t;
      alvo.appendChild(li);
    });
  }

  function etiquetas(alvo, itens) {
    alvo.textContent = "";
    itens.forEach(function (t) {
      var s = document.createElement("span");
      s.className = "tag";
      s.textContent = t;
      alvo.appendChild(s);
    });
  }

  function revelar(p) {
    form.hidden = true;
    p.hidden = false;
    p.focus({ preventScroll: true });
    window.scrollTo({ top: p.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  }

  function mostrarBloqueio() {
    painel.hidden = true;
    revelar(bloqueio);
  }

  function mostrarSemCaminho() {
    el("scTitulo").textContent = SEM_CAMINHO.titulo;
    el("scLead").textContent = SEM_CAMINHO.lead;
    lista(el("scPontos"), SEM_CAMINHO.pontos);
    var b = el("scBotao");
    b.textContent = SEM_CAMINHO.botao;
    b.href = SEM_CAMINHO.destino;
    el("scZap").textContent = SEM_CAMINHO.zap;
    atualizarWhats();
    painel.hidden = true;
    bloqueio.hidden = true;
    revelar(el("semCaminho"));
  }

  function mostrarResultado() {
    apurar();
    if (semCaminho) { mostrarSemCaminho(); return; }
    var r = RESULTADOS[vencedor];

    el("resTitulo").textContent = r.titulo;
    el("resLead").textContent = r.lead;
    el("resDia").textContent = r.dia;
    el("resBase").textContent = r.base;
    etiquetas(el("listaOnde"), r.onde);

    var tambem = el("resTambem");
    if (espalhado) {
      tambem.hidden = false;
      el("resTambemTxt").textContent = AVISO_ESPALHADO;
    } else if (segundo) {
      tambem.hidden = false;
      el("resTambemTxt").textContent =
        "Você também se identificou bastante com " + CAMINHOS[segundo] +
        ". Os dois caminhos saem do mesmo curso, então não precisa escolher agora.";
    } else {
      tambem.hidden = true;
    }

    el("resComece").textContent = r.comece;
    var ul = el("listaSome");
    ul.textContent = "";
    r.some.forEach(function (s) {
      var li = document.createElement("li");
      var b = document.createElement("b");
      b.textContent = s.curso;
      li.appendChild(b);
      li.appendChild(document.createTextNode(", " + s.por + "."));
      ul.appendChild(li);
    });

    el("dinTitulo").textContent = DINHEIRO.titulo;
    el("dinBase").textContent = DINHEIRO.base;
    el("dinNota").textContent = DINHEIRO.nota;
    el("resFrase").textContent = FECHAMENTO.frase;
    el("tituloFala").textContent = FECHAMENTO.cta;

    atualizarWhats();
    bloqueio.hidden = true;
    revelar(painel);
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (!validar()) return;
    mostrarResultado();
  });

  /* ---------------------------------------------------------
     7 · Refazer e arranque
     --------------------------------------------------------- */

  function refazer() {
    form.reset();
    painel.hidden = true;
    bloqueio.hidden = true;
    el("semCaminho").hidden = true;
    form.hidden = false;
    irPara(0);
  }
  el("btnRefazer").addEventListener("click", refazer);
  el("btnRefazer2").addEventListener("click", refazer);
  el("btnRefazer3").addEventListener("click", refazer);

  form.hidden = false;
  pintar();
})();
