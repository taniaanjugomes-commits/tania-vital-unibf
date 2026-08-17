/* =========================================================
   Tania Vital, consultora educacional UniBF
   Organizado em modulos independentes. Cada um se registra no
   arranque e, quando faz sentido, expoe pin() e unpin(), que o
   modulo de movimento reduzido chama nos dois sentidos.
   ========================================================= */
(function () {
  "use strict";

  /* =======================================================
     1. CONSTANTES
     ======================================================= */

  var WHATSAPP = "5567999021267";
  var HOLD_UP_MS = 2200;     // tempo para completar o caminho segurando
  var HOLD_DOWN_MS = 900;    // tempo para o progresso voltar ao soltar
  var STAGGER_MS = 1100;     // ate aposentar os atrasos de entrada

  /* =======================================================
     2. UTILIDADES
     ======================================================= */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

  function smoothstep(p, edge0, edge1) {
    // bordas iguais dariam divisao por zero, e em p igual a borda daria NaN,
    // que envenenaria a opacidade da primeira e da ultima faixa
    if (edge1 === edge0) return p < edge0 ? 0 : 1;
    var t = clamp((p - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  var HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (c) { return HTML_ESCAPES[c]; });
  }

  function docTop(el) { return el.getBoundingClientRect().top + window.scrollY; }

  var reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* =======================================================
     3. METRICAS DE LAYOUT
     Ler getBoundingClientRect a cada rolagem custa caro no
     celular simples, que e o aparelho do publico dela. Aqui as
     medidas sao lidas uma vez e so refeitas quando algo muda.
     ======================================================= */

  var metrics = {
    main: { top: 0, span: 1 },
    hero: { top: 0, span: 1 }
  };

  function measureLayout() {
    var main = $("#main");
    var hero = $(".hero");
    if (main) {
      metrics.main.top = docTop(main);
      metrics.main.span = Math.max(1, main.offsetHeight - window.innerHeight);
    }
    if (hero) {
      metrics.hero.top = docTop(hero);
      metrics.hero.span = Math.max(1, hero.offsetHeight - window.innerHeight);
    }
  }

  function progressThrough(box) {
    return clamp((window.scrollY - box.top) / box.span, 0, 1);
  }

  /* =======================================================
     4. ROLAGEM COMPARTILHADA
     Um unico ouvinte, para nao existirem tres lendo layout ao
     mesmo tempo. Cada modulo assina e desassina quando precisa.
     ======================================================= */

  var scrollSubs = [];
  var scrolling = false;

  function onScroll() {
    for (var i = 0; i < scrollSubs.length; i++) scrollSubs[i]();
  }
  function subscribeScroll(fn) {
    if (scrollSubs.indexOf(fn) === -1) scrollSubs.push(fn);
    if (!scrolling) {
      scrolling = true;
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }
  function unsubscribeScroll(fn) {
    var i = scrollSubs.indexOf(fn);
    if (i !== -1) scrollSubs.splice(i, 1);
  }

  /* =======================================================
     5. WHATSAPP
     Cada botao carrega a acao no data-wa e ganha a mensagem
     completa, marcada pela origem que veio no endereco. O href
     ja vem escrito no HTML, entao os botoes funcionam mesmo se
     o JS falhar: aqui eles so sao melhorados.
     ======================================================= */

  var whatsapp = (function () {
    function originPhrase() {
      var raw = new URLSearchParams(location.search).get("origem");
      if (!raw) return "Vim pela sua página e";
      var clean = raw.replace(/[^a-zA-Z0-9\- ]/g, "").slice(0, 40).toLowerCase();
      if (!clean) return "Vim pela sua página e";
      if (clean === "folheto") return "Vim pelo folheto e";
      if (clean.indexOf("folheto-") === 0) {
        return "Vim pelo folheto de " + clean.slice(8).replace(/-/g, " ") + " e";
      }
      return "Vim de " + clean.replace(/-/g, " ") + " e";
    }

    var phrase = originPhrase();

    function href(action) {
      var msg = "Olá Tania! " + phrase + " " + action + ".";
      return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
    }

    function init() {
      $$("[data-wa]").forEach(function (el) {
        el.href = href(el.getAttribute("data-wa"));
        el.target = "_blank";
        el.rel = "noopener";
      });
    }

    return { init: init, href: href };
  })();

  /* =======================================================
     6. CABECALHO
     A altura real vira --hdr, e o heroi do celular dimensiona
     por ela: assim o botao do WhatsApp nunca cai abaixo da
     dobra em aparelho nenhum.
     ======================================================= */

  var header = (function () {
    var el, lastHeight = -1, hasShadow = false;

    function measure() {
      if (!el) return;
      var h = Math.round(el.getBoundingClientRect().height);
      if (h === lastHeight) return;
      lastHeight = h;
      document.documentElement.style.setProperty("--hdr", h + "px");
    }

    function paintShadow() {
      if (!el) return;
      var want = window.scrollY > 8;
      if (want === hasShadow) return;
      hasShadow = want;
      el.style.boxShadow = want ? "0 6px 22px rgba(46,27,13,.08)" : "none";
    }

    function init() {
      el = $(".hdr");
      if (!el) return;
      measure();
      paintShadow();
      subscribeScroll(paintShadow);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    }

    return { init: init, onResize: measure };
  })();

  /* =======================================================
     7. MENU DO CELULAR
     ======================================================= */

  var menu = (function () {
    function init() {
      var burger = $(".burger"), nav = $(".mnav");
      if (!burger || !nav) return;

      burger.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });

      $$("a", nav).forEach(function (link) {
        link.addEventListener("click", function () {
          nav.classList.remove("open");
          burger.setAttribute("aria-expanded", "false");
        });
      });
    }
    return { init: init };
  })();

  /* =======================================================
     8. O CAMINHO DOURADO
     O elemento de assinatura: um traco que se desenha na
     margem conforme a pagina avanca.
     ======================================================= */

  var trail = (function () {
    var el, last = -1;

    function draw() {
      if (!el) return;
      var v = Math.round(progressThrough(metrics.main) * 200) / 200;
      if (v === last) return;
      last = v;
      el.style.setProperty("--draw", v);
    }

    function init() {
      el = $(".trail");
      if (!el) return;
      draw();
      subscribeScroll(draw);
    }

    return {
      init: init,
      onResize: function () { last = -1; draw(); },
      pin: function () { if (el) el.style.setProperty("--draw", 1); },
      unpin: function () { last = -1; draw(); }
    };
  })();

  /* =======================================================
     9. CATALOGO DE CURSOS
     Abas por categoria e uma busca que atravessa todas elas.
     ======================================================= */

  var catalog = (function () {
    var tabsWrap, panel, search, activeId, dica, jaEmpurrou = false, empurrandoAgora = false;

    function courseRow(course, category, withMeta) {
      var action = "quero saber mais sobre o curso de " + course +
                   " (" + category.label + ", " + category.duration + ")";
      return '<li class="crow">' +
               '<span class="crow__n">' + escapeHtml(course) +
                 (withMeta
                   ? '<span class="crow__meta">' + escapeHtml(category.label) +
                     " · " + escapeHtml(category.duration) + "</span>"
                   : "") +
               "</span>" +
               '<a class="crow__go" href="' + whatsapp.href(action) + '" target="_blank" rel="noopener">' +
                 'Fale comigo<svg aria-hidden="true"><use href="#i-go"/></svg>' +
               "</a>" +
             "</li>";
    }

    function emptyRow() {
      return '<li class="cempty">Nenhum curso encontrado com esse termo. Tente outra palavra ou ' +
             '<a href="' + whatsapp.href("não encontrei o curso que procuro na sua página, pode me ajudar") +
             '" target="_blank" rel="noopener">fale comigo direto</a>.</li>';
    }

    function head(title, sub, stamp) {
      return '<div class="ticket__head"><div>' +
               "<h3>" + escapeHtml(title) + "</h3>" +
               '<div class="dur">' + escapeHtml(sub) + "</div>" +
             "</div>" +
             '<div class="ticket__stamp">' + escapeHtml(stamp) + "</div></div>";
    }

    function paintTabs() {
      $$(".tab", tabsWrap).forEach(function (b) {
        b.classList.toggle("on", b.dataset.id === activeId);
      });
    }

    function paintCategory(category) {
      panel.innerHTML =
        head(category.label,
             "Duração " + category.duration + " · " + category.courses.length + " cursos",
             category.tag) +
        (category.note ? '<p class="ticket__note">' + escapeHtml(category.note) + "</p>" : "") +
        '<ul class="clist">' +
          category.courses.map(function (c) { return courseRow(c, category, false); }).join("") +
        "</ul>";
    }

    function paintSearch(query) {
      var needle = query.trim().toLowerCase();
      var hits = [];
      COURSE_CATEGORIES.forEach(function (category) {
        // a Segunda Graduacao repete o catalogo inteiro, entao ficaria duplicada
        if (category.id === "segunda-graduacao") return;
        category.courses.forEach(function (course) {
          if (course.toLowerCase().indexOf(needle) !== -1) {
            hits.push({ course: course, category: category });
          }
        });
      });

      panel.innerHTML =
        head('Resultados para "' + query + '"',
             hits.length + " curso(s) encontrado(s)", "BUSCA") +
        (hits.length
          ? '<p class="ticket__note">Esses cursos também estão disponíveis pela Segunda Graduação, para quem já tem diploma.</p>'
          : "") +
        '<ul class="clist">' +
          (hits.length
            ? hits.map(function (h) { return courseRow(h.course, h.category, true); }).join("")
            : emptyRow()) +
        "</ul>";
    }

    function categoryById(id) {
      return COURSE_CATEGORIES.filter(function (c) { return c.id === id; })[0];
    }

    /* A busca atravessa todas as categorias, entao enquanto ela esta ativa as
       abas saem da frente e o resultado sobe para logo abaixo do campo. */
    function modoBusca(ligado) {
      if (tabsWrap) tabsWrap.classList.toggle("is-off", ligado);
      if (ligado) esconderDica();
    }

    /* ---- avisos de que a tira rola ----
       74% das abas ficam fora da tela no celular, e a unica pista era 20px
       da terceira pastilha na beira. Tres camadas: desbotado na ponta que
       tem mais aba, aviso escrito e um empurraozinho na primeira vez. */

    function esconderDica() {
      // o empurrao move a tira sozinho, e sem esta trava ele apagaria o
      // proprio aviso que acabou de mostrar
      if (empurrandoAgora) return;
      if (dica && !dica.hidden) dica.classList.add("sumiu");
    }

    function pintarPontas() {
      if (!tabsWrap) return;
      var sobra = tabsWrap.scrollWidth - tabsWrap.clientWidth;
      var rola = sobra > 4;
      var x = tabsWrap.scrollLeft;
      tabsWrap.classList.toggle("tem-esq", rola && x > 4);
      tabsWrap.classList.toggle("tem-dir", rola && x < sobra - 4);
      if (dica) {
        dica.hidden = !rola;
        if (x > 24) esconderDica();
      }
    }

    function empurraoUmaVez() {
      if (!tabsWrap || jaEmpurrou) return;
      if (reducedMQ.matches) return;                       // respeita quem desliga movimento
      if (tabsWrap.scrollWidth - tabsWrap.clientWidth < 40) return;
      jaEmpurrou = true;
      empurrandoAgora = true;
      // o encaixe magnetico segura a volta no meio do caminho, entao ele sai
      // de cena durante o empurrao e o zero e cravado no fim
      tabsWrap.style.scrollSnapType = "none";
      tabsWrap.scrollTo({ left: 30, behavior: "smooth" });
      window.setTimeout(function () {
        tabsWrap.scrollTo({ left: 0, behavior: "smooth" });
        window.setTimeout(function () {
          tabsWrap.scrollLeft = 0;
          tabsWrap.style.scrollSnapType = "";
          empurrandoAgora = false;
          pintarPontas();
        }, 480);
      }, 430);
    }

    function selectCategory(category) {
      activeId = category.id;
      if (search) search.value = "";
      modoBusca(false);
      paintTabs();
      paintCategory(category);
    }

    function init() {
      tabsWrap = $("#catTabs");
      panel = $("#ticket");
      dica = $("#catDica");
      search = $("#catSearch");
      if (!tabsWrap || !panel || typeof COURSE_CATEGORIES === "undefined") return;

      activeId = COURSE_CATEGORIES[0].id;

      COURSE_CATEGORIES.forEach(function (category) {
        var b = document.createElement("button");
        b.className = "tab" + (category.id === activeId ? " on" : "");
        b.type = "button";
        b.dataset.id = category.id;
        b.innerHTML = escapeHtml(category.label) +
                      ' <span class="n">' + escapeHtml(category.duration) + "</span>";
        b.addEventListener("click", function () { selectCategory(category); });
        tabsWrap.appendChild(b);
      });

      // links de secao que ja abrem numa aba especifica
      $$("[data-tab]").forEach(function (link) {
        link.addEventListener("click", function () {
          var category = categoryById(link.getAttribute("data-tab"));
          if (category) selectCategory(category);
        });
      });

      if (search) {
        search.addEventListener("input", function () {
          var q = search.value;
          if (q.trim() === "") {
            modoBusca(false);
            paintTabs();
            paintCategory(categoryById(activeId));
          } else {
            modoBusca(true);
            paintSearch(q);
          }
        });
      }

      tabsWrap.addEventListener("scroll", pintarPontas, { passive: true });
      pintarPontas();

      // o empurrao so acontece quando a tira chega na tela, nao no carregamento
      if (window.IntersectionObserver) {
        var olho = new IntersectionObserver(function (entradas) {
          entradas.forEach(function (e) {
            if (!e.isIntersecting) return;
            empurraoUmaVez();
            olho.disconnect();
          });
        }, { threshold: 0.6 });
        olho.observe(tabsWrap);
      }

      paintCategory(COURSE_CATEGORIES[0]);
    }

    return { init: init, onResize: pintarPontas };
  })();

  /* =======================================================
     10. PERGUNTAS FREQUENTES
     ======================================================= */

  var faq = (function () {
    function openHeight(answer) {
      answer.style.maxHeight = "none";
      var h = answer.scrollHeight;
      answer.style.maxHeight = h + "px";
    }

    function close(item) {
      item.classList.remove("open");
      $(".fitem__a", item).style.maxHeight = null;
      $(".fitem__q", item).setAttribute("aria-expanded", "false");
    }

    function init() {
      $$(".fitem").forEach(function (item) {
        var button = $(".fitem__q", item);
        var answer = $(".fitem__a", item);

        button.addEventListener("click", function () {
          var wasOpen = item.classList.contains("open");
          $$(".fitem.open").forEach(function (other) {
            if (other !== item) close(other);
          });
          if (wasOpen) {
            close(item);
          } else {
            item.classList.add("open");
            button.setAttribute("aria-expanded", "true");
            openHeight(answer);
          }
        });
      });
    }

    // girar o aparelho remede a resposta aberta, que senao fica cortada
    function onResize() {
      var item = $(".fitem.open");
      if (item) openHeight($(".fitem__a", item));
    }

    return { init: init, onResize: onResize };
  })();

  /* =======================================================
     11. O MOMENTO INTERATIVO
     Segure o botao e percorra os quatro passos ate o diploma.
     ======================================================= */

  var pathHold = (function () {
    var button, box, label, steps = [];
    var progress = 0, holding = false, raf = null, lastFrame = 0;
    var litCount = -1, finished = false;
    var THRESHOLDS = [0.16, 0.40, 0.64, 0.90];

    function markFinished() {
      finished = true;
      box.classList.add("done");
      label.textContent = "Feito";
    }

    function paint() {
      button.style.setProperty("--hp", progress.toFixed(3));

      var lit = 0;
      for (var i = 0; i < THRESHOLDS.length; i++) {
        if (progress >= THRESHOLDS[i]) lit = i + 1;
      }
      if (lit !== litCount) {
        litCount = lit;
        steps.forEach(function (step, i) { step.classList.toggle("lit", i < lit); });
      }

      if (progress >= 0.999 && !finished) markFinished();
    }

    function tick(now) {
      var dt = Math.min(100, now - (lastFrame || now));
      lastFrame = now;
      var speed = holding ? 1 / HOLD_UP_MS : -1 / HOLD_DOWN_MS;
      progress = clamp(progress + dt * speed, 0, 1);
      paint();

      var running = holding ? progress < 1 : progress > 0;
      if (running) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
        lastFrame = 0;
      }
    }

    function start(e) {
      if (finished) return;
      if (e && e.cancelable) e.preventDefault();
      holding = true;
      if (raf === null) raf = requestAnimationFrame(tick);
    }

    function stop() {
      if (finished) return;          // concluido nao volta atras
      holding = false;
      if (raf === null && progress > 0) raf = requestAnimationFrame(tick);
    }

    function init() {
      button = $("#holdBtn");
      box = $("#hold");
      if (!button || !box) return;
      label = $("i", button);
      steps = $$(".pstep");

      button.addEventListener("pointerdown", start);
      button.addEventListener("pointerleave", stop);
      window.addEventListener("pointerup", stop);
      window.addEventListener("pointercancel", stop);
      button.addEventListener("keydown", function (e) {
        if (e.key === " " || e.key === "Enter") start(e);
      });
      button.addEventListener("keyup", stop);
    }

    return {
      init: init,
      pin: function () {
        if (!button) return;
        holding = false;
        if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
        progress = 1;
        litCount = -1;
        paint();        // acende as quatro etapas
        markFinished(); // e so entao tranca, para o rotulo e a classe entrarem
      },
      unpin: function () {
        if (!button) return;
        finished = false;
        progress = 0;
        litCount = -1;
        box.classList.remove("done");
        label.textContent = "Segure";
        paint();
      }
    };
  })();

  /* =======================================================
     12. ENTRADAS DE SECAO
     ======================================================= */

  var reveals = (function () {
    var observer = null;

    function showAll() {
      $$(".rv, .stg").forEach(function (el) { el.classList.add("in", "done"); });
    }

    function init() {
      var items = $$(".rv, .stg");
      if (!items.length) return;
      if (!("IntersectionObserver" in window)) { showAll(); return; }

      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          el.classList.add("in");
          observer.unobserve(el);
          // aposenta os atrasos escalonados, senao todo hover depois fica lento
          if (el.classList.contains("stg")) {
            setTimeout(function () { el.classList.add("done"); }, STAGGER_MS);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

      items.forEach(function (el) { observer.observe(el); });
    }

    // nao existe unpin: reesconder conteudo ja revelado seria pior
    return { init: init, pin: showAll };
  })();

  /* =======================================================
     13. BOTAO FLUTUANTE
     Recolhe quando outro botao principal ja esta na tela, para
     nao existirem dois botoes verdes iguais competindo.
     ======================================================= */

  var floatingButton = (function () {
    function init() {
      var button = $(".wafloat");
      var anchors = $$(".hero-static__cta, .band--settle .btn, .final .btn");
      if (!button || !anchors.length || !("IntersectionObserver" in window)) return;

      var visible = new WeakMap();
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { visible.set(e.target, e.isIntersecting); });
        var anyVisible = anchors.some(function (el) { return visible.get(el) === true; });
        button.classList.toggle("tucked", anyVisible);
      }, { threshold: 0.35 });

      anchors.forEach(function (el) { observer.observe(el); });
    }
    return { init: init };
  })();
  /* =======================================================
     15. MOVIMENTO REDUZIDO, AO VIVO E NOS DOIS SENTIDOS
     ======================================================= */

  var motion = (function () {
    var modules = [trail, pathHold, reveals];

    function pin() {
      modules.forEach(function (m) { if (m.pin) m.pin(); });
    }
    function unpin() {
      modules.forEach(function (m) { if (m.unpin) m.unpin(); });
    }

    function init() {
      reducedMQ.addEventListener("change", function (e) {
        if (e.matches) pin();
        else unpin();
      });
      if (reducedMQ.matches) pin();
    }

    return { init: init };
  })();

  /* =======================================================
     16. ABERTURA NO TOPO

     O navegador guarda onde a pessoa parou e devolve ela no mesmo
     ponto na visita seguinte, o que fazia a pagina abrir no meio.
     Aqui o controle passa a ser nosso: com ancora na URL o salto
     continua acontecendo, sem ancora a pagina comeca do inicio.
     ======================================================= */

  var abertura = (function () {
    var CHAVE = "scrollY:" + location.pathname;
    var mexeu = false;

    function marcarQueMexeu() { mexeu = true; }

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

    function irPara(y) {
      // "instant" evita que o scroll-behavior:smooth do CSS anime o salto
      try {
        window.scrollTo({ top: y, left: 0, behavior: "instant" });
      } catch (e) {
        window.scrollTo(0, y);
      }
    }

    function posicionar() {
      if (location.hash || mexeu) return;
      irPara(veioDoVoltar() ? lerSalvo() : 0);
    }

    function init() {
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";

      // se a pessoa ja comecou a rolar durante o carregamento, nao atrapalhamos
      var opcoes = { passive: true, once: true };
      window.addEventListener("wheel", marcarQueMexeu, opcoes);
      window.addEventListener("touchstart", marcarQueMexeu, opcoes);
      window.addEventListener("keydown", marcarQueMexeu, { once: true });

      posicionar();
      // de novo depois do load: so com as imagens no lugar a pagina tem a
      // altura final, e antes disso o destino do voltar nem existe
      window.addEventListener("load", posicionar);

      // quando o navegador guarda a pagina inteira em memoria, nada disso roda
      // de novo, entao a volta e tratada aqui
      window.addEventListener("pageshow", function (ev) {
        if (!ev.persisted) return;
        var y = lerSalvo();
        if (y) irPara(y);
      });

      // pagehide cobre o celular, onde beforeunload muitas vezes nao dispara
      window.addEventListener("pagehide", salvar);
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") salvar();
      });
    }

    return { init: init };
  })();

  /* =======================================================
     17. ARRANQUE
     ======================================================= */

  function onResize() {
    measureLayout();
    catalog.onResize();
    header.onResize();
    faq.onResize();
    trail.onResize();
  }

  function start() {
    abertura.init();
    whatsapp.init();
    header.init();
    menu.init();
    measureLayout();
    trail.init();
    catalog.init();
    faq.init();
    pathHold.init();
    reveals.init();
    floatingButton.init();
    motion.init();

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    window.addEventListener("load", onResize);
    document.addEventListener("visibilitychange", function () {
      document.body.classList.toggle("paused", document.hidden);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
